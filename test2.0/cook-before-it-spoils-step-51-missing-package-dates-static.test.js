const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-missing-package-date-estimates.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-51-report.md"), "utf8");

function includes(haystack, needle, message) {
  assert(haystack.includes(needle), message || `Expected to find ${needle}`);
}

[
  "const USE_SOON_ESTIMATE_VERSION = 1",
  "const USE_SOON_RULE_CATALOGUE_VERSION = 1",
  "const PACKAGE_DATE_STATUSES = Object.freeze",
  "const USE_SOON_ESTIMATE_STATUSES = Object.freeze",
  "const USE_SOON_ESTIMATE_EVIDENCE_TYPES = Object.freeze",
  "const PLANNING_ESTIMATE_SUPPORT_LEVELS = Object.freeze",
  "const USE_SOON_ESTIMATE_EFFECTS = Object.freeze",
  "const USE_SOON_ESTIMATE_RULE_CATALOGUE = Object.freeze"
].forEach((needle) => includes(app, needle));

[
  "function deriveUseSoonEstimateForMissingPackageDate",
  "function getPackageDateStatusForUseSoonEstimate",
  "function isUseSoonEstimatePlanningAvailable",
  "function formatUseSoonPlanningWindow",
  "function renderUseSoonEstimateSummary",
  "function focusPantryDateEntryForm",
  "function editUseSoonEstimateBasis"
].forEach((needle) => includes(app, needle));

const estimateBlock = app.match(/function deriveUseSoonEstimateForMissingPackageDate\(item = \{\}, options = \{\}\) \{[\s\S]*?function isUseSoonEstimatePlanningAvailable/);
assert(estimateBlock, "Use-soon estimate derivation block missing.");
[
  "No package date was entered",
  "This is a planning estimate, not an official expiration date or a guarantee of food safety",
  "isOfficialPackageDate: false",
  "isExpirationDate: false",
  "isBestBeforeDate: false",
  "guaranteesFoodSafety: false",
  "maySupportRecipeRecommendation"
].forEach((needle) => includes(estimateBlock[0], needle, `Estimate model missing safety boundary ${needle}`));
assert(!/dateInformation\.type\s*=\s*[\"']expiration[\"']|dateInformation\.type\s*=\s*[\"']best-before[\"']/.test(estimateBlock[0]), "Use-soon estimate must not write official package date types.");
assert(!/expirationDate\s*=|freshnessDateType\s*=\s*[\"']best-before[\"']/.test(estimateBlock[0]), "Use-soon estimate must not update legacy expiration fields.");

const effectiveBlock = app.match(/function buildEffectiveUseFirstEvaluation\(item = \{\}, options = \{\}\) \{[\s\S]*?function evaluatePackageForFefoDemand/);
assert(effectiveBlock, "Effective use-first evaluation block missing.");
includes(effectiveBlock[0], "deriveUseSoonEstimateForMissingPackageDate", "Effective evaluation must derive use-soon estimates.");
includes(effectiveBlock[0], "effectiveDateType", "Effective evaluation must separate derived use-soon type from official date type.");
includes(effectiveBlock[0], "use-soon-planning-estimate", "Effective evaluation must label use-soon estimate confidence.");
includes(effectiveBlock[0], "dateType: dateIntelligence.primaryDateType || FOOD_DATE_TYPES.UNKNOWN", "Official date type must remain unknown when no package date exists.");

const fefoBlock = app.match(/function evaluatePackageForFefoDemand\(item = \{\}, demand = \{\}, options = \{\}\) \{[\s\S]*?function compareFefoPackageEvaluations/);
assert(fefoBlock, "FEFO evaluation block missing.");
includes(fefoBlock[0], "hasPlanningEstimateDate", "FEFO must recognize use-soon estimate dates.");
includes(fefoBlock[0], "evaluation.dateType === FOOD_DATE_TYPES.UNKNOWN && !hasPlanningEstimateDate", "FEFO must not force date review when a supported estimate exists.");

const priorityBlock = app.match(/function deriveUseFirstPriorityForPantryItem\(item, context = \{\}\) \{[\s\S]*?function compareUseFirstPriorityResults/);
assert(priorityBlock, "Priority engine block missing.");
includes(priorityBlock[0], "useSoonEstimate", "Priority result must expose use-soon estimate.");
includes(priorityBlock[0], "quantityUnavailable && !hasPlanningEstimateDate", "Unknown quantity must not zero date-based planning priority when an estimate exists.");
includes(priorityBlock[0], "omittedScoringFactors", "Priority result must identify omitted scoring factors.");
includes(priorityBlock[0], "quantity-at-risk", "Quantity-at-risk scoring must be omitted when quantity is unknown.");
includes(priorityBlock[0], "exact-rescue-coverage", "Exact rescue coverage must be omitted when quantity is unknown.");
includes(priorityBlock[0], "exact-pantry-value", "Exact value must be omitted when quantity is unknown.");

[
  "USE-SOON ESTIMATE",
  "PACKAGE DATE NOT RECORDED",
  "Chef Nova did not interpret this estimate as a best-before or expiration date.",
  "Find Flexible Recipes",
  "Enter Package Date",
  "Review Storage Details",
  "Edit Estimate",
  "Review Later"
].forEach((needle) => includes(app, needle, `Pantry card missing ${needle}`));

[
  ".use-soon-estimate-card",
  ".use-soon-estimate-badge",
  ".use-soon-evidence-list",
  ".use-soon-estimate-actions",
  "@media (forced-colors: active)",
  "@media print"
].forEach((needle) => includes(css, needle, `CSS missing ${needle}`));

[
  "## 1. Purpose",
  "## 3. What It Is Not",
  "## 6. Evidence Model",
  "## 9. Priority Engine",
  "## 11. FEFO and Multiple Packages",
  "## 14. Safety Language",
  "## 18. Deferred Work"
].forEach((needle) => includes(doc, needle, `Documentation missing ${needle}`));

[
  "Official expiration dates invented: 0",
  "Best-before dates invented: 0",
  "Package date fields overwritten by estimates: 0",
  "Duplicate missing-date systems created: 0",
  "Unknown quantities forced to zero priority: 0"
].forEach((needle) => includes(report, needle, `Report missing ${needle}`));

[
  "missingDatePantry",
  "estimatedExpiryDatabase",
  "freshnessGuessStore",
  "secondDateEngine",
  "AIExpirationEstimator",
  "dateLessFoodInventory",
  "missingDatePriorityEngine",
  "Safe until",
  "Unsafe after",
  "Best before August 18"
].forEach((forbidden) => {
  assert(!app.includes(forbidden), `Forbidden missing-date system or unsafe wording found: ${forbidden}`);
});

console.log("Cook Before It Spoils Step 51 missing-package-date static checks passed.");
