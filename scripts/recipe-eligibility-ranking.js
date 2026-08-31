(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaRecipeEligibility = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const RECIPE_ELIGIBILITY_STATUSES = Object.freeze({
    ELIGIBLE: "eligible",
    EXCLUDED: "excluded",
    REVIEW_REQUIRED: "review-required",
    INVALID_CANDIDATE: "invalid-candidate",
    INELIGIBLE: "excluded",
    INDETERMINATE: "review-required"
  });

  const RECIPE_HARD_FILTER_REASON_CODES = Object.freeze({
    ALLERGEN_PRESENT: "allergen-present",
    ALLERGEN_CROSS_CONTACT_CONFLICT: "allergen-cross-contact-conflict",
    ALLERGEN_METADATA_INCOMPLETE: "allergen-metadata-incomplete",
    DIETARY_RESTRICTION_VIOLATION: "dietary-restriction-violation",
    DIETARY_METADATA_INCOMPLETE: "dietary-metadata-incomplete",
    APPLIANCE_UNAVAILABLE: "appliance-unavailable",
    PREPARATION_METHOD_UNAVAILABLE: "preparation-method-unavailable",
    COOKING_TIME_EXCEEDED: "cooking-time-exceeded",
    SCALED_COOKING_TIME_EXCEEDED: "scaled-cooking-time-exceeded",
    BATCH_COOKING_TIME_EXCEEDED: "batch-cooking-time-exceeded",
    PANTRY_SOURCE_SAFETY_EXCLUDED: "pantry-source-safety-excluded",
    PANTRY_SOURCE_REVIEW_REQUIRED: "pantry-source-review-required",
    PRIORITY_SOURCE_NO_LONGER_AVAILABLE: "priority-source-no-longer-available",
    PRIORITY_SOURCE_QUANTITY_UNKNOWN: "priority-source-quantity-unknown",
    PRIORITY_SOURCE_UNIT_INCOMPATIBLE: "priority-source-unit-incompatible",
    PRIORITY_SOURCE_FORM_INCOMPATIBLE: "priority-source-form-incompatible",
    PRIORITY_QUANTITY_INSUFFICIENT: "priority-quantity-insufficient",
    SELECTED_FOOD_PURCHASE_REQUIRED: "selected-food-purchase-required",
    SERVING_SCALE_UNSUPPORTED: "serving-scale-unsupported",
    SERVING_REQUIREMENT_NOT_MET: "serving-requirement-not-met",
    FIXED_YIELD_UNSUPPORTED: "fixed-yield-unsupported",
    BATCH_LIMIT_EXCEEDED: "batch-limit-exceeded",
    MANDATORY_INGREDIENT_UNAVAILABLE: "mandatory-ingredient-unavailable",
    MANDATORY_INGREDIENT_METADATA_INCOMPLETE: "mandatory-ingredient-metadata-incomplete",
    LEFTOVER_NO_LONGER_AVAILABLE: "leftover-no-longer-available",
    LEFTOVER_QUANTITY_INSUFFICIENT: "leftover-quantity-insufficient",
    LEFTOVER_SAFETY_EXCLUDED: "leftover-safety-excluded",
    LEFTOVER_REVIEW_REQUIRED: "leftover-review-required",
    LEFTOVER_LINEAGE_INVALID: "leftover-lineage-invalid",
    LEFTOVER_REHEATED_AND_NOT_REUSABLE: "leftover-reheated-and-not-reusable",
    LEFTOVER_TRANSFORMATION_UNSUPPORTED: "leftover-transformation-unsupported",
    SUBSTITUTION_RULE_MISSING: "substitution-rule-missing",
    SUBSTITUTION_RULE_INAPPLICABLE: "substitution-rule-inapplicable",
    SUBSTITUTION_QUANTITY_INVALID: "substitution-quantity-invalid",
    SUBSTITUTION_ALLERGEN_CONFLICT: "substitution-allergen-conflict",
    SUBSTITUTION_DIETARY_CONFLICT: "substitution-dietary-conflict",
    SUBSTITUTION_APPLIANCE_CONFLICT: "substitution-appliance-conflict",
    SUBSTITUTION_TIME_CONFLICT: "substitution-time-conflict",
    SUBSTITUTION_SAFETY_CONFLICT: "substitution-safety-conflict",
    RECIPE_INGREDIENT_DATA_INVALID: "recipe-ingredient-data-invalid",
    RECIPE_VARIANT_INVALID: "recipe-variant-invalid",
    RECIPE_METHOD_INVALID: "recipe-method-invalid"
  });

  const RECIPE_EXCLUSION_REASONS = Object.freeze({
    ALLERGEN_MATCH: "allergen-match",
    POSSIBLE_ALLERGEN_MATCH: "possible-allergen-match",
    ALLERGEN_DATA_INCOMPLETE: "allergen-data-incomplete",
    DIETARY_VIOLATION: "dietary-violation",
    DIETARY_DATA_INCOMPLETE: "dietary-data-incomplete",
    APPLIANCE_UNAVAILABLE: "appliance-unavailable",
    APPLIANCE_DATA_INCOMPLETE: "appliance-data-incomplete",
    COOKING_TIME_EXCEEDED: "cooking-time-exceeded",
    COOKING_TIME_UNKNOWN: "cooking-time-unknown",
    SERVINGS_UNSUPPORTED: "servings-unsupported",
    SERVING_DATA_INCOMPLETE: "serving-data-incomplete",
    MANDATORY_INGREDIENT_UNAVAILABLE: "mandatory-ingredient-unavailable",
    MANDATORY_INGREDIENT_UNRESOLVED: "mandatory-ingredient-unresolved",
    NO_VALID_SUBSTITUTE: "no-valid-substitute",
    FOOD_SAFETY_GUARDRAIL_EXCLUSION: "food-safety-guardrail-exclusion",
    FOOD_SAFETY_GUARDRAIL_REVIEW_REQUIRED: "food-safety-guardrail-review-required",
    INVALID_RECIPE_DATA: "invalid-recipe-data"
  });

  const RECIPE_ELIGIBILITY_VERSION = 1;
  const HARD_FILTER_STAGE_ORDER = Object.freeze([
    "candidate-structure",
    "allergy",
    "dietary",
    "selected-pantry-sources",
    "prepared-leftovers",
    "method-appliance",
    "serving-scale",
    "cooking-time",
    "priority-quantity",
    "leftover-quantity-lineage",
    "substitutions",
    "mandatory-ingredients",
    "final-verification"
  ]);

  const LEGACY_TO_HARD_REASON = Object.freeze({
    [RECIPE_EXCLUSION_REASONS.ALLERGEN_MATCH]: RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_PRESENT,
    [RECIPE_EXCLUSION_REASONS.POSSIBLE_ALLERGEN_MATCH]: RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_CROSS_CONTACT_CONFLICT,
    [RECIPE_EXCLUSION_REASONS.ALLERGEN_DATA_INCOMPLETE]: RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_METADATA_INCOMPLETE,
    [RECIPE_EXCLUSION_REASONS.DIETARY_VIOLATION]: RECIPE_HARD_FILTER_REASON_CODES.DIETARY_RESTRICTION_VIOLATION,
    [RECIPE_EXCLUSION_REASONS.DIETARY_DATA_INCOMPLETE]: RECIPE_HARD_FILTER_REASON_CODES.DIETARY_METADATA_INCOMPLETE,
    [RECIPE_EXCLUSION_REASONS.APPLIANCE_UNAVAILABLE]: RECIPE_HARD_FILTER_REASON_CODES.APPLIANCE_UNAVAILABLE,
    [RECIPE_EXCLUSION_REASONS.APPLIANCE_DATA_INCOMPLETE]: RECIPE_HARD_FILTER_REASON_CODES.PREPARATION_METHOD_UNAVAILABLE,
    [RECIPE_EXCLUSION_REASONS.COOKING_TIME_EXCEEDED]: RECIPE_HARD_FILTER_REASON_CODES.COOKING_TIME_EXCEEDED,
    [RECIPE_EXCLUSION_REASONS.COOKING_TIME_UNKNOWN]: RECIPE_HARD_FILTER_REASON_CODES.RECIPE_METHOD_INVALID,
    [RECIPE_EXCLUSION_REASONS.SERVINGS_UNSUPPORTED]: RECIPE_HARD_FILTER_REASON_CODES.SERVING_SCALE_UNSUPPORTED,
    [RECIPE_EXCLUSION_REASONS.SERVING_DATA_INCOMPLETE]: RECIPE_HARD_FILTER_REASON_CODES.SERVING_REQUIREMENT_NOT_MET,
    [RECIPE_EXCLUSION_REASONS.MANDATORY_INGREDIENT_UNAVAILABLE]: RECIPE_HARD_FILTER_REASON_CODES.MANDATORY_INGREDIENT_UNAVAILABLE,
    [RECIPE_EXCLUSION_REASONS.MANDATORY_INGREDIENT_UNRESOLVED]: RECIPE_HARD_FILTER_REASON_CODES.MANDATORY_INGREDIENT_METADATA_INCOMPLETE,
    [RECIPE_EXCLUSION_REASONS.NO_VALID_SUBSTITUTE]: RECIPE_HARD_FILTER_REASON_CODES.SUBSTITUTION_RULE_MISSING,
    [RECIPE_EXCLUSION_REASONS.FOOD_SAFETY_GUARDRAIL_EXCLUSION]: RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_SAFETY_EXCLUDED,
    [RECIPE_EXCLUSION_REASONS.FOOD_SAFETY_GUARDRAIL_REVIEW_REQUIRED]: RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_REVIEW_REQUIRED,
    [RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA]: RECIPE_HARD_FILTER_REASON_CODES.RECIPE_INGREDIENT_DATA_INVALID
  });

  const REVIEW_REASON_CODES = new Set([
    RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_METADATA_INCOMPLETE,
    RECIPE_HARD_FILTER_REASON_CODES.DIETARY_METADATA_INCOMPLETE,
    RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_REVIEW_REQUIRED,
    RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_QUANTITY_UNKNOWN,
    RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_UNIT_INCOMPATIBLE,
    RECIPE_HARD_FILTER_REASON_CODES.PREPARATION_METHOD_UNAVAILABLE,
    RECIPE_HARD_FILTER_REASON_CODES.MANDATORY_INGREDIENT_METADATA_INCOMPLETE,
    RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_REVIEW_REQUIRED,
    RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_LINEAGE_INVALID,
    RECIPE_HARD_FILTER_REASON_CODES.RECIPE_METHOD_INVALID
  ]);

  const INVALID_REASON_CODES = new Set([
    RECIPE_HARD_FILTER_REASON_CODES.RECIPE_INGREDIENT_DATA_INVALID,
    RECIPE_HARD_FILTER_REASON_CODES.RECIPE_VARIANT_INVALID,
    RECIPE_HARD_FILTER_REASON_CODES.SUBSTITUTION_QUANTITY_INVALID
  ]);

  const PRIMARY_REASON_PRIORITY = Object.freeze([
    RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_PRESENT,
    RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_CROSS_CONTACT_CONFLICT,
    RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_METADATA_INCOMPLETE,
    RECIPE_HARD_FILTER_REASON_CODES.DIETARY_RESTRICTION_VIOLATION,
    RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_SAFETY_EXCLUDED,
    RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_SAFETY_EXCLUDED,
    RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_LINEAGE_INVALID,
    RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_NO_LONGER_AVAILABLE,
    RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_QUANTITY_INSUFFICIENT,
    RECIPE_HARD_FILTER_REASON_CODES.APPLIANCE_UNAVAILABLE,
    RECIPE_HARD_FILTER_REASON_CODES.COOKING_TIME_EXCEEDED,
    RECIPE_HARD_FILTER_REASON_CODES.BATCH_COOKING_TIME_EXCEEDED,
    RECIPE_HARD_FILTER_REASON_CODES.SERVING_SCALE_UNSUPPORTED,
    RECIPE_HARD_FILTER_REASON_CODES.SUBSTITUTION_RULE_MISSING,
    RECIPE_HARD_FILTER_REASON_CODES.SUBSTITUTION_QUANTITY_INVALID,
    RECIPE_HARD_FILTER_REASON_CODES.MANDATORY_INGREDIENT_UNAVAILABLE,
    RECIPE_HARD_FILTER_REASON_CODES.MANDATORY_INGREDIENT_METADATA_INCOMPLETE,
    RECIPE_HARD_FILTER_REASON_CODES.RECIPE_INGREDIENT_DATA_INVALID
  ]);

  const INGREDIENT_AVAILABILITY_STATUSES = Object.freeze({
    AVAILABLE_AT_HOME: "available-at-home",
    AVAILABLE_FOR_PURCHASE: "available-for-purchase",
    UNAVAILABLE: "unavailable",
    UNKNOWN: "unknown"
  });

  const SOFT_PREFERENCE_WEIGHTS = Object.freeze({
    preferredIngredients: 1,
    cuisinePreference: 0.6,
    variety: 0.8,
    minimalCleanup: 0.4,
    batchCooking: 0.4,
    pantryUsage: 1.2,
    costPerServing: 0.9,
    activeSales: 0.4,
    crossRecipeReuse: 0.6
  });

  const ALLERGEN_ALIASES = Object.freeze({
    peanut: "peanuts",
    peanuts: "peanuts",
    "tree nut": "tree-nuts",
    "tree nuts": "tree-nuts",
    treenuts: "tree-nuts",
    milk: "milk",
    dairy: "milk",
    egg: "eggs",
    eggs: "eggs",
    soy: "soy",
    soya: "soy",
    gluten: "wheat",
    wheat: "wheat",
    fish: "fish",
    seafood: "fish",
    shellfish: "shellfish",
    sesame: "sesame"
  });

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase().replace(/&/g, "and").replace(/[_\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

  function normalizeAllergenId(value) {
    const normalized = normalizeText(value);
    return ALLERGEN_ALIASES[normalized] || normalized;
  }

  function normalizeList(values, normalizer = normalizeText) {
    return Array.from(new Set((Array.isArray(values) ? values : [values]).map(normalizer).filter(Boolean)));
  }

  function createReason(code, recipe, message, extra = {}) {
    const hardFilterReasonCode = extra.hardFilterReasonCode || LEGACY_TO_HARD_REASON[code] || code;
    return { code, hardFilterReasonCode, recipeId: recipe?.id || "", message, userCanOverride: extra.userCanOverride === true, nonOverridable: extra.nonOverridable === true, ...extra };
  }

  function getIngredientRecords(catalogue = {}) {
    if (Array.isArray(catalogue.ingredients)) return catalogue.ingredients;
    if (Array.isArray(catalogue)) return catalogue;
    return [];
  }

  function buildIngredientIndex(catalogue = {}) {
    return new Map(getIngredientRecords(catalogue).map((ingredient) => [ingredient.id, ingredient]));
  }

  function getIngredientAllergenIds(ingredientId, ingredientIndex) {
    const ingredient = ingredientIndex.get(ingredientId);
    return normalizeList([...(ingredient?.allergenIds || []), ...(ingredient?.allergens || []), ...(ingredient?.allergies || [])], normalizeAllergenId);
  }

  function getRecipeAllergenIds(recipe, ingredientIndex) {
    const recipeAllergens = normalizeList([...(recipe?.allergies || []), ...(recipe?.allergenIds || []), ...(recipe?.allergens || [])], normalizeAllergenId);
    const ingredientAllergens = (recipe?.structuredIngredients || []).flatMap((ingredient) => getIngredientAllergenIds(ingredient.ingredientId, ingredientIndex));
    return Array.from(new Set([...recipeAllergens, ...ingredientAllergens].filter(Boolean)));
  }

  function createHardFilterStage(stage, passed, reasons = [], extra = {}) {
    return { stage, passed: passed === true, reasonCodes: Array.from(new Set(reasons.map((reason) => reason.hardFilterReasonCode || reason.code).filter(Boolean))).sort(), reasons, ...extra };
  }

  function normalizeComparableQuantity(quantity, unit) {
    const number = Number(quantity);
    const normalizedUnit = normalizeText(unit || "each");
    const factors = {
      g: ["mass", 1], gram: ["mass", 1], grams: ["mass", 1], kg: ["mass", 1000], kilogram: ["mass", 1000], kilograms: ["mass", 1000],
      ml: ["volume", 1], milliliter: ["volume", 1], milliliters: ["volume", 1], l: ["volume", 1000], liter: ["volume", 1000], liters: ["volume", 1000], tbsp: ["volume", 15], tablespoon: ["volume", 15], tsp: ["volume", 5], teaspoon: ["volume", 5],
      each: ["count:each", 1], item: ["count:each", 1], items: ["count:each", 1], serving: ["servings", 1], servings: ["servings", 1]
    };
    const factor = factors[normalizedUnit];
    if (!Number.isFinite(number) || number <= 0 || !factor) return { valid: false, quantity: null, unit: normalizedUnit, dimension: null };
    return { valid: true, quantity: number * factor[1], unit: factor[0] === "mass" ? "g" : factor[0] === "volume" ? "ml" : normalizedUnit, dimension: factor[0] };
  }

  function formsCompatible(recipeForm, sourceForm) {
    const recipeValue = normalizeText(recipeForm || "");
    const sourceValue = normalizeText(sourceForm || "");
    return !recipeValue || !sourceValue || recipeValue === "unknown" || sourceValue === "unknown" || recipeValue === sourceValue;
  }

  function scaleIngredientQuantity(recipe, ingredient, serving) {
    const base = Number(recipe?.servings) > 0 ? Number(recipe.servings) : 1;
    const scaleFactor = Number(serving?.scaleFactor) > 0 ? Number(serving.scaleFactor) : Number(serving?.effectiveServings) > 0 ? Number(serving.effectiveServings) / base : 1;
    const quantity = ingredient.measurementStatus === "range" && Number.isFinite(Number(ingredient.quantityMax)) ? Number(ingredient.quantityMax) : Number(ingredient.quantity);
    return { quantity: Number.isFinite(quantity) ? quantity * scaleFactor : null, unit: ingredient.unit || null, scaleFactor };
  }

  function isOptionalIngredientSelected(ingredient, context) {
    const selected = context.selectedOptionalIngredients || {};
    const selectedIds = normalizeList(context.selectedOptionalIngredientIds || []);
    if (selected === true) return true;
    const keys = [ingredient.occurrenceId, ingredient.ingredientId, ingredient.displayName, ingredient.displayText].map(normalizeText).filter(Boolean);
    return keys.some((key) => selected[key] === true || selectedIds.includes(key));
  }

  function buildFinalIngredientGraph(recipe, context, ingredientIndex, reasons) {
    const graph = [];
    const structured = Array.isArray(recipe?.structuredIngredients) ? recipe.structuredIngredients : null;
    if (!structured || !structured.length) {
      reasons.push(createReason(RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA, recipe, "Recipe ingredient data is incomplete.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.RECIPE_INGREDIENT_DATA_INVALID, userCanOverride: false }));
      return graph;
    }
    const optionalStructured = Array.isArray(recipe?.structuredOptionalIngredients) ? recipe.structuredOptionalIngredients : [];
    [...structured, ...optionalStructured].forEach((ingredient, index) => {
      const optional = ingredient.optional === true || optionalStructured.includes(ingredient);
      if (optional && !isOptionalIngredientSelected(ingredient, context)) return;
      const occurrence = { ...ingredient, occurrenceId: ingredient.occurrenceId || `${recipe.id || "recipe"}::ingredient::${index}`, optional, source: optional ? "selected-optional" : "base" };
      graph.push(occurrence);
      (ingredient.components || ingredient.componentIngredients || []).forEach((component, componentIndex) => {
        graph.push({ ...component, occurrenceId: component.occurrenceId || `${occurrence.occurrenceId}::component::${componentIndex}`, parentOccurrenceId: occurrence.occurrenceId, optional, source: "composite-component" });
      });
    });
    graph.filter((ingredient) => ingredient.optional !== true).forEach((ingredient) => {
      if (!ingredient.ingredientId || ingredient.resolutionStatus === "unresolved") return;
      if (context.requireStructuredQuantities === true && (ingredient.measurementStatus === "unresolved" || ingredient.quantity === null || ingredient.quantity === undefined || ingredient.unit === null || ingredient.unit === undefined)) {
        reasons.push(createReason(RECIPE_EXCLUSION_REASONS.MANDATORY_INGREDIENT_UNRESOLVED, recipe, `${ingredient.displayName || ingredient.ingredientId} needs structured quantity information before automatic ranking.`, { ingredientId: ingredient.ingredientId, hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.MANDATORY_INGREDIENT_METADATA_INCOMPLETE, userCanOverride: false }));
      }
    });
    return graph;
  }

  function getHardReasonCode(reason) {
    return reason?.hardFilterReasonCode || LEGACY_TO_HARD_REASON[reason?.code] || reason?.code || "";
  }

  function choosePrimaryReasonCode(reasonCodes) {
    const set = new Set(reasonCodes);
    return PRIMARY_REASON_PRIORITY.find((code) => set.has(code)) || reasonCodes[0] || null;
  }

  function deriveEligibilityStatus(reasonCodes) {
    if (!reasonCodes.length) return RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE;
    if (reasonCodes.some((code) => INVALID_REASON_CODES.has(code))) return RECIPE_ELIGIBILITY_STATUSES.INVALID_CANDIDATE;
    if (reasonCodes.some((code) => REVIEW_REASON_CODES.has(code))) return RECIPE_ELIGIBILITY_STATUSES.REVIEW_REQUIRED;
    return RECIPE_ELIGIBILITY_STATUSES.EXCLUDED;
  }

  function createReviewAction(action, label, reasonCode, sourceId = "") {
    return { action, label, reasonCode, sourceId };
  }

  function sourceScopeMatches(source, context) {
    if (!context.userScope || !source.userScope) return true;
    return String(source.userScope) === String(context.userScope);
  }

  function sourceIsSafetyExcluded(source) {
    const decision = normalizeText(source.foodSafetyDecision || source.safetyDecision || "");
    return source.canUseForAutomaticPlanning === false || source.hardExclusion === true || decision.includes("excluded") || decision.includes("not-eligible");
  }

  function sourceNeedsReview(source) {
    const decision = normalizeText(source.foodSafetyDecision || source.safetyDecision || "");
    return source.requiresReview === true || source.reviewRequired === true || decision.includes("review") || source.dateSummary?.requiresDateConfirmation === true;
  }

  function sourceAvailableQuantity(source) {
    const quantity = Number(source.availableQuantity ?? source.quantity ?? source.currentQuantity);
    const reserved = Number(source.reservedQuantity || 0);
    if (!Number.isFinite(quantity)) return null;
    return Math.max(0, quantity - (Number.isFinite(reserved) ? reserved : 0));
  }

  function normalizeRescueSource(source = {}) {
    const available = sourceAvailableQuantity(source);
    const comparable = normalizeComparableQuantity(source.comparableQuantity ?? available, source.comparableUnit || source.unit);
    return { ...source, rescueSourceId: source.rescueSourceId || source.sourceId || source.pantryItemId || source.leftoverId || source.id || "", ingredientId: source.ingredientId || null, form: source.form || null, availableQuantity: available, unit: source.unit || source.comparableUnit || "each", comparableQuantity: comparable.valid ? comparable.quantity : null, comparableDimension: comparable.valid ? comparable.dimension : null, comparableUnit: comparable.unit, comparableValid: comparable.valid };
  }

  function collectEligiblePantryLots(context, selectedSources) {
    const selectedIds = new Set(selectedSources.map((source) => source.rescueSourceId).filter(Boolean));
    const lots = [...selectedSources];
    (context.pantryContext?.pantryItems || []).forEach((item) => {
      const source = normalizeRescueSource({
        rescueSourceId: item.rescueSourceId || item.id || item.pantryItemId,
        pantryItemId: item.id || item.pantryItemId,
        ingredientId: item.ingredientId,
        form: item.form,
        availableQuantity: item.availableQuantity ?? item.quantityDetails?.currentQuantity ?? item.quantity,
        reservedQuantity: item.reservedQuantity || 0,
        unit: item.unit || item.quantityDetails?.unit || "each",
        canUseForAutomaticPlanning: item.canUseForAutomaticPlanning,
        foodSafetyDecision: item.foodSafetyDecision
      });
      if (selectedIds.has(source.rescueSourceId)) return;
      lots.push(source);
    });
    return lots.filter((source) => source.ingredientId && !sourceIsSafetyExcluded(source) && !sourceNeedsReview(source) && source.availableQuantity !== null && source.availableQuantity > 0);
  }

  function evaluateSelectedPrioritySources(recipe, context, ingredientGraph, serving, reasons) {
    const selectedSources = (context.selectedRescueSources || []).map(normalizeRescueSource).sort((a, b) => String(a.rescueSourceId).localeCompare(String(b.rescueSourceId)));
    const validations = [];
    if (!selectedSources.length) return { passed: true, reasons: [], selectedSourceValidation: validations };
    const localReasons = [];
    selectedSources.forEach((source) => {
      const sourceReasons = [];
      if (!source.rescueSourceId || !sourceScopeMatches(source, context)) sourceReasons.push(createReason(RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA, recipe, "The selected Pantry source is no longer available in this profile.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_NO_LONGER_AVAILABLE, sourceId: source.rescueSourceId, nonOverridable: true }));
      if (sourceIsSafetyExcluded(source)) sourceReasons.push(createReason(RECIPE_EXCLUSION_REASONS.FOOD_SAFETY_GUARDRAIL_EXCLUSION, recipe, "The selected Pantry source is not eligible for automatic planning.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_SAFETY_EXCLUDED, sourceId: source.rescueSourceId, nonOverridable: true }));
      if (sourceNeedsReview(source)) sourceReasons.push(createReason(RECIPE_EXCLUSION_REASONS.FOOD_SAFETY_GUARDRAIL_REVIEW_REQUIRED, recipe, "The selected Pantry source needs review before automatic recipe ranking.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_REVIEW_REQUIRED, sourceId: source.rescueSourceId, nonOverridable: true }));
      if (source.availableQuantity === null || source.availableQuantity <= 0) sourceReasons.push(createReason(RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA, recipe, "Chef Nova needs a positive selected Pantry quantity before automatic recipe ranking.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_QUANTITY_UNKNOWN, sourceId: source.rescueSourceId, nonOverridable: true }));
      validations.push({ rescueSourceId: source.rescueSourceId, ingredientId: source.ingredientId, status: sourceReasons.length ? "blocked" : "available", reasonCodes: sourceReasons.map(getHardReasonCode) });
      localReasons.push(...sourceReasons);
    });
    const eligibleLots = collectEligiblePantryLots(context, selectedSources);
    ingredientGraph.filter((ingredient) => ingredient.optional !== true && selectedSources.some((source) => source.ingredientId === ingredient.ingredientId)).forEach((ingredient) => {
      const required = scaleIngredientQuantity(recipe, ingredient, serving);
      const requiredComparable = normalizeComparableQuantity(required.quantity, ingredient.unit);
      if (!requiredComparable.valid) {
        localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA, recipe, `${ingredient.displayName || ingredient.ingredientId} has a quantity unit Chef Nova cannot compare safely.`, { ingredientId: ingredient.ingredientId, hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_UNIT_INCOMPATIBLE, nonOverridable: true }));
        return;
      }
      const formCompatibleLots = eligibleLots.filter((source) => source.ingredientId === ingredient.ingredientId && formsCompatible(ingredient.form, source.form));
      if (!formCompatibleLots.length) {
        localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA, recipe, `${ingredient.displayName || ingredient.ingredientId} needs a compatible selected Pantry form.`, { ingredientId: ingredient.ingredientId, hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_FORM_INCOMPATIBLE, nonOverridable: true }));
        return;
      }
      const compatibleQuantity = formCompatibleLots.filter((source) => source.comparableValid && source.comparableDimension === requiredComparable.dimension).reduce((sum, source) => sum + source.comparableQuantity, 0);
      if (compatibleQuantity <= 0) {
        localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA, recipe, `${ingredient.displayName || ingredient.ingredientId} needs a supported unit conversion before automatic ranking.`, { ingredientId: ingredient.ingredientId, hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_UNIT_INCOMPATIBLE, nonOverridable: true }));
        return;
      }
      if (requiredComparable.quantity > compatibleQuantity + 1e-9) {
        localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.MANDATORY_INGREDIENT_UNAVAILABLE, recipe, `This recipe requires more eligible ${ingredient.displayName || ingredient.ingredientId} than is currently available.`, { ingredientId: ingredient.ingredientId, hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_QUANTITY_INSUFFICIENT, requiredQuantity: requiredComparable.quantity, availableQuantity: compatibleQuantity, unit: requiredComparable.unit, nonOverridable: true }));
        localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.MANDATORY_INGREDIENT_UNAVAILABLE, recipe, "Chef Nova will not buy more of a selected rescue food to make a rescue recipe eligible.", { ingredientId: ingredient.ingredientId, hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.SELECTED_FOOD_PURCHASE_REQUIRED, nonOverridable: true }));
      }
    });
    reasons.push(...localReasons);
    return { passed: localReasons.length === 0, reasons: localReasons, selectedSourceValidation: validations };
  }

  function evaluatePreparedLeftovers(recipe, context, reasons) {
    const sources = context.leftoverContext?.selectedLeftovers || context.preparedLeftoverSources || [];
    const localReasons = [];
    const leftoverValidation = [];
    (Array.isArray(sources) ? sources : []).forEach((source) => {
      const id = source.leftoverId || source.rescueSourceId || source.id || "";
      const available = Number(source.availableServings ?? source.availableQuantity);
      if (source.status === "consumed" || source.status === "discarded" || source.status === "donated-shared") localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA, recipe, "The selected leftover is no longer available.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_NO_LONGER_AVAILABLE, sourceId: id, nonOverridable: true }));
      if (source.safetyExcluded || sourceIsSafetyExcluded(source)) localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.FOOD_SAFETY_GUARDRAIL_EXCLUSION, recipe, "The selected leftover is not eligible for use.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_SAFETY_EXCLUDED, sourceId: id, nonOverridable: true }));
      if (source.reviewRequired || sourceNeedsReview(source)) localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.FOOD_SAFETY_GUARDRAIL_REVIEW_REQUIRED, recipe, "The selected leftover needs review before automatic ranking.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_REVIEW_REQUIRED, sourceId: id, nonOverridable: true }));
      if (source.reheated === true && source.reusableAfterReheat !== true) localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.FOOD_SAFETY_GUARDRAIL_EXCLUSION, recipe, "The selected leftover was reheated and is not reusable.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_REHEATED_AND_NOT_REUSABLE, sourceId: id, nonOverridable: true }));
      if (source.requiresTransformationRule && !source.transformationRuleId) localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.NO_VALID_SUBSTITUTE, recipe, "The selected leftover does not have a validated transformation rule.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_TRANSFORMATION_UNSUPPORTED, sourceId: id, nonOverridable: true }));
      if (source.requiredServings && (!Number.isFinite(available) || available < Number(source.requiredServings))) localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.MANDATORY_INGREDIENT_UNAVAILABLE, recipe, "The selected leftover does not have enough available servings.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_QUANTITY_INSUFFICIENT, sourceId: id, nonOverridable: true }));
      if (source.lineageRequired && !source.lineageValid) localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA, recipe, "The selected leftover lineage needs review.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_LINEAGE_INVALID, sourceId: id, nonOverridable: true }));
      leftoverValidation.push({ leftoverId: id, status: localReasons.some((reason) => reason.sourceId === id) ? "blocked" : "available" });
    });
    reasons.push(...localReasons);
    return { passed: localReasons.length === 0, reasons: localReasons, leftoverValidation };
  }

  function evaluateAppliedSubstitutions(recipe, context, ingredientIndex, reasons) {
    const substitutions = Array.isArray(recipe?.appliedSubstitutions) ? recipe.appliedSubstitutions : Array.isArray(context.appliedSubstitutions) ? context.appliedSubstitutions : [];
    const availableRules = new Set([...(context.substitutionContext?.rules || []).map((rule) => rule.ruleId || rule.id), ...(context.substitutionContext?.ruleIds || [])].filter(Boolean));
    const localReasons = [];
    const substitutionValidation = [];
    substitutions.forEach((substitution) => {
      const id = substitution.ruleId || substitution.substitutionRuleId || "";
      if (!id || availableRules.size && !availableRules.has(id)) localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.NO_VALID_SUBSTITUTE, recipe, "The selected substitution rule is unavailable.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.SUBSTITUTION_RULE_MISSING, substitutionRuleId: id, nonOverridable: true }));
      const ratio = substitution.quantityRatio ?? substitution.quantityRule?.ratio;
      if (substitution.quantityRule?.type === "ratio" && (!Number.isFinite(Number(ratio)) || Number(ratio) <= 0)) localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.NO_VALID_SUBSTITUTE, recipe, "The selected substitution does not have a valid quantity conversion.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.SUBSTITUTION_QUANTITY_INVALID, substitutionRuleId: id, nonOverridable: true }));
      const substituteAllergens = getIngredientAllergenIds(substitution.alternativeIngredientId || substitution.substituteIngredientId, ingredientIndex);
      const savedAllergens = normalizeList(context.allergies?.allergenIds || context.allergies || [], normalizeAllergenId);
      if (substituteAllergens.some((allergen) => savedAllergens.includes(allergen))) localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.ALLERGEN_MATCH, recipe, "The selected substitution contains a saved allergy.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.SUBSTITUTION_ALLERGEN_CONFLICT, substitutionRuleId: id, nonOverridable: true }));
      substitutionValidation.push({ substitutionRuleId: id, status: localReasons.some((reason) => reason.substitutionRuleId === id) ? "blocked" : "available" });
    });
    reasons.push(...localReasons);
    return { passed: localReasons.length === 0, reasons: localReasons, substitutionValidation };
  }

  function choosePreparationMethod(recipe, context, reasons) {
    const hasPreparationMethods = Array.isArray(recipe?.preparationMethods) && recipe.preparationMethods.length;
    const hasLegacyApplianceData = Array.isArray(recipe?.requiredAppliances);
    const available = new Set(normalizeList(context.availableAppliances || []));
    if (!hasPreparationMethods && !hasLegacyApplianceData && available.size) {
      reasons.push(createReason(RECIPE_EXCLUSION_REASONS.APPLIANCE_DATA_INCOMPLETE, recipe, "Chef Nova could not verify which appliances this recipe needs.", { availableAppliances: Array.from(available), userCanOverride: true }));
      return null;
    }
    const methods = hasPreparationMethods
      ? recipe.preparationMethods
      : [{ id: "default", requiredAppliances: recipe?.requiredAppliances || [], optionalAppliances: recipe?.optionalAppliances || [], totalTimeMinutes: getRecipeTimeUpperBound(recipe) }];
    const feasible = methods.filter((method) => normalizeList(method.requiredApplianceIds || method.requiredAppliances || []).every((appliance) => available.has(appliance)));
    if (!feasible.length) {
      const required = normalizeList(methods.flatMap((method) => method.requiredApplianceIds || method.requiredAppliances || []));
      reasons.push(createReason(RECIPE_EXCLUSION_REASONS.APPLIANCE_UNAVAILABLE, recipe, required.length ? `This recipe requires ${required.join(", ")}, which is not listed as available.` : "Chef Nova could not find an available preparation method.", { requiredAppliances: required, availableAppliances: Array.from(available), userCanOverride: true }));
      return null;
    }
    return feasible.sort((a, b) => (getMethodTimeUpperBound(a, recipe) || 99999) - (getMethodTimeUpperBound(b, recipe) || 99999) || String(a.id || "").localeCompare(String(b.id || "")))[0];
  }

  function getMethodTimeUpperBound(method, recipe) {
    if (method?.totalTimeMinutes !== null && method?.totalTimeMinutes !== undefined && Number.isFinite(Number(method.totalTimeMinutes))) return Number(method.totalTimeMinutes);
    if (method?.timeMinutesMax !== null && method?.timeMinutesMax !== undefined && Number.isFinite(Number(method.timeMinutesMax))) return Number(method.timeMinutesMax);
    if (method?.timeMinutes !== null && method?.timeMinutes !== undefined && Number.isFinite(Number(method.timeMinutes))) return Number(method.timeMinutes);
    return getRecipeTimeUpperBound(recipe);
  }

  function getRecipeTimeUpperBound(recipe) {
    if (recipe?.totalTimeMax !== null && recipe?.totalTimeMax !== undefined && Number.isFinite(Number(recipe.totalTimeMax))) return Number(recipe.totalTimeMax);
    if (recipe?.totalTime !== null && recipe?.totalTime !== undefined && Number.isFinite(Number(recipe.totalTime))) return Number(recipe.totalTime);
    if (recipe?.cookingTimeMax !== null && recipe?.cookingTimeMax !== undefined && Number.isFinite(Number(recipe.cookingTimeMax))) return Number(recipe.cookingTimeMax);
    if (recipe?.cookingTime !== null && recipe?.cookingTime !== undefined && Number.isFinite(Number(recipe.cookingTime))) return Number(recipe.cookingTime);
    return null;
  }

  function evaluateCookingTime(recipe, method, context, batchCount, reasons) {
    const maximum = Number(context.maximumCookingTimeMinutes);
    const methodTime = getMethodTimeUpperBound(method, recipe);
    if (!Number.isFinite(maximum) || maximum <= 0) return { passed: true, effectiveTimeMinutes: methodTime, reasons: [] };
    if (!Number.isFinite(methodTime)) {
      const reason = createReason(RECIPE_EXCLUSION_REASONS.COOKING_TIME_UNKNOWN, recipe, "Chef Nova could not verify that this recipe fits the selected cooking-time limit.", { maximumCookingTimeMinutes: maximum, userCanOverride: true });
      reasons.push(reason);
      return { passed: false, effectiveTimeMinutes: null, reasons: [reason] };
    }
    const effectiveTime = method?.batchesRunConcurrently === true ? methodTime : methodTime * Math.max(1, batchCount || 1);
    if (effectiveTime > maximum) {
      const reason = createReason(RECIPE_EXCLUSION_REASONS.COOKING_TIME_EXCEEDED, recipe, `This recipe takes about ${effectiveTime} minutes, which is above the selected ${maximum}-minute limit.`, { effectiveTimeMinutes: effectiveTime, maximumCookingTimeMinutes: maximum, userCanOverride: true });
      reasons.push(reason);
      return { passed: false, effectiveTimeMinutes: effectiveTime, reasons: [reason] };
    }
    return { passed: true, effectiveTimeMinutes: effectiveTime, reasons: [] };
  }

  function evaluateServingFeasibility(recipe, context, reasons) {
    const required = Number(context.requiredServings) > 0 ? Number(context.requiredServings) : 1;
    const base = Number(recipe?.servings);
    if (!Number.isFinite(base) || base <= 0) {
      const reason = createReason(RECIPE_EXCLUSION_REASONS.SERVING_DATA_INCOMPLETE, recipe, "Chef Nova could not verify the serving yield for this recipe.", { requiredServings: required, userCanOverride: true });
      reasons.push(reason);
      return { passed: false, effectiveServings: null, batchCount: 0, scaleFactor: null, reasons: [reason] };
    }
    const scalable = recipe?.scalable !== false;
    const maximum = Number.isFinite(Number(recipe?.maximumServings)) ? Number(recipe.maximumServings) : 10;
    const minimum = Number.isFinite(Number(recipe?.minimumServings)) ? Number(recipe.minimumServings) : 0.5;
    if (scalable && required >= minimum && required <= maximum) return { passed: true, effectiveServings: required, batchCount: 1, scaleFactor: required / base, surplusServings: 0, reasons: [] };
    if (required <= base) return { passed: true, effectiveServings: base, batchCount: 1, scaleFactor: 1, surplusServings: base - required, reasons: [] };
    const batchable = recipe?.batchable === true;
    const maxBatches = Number.isInteger(Number(recipe?.maximumBatches)) ? Number(recipe.maximumBatches) : (batchable ? 4 : 1);
    const batchCount = Math.ceil(required / base);
    if (batchable && batchCount <= maxBatches) return { passed: true, effectiveServings: batchCount * base, batchCount, scaleFactor: 1, surplusServings: batchCount * base - required, reasons: [] };
    const reason = createReason(RECIPE_EXCLUSION_REASONS.SERVINGS_UNSUPPORTED, recipe, `This recipe cannot produce the required ${required} servings using its supported serving range.`, { requiredServings: required, supportedServings: { base, minimum, maximum }, userCanOverride: true });
    reasons.push(reason);
    return { passed: false, effectiveServings: base, batchCount: 1, scaleFactor: 1, reasons: [reason] };
  }

  function evaluateDietary(recipe, context, ingredientIndex, reasons) {
    const requirements = normalizeList(context.dietaryRequirements || []);
    if (!requirements.length) return { passed: true, reasons: [] };
    if (!Array.isArray(recipe?.dietaryTags)) {
      const reason = createReason(RECIPE_EXCLUSION_REASONS.DIETARY_DATA_INCOMPLETE, recipe, "Chef Nova could not verify this recipe against the selected dietary requirements.", { restrictions: requirements, userCanOverride: true });
      reasons.push(reason);
      return { passed: false, reasons: [reason] };
    }
    const tags = normalizeList(recipe.dietaryTags);
    const failed = requirements.filter((restriction) => restriction !== "no-preference" && restriction !== "all-diets" && !tags.includes(restriction));
    if (failed.length) {
      const reason = createReason(RECIPE_EXCLUSION_REASONS.DIETARY_VIOLATION, recipe, `This recipe does not match ${failed.join(", ")}.`, { restrictions: failed, userCanOverride: true });
      reasons.push(reason);
      return { passed: false, reasons: [reason] };
    }
    return { passed: true, reasons: [] };
  }

  function evaluateAllergies(recipe, context, ingredientIndex, reasons) {
    const savedAllergens = normalizeList(context.allergies?.allergenIds || context.allergies || [], normalizeAllergenId);
    if (!savedAllergens.length) return { passed: true, reasons: [] };
    if (!Array.isArray(recipe?.allergies) && !Array.isArray(recipe?.allergenIds) && !Array.isArray(recipe?.allergens)) {
      const reason = createReason(RECIPE_EXCLUSION_REASONS.ALLERGEN_DATA_INCOMPLETE, recipe, "Chef Nova could not verify this recipe against all saved allergies. It was not included in automatic planning.", { nonOverridable: true });
      reasons.push(reason);
      return { passed: false, reasons: [reason] };
    }
    const recipeAllergens = getRecipeAllergenIds(recipe, ingredientIndex);
    const matches = savedAllergens.filter((allergen) => recipeAllergens.includes(allergen));
    if (matches.length) {
      const reason = createReason(RECIPE_EXCLUSION_REASONS.ALLERGEN_MATCH, recipe, `This recipe contains ${matches.join(", ")}, which matches a saved allergy.`, { allergenId: matches[0], allergenIds: matches, nonOverridable: true });
      reasons.push(reason);
      return { passed: false, reasons: [reason] };
    }
    return { passed: true, reasons: [] };
  }

  function evaluateIngredientAvailability(recipe, context, ingredientIndex, reasons) {
    const unavailable = new Set(normalizeList(context.ingredientAvailability?.explicitlyUnavailableIngredientIds || []));
    const unavailableNames = new Set(normalizeList(context.ingredientAvailability?.explicitlyUnavailableNames || []));
    const mandatory = (recipe?.structuredIngredients || []).filter((ingredient) => ingredient.optional !== true);
    const localReasons = [];
    mandatory.forEach((ingredient) => {
      if (!ingredient.ingredientId || ingredient.resolutionStatus === "unresolved") {
        localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.MANDATORY_INGREDIENT_UNRESOLVED, recipe, `${ingredient.displayName || "A required ingredient"} is not linked to the ingredient catalogue.`, { ingredientId: ingredient.ingredientId || null, userCanOverride: false }));
        return;
      }
      const name = normalizeText(ingredient.displayName || ingredient.displayText || ingredient.ingredientId);
      if (!unavailable.has(normalizeText(ingredient.ingredientId)) && !unavailableNames.has(name)) return;
      const substitute = findValidExplicitSubstitute(recipe, ingredient, context, ingredientIndex);
      if (substitute.valid) return;
      localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.MANDATORY_INGREDIENT_UNAVAILABLE, recipe, `${ingredient.displayName || ingredient.ingredientId} is marked unavailable.`, { ingredientId: ingredient.ingredientId, userCanOverride: true }));
      localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.NO_VALID_SUBSTITUTE, recipe, `${ingredient.displayName || ingredient.ingredientId} has no compatible recipe-approved substitute.`, { ingredientId: ingredient.ingredientId, userCanOverride: true }));
    });
    reasons.push(...localReasons);
    return { passed: localReasons.length === 0, reasons: localReasons };
  }

  function evaluateFoodSafetyGuardrailContext(recipe, context, reasons) {
    const guardrail = context.foodSafetyGuardrail || {};
    const excluded = new Set(normalizeList(guardrail.excludedIngredientIds || []));
    const required = (recipe?.structuredIngredients || []).filter((ingredient) => ingredient.optional !== true);
    const localReasons = [];
    required.forEach((ingredient) => {
      if (!ingredient.ingredientId || !excluded.has(normalizeText(ingredient.ingredientId))) return;
      localReasons.push(createReason(RECIPE_EXCLUSION_REASONS.FOOD_SAFETY_GUARDRAIL_EXCLUSION, recipe, `${ingredient.displayName || ingredient.ingredientId} is not eligible for automatic planning based on recorded food-safety information.`, { ingredientId: ingredient.ingredientId, nonOverridable: true }));
    });
    if (guardrail.policyCoverage && Number(guardrail.policyCoverage.reviewRequired || 0) > 0) {
      // Policy coverage warnings should be visible to planners without approving or rejecting unrelated recipes.
    }
    reasons.push(...localReasons);
    return { passed: localReasons.length === 0, reasons: localReasons, policyCoverage: guardrail.policyCoverage || null };
  }

  function findValidExplicitSubstitute(recipe, ingredient, context, ingredientIndex) {
    const rules = Array.isArray(recipe?.approvedSubstitutions) ? recipe.approvedSubstitutions : [];
    const savedAllergens = normalizeList(context.allergies?.allergenIds || context.allergies || [], normalizeAllergenId);
    const restrictions = normalizeList(context.dietaryRequirements || []);
    const unavailable = new Set(normalizeList(context.ingredientAvailability?.explicitlyUnavailableIngredientIds || []));
    const rule = rules.find((candidate) => candidate.originalIngredientId === ingredient.ingredientId && (!Array.isArray(candidate.allowedRecipeIds) || candidate.allowedRecipeIds.includes(recipe.id)));
    if (!rule?.substituteIngredientId || rule.substituteIngredientId === ingredient.ingredientId) return { valid: false, reason: "no-explicit-rule" };
    if (unavailable.has(normalizeText(rule.substituteIngredientId))) return { valid: false, reason: "substitute-unavailable" };
    const substituteAllergens = getIngredientAllergenIds(rule.substituteIngredientId, ingredientIndex);
    if (substituteAllergens.some((allergen) => savedAllergens.includes(allergen))) return { valid: false, reason: "substitute-allergen" };
    const substitute = ingredientIndex.get(rule.substituteIngredientId);
    const tags = normalizeList(substitute?.dietaryTags || substitute?.compatibleDietaryTags || []);
    if (tags.length && restrictions.some((restriction) => !tags.includes(restriction))) return { valid: false, reason: "substitute-dietary" };
    if (!rule.quantityRule || !["ratio", "same"].includes(rule.quantityRule.type)) return { valid: false, reason: "quantity-rule-missing" };
    return { valid: true, rule };
  }

  function evaluateRecipeEligibility({ recipe, eligibilityContext = {}, ingredientCatalogue = {} } = {}) {
    const ingredientIndex = buildIngredientIndex(ingredientCatalogue);
    const exclusionReasons = [];
    const warnings = [];
    const structuralReasons = [];
    const finalIngredientGraph = buildFinalIngredientGraph(recipe, eligibilityContext, ingredientIndex, structuralReasons);
    exclusionReasons.push(...structuralReasons);
    const base = {
      eligibilityVersion: RECIPE_ELIGIBILITY_VERSION,
      recipeId: recipe?.id || "",
      status: RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE,
      hardEligible: true,
      reviewRequired: false,
      candidateId: `recipe::${recipe?.id || "unknown"}::${recipe?.variantId || "base"}::${eligibilityContext.preparationMethodId || "auto"}::servings-${eligibilityContext.requiredServings || recipe?.servings || 1}`,
      recipeVariantId: recipe?.variantId || null,
      preparationMethodId: null,
      servingProfileId: `servings-${eligibilityContext.requiredServings || recipe?.servings || 1}`,
      primaryReasonCode: null,
      reasonCodes: [],
      exclusionStages: [],
      reviewActions: [],
      canUseForAutomaticPlanning: true,
      selectedPreparationMethodId: null,
      effectiveServings: null,
      scaleFactor: null,
      batchCount: 1,
      requiredSubstitutions: [],
      hardFilterResults: {},
      validatedContext: {
        finalIngredientGraphId: `recipe::${recipe?.id || "unknown"}::ingredients::${finalIngredientGraph.length}`,
        selectedMethodId: null,
        effectiveServings: null,
        scaleFactor: null,
        batchCount: 1,
        effectiveCookingTimeMinutes: null
      },
      selectedSourceValidation: [],
      pantrySourceValidation: [],
      leftoverValidation: [],
      substitutionValidation: [],
      sourceRevisions: {
        userScope: eligibilityContext.userScope || eligibilityContext.profileRevision || "unknown",
        recipeRevision: `${recipe?.id || "unknown"}:${recipe?.updatedAt || recipe?.revision || "static"}`,
        ingredientRevision: ingredientCatalogue.ingredientSchemaVersion || ingredientCatalogue.schemaVersion || 0,
        pantryRevision: eligibilityContext.pantryContext?.pantryRevision || "",
        leftoverRevision: eligibilityContext.leftoverContext?.leftoverRevision || "",
        eligibilityProfileRevision: eligibilityContext.profileRevision || "",
        policyVersion: eligibilityContext.foodSafetyGuardrail?.schemaVersion || 1,
        referenceDate: eligibilityContext.planDate || eligibilityContext.referenceDate || ""
      },
      exclusionReasons,
      warnings
    };
    if (!recipe?.id || !recipe?.name) {
      exclusionReasons.push(createReason(RECIPE_EXCLUSION_REASONS.INVALID_RECIPE_DATA, recipe, "Recipe data is missing an ID or name.", { hardFilterReasonCode: RECIPE_HARD_FILTER_REASON_CODES.RECIPE_VARIANT_INVALID, userCanOverride: false }));
    }
    base.hardFilterResults.candidateStructure = createHardFilterStage("candidate-structure", structuralReasons.length === 0 && Boolean(recipe?.id && recipe?.name), exclusionReasons.filter((reason) => [RECIPE_HARD_FILTER_REASON_CODES.RECIPE_INGREDIENT_DATA_INVALID, RECIPE_HARD_FILTER_REASON_CODES.RECIPE_VARIANT_INVALID].includes(getHardReasonCode(reason))), { finalIngredientGraph });
    base.hardFilterResults.allergy = evaluateAllergies(recipe, eligibilityContext, ingredientIndex, exclusionReasons);
    base.hardFilterResults.dietary = evaluateDietary(recipe, eligibilityContext, ingredientIndex, exclusionReasons);
    base.hardFilterResults.selectedPantrySources = evaluateSelectedPrioritySources(recipe, eligibilityContext, finalIngredientGraph, { effectiveServings: eligibilityContext.requiredServings || recipe?.servings || 1, scaleFactor: 1 }, exclusionReasons);
    base.selectedSourceValidation = base.hardFilterResults.selectedPantrySources.selectedSourceValidation || [];
    base.hardFilterResults.preparedLeftovers = evaluatePreparedLeftovers(recipe, eligibilityContext, exclusionReasons);
    base.leftoverValidation = base.hardFilterResults.preparedLeftovers.leftoverValidation || [];
    const serving = evaluateServingFeasibility(recipe, eligibilityContext, exclusionReasons);
    base.hardFilterResults.servings = serving;
    base.effectiveServings = serving.effectiveServings;
    base.scaleFactor = serving.scaleFactor;
    base.batchCount = serving.batchCount || 1;
    const method = choosePreparationMethod(recipe, eligibilityContext, exclusionReasons);
    base.selectedPreparationMethodId = method?.id || null;
    base.preparationMethodId = method?.id || null;
    base.validatedContext.selectedMethodId = method?.id || null;
    base.validatedContext.effectiveServings = serving.effectiveServings;
    base.validatedContext.scaleFactor = serving.scaleFactor;
    base.validatedContext.batchCount = base.batchCount;
    base.hardFilterResults.appliances = { passed: Boolean(method), selectedMethodId: method?.id || null, reasons: exclusionReasons.filter((reason) => reason.code === RECIPE_EXCLUSION_REASONS.APPLIANCE_UNAVAILABLE || reason.code === RECIPE_EXCLUSION_REASONS.APPLIANCE_DATA_INCOMPLETE) };
    base.hardFilterResults.cookingTime = evaluateCookingTime(recipe, method, eligibilityContext, base.batchCount, exclusionReasons);
    base.validatedContext.effectiveCookingTimeMinutes = base.hardFilterResults.cookingTime.effectiveTimeMinutes;
    base.hardFilterResults.foodSafetyGuardrail = evaluateFoodSafetyGuardrailContext(recipe, eligibilityContext, exclusionReasons);
    base.hardFilterResults.substitutions = evaluateAppliedSubstitutions(recipe, eligibilityContext, ingredientIndex, exclusionReasons);
    base.substitutionValidation = base.hardFilterResults.substitutions.substitutionValidation || [];
    base.hardFilterResults.ingredientAvailability = evaluateIngredientAvailability(recipe, eligibilityContext, ingredientIndex, exclusionReasons);
    const uniqueReasons = [];
    const seen = new Set();
    exclusionReasons.forEach((reason) => {
      const key = `${getHardReasonCode(reason)}:${reason.ingredientId || reason.allergenId || reason.requiredAppliance || reason.sourceId || reason.substitutionRuleId || ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueReasons.push(reason);
      }
    });
    const reasonCodes = Array.from(new Set(uniqueReasons.map(getHardReasonCode).filter(Boolean))).sort((a, b) => {
      const ai = PRIMARY_REASON_PRIORITY.indexOf(a);
      const bi = PRIMARY_REASON_PRIORITY.indexOf(b);
      if (ai !== bi) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return a.localeCompare(b);
    });
    base.exclusionReasons = uniqueReasons.sort((a, b) => reasonCodes.indexOf(getHardReasonCode(a)) - reasonCodes.indexOf(getHardReasonCode(b)) || String(a.message || "").localeCompare(String(b.message || "")));
    base.reasonCodes = reasonCodes;
    base.primaryReasonCode = choosePrimaryReasonCode(reasonCodes);
    base.exclusionStages = HARD_FILTER_STAGE_ORDER.map((stage) => {
      const stageReasons = {
        "candidate-structure": base.hardFilterResults.candidateStructure?.reasons || [],
        allergy: base.hardFilterResults.allergy?.reasons || [],
        dietary: base.hardFilterResults.dietary?.reasons || [],
        "selected-pantry-sources": base.hardFilterResults.selectedPantrySources?.reasons || [],
        "prepared-leftovers": base.hardFilterResults.preparedLeftovers?.reasons || [],
        "method-appliance": base.hardFilterResults.appliances?.reasons || [],
        "serving-scale": base.hardFilterResults.servings?.reasons || [],
        "cooking-time": base.hardFilterResults.cookingTime?.reasons || [],
        "priority-quantity": (base.hardFilterResults.selectedPantrySources?.reasons || []).filter((reason) => [RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_QUANTITY_INSUFFICIENT, RECIPE_HARD_FILTER_REASON_CODES.SELECTED_FOOD_PURCHASE_REQUIRED, RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_UNIT_INCOMPATIBLE, RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_FORM_INCOMPATIBLE].includes(getHardReasonCode(reason))),
        "leftover-quantity-lineage": base.hardFilterResults.preparedLeftovers?.reasons || [],
        substitutions: base.hardFilterResults.substitutions?.reasons || [],
        "mandatory-ingredients": base.hardFilterResults.ingredientAvailability?.reasons || [],
        "final-verification": []
      }[stage] || [];
      return createHardFilterStage(stage, stageReasons.length === 0, stageReasons);
    });
    if (reasonCodes.includes(RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_QUANTITY_UNKNOWN)) base.reviewActions.push(createReviewAction("resolve-pantry-amount", "Resolve Pantry Amount", RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_QUANTITY_UNKNOWN));
    if (reasonCodes.includes(RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_REVIEW_REQUIRED)) base.reviewActions.push(createReviewAction("review-storage-conditions", "Review Storage Conditions", RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_REVIEW_REQUIRED));
    if (reasonCodes.includes(RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_REVIEW_REQUIRED)) base.reviewActions.push(createReviewAction("review-leftover", "Review Leftover", RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_REVIEW_REQUIRED));
    if (reasonCodes.includes(RECIPE_HARD_FILTER_REASON_CODES.MANDATORY_INGREDIENT_METADATA_INCOMPLETE)) base.reviewActions.push(createReviewAction("review-recipe-information", "Review Recipe Information", RECIPE_HARD_FILTER_REASON_CODES.MANDATORY_INGREDIENT_METADATA_INCOMPLETE));
    if (uniqueReasons.length) {
      base.status = deriveEligibilityStatus(reasonCodes);
      base.canUseForAutomaticPlanning = false;
    }
    base.hardEligible = base.status === RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE;
    base.reviewRequired = base.status === RECIPE_ELIGIBILITY_STATUSES.REVIEW_REQUIRED;
    return base;
  }

  function calculateSoftPreferenceScore({ recipeVariant, eligibilityResult, userPreferences = {}, currentPlanContext = {}, pantrySimulation = null, costResult = null, saleContext = {} } = {}) {
    if (!eligibilityResult || eligibilityResult.status !== RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE) return { totalScore: null, breakdown: null, explanationReasons: [] };
    const recipe = recipeVariant || {};
    const ingredients = new Set((recipe.structuredIngredients || []).map((ingredient) => normalizeText(ingredient.ingredientId || ingredient.displayName)).filter(Boolean));
    const preferred = normalizeList(userPreferences.preferredIngredientIds || userPreferences.preferredFoods || []);
    const preferredIngredients = preferred.length ? preferred.filter((item) => ingredients.has(item)).length / preferred.length : 0.5;
    const cuisines = normalizeList(userPreferences.preferredCuisines || []);
    const cuisinePreference = cuisines.length && recipe.cuisine ? (cuisines.includes(normalizeText(recipe.cuisine)) ? 1 : 0.35) : 0.5;
    const recipeUseCount = currentPlanContext.recipeUseCounts?.get?.(recipe.id) || 0;
    const variety = recipeUseCount === 0 ? 1 : recipeUseCount === 1 ? 0.45 : 0.1;
    const minimalCleanup = recipe.onePot === true || recipe.cleanupLevel === "low" ? 1 : recipe.cleanupLevel ? 0.35 : 0.5;
    const batchCooking = recipe.batchFriendly === true || recipe.storesWell === true ? 1 : 0.5;
    const pantryUsage = pantrySimulation ? Math.max(0, Math.min(1, pantrySimulation.pantryCoverageRatio || 0)) : 0.5;
    const costPerServing = Number.isInteger(costResult?.costPerServingCents) ? 1 / (1 + costResult.costPerServingCents / 500) : 0.4;
    const activeSales = saleContext.activeSaleCount > 0 ? 1 : 0;
    const crossRecipeReuse = currentPlanContext.reusedIngredientIds ? Array.from(ingredients).filter((id) => currentPlanContext.reusedIngredientIds.has(id)).length / Math.max(1, ingredients.size) : 0.5;
    const breakdown = { preferredIngredients, cuisinePreference, variety, minimalCleanup, batchCooking, pantryUsage, costPerServing, activeSales, crossRecipeReuse };
    const weightedTotal = Object.entries(breakdown).reduce((sum, [key, value]) => sum + value * SOFT_PREFERENCE_WEIGHTS[key], 0);
    const weightTotal = Object.values(SOFT_PREFERENCE_WEIGHTS).reduce((sum, value) => sum + value, 0);
    const explanationReasons = [];
    if (pantryUsage >= 0.6) explanationReasons.push("Uses ingredients already in your Pantry");
    if (preferredIngredients > 0.5) explanationReasons.push("Includes preferred ingredients");
    if (cuisinePreference === 1) explanationReasons.push("Matches a preferred cuisine");
    if (costPerServing >= 0.7) explanationReasons.push("Has a lower estimated cost per serving");
    return { totalScore: Math.round((weightedTotal / weightTotal) * 1000) / 1000, breakdown, explanationReasons };
  }

  function rankEligibleCandidates(candidates = []) {
    return [...candidates].sort((a, b) => {
      const aEligibility = a.eligibilityResult || a.eligibility || {};
      const bEligibility = b.eligibilityResult || b.eligibility || {};
      if (aEligibility.status !== RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE && bEligibility.status === RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE) return 1;
      if (bEligibility.status !== RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE && aEligibility.status === RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE) return -1;
      const aScore = Number(a.softScore?.totalScore ?? a.score?.total ?? 0);
      const bScore = Number(b.softScore?.totalScore ?? b.score?.total ?? 0);
      if (bScore !== aScore) return bScore - aScore;
      const ap = a.pantrySimulation || a.score?.pantryAllocation || {};
      const bp = b.pantrySimulation || b.score?.pantryAllocation || {};
      if ((bp.pantryCoverageRatio || 0) !== (ap.pantryCoverageRatio || 0)) return (bp.pantryCoverageRatio || 0) - (ap.pantryCoverageRatio || 0);
      if ((bp.useSoonLotCountUsed || 0) !== (ap.useSoonLotCountUsed || 0)) return (bp.useSoonLotCountUsed || 0) - (ap.useSoonLotCountUsed || 0);
      if ((ap.newPurchaseGroupCount || 0) !== (bp.newPurchaseGroupCount || 0)) return (ap.newPurchaseGroupCount || 0) - (bp.newPurchaseGroupCount || 0);
      const aCost = Number.isInteger(a.costResult?.costPerServingCents) ? a.costResult.costPerServingCents : Number.POSITIVE_INFINITY;
      const bCost = Number.isInteger(b.costResult?.costPerServingCents) ? b.costResult.costPerServingCents : Number.POSITIVE_INFINITY;
      if (aCost !== bCost) return aCost - bCost;
      return String(a.recipe?.id || a.recipeVariant?.id || "").localeCompare(String(b.recipe?.id || b.recipeVariant?.id || ""));
    });
  }

  return {
    RECIPE_ELIGIBILITY_VERSION,
    RECIPE_ELIGIBILITY_STATUSES,
    RECIPE_HARD_FILTER_REASON_CODES,
    RECIPE_EXCLUSION_REASONS,
    HARD_FILTER_STAGE_ORDER,
    INGREDIENT_AVAILABILITY_STATUSES,
    SOFT_PREFERENCE_WEIGHTS,
    normalizeAllergenId,
    evaluateRecipeEligibility,
    calculateSoftPreferenceScore,
    rankEligibleCandidates,
    evaluateServingFeasibility
  };
});
