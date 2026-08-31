const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const docs = fs.readFileSync("docs/cook-before-it-spoils-handle-unknown-quantities.md", "utf8");
const report = fs.readFileSync("docs/cook-before-it-spoils-step-48-report.md", "utf8");

function includes(source, snippet, message) {
  assert(source.includes(snippet), message || `Missing snippet: ${snippet}`);
}

[
  "const PANTRY_QUANTITY_INFORMATION_VERSION = 1",
  "const PANTRY_QUANTITY_REPRESENTATIONS = Object.freeze",
  "EXACT_NUMERIC: \"exact-numeric\"",
  "ESTIMATED_NUMERIC: \"estimated-numeric\"",
  "RANGE_NUMERIC: \"range-numeric\"",
  "MEAL_SERVING_CAPACITY: \"meal-serving-capacity\"",
  "UNKNOWN: \"quantity-unknown\"",
  "const PANTRY_QUANTITY_COVERAGE_STATUSES = Object.freeze",
  "const PANTRY_QUANTITY_POLICY_VERSION = 1",
  "const DEMAND_SUFFICIENCY_CONFIRMATION_VERSION = 1",
  "const QUANTITY_CAPACITY_ALLOCATION_VERSION = 1",
  "const UNKNOWN_QUANTITY_OUTCOME_VERSION = 1"
].forEach((snippet) => includes(app, snippet, `Missing Step 48 quantity model: ${snippet}`));

[
  "function normalizeQuantityInformation",
  "function resolvePantryQuantityState",
  "function formatPantryQuantityState",
  "function renderPantryQuantityStateSummary",
  "function renderQuantityConfirmationPanel",
  "function handleQuantityConfirmationSubmit",
  "function findFlexibleRecipesForQuantityReview",
  "function confirmQuantityForSpecificRecipeDemand",
  "quantityInformation: normalizeQuantityInformation(raw, quantityDetails)"
].forEach((snippet) => includes(app, snippet, `Missing Step 48 function or model hook: ${snippet}`));

[
  "QUANTITY NEEDS CONFIRMATION",
  "is recorded in your Pantry, but the amount is unknown.",
  "How much do you think is available?",
  "Enough for one meal serving",
  "Enough for two meal servings",
  "Approximately <input type=\"number\" min=\"1\" step=\"1\"",
  "I am not sure",
  "Save Quantity Estimate",
  "Review Later",
  "\"Enough for one meal serving\" means you believe",
  "Chef Nova will not convert this answer into an exact weight unless a compatible, reviewed conversion exists or you later confirm the amount.",
  "Quantity:</b>",
  "Estimated to support",
  "Exact amount:</b> Not recorded",
  "Chef Nova can suggest flexible recipes, but cost, remaining quantity, and food-rescue weight cannot yet be calculated precisely.",
  "Quantity:</b> Not recorded",
  "Chef Nova may show recipe ideas that can use a flexible amount.",
  "Confirm the quantity before relying on exact recipe, Shopping List, budget, reservation, or impact calculations.",
  "Find Flexible Recipes",
  "Confirm Exact Amount",
  "Confirm Quantity",
  "More"
].forEach((snippet) => includes(app, snippet, `Missing required Pantry UI text: ${snippet}`));

[
  "QUANTITY CONFIRMATION NEEDED",
  "This recipe uses approximately 80 g of spinach per serving.",
  "Your Pantry currently records:",
  "Enough for approximately",
  "Before this meal is saved, confirm whether the available amount can cover the selected recipe quantity.",
  "Yes, I Have Enough for This Recipe",
  "Enter an Approximate Amount",
  "Add ${escapeHtml(itemName)} to the Shopping List",
  "Choose Another Recipe",
  "confirmedForThisDemandOnly: true",
  "doesNotCreateExactAmount: true",
  "doesNotCreatePreciseReservation: true"
].forEach((snippet) => includes(app, snippet, `Missing required recipe confirmation behavior: ${snippet}`));

[
  "Chef Nova found recipe ideas that may work with the spinach currently recorded at home.",
  "The exact amount is not available, so these results are conditional.",
  "Confirm the quantity before cooking or finalizing the Shopping List."
].forEach((snippet) => includes(app, snippet, `Missing respectful conditional fallback: ${snippet}`));

const resolverBlock = app.match(/function resolvePantryQuantityState[\s\S]*?\n  function formatPantryQuantityState/);
assert(resolverBlock, "Could not locate quantity state resolver.");
includes(resolverBlock[0], "state.availableQuantity = null", "Unknown quantities must keep exact available quantity null.");
includes(resolverBlock[0], "state.canCalculatePreciseCost = false", "Unknown quantities must block precise cost.");
includes(resolverBlock[0], "state.canReserveExactly = false", "Unknown quantities must block exact reservation.");
includes(resolverBlock[0], "state.canClaimPreciseImpact = false", "Unknown quantities must block precise impact.");
includes(resolverBlock[0], "conservativeAvailableQuantity", "Range quantities must expose conservative minimum logic.");

assert(!/unknown.*do-not-buy|do-not-buy.*unknown|unknown.*full-coverage|full-coverage.*unknown/i.test(resolverBlock[0]), "Unknown quantities must not create Do Not Buy or full coverage.");
assert(!/mealServingCapacity[\s\S]{0,200}(unit:\s*\"g\"|convertedQuantity|grams)/.test(app), "Meal-serving capacity must not be auto-converted to grams.");

[
  ".pantry-quantity-state-summary",
  ".quantity-confirmation-panel",
  ".quantity-condition-warning",
  ".quantity-option-grid",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((snippet) => includes(css, snippet, `Missing Step 48 CSS: ${snippet}`));

[
  "# Chef Nova Unknown Quantity Handling",
  "## 1. Goal",
  "## 6. Unknown Is Not Zero",
  "## 7. Unknown Is Not Sufficient",
  "## 9. No Automatic Gram Conversion",
  "## 11. Numeric Ranges",
  "## 13. Demand-Specific Confirmation",
  "## 21. Recipe Warning",
  "## 27. Impact Boundary",
  "## 32. Registered User Isolation",
  "## 33. Guest Isolation",
  "## 40. Validation"
].forEach((snippet) => includes(docs, snippet, `Missing Step 48 doc section: ${snippet}`));

[
  "Unknown treated as zero: 0 occurrences added.",
  "Unknown treated as sufficient: 0 occurrences added.",
  "Automatic full Pantry coverage from unknown: 0.",
  "Do Not Buy from unknown: 0.",
  "Precise savings from unknown: 0.",
  "Precise food-rescue impact from unknown: 0.",
  "Exact reservation from unknown: 0.",
  "Meal-capacity converted to grams automatically: 0.",
  "Second Pantry systems created: 0.",
  "Second quantity systems created: 0.",
  "Normal user localStorage writes from guest mode: 0."
].forEach((snippet) => includes(report, snippet, `Missing Step 48 report zero result: ${snippet}`));

console.log("Cook Before It Spoils Step 48 unknown quantity static checks passed.");
