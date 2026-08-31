const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const recipes = JSON.parse(fs.readFileSync(path.join(root, "data/recipes.json"), "utf8"));

[
  "const LEFTOVER_PLANNING_VERSION = 1",
  "usePlannedLeftovers: false",
  "data-planning-mode-input=\"usePlannedLeftovers\"",
  "function validateRecipeBatchMetadata",
  "function buildBatchServingOptions",
  "function validateBatchServingOption",
  "function validateLeftoverTarget",
  "function createLeftoverLedgerEntry",
  "function createLeftoverMealEntry",
  "function rebuildLeftoverRelationships",
  "function calculateLeftoverBenefits",
  "function buildNoLeftoverCounterfactualPlan",
  "function validateLeftoverPlan",
  "function validateLeftoverRelationship",
  "function renderLeftoverBenefitSummary",
  "function openLeftoverPlanReview",
  "function renderLeftoverRelationshipCard"
].forEach((needle) => assert(app.includes(needle), `Expected app.js to include ${needle}`));

assert(
  app.includes("if (!entry?.recipeId || entry.mealType === \"leftover\") return null;"),
  "Leftover target meals must not be charged as a second full recipe."
);

assert(
  app.includes("const costServings = Number(rawEntry?.plannedRecipeServings || entry.plannedRecipeServings || entry.servings);"),
  "Source batch meals must be costed using plannedRecipeServings."
);

assert(app.includes("leftoverFromMealId"), "Leftover target meals must reference their source meal.");
assert(app.includes("leftoverAllocationId"), "Leftover allocations must use stable IDs.");
assert(app.includes("status: LEFTOVER_MEAL_STATUS.NEEDS_REPLACEMENT"), "Orphaned leftovers must be flagged for replacement.");
assert(!app.slice(app.indexOf("function applyPlannedLeftoversToBudgetPlan"), app.indexOf("function buildLeftoverAllocationId")).includes("Math.random"), "Leftover planning must be deterministic.");

assert(css.includes(".budget-rescue-radio-section"), "Planned leftover radio group needs styling.");
assert(css.includes(".leftover-benefit-summary"), "Leftover benefit summary needs styling.");
assert(css.includes(".leftover-relationship-card"), "Leftover relationship review cards need styling.");

const supported = recipes.filter((recipe) => recipe.batchCooking?.supported && recipe.leftovers?.supported);
assert(supported.length >= 4, "At least four recipes should have explicit batch and leftover metadata.");
supported.forEach((recipe) => {
  assert(recipe.leftovers.storageWindowDays > 0, `${recipe.id} must define a storage window.`);
  assert(Array.isArray(recipe.leftovers.reheatingMethods) && recipe.leftovers.reheatingMethods.length, `${recipe.id} must define reheating methods.`);
});

console.log("Leftover and batch-cooking static checks passed.");
