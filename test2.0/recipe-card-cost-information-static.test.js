const assert = require("assert");
const fs = require("fs");
const path = require("path");

const app = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "../style.css"), "utf8");

function expect(text, source = app) {
  assert(source.includes(text), `Expected source to include: ${text}`);
}

[
  "const RECIPE_CARD_CONTEXTS = Object.freeze",
  "PLANNED_NORMAL_MEAL: \"planned-normal-meal\"",
  "PLANNED_BATCH_SOURCE: \"planned-batch-source\"",
  "PLANNED_LEFTOVER_TARGET: \"planned-leftover-target\"",
  "REPLACEMENT_CANDIDATE: \"replacement-candidate\"",
  "PLANNER_CANDIDATE: \"planner-candidate\"",
  "STANDALONE_RECIPE: \"standalone-recipe\"",
  "SAVED_HISTORICAL_MEAL: \"saved-historical-meal\"",
  "const NEW_GROCERY_COST_CONTEXTS = Object.freeze",
  "MARGINAL_CURRENT_PLAN: \"marginal-current-plan\"",
  "ADDITION_TO_CURRENT_PLAN: \"addition-to-current-plan\"",
  "STANDALONE_WITH_CURRENT_PANTRY: \"standalone-with-current-pantry\"",
  "SOURCE_BATCH_PRODUCTION_EVENT: \"source-batch-production-event\"",
  "LEFTOVER_ADDITIONAL_ONLY: \"leftover-additional-only\""
].forEach((text) => expect(text));

[
  "function deriveRecipeCardCostModel",
  "function renderRecipeCardCostSummary",
  "function renderRecipeCardCostBreakdown",
  "function deriveRecipeCardNewGrocerySpending",
  "function deriveRecipeCardPantrySummary",
  "function getRecipeCardIngredientBreakdown",
  "function countNewlyIntroducedPurchaseGroupsForMeal",
  "function removeMealFromPlan",
  "function setMealInPlan"
].forEach((text) => expect(text));

expect("calculateRecipeCostForDisplay(effectiveRecipe, selected)", app);
expect("derivePriceConfidence({ purchaseGroups: currentPlanCost.purchaseGroups, weeklyCostSummary: currentPlanCost.weeklySummary })", app);
expect("buildPantryAllocationForPlan(plan || suggestedMealPlanReviewState?.draftPlan || state.mealPlans)", app);
expect("currentTotal - withoutMealTotal", app);
expect("candidateTotal - baseTotal", app);
expect("LEFTOVER_ADDITIONAL_ONLY", app);
expect("Ingredient value includes Pantry food and partial-package value.", app);
expect("Meal-level grocery estimates are context-sensitive and should not be added together.", app);
expect("Known ingredient value", app);
expect("Price needed", app);
expect("Quantity needed", app);
expect("SUBSTITUTION_CAUTION", app);

[
  "function recipeCard",
  "function favoriteRecipeCard",
  "function renderSuggestedMealCard",
  "function renderSuggestedReplacementOption",
  "function mealSlot",
  "function renderGeneratedMealPreview"
].forEach((fn) => {
  const start = app.indexOf(fn);
  assert(start >= 0, `${fn} should exist.`);
  const chunk = app.slice(start, start + 2400);
  assert(chunk.includes("renderRecipeCardCostSummary"), `${fn} should reuse the shared recipe-card cost summary.`);
});

assert(!app.includes("BudgetRecipeCard"), "No separate Budget Recipe card should be created.");
assert(!app.includes("chefNovaRecipeCardCost"), "Recipe-card costs should not use a separate storage key.");

[
  ".recipe-card-cost-summary",
  ".recipe-card-cost-breakdown",
  ".recipe-card-cost-lines",
  ".recipe-card-cost-warning",
  "@media print",
  "@media (max-width: 640px)"
].forEach((text) => expect(text, css));

console.log("Recipe card cost information static checks passed.");
