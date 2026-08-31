const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const docs = fs.readFileSync("docs/cook-before-it-spoils-multiple-package-fefo.md", "utf8");
const report = fs.readFileSync("docs/cook-before-it-spoils-step-49-report.md", "utf8");

function includes(source, snippet, message) {
  assert(source.includes(snippet), message || `Missing snippet: ${snippet}`);
}

[
  "const PANTRY_PACKAGE_GROUP_VERSION = 1",
  "const PANTRY_PACKAGE_STATE_MODEL_VERSION = 1",
  "const PACKAGE_ALLOCATION_STATUS_VERSION = 1",
  "const USE_FIRST_EVALUATION_VERSION = 1",
  "const FEFO_PACKAGE_POLICY_VERSION = 1",
  "const FEFO_COMPARATOR_VERSION = 1",
  "const FEFO_ALLOCATION_DECISION_VERSION = 1",
  "const PACKAGE_ALLOCATION_GROUP_VERSION = 1",
  "const PACKAGE_SELECTION_OVERRIDE_VERSION = 1",
  "const COMPOSITE_LOT_VERSION = 1",
  "const LOT_SPLIT_VERSION = 1",
  "const PACKAGE_PHYSICAL_STATES = Object.freeze",
  "PARTIALLY_USED: \"partially-used\"",
  "DONATED_OR_SHARED: \"donated-or-shared\"",
  "const PACKAGE_ALLOCATION_STATUSES = Object.freeze",
  "RESERVED_ELSEWHERE: \"reserved-elsewhere\"",
  "QUANTITY_REVIEW_REQUIRED: \"quantity-review-required\"",
  "DATE_REVIEW_REQUIRED: \"date-review-required\"",
  "SAFETY_REVIEW_REQUIRED: \"safety-review-required\""
].forEach((snippet) => includes(app, snippet, `Missing Step 49 model snippet: ${snippet}`));

[
  "function getPackageLabel",
  "function getPackagePhysicalState",
  "function getPackageGroupKey",
  "function getPackageDateDisplay",
  "function buildEffectiveUseFirstEvaluation",
  "function evaluatePackageForFefoDemand",
  "function compareFefoPackageEvaluations",
  "function createFefoAllocationDecision",
  "function getPantryPackageGroups",
  "function createPackageSelectionOverride",
  "function createCompositeLotDraft",
  "function createLotSplitDraft",
  "function renderPackageGroupReadModel",
  "function renderRecipeFefoPackageAllocationSummary"
].forEach((snippet) => includes(app, snippet, `Missing Step 49 function: ${snippet}`));

[
  "if (!date) return dateIntelligence?.requiresDateConfirmation ? \"Date type needs confirmation\"",
  "Best before ${date}",
  "Recorded expiration date ${date}",
  "Use soon — estimated freshness window ${date}",
  "Opened ${date}",
  "dateIntelligence.blocksAutomaticRecommendation",
  "guardrail.hardExclusion",
  "guardrail.canUseForAutomaticPlanning !== false",
  "fefoRank: null",
  "allocatable: false",
  "targetMealDate <= latestDate",
  "quantity.status === PANTRY_QUANTITY_STATUSES.UNKNOWN",
  "evaluation.dateType === FOOD_DATE_TYPES.UNKNOWN",
  "deriveReservedQuantity(normalized)",
  "compareFefoPackageEvaluations",
  "Math.min(Number(item.availableQuantity || 0), remaining)",
  "plannedRemainingQuantity",
  "missingQuantity",
  "Preview only. Pantry quantities remain unchanged until cooking is confirmed."
].forEach((snippet) => includes(app, snippet, `Missing FEFO safety/allocation behavior: ${snippet}`));

const decisionBlock = app.match(/function createFefoAllocationDecision[\s\S]*?\n  function getPantryPackageGroups/);
assert(decisionBlock, "Could not locate FEFO allocation decision block.");
includes(decisionBlock[0], "packageAllocationGroupVersion: PACKAGE_ALLOCATION_GROUP_VERSION", "Missing package allocation group.");
includes(decisionBlock[0], "allocations: packageOrder.map", "Missing split allocation list.");
includes(decisionBlock[0], "totalAllocatedQuantity", "Missing total allocation.");
includes(decisionBlock[0], "missingQuantity", "Missing missing quantity.");
assert(!/currentQuantity\s*=\s*currentQuantity\s*-|quantityDetails\.currentQuantity\s*-=\s*|savePantryToStorage\(/.test(decisionBlock[0]), "FEFO preview must not deduct or save Pantry.");

[
  "separate packages",
  "Total physical quantity",
  "Total currently eligible quantity",
  "Total reserved quantity",
  "Total freely available quantity",
  "— Use first",
  "Why this package first",
  "aria-label=\"Pantry package groups\"",
  "Plan a meal using",
  "Review why",
  "ALLOCATION",
  "Recipe requirement:",
  "Planned Pantry use:",
  "New ${escapeHtml(name.toLowerCase())} purchase:"
].forEach((snippet) => includes(app, snippet, `Missing package display or recipe preview text: ${snippet}`));

[
  ".package-group-summary-list",
  ".package-group-summary",
  ".package-group-totals",
  ".package-card-list",
  ".package-summary-card",
  ".recipe-package-allocation-summary",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((snippet) => includes(css, snippet, `Missing Step 49 CSS: ${snippet}`));

[
  "# Chef Nova Multiple-Package FEFO Handling",
  "## 1. Purpose",
  "## 7. FEFO Definition",
  "## 8. Safety Before FEFO",
  "## 9. Date-Type Precision",
  "## 12. FEFO Comparator",
  "## 15. Package Allocation",
  "## 16. Preview Versus Physical Use",
  "## 17. Reservations",
  "## 18. Unknown Package Quantities",
  "## 21. Pantry Display",
  "## 36. Impact Ledger",
  "## 45. Deferred Work"
].forEach((snippet) => includes(docs, snippet, `Missing Step 49 documentation: ${snippet}`));

[
  "Second Pantry systems created: 0",
  "Same-name packages merged automatically: 0",
  "Packages with different dates merged: 0",
  "Packages with different opening states merged: 0",
  "Raw `expiryDate` used as the sole FEFO source: 0",
  "Best-before dates represented as expiration dates: 0",
  "Hard-excluded earlier packages allocated by FEFO: 0",
  "Full recipe demand allocated to every package: 0",
  "Preview allocations deducting Pantry: 0",
  "Unknown package quantities converted to zero: 0",
  "Unknown package dates given invented FEFO order: 0",
  "One package price applied to all packages: 0",
  "Planned package allocation creating Impact Ledger credit: 0",
  "Legacy aggregate records split into invented packages: 0",
  "Cross-user packages, FEFO order, or reservations exposed: 0",
  "Guest package data persisted into registered-user storage automatically: 0",
  "Step 49, Step 48, Step 47, Step 46, syntax checks, and JSON parsing passed.",
  "known pre-existing `dateInformation` failure"
].forEach((snippet) => includes(report, snippet, `Missing Step 49 report evidence: ${snippet}`));

assert(!/Math\.random|crypto\.randomUUID\(\)|drag.*package|drop.*package/i.test(decisionBlock[0]), "Step 49 FEFO allocation must not use randomness or drag-and-drop.");
assert(!/all yogurt expires|expires August 12/i.test(app), "Step 49 must not relabel best-before packages as expiration.");

console.log("Cook Before It Spoils Step 49 multiple-package FEFO static checks passed.");
