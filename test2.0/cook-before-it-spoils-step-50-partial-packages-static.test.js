const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-handle-partial-packages.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-50-report.md"), "utf8");

function includes(haystack, needle, message) {
  assert(haystack.includes(needle), message || `Expected to find ${needle}`);
}

[
  "const PARTIAL_PACKAGE_QUANTITY_VERSION = 1",
  "const ORIGINAL_PACKAGE_QUANTITY_VERSION = 1",
  "const REMAINING_QUANTITY_MODEL_VERSION = 1",
  "const PACKAGE_FILL_STATE_VERSION = 1",
  "const REMAINING_QUANTITY_CONFIDENCE_VERSION = 1",
  "const EFFECTIVE_PACKAGE_QUANTITY_RESOLVER_VERSION = 1",
  "const PARTIAL_PACKAGE_POLICY_VERSION = 1",
  "const PACKAGE_FILL_STATES = Object.freeze",
  "const PACKAGE_OPENING_STATES = Object.freeze",
  "const REMAINING_QUANTITY_CONFIDENCE = Object.freeze"
].forEach((needle) => includes(app, needle));

[
  "function getOriginalPackageQuantityRecord",
  "function getRemainingQuantityRecord",
  "function getEffectivePackageQuantityResolution",
  "function derivePackageFillState",
  "function formatRemainingQuantityRecord",
  "function calculatePartialPackageCurrentValue",
  "function createPackageSizeCorrectionDraft",
  "function createRemainingQuantityCorrectionDraft",
  "function createOverCapacityReviewModel",
  "function allocatePartialPackageAcrossDemands",
  "function createStartCookingPartialPackageCheck",
  "function createActualUseOutcomeDraft"
].forEach((needle) => includes(app, needle));

