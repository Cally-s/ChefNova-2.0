(function (root, factory) {
  const api = factory(root.ChefNovaPriceData || (typeof require === "function" ? require("./price-data-shared.js") : null));
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaCostEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function (priceData) {
  "use strict";

  const COST_CALCULATION_VERSION = 1;
  const EPSILON = 1e-9;
  const COST_STATUSES = Object.freeze({
    RESOLVED: "resolved",
    ESTIMATED: "estimated",
    INCOMPLETE: "incomplete",
    NO_PURCHASES_REQUIRED: "no-purchases-required",
    MISSING_PRICE: "missing-price",
    MISSING_QUANTITY: "missing-quantity",
    INCOMPATIBLE_UNIT: "incompatible-unit",
    UNKNOWN_PACKAGE_SIZE: "unknown-package-size",
    AMBIGUOUS_INGREDIENT: "ambiguous-ingredient",
    UNKNOWN_PANTRY_QUANTITY: "unknown-pantry-quantity",
    FORM_MISMATCH: "form-mismatch",
    EXCLUDED: "excluded"
  });
  const MEASUREMENT_STATUSES = Object.freeze({
    EXACT: "exact",
    RANGE: "range",
    APPROXIMATE: "approximate",
    UNQUANTIFIED: "unquantified",
    TO_TASTE: "to-taste",
    AS_NEEDED: "as-needed",
    PACKAGE_SIZE_UNKNOWN: "package-size-unknown",
    UNRESOLVED: "unresolved"
  });
  const UNIT_FACTORS = Object.freeze({
    mg: { dimension: "mass", factor: 0.001, baseUnit: "g" },
    g: { dimension: "mass", factor: 1, baseUnit: "g" },
    kg: { dimension: "mass", factor: 1000, baseUnit: "g" },
    ml: { dimension: "volume", factor: 1, baseUnit: "ml" },
    l: { dimension: "volume", factor: 1000, baseUnit: "ml" },
    tsp: { dimension: "volume", factor: 5, baseUnit: "ml" },
    tbsp: { dimension: "volume", factor: 15, baseUnit: "ml" },
    each: { dimension: "count:each", factor: 1, baseUnit: "each" },
    piece: { dimension: "count:piece", factor: 1, baseUnit: "piece" },
    clove: { dimension: "count:clove", factor: 1, baseUnit: "clove" },
    slice: { dimension: "count:slice", factor: 1, baseUnit: "slice" },
    fillet: { dimension: "count:fillet", factor: 1, baseUnit: "fillet" },
    sheet: { dimension: "count:sheet", factor: 1, baseUnit: "sheet" },
    head: { dimension: "count:head", factor: 1, baseUnit: "head" },
    stalk: { dimension: "count:stalk", factor: 1, baseUnit: "stalk" },
    sprig: { dimension: "count:sprig", factor: 1, baseUnit: "sprig" },
    bunch: { dimension: "count:bunch", factor: 1, baseUnit: "bunch" },
    can: { dimension: "count:can", factor: 1, baseUnit: "can" },
    jar: { dimension: "count:jar", factor: 1, baseUnit: "jar" },
    bottle: { dimension: "count:bottle", factor: 1, baseUnit: "bottle" },
    package: { dimension: "count:package", factor: 1, baseUnit: "package" },
    bag: { dimension: "count:bag", factor: 1, baseUnit: "bag" },
    box: { dimension: "count:box", factor: 1, baseUnit: "box" },
    carton: { dimension: "count:carton", factor: 1, baseUnit: "carton" }
  });
  const INGREDIENT_SCALING_POLICY_VERSION = 1;
  const RECIPE_SCALING_PROFILE_VERSION = 1;
  const INGREDIENT_SCALE_RESULT_VERSION = 1;
  const RECIPE_SCALE_RESULT_VERSION = 1;
  const INGREDIENT_SCALING_MODES = Object.freeze({
    LINEAR: "linear",
    WHOLE_ITEM: "whole-item",
    MEASURED_PARTIAL: "measured-partial",
    ALLOWED_FRACTIONS: "allowed-fractions",
    FIXED: "fixed",
    RANGE: "range",
    TO_TASTE: "to-taste",
    LINEAR_WITH_MINIMUM: "linear-with-minimum",
    LINEAR_WITH_CAP: "linear-with-cap",
    FIXED_PLUS_VARIABLE: "fixed-plus-variable",
    RATIO_BASED: "ratio-based",
    REVIEW_REQUIRED: "review-required",
    UNSUPPORTED: "unsupported"
  });
  const INGREDIENT_SCALE_STATUSES = Object.freeze({
    SUPPORTED: "supported",
    ADJUSTED: "adjusted",
    REVIEW_REQUIRED: "review-required",
    UNSUPPORTED: "unsupported",
    EXCLUDED: "excluded"
  });
  const RECIPE_SCALE_PROFILE_STATUSES = Object.freeze({
    SUPPORTED: "supported",
    REVIEW_REQUIRED: "review-required",
    UNSUPPORTED: "unsupported"
  });
  const RECIPE_SCALING_CLASSES = Object.freeze({
    GENERAL: "general",
    BAKING_SENSITIVE: "baking-sensitive",
    FIXED_YIELD: "fixed-yield",
    APPLIANCE_LIMITED: "appliance-limited"
  });
  const INGREDIENT_SCALING_POLICY_REGISTRY = Object.freeze({
    "generic-linear-measured": Object.freeze({
      id: "generic-linear-measured",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.LINEAR,
      scope: "reviewed-measured-units",
      description: "Measured mass and volume ingredients scale linearly unless a recipe profile says otherwise."
    }),
    "legacy-count-review": Object.freeze({
      id: "legacy-count-review",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.REVIEW_REQUIRED,
      scope: "legacy-count-units",
      description: "Legacy whole-count ingredients keep the exact math and are flagged for review instead of rounded by unit name."
    }),
    "whole-egg-round-nearest": Object.freeze({
      id: "whole-egg-round-nearest",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.WHOLE_ITEM,
      scope: "explicit-whole-egg-occurrence",
      itemName: "whole egg",
      rounding: "nearest",
      minimum: 1,
      maximumAdjustmentRatio: 0.4
    }),
    "whole-egg-round-up": Object.freeze({
      id: "whole-egg-round-up",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.WHOLE_ITEM,
      scope: "explicit-whole-egg-occurrence",
      itemName: "whole egg",
      rounding: "up",
      minimum: 1,
      maximumAdjustmentRatio: 0.5
    }),
    "fixed-seasoning-packet": Object.freeze({
      id: "fixed-seasoning-packet",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.FIXED,
      scope: "explicit-seasoning-packet-occurrence"
    }),
    "to-taste-seasoning": Object.freeze({
      id: "to-taste-seasoning",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.TO_TASTE,
      scope: "explicit-to-taste-occurrence"
    }),
    "complete-can-required": Object.freeze({
      id: "complete-can-required",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.ALLOWED_FRACTIONS,
      scope: "explicit-complete-can-occurrence",
      allowedFractions: [1, 2, 3, 4],
      requiresStructuredPackageSize: true
    }),
    "fractional-can-measured-use": Object.freeze({
      id: "fractional-can-measured-use",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.MEASURED_PARTIAL,
      scope: "explicit-measured-can-occurrence",
      requiresStructuredPackageSize: true
    }),
    "minimum-cooking-liquid": Object.freeze({
      id: "minimum-cooking-liquid",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.LINEAR_WITH_MINIMUM,
      scope: "explicit-cooking-liquid-occurrence"
    }),
    "capped-seasoning": Object.freeze({
      id: "capped-seasoning",
      version: INGREDIENT_SCALING_POLICY_VERSION,
      mode: INGREDIENT_SCALING_MODES.LINEAR_WITH_CAP,
      scope: "explicit-seasoning-occurrence"
    })
  });

  function roundMoney(value) {
    return Math.round(Number(value) + EPSILON);
  }

  function roundQuantity(value) {
    return Math.round((Number(value) + EPSILON) * 1000000) / 1000000;
  }

  function normalizeUnit(unit) {
    const value = String(unit || "").trim().toLowerCase();
    const aliases = { cups: "cup", pieces: "piece", cloves: "clove", grams: "g", kilograms: "kg", litres: "l", liters: "l", millilitres: "ml", milliliters: "ml", tablespoons: "tbsp", teaspoons: "tsp", cans: "can", jars: "jar", bottles: "bottle", packages: "package", bags: "bag", boxes: "box", cartons: "carton" };
    return aliases[value] || value;
  }

  function normalizeComparableQuantity(quantity, unit) {
    const amount = Number(quantity);
    const normalizedUnit = normalizeUnit(unit);
    const spec = UNIT_FACTORS[normalizedUnit];
    if (!Number.isFinite(amount) || amount <= 0) return { valid: false, status: COST_STATUSES.MISSING_QUANTITY, message: "This ingredient needs a measurable quantity." };
    if (!spec) return { valid: false, status: COST_STATUSES.INCOMPATIBLE_UNIT, message: `Chef Nova cannot safely convert ${normalizedUnit || "this unit"}.` };
    return { valid: true, quantity: roundQuantity(amount * spec.factor), unit: spec.baseUnit, dimension: spec.dimension, originalQuantity: amount, originalUnit: normalizedUnit };
  }

  function quantitiesCompatible(required, priced) {
    return required.valid && priced.valid && required.dimension === priced.dimension;
  }

  function sourceStatus(resolution) {
    if (!resolution || resolution.status !== "resolved") return COST_STATUSES.MISSING_PRICE;
    if (resolution.usedFallback || resolution.entry.sourceType === "chef-nova-estimate") return COST_STATUSES.ESTIMATED;
    return COST_STATUSES.RESOLVED;
  }

  function priceSourceKind(resolution) {
    if (!resolution?.entry) return null;
    if (resolution.usedFallback || resolution.entry.sourceType === "chef-nova-estimate") return "estimate";
    if (resolution.entry.sourceType === "user-entered" || resolution.entry.sourceType === "store-profile") return "confirmed";
    return "unknown";
  }

  function effectivePriceInfo(entry, calculationDate) {
    const effectivePriceCents = priceData.getEffectivePriceCents(entry, calculationDate);
    return { effectivePriceCents, usingSalePrice: priceData.isSaleActive(entry, calculationDate) === true };
  }

  function formCompatible(ingredient, priceEntry) {
    if (!priceEntry?.form) return true;
    return !ingredient?.form || ingredient.form === priceEntry.form;
  }

  function scaleIngredientQuantity(ingredient, servingScale) {
    const quantity = Number(ingredient.quantity);
    const quantityMax = ingredient.quantityMax == null ? null : Number(ingredient.quantityMax);
    return {
      quantity: Number.isFinite(quantity) ? roundQuantity(quantity * servingScale) : null,
      quantityMax: Number.isFinite(quantityMax) ? roundQuantity(quantityMax * servingScale) : null
    };
  }

  function getUnitSpec(unit) {
    return UNIT_FACTORS[normalizeUnit(unit)] || null;
  }

  function getIngredientOccurrenceId(recipe, ingredient, ingredientIndex) {
    return ingredient?.occurrenceId || ingredient?.scalingOccurrenceId || `${recipe?.id || "recipe"}::ingredient::${ingredientIndex}`;
  }

  function getRecipeScalingProfile(recipe) {
    const source = recipe?.scalingProfile || recipe?.recipeScalingProfile || recipe?.practicalScalingProfile || {};
    const servingRange = source.servingRange || source.supportedServings || {};
    return {
      version: Number(source.version) || RECIPE_SCALING_PROFILE_VERSION,
      scalingClass: source.scalingClass || source.recipeClass || (recipe?.bakingSensitive ? RECIPE_SCALING_CLASSES.BAKING_SENSITIVE : RECIPE_SCALING_CLASSES.GENERAL),
      defaultPolicyId: source.defaultPolicyId || null,
      ingredientPolicies: source.ingredientPolicies || {},
      applianceProfile: source.applianceProfile || null,
      panProfiles: Array.isArray(source.panProfiles) ? source.panProfiles : [],
      servingRange: {
        minimum: Number(servingRange.minimum ?? recipe?.minimumServings),
        maximum: Number(servingRange.maximum ?? recipe?.maximumServings),
        increment: Number(servingRange.increment ?? recipe?.servingIncrement)
      },
      validatedProfiles: Array.isArray(source.validatedProfiles) ? source.validatedProfiles : []
    };
  }

  function findRecipePolicyOverride(recipe, ingredient, ingredientIndex, profile) {
    const occurrenceId = getIngredientOccurrenceId(recipe, ingredient, ingredientIndex);
    const policies = profile.ingredientPolicies || {};
    return policies[occurrenceId]
      || policies[ingredient?.ingredientId]
      || policies[ingredient?.displayName]
      || null;
  }

  function resolveIngredientScalingPolicy({ recipe, ingredient, ingredientIndex, recipeProfile }) {
    const explicitPolicy = ingredient?.scalingPolicy || ingredient?.scaling || findRecipePolicyOverride(recipe, ingredient, ingredientIndex, recipeProfile);
    const explicitPolicyId = ingredient?.scalingPolicyId || ingredient?.scalingPolicy?.policyId || explicitPolicy?.policyId || explicitPolicy?.id || recipeProfile?.defaultPolicyId;
    const registryPolicy = explicitPolicyId ? INGREDIENT_SCALING_POLICY_REGISTRY[explicitPolicyId] : null;
    if (registryPolicy || explicitPolicy) return { ...(registryPolicy || {}), ...(explicitPolicy || {}), id: explicitPolicyId || explicitPolicy?.id || "recipe-occurrence-policy", version: Number(explicitPolicy?.version) || Number(registryPolicy?.version) || INGREDIENT_SCALING_POLICY_VERSION, source: explicitPolicyId ? "explicit-policy-id" : "recipe-occurrence-policy" };
    const spec = getUnitSpec(ingredient?.unit);
    if (spec?.dimension === "mass" || spec?.dimension === "volume") return { ...INGREDIENT_SCALING_POLICY_REGISTRY["generic-linear-measured"], source: "measured-unit-default" };
    if (spec?.dimension?.startsWith("count:")) return { ...INGREDIENT_SCALING_POLICY_REGISTRY["legacy-count-review"], source: "legacy-count-default" };
    return { id: "unknown-unit-review", version: INGREDIENT_SCALING_POLICY_VERSION, mode: INGREDIENT_SCALING_MODES.REVIEW_REQUIRED, source: "missing-unit-policy", description: "This ingredient needs reviewed scaling metadata before Chef Nova can adjust it." };
  }

  function roundByMode(value, mode) {
    if (mode === "up") return Math.ceil(value - EPSILON);
    if (mode === "down") return Math.floor(value + EPSILON);
    return Math.round(value);
  }

  function nearestAllowedFraction(value, allowedFractions = []) {
    const choices = allowedFractions.map(Number).filter((item) => Number.isFinite(item) && item > 0).sort((a, b) => a - b);
    if (!choices.length) return null;
    return choices.reduce((best, choice) => Math.abs(choice - value) < Math.abs(best - value) ? choice : best, choices[0]);
  }

  function buildPracticalScaleExplanation({ ingredient, rawQuantity, practicalQuantity, policy, status }) {
    const name = ingredient?.displayName || ingredient?.displayText || "Ingredient";
    const unit = ingredient?.unit || "";
    if (status === INGREDIENT_SCALE_STATUSES.REVIEW_REQUIRED) return `${name} keeps the calculated quantity for now. Chef Nova needs reviewed scaling metadata before changing it.`;
    if (status === INGREDIENT_SCALE_STATUSES.UNSUPPORTED) return `${name} could not be scaled safely with the current recipe policy.`;
    if (policy?.mode === INGREDIENT_SCALING_MODES.TO_TASTE) return `${name} stays to taste. Start small and adjust while cooking.`;
    if (Number(rawQuantity) !== Number(practicalQuantity)) return `The calculated recipe requires ${roundQuantity(rawQuantity)} ${unit}. Chef Nova adjusted this to ${roundQuantity(practicalQuantity)} ${unit} for practical cooking.`;
    if (policy?.mode === INGREDIENT_SCALING_MODES.FIXED) return `${name} stays fixed for this recipe profile.`;
    return `${name} scales directly with the selected servings.`;
  }

  function checkAdjustmentDeviation(rawQuantity, practicalQuantity, policy) {
    const maximum = Number(policy?.maximumAdjustmentRatio);
    if (!Number.isFinite(maximum) || maximum <= 0 || !Number.isFinite(rawQuantity) || rawQuantity <= 0) return true;
    return Math.abs(practicalQuantity - rawQuantity) / rawQuantity <= maximum + EPSILON;
  }

  function scaleIngredientQuantityWithPracticalRules({ recipe, ingredient, ingredientIndex = 0, selectedServings = recipe?.servings || 1, recipeProfile = getRecipeScalingProfile(recipe), pricingContext = {}, calculationDate } = {}) {
    const baseServings = Number(recipe?.servings) || 1;
    const servings = Number(selectedServings) > 0 ? Number(selectedServings) : baseServings;
    const servingScale = servings / baseServings;
    const rawScaled = scaleIngredientQuantity(ingredient || {}, servingScale);
    const rawQuantity = rawScaled.quantity;
    const policy = resolveIngredientScalingPolicy({ recipe, ingredient, ingredientIndex, recipeProfile });
    const base = {
      version: INGREDIENT_SCALE_RESULT_VERSION,
      recipeId: recipe?.id || null,
      occurrenceId: getIngredientOccurrenceId(recipe, ingredient, ingredientIndex),
      ingredientId: ingredient?.ingredientId || null,
      displayName: ingredient?.displayName || ingredient?.displayText || "Ingredient",
      unit: ingredient?.unit || null,
      policyId: policy.id,
      policyVersion: policy.version,
      policySource: policy.source || null,
      mode: policy.mode,
      rawMathematicalQuantity: rawQuantity,
      rawMathematicalQuantityMax: rawScaled.quantityMax,
      practicalRecipeQuantity: rawQuantity,
      practicalRecipeQuantityMax: rawScaled.quantityMax,
      groceryPurchaseQuantity: null,
      groceryPurchaseUnit: null,
      packageSurplusQuantity: null,
      packageSurplusUnit: null,
      status: INGREDIENT_SCALE_STATUSES.SUPPORTED,
      adjusted: false,
      warnings: [],
      explanation: ""
    };
    if (ingredient?.optional === true && ingredient?.selected !== true) {
      return { ...base, practicalRecipeQuantity: null, practicalRecipeQuantityMax: null, status: INGREDIENT_SCALE_STATUSES.EXCLUDED, explanation: `${base.displayName} is optional and was not selected.` };
    }
    if (!Number.isFinite(Number(rawQuantity)) && ![INGREDIENT_SCALING_MODES.TO_TASTE, INGREDIENT_SCALING_MODES.FIXED].includes(policy.mode)) {
      return { ...base, status: INGREDIENT_SCALE_STATUSES.REVIEW_REQUIRED, warnings: ["Quantity is missing or unmeasurable."], explanation: `${base.displayName} needs a measurable quantity before scaling.` };
    }
    let practical = Number(rawQuantity);
    let practicalMax = Number(rawScaled.quantityMax);
    let status = INGREDIENT_SCALE_STATUSES.SUPPORTED;
    const warnings = [];
    if (policy.mode === INGREDIENT_SCALING_MODES.WHOLE_ITEM) {
      practical = Math.max(Number(policy.minimum) || 0, roundByMode(practical, policy.rounding));
      if (!checkAdjustmentDeviation(Number(rawQuantity), practical, policy)) {
        status = INGREDIENT_SCALE_STATUSES.UNSUPPORTED;
        warnings.push("Whole-item adjustment exceeds the reviewed limit.");
      }
    } else if (policy.mode === INGREDIENT_SCALING_MODES.ALLOWED_FRACTIONS) {
      const nearest = nearestAllowedFraction(practical, policy.allowedFractions);
      if (nearest === null) {
        status = INGREDIENT_SCALE_STATUSES.REVIEW_REQUIRED;
        warnings.push("Allowed fractions are missing.");
      } else {
        practical = nearest;
      }
    } else if (policy.mode === INGREDIENT_SCALING_MODES.FIXED) {
      practical = Number(ingredient?.quantity);
      practicalMax = Number(ingredient?.quantityMax);
    } else if (policy.mode === INGREDIENT_SCALING_MODES.TO_TASTE) {
      practical = null;
      practicalMax = null;
    } else if (policy.mode === INGREDIENT_SCALING_MODES.LINEAR_WITH_MINIMUM) {
      const minimum = Number(policy.minimum ?? ingredient?.minimumPracticalQuantity);
      if (Number.isFinite(minimum) && practical < minimum) practical = minimum;
    } else if (policy.mode === INGREDIENT_SCALING_MODES.LINEAR_WITH_CAP) {
      const maximum = Number(policy.maximum ?? ingredient?.maximumPracticalQuantity);
      if (Number.isFinite(maximum) && practical > maximum) practical = maximum;
    } else if (policy.mode === INGREDIENT_SCALING_MODES.RANGE) {
      practicalMax = Number.isFinite(practicalMax) ? practicalMax : practical;
    } else if (policy.mode === INGREDIENT_SCALING_MODES.REVIEW_REQUIRED) {
      status = INGREDIENT_SCALE_STATUSES.REVIEW_REQUIRED;
      warnings.push(policy.description || "Reviewed scaling policy is required.");
    } else if (policy.mode === INGREDIENT_SCALING_MODES.UNSUPPORTED) {
      status = INGREDIENT_SCALE_STATUSES.UNSUPPORTED;
      warnings.push(policy.description || "This recipe yield is not supported.");
    }
    practical = Number.isFinite(practical) ? roundQuantity(practical) : practical;
    practicalMax = Number.isFinite(practicalMax) ? roundQuantity(practicalMax) : null;
    const adjusted = Number.isFinite(Number(rawQuantity)) && Number.isFinite(Number(practical)) && Math.abs(Number(rawQuantity) - Number(practical)) > EPSILON;
    if (adjusted && status === INGREDIENT_SCALE_STATUSES.SUPPORTED) status = INGREDIENT_SCALE_STATUSES.ADJUSTED;
    const purchasePreview = calculateIngredientPurchasePreview({ ingredient, practicalQuantity: practical, pricingContext, calculationDate });
    return {
      ...base,
      practicalRecipeQuantity: practical,
      practicalRecipeQuantityMax: practicalMax,
      groceryPurchaseQuantity: purchasePreview.groceryPurchaseQuantity,
      groceryPurchaseUnit: purchasePreview.groceryPurchaseUnit,
      packageSurplusQuantity: purchasePreview.packageSurplusQuantity,
      packageSurplusUnit: purchasePreview.packageSurplusUnit,
      status,
      adjusted,
      warnings,
      explanation: buildPracticalScaleExplanation({ ingredient, rawQuantity, practicalQuantity: practical, policy, status })
    };
  }

  function calculateIngredientPurchasePreview({ ingredient, practicalQuantity, pricingContext = {}, calculationDate } = {}) {
    if (!ingredient?.ingredientId || !Number.isFinite(Number(practicalQuantity)) || Number(practicalQuantity) <= 0 || !priceData?.resolveIngredientPrice) return { groceryPurchaseQuantity: null, groceryPurchaseUnit: null, packageSurplusQuantity: null, packageSurplusUnit: null };
    const required = normalizeComparableQuantity(practicalQuantity, ingredient.unit);
    if (!required.valid) return { groceryPurchaseQuantity: null, groceryPurchaseUnit: null, packageSurplusQuantity: null, packageSurplusUnit: null };
    const resolution = priceData.resolveIngredientPrice({ ingredientId: ingredient.ingredientId, ...pricingContext, calculationDate });
    if (!resolution || resolution.status !== "resolved") return { groceryPurchaseQuantity: null, groceryPurchaseUnit: null, packageSurplusQuantity: null, packageSurplusUnit: null };
    const priced = normalizeComparableQuantity(resolution.entry.pricedQuantity, resolution.entry.pricedUnit);
    if (!priced.valid || priced.dimension !== required.dimension || resolution.entry.priceBasis === "unit-rate") return { groceryPurchaseQuantity: required.quantity, groceryPurchaseUnit: required.unit, packageSurplusQuantity: 0, packageSurplusUnit: required.unit };
    const packages = Math.ceil((required.quantity / priced.quantity) - EPSILON);
    const purchasedQuantity = roundQuantity(packages * priced.quantity);
    return { groceryPurchaseQuantity: purchasedQuantity, groceryPurchaseUnit: priced.unit, packageSurplusQuantity: Math.max(0, roundQuantity(purchasedQuantity - required.quantity)), packageSurplusUnit: required.unit };
  }

  function detectIngredientDependencyCycle(ingredientResults) {
    const graph = new Map();
    ingredientResults.forEach((result) => {
      const deps = Array.isArray(result.dependencyIds) ? result.dependencyIds : [];
      graph.set(result.occurrenceId, deps);
    });
    const visiting = new Set();
    const visited = new Set();
    function visit(id) {
      if (visiting.has(id)) return true;
      if (visited.has(id)) return false;
      visiting.add(id);
      const hasCycle = (graph.get(id) || []).some(visit);
      visiting.delete(id);
      visited.add(id);
      return hasCycle;
    }
    return Array.from(graph.keys()).some(visit);
  }

  function scaleRecipeWithPracticalRules({ recipe, selectedServings = recipe?.servings || 1, pricingContext = {}, calculationDate } = {}) {
    const recipeProfile = getRecipeScalingProfile(recipe);
    const baseServings = Number(recipe?.servings) || 1;
    const requestedServings = Number(selectedServings) > 0 ? Number(selectedServings) : baseServings;
    const ingredients = Array.isArray(recipe?.structuredIngredients) ? recipe.structuredIngredients : [];
    const scaleFactor = requestedServings / baseServings;
    const ingredientResults = ingredients.map((ingredient, ingredientIndex) => {
      const result = scaleIngredientQuantityWithPracticalRules({ recipe, ingredient, ingredientIndex, selectedServings: requestedServings, recipeProfile, pricingContext, calculationDate });
      const deps = ingredient?.scalingPolicy?.dependsOnOccurrenceId || ingredient?.scaling?.dependsOnOccurrenceId;
      return { ...result, dependencyIds: Array.isArray(deps) ? deps : deps ? [deps] : [] };
    });
    const cycleDetected = detectIngredientDependencyCycle(ingredientResults);
    const status = cycleDetected || ingredientResults.some((item) => item.status === INGREDIENT_SCALE_STATUSES.UNSUPPORTED)
      ? RECIPE_SCALE_PROFILE_STATUSES.UNSUPPORTED
      : ingredientResults.some((item) => item.status === INGREDIENT_SCALE_STATUSES.REVIEW_REQUIRED)
        ? RECIPE_SCALE_PROFILE_STATUSES.REVIEW_REQUIRED
        : RECIPE_SCALE_PROFILE_STATUSES.SUPPORTED;
    const scaledIngredients = ingredients.map((ingredient, index) => {
      const result = ingredientResults[index];
      if (result.status === INGREDIENT_SCALE_STATUSES.EXCLUDED) return { ...ingredient, optional: true, excludedFromPracticalScaling: true };
      return {
        ...ingredient,
        quantity: result.practicalRecipeQuantity,
        quantityMax: result.practicalRecipeQuantityMax,
        practicalScaling: {
          resultVersion: result.version,
          rawMathematicalQuantity: result.rawMathematicalQuantity,
          practicalRecipeQuantity: result.practicalRecipeQuantity,
          groceryPurchaseQuantity: result.groceryPurchaseQuantity,
          groceryPurchaseUnit: result.groceryPurchaseUnit,
          packageSurplusQuantity: result.packageSurplusQuantity,
          packageSurplusUnit: result.packageSurplusUnit,
          status: result.status,
          adjusted: result.adjusted,
          explanation: result.explanation
        }
      };
    });
    return {
      version: RECIPE_SCALE_RESULT_VERSION,
      recipeId: recipe?.id || null,
      recipeName: recipe?.name || "",
      policyVersion: INGREDIENT_SCALING_POLICY_VERSION,
      recipeScaleProfileVersion: recipeProfile.version,
      scalingClass: recipeProfile.scalingClass,
      requestedServings,
      effectiveServings: requestedServings,
      baseServings,
      scaleFactor: roundQuantity(scaleFactor),
      status,
      cycleDetected,
      ingredientResults,
      materialAdjustments: ingredientResults.filter((item) => item.adjusted || item.status !== INGREDIENT_SCALE_STATUSES.SUPPORTED),
      warnings: [
        ...(cycleDetected ? ["Ingredient dependency cycle detected."] : []),
        ...ingredientResults.flatMap((item) => item.warnings || [])
      ],
      scaledRecipe: { ...recipe, servings: requestedServings, structuredIngredients: scaledIngredients, practicalScaleResultVersion: RECIPE_SCALE_RESULT_VERSION }
    };
  }

  function calculateIngredientUseCost({ recipe, ingredient, ingredientIndex = 0, selectedServings = recipe?.servings || 1, pricingContext = {}, calculationDate }) {
    const baseServings = Number(recipe?.servings);
    const servings = Number(selectedServings);
    const warnings = [];
    const baseResult = {
      recipeId: recipe?.id || null,
      ingredientIndex,
      ingredientId: ingredient?.ingredientId || null,
      form: ingredient?.form || null,
      displayText: ingredient?.displayText || ingredient?.displayName || "Ingredient",
      originalRequiredQuantity: ingredient?.quantity ?? null,
      originalRequiredUnit: ingredient?.unit || null,
      normalizedRequiredQuantity: null,
      normalizedRequiredUnit: null,
      selectedPriceSource: pricingContext.selectedPriceSource || null,
      resolvedPriceSource: null,
      priceEntryId: null,
      effectivePriceCents: null,
      pricedQuantity: null,
      pricedUnit: null,
      ingredientUseCostCents: null,
      ingredientUseCostMinCents: null,
      ingredientUseCostMaxCents: null,
      status: COST_STATUSES.MISSING_QUANTITY,
      usedFallback: false,
      usingSalePrice: false,
      warnings
    };
    if (!ingredient?.ingredientId) return { ...baseResult, status: ingredient?.resolutionStatus === "ambiguous" ? COST_STATUSES.AMBIGUOUS_INGREDIENT : COST_STATUSES.AMBIGUOUS_INGREDIENT, warnings: ["This ingredient is not connected to the ingredient catalogue."] };
    if (!Number.isFinite(baseServings) || baseServings <= 0 || !Number.isFinite(servings) || servings <= 0) return { ...baseResult, warnings: ["Serving information is missing or invalid."] };
    if ([MEASUREMENT_STATUSES.UNQUANTIFIED, MEASUREMENT_STATUSES.TO_TASTE, MEASUREMENT_STATUSES.AS_NEEDED, MEASUREMENT_STATUSES.PACKAGE_SIZE_UNKNOWN, MEASUREMENT_STATUSES.UNRESOLVED].includes(ingredient.measurementStatus)) {
      return { ...baseResult, status: COST_STATUSES.MISSING_QUANTITY, warnings: ["This ingredient needs a measurable amount before cost can be calculated."] };
    }
    const scaled = scaleIngredientQuantityWithPracticalRules({ recipe, ingredient, ingredientIndex, selectedServings: servings, pricingContext, calculationDate });
    if ([INGREDIENT_SCALE_STATUSES.UNSUPPORTED, INGREDIENT_SCALE_STATUSES.EXCLUDED].includes(scaled.status)) {
      return { ...baseResult, status: COST_STATUSES.MISSING_QUANTITY, warnings: scaled.warnings.length ? scaled.warnings : [scaled.explanation || "This ingredient cannot be costed for the selected serving profile."] };
    }
    const required = normalizeComparableQuantity(scaled.practicalRecipeQuantity, ingredient.unit);
    if (!required.valid) return { ...baseResult, status: required.status, warnings: [required.message] };
    const requiredMax = ingredient.measurementStatus === MEASUREMENT_STATUSES.RANGE ? normalizeComparableQuantity(scaled.practicalRecipeQuantityMax, ingredient.unit) : required;
    const resolution = priceData.resolveIngredientPrice({ ingredientId: ingredient.ingredientId, ...pricingContext, calculationDate });
    if (!resolution || resolution.status !== "resolved") return { ...baseResult, normalizedRequiredQuantity: required.quantity, normalizedRequiredUnit: required.unit, status: COST_STATUSES.MISSING_PRICE, warnings: ["No usable price was found."] };
    if (!formCompatible(ingredient, resolution.entry)) return { ...baseResult, status: COST_STATUSES.FORM_MISMATCH, warnings: ["The saved price is for a different ingredient form."] };
    const priced = normalizeComparableQuantity(resolution.entry.pricedQuantity, resolution.entry.pricedUnit);
    if (!quantitiesCompatible(required, priced)) {
      const packageSizeUnknown = priced.valid && priced.dimension.startsWith("count:") && (required.dimension === "mass" || required.dimension === "volume");
      return { ...baseResult, normalizedRequiredQuantity: required.quantity, normalizedRequiredUnit: required.unit, resolvedPriceSource: resolution.entry.sourceType, priceEntryId: resolution.entry.id, status: packageSizeUnknown ? COST_STATUSES.UNKNOWN_PACKAGE_SIZE : COST_STATUSES.INCOMPATIBLE_UNIT, warnings: [`A price is available per ${resolution.entry.pricedUnit}, but the recipe quantity uses ${ingredient.unit}.`] };
    }
    const priceInfo = effectivePriceInfo(resolution.entry, calculationDate);
    const minCost = roundMoney(priceInfo.effectivePriceCents * required.quantity / priced.quantity);
    const maxCost = roundMoney(priceInfo.effectivePriceCents * (requiredMax.valid ? requiredMax.quantity : required.quantity) / priced.quantity);
    const status = ingredient.measurementStatus === MEASUREMENT_STATUSES.APPROXIMATE || ingredient.measurementStatus === MEASUREMENT_STATUSES.RANGE || sourceStatus(resolution) === COST_STATUSES.ESTIMATED ? COST_STATUSES.ESTIMATED : COST_STATUSES.RESOLVED;
    return { ...baseResult, normalizedRequiredQuantity: required.quantity, normalizedRequiredUnit: required.unit, resolvedPriceSource: resolution.entry.sourceType, priceEntryId: resolution.entry.id, effectivePriceCents: priceInfo.effectivePriceCents, pricedQuantity: priced.quantity, pricedUnit: priced.unit, ingredientUseCostCents: maxCost, ingredientUseCostMinCents: minCost, ingredientUseCostMaxCents: maxCost, status, usedFallback: resolution.usedFallback === true, usingSalePrice: priceInfo.usingSalePrice, warnings };
  }

  function calculateRecipeCostSummary({ recipe, selectedServings, pricingContext = {}, calculationDate }) {
    const ingredients = Array.isArray(recipe?.structuredIngredients) ? recipe.structuredIngredients : [];
    const results = ingredients.filter((ingredient) => ingredient.optional !== true).map((ingredient, index) => calculateIngredientUseCost({ recipe, ingredient, ingredientIndex: index, selectedServings, pricingContext, calculationDate }));
    const resolved = results.filter((result) => Number.isInteger(result.ingredientUseCostCents));
    const unresolved = results.filter((result) => !Number.isInteger(result.ingredientUseCostCents));
    const knownSubtotal = resolved.reduce((sum, result) => sum + result.ingredientUseCostCents, 0);
    const minSubtotal = resolved.reduce((sum, result) => sum + (result.ingredientUseCostMinCents ?? result.ingredientUseCostCents), 0);
    const maxSubtotal = resolved.reduce((sum, result) => sum + (result.ingredientUseCostMaxCents ?? result.ingredientUseCostCents), 0);
    const servings = Number(selectedServings) > 0 ? Number(selectedServings) : Number(recipe?.servings) || 1;
    const complete = results.length > 0 && unresolved.length === 0;
    return {
      recipeId: recipe?.id || null,
      selectedServings: servings,
      ingredientCostResults: results,
      knownIngredientCostSubtotalCents: knownSubtotal,
      totalRecipeCostCents: complete ? knownSubtotal : null,
      estimatedRecipeCostMinCents: complete ? minSubtotal : null,
      estimatedRecipeCostMaxCents: complete ? maxSubtotal : null,
      costPerServingCents: complete ? roundMoney(knownSubtotal / servings) : null,
      costPerServingMinCents: complete ? roundMoney(minSubtotal / servings) : null,
      costPerServingMaxCents: complete ? roundMoney(maxSubtotal / servings) : null,
      pricedIngredientCount: resolved.length,
      totalCostRelevantIngredientCount: results.length,
      priceCoveragePercent: results.length ? roundQuantity(resolved.length / results.length * 100) : null,
      status: complete ? (results.some((result) => result.status === COST_STATUSES.ESTIMATED) ? COST_STATUSES.ESTIMATED : COST_STATUSES.RESOLVED) : COST_STATUSES.INCOMPLETE,
      unresolvedIngredientCount: unresolved.length
    };
  }

  function getRecipeById(recipes, id) {
    return (recipes || []).find((recipe) => recipe.id === id) || null;
  }

  function collectMealRequirements({ meals = [], recipes = [], pricingContext = {}, calculationDate }) {
    const requirements = [];
    const recipeCostSummaries = [];
    meals.forEach((meal, mealIndex) => {
      const recipe = meal.recipe || getRecipeById(recipes, meal.recipeId || meal.entry?.recipeId);
      if (!recipe) return;
      const selectedServings = Number(meal.servings ?? meal.entry?.servings ?? recipe.servings) || recipe.servings || 1;
      const summary = calculateRecipeCostSummary({ recipe, selectedServings, pricingContext, calculationDate });
      recipeCostSummaries.push({ ...summary, mealId: meal.mealId || `${meal.day || "meal"}-${meal.mealType || mealIndex}` });
      (recipe.structuredIngredients || []).filter((ingredient) => ingredient.optional !== true).forEach((ingredient, ingredientIndex) => {
        const scaled = scaleIngredientQuantityWithPracticalRules({ recipe, ingredient, ingredientIndex, selectedServings, pricingContext, calculationDate });
        const planningQuantity = ingredient.measurementStatus === MEASUREMENT_STATUSES.RANGE && Number.isFinite(Number(scaled.practicalRecipeQuantityMax)) ? scaled.practicalRecipeQuantityMax : scaled.practicalRecipeQuantity;
        const normalized = normalizeComparableQuantity(planningQuantity, ingredient.unit);
        requirements.push({ recipeId: recipe.id, mealId: meal.mealId || `${meal.day || "meal"}-${meal.mealType || mealIndex}`, ingredientIndex, ingredient, normalized, quantity: planningQuantity, unit: ingredient.unit });
      });
    });
    return { requirements, recipeCostSummaries };
  }

  function normalizePantryInventory(pantry = [], ingredientResolver) {
    return (Array.isArray(pantry) ? pantry : []).map((item) => {
      const resolved = item.ingredientId ? { status: "resolved", ingredientId: item.ingredientId } : ingredientResolver?.(item.name) || {};
      const quantity = Number(item.quantity);
      const unit = item.unit || "each";
      const normalized = Number.isFinite(quantity) && quantity > 0 ? normalizeComparableQuantity(quantity, unit) : null;
      return { itemId: item.id || null, ingredientId: resolved.ingredientId || null, form: item.form || null, quantity, unit, normalized, raw: item };
    }).filter((item) => item.ingredientId);
  }

  function buildPurchaseGroupKey(requirement) {
    if (!requirement.ingredient?.ingredientId || !requirement.normalized?.valid) return `unresolved::${requirement.mealId}::${requirement.ingredientIndex}`;
    return [requirement.ingredient.ingredientId, requirement.ingredient.form || "default", requirement.normalized.dimension].join("::");
  }

  function aggregateIngredientRequirements({ requirements, pantry = [], ingredientResolver, pricingContext = {}, calculationDate }) {
    const pantryInventory = normalizePantryInventory(pantry, ingredientResolver);
    const grouped = new Map();
    requirements.forEach((requirement) => {
      const key = buildPurchaseGroupKey(requirement);
      if (!grouped.has(key)) grouped.set(key, { purchaseGroupId: key, ingredientId: requirement.ingredient.ingredientId || null, form: requirement.ingredient.form || null, recipeContributions: [], totalRequiredQuantity: 0, totalRequiredUnit: requirement.normalized?.unit || requirement.unit || null, dimension: requirement.normalized?.dimension || null, warnings: [], status: COST_STATUSES.RESOLVED });
      const group = grouped.get(key);
      group.recipeContributions.push({ recipeId: requirement.recipeId, mealId: requirement.mealId, quantity: requirement.quantity, unit: requirement.unit, displayText: requirement.ingredient.displayText });
      if (requirement.normalized?.valid) group.totalRequiredQuantity = roundQuantity(group.totalRequiredQuantity + requirement.normalized.quantity);
      else { group.status = requirement.normalized?.status || COST_STATUSES.MISSING_QUANTITY; group.warnings.push(requirement.normalized?.message || "This ingredient needs a measurable amount."); }
    });
    return Array.from(grouped.values()).map((group) => calculatePurchaseGroup(group, pantryInventory, pricingContext, calculationDate));
  }

  function calculatePurchaseGroup(group, pantryInventory, pricingContext, calculationDate) {
    const warnings = [...group.warnings];
    let pantryQuantityApplied = 0;
    pantryInventory.filter((item) => item.ingredientId === group.ingredientId && (!group.form || !item.form || item.form === group.form)).forEach((item) => {
      if (!item.normalized?.valid) {
        warnings.push(`${item.raw?.name || "A pantry item"} is in the Pantry, but its quantity is unknown.`);
        return;
      }
      if (item.normalized.dimension === group.dimension) pantryQuantityApplied = roundQuantity(pantryQuantityApplied + item.normalized.quantity);
      else warnings.push(`${item.raw?.name || "A pantry item"} is in the Pantry, but its unit cannot be safely compared.`);
    });
    const missingQuantity = Math.max(0, roundQuantity((group.totalRequiredQuantity || 0) - pantryQuantityApplied));
    const base = { ...group, pantryQuantityApplied, pantryUnit: group.totalRequiredUnit, missingQuantity, missingUnit: group.totalRequiredUnit, priceEntryId: null, priceBasis: null, effectivePriceCents: null, pricedQuantity: null, pricedUnit: null, packagesRequired: null, purchasedQuantity: null, purchasedUnit: group.totalRequiredUnit, estimatedSurplusQuantity: null, estimatedSurplusUnit: group.totalRequiredUnit, purchaseCostCents: null, usedFallback: false, usingSalePrice: false, priceSourceKind: null, warnings };
    if (!group.ingredientId) return { ...base, status: COST_STATUSES.AMBIGUOUS_INGREDIENT };
    if (!group.totalRequiredQuantity || group.status !== COST_STATUSES.RESOLVED) return { ...base, status: group.status || COST_STATUSES.MISSING_QUANTITY };
    if (missingQuantity <= EPSILON) return { ...base, missingQuantity: 0, packagesRequired: 0, purchasedQuantity: 0, estimatedSurplusQuantity: 0, purchaseCostCents: 0, status: COST_STATUSES.RESOLVED };
    const resolution = priceData.resolveIngredientPrice({ ingredientId: group.ingredientId, ...pricingContext, calculationDate });
    if (!resolution || resolution.status !== "resolved") return { ...base, status: COST_STATUSES.MISSING_PRICE, warnings: [...warnings, "No usable price was found."] };
    if (resolution.entry.form && group.form && resolution.entry.form !== group.form) return { ...base, status: COST_STATUSES.FORM_MISMATCH, warnings: [...warnings, "The saved price is for a different ingredient form."] };
    const priced = normalizeComparableQuantity(resolution.entry.pricedQuantity, resolution.entry.pricedUnit);
    if (!priced.valid) return { ...base, status: COST_STATUSES.UNKNOWN_PACKAGE_SIZE, warnings: [...warnings, "The selected price needs a measurable package size."] };
    if (priced.dimension !== group.dimension) {
      const packageSizeUnknown = priced.dimension.startsWith("count:") && (group.dimension === "mass" || group.dimension === "volume");
      return { ...base, priceEntryId: resolution.entry.id, status: packageSizeUnknown ? COST_STATUSES.UNKNOWN_PACKAGE_SIZE : COST_STATUSES.INCOMPATIBLE_UNIT, warnings: [...warnings, `The recipe needs ${group.totalRequiredUnit}, but the selected price uses ${resolution.entry.pricedUnit}.`] };
    }
    const priceInfo = effectivePriceInfo(resolution.entry, calculationDate);
    if (resolution.entry.priceBasis === "unit-rate") {
      return { ...base, priceEntryId: resolution.entry.id, priceBasis: resolution.entry.priceBasis, effectivePriceCents: priceInfo.effectivePriceCents, pricedQuantity: priced.quantity, pricedUnit: priced.unit, packagesRequired: null, purchasedQuantity: missingQuantity, estimatedSurplusQuantity: 0, purchaseCostCents: roundMoney(priceInfo.effectivePriceCents * missingQuantity / priced.quantity), status: sourceStatus(resolution), usedFallback: resolution.usedFallback === true, usingSalePrice: priceInfo.usingSalePrice, priceSourceKind: priceSourceKind(resolution) };
    }
    const packagesRequired = Math.max(0, Math.ceil((missingQuantity / priced.quantity) - EPSILON));
    const purchasedQuantity = roundQuantity(packagesRequired * priced.quantity);
    return { ...base, priceEntryId: resolution.entry.id, priceBasis: resolution.entry.priceBasis, effectivePriceCents: priceInfo.effectivePriceCents, pricedQuantity: priced.quantity, pricedUnit: priced.unit, packagesRequired, purchasedQuantity, estimatedSurplusQuantity: Math.max(0, roundQuantity(purchasedQuantity - missingQuantity)), purchaseCostCents: packagesRequired * priceInfo.effectivePriceCents, status: sourceStatus(resolution), usedFallback: resolution.usedFallback === true, usingSalePrice: priceInfo.usingSalePrice, priceSourceKind: priceSourceKind(resolution) };
  }

  function calculateBudgetVariance({ weeklyGroceryCostCents, weeklyBudgetCents, planningTargetCents }) {
    if (!Number.isInteger(weeklyGroceryCostCents) || !Number.isInteger(weeklyBudgetCents)) return { remainingBudgetCents: null, amountAboveBudgetCents: null, remainingPlanningTargetCents: null, amountAbovePlanningTargetCents: null };
    const target = Number.isInteger(planningTargetCents) ? planningTargetCents : weeklyBudgetCents;
    return { remainingBudgetCents: Math.max(0, weeklyBudgetCents - weeklyGroceryCostCents), amountAboveBudgetCents: Math.max(0, weeklyGroceryCostCents - weeklyBudgetCents), remainingPlanningTargetCents: Math.max(0, target - weeklyGroceryCostCents), amountAbovePlanningTargetCents: Math.max(0, weeklyGroceryCostCents - target) };
  }

  function calculateWeeklyPurchaseSummary(purchaseGroups, recipeCostSummaries, budgetContext = {}) {
    const purchaseRelevant = purchaseGroups.filter((group) => group.missingQuantity > EPSILON);
    const priced = purchaseRelevant.filter((group) => Number.isInteger(group.purchaseCostCents));
    const unresolved = purchaseRelevant.filter((group) => !Number.isInteger(group.purchaseCostCents));
    const knownPurchaseSubtotalCents = priced.reduce((sum, group) => sum + group.purchaseCostCents, 0);
    const complete = unresolved.length === 0;
    const noPurchases = purchaseRelevant.length === 0;
    const recipeResults = recipeCostSummaries.flatMap((summary) => summary.ingredientCostResults || []);
    const recipePriced = recipeResults.filter((result) => Number.isInteger(result.ingredientUseCostCents)).length;
    const recipeTotal = recipeResults.length;
    const confirmedCount = priced.filter((group) => group.priceSourceKind === "confirmed").length;
    const estimateCount = priced.filter((group) => group.priceSourceKind === "estimate").length;
    const weeklyGroceryCostCents = complete ? knownPurchaseSubtotalCents : null;
    return {
      knownPurchaseSubtotalCents,
      weeklyGroceryCostCents,
      weeklyBudgetCents: Number.isInteger(budgetContext.weeklyBudgetCents) ? budgetContext.weeklyBudgetCents : null,
      planningTargetCents: Number.isInteger(budgetContext.planningTargetCents) ? budgetContext.planningTargetCents : null,
      ...calculateBudgetVariance({ weeklyGroceryCostCents, weeklyBudgetCents: budgetContext.weeklyBudgetCents, planningTargetCents: budgetContext.planningTargetCents }),
      totalPurchaseGroupCount: purchaseRelevant.length,
      pricedPurchaseGroupCount: priced.length,
      unresolvedPurchaseGroupCount: unresolved.length,
      recipeCostCoveragePercent: recipeTotal ? roundQuantity(recipePriced / recipeTotal * 100) : null,
      purchaseCostCoveragePercent: purchaseRelevant.length ? roundQuantity(priced.length / purchaseRelevant.length * 100) : null,
      resolvedPriceCoveragePercent: purchaseRelevant.length ? roundQuantity(priced.length / purchaseRelevant.length * 100) : null,
      confirmedPriceCoveragePercent: purchaseRelevant.length ? roundQuantity(confirmedCount / purchaseRelevant.length * 100) : null,
      estimatePriceCoveragePercent: purchaseRelevant.length ? roundQuantity(estimateCount / purchaseRelevant.length * 100) : null,
      status: noPurchases ? COST_STATUSES.NO_PURCHASES_REQUIRED : complete ? COST_STATUSES.ESTIMATED : COST_STATUSES.INCOMPLETE
    };
  }

  function calculateMealPlanCosts(options = {}) {
    const calculationDate = options.calculationDate || new Date().toISOString().slice(0, 10);
    const { requirements, recipeCostSummaries } = collectMealRequirements({ meals: options.meals || [], recipes: options.recipes || [], pricingContext: options.pricingContext || {}, calculationDate });
    const purchaseGroups = aggregateIngredientRequirements({ requirements, pantry: options.pantry || [], ingredientResolver: options.ingredientResolver, pricingContext: options.pricingContext || {}, calculationDate });
    const weeklySummary = calculateWeeklyPurchaseSummary(purchaseGroups, recipeCostSummaries, options.budgetContext || {});
    const unresolvedItems = [...recipeCostSummaries.flatMap((summary) => summary.ingredientCostResults.filter((result) => !Number.isInteger(result.ingredientUseCostCents))), ...purchaseGroups.filter((group) => group.missingQuantity > EPSILON && !Number.isInteger(group.purchaseCostCents))];
    return { calculationVersion: COST_CALCULATION_VERSION, calculatedAt: new Date().toISOString(), recipeCostSummaries, purchaseGroups, weeklySummary, unresolvedItems, warnings: purchaseGroups.flatMap((group) => group.warnings || []) };
  }

  return { COST_CALCULATION_VERSION, COST_STATUSES, UNIT_FACTORS, INGREDIENT_SCALING_POLICY_VERSION, RECIPE_SCALING_PROFILE_VERSION, INGREDIENT_SCALE_RESULT_VERSION, RECIPE_SCALE_RESULT_VERSION, INGREDIENT_SCALING_MODES, INGREDIENT_SCALE_STATUSES, RECIPE_SCALE_PROFILE_STATUSES, RECIPE_SCALING_CLASSES, INGREDIENT_SCALING_POLICY_REGISTRY, roundMoney, roundQuantity, normalizeComparableQuantity, scaleIngredientQuantity, scaleIngredientQuantityWithPracticalRules, scaleRecipeWithPracticalRules, calculateIngredientUseCost, calculateRecipeCostSummary, aggregateIngredientRequirements, calculatePackagePurchase: calculatePurchaseGroup, calculateUnitRatePurchase: calculatePurchaseGroup, calculateWeeklyPurchaseSummary, calculateBudgetVariance, calculateMealPlanCosts };
});
