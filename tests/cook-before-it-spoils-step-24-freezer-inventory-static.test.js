const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-freezer-inventory.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-24-report.md"), "utf8");

[
  "FREEZER_INVENTORY_VIEW_MODEL_VERSION",
  "FREEZER_CLASSIFICATION_VERSION",
  "FREEZER_FILTER_STATE_VERSION",
  "FREEZER_ITEM_CATEGORIES",
  "FREEZER_CATEGORY_FILTERS",
  "FREEZER_STATUS_FILTERS",
  "FREEZER_SORT_OPTIONS",
  "FROZEN_DATE_STATUSES",
  "function isFrozenInventoryMember",
  "function classifyFreezerItem",
  "function buildFreezerItemViewModel",
  "function getFreezerInventoryModel",
  "function renderFreezerInventoryView",
  "function renderFreezerInventoryCard",
  "function openThawRecordingWorkflow",
  "function confirmThawRecording"
].forEach((needle) => assert(app.includes(needle), `${needle} is missing`));

assert(app.includes("storage?.location === PANTRY_STORAGE_LOCATIONS.FREEZER"), "membership must require freezer storage");
assert(app.includes("preservation?.state === PANTRY_PRESERVATION_STATES.FROZEN"), "membership must require frozen preservation");
assert(app.includes("PANTRY_LIFECYCLE_STATUSES.DISCARDED"), "terminal lifecycle records must be excluded");
assert(app.includes("data-freezer-category-filter"), "freezer category filter controls are required");
assert(app.includes("data-freezer-status-filter"), "freezer status filter controls are required");
assert(app.includes("data-freezer-sort"), "freezer sort controls are required");
assert(app.includes("Oldest Frozen First"), "Oldest First must be implemented as a sort option");
assert(app.includes("Quality Reminder Due"), "quality reminder due filter is required");
assert(app.includes("Date Unknown"), "date unknown filter is required");
assert(app.includes("data-freezer-search"), "freezer search control is required");
assert(app.includes("data-freezer-plan"), "Plan a Meal action is required");
assert(app.includes("data-freezer-find-recipes"), "Find Recipes action is required");
assert(app.includes("data-freezer-calendar"), "Add to Calendar action is required");
assert(app.includes("data-freezer-thaw"), "Mark Thawed action is required");
assert(app.includes("data-freezer-details"), "View Details action is required");
assert(app.includes("data-freezer-edit-reminder"), "Edit Quality Reminder action is required");
assert(app.includes("data-freezer-timeline"), "View Original Timeline action is required");
assert(app.includes("data-freezer-review"), "Review Freezer Conditions action is required");

[
  "freezerInventoryFilters",
  "currentThawRecordingDraft"
].forEach((needle) => assert(app.includes(needle), `${needle} state is missing`));

[
  "freezerInventoryItems",
  "frozenFoodDatabase",
  "freezerPantry",
  "freezerLeftovers",
  "frozenMealStore"
].forEach((needle) => assert(!app.includes(needle), `${needle} must not be introduced`));

const openThawMatch = app.match(/function openThawRecordingWorkflow\(itemId\) \{[\s\S]*?\n  \}/);
assert(openThawMatch, "openThawRecordingWorkflow is missing");
assert(!openThawMatch[0].includes("executePantryCommand"), "opening Mark Thawed must be non-mutating");
assert(!openThawMatch[0].includes("thawLeftoverBatch("), "opening Mark Thawed must not thaw immediately");

const confirmThawMatch = app.match(/function confirmThawRecording\(draftId\) \{[\s\S]*?\n  \}/);
assert(confirmThawMatch, "confirmThawRecording is missing");
assert(confirmThawMatch[0].includes("validateThawRecordingDraft"), "final thaw confirmation must validate the draft");
assert(confirmThawMatch[0].includes("thawLeftoverBatch"), "final thaw confirmation must commit through the shared thaw command");

const thawCommandMatch = app.match(/function thawLeftoverBatch\(leftoverBatchId, options = \{\}\) \{[\s\S]*?\n  \}/);
assert(thawCommandMatch, "shared thaw command is missing");
assert(thawCommandMatch[0].includes("LEFTOVER_BATCH_SPLIT"), "partial thaw must split the batch");
assert(thawCommandMatch[0].includes("frozenAtPreserved"), "thawing must preserve frozenAt history");
assert(app.includes("resolveFreezerQualityReminderForItem(leftoverBatchId)") && app.includes("FREEZER_QUALITY_REMINDER_STATUSES.RESOLVED_THAWED"), "full thaw must resolve active quality reminders");

[
  ".freezer-inventory-panel",
  ".freezer-inventory-tools",
  ".freezer-inventory-grid",
  ".freezer-inventory-card",
  ".freezer-reminder-strip",
  ".freezer-guidance-strip",
  ".freezer-safety-strip",
  ".thaw-recording-modal"
].forEach((needle) => assert(css.includes(needle), `${needle} CSS is missing`));

[
  "Freezer Inventory is a selector and presentation layer over the existing Pantry.",
  "Quality Reminder Due is not a safety deadline.",
  "Mark Thawed opens a confirmation workflow before state changes.",
  "No separate freezer inventory store was created."
].forEach((needle) => assert(doc.includes(needle) || report.includes(needle), `documentation/report missing: ${needle}`));

console.log("Step 24 Freezer Inventory static checks passed.");
