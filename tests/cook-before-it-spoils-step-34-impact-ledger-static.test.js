const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-impact-ledger.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-34-report.md"), "utf8");

function bodyOf(functionName) {
  const start = app.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} must exist`);
  const next = app.indexOf("\n  function ", start + 12);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "IMPACT_LEDGER_ENTRY_SCHEMA_VERSION",
  "IMPACT_LEDGER_POLICY_VERSION",
  "IMPACT_LEDGER_LOGICAL_CLAIM_KEY_VERSION",
  "IMPACT_LEDGER_DEDUPLICATION_KEY_VERSION",
  "IMPACT_LEDGER_EFFECTIVE_SELECTOR_VERSION"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} must be defined`));

[
  "IMPACT_LEDGER_ENTRY_CLASSES",
  "IMPACT_LEDGER_OPERATION_TYPES",
  "IMPACT_LEDGER_POSTING_STATUSES",
  "IMPACT_RECOGNITION_STATUSES",
  "RESCUE_ACTIVITY_TYPES",
  "IMPACT_STOCK_MOVEMENT_TYPES"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} controlled values must exist`));

[
  "buildImpactLedger",
  "getEffectiveMetricBalance",
  "getActivityCount",
  "getProtectedStockBalance",
  "getPhysicalSegmentLedgerHistory",
  "getLogicalClaimHistory",
  "selectEffectiveImpactLedgerEntries",
  "getImpactLedgerLogicalClaimKey",
  "getImpactLedgerDeduplicationKey",
  "createImpactLedgerPosting",
  "createImpactLedgerReplacement",
  "createImpactLedgerReversal",
  "validateImpactQuantityConservation",
  "validateImpactValueConservation",
  "buildImpactPhysicalSegmentClaimRegistry",
  "renderImpactLedgerAuditView"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} must be implemented`));

const ledgerBody = bodyOf("buildImpactLedger");
assert(ledgerBody.includes("buildRescueImpactSnapshot"), "Ledger must derive from Step 33 impact snapshots");
assert(ledgerBody.includes("deriveRescueImpactAttributions"), "Ledger must derive from Step 33 attributions");
assert(ledgerBody.includes("state.currentImpactLedger"), "Ledger may cache the active derived projection only");
assert(ledgerBody.includes("includedLedgerEntryIds") && ledgerBody.includes("excludedLedgerEntryIds"), "Step 33 metric audits must reference ledger entry IDs");
assert(ledgerBody.includes("entriesByDeduplicationKey"), "Ledger build must be idempotent by deduplication key");
assert(ledgerBody.includes("PROTECTED_STOCK_IN") && ledgerBody.includes("PROTECTED_STOCK_OUT_USED") && ledgerBody.includes("PROTECTED_STOCK_OUT_DISCARDED"), "Protected stock inflow and outflow postings must exist");
assert(ledgerBody.includes("FREEZING_ACTION") && ledgerBody.includes("RESCUE_RECIPE_COMPLETED") && ledgerBody.includes("DONATION_OR_SHARING_ACTION"), "Activity postings must stay separate");

const logicalKeyBody = bodyOf("getImpactLedgerLogicalClaimKey");
assert(logicalKeyBody.includes("physicalSegmentId"), "Logical claim keys must use physical segment identity");
assert(logicalKeyBody.includes("rootInventoryItemId"), "Ingredient count keys must use source Pantry item identity");
assert(!logicalKeyBody.includes("displayName"), "Logical claim keys must not use display names");
assert(!logicalKeyBody.includes("sourceQuantity"), "Logical claim keys must not use mutable quantity text");

const dedupBody = bodyOf("getImpactLedgerDeduplicationKey");
assert(dedupBody.includes("source-revision") && dedupBody.includes("ledger-policy-v"), "Deduplication keys must include source revision and policy version");

const selectorBody = bodyOf("selectEffectiveImpactLedgerEntries");
assert(selectorBody.includes("logicalClaimKey"), "Effective selector must group by logical claim key");
assert(selectorBody.includes("REVERSAL"), "Effective selector must apply reversal entries");
assert(selectorBody.includes("REVIEW_REQUIRED"), "Effective selector must preserve review-required entries separately");
assert(selectorBody.includes("compareImpactLedgerEntries"), "Effective selector must sort deterministically");

const metricBody = bodyOf("getEffectiveMetricBalance");
assert(metricBody.includes("valuesByCurrency"), "Money balances must stay separated by currency");
assert(!metricBody.includes("$0"), "Missing money must not be displayed as zero");

const stockBody = bodyOf("getProtectedStockBalance");
assert(stockBody.includes("referenceDateTime"), "Protected stock must support as-of queries");
assert(stockBody.includes("direction === \"decrease\""), "Protected stock must support outflows");
assert(!stockBody.includes("* 10"), "Protected stock must not be summed once per day");

const renderBody = bodyOf("renderImpactLedgerAuditView");
assert(renderBody.includes("Impact Ledger"), "Audit view must have a visible Impact Ledger heading");
assert(renderBody.includes("Entry class") && renderBody.includes("Current effective status"), "Audit view must show class and effective status");
assert(renderBody.includes("Quantity confidence") && renderBody.includes("Weight confidence") && renderBody.includes("Price confidence"), "Audit view must show confidence labels");
assert(renderBody.includes("How double counting is prevented"), "Audit view must include the double-counting explanation");

[
  "impactEventHistory",
  "impactInventory",
  "rescuedFoodInventory",
  "savedFoodDatabase",
  "impactQuantityStore",
  "impactMoneyStore",
  "secondFoodEventHistory"
].forEach((forbidden) => {
  assert(!app.includes(`const ${forbidden}`) && !app.includes(`let ${forbidden}`) && !app.includes(`var ${forbidden}`), `${forbidden} must not be created`);
});

assert(css.includes(".impact-ledger-audit"), "Ledger audit styles must exist");
assert(css.includes(".impact-ledger-summary"), "Ledger summary styles must exist");
assert(css.includes(".impact-ledger-history"), "Ledger history styles must exist");
assert(css.includes("@media (forced-colors: active)"), "Forced-colors support must remain present");
assert(css.includes("@media print"), "Print support must remain present");
assert(css.includes("@media (prefers-reduced-motion: reduce)"), "Reduced-motion support must remain present");

[
  "# Chef Nova Impact Ledger",
  "Ledger Versus Source Events",
  "Physical Food Segments",
  "Logical Claim Keys",
  "Deduplication Keys",
  "Freeze-Recipe-Consumption Example",
  "Deferred Work"
].forEach((phrase) => assert(doc.includes(phrase), `Impact Ledger doc must include ${phrase}`));

[
  "Second Food Event History stores created: 0",
  "Freezing actions counted as final waste avoided: 0",
  "Recipe completion and consumption both adding full weight credit: 0",
  "Unknown weight represented as 0 g: 0",
  "Guest ledger entries persisted into registered-user storage automatically: 0",
  "Step 34 completion status"
].forEach((phrase) => assert(report.includes(phrase), `Step 34 report must include ${phrase}`));

console.log("Step 34 impact ledger static checks passed.");
