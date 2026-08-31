const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `${name} should exist.`);
  const next = app.indexOf("\n  function ", start + 1);
  return app.slice(start, next < 0 ? app.length : next);
}

assert(app.includes("const LEFTOVER_OUTCOME_CONTEXT_VERSION = 1"), "Outcome context should be versioned.");
assert(app.includes("const LEFTOVER_OUTCOME_REVIEW_VERSION = 1"), "Outcome review should be versioned.");
assert(app.includes("const LEFTOVER_OUTCOME_STATE_MACHINE_VERSION = 1"), "Outcome state machine should be versioned.");
assert(app.includes("const LEFTOVER_USE_TYPES = Object.freeze"), "Outcome use types should be centralized.");
assert(app.includes("const LEFTOVER_OUTCOME_SCOPES = Object.freeze"), "Outcome scopes should be centralized.");
assert(app.includes("const LEFTOVER_OUTCOME_TYPES = Object.freeze"), "Outcome types should be centralized.");
assert(app.includes("currentLeftoverOutcomeReview"), "State should track the active leftover outcome review.");

const mealCompletion = extractFunction("confirmAndApplyPantryForCompletedMeal");
assert(mealCompletion.includes("openMealLeftoverOutcomeReview"), "Transformation meal completion should open outcome review first.");
assert(mealCompletion.includes('"awaiting-leftover-outcome"'), "Meal completion should pause until the outcome is confirmed.");
assert(!mealCompletion.includes("applyTransformationSourceForCompletedMeal(date, mealKey, meal);"), "Meal completion should not auto-deduct transformation source leftovers.");

const directOutcome = extractFunction("openDirectLeftoverOutcomeReview");
assert(directOutcome.includes("deriveAvailableQuantity"), "Direct consumption should use available unreserved quantity.");
assert(directOutcome.includes("USER_SELECTED_QUANTITY"), "Direct consumption should protect other reservations when present.");

const reviewBuilder = extractFunction("buildLeftoverOutcomeReview");
assert(reviewBuilder.includes("plannedReservationQuantity"), "Outcome context should preserve planned reservation quantity.");
assert(reviewBuilder.includes("otherReservedQuantity"), "Outcome context should expose other active reservations.");
assert(reviewBuilder.includes("preOutcome") || reviewBuilder.includes("beforeOutcome"), "Outcome review should preserve before-outcome snapshot.");

const modal = extractFunction("openLeftoverOutcomeReview");
assert(modal.includes("<fieldset") && modal.includes("<legend>"), "Outcome choices should use accessible fieldsets and legends.");
assert(modal.includes("No outcome is selected") === false, "Modal should not rely on a checked default.");
assert(modal.includes("All ${escapeHtml(plannedLine)}"), "All Used label should include the planned scope.");
assert(modal.includes("Batch before this meal"), "Full batch quantity should be visibly labelled.");
assert(modal.includes("Reserved for later meals"), "Other reservations should be visibly labelled.");
assert(modal.includes("data-mixed-outcome"), "Mixed outcome editor should be present.");

const plan = extractFunction("deriveLeftoverOutcomeCommitPlan");
assert(plan.includes("before - planned"), "All Used should subtract only the planned amount.");
assert(plan.includes("remainingCanonicalQuantity"), "Some Used should derive from remaining amount.");
assert(plan.includes("Mixed outcomes must total"), "Mixed outcomes should require conservation.");
assert(plan.includes("quantityStatus = PANTRY_QUANTITY_STATUSES.UNKNOWN"), "Unknown amount should remain unknown.");
assert(!plan.includes("quantityAfter = 0;"), "Unknown quantities should not be converted to zero.");
assert(plan.includes("FOOD_EVENT_TYPES.LEFTOVER_QUANTITY_TRANSFORMED"), "Transformation outcomes should select transformed event type.");
assert(plan.includes("FOOD_EVENT_TYPES.LEFTOVER_QUANTITY_CONSUMED"), "Direct outcomes should select consumed event type.");

const commit = extractFunction("commitLeftoverOutcome");
assert(commit.includes("commitPantrySnapshotAndFoodEvents"), "Outcome should use the shared Pantry and Food Event History commit path.");
assert(commit.includes("FOOD_EVENT_TYPES.DISCARDED"), "Discard should use discard event type.");
assert(commit.includes("FOOD_EVENT_TYPES.DONATED_SHARED"), "Sharing should use shared event type.");
assert(commit.includes("FOOD_EVENT_TYPES.MARKED_FROZEN"), "Freezing should use factual freeze event type.");
assert(commit.includes("original cooked time") || commit.includes("original cooked"), "Outcome should preserve the original timeline.");
assert(commit.includes("idempotencyKey"), "Outcome commits should use idempotency keys.");
assert(commit.includes("currentUserScope"), "Outcome commits should check user scope.");
assert(commit.includes("PANTRY_RESERVATION_STATUSES.RELEASED"), "Partial use should release unused reservation quantity.");
assert(commit.includes("reconcileDownstreamTransformationSteps"), "Downstream transformation paths should recalculate.");

assert(css.includes(".leftover-outcome-modal"), "Outcome modal styles should exist.");
assert(css.includes(".mixed-outcome-grid"), "Mixed outcome responsive styles should exist.");
assert(css.includes("@media (forced-colors: active)") && css.includes(".leftover-outcome"), "Forced-color support should include outcome UI.");
assert(fs.existsSync(path.join(root, "docs", "cook-before-it-spoils-leftover-outcomes.md")), "Step 20 documentation should exist.");
assert(fs.existsSync(path.join(root, "docs", "cook-before-it-spoils-step-20-report.md")), "Step 20 report should exist.");

console.log("Cook Before It Spoils Step 20 leftover outcome static checks passed.");
