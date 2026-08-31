const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const priceData = fs.readFileSync("scripts/price-data-shared.js", "utf8");
const eligibility = fs.readFileSync("scripts/recipe-eligibility-ranking.js", "utf8");
const docs = fs.readFileSync("docs/budget-edge-case-handling.md", "utf8");
const report = fs.readFileSync("docs/budget-edge-case-report.md", "utf8");
const recipes = JSON.parse(fs.readFileSync("data/recipes.json", "utf8"));

function has(source, text, message) {
  assert(source.includes(text), message || `Expected source to include ${text}`);
}

[
  "EDGE_CASE_ISSUE_TYPES",
  "UNKNOWN_PANTRY_RESOLUTIONS",
  "PROMOTION_EVALUATION_STATUSES",
  "PREPARATION_METHOD_TYPES",
  "EDGE_CASE_PRIORITY_ORDER",
  "createEdgeCaseIssue",
  "sortEdgeCaseIssues",
  "buildEdgeCaseIssuesFromCostResult",
  "edgeCaseSnapshotVersion",
  "planScopedPantryConfirmations",
  "packageRemainderSnapshots"
].forEach((text) => has(app, text, `${text} should exist for centralized edge-case handling.`));

[
  "Enter an amount greater than $0 to create a budget plan.",
  "validateBudgetAmountForPlanning(budget.weeklyBudgetCents, PLANNING_MODES.BUDGET_RESCUE)",
  "validateBudgetAmountForPlanning(emergency.availableBudgetCents, PLANNING_MODES.EMERGENCY)"
].forEach((text) => has(app, text, `Budget validation should include ${text}.`));

[
  "quantity-unknown",
  "Rice is listed in your Pantry, but the amount is unknown.",
  "I have enough",
  "I have some",
  "Add ${escapeHtml(item.displayName)} to the grocery list",
  "Plan-only Pantry confirmation",
  "buildBudgetCalculationPantry",
  "handleUnknownPantryResolution"
].forEach((text) => has(app + docs, text, `Unknown Pantry handling should include ${text}.`));

[
  "Price required",
  "Missing prices stay visible and are never counted as $0.00.",
  "blocksBudgetClaim: true",
  "Add Approximate Price"
].forEach((text) => has(app, text, `Missing price protection should include ${text}.`));

[
  "PROMOTION_TYPES",
  "multi-buy",
  "purchasePackageCount",
  "bundlePriceCents",
  "evaluateMultiPackagePromotion",
  "promotionCostCents <",
  "Chef Nova will not buy extra packages automatically"
].forEach((text) => has(app + priceData + docs, text, `Promotion handling should include ${text}.`));

[
  "createPackageRemainderRecord",
  "estimatedRemainingQuantity",
  "Potential future Pantry amount",
  "It is not added automatically.",
  "confirmPackageRemainderForPantry",
  "This package remainder was already added to Pantry."
].forEach((text) => has(app, text, `Package remainder handling should include ${text}.`));

[
  "requiredApplianceIds || method.requiredAppliances",
  "ready-to-assemble",
  "serve-cold",
  "validated: true"
].forEach((text) => has(app + eligibility + docs + JSON.stringify(recipes), text, `No-appliance support should include ${text}.`));

const validatedNoAppliance = recipes.filter((recipe) => (recipe.preparationMethods || []).some((method) => method.validated === true && Array.isArray(method.requiredApplianceIds) && method.requiredApplianceIds.length === 0));
assert(validatedNoAppliance.length >= 4, "At least four recipes should have explicit validated no-appliance methods.");

[
  "budget-edge-case-summary",
  "unknown-pantry-control",
  "edge-case-quantity-row",
  "package-remainder-control",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((text) => has(css, text, `Edge-case UI CSS should include ${text}.`));

[
  "Zero budgets accepted for budget planning: 0",
  "Blank budgets converted to zero: 0",
  "Unknown Pantry quantities treated as sufficient: 0",
  "Missing prices treated as zero: 0",
  "Extra promotional packages purchased automatically: 0",
  "Package remainders added to Pantry automatically: 0",
  "Incomplete totals labelled complete: 0"
].forEach((text) => has(report, text, `Validation report should include ${text}.`));

[
  "budgetRescueEdgeCasePantry",
  "edgeCaseShoppingList",
  "edgeCaseCostEngine",
  "localStorage.setItem(\"chefNovaEdge",
  "sessionStorage.setItem(\"chefNovaEdge"
].forEach((forbidden) => assert(!app.includes(forbidden), `Do not create duplicate edge-case systems: ${forbidden}`));

console.log("Budget edge-case handling static checks passed.");
