const assert = require("assert");
const eligibility = require("../scripts/recipe-eligibility-ranking.js");

const ingredientCatalogue = {
  ingredients: [
    { id: "peanut-butter", name: "Peanut butter", allergenIds: ["peanuts"], dietaryTags: ["vegetarian"] },
    { id: "noodles", name: "Noodles", allergenIds: ["wheat"], dietaryTags: ["vegan"] },
    { id: "chicken", name: "Chicken", allergenIds: [], dietaryTags: [] },
    { id: "tofu", name: "Tofu", allergenIds: ["soy"], dietaryTags: ["vegan", "vegetarian"] },
    { id: "spinach", name: "Spinach", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "frozen-spinach", name: "Frozen spinach", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "rice", name: "Rice", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] }
  ]
};

function recipe(overrides = {}) {
  return {
    id: "test-recipe",
    name: "Test Recipe",
    dietaryTags: ["Vegetarian"],
    allergies: [],
    servings: 4,
    cookingTime: 20,
    totalTime: 25,
    structuredIngredients: [
      { ingredientId: "rice", displayName: "Rice", optional: false, resolutionStatus: "resolved" }
    ],
    ...overrides
  };
}

function evaluate(testRecipe, context = {}) {
  return eligibility.evaluateRecipeEligibility({
    recipe: testRecipe,
    eligibilityContext: {
      allergies: { allergenIds: [] },
      dietaryRequirements: [],
      availableAppliances: [],
      maximumCookingTimeMinutes: null,
      requiredServings: 2,
      ingredientAvailability: { explicitlyUnavailableIngredientIds: [], explicitlyUnavailableNames: [], purchasePolicy: "allow-grocery-purchases" },
      ...context
    },
    ingredientCatalogue
  });
}

let result = evaluate(recipe({ allergies: ["Peanuts"] }), { allergies: { allergenIds: ["peanut"] } });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE);
assert.strictEqual(result.exclusionReasons[0].code, eligibility.RECIPE_EXCLUSION_REASONS.ALLERGEN_MATCH);
assert.strictEqual(result.hardEligible, false);
assert.strictEqual(result.primaryReasonCode, eligibility.RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_PRESENT);
assert(result.reasonCodes.includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_PRESENT));

result = evaluate(recipe({ allergies: [], structuredIngredients: [{ ingredientId: "peanut-butter", displayName: "Peanut butter", optional: false, resolutionStatus: "resolved" }] }), { allergies: { allergenIds: ["peanuts"] } });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE, "Ingredient-level allergens must exclude recipes.");

result = evaluate(recipe({ allergies: undefined, allergenIds: undefined, allergens: undefined }), { allergies: { allergenIds: ["peanuts"] } });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INDETERMINATE, "Missing allergen metadata must not be automatic approval.");

result = evaluate(recipe({ dietaryTags: ["Vegetarian"], structuredIngredients: [{ ingredientId: "chicken", displayName: "Chicken", optional: false, resolutionStatus: "resolved" }] }), { dietaryRequirements: ["vegan"] });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE);
assert.strictEqual(result.exclusionReasons[0].code, eligibility.RECIPE_EXCLUSION_REASONS.DIETARY_VIOLATION);

result = evaluate(recipe({ preparationMethods: [{ id: "oven", requiredAppliances: ["oven"], totalTimeMinutes: 25 }] }), { availableAppliances: ["stove"] });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE);
assert.strictEqual(result.exclusionReasons[0].code, eligibility.RECIPE_EXCLUSION_REASONS.APPLIANCE_UNAVAILABLE);

result = evaluate(recipe({ preparationMethods: [{ id: "oven", requiredAppliances: ["oven"], totalTimeMinutes: 40 }, { id: "air-fryer", requiredAppliances: ["air-fryer"], totalTimeMinutes: 25 }] }), { availableAppliances: ["air-fryer"], maximumCookingTimeMinutes: 30 });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE);
assert.strictEqual(result.selectedPreparationMethodId, "air-fryer");

result = evaluate(recipe({ totalTime: 35 }), { maximumCookingTimeMinutes: 30 });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE);
assert.strictEqual(result.exclusionReasons[0].code, eligibility.RECIPE_EXCLUSION_REASONS.COOKING_TIME_EXCEEDED);

