const assert = require("assert");
const cost = require("../scripts/cost-calculation-engine.js");

const recipe = {
  id: "test-omelette",
  name: "Test Omelette",
  servings: 2,
  structuredIngredients: [
    { occurrenceId: "whole-eggs", ingredientId: "egg", displayName: "Eggs", quantity: 1, unit: "each", scalingPolicyId: "whole-egg-round-up" },
    { occurrenceId: "spinach", ingredientId: "spinach", displayName: "Spinach", quantity: 100, unit: "g" }
  ]
};

let result = cost.scaleRecipeWithPracticalRules({ recipe, selectedServings: 3 });
assert.strictEqual(result.version, cost.RECIPE_SCALE_RESULT_VERSION, "Recipe scale result should be versioned.");
assert.strictEqual(result.policyVersion, cost.INGREDIENT_SCALING_POLICY_VERSION, "Ingredient policy version should be included.");
assert.strictEqual(result.ingredientResults[0].rawMathematicalQuantity, 1.5, "Raw egg quantity should keep exact math.");
assert.strictEqual(result.ingredientResults[0].practicalRecipeQuantity, 2, "Explicit whole-egg policy should round practical recipe use.");
assert.strictEqual(result.ingredientResults[0].status, cost.INGREDIENT_SCALE_STATUSES.ADJUSTED, "Whole egg adjustment should be labelled.");
assert.strictEqual(result.ingredientResults[1].practicalRecipeQuantity, 150, "Measured mass ingredients should scale linearly.");
assert(result.materialAdjustments.some((item) => item.occurrenceId === "whole-eggs"), "Material adjustments should include rounded eggs.");

result = cost.scaleRecipeWithPracticalRules({
  recipe: {
    id: "legacy-count",
    name: "Legacy Count",
    servings: 2,
    structuredIngredients: [{ occurrenceId: "onion", ingredientId: "onion", displayName: "Onion", quantity: 1, unit: "each" }]
  },
  selectedServings: 3
});
assert.strictEqual(result.ingredientResults[0].rawMathematicalQuantity, 1.5, "Legacy count raw quantity should keep exact math.");
assert.strictEqual(result.ingredientResults[0].practicalRecipeQuantity, 1.5, "Legacy count quantity should not receive invented whole-item rounding.");
assert.strictEqual(result.ingredientResults[0].status, cost.INGREDIENT_SCALE_STATUSES.REVIEW_REQUIRED, "Legacy whole counts require review metadata.");

result = cost.scaleRecipeWithPracticalRules({
  recipe: {
    id: "can-policy",
    name: "Can Policy",
    servings: 2,
    structuredIngredients: [{ occurrenceId: "tomato-can", ingredientId: "tomato", displayName: "Tomatoes", quantity: 1, unit: "can", scalingPolicyId: "complete-can-required", scalingPolicy: { allowedFractions: [1, 2, 3] } }]
  },
  selectedServings: 4
});
assert.strictEqual(result.ingredientResults[0].rawMathematicalQuantity, 2, "Can policy raw quantity should scale first.");
assert.strictEqual(result.ingredientResults[0].practicalRecipeQuantity, 2, "Reviewed can policy should choose allowed package amount.");

result = cost.scaleRecipeWithPracticalRules({
  recipe: {
    id: "cycle",
    name: "Cycle",
    servings: 1,
    structuredIngredients: [
      { occurrenceId: "a", ingredientId: "water", displayName: "Water", quantity: 100, unit: "ml", scalingPolicy: { dependsOnOccurrenceId: "b" } },
      { occurrenceId: "b", ingredientId: "rice", displayName: "Rice", quantity: 100, unit: "g", scalingPolicy: { dependsOnOccurrenceId: "a" } }
    ]
  },
  selectedServings: 2
});
assert.strictEqual(result.cycleDetected, true, "Dependency cycle should be detected.");
assert.strictEqual(result.status, cost.RECIPE_SCALE_PROFILE_STATUSES.UNSUPPORTED, "Dependency cycle should make scale result unsupported.");

const source = require("fs").readFileSync(require("path").join(__dirname, "../scripts/cost-calculation-engine.js"), "utf8");
assert(!source.includes('unit === "egg"'), "Scaler must not apply a universal egg-unit rule.");
assert(!source.includes("unit === 'egg'"), "Scaler must not apply a universal egg-unit rule.");
assert(source.includes("INGREDIENT_SCALING_POLICY_REGISTRY"), "A single central scaling-policy registry should exist.");

console.log("Cook Before It Spoils Step 14 practical scaling checks passed.");
