const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");

function includesAll(source, values) {
  values.forEach((value) => assert(source.includes(value), `Missing expected text: ${value}`));
}

includesAll(app, [
  "function createEmptyBudgetRescueDraft()",
  "weeklyBudgetCents",
  "currency: BUDGET_RESCUE_CURRENCY",
  "priceCushionPercent",
  "household: {",
  "mealsToPlan",
  "availableAppliances",
  "preferredStores",
  "priceSource",
  "function parseCurrencyToCents(value)",
  "function captureBudgetRescueFormState()",
  "function validateBudgetRescueMode()",
  "function renderBudgetPreferenceSummary()",
  "function openBudgetRescuePreferences()",
  "function openBudgetRescuePantry()",
  'BUDGET_RESCUE_PRICE_SOURCES.SAVED_PROFILE',
  'data-planning-mode-input="availableAppliance"',
  'data-planning-mode-input="mealToPlan"',
  'data-planning-mode-input="preferredStores"',
  'data-planning-mode-input="priceSource"'
]);

includesAll(app, [
  "Enter an amount greater than $0 to create a budget plan.",
  "Enter a price cushion from 0% to less than 100%.",
  "Enter at least one household member using whole numbers.",
  "Choose 1 to 7 planning days.",
  "Select at least one meal type.",
  "No saved price profiles are available yet."
]);

includesAll(css, [
  ".budget-rescue-form",
  ".budget-rescue-fieldset",
  ".budget-rescue-grid",
  ".budget-rescue-check-grid",
  ".budget-derived-summary",
  ".budget-preference-summary",
  ".price-source-option",
  ".unit-input"
]);

assert(html.includes('id="planner-page"'), "Existing Meal Planner page is missing.");
assert(!html.includes('id="budget-rescue-page"'), "Budget Rescue must not be a separate page.");
assert(!html.includes("chefNovaBudgetRescue"), "Budget Rescue must not introduce a separate storage key.");
assert(!app.includes("chefNovaBudgetRescue"), "Budget Rescue must use existing meal plan storage.");

console.log("Budget Rescue form static checks passed.");
