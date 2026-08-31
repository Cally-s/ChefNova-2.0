const assert = require("assert");
const fs = require("fs");
const path = require("path");

const substitutions = require("../scripts/ingredient-substitution-shared.js");
const ingredientData = require("../scripts/ingredient-data-shared.js");
const catalogue = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/ingredients.json"), "utf8"));
const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/recipes.json"), "utf8"));
const substitutionCatalogue = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/ingredient-substitutions.json"), "utf8"));

const ingredientIds = catalogue.ingredients.map((ingredient) => ingredient.id);
const recipeIds = recipes.map((recipe) => recipe.id);
const validation = substitutions.validateSubstitutionCatalogue(substitutionCatalogue, { ingredientIds, recipeIds });
assert.strictEqual(validation.valid, true, validation.errors.join("\n"));
assert.strictEqual(validation.groupCount, 4, "Expected four reviewed substitution groups.");
assert.strictEqual(validation.activeRuleCount, 5, "Expected five active substitution rules.");

const indexes = substitutions.buildRuleIndexes(substitutionCatalogue);
assert.strictEqual(indexes.rulesByRuleId.size, indexes.rules.length, "Rule IDs must be unique.");
assert(indexes.rulesByOriginalIngredientId.get("chicken").length >= 2, "Chicken rules should be indexed by original ingredient.");

const aliasIndex = ingredientData.buildIngredientAliasIndex(catalogue);
assert.deepStrictEqual(ingredientData.resolveIngredientName("garbanzo beans", catalogue, aliasIndex), { status: "resolved", ingredientId: "chickpeas" });
assert.notStrictEqual(ingredientData.resolveIngredientName("lentils", catalogue, aliasIndex).ingredientId, "chicken");
assert.notStrictEqual(ingredientData.resolveIngredientName("oat milk", catalogue, aliasIndex).ingredientId, "milk");

const ratioRule = indexes.rulesByRuleId.get("tofu-to-lentils-fixed-grams");
const tofuRecipe = recipes.find((recipe) => recipe.id === "tofu-noodles");
const ratioEvaluation = substitutions.evaluateRuleForRecipe({ rule: ratioRule, recipe: tofuRecipe, selectedServings: 2 });
assert.strictEqual(ratioEvaluation.status, "eligible");
assert.strictEqual(ratioEvaluation.replacementIngredient.quantity, 150);
assert.strictEqual(ratioEvaluation.replacementIngredient.unit, "g");
assert(ratioEvaluation.recipeVariant.variantId.includes("tofu-to-lentils-fixed-grams"), "Variant ID should include the stable rule ID.");
assert.strictEqual(tofuRecipe.structuredIngredients[0].ingredientId, "tofu", "Canonical recipe must remain unchanged.");

const syntheticChickenRecipe = {
  id: "synthetic-chicken-soup",
  name: "Synthetic Chicken Soup",
  category: "Dinner",
  subcategory: "Soup",
  servings: 4,
  structuredIngredients: [{ ingredientId: "chicken", displayName: "Chicken", displayText: "500 g chicken", quantity: 500, unit: "g", form: "raw", measurementStatus: "exact", resolutionStatus: "resolved" }],
  ingredients: [{ name: "chicken", quantity: 500, unit: "g" }]
};
const reviewedGramRule = {
  ruleId: "test-chicken-to-lentils-gram-ratio",
  originalIngredientId: "chicken",
  alternativeIngredientId: "lentils",
  allowedRecipeTypes: ["soup"],
  allowedRecipeIds: [],
  excludedRecipeIds: [],
  quantityRule: { type: "ratio", ratio: 0.55, inputUnit: "g", outputUnit: "g" },
  originalForms: ["raw"],
  resultingForm: "dry",
  preparationAdjustments: [],
  cookingAdjustments: { additionalTimeMinutes: 15, requiredApplianceIds: ["stove"], removedApplianceIds: [] },
  additionalIngredients: [],
  removedIngredients: [],
  allowAutomaticPlanning: true,
  requiresUserConfirmation: false,
  active: true,
  version: 1
};
const gramEvaluation = substitutions.evaluateRuleForRecipe({ rule: reviewedGramRule, recipe: syntheticChickenRecipe, selectedServings: 4 });
assert.strictEqual(gramEvaluation.replacementIngredient.quantity, 275);
assert.strictEqual(gramEvaluation.replacementIngredient.unit, "g");