const resolverBlock = app.match(/function getEffectivePackageQuantityResolution\(item = \{\}\) \{[\s\S]*?function calculatePartialPackageCurrentValue/);
assert(resolverBlock, "Effective partial-package quantity resolver block missing.");
includes(resolverBlock[0], "originalPackageQuantity", "Resolver must keep original package quantity.");
includes(resolverBlock[0], "remainingQuantity", "Resolver must keep remaining quantity.");
includes(resolverBlock[0], "activeReservedQuantity", "Resolver must subtract reservations.");
includes(resolverBlock[0], "availableQuantity", "Resolver must expose available quantity.");
includes(resolverBlock[0], "packageFillState", "Resolver must derive package fill state.");
includes(resolverBlock[0], "Chef Nova is using the recorded remaining quantity, not the original package size", "Required warning missing.");
assert(!/availableQuantity:\s*originalPackageQuantity|availableQuantity:\s*original\.point|point:\s*originalPackageQuantity\.point/.test(resolverBlock[0]), "Original package quantity must not become available quantity.");

const fefoBlock = app.match(/function evaluatePackageForFefoDemand\(item = \{\}, demand = \{\}, options = \{\}\) \{[\s\S]*?function compareFefoPackageEvaluations/);
assert(fefoBlock, "FEFO evaluation block missing.");
includes(fefoBlock[0], "getEffectivePackageQuantityResolution(normalized)", "FEFO must use partial-package resolver.");
includes(fefoBlock[0], "packageQuantityResolution.availableQuantity", "FEFO must allocate current available quantity.");
includes(fefoBlock[0], "packageFillState", "FEFO must carry package fill state.");
assert(!/deriveAvailableQuantity\(normalized\);\s*const demandUnit/.test(fefoBlock[0]), "FEFO should not bypass the Step 50 resolver.");

const decisionBlock = app.match(/function createFefoAllocationDecision\([\s\S]*?function getPantryPackageGroups/);
assert(decisionBlock, "FEFO allocation decision block missing.");
includes(decisionBlock[0], "Math.min(Number(item.availableQuantity || 0), remaining)", "Allocation must use min(required, available).");
includes(decisionBlock[0], "plannedRemainingQuantity", "Decision must expose expected remainder.");
includes(decisionBlock[0], "quantityConfidence", "Decision must preserve quantity confidence.");
includes(decisionBlock[0], "originalPackageQuantity", "Decision must keep original package quantity as context.");
assert(!/currentQuantity:\s*item\.packageQuantity|availableQuantity:\s*item\.originalPackageQuantity/.test(decisionBlock[0]), "Decision must not use original package size as current amount.");

const recipeBlock = app.match(/function renderRecipeFefoPackageAllocationSummary\(recipe = \{\}\) \{[\s\S]*?function recipeCard/);
assert(recipeBlock, "Recipe package allocation summary block missing.");
[
  "Current package:",
  "Expected package remainder:",
  "Estimated missing quantity:",
  "Suggested purchase:",
  "Chef Nova is using the recorded remaining quantity, not the original package size",
  "Preview only. Pantry quantities remain unchanged until cooking is confirmed"
].forEach((needle) => includes(recipeBlock[0], needle, `Recipe card missing ${needle}`));
includes(recipeBlock[0], "formatEstimatedAwareQuantity", "Recipe card must preserve estimate labels.");

const pantryGroupBlock = app.match(/function renderPackageGroupReadModel\(groups = getPantryPackageGroups\(\)\) \{[\s\S]*?function createDefaultStorageEnvironment/);
assert(pantryGroupBlock, "Package group renderer block missing.");
[
  "Total original package quantity",
  "Current physical quantity",
  "Original package size:",
  "Estimated remaining quantity",
  "Quantity confidence:",
  "Package fill state:",
  "Current Pantry value:",
  "Record the current remaining amount"
].forEach((needle) => includes(pantryGroupBlock[0], needle, `Pantry package card missing ${needle}`));

const normalizeBlock = app.match(/function normalizePantryItem\(item\) \{[\s\S]*?function dedupeFoodDateRecords/);
assert(normalizeBlock, "normalizePantryItem block missing.");
includes(normalizeBlock[0], "pantryItem.partialPackageQuantity = getEffectivePackageQuantityResolution(pantryItem)", "Normalized Pantry item should expose derived partial-package state.");
assert(!/currentQuantity:\s*purchase\.packageQuantity|quantity:\s*purchase\.packageQuantity/.test(normalizeBlock[0]), "Normalization must not reset current quantity to package size.");

[
  "## 1. Purpose",
  "## 4. Original Package Quantity",
  "## 5. Current Remaining Quantity",
  "## 7. Package Fill States",
  "## 13. Estimated Ranges",
  "## 19. No Inferred Historical Use",
  "## 21. FEFO",
  "## 27. Full-Package Purchase Cost",
  "## 44. Food Event History",
  "## 54. Deferred Work"
].forEach((needle) => includes(doc, needle, `Documentation missing ${needle}`));

[
  "Original package quantity used as current remaining quantity: 0",
  "Recipe coverage calculated from original package size: 0",
  "Estimated remaining quantities displayed as exact: 0",
  "Unknown remaining quantities treated as full packages: 0",
  "Unknown remaining quantities converted to zero: 0",
  "AI-generated package remainder guesses: 0",
  "Guest partial-package records persisted into registered-user storage automatically: 0"
].forEach((needle) => includes(report, needle, `Report missing zero result ${needle}`));

includes(css, ".partial-package-warning", "Partial package warning styling missing.");
includes(css, "@media (forced-colors: active)", "Forced-colors support missing.");
includes(css, "@media (prefers-reduced-motion: reduce)", "Reduced-motion support missing.");
includes(css, "@media print", "Print support missing.");

[
  "partialPackagePantry",
  "remainingFoodInventory",
  "openPackageDatabase",
  "packageRemainderStore",
  "partialQuantityCopy",
  "remainingQuantityEngine",
  "secondPantryQuantitySystem",
  "AI remainder"
].forEach((forbidden) => {
  assert(!app.includes(forbidden), `Forbidden duplicate or AI remainder system found: ${forbidden}`);
});

console.log("Cook Before It Spoils Step 50 partial-package static checks passed.");
