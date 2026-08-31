const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-track-thawing.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-25-report.md"), "utf8");

[
  "THAW_RECORDING_CONTEXT_VERSION",
  "THAW_RECORDING_DRAFT_VERSION",
  "THAW_GUIDANCE_RESOLUTION_VERSION",
  "THAW_RECORDING_SOURCES",
  "THAW_RECORDING_WORKFLOW_STATUSES",
  "THAW_METHODS",
  "THAW_EXTENTS",
  "POST_THAW_HANDLING",
  "THAW_METHOD_APPROVAL_STATUSES",
  "REFREEZING_REVIEW_STATUSES",
  "function resolveThawGuidance",
  "function buildThawRecordingDraft",
  "function renderThawRecordingModal",
  "function readThawRecordingForm",
  "function validateThawRecordingDraft",
  "function thawLeftoverBatch",
  "function confirmThawRecording",
  "function renderThawedInventoryDetails"
].forEach((needle) => assert(app.includes(needle), `${needle} is missing`));

[
  "refrigerator",
  "microwave",
  "cold-water",
  "cooked-from-frozen",
  "other",
  "unknown",
  "fully-thawed",
  "partially-thawed-ice-crystals",
  "partially-thawed-unknown-ice-state",
  "stored-in-refrigerator",
  "cooking-immediately",
  "used-immediately",
  "storage-review-required",
  "factual-unapproved-method",
  "not-recommended-default"
].forEach((needle) => assert(app.includes(needle), `controlled value missing: ${needle}`));

const openThawMatch = app.match(/function openThawRecordingWorkflow\(itemId\) \{[\s\S]*?\n  \}/);
assert(openThawMatch, "openThawRecordingWorkflow is missing");
assert(!openThawMatch[0].includes("executePantryCommand"), "opening Mark Thawed must not mutate inventory");
assert(!openThawMatch[0].includes("thawLeftoverBatch("), "opening Mark Thawed must not commit thawing");

assert(app.includes("Reserved quantity"), "reserved quantity must be displayed");
assert(app.includes("Available quantity"), "available quantity must be displayed");
assert(app.includes("How was it thawed?"), "method fieldset is required");
assert(app.includes("Was the food fully thawed?"), "thaw extent fieldset is required");
assert(app.includes("Storage after thawing"), "post-thaw handling fieldset is required");
assert(app.includes("Chef Nova does not automatically recommend refreezing thawed food"), "default no-refreezing message is required");
assert(app.includes("values.amount > draft.quantity.availableQuantity"), "thawed quantity must be capped by available frozen quantity");
assert(app.includes("Whole-count foods need a whole number amount."), "whole-count validation is required");
assert(app.includes("The thawed time occurs before the recorded frozen time."), "frozen timeline validation is required");
assert(app.includes("The thawed time occurs before the recorded cooked time."), "original cooked timeline validation is required");
assert(app.includes("The thaw time cannot be in the future."), "future thaw time must be rejected");

const thawCommandMatch = app.match(/function thawLeftoverBatch\(leftoverBatchId, options = \{\}\) \{[\s\S]*?function confirmThawRecording/);
assert(thawCommandMatch, "thawLeftoverBatch block is missing");
const thawCommand = thawCommandMatch[0];
assert(thawCommand.includes("LEFTOVER_BATCH_SPLIT"), "partial thaw must split the frozen source");
assert(thawCommand.includes("PANTRY_PRESERVATION_STATES.THAWED"), "thawed preservation state is required");
assert(thawCommand.includes("PANTRY_LIFECYCLE_STATUSES.AVAILABLE"), "thawed item must remain lifecycle available");
assert(thawCommand.includes("frozenAtPreserved"), "frozenAt must be preserved in event payloads");
assert(thawCommand.includes("thawMethod"), "thaw method must be stored");
assert(thawCommand.includes("thawExtent"), "thaw extent must be stored");
assert(thawCommand.includes("postThawHandling"), "post-thaw handling must be stored");
assert(thawCommand.includes("methodApprovalStatus"), "method approval status must be stored");
assert(thawCommand.includes("refreezingProactiveSuggestionAllowed: false"), "refreezing must not be proactively suggested");
assert(thawCommand.includes("commandType: FOOD_EVENT_TYPES.MARKED_THAWED"), "partial thaw child must receive a thaw event");
assert(thawCommand.includes("qualityReminderId: null"), "thawed child must not keep freezer-quality reminder");
assert(app.includes("resolveFreezerQualityReminderForItem(leftoverBatchId)"), "full thaw must transition exact freezer reminder");

[
  ".thaw-recording-modal",
  ".thaw-method-fieldset",
  ".thawed-inventory-details",
  ".freezer-refreeze-notice"
].forEach((needle) => assert(css.includes(needle), `${needle} CSS is missing`));

[
  "Thawing is a factual inventory change.",
  "Chef Nova does not automatically recommend refreezing thawed food.",
  "Partial thaw splits the item into a frozen source remainder and thawed child record.",
  "Opening Mark Thawed, editing draft fields, viewing guidance, or cancelling creates no physical event."
].forEach((needle) => assert(doc.includes(needle), `documentation missing: ${needle}`));

[
  "Food marked thawed before final confirmation: 0",
  "Partial-thaw previews splitting inventory: 0",
  "Unknown quantities converted to zero: 0",
  "Automatic refreezing suggestions displayed: 0",
  "Quality reminders converted into post-thaw safety deadlines: 0",
  "Guest thaw records persisted into registered-user storage automatically: 0"
].forEach((needle) => assert(report.includes(needle), `report missing: ${needle}`));

console.log("Step 25 Track Thawing static checks passed.");
