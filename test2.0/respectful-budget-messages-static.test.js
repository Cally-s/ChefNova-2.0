const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");

function contains(text, message) {
  assert(app.includes(text) || css.includes(text), message);
}

function appContains(text, message) {
  assert(app.includes(text), message);
}

[
  "RESPECTFUL_BUDGET_MESSAGE_POLICY",
  "RESPECTFUL_BUDGET_MESSAGE_TYPES",
  "PROHIBITED_USER_FACING_BUDGET_PATTERNS",
  "deriveRespectfulBudgetMessage",
  "createRespectfulBudgetAction",
  "normalizeRespectfulBudgetActions",
  "sanitizeRespectfulBudgetMessage",
  "formatPlanLengthLabel",
  "getActionCountSentence"
].forEach((name) => appContains(name, `${name} should exist.`));

[
  "within-budget",
  "within-budget-using-cushion",
  "complete-plan-above-budget",
  "full-plan-not-found-within-budget",
  "partial-safe-plan",
  "no-safe-plan",
  "incomplete-price-estimate",
  "incomplete-shopping-coverage",
  "plan-requires-review",
  "status-unavailable"
].forEach((status) => appContains(status, `Message type ${status} should be defined.`));

[
  "Some grocery prices are missing.",
  "The currently priced items total approximately",
  "Add the missing prices before relying on the final grocery total.",
  "The current Shopping List does not yet cover every required grocery quantity.",
  "No allergy or required dietary restriction was changed.",
  "No required dietary restriction was changed.",
  "Chef Nova could not verify every recipe against the current allergy information",
  "We could not create the full {planLengthLabel} within {budget} using the selected preferences.",
  "Chef Nova found one possible change.",
  "Chef Nova did not find another automatic safe change using the current settings.",
  "Create a Four-Day Plan",
  "Apply Lower-Cost Substitutions",
  "Add Missing Prices",
  "Review Shopping List"
].forEach((text) => appContains(text, `Expected respectful message text: ${text}`));

[
  "data-add-missing-prices",
  "data-review-cost-issues",
  "data-review-budget-status-actions",
  "data-create-four-day-plan",
  "data-budget-edit-pantry",
  "openBudgetPriceReview",
  "openBudgetStatusPossibleChanges",
  "createFourDayBudgetPreview",
  "openSuggestedMealPlanReview"
].forEach((text) => appContains(text, `Expected action routing through existing workflow: ${text}`));

[
  "if (compatibilitySummary && compatibilitySummary.safe === false) messageType = RESPECTFUL_BUDGET_MESSAGE_TYPES.PLAN_REQUIRES_REVIEW;",
  "else if (planningResult?.status === BUDGET_PLAN_STATUSES.NO_SAFE_PLAN",
  "else if (requestedMeals > 0 && filledMeals > 0 && !completePlan) messageType = RESPECTFUL_BUDGET_MESSAGE_TYPES.PARTIAL_SAFE_PLAN;",
  "else if (shoppingCoverage && shoppingCoverage.shoppingCoverageComplete === false) messageType = RESPECTFUL_BUDGET_MESSAGE_TYPES.INCOMPLETE_SHOPPING_COVERAGE;",
  "else if (!completePricing) messageType = RESPECTFUL_BUDGET_MESSAGE_TYPES.INCOMPLETE_PRICE_ESTIMATE;",
  "else if (Number.isInteger(amountAboveBudgetCents) && amountAboveBudgetCents > 0 && planningResult?.status === BUDGET_PLAN_STATUSES.ABOVE_WEEKLY_BUDGET) messageType = RESPECTFUL_BUDGET_MESSAGE_TYPES.FULL_PLAN_NOT_FOUND_WITHIN_BUDGET;",
  "else if (Number.isInteger(amountAboveBudgetCents) && amountAboveBudgetCents > 0) messageType = RESPECTFUL_BUDGET_MESSAGE_TYPES.COMPLETE_PLAN_ABOVE_BUDGET;",
  "else if (Number.isInteger(planningTargetCents) && Number.isInteger(costCents) && costCents > planningTargetCents) messageType = RESPECTFUL_BUDGET_MESSAGE_TYPES.WITHIN_BUDGET_USING_CUSHION;",
  "else if (completePricing) messageType = RESPECTFUL_BUDGET_MESSAGE_TYPES.WITHIN_BUDGET;"
].forEach((snippet) => appContains(snippet, `Expected priority snippet: ${snippet}`));

[
  "your budget is bad",
  "your budget is unrealistic",
  "your budget is insufficient",
  "you cannot afford",
  "you can't afford",
  "remove your allergy",
  "ignore the allergy",
  "relax allergy"
].forEach((phrase) => {
  const userFacingOccurrences = (app.match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length;
  assert(userFacingOccurrences === 0 || app.includes("PROHIBITED_USER_FACING_BUDGET_PATTERNS"), `Prohibited phrase should not render in production UI: ${phrase}`);
});

[
  "Some grocery prices are missing",
  "completeGroceryTotalAvailable",
  "shoppingCoverageComplete",
  "message.actions.length",
  "aria-live=\"polite\"",
  "respectful-budget-options",
  "budget-status-safety-note",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((text) => contains(text, `Expected accessibility or safety marker: ${text}`));

[
  "chefNovaRespectfulBudgetMessages",
  "budgetMessageLocalStorage",
  "respectfulBudgetStorage"
].forEach((forbidden) => assert(!app.includes(forbidden), `Do not persist respectful messages as a new source of truth: ${forbidden}`));

[
  "new CostEngine",
  "new PriceConfidence",
  "budgetShoppingList",
  "emergencyShoppingList",
  "respectfulBudgetPlanner"
].forEach((forbidden) => assert(!app.includes(forbidden), `Do not create duplicate systems: ${forbidden}`));

console.log("Respectful budget message static checks passed.");
