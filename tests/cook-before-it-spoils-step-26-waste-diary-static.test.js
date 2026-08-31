const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-respectful-waste-diary.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-26-report.md"), "utf8");

[
  "DISCARD_RECORDING_CONTEXT_VERSION",
  "DISCARD_RECORDING_DRAFT_VERSION",
  "DISCARD_REASON_TAXONOMY_VERSION",
  "DISCARD_AMOUNT_MODE_VERSION",
  "DISCARD_RECORD_SCHEMA_VERSION",
  "DISCARDED_FOOD_TYPES",
  "DISCARD_REASON_CODES",
  "DISCARD_AMOUNT_MODES",
  "DISCARD_ESTIMATE_BASES",
  "QUANTITY_CONFIDENCE_LEVELS",
  "DISCARD_RECORDING_SOURCES",
  "DISCARD_PRICE_SOURCES",
  "DISCARD_TIMESTAMP_PRECISION",
  "QUALITATIVE_DISCARD_ESTIMATE_CONFIG",
  "function openRecordDiscardedFoodWorkflow",
  "function buildDiscardRecordingDraft",
  "function deriveDiscardEstimate",
  "function reviewDiscardRecording",
  "function recordDiscardedFood",
  "function selectWasteDiaryEntries",
  "function renderWasteDiaryView",
  "function openWasteDiaryEntryDetails",
  "function openWasteDiaryCorrection"
].forEach((needle) => assert(app.includes(needle), `${needle} is missing`));

[
  "small-amount",
  "about-one-quarter",
  "about-half",
  "most",
  "all",
  "prefer-not-to-say",
  "reasonSource: \"user-selected\"",
  "qualitative-derived",
  "no-numeric-basis",
  "user-entered-discarded-value"
].forEach((needle) => assert(app.includes(needle), `controlled value missing: ${needle}`));

const openMatch = app.match(/function openRecordDiscardedFoodWorkflow\(context = \{\}\) \{[\s\S]*?\n  \}/);
assert(openMatch, "openRecordDiscardedFoodWorkflow missing");
assert(!openMatch[0].includes("executePantryCommand"), "opening the discard workflow must not mutate Pantry");
assert(!openMatch[0].includes("appendFoodEventsToHistory"), "opening the discard workflow must not append events");

const commandMatch = app.match(/function recordDiscardedFood\(\{ discardDraft[\s\S]*?function confirmDiscardRecord/);
assert(commandMatch, "recordDiscardedFood command block missing");
const command = commandMatch[0];
assert(command.includes("executePantryCommand"), "linked discard must reuse the Pantry command pipeline");
assert(command.includes("appendFoodEventsToHistory"), "manual discard must append to Food Event History");
assert(command.includes("FOOD_EVENT_TYPES.DISCARDED"), "discard command must create discarded events");
assert(command.includes("idempotencyIndex"), "discard confirmation must be idempotent");
assert(command.includes("revision"), "linked discard must check stale inventory revision");
assert(command.includes("PANTRY_LIFECYCLE_STATUSES.DISCARDED"), "full discard must close lifecycle as discarded");
assert(command.includes("PANTRY_QUANTITY_STATUSES.UNKNOWN"), "unknown linked amounts must preserve review-required quantity state");

assert(app.includes("This food was not recorded in Pantry"), "manual untracked entry option is required");
assert(app.includes("Approximate information is okay."), "respectful approximate wording is required");
assert(app.includes("Estimated value unavailable"), "missing price must not become zero");
assert(app.includes("This includes reserved food. Review the meal or discard only the unreserved amount."), "reserved quantities must be protected");
assert(app.includes("Whole-item amounts must be whole numbers."), "whole-item validation is required");
assert(app.includes("Discard time cannot be in the future."), "future discard timestamps must be rejected");
assert(app.includes("selectWasteDiaryEntries().filter"), "dashboard must derive counts from diary projection");
assert(app.includes("data-record-discarded-food"), "global discard entry point missing");
assert(app.includes("data-record-discard-item"), "item-specific discard entry point missing");

[
  ".waste-diary-panel",
  ".discard-recording-modal",
  ".discard-estimate-preview",
  ".waste-diary-card",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((needle) => assert(css.includes(needle), `${needle} CSS missing`));

[
  "The diary is a projection of effective `discarded` Food Event History records.",
  "Exact measurements, prices, reasons, and notes are optional.",
  "Missing price remains unavailable, not zero.",
  "Reasons are stored as user-reported.",
  "Step 20 already appends `discarded` events"
].forEach((needle) => assert(doc.includes(needle), `documentation missing: ${needle}`));

[
  "Second Pantry systems created: 0",
  "Step 20 discards duplicated in Waste Diary: 0",
  "Unknown quantities converted to zero: 0",
  "Missing prices treated as zero: 0",
  "User-reported reasons represented as safety determinations: 0",
  "Guest discard records persisted into registered-user storage automatically: 0"
].forEach((needle) => assert(report.includes(needle), `report missing: ${needle}`));

console.log("Step 26 Waste Diary static checks passed.");
