const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const docs = fs.readFileSync("docs/budget-rescue-save-plan.md", "utf8");

function has(source, text, message) {
  assert(source.includes(text), message || `Expected source to include ${text}`);
}

[
  "SAVED_PLAN_METADATA_SCHEMA_VERSION",
  "PLAN_LIFECYCLE_STATUSES",
  "PREVIEW: \"preview\"",
  "SAVING: \"saving\"",
  "SAVED: \"saved\"",
  "DIRTY_SAVED_PLAN: \"dirty-saved-plan\"",
  "SAVE_FAILED: \"save-failed\"",
  "createBudgetRescueSavedMetadata",
  "normalizeSavedPlanMetadata",
  "prepareSuggestedPlanForExistingSaveWorkflow",
  "validateBudgetRescuePlanForSave",
  "buildCalendarMergeForSavedPlan",
  "createStableSavedPlanId",
  "hashStableString"
].forEach((text) => has(app, text, `${text} should exist for saved Budget Rescue plans.`));

[
  "planningMode",
  "schemaVersion: SAVED_PLAN_METADATA_SCHEMA_VERSION",
  "weeklyBudgetCents",
  "planningTargetCents",
  "estimatedGroceryCostCents: completeCost ? weeklySummary.weeklyGroceryCostCents : null",
  "remainingBudgetCents: completeCost",
  "amountAboveBudgetCents: completeCost",
  "priceProfileId",
  "priceProfileNameSnapshot",
  "resolvedPriceCoverageRatio",
  "estimatedPantryPurchasesAvoidedCents",
  "shoppingCoverageStatus",
  "leftoverMealCount",
  "substitutionRuleIds",
  "generatedAt",
  "savedAt",
  "costCalculatedAt"
].forEach((text) => has(app, text, `Metadata should include ${text}.`));

[
  "state.mealPlans?.calendar",
  "nextCalendar[date] = existing;",
  "finalPlan.calendar = metadata ? buildCalendarMergeForSavedPlan(finalPlan, metadata)",
  "const previousPlan = structuredCloneSafe(state.mealPlans);",
  "state.mealPlans = normalizeMealPlan(previousPlan);",
  "if (!state.guestMode && saved !== true) throw new Error",
  "This plan is already saved."
].forEach((text) => has(app, text, `Save path should preserve current storage behavior: ${text}`));

[
  "createReplacementImpactPreview",
  "renderReplacementImpactPreview",
  "beforePlanSignature",
  "proposedPlanSignature",
  "hardEligibilityResult",
  "budgetImpact",
  "This replacement would move the plan above the selected budget.",
  "Complete budget impact needs price review.",
  "disabled"
].forEach((text) => has(app, text, `Replacement preview should include ${text}.`));

[
  "replacement-impact-preview",
  "role=\"status\"",
  "@media print",
  "grid-template-columns: 1fr"
].forEach((text) => assert(app.includes(text) || css.includes(text), `Expected UI/accessibility marker: ${text}`));

[
  "budgetRescueCalendar",
  "Save Budget Rescue Plan",
  "chefNovaBudgetRescuePlan",
  "localStorage.setItem(\"chefNovaBudgetRescue",
  "budgetRescuePantryDeductions",
  "budgetRescuePurchasedItems"
].forEach((forbidden) => assert(!app.includes(forbidden), `Do not add duplicate or side-effect systems: ${forbidden}`));

[
  "Budget Rescue plans stay as previews",
  "mealPlans.calendar[\"YYYY-MM-DD\"]",
  "Money values are stored as integer cents",
  "Saving a plan does not deduct Pantry items",
  "Replacement cards recalculate the full proposed draft"
].forEach((text) => has(docs, text, `Documentation should cover ${text}.`));

console.log("Budget Rescue save plan static checks passed.");
