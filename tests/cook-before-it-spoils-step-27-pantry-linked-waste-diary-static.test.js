const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-pantry-linked-waste-diary.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-27-report.md"), "utf8");

[
  "PANTRY_LINKED_DISCARD_CONTEXT_VERSION",
  "DISCARD_INVENTORY_SNAPSHOT_VERSION",
  "DISCARD_QUICK_SUGGESTION_MODEL_VERSION",
  "DISCARDED_WEIGHT_ESTIMATE_VERSION",
  "DISCARDED_VALUE_ESTIMATE_VERSION",
  "WASTE_DASHBOARD_PROJECTION_VERSION",
  "WASTE_PATTERN_CHECK_VERSION",
  "WASTE_PATTERN_CONFIG",
  "WASTE_PATTERN_CHECK_STATUSES",
  "WASTE_PATTERN_TYPES",
  "WASTE_PATTERN_CONFIDENCE",
  "function buildPantryLinkedDiscardContext",
  "function buildDiscardInventorySnapshot",
  "function buildDiscardQuickSuggestionModel",
  "function buildDiscardedWeightEstimate",
  "function calculateDiscardedValueCents",
  "function buildWasteDashboardProjection",
  "function checkWastePatterns",
  "function dismissWastePattern"
].forEach((needle) => assert(app.includes(needle), `${needle} is missing`));

const quickModelMatch = app.match(/function buildDiscardQuickSuggestionModel\(draft\) \{[\s\S]*?\n  \}/);
assert(quickModelMatch, "quick suggestion model missing");
const quickModel = quickModelMatch[0];
assert(quickModel.includes("snapshot?.unreservedQuantity ?? snapshot?.availableQuantity"), "quick suggestions must use unreserved/current quantity");
assert(!quickModel.includes("originalPackageQuantity"), "quick suggestions must not use original package quantity");
assert(quickModel.includes("DISCARD_AMOUNT_MODES.ABOUT_ONE_QUARTER"), "quarter suggestion missing");
assert(quickModel.includes("DISCARD_AMOUNT_MODES.ABOUT_HALF"), "half suggestion missing");
assert(quickModel.includes("DISCARD_AMOUNT_MODES.ALL"), "all-available suggestion missing");
assert(quickModel.includes("isWholeCountUnit(unit)"), "whole-count handling missing");
assert(quickModel.includes("seen.has(key)"), "suggestion deduplication missing");

const formMatch = app.match(/function renderDiscardRecordingForm\(draft\) \{[\s\S]*?function updateDiscardEstimatePreview/);
assert(formMatch, "discard form renderer missing");
const form = formMatch[0];
assert(form.includes("This food was not recorded in Pantry"), "manual untracked path must remain");
assert(form.includes("Original package:"), "original package display missing");
assert(form.includes("Recorded remaining amount:"), "current amount display missing");
assert(form.includes("Available without changing another plan:"), "unreserved amount display missing");
assert(form.includes("Quick choices use only the unreserved amount"), "reservation protection wording missing");
assert(form.includes("Enter another amount"), "custom amount path missing");
assert(form.includes("Amount unknown"), "unknown amount path missing");

const eventMetadataMatch = app.match(/function buildDiscardEventMetadata\(draft[\s\S]*?function recordDiscardedFood/);
assert(eventMetadataMatch, "discard event metadata block missing");
const metadata = eventMetadataMatch[0];
assert(metadata.includes("pantryLinkedContext"), "event must store exact Pantry link context");
assert(metadata.includes("inventorySnapshot"), "event must store inventory snapshot");
assert(metadata.includes("weightEstimate"), "event must store weight estimate evidence");
assert(metadata.includes("price"), "event must store price/value evidence");

const transactionMatch = app.match(/function recordDiscardedFood\(\{ discardDraft[\s\S]*?function confirmDiscardRecord/);
assert(transactionMatch, "core discard transaction block missing");
const transaction = transactionMatch[0];
assert(transaction.includes("executePantryCommand"), "linked discard must use atomic Pantry command");
assert(transaction.includes("appendFoodEventsToHistory"), "manual discard must append to Food Event History");
assert(transaction.includes("idempotencyIndex"), "discard confirmation must remain idempotent");
assert(transaction.includes("inventoryRevision"), "stale item revision protection missing");
assert(app.includes("This includes reserved food. Review the meal or discard only the unreserved amount."), "reserved quantities must not be silently discarded");

const dashboardMatch = app.match(/function buildWasteDashboardProjection\(days = 30\) \{[\s\S]*?function wastePatternLabelForEntry/);
assert(dashboardMatch, "Waste Dashboard projection missing");
const dashboard = dashboardMatch[0];
assert(dashboard.includes("selectWasteDiaryEntries()"), "dashboard must derive from Waste Diary effective events");
assert(dashboard.includes("unknownWeightEntryCount"), "unknown weight coverage missing");
assert(dashboard.includes("unknownValueEntryCount"), "unknown value coverage missing");
assert(dashboard.includes("coverageRatio"), "dashboard confidence coverage missing");
assert(!dashboard.includes("localStorage.setItem"), "dashboard must not create an independent editable total store");

const patternMatch = app.match(/function checkWastePatterns\(\) \{[\s\S]*?function renderWasteDashboardProjection/);
assert(patternMatch, "pattern checker missing");
const pattern = patternMatch[0];
assert(app.includes("minimums.repeatedFoodEvents"), "repeated-food threshold missing");
assert(app.includes("minimums.repeatedReasonEvents"), "repeated-reason threshold missing");
assert(app.includes("minimumDistinctDates"), "distinct-date threshold missing");
assert(pattern.includes("selectWasteDiaryEntries()"), "patterns must use effective Waste Diary events");
assert(!pattern.includes("note"), "Step 27 pattern checker must not inspect free-text notes");

[
  ".waste-dashboard-panel",
  ".waste-dashboard-grid",
  ".waste-pattern-card",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((needle) => assert(css.includes(needle), `${needle} CSS missing`));

[
  "# Chef Nova Pantry-Linked Waste Diary",
  "Current quantity is the default suggestion basis.",
  "Unsupported conversions remain unavailable.",
  "Possible patterns never change shopping, package sizes, budgets, recipes, reminders, or meal plans automatically."
].forEach((needle) => assert(doc.includes(needle), `documentation missing: ${needle}`));

[
  "Second Pantry systems created: 0",
  "Original package quantity used instead of known current quantity for quick suggestions: 0",
  "Reserved quantities included in quick discard actions without review: 0",
  "Unsupported weight conversions generated: 0",
  "Missing prices treated as zero: 0",
  "Patterns declared from fewer than configured minimum events: 0",
  "Patterns inferred from free-text notes: 0",
  "Pattern detection automatically changing shopping or meal plans: 0"
].forEach((needle) => assert(report.includes(needle), `report missing: ${needle}`));

console.log("Step 27 Pantry-linked Waste Diary static checks passed.");