result = evaluate(recipe({ totalTime: undefined, cookingTime: undefined }), { maximumCookingTimeMinutes: 30 });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INDETERMINATE);
assert.strictEqual(result.exclusionReasons[0].code, eligibility.RECIPE_EXCLUSION_REASONS.COOKING_TIME_UNKNOWN);

result = evaluate(recipe({ servings: 4, scalable: false, batchable: false }), { requiredServings: 6 });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE);
assert.strictEqual(result.exclusionReasons[0].code, eligibility.RECIPE_EXCLUSION_REASONS.SERVINGS_UNSUPPORTED);

result = evaluate(recipe({ servings: 4, scalable: false, batchable: true, maximumBatches: 2, totalTime: 20 }), { requiredServings: 8, maximumCookingTimeMinutes: 45 });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE);
assert.strictEqual(result.batchCount, 2);

result = evaluate(recipe({ structuredIngredients: [{ ingredientId: "spinach", displayName: "Spinach", optional: false, resolutionStatus: "resolved" }] }), {
  ingredientAvailability: { explicitlyUnavailableIngredientIds: ["spinach"], purchasePolicy: "allow-grocery-purchases" }
});
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE);
assert(result.exclusionReasons.some((reason) => reason.code === eligibility.RECIPE_EXCLUSION_REASONS.NO_VALID_SUBSTITUTE));

result = evaluate(recipe({
  structuredIngredients: [{ ingredientId: "spinach", displayName: "Spinach", optional: false, resolutionStatus: "resolved" }],
  approvedSubstitutions: [{ originalIngredientId: "spinach", substituteIngredientId: "frozen-spinach", quantityRule: { type: "same" }, allowedRecipeIds: ["test-recipe"] }]
}), { ingredientAvailability: { explicitlyUnavailableIngredientIds: ["spinach"], purchasePolicy: "allow-grocery-purchases" } });
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE, "Recipe-approved substitutes may keep a recipe eligible.");

result = evaluate(recipe({ structuredIngredients: [{ ingredientId: "rice", displayName: "Rice", optional: false, resolutionStatus: "resolved" }] }), {
  foodSafetyGuardrail: { excludedIngredientIds: ["rice"], hardExclusionsCannotBeOverridden: true }
});
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE, "Food-safety exclusions must block automatic planning.");
assert(result.exclusionReasons.some((reason) => reason.code === eligibility.RECIPE_EXCLUSION_REASONS.FOOD_SAFETY_GUARDRAIL_EXCLUSION && reason.nonOverridable), "Food-safety exclusion should be non-overridable.");

result = evaluate(recipe({
  structuredIngredients: [{ ingredientId: "spinach", displayName: "Spinach", quantity: 100, unit: "g", form: "fresh", optional: false, resolutionStatus: "resolved" }]
}), {
  selectedRescueSources: [{ id: "pantry-spinach", ingredientId: "spinach", quantity: 40, unit: "g", form: "fresh", storageStatus: "usable" }],
  pantryContext: {
    pantryItems: [{ id: "pantry-spinach", ingredientId: "spinach", quantity: 40, unit: "g", form: "fresh", storageStatus: "usable" }]
  },
  requireStructuredQuantities: true
});
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.EXCLUDED, "Selected rescue food shortages must not be filled by grocery purchases.");
assert(result.reasonCodes.includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_QUANTITY_INSUFFICIENT));
assert(result.reasonCodes.includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.SELECTED_FOOD_PURCHASE_REQUIRED));

result = evaluate(recipe({
  structuredIngredients: [{ ingredientId: "spinach", displayName: "Spinach", quantity: 100, unit: "g", form: "fresh", optional: false, resolutionStatus: "resolved" }]
}), {
  selectedRescueSources: [{ id: "pantry-spinach", ingredientId: "spinach", quantity: 60, unit: "g", form: "fresh", storageStatus: "usable" }],
  pantryContext: {
    pantryItems: [
      { id: "pantry-spinach", ingredientId: "spinach", quantity: 60, unit: "g", form: "fresh", storageStatus: "usable" },
      { id: "pantry-spinach-2", ingredientId: "spinach", quantity: 40, unit: "g", form: "fresh", storageStatus: "usable" }
    ]
  },
  requireStructuredQuantities: true
});
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE, "Other safe same-user Pantry lots may cover a selected source shortage.");

