const assert = require("assert");
const fs = require("fs");
const path = require("path");

const appSource = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
const cssSource = fs.readFileSync(path.join(__dirname, "../style.css"), "utf8");

function expectSource(text, message) {
  assert(appSource.includes(text), message || `Expected app.js to include: ${text}`);
}

[
  "const BUDGET_STATUS_PANEL_VERSION = 1",
  "const BUDGET_STATUS_PANEL_STATUSES = Object.freeze",
  "function deriveBudgetStatusPanelModel",
  "function summarizeBudgetStatusPlanMetrics",
  "function validateBudgetStatusPlanCompatibility",
  "function countAvailableLowerCostSubstitutionsForPlan",
  "function renderBudgetStatusPanel",
  "function renderBudgetStatusProgress",
  "function createBudgetStatusSnapshot",
  "function openBudgetStatusPossibleChanges"
].forEach((text) => expectSource(text));

[
  "within-planning-target",
  "within-weekly-budget",
  "above-weekly-budget",
  "incomplete-estimate",
  "partial-plan",
  "plan-requires-review",
  "no-safe-plan",
  "no-purchases-required",
  "unavailable"
].forEach((status) => expectSource(status, `Expected Budget Status panel status ${status}.`));

expectSource("const budgetStatusPanel = state.mealPlannerView === \"monthly\" ? \"\" : renderBudgetStatusPanel();", "Budget Status panel should render in the weekly planner path.");
expectSource("derivePriceConfidence({ purchaseGroups: currentCostResult.purchaseGroups, weeklyCostSummary: summary })", "Panel should consume the existing Price Confidence system.");
expectSource("buildPantryAllocationForPlan(plan)", "Panel should use the existing Pantry-first allocation summary.");
expectSource("calculateMealPlanCostsForPlan(plan, state.pantry)", "Panel should use the existing Cost Engine wrapper.");
expectSource("evaluateRecipeForCurrentRequirements(recipe, context", "Panel should check hard recipe requirements before budget claims.");
expectSource("evaluateSubstitutionForMeal({ rule, day, mealType, entry, plan })", "Panel should count available lower-cost actions through existing substitution evaluation.");

assert(
  appSource.includes("completeGroceryTotalAvailable && completePlan && compatibility.safe"),
  "Progress bar and final budget status should require complete totals, a full plan, and safe compatibility."
);
assert(
  appSource.includes("aria-valuenow=\"${escapeHtml(String(capped))}\"") && appSource.includes("Math.min(100"),
  "Budget progressbar should cap aria-valuenow at 100 while preserving visible over-budget context."
);
assert(
  appSource.includes("...(complete ? [[budget.amountAboveBudgetCents > 0 ? \"Above budget\" : \"Remaining budget\""),
  "Remaining budget should only render for complete grocery totals."
);
assert(
  appSource.includes("if (requestedMeals > 0 && filledMeals > 0 && !completePlan) status = BUDGET_STATUS_PANEL_STATUSES.PARTIAL_PLAN;"),
  "Partial plans must be classified before within-budget claims."
);
assert(
  appSource.includes("if (!compatibility.safe) status = BUDGET_STATUS_PANEL_STATUSES.PLAN_REQUIRES_REVIEW;"),
  "Hard requirement conflicts must take priority before partial or budget claims."
);
assert(
  appSource.includes("if (entry.mealType === \"leftover\")") && appSource.includes("additionalCostCents"),
  "Average ingredient-use cost should avoid double-counting leftover source batch costs."
);
assert(
  !appSource.includes("chefNovaBudgetStatus"),
  "Budget Status panel must not create a separate localStorage system."
);

[
  ".budget-status-panel",
  ".budget-status-grid",
  ".budget-status-progress",
  ".budget-status-actions",
  "@media print",
  "position: sticky",
  "position: static"
].forEach((text) => assert(cssSource.includes(text), `Expected style.css to include: ${text}`));

console.log("Budget Status panel static tests passed.");
