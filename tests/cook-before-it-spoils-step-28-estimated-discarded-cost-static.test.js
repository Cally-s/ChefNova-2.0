const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-estimated-discarded-cost.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-28-report.md"), "utf8");

[
  "DISCARD_PRICE_RESOLUTION_REQUEST_VERSION",
  "DISCARD_PRICE_RESOLUTION_VERSION",
  "DISCARD_COST_ESTIMATE_VERSION",
  "DISCARD_COST_CONFIDENCE_VERSION",
  "DISCARD_PRICE_SOURCE_TYPES",
  "DISCARD_PRICE_CONFIDENCE",
  "DISCARD_COST_CONFIDENCE",
  "function buildDiscardPriceResolutionRequest",
  "function resolveDiscardPrice",
  "function calculateDiscardCostEstimate",
  "function formatDiscardCostEstimate",
  "function openDiscardCostDetails",
  "function openAddDiscardPriceWorkflow",
  "function saveDiscardPriceEnrichment"
].forEach((needle) => assert(app.includes(needle), `${needle} is missing`));

const costBlock = app.match(/function calculateDiscardCostEstimate\(draft[\s\S]*?function calculateDiscardedValueCents/);
assert(costBlock, "discard cost calculation block missing");
const costCode = costBlock[0];
assert(app.includes("COST_ENGINE.normalizeComparableQuantity"), "Cost Engine normalized quantities must be used");
assert(app.includes("PRICE_DATA.resolveIngredientPrice"), "Price Resolver must be reused");
assert(costCode.includes("estimatedDiscardedCost = discardedCanonicalQuantity * (packagePrice / normalizedPackageQuantity)"), "required formula text missing");
assert(costCode.includes("packagePrice * quantity / packageQuantity.quantity"), "final cost calculation must use package price divided by normalized package quantity");
assert(costCode.includes("minimumEstimateMinorUnits"), "range minimum missing");
assert(costCode.includes("maximumEstimateMinorUnits"), "range maximum missing");
assert(costCode.includes("priceSnapshotHash"), "historical snapshot hash missing");
assert(app.includes("Cost estimate unavailable"), "missing price state must be unavailable");
assert(!/estimatedDiscardedValueCents:\s*0/.test(costCode), "missing prices must not be stored as zero");

[
  "Confirmed price",
  "User-entered estimate",
  "Saved store estimate",
  "Chef Nova estimate",
  "Price unavailable"
].forEach((needle) => assert(app.includes(needle), `visible confidence label missing: ${needle}`));

const dashboardBlock = app.match(/function buildWasteDashboardProjection\(days = 30\) \{[\s\S]*?function wastePatternLabelForEntry/);
assert(dashboardBlock, "Waste Dashboard projection block missing");
const dashboard = dashboardBlock[0];
[
  "confirmedPriceValueMinorUnits",
  "userEstimateValueMinorUnits",
  "savedStoreEstimateValueMinorUnits",
  "chefNovaEstimateValueMinorUnits",
  "pricedEntryCount",
  "unpricedEntryCount",
  "coverageRatio"
].forEach((needle) => assert(dashboard.includes(needle), `dashboard value summary missing: ${needle}`));

const enrichmentBlock = app.match(/function saveDiscardPriceEnrichment\(eventId\) \{[\s\S]*?\n  \}/);
assert(enrichmentBlock, "price enrichment saver missing");
const enrichment = enrichmentBlock[0];
assert(enrichment.includes('correctionType: "discard-cost-enrichment"'), "price enrichment must be a correction/enrichment event");
assert(enrichment.includes("appendFoodEventsToHistory"), "price enrichment must preserve Food Event History");
assert(enrichment.includes("displayPantry()"), "diary should refresh after price enrichment");
assert(!enrichment.includes("executePantryCommand"), "price enrichment must not change Pantry");

[
  "[data-waste-diary-cost-details]",
  "[data-waste-diary-add-price]",
  "[data-discard-price-save]",
  "Add Approximate Price",
  "Update Cost Estimate"
].forEach((needle) => assert(app.includes(needle), `UI/action missing: ${needle}`));

[
  ".discard-cost-unavailable",
  ".discard-cost-details",
  "#discardPriceEnrichmentForm"
].forEach((needle) => assert(css.includes(needle), `${needle} CSS missing`));

[
  "packagePrice = $4.50",
  "normalizedPackageQuantity = 300 g",
  "discardedCanonicalQuantity = 120 g",
  "estimatedDiscardedCost = $1.80",
  "Missing prices stay unavailable",
  "No new price catalogue, cost engine, pantry, or waste value store was created."
].forEach((needle) => assert(doc.includes(needle), `documentation missing: ${needle}`));

[
  "Missing prices are unavailable, not zero.",
  "Add Approximate Price creates a correction/enrichment event only.",
  "Pantry is not changed by price enrichment.",
  "Unsupported conversions stay unavailable."
].forEach((needle) => assert(report.includes(needle), `report missing: ${needle}`));

console.log("Step 28 Estimated Discarded Cost static checks passed.");
