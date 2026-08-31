const fs = require("fs");
const path = require("path");
const assert = require("assert");
const costEngine = require("../scripts/cost-calculation-engine.js");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-estimate-weight-carefully.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-29-report.md"), "utf8");

[
  "QUANTITY_DIMENSIONS",
  "MEASUREMENT_CONVERSION_TYPES",
  "CONVERSION_REVIEW_STATUSES",
  "WEIGHT_ESTIMATE_CONFIDENCE",
  "DISCARDED_WEIGHT_REQUEST_VERSION",
  "MEASUREMENT_CONVERSION_POLICY_SCHEMA_VERSION",
  "MEASUREMENT_CONVERSION_RESOLUTION_VERSION",
  "DISCARDED_WEIGHT_CALCULATION_VERSION",
  "WEIGHT_CONFIDENCE_MODEL_VERSION",
  "function resolveQuantityDimension",
  "function buildDiscardedWeightRequest",
  "function resolveValidatedMeasurementConversion",
  "function buildDiscardedWeightEstimate",
  "function openDiscardWeightDetails",
  "function openAddDiscardWeightWorkflow",
  "function saveDiscardWeightEnrichment"
].forEach((needle) => assert(app.includes(needle), `${needle} missing`));

const kilogram = costEngine.normalizeComparableQuantity(1, "kg");
assert(kilogram.valid && kilogram.dimension === "mass" && kilogram.quantity === 1000 && kilogram.unit === "g", "1 kg must normalize to 1,000 g through the existing Unit Registry");
const grams = costEngine.normalizeComparableQuantity(1000, "g");
assert(grams.valid && grams.dimension === "mass" && grams.quantity === 1000, "1,000 g must remain exact mass");
const millilitres = costEngine.normalizeComparableQuantity(500, "ml");
assert(millilitres.valid && millilitres.dimension === "volume" && millilitres.quantity === 500, "500 ml must remain volume");

const weightBlock = app.match(/function buildDiscardedWeightEstimate\(estimate[\s\S]*?function formatDiscardedWeightEstimate/);
assert(weightBlock, "weight estimator block missing");
const weightCode = weightBlock[0];
assert(weightCode.includes("COST_ENGINE.normalizeComparableQuantity"), "weight estimator must reuse existing Unit Registry");
assert(weightCode.includes("pointWeightGrams"), "point weight grams missing");
assert(weightCode.includes("minimumWeightGrams"), "minimum weight grams missing");
assert(weightCode.includes("maximumWeightGrams"), "maximum weight grams missing");
assert(weightCode.includes("conversionSnapshotHash"), "historical conversion snapshot hash missing");
assert(app.includes("WEIGHT ESTIMATE UNAVAILABLE"), "missing-weight display missing");
assert(!/pointWeightGrams:\s*0/.test(weightCode), "unknown weight must not be stored as 0 g");

const resolverBlock = app.match(/function resolveValidatedMeasurementConversion\(request\) \{[\s\S]*?function buildDiscardedWeightEstimate/);
assert(resolverBlock, "conversion resolver block missing");
const resolver = resolverBlock[0];
assert(resolver.includes("MEASUREMENT_CONVERSION_TYPES.DENSITY"), "density conversion type missing");
assert(resolver.includes("MEASUREMENT_CONVERSION_TYPES.AVERAGE_UNIT_WEIGHT"), "average unit conversion type missing");
assert(resolver.includes("MEASUREMENT_CONVERSION_TYPES.SERVING_WEIGHT"), "serving conversion type missing");
assert(resolver.includes("CONVERSION_REVIEW_STATUSES.APPROVED"), "approved conversion status required");
assert(app.includes("DRAFT_AI_GENERATED"), "AI drafts must be modeled");
assert(resolver.includes("food-specific-density-unavailable"), "volume without density must be unavailable");
assert(resolver.includes("approved-average-weight-unavailable"), "count without average weight must be unavailable");
assert(!resolver.includes("500"), "resolver must not special-case 500 ml as grams");

[
  "Measured weight",
  "Exact unit conversion",
  "Validated package estimate",
  "Validated serving estimate",
  "Validated average-weight estimate",
  "Validated density estimate",
  "User estimate",
  "Weight unavailable"
].forEach((needle) => assert(app.includes(needle), `confidence label missing: ${needle}`));

[
  "data-waste-diary-weight-details",
  "data-waste-diary-add-weight",
  "data-discard-weight-save",
  "Add Weight Information",
  "Save Weight Information",
  'correctionType: "discard-weight-enrichment"'
].forEach((needle) => assert(app.includes(needle), `weight UI/action missing: ${needle}`));

const enrichmentBlock = app.match(/function saveDiscardWeightEnrichment\(eventId\) \{[\s\S]*?\n  \}/);
assert(enrichmentBlock, "weight enrichment save block missing");
assert(!enrichmentBlock[0].includes("executePantryCommand"), "weight enrichment must not change Pantry");
assert(enrichmentBlock[0].includes("appendFoodEventsToHistory"), "weight enrichment must append correction history");

const dashboardBlock = app.match(/function buildWasteDashboardProjection\(days = 30\) \{[\s\S]*?function wastePatternLabelForEntry/);
assert(dashboardBlock, "dashboard projection missing");
[
  "exactConvertedMassGrams",
  "validatedPackageEstimateGrams",
  "validatedServingEstimateGrams",
  "validatedAverageWeightEstimateGrams",
  "validatedDensityEstimateGrams",
  "userEstimatedMassGrams",
  "unknownWeightEntryCount",
  "nonMassCoverage"
].forEach((needle) => assert(dashboardBlock[0].includes(needle), `dashboard weight bucket missing: ${needle}`));

[
  ".discard-weight-unavailable",
  ".discard-weight-details",
  "#discardWeightEnrichmentForm",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((needle) => assert(css.includes(needle), `${needle} CSS missing`));

[
  "# Chef Nova Careful Discarded-Weight Estimation",
  "Chef Nova does not assume that 500 mL equals 500 g.",
  "minimumWeight = minimumQuantity * minimumConversionFactor",
  "Cost estimation remains separate.",
  "Photo-based weight estimation"
].forEach((needle) => assert(doc.includes(needle), `documentation missing: ${needle}`));

[
  "Second Unit Registries created: 0",
  "Unknown weights treated as zero: 0",
  "Five hundred millilitres automatically converted to 500 grams: 0",
  "Count quantities converted to mass without approved average-weight records: 0",
  "Serving quantities converted to mass without confirmed serving records: 0",
  "Raw ingredient sums treated as exact prepared-food weight: 0",
  "Historical Waste Diary estimates changing after conversion updates: 0",
  "Cost calculations may remain count-, volume-, or serving-based without forcing mass."
].forEach((needle) => assert(report.includes(needle), `report missing: ${needle}`));

console.log("Step 29 careful discarded-weight static checks passed.");
