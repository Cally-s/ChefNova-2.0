const assert = require("assert");
const fs = require("fs");
const path = require("path");

const appPath = path.join(__dirname, "..", "app.js");
const source = fs.readFileSync(appPath, "utf8");

function includesAll(items) {
  items.forEach((item) => assert(source.includes(item), `Expected app.js to include: ${item}`));
}

includesAll([
  "const BUDGET_PLAN_STATUSES = Object.freeze",
  "WITHIN_PLANNING_TARGET: \"within-planning-target\"",
  "WITHIN_WEEKLY_BUDGET: \"within-weekly-budget\"",
  "ABOVE_WEEKLY_BUDGET: \"above-weekly-budget\"",
  "INCOMPLETE_PRICE_ESTIMATE: \"incomplete-price-estimate\"",
  "PARTIAL_SAFE_PLAN: \"partial-safe-plan\"",
  "NO_SAFE_PLAN: \"no-safe-plan\"",
  "const BUDGET_REPAIR_ACTIONS = Object.freeze",
  "validated-lower-cost-substitute",
  "lower-cost-compatible-recipe",
  "planned-leftover-lunch",
  "pantry-based-meal",
  "pantry-based-snack",
  "remove-optional-ingredients",
  "reuse-required-ingredients",
  "reduce-unique-grocery-items",
  "function generateBudgetRescueMealPlan",
  "function normalizeBudgetPlanningRequest",
  "function buildStableBudgetMealSlots",
  "function buildEligibleBudgetCandidatesBySlot",
  "function constructFirstBudgetPlan",
  "function repairBudgetPlan",
  "function evaluateBudgetCandidateForSlot",
  "function calculateBudgetPlanningScore",
  "function determineBudgetPlanStatus",
  "function renderBudgetPlanningResultSummary"
]);

assert(
  source.includes("if (planningContext.planningMode === PLANNING_MODES.BUDGET_RESCUE) return generateBudgetRescueMealPlan(planningContext, normalizedOptions);"),
  "Budget Rescue generation should use the deterministic Budget Rescue branch."
);

assert(
  source.includes("evaluateRecipeForCurrentRequirements(recipe, context, { requiredServings: slot.requiredServings })"),
  "Budget candidates must pass the central Step 9 eligibility filter before scoring."
);

assert(
  source.includes("PANTRY_FIRST.simulateRecipeAgainstInventory"),
  "Budget candidates should simulate Pantry coverage through the Pantry-first service."
);

assert(
  source.includes("calculateMealPlanCostsForPlan(createBudgetPlanFromSelectedMeals"),
  "Budget candidates should calculate plan-level marginal grocery cost."
);

assert(
  source.includes(".sort(compareBudgetCandidates)") && source.includes("String(a.recipe?.id || a.recipe?.name || \"\").localeCompare"),
  "Budget candidate sorting should be deterministic."
);

const budgetBranchStart = source.indexOf("function generateBudgetRescueMealPlan");
const budgetBranchEnd = source.indexOf("function createUnavailableMealPlanGenerationResult");
const budgetBranch = source.slice(budgetBranchStart, budgetBranchEnd);
assert(!budgetBranch.includes("Math.random"), "Budget Rescue algorithm must not use Math.random().");

console.log("Budget planning algorithm static tests passed.");
