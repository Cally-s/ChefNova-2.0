const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-evidence-based-pattern-detection.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-30-report.md"), "utf8");

[
  "WASTE_PATTERN_CHECK_VERSION = 2",
  "WASTE_PATTERN_INCIDENT_NORMALIZATION_VERSION = 1",
  "WASTE_PATTERN_CONFIDENCE_VERSION = 1",
  "WASTE_PATTERN_CONFIG",
  "minimumRelatedIncidents: 3",
  "minimumDistinctDates: 2",
  "manualIdentityMinimumIncidents: 4",
  "maximumSurfacedPatterns: 3",
  "WASTE_PATTERN_CHECK_STATUSES",
  "INSUFFICIENT_DATA",
  "MONITORING",
  "POSSIBLE_PATTERN",
  "REVIEW_REQUIRED",
  "DISMISSED",
  "WITHDRAWN",
  "EXPIRED",
  "NEEDS_RECALCULATION",
  "WASTE_PATTERN_TYPES",
  "REPEATED_INGREDIENT_DISCARD",
  "REPEATED_COOKED_TOO_MUCH",
  "REFRIGERATOR_VISIBILITY",
  "BACK_OF_REFRIGERATOR",
  "LARGE_PACKAGE_UNFINISHED",
  "ONE_RECIPE_INGREDIENT",
  "PLANNED_LEFTOVER_NOT_USED",
  "FROZEN_WITHOUT_MEAL_PLAN",
  "DUPLICATE_PANTRY_PURCHASE",
  "DATE_TYPE_UNCERTAINTY",
  "PATTERN_FEEDBACK_TYPES",
  "INCIDENT_NOT_RELATED",
  "RESTORE_PATTERN"
].forEach((needle) => assert(app.includes(needle), `${needle} missing`));

const configBlock = app.match(/const WASTE_PATTERN_CONFIG = Object\.freeze\(\{[\s\S]*?\n  \}\);/);
assert(configBlock, "threshold configuration missing");
[
  "repeatedIngredientDiscard",
  "repeatedCookedTooMuch",
  "refrigeratorVisibility",
  "backOfRefrigerator",
  "largePackageUnfinished",
  "oneRecipeIngredient",
  "plannedLeftoverNotUsed",
  "frozenWithoutMealPlan",
  "duplicatePantryPurchase",
  "dateTypeUncertainty",
  "windowDays: 60",
  "windowDays: 90"
].forEach((needle) => assert(configBlock[0].includes(needle), `config missing: ${needle}`));

[
  "function normalizeWastePatternIncident",
  "patternIncidentVersion",
  "rootEventId",
  "localDate",
  "function dedupeWastePatternIncidents",
  "function createWastePatternResult",
  "function chooseNonOverlappingWastePatterns",
  "function buildDiscardPatternCandidates",
  "function buildReasonPatternCandidates",
  "function buildPackageAndLeftoverPatternCandidates",
  "function buildFrozenPatternCandidates",
  "function buildDuplicatePantryPatternCandidates",
  "function buildDateCorrectionPatternCandidates"
].forEach((needle) => assert(app.includes(needle), `${needle} missing`));

const checkerBlock = app.match(/function checkWastePatterns\(\) \{[\s\S]*?function renderWasteDashboardProjection/);
assert(checkerBlock, "pattern checker block missing");
const checker = checkerBlock[0];
assert(checker.includes("selectWasteDiaryEntries()"), "checker must reuse effective Waste Diary projection");
assert(checker.includes("dedupeWastePatternIncidents"), "checker must dedupe incidents");
assert(checker.includes("chooseNonOverlappingWastePatterns"), "checker must control overlap");
assert(!checker.includes("note"), "checker must not analyze free-text notes");
assert(!checker.includes("Math.random"), "checker must be deterministic");
assert(!checker.includes("Date.now()"), "checker must not use current milliseconds as a tie-breaker");

const resultBlock = app.match(/function createWastePatternResult\([\s\S]*?function addWastePatternCandidate/);
assert(resultBlock, "pattern result builder missing");
[
  "deduped.length < requiredIncidents",
  "distinctActual < requiredDistinct",
  "WASTE_PATTERN_CHECK_STATUSES.WITHDRAWN",
  "WASTE_PATTERN_CHECK_STATUSES.DISMISSED",
  "wastePatternResultVersion",
  "dataCoverage",
  "dataLimitations",
  "This is a planning observation, not a judgment.",
  "view-related-records",
  "mark-intentional",
  "dismiss",
  "restore"
].forEach((needle) => assert(resultBlock[0].includes(needle), `result builder missing: ${needle}`));

[
  "data-waste-pattern-details",
  "data-waste-pattern-filter",
  "data-waste-pattern-intentional",
  "data-waste-pattern-dismiss",
  "data-waste-pattern-restore",
  "function openWastePatternDetails",
  "function markWastePatternIntentional",
  "function restoreWastePattern",
  "function loadWastePatternFeedback",
  "function saveWastePatternFeedback"
].forEach((needle) => assert(app.includes(needle), `${needle} UI/feedback path missing`));

[
  "Chef Nova does not say the user wastes food",
  "One physical discard counts once.",
  "The baseline is at least three related effective incidents.",
  "Manual names require four exact-label incidents.",
  "Confidence is low or moderate only.",
  "Step 30 never changes Shopping List items",
  "Cost and weight may appear in Waste Diary records, but they do not prove behavior"
].forEach((needle) => assert(doc.includes(needle), `documentation missing: ${needle}`));

[
  "Second pattern-detection engines created: 0",
  "Patterns surfaced after one related incident: 0",
  "Patterns surfaced after only two related incidents: 0",
  "Free-text notes analyzed for behaviour: 0",
  "Cost or weight used to diagnose behaviour: 0",
  "Patterns automatically changing Shopping Lists or meal plans: 0",
  "Step 30 is implemented."
].forEach((needle) => assert(report.includes(needle), `report missing: ${needle}`));

[
  ".waste-pattern-metrics",
  ".waste-pattern-limit",
  ".waste-pattern-modal",
  ".waste-pattern-related-list",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((needle) => assert(css.includes(needle), `${needle} CSS missing`));

[
  "frequently waste",
  "never use frozen food",
  "misunderstands expiration",
  "shame score",
  "public comparison"
].forEach((forbidden) => assert(!app.toLowerCase().includes(forbidden), `forbidden wording in app: ${forbidden}`));

[
  "carbonFactor",
  "calculateCarbon",
  "environmentalScore",
  "kg-co2e"
].forEach((forbidden) => assert(!app.includes(forbidden), `forbidden environmental calculation wording in app: ${forbidden}`));

console.log("Step 30 conservative pattern detection static checks passed.");
