const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert.notStrictEqual(start, -1, `${name} should exist`);
  const next = app.indexOf(`\n  function `, start + 1);
  return app.slice(start, next === -1 ? app.length : next);
}

const openWorkflow = extractFunction("openFoodRescueCookTonight");
const draftBuilder = extractFunction("createCookTonightDraft");
const reviewDraft = extractFunction("reviewCookTonightDraft");
const commitPlan = extractFunction("commitCookTonightPlanAtomically");
const createReservations = extractFunction("createCookTonightReservations");
const createMealEntry = extractFunction("createCookTonightMealEntry");
const startCooking = extractFunction("startCookTonightMeal");
const outcomeReview = extractFunction("openCookTonightOutcomeReview");
const completionCommit = extractFunction("commitCookTonightCompletionAtomically");
const cancelReservations = extractFunction("confirmCookTonightCancelReservation");
const metadataNormalizer = extractFunction("applyMealEntryPlanningMetadata");

assert(app.includes("const COOK_TONIGHT_WORKFLOW_VERSION = 1;"), "Workflow version should be declared.");
assert(app.includes("const COOK_TONIGHT_WORKFLOW_STATUSES = Object.freeze"), "Workflow statuses should be centralized.");
assert(app.includes("DRAFT: \"draft\"") && app.includes("COMPLETION_REVIEW: \"completion-review\""), "Required statuses should exist.");
assert(app.includes("const COOK_TONIGHT_OUTCOMES = Object.freeze"), "Completion outcomes should be centralized.");

assert(openWorkflow.includes("createCookTonightDraft") && openWorkflow.includes("renderCookTonightDraftStep"), "Cook This Tonight should open a draft workflow.");
assert(!openWorkflow.includes("saveMealPlan()") && !openWorkflow.includes("commitPantrySnapshotAndFoodEvents"), "Opening Cook This Tonight must not mutate plan or Pantry.");

assert(draftBuilder.includes("recalculateFoodRescueRankingForServings"), "Draft builder should revalidate ranking for selected yield.");
assert(draftBuilder.includes("pantryAllocationPreview") && draftBuilder.includes("missingPurchaseGroups"), "Draft should include Pantry and Shopping previews.");
assert(draftBuilder.includes("userScope"), "Draft should track user or guest scope.");

assert(reviewDraft.includes("createCookTonightDraft") && reviewDraft.includes("availableQuantity") && reviewDraft.includes("Change servings or choose another recipe"), "Review should recalculate and block insufficient priority food.");

assert(createReservations.includes("FOOD_EVENT_TYPES.RESERVED_FOR_RECIPE"), "Plan confirmation should append reservation events.");
assert(createReservations.includes("affectsOnHandQuantity: false"), "Reservation events must not deduct on-hand Pantry.");
assert(createReservations.includes("deriveReservedQuantity"), "Reservations should consider existing active reservations.");

assert(commitPlan.includes("createCookTonightReservations"), "Plan commit should create reservations through one helper.");
assert(commitPlan.includes("state.mealPlans.calendar") && commitPlan.includes("syncWeeklyFromCalendarDate") && commitPlan.includes("saveMealPlan()"), "Plan commit should reuse existing calendar and save path.");
assert(commitPlan.includes("ensureBudgetPurchaseGroupsInShoppingList"), "Plan commit should refresh existing Shopping List demand.");
assert(commitPlan.includes("releaseCookTonightReservations"), "Failed calendar commit should release reservations.");

assert(startCooking.includes("COOK_TONIGHT_WORKFLOW_STATUSES.COOKING"), "Start Cooking should set cooking status.");
assert(startCooking.includes("Pantry quantities remain reserved and have not been deducted"), "Start Cooking copy should protect Pantry accuracy.");
assert(!startCooking.includes("QUANTITY_USED") && !startCooking.includes("commitPantrySnapshotAndFoodEvents"), "Start Cooking must not deduct Pantry.");

assert(outcomeReview.includes("Yes, as planned") && outcomeReview.includes("Yes, but I changed the quantities") && outcomeReview.includes("Not yet") && outcomeReview.includes("I chose something else"), "Completion review should show all four required outcomes.");
assert(outcomeReview.includes("<fieldset") && outcomeReview.includes("<legend>Choose what happened</legend>"), "Outcome choices should be semantic.");
assert(!outcomeReview.includes("checked"), "No completion outcome should be selected by default.");

assert(completionCommit.includes("FOOD_EVENT_TYPES.QUANTITY_USED"), "Completion should append Quantity Used events.");
assert(completionCommit.includes("FOOD_EVENT_TYPES.RESERVATION_CONSUMED") && completionCommit.includes("FOOD_EVENT_TYPES.RESERVATION_CANCELLED"), "Completion should consume or release reservations.");
assert(completionCommit.includes("FOOD_EVENT_TYPES.ADDED_TO_LEFTOVER_BATCH"), "Actual saved leftovers should append leftover-batch events.");
assert(createMealEntry.includes("plannedOutcome") && completionCommit.includes("actualOutcome"), "Meal entries should preserve planned and actual data.");
assert(completionCommit.includes("history.idempotencyIndex") && completionCommit.includes("meal-completion:"), "Completion should be idempotent.");
assert(!completionCommit.includes("FOOD_EVENT_TYPES.CONSUMED"), "Completion should not double-record ingredient consumption as Consumed.");

assert(cancelReservations.includes("commitMealCancellation"), "Cancel Reservation should use the shared atomic meal-cancellation command.");
assert(cancelReservations.includes("renderMealCancellationResult"), "Cancellation should show the shared reservation-release result.");

["cookTonightWorkflowId", "pantryReservationIds", "plannedOutcome", "actualOutcome", "foodRescuePlan", "shoppingDemandReferences"].forEach((key) => {
  assert(metadataNormalizer.includes(key), `Meal normalization should preserve ${key}.`);
});

[
  "data-cook-tonight-review",
  "data-cook-tonight-confirm",
  "data-cook-tonight-start",
  "data-cook-tonight-finish",
  "data-cook-tonight-complete",
  "data-cook-tonight-changed-complete",
  "data-cook-tonight-cancel-reservation"
].forEach((attribute) => {
  assert(app.includes(attribute), `${attribute} should be wired.`);
});

[
  ".cook-tonight-workflow",
  ".cook-tonight-steps",
  ".cook-tonight-card",
  ".cook-tonight-allocation-list",
  ".cook-tonight-summary-list",
  ".cook-tonight-radio-group",
  "@media (forced-colors: active)",
  "@media print"
].forEach((selector) => {
  assert(css.includes(selector), `CSS should include ${selector}.`);
});

[
  "docs/cook-before-it-spoils-cook-this-tonight.md",
  "docs/cook-before-it-spoils-step-12-report.md"
].forEach((docPath) => {
  assert(fs.existsSync(path.join(root, docPath)), `${docPath} should exist.`);
});

console.log("Cook Before It Spoils Step 12 Cook This Tonight static checks passed.");
