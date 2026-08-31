(function (root, factory) {
  const api = factory(root.ChefNovaIngredientData || (typeof require === "function" ? require("./ingredient-data-shared.js") : null), root.ChefNovaCostEngine || (typeof require === "function" ? require("./cost-calculation-engine.js") : null));
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaPantryFirst = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function (ingredientData, costEngine) {
  "use strict";

  const PANTRY_PLANNING_VERSION = 1;
  const PANTRY_QUANTITY_STATUSES = Object.freeze({ KNOWN: "known", UNKNOWN: "unknown" });
  const FRESHNESS_DATE_TYPES = Object.freeze({ EXPIRES_ON: "expires-on", BEST_BEFORE: "best-before", USE_FIRST: "use-first", UNKNOWN: "unknown" });
  const USE_SOON_STATUSES = Object.freeze({ EXPLICIT_USE_FIRST: "explicit-use-first", DURING_PLAN: "during-plan", AFTER_PLAN: "after-plan", NO_DATE: "no-date", REVIEW_REQUIRED: "review-required", EXCLUDED: "excluded" });
  const ALLOCATION_STATUSES = Object.freeze({ RESOLVED: "resolved", PARTIAL: "partial", UNCOVERED: "uncovered", QUANTITY_UNKNOWN: "quantity-unknown", INCOMPATIBLE_UNIT: "incompatible-unit", FORM_INCOMPATIBLE: "form-incompatible", AMBIGUOUS: "ambiguous", UNRESOLVED: "unresolved" });
  const EPSILON = 1e-9;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) ? String(value) : "";
  }

  function toDate(value) {
    return normalizeDate(value) ? new Date(`${value}T00:00:00`) : null;
  }

  function compareDates(a, b) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return a.localeCompare(b);
  }

  function normalizeUnit(unit) {
    return typeof ingredientData?.normalizeUnit === "function" ? ingredientData.normalizeUnit(unit) : String(unit || "").toLowerCase().trim();
  }

  function normalizeComparable(quantity, unit) {
    return typeof costEngine?.normalizeComparableQuantity === "function"
      ? costEngine.normalizeComparableQuantity(quantity, unit)
      : { valid: false, status: ALLOCATION_STATUSES.INCOMPATIBLE_UNIT, message: "Chef Nova cannot safely compare this unit." };
  }

  function roundQuantity(value) {
    return typeof costEngine?.roundQuantity === "function" ? costEngine.roundQuantity(value) : Math.round((Number(value) + EPSILON) * 1000000) / 1000000;
  }

  function deriveUseSoonStatus(item, planStartDate, planEndDate) {
    if (item.excludedFromPlanning || item.usable === false) return USE_SOON_STATUSES.EXCLUDED;
    if (item.freshnessDateType === FRESHNESS_DATE_TYPES.USE_FIRST || item.useFirst === true) return USE_SOON_STATUSES.EXPLICIT_USE_FIRST;
    const freshnessDate = normalizeDate(item.freshnessDate || item.expirationDate);
    if (!freshnessDate) return USE_SOON_STATUSES.NO_DATE;
    const start = normalizeDate(planStartDate);
    const end = normalizeDate(planEndDate || planStartDate);
    if (item.freshnessDateType === FRESHNESS_DATE_TYPES.UNKNOWN) return USE_SOON_STATUSES.REVIEW_REQUIRED;
    if (start && freshnessDate < start && item.freshnessDateType === FRESHNESS_DATE_TYPES.EXPIRES_ON) return USE_SOON_STATUSES.REVIEW_REQUIRED;
    if (end && freshnessDate <= end) return USE_SOON_STATUSES.DURING_PLAN;
    return USE_SOON_STATUSES.AFTER_PLAN;
  }

  function resolvePantryIngredient(item, options = {}) {
    if (item?.ingredientId) return { matchStatus: "resolved", ingredientId: item.ingredientId };
    const resolution = options.ingredientResolver?.(item?.name || item?.originalLabel || "") || {};
    if (resolution.status === "resolved") return { matchStatus: "resolved", ingredientId: resolution.ingredientId };
    if (resolution.status === "ambiguous") return { matchStatus: "ambiguous", candidates: resolution.candidates || [] };
    return { matchStatus: "unresolved", candidates: [] };
  }

  function normalizePantryItem(item, options = {}) {
    const source = item && typeof item === "object" ? item : { name: item };
    const resolved = resolvePantryIngredient(source, options);
    const quantity = Number(source.quantity);
    const unit = normalizeUnit(source.unit || "each");
    const quantityStatus = Number.isFinite(quantity) && quantity > 0 ? PANTRY_QUANTITY_STATUSES.KNOWN : PANTRY_QUANTITY_STATUSES.UNKNOWN;
    const normalized = quantityStatus === PANTRY_QUANTITY_STATUSES.KNOWN ? normalizeComparable(quantity, unit) : null;
    const freshnessDate = normalizeDate(source.freshnessDate || source.expirationDate);
    const freshnessDateType = Object.values(FRESHNESS_DATE_TYPES).includes(source.freshnessDateType) ? source.freshnessDateType : (freshnessDate ? FRESHNESS_DATE_TYPES.EXPIRES_ON : FRESHNESS_DATE_TYPES.UNKNOWN);
    return {
      pantryItemId: source.id || `pantry-${options.index ?? 0}`,
      ingredientId: resolved.ingredientId || null,
      matchStatus: resolved.matchStatus,
      candidates: resolved.candidates || [],
      originalLabel: source.originalLabel || source.name || "Pantry item",
      form: source.form || null,
      originalQuantity: quantityStatus === PANTRY_QUANTITY_STATUSES.KNOWN ? quantity : null,
      remainingQuantity: normalized?.valid ? normalized.quantity : null,
      originalUnit: unit,
      unit: normalized?.unit || unit,
      dimension: normalized?.dimension || null,
      quantityStatus,
      opened: source.opened === true,
      openedAt: normalizeDate(source.openedAt),
      freshnessDate,
      freshnessDateType,
      useSoonStatus: deriveUseSoonStatus({ ...source, freshnessDate, freshnessDateType }, options.planStartDate, options.planEndDate),
      location: source.location || "",
      allocations: []
    };
  }

  function pantryRevision(pantryItems = []) {
    return JSON.stringify((Array.isArray(pantryItems) ? pantryItems : []).map((item) => ({
      id: item?.id || "",
      name: item?.name || "",
      ingredientId: item?.ingredientId || "",
      form: item?.form || "",
      quantity: item?.quantity ?? null,
      unit: item?.unit || "",
      opened: item?.opened === true,
      freshnessDate: item?.freshnessDate || item?.expirationDate || "",
      freshnessDateType: item?.freshnessDateType || ""
    })).sort((a, b) => String(a.id).localeCompare(String(b.id))));
  }

  function indexInventory(lots) {
    const byIngredientId = new Map();
    const byIngredientAndForm = new Map();
    lots.forEach((lot) => {
      if (!lot.ingredientId || lot.matchStatus !== "resolved") return;
      if (!byIngredientId.has(lot.ingredientId)) byIngredientId.set(lot.ingredientId, []);
      byIngredientId.get(lot.ingredientId).push(lot);
      const key = `${lot.ingredientId}::${lot.form || "default"}`;
      if (!byIngredientAndForm.has(key)) byIngredientAndForm.set(key, []);
      byIngredientAndForm.get(key).push(lot);
    });
    return { byIngredientId, byIngredientAndForm };
  }

  function createPlanningInventory({ pantryItems = [], planStartDate, planEndDate, ingredientResolver } = {}) {
    const lots = (Array.isArray(pantryItems) ? pantryItems : []).map((item, index) => normalizePantryItem(item, { ingredientResolver, planStartDate, planEndDate, index }));
    return { pantryPlanningVersion: PANTRY_PLANNING_VERSION, sourcePantryRevision: pantryRevision(pantryItems), createdAt: new Date().toISOString(), lots, indexes: indexInventory(lots) };
  }

  function cloneInventory(inventory) {
    return createInventoryFromLots(clone(inventory?.lots || []), inventory);
  }

  function createInventoryFromLots(lots, source = {}) {
    return { pantryPlanningVersion: source.pantryPlanningVersion || PANTRY_PLANNING_VERSION, sourcePantryRevision: source.sourcePantryRevision || "", createdAt: source.createdAt || new Date().toISOString(), lots, indexes: indexInventory(lots) };
  }

  function formsCompatible(recipeForm, pantryForm) {
    if (!recipeForm || !pantryForm) return true;
    return recipeForm === pantryForm;
  }

  function lotPriority(lot) {
    const statusRank = {
      [USE_SOON_STATUSES.EXPLICIT_USE_FIRST]: 0,
      [USE_SOON_STATUSES.DURING_PLAN]: 1,
      [USE_SOON_STATUSES.AFTER_PLAN]: 2,
      [USE_SOON_STATUSES.NO_DATE]: 4,
      [USE_SOON_STATUSES.REVIEW_REQUIRED]: 5,
      [USE_SOON_STATUSES.EXCLUDED]: 99
    };
    return [statusRank[lot.useSoonStatus] ?? 50, lot.freshnessDate || "9999-12-31", lot.opened ? 0 : 1, lot.pantryItemId];
  }

  function compareLots(a, b) {
    const ap = lotPriority(a);
    const bp = lotPriority(b);
    for (let index = 0; index < ap.length; index += 1) {
      if (ap[index] < bp[index]) return -1;
      if (ap[index] > bp[index]) return 1;
    }
    return 0;
  }

  function findCompatiblePantryLots(requirement, inventory) {
    const lots = (inventory?.indexes?.byIngredientId?.get(requirement.ingredientId) || []).filter((lot) => lot.useSoonStatus !== USE_SOON_STATUSES.EXCLUDED);
    return lots.sort(compareLots);
  }

  function buildRequirement(recipe, ingredient, selectedServings = recipe?.servings || 1, mealId = "") {
    const baseServings = Number(recipe?.servings) || 1;
    const servingScale = Number(selectedServings) > 0 ? Number(selectedServings) / baseServings : 1;
    const scaled = typeof costEngine?.scaleIngredientQuantityWithPracticalRules === "function"
      ? costEngine.scaleIngredientQuantityWithPracticalRules({ recipe, ingredient, selectedServings, calculationDate: new Date().toISOString().slice(0, 10) })
      : typeof costEngine?.scaleIngredientQuantity === "function"
        ? costEngine.scaleIngredientQuantity(ingredient, servingScale)
        : { quantity: Number(ingredient.quantity) * servingScale };
    const quantity = "practicalRecipeQuantity" in scaled
      ? (ingredient.measurementStatus === "range" && Number.isFinite(Number(scaled.practicalRecipeQuantityMax)) ? Number(scaled.practicalRecipeQuantityMax) : Number(scaled.practicalRecipeQuantity))
      : (ingredient.measurementStatus === "range" && Number.isFinite(Number(scaled.quantityMax)) ? Number(scaled.quantityMax) : Number(scaled.quantity));
    const normalized = normalizeComparable(quantity, ingredient.unit);
    return { recipeId: recipe?.id || "", mealId, ingredient, ingredientId: ingredient.ingredientId || null, form: ingredient.form || null, displayName: ingredient.displayName || ingredient.displayText || "Ingredient", requiredQuantity: quantity, requiredUnit: ingredient.unit || null, normalized };
  }

  function simulateRequirementAllocation({ requirement, planningInventory }) {
    const next = cloneInventory(planningInventory);
    const warnings = [];
    if (!requirement?.ingredientId) return { ...requirement, pantryAllocations: [], pantryQuantityApplied: 0, missingQuantity: requirement?.normalized?.quantity || 0, missingUnit: requirement?.normalized?.unit || requirement?.requiredUnit || "", fullyCovered: false, partiallyCovered: false, allocationStatus: ALLOCATION_STATUSES.UNRESOLVED, nextPlanningInventory: next, warnings: ["This ingredient is not linked to the ingredient catalogue."] };
    if (!requirement.normalized?.valid) return { ...requirement, pantryAllocations: [], pantryQuantityApplied: 0, missingQuantity: 0, missingUnit: requirement.requiredUnit || "", fullyCovered: false, partiallyCovered: false, allocationStatus: ALLOCATION_STATUSES.INCOMPATIBLE_UNIT, nextPlanningInventory: next, warnings: [requirement.normalized?.message || "Chef Nova cannot safely compare this quantity."] };
    const compatible = findCompatiblePantryLots(requirement, next);
    let remaining = requirement.normalized.quantity;
    const allocations = [];
    let formIssue = false;
    let unknownQuantityIssue = false;
    let unitIssue = false;
    compatible.forEach((lot) => {
      if (remaining <= EPSILON) return;
      if (!formsCompatible(requirement.form, lot.form)) {
        formIssue = true;
        return;
      }
      if (lot.quantityStatus !== PANTRY_QUANTITY_STATUSES.KNOWN || !Number.isFinite(lot.remainingQuantity)) {
        unknownQuantityIssue = true;
        return;
      }
      if (lot.dimension !== requirement.normalized.dimension) {
        unitIssue = true;
        return;
      }
      const applied = Math.min(remaining, lot.remainingQuantity);
      if (applied <= EPSILON) return;
      lot.remainingQuantity = roundQuantity(lot.remainingQuantity - applied);
      const allocation = { pantryItemId: lot.pantryItemId, originalLabel: lot.originalLabel, ingredientId: lot.ingredientId, form: lot.form, quantity: roundQuantity(applied), unit: lot.unit, opened: lot.opened, useSoonStatus: lot.useSoonStatus, freshnessDate: lot.freshnessDate, estimatedRemainingQuantity: lot.remainingQuantity };
      lot.allocations.push({ recipeId: requirement.recipeId, mealId: requirement.mealId, quantity: allocation.quantity, unit: allocation.unit });
      allocations.push(allocation);
      remaining = roundQuantity(remaining - applied);
    });
    if (unknownQuantityIssue) warnings.push(`${requirement.displayName} is listed in the Pantry, but its quantity is unknown.`);
    if (formIssue) warnings.push(`${requirement.displayName} has a Pantry item with a different form.`);
    if (unitIssue) warnings.push(`${requirement.displayName} has a Pantry item with a unit Chef Nova cannot safely compare.`);
    const applied = roundQuantity(requirement.normalized.quantity - Math.max(0, remaining));
    const missing = Math.max(0, roundQuantity(remaining));
    const status = missing <= EPSILON ? ALLOCATION_STATUSES.RESOLVED : applied > 0 ? ALLOCATION_STATUSES.PARTIAL : formIssue ? ALLOCATION_STATUSES.FORM_INCOMPATIBLE : unknownQuantityIssue ? ALLOCATION_STATUSES.QUANTITY_UNKNOWN : unitIssue ? ALLOCATION_STATUSES.INCOMPATIBLE_UNIT : ALLOCATION_STATUSES.UNCOVERED;
    return { ...requirement, pantryAllocations: allocations, pantryQuantityApplied: applied, missingQuantity: missing, missingUnit: requirement.normalized.unit, fullyCovered: missing <= EPSILON, partiallyCovered: applied > EPSILON && missing > EPSILON, allocationStatus: status, nextPlanningInventory: next, warnings };
  }

  function simulateRecipeAgainstInventory({ recipe, selectedServings = recipe?.servings || 1, planningInventory }) {
    let inventory = cloneInventory(planningInventory);
    const ingredients = Array.isArray(recipe?.structuredIngredients) ? recipe.structuredIngredients : [];
    const requirementAllocations = [];
    ingredients.filter((ingredient) => ingredient.optional !== true).forEach((ingredient, index) => {
      const requirement = buildRequirement(recipe, ingredient, selectedServings, `${recipe?.id || "recipe"}-${index}`);
      const result = simulateRequirementAllocation({ requirement, planningInventory: inventory });
      requirementAllocations.push(result);
      inventory = result.nextPlanningInventory;
    });
    return summarizeRecipeAllocation(recipe?.id || "", requirementAllocations, inventory);
  }

  function summarizeRecipeAllocation(recipeId, requirementAllocations, candidateNextInventory) {
    const measurable = requirementAllocations.filter((item) => item.normalized?.valid);
    const ratios = measurable.map((item) => item.normalized.quantity > 0 ? Math.min(1, item.pantryQuantityApplied / item.normalized.quantity) : 0);
    const usedGroups = new Set();
    const usedLots = new Set();
    let openedLotCountUsed = 0;
    let useSoonLotCountUsed = 0;
    requirementAllocations.forEach((item) => {
      if (item.pantryQuantityApplied > EPSILON) usedGroups.add(`${item.ingredientId}::${item.form || "default"}`);
      item.pantryAllocations.forEach((allocation) => {
        usedLots.add(allocation.pantryItemId);
        if (allocation.opened) openedLotCountUsed += 1;
        if ([USE_SOON_STATUSES.EXPLICIT_USE_FIRST, USE_SOON_STATUSES.DURING_PLAN].includes(allocation.useSoonStatus)) useSoonLotCountUsed += 1;
      });
    });
    return {
      recipeId,
      requirementAllocations,
      pantryIngredientGroupCountUsed: usedGroups.size,
      pantryLotCountUsed: usedLots.size,
      fullyCoveredRequirementCount: requirementAllocations.filter((item) => item.fullyCovered).length,
      partiallyCoveredRequirementCount: requirementAllocations.filter((item) => item.partiallyCovered).length,
      uncoveredRequirementCount: requirementAllocations.filter((item) => !item.fullyCovered && !item.partiallyCovered).length,
      openedLotCountUsed,
      useSoonLotCountUsed,
      pantryCoverageRatio: ratios.length ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length : 0,
      newPurchaseGroupCount: requirementAllocations.filter((item) => item.missingQuantity > EPSILON).length,
      candidateNextInventory,
      warnings: requirementAllocations.flatMap((item) => item.warnings || [])
    };
  }

  function summarizePantryUse(allocationResults = []) {
    const usedGroups = new Set();
    const usedLots = new Set();
    let fullyCoveredRequirementCount = 0;
    let partiallyCoveredRequirementCount = 0;
    let openedLotCountUsed = 0;
    let useSoonLotCountUsed = 0;
    const mealPantryAllocations = [];
    allocationResults.forEach((recipeResult) => {
      recipeResult.requirementAllocations.forEach((requirement) => {
        if (requirement.fullyCovered) fullyCoveredRequirementCount += 1;
        if (requirement.partiallyCovered) partiallyCoveredRequirementCount += 1;
        if (requirement.pantryQuantityApplied > EPSILON) usedGroups.add(`${requirement.ingredientId}::${requirement.form || "default"}`);
        mealPantryAllocations.push({ mealId: requirement.mealId, recipeId: requirement.recipeId, ingredientId: requirement.ingredientId, displayName: requirement.displayName, requiredQuantity: requirement.normalized?.quantity ?? requirement.requiredQuantity, requiredUnit: requirement.normalized?.unit || requirement.requiredUnit, pantryQuantityApplied: requirement.pantryQuantityApplied, missingQuantity: requirement.missingQuantity, missingUnit: requirement.missingUnit, allocations: requirement.pantryAllocations });
        requirement.pantryAllocations.forEach((allocation) => {
          usedLots.add(allocation.pantryItemId);
          if (allocation.opened) openedLotCountUsed += 1;
          if ([USE_SOON_STATUSES.EXPLICIT_USE_FIRST, USE_SOON_STATUSES.DURING_PLAN].includes(allocation.useSoonStatus)) useSoonLotCountUsed += 1;
        });
      });
    });
    return { ingredientGroupCountUsed: usedGroups.size, pantryLotCountUsed: usedLots.size, fullyCoveredRequirementCount, partiallyCoveredRequirementCount, openedLotCountUsed, useSoonLotCountUsed, mealPantryAllocations };
  }

  function rebuildPlanPantryAllocations({ meals = [], recipes = [], pantryItems = [], ingredientResolver, planStartDate, planEndDate } = {}) {
    let inventory = createPlanningInventory({ pantryItems, ingredientResolver, planStartDate, planEndDate });
    const recipeLookup = new Map((recipes || []).map((recipe) => [recipe.id, recipe]));
    const allocationResults = [];
    meals.forEach((meal) => {
      const recipe = meal.recipe || recipeLookup.get(meal.recipeId);
      if (!recipe) return;
      const result = simulateRecipeAgainstInventory({ recipe, selectedServings: meal.servings || recipe.servings || 1, planningInventory: inventory });
      result.requirementAllocations.forEach((allocation) => { allocation.mealId = meal.mealId || `${meal.day || "meal"}-${meal.mealType || ""}`; allocation.recipeId = recipe.id; });
      allocationResults.push(result);
      inventory = result.candidateNextInventory;
    });
    return { sourcePantryRevision: inventory.sourcePantryRevision, allocationResults, finalInventory: inventory, summary: summarizePantryUse(allocationResults) };
  }

  return { PANTRY_PLANNING_VERSION, PANTRY_QUANTITY_STATUSES, FRESHNESS_DATE_TYPES, USE_SOON_STATUSES, ALLOCATION_STATUSES, createPlanningInventory, normalizePantryItem, resolvePantryIngredient, findCompatiblePantryLots, simulateRequirementAllocation, simulateRecipeAgainstInventory, rebuildPlanPantryAllocations, summarizePantryUse, pantryRevision, cloneInventory };
});