result = evaluate(recipe({
  structuredIngredients: [{ ingredientId: "spinach", displayName: "Spinach", quantity: 100, unit: "g", optional: false, resolutionStatus: "resolved" }]
}), {
  selectedRescueSources: [{ id: "pantry-spinach", ingredientId: "spinach", quantity: null, unit: "g", storageStatus: "usable" }],
  pantryContext: { pantryItems: [{ id: "pantry-spinach", ingredientId: "spinach", quantity: null, unit: "g", storageStatus: "usable" }] },
  requireStructuredQuantities: true
});
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.REVIEW_REQUIRED, "Unknown selected quantities require review.");
assert(result.reviewActions.some((action) => action.reasonCode === eligibility.RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_QUANTITY_UNKNOWN));

result = evaluate(recipe({
  structuredIngredients: [{ ingredientId: "spinach", displayName: "Spinach", quantity: 1, unit: "each", form: "fresh", optional: false, resolutionStatus: "resolved" }]
}), {
  selectedRescueSources: [{ id: "pantry-spinach", ingredientId: "spinach", quantity: 1, unit: "each", form: "frozen", storageStatus: "usable" }],
  pantryContext: { pantryItems: [{ id: "pantry-spinach", ingredientId: "spinach", quantity: 1, unit: "each", form: "frozen", storageStatus: "usable" }] },
  requireStructuredQuantities: true
});
assert(result.status === eligibility.RECIPE_ELIGIBILITY_STATUSES.EXCLUDED || result.status === eligibility.RECIPE_ELIGIBILITY_STATUSES.REVIEW_REQUIRED, "Incompatible selected source forms must not be automatic approvals.");
assert(result.reasonCodes.includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.PRIORITY_SOURCE_FORM_INCOMPATIBLE));

result = evaluate(recipe(), {
  leftoverContext: {
    selectedLeftovers: [{ id: "leftover-rice", status: "available", reheated: true, reusableAfterReheat: false, availableServings: 2 }]
  }
});
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.EXCLUDED, "Reheated non-reusable leftovers must be excluded.");
assert(result.reasonCodes.includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.LEFTOVER_REHEATED_AND_NOT_REUSABLE));

result = evaluate(recipe({
  appliedSubstitutions: [{ id: "sub-1", ruleId: "rule-1", quantityRule: { type: "ratio", ratio: null } }]
}), {
  substitutionContext: { ruleIds: ["rule-1"] }
});
assert.strictEqual(result.status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INVALID_CANDIDATE, "Invalid substitution quantity rules must invalidate the candidate.");
assert(result.reasonCodes.includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.SUBSTITUTION_QUANTITY_INVALID));

const ineligible = evaluate(recipe({ allergies: ["Peanuts"] }), { allergies: { allergenIds: ["peanuts"] } });
const soft = eligibility.calculateSoftPreferenceScore({ recipeVariant: recipe(), eligibilityResult: ineligible, pantrySimulation: { pantryCoverageRatio: 1 }, costResult: { costPerServingCents: 50 } });
assert.strictEqual(soft.totalScore, null, "Soft scores must not revive hard failures.");

const ranked = eligibility.rankEligibleCandidates([
  { recipe: { id: "b" }, eligibilityResult: evaluate(recipe({ id: "b" })), softScore: { totalScore: 0.5 }, pantrySimulation: { pantryCoverageRatio: 0.4 } },
  { recipe: { id: "a" }, eligibilityResult: evaluate(recipe({ id: "a" })), softScore: { totalScore: 0.5 }, pantrySimulation: { pantryCoverageRatio: 0.4 } }
]);
assert.deepStrictEqual(ranked.map((item) => item.recipe.id), ["a", "b"], "Stable recipe ID should resolve final ties.");

console.log("Recipe eligibility and ranking tests passed.");
