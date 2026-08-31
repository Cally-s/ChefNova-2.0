const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function expect(text, message) {
  assert(app.includes(text) || css.includes(text), message || `${text} should exist.`);
}

[
  "EMERGENCY_PARSE_STATUSES",
  "EMERGENCY_PLAN_STATUSES",
  "EMERGENCY_PLANNING_PROFILE",
  "EMERGENCY_SEARCH_CONFIG",
  "createEmptyEmergencyPlanDraft",
  "normalizeEmergencyPlanDraft",
  "parseEmergencyPlanRequest",
  "parseEmergencyDatePhrase",
  "resolveEmergencyWeekdayDate",
  "calendarDayDifference",
  "renderEmergencyPlanFields",
  "renderEmergencyInterpretationPreview",
  "validateEmergencyPlanMode",
  "buildEmergencyPlanningRequest",
  "generateEmergencyMealPlan",
  "buildEmergencyResultModel",
  "renderEmergencyPlanningResultSummary"
].forEach((name) => expect(name, `${name} should be implemented.`));

[
  "How much can you spend?",
  "Plan until",
  "Use My Pantry",
  "Leftovers",
  "Frozen food",
  "Canned food",
  "Low-cost staples",
  "Chef Nova understood",
  "Confirm Interpretation"
].forEach((text) => expect(text, `Emergency form text "${text}" should be present.`));

[
  "existing-leftovers",
  "frozen-food",
  "canned-food",
  "low-cost-staples",
  "cross-meal-reuse",
  "low-cost-compatible-protein",
  "batch-cooking",
  "few-new-purchases"
].forEach((priority) => expect(priority, `Emergency priority ${priority} should be centralized.`));

assert(app.includes("if (!emergency.interpretationConfirmed)"), "Generation should be blocked until interpretation is confirmed.");
assert(app.includes("I have $25 until Friday"), "The required natural-language example should be supported in UI or validation.");
assert(app.includes("Numeric slash dates are ambiguous"), "Ambiguous numeric dates should not be silently accepted.");
assert(app.includes("Several possible budgets were found"), "Multiple budget values should be ambiguous.");
assert(app.includes("EMERGENCY_APP_TIMEZONE = \"America/Toronto\""), "Emergency parser should use the application timezone.");
assert(app.includes("generateBudgetRescueMealPlan(emergencyContext"), "Emergency mode should reuse the existing Budget Planning Algorithm.");
assert(app.includes("deriveBudgetStatusPanelModel") && app.includes("PLANNING_MODES.EMERGENCY"), "Emergency mode should reuse the Budget Status panel.");
assert(app.includes("deriveShoppingListViewModel"), "Emergency mode should reuse the existing Shopping List.");
assert(app.includes("validateGeneratedMealPlanSafety"), "Generated plans should continue to use hard safety validation.");
assert(!app.includes("EmergencyShoppingList"), "Do not create a separate Emergency Shopping List.");
assert(!app.includes("chefNovaEmergencyPantry"), "Do not create separate Emergency Pantry storage.");
assert(!app.includes("emergencyPantryItems"), "Do not create a separate Emergency Pantry data model.");
assert(!app.includes("Save Emergency Plan"), "Do not create a separate Save Emergency Plan workflow.");

[
  ".emergency-plan-form",
  ".emergency-interpretation-card",
  ".emergency-include-grid",
  ".emergency-result",
  "@media print"
].forEach((selector) => assert(css.includes(selector), `${selector} styles should exist.`));

console.log("Emergency Plan mode static checks passed.");
