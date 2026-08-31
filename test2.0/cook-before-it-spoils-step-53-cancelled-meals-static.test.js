const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-handle-cancelled-meals.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-53-report.md"), "utf8");

function includesAll(source, terms, label) {
  terms.forEach((term) => assert(source.includes(term), `${label} should include ${term}`));
}

includesAll(app, [
  "MEAL_CANCELLATION_VERSION",
  "RESERVATION_RELEASE_VERSION",
  "MEAL_STATUSES",
  "MEAL_CANCELLATION_REASONS",
  "RESERVATION_RELEASE_REASONS",
  "MEAL_CANCELLATION_RESULTS",
  "DEPENDENT_MEAL_STATUSES"
], "controlled cancellation models");

includesAll(app, [
  "meal-cancelled",
  "cancelled-and-released",
  "cancelled-no-active-reservations",
  "outcome-review-required",
  "dependent-meals-need-repair",
  "already-cancelled",
  "conflict-review-required"
], "controlled values");

includesAll(app, [
  "createReservationReleaseRecord",
  "commitMealCancellation",
  "openCalendarMealCancellationDialog",
  "renderMealCancellationResult",
  "handlePostCancellationAction",
  "markDependentLeftoverMealsForSourceCancellation",
  "buildReservationReleaseSummary"
], "Step 53 functions");

const releaseBlock = app.slice(app.indexOf("function releaseMealReservations"), app.indexOf("function reconcileMealReservations"));
includesAll(releaseBlock, [
  "RESERVATION_RELEASE_REASONS.MEAL_CANCELLED",
  "RESERVATION_RELEASE_VERSION",
  "affectsOnHandQuantity: false",
  "affectsReservedQuantity: true",
  "Physical Pantry quantity was not changed",
  "available for planning again",
  "releaseRecords",
  "PANTRY_RESERVATION_STATUSES.RELEASED"
], "reservation release behavior");
assert(!releaseBlock.includes("currentQuantity +"), "release must not increase physical Pantry quantity.");
assert(!releaseBlock.includes("quantityAfter"), "release must not write a physical quantity-after event.");

const commitBlock = app.slice(app.indexOf("function commitMealCancellation"), app.indexOf("function buildMealCancellationAnnouncement"));
includesAll(commitBlock, [
  "previousCalendar",
  "previousPantry",
  "releaseMealReservations",
  "commitPantrySnapshotAndFoodEvents",
  "state.mealPlans.calendar[date][mealType]",
  "status: MEAL_STATUSES.CANCELLED",
  "state.mealPlans.cancellations",
  "syncWeeklyFromCalendarDate",
  "displayShoppingList",
  "displayPantry",
  "MEAL_CANCELLATION_RESULTS.OUTCOME_REVIEW_REQUIRED",
  "MEAL_CANCELLATION_RESULTS.ALREADY_CANCELLED"
], "atomic cancellation behavior");
assert(commitBlock.indexOf("releaseMealReservations") > commitBlock.indexOf("previousMealStatus"), "release must occur after meal status validation.");
assert(commitBlock.includes("state.mealPlans.calendar = previousCalendar"), "failure must preserve previous calendar.");
assert(commitBlock.includes("state.pantry = previousPantry"), "failure must preserve previous Pantry.");

const dialogBlock = app.slice(app.indexOf("function openCalendarMealCancellationDialog"), app.indexOf("function getPostCancellationActionsForRow"));
includesAll(dialogBlock, [
  "Physical Pantry quantities will not change",
  "Cancel Meal and Release Reservations",
  "Keep Meal",
  "data-meal-cancel-confirm",
  "data-cancel-generated-plan",
  "This meal currently reserves",
  "Dependent leftover meals"
], "confirmation dialog");
assert(!dialogBlock.includes("releaseMealReservations"), "opening the dialog must not release reservations.");

const resultBlock = app.slice(app.indexOf("function renderMealCancellationResult"), app.indexOf("function confirmCalendarMealCancellation"));
includesAll(resultBlock, [
  "MEAL CANCELLED",
  "RESERVATION RELEASED",
  "Current physical Pantry quantity",
  "Current reserved quantity",
  "Current available quantity",
  "Chef Nova did not invent a numeric quantity",
  "is available for planning again",
  "Physical Pantry quantities were not changed"
], "result panel");
assert(!resultBlock.includes("added back to the Pantry"), "result must not say food was added back.");

includesAll(app, [
  "Find Another Recipe",
  "Review Freezing Options",
  "Keep in Pantry",
  "data-post-cancel-action",
  "searchRecipes({ requireIngredients: false, notify: false })",
  "openFreezerRecordingWorkflow",
  "openRecordDiscardedFoodWorkflow",
  "getFoodSafetyGuardrailForPantryItem",
  "resolveFreezerGuidance"
], "post-cancellation actions");

includesAll(app, [
  "reservationReleaseRecords",
  "reservationReleaseSummary",
  "cancellationRecord",
  "dependentMealSummary",
  "sourceMealCancellationId"
], "normalization preservation");

includesAll(css, [
  "Cook Before It Spoils - Cancelled Meal Handling",
  ".meal-cancellation-dialog",
  ".meal-cancellation-result",
  ".reservation-release-card",
  "min-height: 44px",
  "forced-colors",
  "prefers-reduced-motion",
  "@media print"
], "CSS");

includesAll(doc, [
  "# Chef Nova Cancelled Meal Handling",
  "## 3. Cancellation Commit",
  "## 4. Immediate Reservation Release",
  "## 11. Physical Versus Reserved Quantity",
  "## 14. Multiple Packages",
  "## 16. Unknown Quantities",
  "## 18. Batch-Cooked and Dependent Meals",
  "## 31. Food Event History",
  "## 32. Impact Ledger",
  "## 43. Deferred Work"
], "documentation");

includesAll(report, [
  "Second Meal Calendar systems created: 0",
  "Second reservation systems created: 0",
  "Reservations released before cancellation confirmation: 0",
  "Physical Pantry quantities increased during reservation release: 0",
  "Reservations belonging to other meals released: 0",
  "Reservation history deleted: 0",
  "Unknown whole-item reservations converted to numeric quantities: 0",
  "Released food creating rescue impact: 0",
  "Cancellation creating physical Food Event History outcomes: 0",
  "Recommended starting point for Step 54"
], "report");

console.log("Cook Before It Spoils Step 53 cancelled-meal static checks passed.");