const roastRecipe = { ...syntheticChickenRecipe, id: "synthetic-roast", subcategory: "Roast" };
const roastEvaluation = substitutions.evaluateRuleForRecipe({ rule: reviewedGramRule, recipe: roastRecipe, selectedServings: 4 });
assert.strictEqual(roastEvaluation.status, "ineligible");

const unsafeCupRecipe = { ...syntheticChickenRecipe, structuredIngredients: [{ ...syntheticChickenRecipe.structuredIngredients[0], displayText: "2 cups chicken", quantity: 2, unit: "cup" }] };
const unsafeCupEvaluation = substitutions.evaluateRuleForRecipe({ rule: reviewedGramRule, recipe: unsafeCupRecipe, selectedServings: 4 });
assert.strictEqual(unsafeCupEvaluation.status, "indeterminate");
assert.strictEqual(unsafeCupEvaluation.quantityResult.status, "quantity-unresolved");

const manualRule = indexes.rulesByRuleId.get("chicken-to-lentils-cooked-cup-manual");
const manualEvaluation = substitutions.evaluateRuleForRecipe({ rule: manualRule, recipe: recipes.find((recipe) => recipe.id === "chicken-curry"), selectedServings: 3 });
assert.strictEqual(manualEvaluation.status, "indeterminate");
assert.strictEqual(manualEvaluation.canApply, false);

const eggRule = indexes.rulesByRuleId.get("chicken-to-eggs-fried-rice-recipe-specific");
const friedRiceEvaluation = substitutions.evaluateRuleForRecipe({ rule: eggRule, recipe: recipes.find((recipe) => recipe.id === "fried-rice"), selectedServings: 4 });
assert.strictEqual(friedRiceEvaluation.status, "ineligible", "Fried rice has no chicken occurrence, so the rule must not apply by recipe ID alone.");

const formMismatchRecipe = { ...syntheticChickenRecipe, structuredIngredients: [{ ...syntheticChickenRecipe.structuredIngredients[0], form: "cooked" }] };
assert.strictEqual(substitutions.evaluateRuleForRecipe({ rule: reviewedGramRule, recipe: formMismatchRecipe, selectedServings: 4 }).status, "ineligible");

indexes.rules.forEach((rule) => {
  assert.strictEqual(rule.estimatedSavings, undefined, `${rule.ruleId} must not store hard-coded savings.`);
  assert.notStrictEqual(rule.quantityRule.quantityRatio, null, `${rule.ruleId} must not retain null quantityRatio.`);
});

const visited = new Set();
indexes.rules.forEach((rule) => {
  const key = `${rule.originalIngredientId}->${rule.alternativeIngredientId}`;
  const reverse = `${rule.alternativeIngredientId}->${rule.originalIngredientId}`;
  assert(!visited.has(reverse), `Cycle detected for ${key}.`);
  visited.add(key);
});

const appSource = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
assert(appSource.includes("evaluateSubstitutionForMeal"), "app.js should use the shared substitution evaluator wrapper.");
assert(appSource.includes("calculateMealPlanCostsForPlan"), "Substitution application should recalculate plan-level costs.");
assert(appSource.includes("findBudgetRepairSubstitution"), "Budget repair should use the shared substitution path.");
assert(appSource.includes("recipeVariantSnapshot"), "Saved plans should preserve immutable variant snapshots.");

console.log("Cheaper substitution static tests passed.");
