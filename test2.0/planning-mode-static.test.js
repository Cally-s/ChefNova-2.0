const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");

function includesAll(source, values) {
  values.forEach((value) => assert(source.includes(value), `Missing expected text: ${value}`));
}

includesAll(app, [
  "const PLANNING_MODES = Object.freeze",
  'STANDARD: "standard"',
  'BUDGET_RESCUE: "budget-rescue"',
  'EMERGENCY: "emergency"',
  'planningMode: PLANNING_MODES.STANDARD',
  "function normalizePlanningMode(value)",
  "function renderPlanningModeSelector()",
  "function handleMealPlanGenerationRequest()",
  "function handleBudgetRescueMode()",
  "function handleEmergencyPlanMode()",
  "weeklyGroceryBudget",
  "emergencyPlanRequest",
  "syncPlanningModeMetadataToPlan()",
  "weeklyPlan.planningMode = normalizePlanningMode(source.planningMode)",
  "weeklyPlan.modeInputs = normalizePlanningModeInputs(source.modeInputs)"
]);

includesAll(css, [
  ".planning-mode-panel",
  ".planning-mode-selector",
  ".planning-mode-options",
  ".planning-mode-option.active",
  ".planning-mode-fields[hidden]",
  ".currency-input",
  ".planning-shared-summary"
]);

assert(html.includes('id="planner-page"'), "Existing Meal Planner page is missing.");
assert(!html.includes('id="budget-rescue-page"'), "Budget Rescue must not be a separate page.");
assert(!html.includes('id="emergency-plan-page"'), "Emergency Plan must not be a separate page.");

const generateButtonListeners = (app.match(/generateMealPlanButton/g) || []).length;
assert(generateButtonListeners >= 1, "Generate Meal Plan button should still be wired.");
assert(app.includes('$("#generateMealPlanButton")?.addEventListener("click", handleMealPlanGenerationRequest)'), "Generate button should use the shared mode-aware entry point.");

console.log("Planning mode static checks passed.");
