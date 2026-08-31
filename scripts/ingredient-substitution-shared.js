(function (root, factory) {
  const api = factory(root.ChefNovaCostEngine || (typeof require === "function" ? require("./cost-calculation-engine.js") : null));
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaSubstitutions = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function (costEngine) {
  "use strict";

  const SUBSTITUTION_SCHEMA_VERSION = 1;
  const SUBSTITUTION_QUANTITY_RULE_TYPES = Object.freeze({
    RATIO: "ratio",
    FIXED: "fixed",
    PER_SERVING: "per-serving",
    LOOKUP: "lookup",
    RECIPE_SPECIFIC: "recipe-specific",
    MANUAL_REQUIRED: "manual-required"
  });
  const SUBSTITUTION_STATUSES = Object.freeze({
    ELIGIBLE: "eligible",
    INELIGIBLE: "ineligible",
    INDETERMINATE: "indeterminate"
  });
  const SUBSTITUTION_CAUTION = "This substitution may change the flavour, texture, preparation, and nutrition of the meal.";

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase().replace(/&/g, "and").replace(/[_\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

  function normalizeUnit(value) {
    const text = String(value ?? "").trim().toLowerCase();
    const aliases = { cups: "cup", pieces: "piece", cloves: "clove", grams: "g", kilograms: "kg", litres: "l", liters: "l", millilitres: "ml", milliliters: "ml", tablespoons: "tbsp", teaspoons: "tsp" };
    return aliases[text] || text || null;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value ?? null));
  }

  function list(value) {
    return (Array.isArray(value) ? value : value == null ? [] : [value]).filter((item) => item !== undefined);
  }

  function normalizeQuantityRule(rule) {
    if (!rule || typeof rule !== "object" || rule.quantityRatio === null) return { type: SUBSTITUTION_QUANTITY_RULE_TYPES.MANUAL_REQUIRED };
    const type = Object.values(SUBSTITUTION_QUANTITY_RULE_TYPES).includes(rule.type) ? rule.type : SUBSTITUTION_QUANTITY_RULE_TYPES.MANUAL_REQUIRED;
    return { ...rule, type };
  }

  function normalizeSubstitutionCatalogue(catalogue = {}) {
    const groups = list(catalogue.groups).map((group) => ({
      id: group.id || `substitution-group-${group.originalIngredientId || "unknown"}`,
      originalIngredientId: group.originalIngredientId || null,
      alternatives: list(group.alternatives).map((alternative) => ({
        ...alternative,
        originalIngredientId: alternative.originalIngredientId || group.originalIngredientId || null,
        alternativeIngredientId: alternative.alternativeIngredientId || alternative.ingredientId || null,
        allowedRecipeTypes: list(alternative.allowedRecipeTypes).map(normalizeText),
        allowedRecipeIds: list(alternative.allowedRecipeIds).filter(Boolean),
        excludedRecipeIds: list(alternative.excludedRecipeIds).filter(Boolean),
        originalForms: list(alternative.originalForms),
        allowedAlternativeForms: list(alternative.allowedAlternativeForms),
        preparationAdjustments: list(alternative.preparationAdjustments).filter(Boolean),
        cookingAdjustments: {
          additionalTimeMinutes: Number(alternative.cookingAdjustments?.additionalTimeMinutes) || 0,
          requiredApplianceIds: list(alternative.cookingAdjustments?.requiredApplianceIds).map(normalizeText),
          removedApplianceIds: list(alternative.cookingAdjustments?.removedApplianceIds).map(normalizeText),
          preparationMethodId: alternative.cookingAdjustments?.preparationMethodId || null
        },
        additionalIngredients: list(alternative.additionalIngredients),
        removedIngredients: list(alternative.removedIngredients),
        quantityRule: normalizeQuantityRule(alternative.quantityRule || alternative),
        allowAutomaticPlanning: alternative.allowAutomaticPlanning === true,
        requiresUserConfirmation: alternative.requiresUserConfirmation === true,
        impactSummary: alternative.impactSummary || { flavour: "changes", texture: "changes", nutrition: "changes" },
        active: alternative.active !== false,
        version: Number.isInteger(Number(alternative.version)) ? Number(alternative.version) : 1,
        notes: alternative.notes || null
      }))
    }));
    return { substitutionSchemaVersion: catalogue.substitutionSchemaVersion || SUBSTITUTION_SCHEMA_VERSION, reviewedAt: catalogue.reviewedAt || null, groups };
  }

  function getRules(catalogue) {
    return normalizeSubstitutionCatalogue(catalogue).groups.flatMap((group) => group.alternatives.map((rule) => ({ ...rule, groupId: group.id })));
  }

  function buildRuleIndexes(catalogue) {
    const rules = getRules(catalogue).sort((a, b) => String(a.ruleId).localeCompare(String(b.ruleId)));
    const indexes = {
      rules,
      rulesByRuleId: new Map(),
      rulesByOriginalIngredientId: new Map(),
      rulesByAlternativeIngredientId: new Map(),
      rulesByRecipeType: new Map(),
      rulesByRecipeId: new Map()
    };
    rules.forEach((rule) => {
      indexes.rulesByRuleId.set(rule.ruleId, rule);
      const byOriginal = indexes.rulesByOriginalIngredientId.get(rule.originalIngredientId) || [];
      byOriginal.push(rule);
      indexes.rulesByOriginalIngredientId.set(rule.originalIngredientId, byOriginal);
      const byAlternative = indexes.rulesByAlternativeIngredientId.get(rule.alternativeIngredientId) || [];
      byAlternative.push(rule);
      indexes.rulesByAlternativeIngredientId.set(rule.alternativeIngredientId, byAlternative);
      rule.allowedRecipeTypes.forEach((type) => {
        const bucket = indexes.rulesByRecipeType.get(type) || [];
        bucket.push(rule);
        indexes.rulesByRecipeType.set(type, bucket);
      });
      rule.allowedRecipeIds.forEach((recipeId) => {
        const bucket = indexes.rulesByRecipeId.get(recipeId) || [];
        bucket.push(rule);
        indexes.rulesByRecipeId.set(recipeId, bucket);
      });
    });
    return indexes;
  }

  function validateSubstitutionCatalogue(catalogue, context = {}) {
    const ingredientIds = new Set(list(context.ingredientIds));
    const recipeIds = new Set(list(context.recipeIds));
    const validQuantityTypes = new Set(Object.values(SUBSTITUTION_QUANTITY_RULE_TYPES));
    const rules = getRules(catalogue);
    const seen = new Set();
    const errors = [];
    rules.forEach((rule) => {
      if (!rule.ruleId) errors.push("A substitution rule is missing ruleId.");
      if (seen.has(rule.ruleId)) errors.push(`Duplicate ruleId: ${rule.ruleId}.`);
      seen.add(rule.ruleId);
      if (!rule.originalIngredientId || (ingredientIds.size && !ingredientIds.has(rule.originalIngredientId))) errors.push(`${rule.ruleId}: invalid originalIngredientId.`);
      if (!rule.alternativeIngredientId || (ingredientIds.size && !ingredientIds.has(rule.alternativeIngredientId))) errors.push(`${rule.ruleId}: invalid alternativeIngredientId.`);
      if (rule.originalIngredientId === rule.alternativeIngredientId) errors.push(`${rule.ruleId}: original and alternative ingredients must differ.`);
      if (!validQuantityTypes.has(rule.quantityRule?.type)) errors.push(`${rule.ruleId}: invalid quantityRule type.`);
      if (rule.quantityRule?.type === SUBSTITUTION_QUANTITY_RULE_TYPES.RATIO && (!Number.isFinite(Number(rule.quantityRule.ratio)) || Number(rule.quantityRule.ratio) <= 0)) errors.push(`${rule.ruleId}: invalid ratio.`);
      if (rule.quantityRule?.type === SUBSTITUTION_QUANTITY_RULE_TYPES.RATIO && (!rule.quantityRule.inputUnit || !rule.quantityRule.outputUnit)) errors.push(`${rule.ruleId}: ratio rules need inputUnit and outputUnit.`);
      rule.allowedRecipeIds.forEach((recipeId) => { if (recipeIds.size && !recipeIds.has(recipeId)) errors.push(`${rule.ruleId}: invalid allowedRecipeId ${recipeId}.`); });
      rule.excludedRecipeIds.forEach((recipeId) => { if (recipeIds.size && !recipeIds.has(recipeId)) errors.push(`${rule.ruleId}: invalid excludedRecipeId ${recipeId}.`); });
    });
    return {
      valid: errors.length === 0,
      errors,
      groupCount: normalizeSubstitutionCatalogue(catalogue).groups.length,
      activeRuleCount: rules.filter((rule) => rule.active).length,
      ruleCount: rules.length
    };
  }

  function recipeTypes(recipe) {
    return [recipe?.category, recipe?.subcategory, ...(Array.isArray(recipe?.keywords) ? recipe.keywords : [])].map(normalizeText).filter(Boolean);
  }

  function ingredientOccurrenceId(recipe, index) {
    return `${recipe?.id || "recipe"}::ingredient-${index}`;
  }

  function findOriginalIngredientOccurrence(recipe, rule, occurrenceId = "") {
    const ingredients = Array.isArray(recipe?.structuredIngredients) ? recipe.structuredIngredients : [];
    const index = occurrenceId
      ? ingredients.findIndex((ingredient, ingredientIndex) => ingredientOccurrenceId(recipe, ingredientIndex) === occurrenceId)
      : ingredients.findIndex((ingredient) => ingredient.ingredientId === rule.originalIngredientId);
    if (index < 0) return null;
    const ingredient = ingredients[index];
    return ingredient?.ingredientId === rule.originalIngredientId ? { ingredient, index, occurrenceId: ingredientOccurrenceId(recipe, index) } : null;
  }

  function ruleAllowsRecipe(rule, recipe) {
    if (!rule.active) return { passed: false, reason: "This reviewed option is inactive." };
    if (rule.excludedRecipeIds.includes(recipe?.id)) return { passed: false, reason: "Not available for this recipe." };
    if (rule.allowedRecipeIds.includes(recipe?.id)) return { passed: true, reason: "" };
    const types = recipeTypes(recipe);
    if (rule.allowedRecipeTypes.length && rule.allowedRecipeTypes.some((type) => types.includes(type))) return { passed: true, reason: "" };
    return { passed: false, reason: "Not available for this recipe type." };
  }

  function formAllowed(rule, ingredient) {
    if (!rule.originalForms.length) return true;
    return rule.originalForms.some((form) => form === ingredient.form || (form === null && !ingredient.form));
  }

  function compatibleUnits(quantity, unit, expectedUnit) {
    const source = costEngine?.normalizeComparableQuantity?.(quantity, normalizeUnit(unit));
    const expected = costEngine?.normalizeComparableQuantity?.(1, normalizeUnit(expectedUnit));
    if (!source?.valid || !expected?.valid) return false;
    return source.dimension === expected.dimension;
  }

  function calculateReplacementQuantity(rule, ingredient, selectedServings, recipe) {
    const quantityRule = normalizeQuantityRule(rule.quantityRule);
    if (quantityRule.type === SUBSTITUTION_QUANTITY_RULE_TYPES.MANUAL_REQUIRED) return { status: "quantity-unresolved", canCalculate: false, reason: "Chef Nova does not have a reviewed quantity rule for this recipe." };
    if (quantityRule.type === SUBSTITUTION_QUANTITY_RULE_TYPES.RECIPE_SPECIFIC) {
      const recipeRule = quantityRule.rulesByRecipeId?.[recipe?.id];
      return recipeRule ? calculateReplacementQuantity({ ...rule, quantityRule: recipeRule }, ingredient, selectedServings, recipe) : { status: "quantity-unresolved", canCalculate: false, reason: "Chef Nova does not have a reviewed quantity rule for this recipe." };
    }
    if (quantityRule.type === SUBSTITUTION_QUANTITY_RULE_TYPES.RATIO) {
      if (!compatibleUnits(ingredient.quantity, ingredient.unit, quantityRule.inputUnit)) return { status: "quantity-unresolved", canCalculate: false, reason: "The recipe unit cannot be safely converted for this rule." };
      return { status: "resolved", canCalculate: true, quantity: Math.round(Number(ingredient.quantity) * Number(quantityRule.ratio) * 1000) / 1000, unit: normalizeUnit(quantityRule.outputUnit) };
    }
    if (quantityRule.type === SUBSTITUTION_QUANTITY_RULE_TYPES.FIXED) {
      return Number(quantityRule.quantity) > 0 && quantityRule.unit ? { status: "resolved", canCalculate: true, quantity: Number(quantityRule.quantity), unit: normalizeUnit(quantityRule.unit) } : { status: "quantity-unresolved", canCalculate: false, reason: "The fixed quantity rule is incomplete." };
    }
    if (quantityRule.type === SUBSTITUTION_QUANTITY_RULE_TYPES.PER_SERVING) {
      const servings = Number(selectedServings) > 0 ? Number(selectedServings) : Number(recipe?.servings) || 1;
      return Number(quantityRule.quantityPerServing) > 0 && quantityRule.unit ? { status: "resolved", canCalculate: true, quantity: Math.round(Number(quantityRule.quantityPerServing) * servings * 1000) / 1000, unit: normalizeUnit(quantityRule.unit) } : { status: "quantity-unresolved", canCalculate: false, reason: "The per-serving quantity rule is incomplete." };
    }
    if (quantityRule.type === SUBSTITUTION_QUANTITY_RULE_TYPES.LOOKUP) {
      const value = Number(ingredient.quantity);
      const match = list(quantityRule.values).find((item) => value >= Number(item.minimumOriginalQuantity || 0) && value <= Number(item.maximumOriginalQuantity || Number.POSITIVE_INFINITY));
      return match ? { status: "resolved", canCalculate: true, quantity: Number(match.replacementQuantity), unit: normalizeUnit(match.replacementUnit) } : { status: "quantity-unresolved", canCalculate: false, reason: "No lookup quantity matches this recipe amount." };
    }
    return { status: "quantity-unresolved", canCalculate: false, reason: "Chef Nova does not have a supported quantity rule for this option." };
  }

  function buildVariantId(recipe, applications) {
    const parts = list(applications).map((item) => {
      const ruleId = item.ruleId || item.rule?.ruleId;
      const ruleVersion = item.ruleVersion || item.rule?.version || 1;
      return `${item.occurrenceId}:${ruleId}:v${ruleVersion}`;
    }).sort();
    return `${recipe.id}::sub::${parts.join("__")}`.replace(/[^a-zA-Z0-9:_-]+/g, "-");
  }

  function createRecipeVariant(recipe, application) {
    const source = clone(recipe);
    const occurrence = findOriginalIngredientOccurrence(source, application.rule, application.occurrenceId);
    if (!occurrence) return null;
    const replacement = application.replacementIngredient;
    const displayName = application.alternativeDisplayName || replacement.ingredientId;
    const replacementText = `${replacement.quantity} ${replacement.unit} ${displayName}`.trim();
    const newIngredient = {
      ...occurrence.ingredient,
      ingredientId: replacement.ingredientId,
      displayName,
      displayText: replacementText,
      quantity: replacement.quantity,
      quantityMax: null,
      unit: replacement.unit,
      form: replacement.form || null,
      category: application.alternativeCategory || occurrence.ingredient.category,
      substituteGroup: null,
      preparation: application.rule.preparationAdjustments?.join(" ") || occurrence.ingredient.preparation,
      measurementStatus: "exact",
      resolutionStatus: "resolved"
    };
    source.structuredIngredients[occurrence.index] = newIngredient;
    const visibleIngredients = Array.isArray(source.ingredients) ? clone(source.ingredients) : [];
    if (visibleIngredients[occurrence.index]) {
      visibleIngredients[occurrence.index] = { name: displayName, quantity: replacement.quantity, unit: replacement.unit, displayText: replacementText };
    }
    source.ingredients = visibleIngredients;
    const additionalMinutes = Number(application.rule.cookingAdjustments?.additionalTimeMinutes) || 0;
    source.totalTime = Number(source.totalTime || source.cookingTime || 0) + additionalMinutes;
    source.cookingTime = Number(source.cookingTime || 0) + additionalMinutes;
    source.variantId = buildVariantId(recipe, [application]);
    source.baseRecipeId = recipe.id;
    source.appliedSubstitutions = [{
      ruleId: application.rule.ruleId,
      ruleVersion: application.rule.version,
      originalIngredientOccurrenceId: occurrence.occurrenceId,
      originalIngredientId: application.rule.originalIngredientId,
      alternativeIngredientId: application.rule.alternativeIngredientId,
      originalQuantity: occurrence.ingredient.quantity,
      originalUnit: occurrence.ingredient.unit,
      replacementQuantity: replacement.quantity,
      replacementUnit: replacement.unit
    }];
    source.substitutionAdjustments = {
      preparationAdjustments: application.rule.preparationAdjustments || [],
      cookingAdjustments: application.rule.cookingAdjustments || {},
      caution: SUBSTITUTION_CAUTION
    };
    return source;
  }

  function evaluateRuleForRecipe({ rule, recipe, selectedServings = recipe?.servings || 1, occurrenceId = "" } = {}) {
    const warnings = [SUBSTITUTION_CAUTION];
    const applicability = ruleAllowsRecipe(rule, recipe);
    if (!applicability.passed) return { status: SUBSTITUTION_STATUSES.INELIGIBLE, canApply: false, reason: applicability.reason, warnings };
    const occurrence = findOriginalIngredientOccurrence(recipe, rule, occurrenceId);
    if (!occurrence) return { status: SUBSTITUTION_STATUSES.INELIGIBLE, canApply: false, reason: "This recipe does not contain the original ingredient for this rule.", warnings };
    if (!formAllowed(rule, occurrence.ingredient)) return { status: SUBSTITUTION_STATUSES.INELIGIBLE, canApply: false, reason: "This ingredient form is not supported by the reviewed rule.", warnings };
    const quantity = calculateReplacementQuantity(rule, occurrence.ingredient, selectedServings, recipe);
    if (!quantity.canCalculate) return { status: SUBSTITUTION_STATUSES.INDETERMINATE, canApply: false, reason: quantity.reason, originalIngredient: occurrence.ingredient, quantityResult: quantity, warnings };
    const replacementIngredient = { ingredientId: rule.alternativeIngredientId, quantity: quantity.quantity, unit: quantity.unit, form: rule.resultingForm || null };
    const variant = createRecipeVariant(recipe, { rule, occurrenceId: occurrence.occurrenceId, replacementIngredient });
    return {
      status: SUBSTITUTION_STATUSES.ELIGIBLE,
      canApply: true,
      canUseForAutomaticPlanning: rule.allowAutomaticPlanning === true && rule.requiresUserConfirmation !== true,
      ruleId: rule.ruleId,
      originalIngredient: occurrence.ingredient,
      originalIngredientOccurrenceId: occurrence.occurrenceId,
      replacementIngredient,
      recipeVariant: variant,
      warnings
    };
  }

  return {
    SUBSTITUTION_SCHEMA_VERSION,
    SUBSTITUTION_QUANTITY_RULE_TYPES,
    SUBSTITUTION_STATUSES,
    SUBSTITUTION_CAUTION,
    normalizeText,
    normalizeUnit,
    normalizeSubstitutionCatalogue,
    buildRuleIndexes,
    validateSubstitutionCatalogue,
    findOriginalIngredientOccurrence,
    calculateReplacementQuantity,
    buildVariantId,
    createRecipeVariant,
    evaluateRuleForRecipe
  };
});
