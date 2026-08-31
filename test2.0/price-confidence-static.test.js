const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");

assert(app.includes("PRICE_CONFIDENCE_STATUSES"), "Price confidence statuses must be defined.");
assert(app.includes("PRICE_CONFIDENCE_SOURCE_TYPES"), "Price confidence source classes must be defined.");
assert(app.includes("function derivePriceConfidence"), "A shared price-confidence derivation function is required.");
assert(app.includes("function classifyPurchaseGroupPriceConfidence"), "Purchase groups must be classified once for price confidence.");
assert(app.includes("function getCoveragePercentDisplay"), "Coverage display rounding must be centralized.");
assert(app.includes("Math.min(99"), "Incomplete coverage must not round up to 100%.");
assert(app.includes("group.missingQuantity > 0 && group.status !== \"excluded\""), "Coverage must use required purchase groups, not recipe lines.");
assert(app.includes("canShowRemainingBudget: completeGroceryTotalAvailable"), "Remaining budget must be guarded by complete grocery totals.");
assert(app.includes("canClaimWithinBudget: completeGroceryTotalAvailable"), "Within-budget claims must be guarded by complete grocery totals.");
assert(app.includes("canClaimAboveBudget: completeGroceryTotalAvailable"), "Above-budget claims must be guarded by complete grocery totals.");
assert(app.includes("knownSubtotalAboveBudgetCents"), "Incomplete known-subtotal over-budget warnings must be separate from final variance.");
assert(app.includes("data-add-missing-prices"), "Add Missing Prices action must exist.");
assert(app.includes("openBudgetPriceReview"), "Add Missing Prices must reuse the Shopping List workflow.");
assert(app.includes("openGroceryPriceEditor"), "The existing grocery price editor must remain the price-editing entry point.");
assert(app.includes("No grocery purchases are currently required"), "No-purchases-required state must be handled.");

const unsafeIncompletePattern = /summary\.knownPurchaseSubtotalCents[\s\S]{0,300}remainingBudgetCents/;
assert(!unsafeIncompletePattern.test(app), "Known subtotals must not be used as remaining budget.");

console.log("Price confidence static checks passed.");
