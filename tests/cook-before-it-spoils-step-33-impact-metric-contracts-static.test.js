const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const definitions = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-impact-metric-definitions.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-33-report.md"), "utf8");

function bodyOf(functionName) {
  const start = app.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} must exist`);
  const next = app.indexOf("\n  function ", start + 12);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "RESCUE_IMPACT_METRIC_CONTRACT_REGISTRY_VERSION",
  "RESCUE_ATTRIBUTION_VERSION",
  "PHYSICAL_SEGMENT_DEDUPLICATION_VERSION",
  "IMPACT_RECOGNITION_MODEL_VERSION",
  "RESCUE_WINDOW_SNAPSHOT_VERSION",
  "RESCUE_IMPACT_PERIOD_VERSION",
  "RESCUE_IMPACT_COVERAGE_VERSION",
  "RESCUE_IMPACT_CONFIDENCE_VERSION",
  "RESCUE_IMPACT_SNAPSHOT_VERSION",
  "RESCUE_IMPACT_AUDIT_VERSION"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} must be defined`));

[
  "INGREDIENTS_USED_BEFORE_PRIORITY_DATE",
  "LEFTOVER_SERVINGS_REUSED",
  "ESTIMATED_MONEY_SAVED",
  "POSSIBLE_FOOD_WASTE_AVOIDED",
  "FOOD_PROTECTED_FOR_LATER_USE"
].forEach((name) => assert(app.includes(name), `${name} metric id must exist`));

[
  "ELIGIBLE",
  "PENDING_CONFIRMATION",
  "PROTECTED_FOR_LATER_USE",
  "CONFIRMED_RESCUED",
  "DONATED_OR_SHARED",
  "CONFIRMED_DISCARDED",
  "OUTCOME_UNKNOWN",
  "REVIEW_REQUIRED",
  "REVERSED"
].forEach((status) => assert(app.includes(status), `${status} attribution status must exist`));

[
  "OUTSIDE_RESCUE_WINDOW",
  "USED_AFTER_PRIORITY_DATE",
  "QUANTITY_UNKNOWN",
  "WEIGHT_UNAVAILABLE",
  "PRICE_UNAVAILABLE",
  "FROZEN_NOT_YET_USED",
  "DONATED_NOT_HOUSEHOLD_SAVINGS",
  "DUPLICATE_PHYSICAL_SEGMENT",
  "LINEAGE_REVIEW_REQUIRED",
  "REVERSED_EVENT",
  "SUPERSEDED_EVENT"
].forEach((reason) => assert(app.includes(reason), `${reason} exclusion reason must exist`));

[
  "createRescueImpactPeriod",
  "deriveRescueImpactAttributions",
  "buildRescueImpactSnapshot",
  "renderRescueImpactAuditPreview",
  "buildImpactAudit",
  "createMetricCoverage",
  "deriveImpactConfidence",
  "resolveImpactWeightSnapshot",
  "resolveImpactHistoricalValueSnapshot",
  "getRescueWindowSnapshotForPantryItem"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} must be implemented`));

assert(app.includes("RESCUE_IMPACT_METRIC_CONTRACTS"), "Metric contract registry must exist");
assert(app.includes("window.CHEF_NOVA_RESCUE_IMPACT"), "Internal validation API must expose derived impact helpers");

const snapshotBody = bodyOf("buildRescueImpactSnapshot");
assert(snapshotBody.includes("deriveRescueImpactAttributions"), "Impact snapshot must derive from the attribution layer");
assert(snapshotBody.includes("getActiveUserScopeId"), "Impact snapshot must be user-scoped");
assert(snapshotBody.includes("creditedMassSegments") && snapshotBody.includes("creditedValueSegments"), "Impact snapshot must prevent physical mass and value double counting");
assert(snapshotBody.includes("moneyByCurrency"), "Money saved must stay separated by currency");
assert(snapshotBody.includes("DONATED_NOT_HOUSEHOLD_SAVINGS"), "Donation/sharing must not count as household money saved");
assert(snapshotBody.includes("WEIGHT_UNAVAILABLE") && snapshotBody.includes("PRICE_UNAVAILABLE"), "Missing weight and price must be explicit coverage exclusions");
assert(!snapshotBody.includes("unknownWeight") || !snapshotBody.includes("= 0 g"), "Unknown weight must not be presented as zero");
assert(!snapshotBody.includes("unpriced") || !snapshotBody.includes("$0"), "Unpriced food must not be presented as zero dollars");

const attributionBody = bodyOf("deriveRescueImpactAttributions");
assert(attributionBody.includes("state.pantry") && attributionBody.includes("loadFoodEventHistory"), "Attributions must derive from Pantry and Food Event History");
assert(attributionBody.includes("deriveEffectiveFoodEvents"), "Attributions must use effective Food Event History");
assert(attributionBody.includes("MARKED_FROZEN") && attributionBody.includes("PROTECTED_FOR_LATER_USE"), "Frozen-only food must be protected stock, not saved impact");
assert(attributionBody.includes("LEFTOVER_QUANTITY_CONSUMED") && attributionBody.includes("LEFTOVER_QUANTITY_TRANSFORMED"), "Leftover consumption and transformation outcomes must be recognized");
assert(attributionBody.includes("DONATED_SHARED") && attributionBody.includes("DISCARDED"), "Donation/sharing and discard outcomes must be represented");

const valueBody = bodyOf("resolveImpactHistoricalValueSnapshot");
assert(valueBody.includes("historicalCostBasis") || valueBody.includes("pricePaidCents"), "Money saved must use historical price basis");
assert(valueBody.includes("ratio") && valueBody.includes("confirmedRescuedQuantity"), "Partial-package value must be proportional");

const previewBody = bodyOf("renderRescueImpactAuditPreview");
assert(previewBody.includes("Contract validation only"), "Step 33 must remain a minimal audit preview");
assert(previewBody.includes("This is not a cash refund"), "Money wording must avoid guaranteed savings");
assert(previewBody.includes("not yet counted as used or as possible food waste avoided"), "Protected food wording must stay separate");

[
  "impactEventStore",
  "rescuedFoodInventory",
  "savedFoodDatabase",
  "impactQuantityStore",
  "rescueMoneyLedger",
  "avoidedWasteInventory",
  "frozenImpactDatabase"
].forEach((forbidden) => assert(!app.includes(`const ${forbidden}`) && !app.includes(`let ${forbidden}`) && !app.includes(`var ${forbidden}`), `${forbidden} must not be created`));

assert(css.includes(".impact-audit-preview"), "Impact audit preview styles must exist");
assert(css.includes(".impact-audit-grid"), "Impact audit grid styles must exist");
assert(css.includes("@media (forced-colors: active)"), "Forced-colors support must remain present");
assert(css.includes("@media print"), "Print support must remain present");

[
  "# Chef Nova Food-Rescue Impact Metric Definitions",
  "Period-flow",
  "Point-in-time stock",
  "Physical Quantity Attribution",
  "No Causal Claims",
  "Deferred Work"
].forEach((phrase) => assert(definitions.includes(phrase), `Definitions doc must include ${phrase}`));

[
  "Second impact event stores created: 0",
  "Frozen-only food counted as money saved: 0",
  "Unknown weight counted as 0 g: 0",
  "Different currencies combined: 0",
  "Step 33 completion status"
].forEach((phrase) => assert(report.includes(phrase), `Step 33 report must include ${phrase}`));

console.log("Step 33 impact metric contract static checks passed.");
