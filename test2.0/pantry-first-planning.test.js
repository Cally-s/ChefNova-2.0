const assert = require("assert");
const pantryFirst = require("../scripts/pantry-first-planning.js");

const ingredientMap = {
  pasta: "pasta",
  "dry pasta": "pasta",
  tomatoes: "tomatoes",
  onion: "onion",
  onions: "onion",
  rice: "rice",
  "garbanzo beans": "chickpeas",
  chickpeas: "chickpeas"
};

function resolver(name) {
  const ingredientId = ingredientMap[String(name || "").toLowerCase()];
  return ingredientId ? { status: "resolved", ingredientId } : { status: "unresolved" };
}

function recipe(id, ingredients) {
  return { id, name: id, servings: 1, structuredIngredients: ingredients };
}

function ingredient(ingredientId, quantity, unit, form = null, displayName = ingredientId) {
  return { ingredientId, displayName, displayText: displayName, quantity, unit, form, optional: false, measurementStatus: "exact" };
}

const sourcePantry = [
  { id: "pasta-open", ingredientId: "pasta", name: "Opened pasta", quantity: 200, unit: "g", opened: true, freshnessDate: "2026-08-12", freshnessDateType: "best-before" },
  { id: "pasta-new", ingredientId: "pasta", name: "New pasta", quantity: 500, unit: "g", opened: false, freshnessDate: "2026-12-20", freshnessDateType: "best-before" },
  { id: "onion-lot", ingredientId: "onion", name: "Onions", quantity: 2, unit: "each" },
  { id: "beans", name: "Garbanzo beans", quantity: 2, unit: "can", form: "canned" },
  { id: "dry-beans", ingredientId: "chickpeas", name: "Dry chickpeas", quantity: 500, unit: "g", form: "dry" }
];

const inventory = pantryFirst.createPlanningInventory({ pantryItems: sourcePantry, ingredientResolver: resolver, planStartDate: "2026-08-10", planEndDate: "2026-08-16" });

const pastaRecipe = recipe("pasta-night", [
  ingredient("pasta", 400, "g", null, "Pasta"),
  ingredient("tomatoes", 1, "can", null, "Tomatoes"),
  ingredient("onion", 1, "each", null, "Onion")
]);

const pastaResult = pantryFirst.simulateRecipeAgainstInventory({ recipe: pastaRecipe, selectedServings: 1, planningInventory: inventory });
assert.strictEqual(sourcePantry[0].quantity, 200, "Temporary planning must not mutate the source Pantry.");
assert.strictEqual(pastaResult.requirementAllocations[0].pantryQuantityApplied, 400, "Pasta should use 400 g from Pantry.");
assert.strictEqual(pastaResult.requirementAllocations[0].missingQuantity, 0, "Fully covered pasta should have no missing quantity.");
assert.strictEqual(pastaResult.requirementAllocations[1].missingQuantity, 1, "Missing tomatoes should remain a grocery need.");
assert.strictEqual(pastaResult.requirementAllocations[2].pantryQuantityApplied, 1, "One onion should be used from Pantry.");
assert.strictEqual(pastaResult.candidateNextInventory.lots.find((lot) => lot.pantryItemId === "pasta-open").remainingQuantity, 0, "Opened lot should be used first.");
assert.strictEqual(pastaResult.candidateNextInventory.lots.find((lot) => lot.pantryItemId === "pasta-new").remainingQuantity, 300, "Second lot should cover the remaining pasta.");

const aliasRecipe = recipe("chickpea-lunch", [ingredient("chickpeas", 1, "can", "canned", "Chickpeas")]);
const aliasResult = pantryFirst.simulateRecipeAgainstInventory({ recipe: aliasRecipe, selectedServings: 1, planningInventory: inventory });
assert.strictEqual(aliasResult.requirementAllocations[0].pantryQuantityApplied, 1, "Alias-resolved garbanzo beans should cover canned chickpeas.");
assert.strictEqual(inventory.lots.find((lot) => lot.pantryItemId === "beans").originalLabel, "Garbanzo beans", "Original Pantry label must be preserved.");

const kgInventory = pantryFirst.createPlanningInventory({ pantryItems: [{ id: "rice", ingredientId: "rice", name: "Rice", quantity: 1, unit: "kg" }], ingredientResolver: resolver });
const riceResult = pantryFirst.simulateRecipeAgainstInventory({ recipe: recipe("rice", [ingredient("rice", 500, "g")]), selectedServings: 1, planningInventory: kgInventory });
assert.strictEqual(riceResult.requirementAllocations[0].pantryQuantityApplied, 500, "Safe kg to g conversion should allocate Pantry rice.");
assert.strictEqual(riceResult.candidateNextInventory.lots[0].remainingQuantity, 500, "Temporary remaining quantity should be normalized.");

const unknownInventory = pantryFirst.createPlanningInventory({ pantryItems: [{ id: "unknown-rice", ingredientId: "rice", name: "Rice", quantity: "", unit: "g" }], ingredientResolver: resolver });
const unknownResult = pantryFirst.simulateRecipeAgainstInventory({ recipe: recipe("rice", [ingredient("rice", 500, "g")]), selectedServings: 1, planningInventory: unknownInventory });
assert.strictEqual(unknownResult.requirementAllocations[0].pantryQuantityApplied, 0, "Unknown Pantry quantities must not be treated as sufficient.");
assert.strictEqual(unknownResult.requirementAllocations[0].allocationStatus, pantryFirst.ALLOCATION_STATUSES.QUANTITY_UNKNOWN);

const formResult = pantryFirst.simulateRecipeAgainstInventory({ recipe: aliasRecipe, selectedServings: 1, planningInventory: pantryFirst.createPlanningInventory({ pantryItems: [{ id: "dry", ingredientId: "chickpeas", name: "Dry chickpeas", quantity: 1, unit: "can", form: "dry" }], ingredientResolver: resolver }) });
assert.strictEqual(formResult.requirementAllocations[0].pantryQuantityApplied, 0, "Incompatible forms must not be silently allocated.");
assert.strictEqual(formResult.requirementAllocations[0].allocationStatus, pantryFirst.ALLOCATION_STATUSES.FORM_INCOMPATIBLE);

const isolatedA = pantryFirst.simulateRecipeAgainstInventory({ recipe: pastaRecipe, selectedServings: 1, planningInventory: inventory });
const isolatedB = pantryFirst.simulateRecipeAgainstInventory({ recipe: pastaRecipe, selectedServings: 1, planningInventory: inventory });
assert.strictEqual(isolatedA.requirementAllocations[0].pantryQuantityApplied, isolatedB.requirementAllocations[0].pantryQuantityApplied, "Rejected candidate simulations must not consume Pantry for later candidates.");

console.log("Pantry-first planning tests passed.");
