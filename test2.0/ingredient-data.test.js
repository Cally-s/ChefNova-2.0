const assert = require("assert");
const fs = require("fs");
const {
  buildIngredientAliasIndex,
  resolveIngredientName,
  normalizeUnit,
  parseIngredientLine,
  validateIngredientCatalogue,
  validateStructuredRecipeIngredients,
  ingredientDisplayText
} = require("../scripts/ingredient-data-shared.js");

const recipes = JSON.parse(fs.readFileSync("data/recipes.json", "utf8"));
const catalogue = JSON.parse(fs.readFileSync("data/ingredients.json", "utf8"));
const aliasIndex = buildIngredientAliasIndex(catalogue);

assert.strictEqual(recipes.length, 35, "Expected current production recipe count.");
assert.strictEqual(validateIngredientCatalogue(catalogue).length, 0, "Ingredient catalogue validation should pass.");
assert.strictEqual(validateStructuredRecipeIngredients(recipes, catalogue).length, 0, "Structured recipe validation should pass.");

let lineCount = 0;
recipes.forEach((recipe) => {
  assert.strictEqual(recipe.ingredientSchemaVersion, 1, `${recipe.id} should use ingredient schema version 1.`);
  assert.strictEqual(recipe.ingredients.length, recipe.structuredIngredients.length, `${recipe.id} required ingredient coverage mismatch.`);
  assert.strictEqual((recipe.optionalIngredients || []).length, (recipe.structuredOptionalIngredients || []).length, `${recipe.id} optional ingredient coverage mismatch.`);
  recipe.ingredients.forEach((ingredient, index) => {
    lineCount += 1;
    assert.strictEqual(recipe.structuredIngredients[index].displayText, ingredientDisplayText(ingredient), `${recipe.id} changed required display text.`);
  });
  (recipe.optionalIngredients || []).forEach((ingredient, index) => {
    lineCount += 1;
    assert.strictEqual(recipe.structuredOptionalIngredients[index].displayText, ingredientDisplayText(ingredient), `${recipe.id} changed optional display text.`);
  });
});
assert.strictEqual(lineCount, 241, "Expected all current production ingredient lines to be migrated.");

["Chickpea", "Chickpeas", "Garbanzo bean", "Garbanzo beans"].forEach((term) => {
  assert.deepStrictEqual(resolveIngredientName(term, catalogue, aliasIndex), { status: "resolved", ingredientId: "chickpeas" });
});

assert.strictEqual(resolveIngredientName("pasta", catalogue, aliasIndex).ingredientId, "pasta", "Broad pasta should resolve to broad pasta.");
assert.notStrictEqual(resolveIngredientName("margarine", catalogue, aliasIndex).ingredientId, "butter", "Margarine must not be a butter alias.");
assert.notStrictEqual(resolveIngredientName("lentils", catalogue, aliasIndex).ingredientId, "chicken", "Lentils must not be a chicken alias.");
assert.notStrictEqual(resolveIngredientName("oat milk", catalogue, aliasIndex).ingredientId, "milk", "Oat milk must not be a dairy milk alias.");
assert.notStrictEqual(resolveIngredientName("almonds", catalogue, aliasIndex).ingredientId, "peanut-butter", "Almonds must not be a peanut alias.");

assert.strictEqual(normalizeUnit("cups"), "cup");
assert.strictEqual(normalizeUnit("tablespoons"), "tbsp");
assert.strictEqual(normalizeUnit("cloves"), "clove");
assert.strictEqual(normalizeUnit("cans"), "can");

assert.deepStrictEqual(
  (({ ingredientId, quantity, quantityMax, unit, measurementStatus }) => ({ ingredientId, quantity, quantityMax, unit, measurementStatus }))(parseIngredientLine("2 cups pasta", catalogue, aliasIndex)),
  { ingredientId: "pasta", quantity: 2, quantityMax: null, unit: "cup", measurementStatus: "exact" }
);
assert.deepStrictEqual(
  (({ ingredientId, quantity, unit, amountText, measurementStatus }) => ({ ingredientId, quantity, unit, amountText, measurementStatus }))(parseIngredientLine("Some olive oil", catalogue, aliasIndex)),
  { ingredientId: "olive-oil", quantity: null, unit: null, amountText: "Some", measurementStatus: "unquantified" }
);
assert.deepStrictEqual(
  (({ ingredientId, quantity, measurementStatus }) => ({ ingredientId, quantity, measurementStatus }))(parseIngredientLine("Salt to taste", catalogue, aliasIndex)),
  { ingredientId: "salt", quantity: null, measurementStatus: "to-taste" }
);
assert.strictEqual(parseIngredientLine("½ cup milk", catalogue, aliasIndex).quantity, 0.5);
assert.strictEqual(parseIngredientLine("1/2 cup milk", catalogue, aliasIndex).quantity, 0.5);
assert.strictEqual(parseIngredientLine("1 ½ cups milk", catalogue, aliasIndex).quantity, 1.5);
assert.strictEqual(parseIngredientLine("1 1/2 cups milk", catalogue, aliasIndex).quantity, 1.5);

const range = parseIngredientLine("1–2 tbsp olive oil", catalogue, aliasIndex);
assert.strictEqual(range.quantity, 1);
assert.strictEqual(range.quantityMax, 2);
assert.strictEqual(range.unit, "tbsp");
assert.strictEqual(range.measurementStatus, "range");

const packageKnown = parseIngredientLine("2 × 400 g cans tomatoes", catalogue, aliasIndex);
assert.strictEqual(packageKnown.quantity, 2);
assert.strictEqual(packageKnown.unit, "can");
assert.deepStrictEqual(packageKnown.packageSize, { quantity: 400, unit: "g" });

const packageUnknown = parseIngredientLine("1 can tomatoes", catalogue, aliasIndex);
assert.strictEqual(packageUnknown.packageSize, null);
assert.strictEqual(packageUnknown.measurementStatus, "package-size-unknown");

const prepared = parseIngredientLine("1 onion, finely diced", catalogue, aliasIndex);
assert.strictEqual(prepared.ingredientId, "onion");
assert.strictEqual(prepared.preparation, "finely diced");
assert.notStrictEqual(prepared.ingredientId, "finely-diced-onion");

const optional = parseIngredientLine("Parsley, optional, for garnish", catalogue, aliasIndex);
assert.strictEqual(optional.ingredientId, "parsley");
assert.strictEqual(optional.optional, true);
assert.strictEqual(optional.preparation, "for garnish");

const recipesJs = fs.readFileSync("data/recipes.js", "utf8");
const ingredientsJs = fs.readFileSync("data/ingredients.js", "utf8");
assert(recipesJs.includes(`window.CHEF_NOVA_RECIPES = ${JSON.stringify(recipes, null, 2)};`), "recipes.js should match recipes.json.");
assert(ingredientsJs.includes(`window.CHEF_NOVA_INGREDIENT_CATALOGUE = ${JSON.stringify(catalogue, null, 2)};`), "ingredients.js should match ingredients.json.");

console.log("Ingredient data tests passed.");
