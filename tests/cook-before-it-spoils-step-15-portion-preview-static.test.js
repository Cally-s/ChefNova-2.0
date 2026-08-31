const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

assert(app.includes("const PORTION_PREVIEW_VERSION = 1;"), "Portion preview must be versioned.");
assert(app.includes("const SERVING_ALLOCATION_VERSION = 1;"), "Serving allocation must be versioned.");
assert(app.includes("EXCESS_PREPARED_FOOD_STATUSES"), "Excess prepared food statuses should be explicit.");
assert(app.includes("MINIMUM_BATCH_REASON_CODES"), "Minimum batch reason codes should be explicit.");

[
  "buildCookTonightPortionPreview",
  "renderCookTonightPortionPreview",
  "applyPortionPreviewOption",
  "buildExcessPreparedFoodAssessment",
  "buildPortionPreviewActions"
].forEach((name) => {
  assert(app.includes(`function ${name}`), `${name} should exist.`);
});

assert(app.includes("data-portion-preview-option"), "Portion preview action buttons must be clickable.");
assert(app.includes("applyPortionPreviewOption(portionPreviewOption.dataset.workflowId"), "Click handler should route portion preview actions.");
assert(app.includes("Priority foods projected to be used"), "Preview should use projected-use wording.");
assert(!app.includes("Ingredients rescued"), "Preview must not imply ingredients were already rescued.");

[
  "peopleEating",
  "servingsTonight",
  "plannedRefrigeratedLeftoverServings",
  "plannedFrozenServings",
  "plannedSharedServings",
  "effectiveRecipeYield",
  "unallocatedServings",
  "projectedFoodUseBySource",
  "groceryImpact"
].forEach((field) => {
  assert(app.includes(field), `${field} should be present in the portion preview model.`);
});

const reviewFunction = app.match(/function reviewCookTonightDraft\(workflowId\) \{[\s\S]*?function renderCookTonightReview/)[0];
assert(reviewFunction.includes("requiresDecision"), "Review should stop when unallocated servings need a decision.");
assert(reviewFunction.includes("Choose a plan for extra servings before reviewing tonight's plan."), "Review should tell the user what to do.");

const confirmFunction = app.match(/function commitCookTonightPlanAtomically\(draft\) \{[\s\S]*?function createCookTonightReservations/)[0];
assert(confirmFunction.includes("plannedFrozenServings"), "Confirmation should preserve planned frozen servings.");
assert(confirmFunction.includes("plannedSharedServings"), "Confirmation should preserve planned shared servings.");
assert(confirmFunction.includes("unallocatedServingsAccepted"), "Confirmation should preserve explicit unallocated acceptance.");
assert(confirmFunction.includes("requiresDecision"), "Confirmation should block unplanned extra servings.");

const optionFunction = app.match(/function applyPortionPreviewOption\(workflowId, optionType\) \{[\s\S]*?function buildCookTonightPantryAllocationPreview/)[0];
assert(!optionFunction.includes("createCookTonightReservations"), "Preview options must not reserve Pantry quantities.");
assert(!optionFunction.includes("commitPantrySnapshotAndFoodEvents"), "Preview options must not write food-event history.");
assert(!optionFunction.includes("FOOD_EVENT_TYPES.MARKED_FROZEN"), "Planning to freeze must not mark food frozen before completion.");
assert(!optionFunction.includes("FOOD_EVENT_TYPES.DONATED_SHARED"), "Planning to share must not record sharing before completion.");

const completionFunction = app.match(/function commitCookTonightCompletionAtomically\(workflowId, actual = \{\}\) \{[\s\S]*?function openCookTonightCancelReservation/)[0];
assert(completionFunction.includes("FOOD_EVENT_TYPES.MARKED_FROZEN"), "Freezing can be recorded after completion confirmation.");
assert(completionFunction.includes("FOOD_EVENT_TYPES.DONATED_SHARED"), "Sharing can be recorded after completion confirmation.");
assert(completionFunction.includes("plannedServingAllocation"), "Actual outcome should keep the planned allocation for audit.");

[
  ".portion-preview",
  ".portion-preview-metrics",
  ".minimum-batch-notice",
  ".portion-preview-options",
  ".portion-preview-details"
].forEach((selector) => {
  assert(css.includes(selector), `${selector} should be styled.`);
});

assert(fs.existsSync(path.join(root, "docs/cook-before-it-spoils-prevent-excessive-cooking.md")), "Step 15 design doc should exist.");
assert(fs.existsSync(path.join(root, "docs/cook-before-it-spoils-step-15-report.md")), "Step 15 report should exist.");

console.log("Cook Before It Spoils Step 15 portion preview static checks passed.");
