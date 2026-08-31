const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-record-freezer-information.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-23-report.md"), "utf8");

[
  "FREEZER_RECORDING_CONTEXT_VERSION",
  "FREEZER_RECORDING_DRAFT_VERSION",
  "FREEZER_RECORDING_SOURCES",
  "FREEZER_RECORDING_WORKFLOW_STATUSES",
  "FREEZER_QUANTITY_ENTRY_MODES",
  "FREEZE_TIMESTAMP_PRECISION",
  "FREEZER_QUALITY_REMINDER_OPTIONS",
  "FREEZER_QUALITY_REMINDER_BASES",
  "FREEZER_QUALITY_REMINDER_STATUSES",
  "function buildFreezerRecordingDraft",
  "function openFreezerRecordingWorkflow",
  "function confirmFreezerRecording",
  "function createFreezerQualityReminderRecord",
  "function buildFreezerQualityReminderViewModel",
  "function renderFrozenInventoryDetails",
  "function addLocalCalendarMonths"
].forEach((needle) => assert(app.includes(needle), `${needle} is missing`));

assert(app.includes("data-freezer-record-confirm"), "final confirmation button is required");
assert(app.includes("Record Freezer Information"), "recording workflow heading is required");
assert(app.includes("This is a quality and meal-planning reminder, not an expiration date."), "quality notice wording is required");
assert(app.includes("PANTRY_STORAGE_LOCATIONS.FREEZER"), "freezer storage state must be used");
assert(app.includes("PANTRY_PRESERVATION_STATES.FROZEN"), "preservation frozen state must be used");
assert(app.includes("PANTRY_LIFECYCLE_STATUSES.AVAILABLE"), "frozen available items must keep lifecycle available");
assert(app.includes("containerLabel"), "container label metadata is required");
assert(app.includes("frozenAtPrecision"), "timestamp precision must be stored");
assert(app.includes("sourceReminderId"), "source reminder linkage is required");
assert(app.includes("notification.reminderId === reminderId"), "Freeze Today resolution must target the source reminder");
assert(app.includes("getDate()"), "calendar-month helper must clamp by calendar day");
assert(!app.includes("30 * 24 * 60 * 60 * 1000"), "fixed 30-day month math must not be used");

const openMatch = app.match(/function openFreezerRecordingWorkflow\(context = \{\}\) \{[\s\S]*?\n  \}/);
assert(openMatch, "openFreezerRecordingWorkflow is missing");
assert(!openMatch[0].includes("executePantryCommand"), "opening recording workflow must be non-mutating");
assert(!openMatch[0].includes("freezeLeftoverBatch("), "opening recording workflow must not freeze food");

const confirmMatch = app.match(/function confirmFreezerRecording\(draftId\) \{[\s\S]*?\n  \}/);
assert(confirmMatch, "confirmFreezerRecording is missing");
assert(confirmMatch[0].includes("validateFreezerRecordingDraft"), "final confirmation must validate draft");
assert(confirmMatch[0].includes("freezeLeftoverBatch"), "final confirmation must call existing freeze command");

const freezeMatch = app.match(/function freezeLeftoverBatch\(leftoverBatchId, amount, container = PANTRY_STORAGE_CONTAINERS\.FREEZER_BAG, options = \{\}\) \{[\s\S]*?\n  \}/);
assert(freezeMatch, "extended freezeLeftoverBatch is missing");
assert(freezeMatch[0].includes("LEFTOVER_BATCH_SPLIT"), "partial freezing must reuse split event");
assert(freezeMatch[0].includes("MARKED_FROZEN"), "full freezing must use marked-frozen event");
assert(freezeMatch[0].includes("confirmedFrozenAt"), "confirmed frozen timestamp must drive state");
assert(freezeMatch[0].includes("Original cooked time preserved"), "original timeline preservation wording is required");
assert(!freezeMatch[0].includes("frozenQuantity"), "duplicate editable frozen quantity must not be introduced");

[
  ".freezer-recording-modal",
  ".freezer-recording-summary",
  ".freezer-recording-time-grid",
  ".freezer-recording-fieldset",
  ".freezer-quality-notice",
  ".frozen-inventory-details"
].forEach((needle) => assert(css.includes(needle), `${needle} CSS is missing`));

[
  "Opening Freeze Options or the recorder does not change Pantry state.",
  "Frozen is represented through storage and preservation.",
  "Quality reminders say they are quality and meal-planning reminders",
  "Automatic thawing, refreezing"
].forEach((needle) => assert(doc.includes(needle), `documentation missing: ${needle}`));

[
  "Second freezer inventories created: 0",
  "Food marked frozen before final confirmation: 0",
  "Quality reminders represented as safety deadlines: 0",
  "Reminder intervals calculated using fixed 30-day months: 0"
].forEach((needle) => assert(report.includes(needle), `report missing: ${needle}`));

console.log("Step 23 Record Freezer Information static checks passed.");
