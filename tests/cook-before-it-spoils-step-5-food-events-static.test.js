const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");

[
  "FOOD_EVENT_HISTORY_SCHEMA_VERSION = 1",
  "FOOD_EVENT_CATEGORIES",
  "FOOD_EVENT_TYPES",
  "FOOD_EVENT_SOURCE_TYPES",
  "FOOD_EVENT_QUANTITY_DIRECTIONS",
  "PANTRY_HISTORY_RECONCILIATION_STATUSES"
].forEach((token) => assert(app.includes(token), `Missing food event schema token: ${token}`));

[
  "HISTORY_BASELINE_CREATED",
  "ITEM_ADDED",
  "ITEM_OPENED",
  "QUANTITY_ADDED",
  "QUANTITY_USED",
  "RESERVED_FOR_RECIPE",
  "RESERVATION_CANCELLED",
  "RESERVATION_CONSUMED",
  "MARKED_FROZEN",
  "MARKED_THAWED",
  "ADDED_TO_LEFTOVER_BATCH",
  "CONSUMED",
  "DISCARDED",
  "DONATED_SHARED",
  "QUANTITY_CORRECTED",
  "DATE_ADDED",
  "DATE_CORRECTED",
  "DATE_REMOVED",
  "STORAGE_LOCATION_CHANGED",
  "STORAGE_CONTAINER_CHANGED",
  "PACKAGE_STATE_CHANGED",
  "EVENT_RECORD_CORRECTED"
].forEach((token) => assert(app.includes(token), `Missing food event type: ${token}`));

[
  "createEmptyFoodEventHistory",
  "normalizeFoodEventSource",
  "foodEventCategoryForType",
  "normalizeFoodQuantityChange",
  "createFoodEvent",
  "validateFoodEvent",
  "normalizeFoodEventHistory",
  "loadFoodEventHistory",
  "writeFoodEventHistory",
  "appendFoodEventsToHistory",
  "commitPantrySnapshotAndFoodEvents",
  "executePantryCommand",
  "buildFoodEventForPantryCommand",
  "selectFoodEventsForPantryItem",
  "selectFoodEventsByDateRange",
  "selectFoodEventsByType",
  "selectFoodEventsForMeal",
  "selectFoodEventsForPlan",
  "selectFoodEventsForLeftoverBatch",
  "deriveEffectiveFoodEvents",
  "summarizeConfirmedFoodEvents",
  "reconcilePantryQuantityHistory",
  "renderFoodEventHistoryForPantryItem",
  "buildHistoryBaselineEvent",
  "ensureFoodHistoryBaselinesForPantry"
].forEach((fn) => assert(app.includes(`function ${fn}`), `Missing food event function: ${fn}`));

assert(app.includes("foodEvents: \"chefNovaGuestFoodEvents\""), "Guest food event history should use session-scoped storage.");
assert(app.includes("FoodEvents: \"chefNovaFoodEvents\""), "Registered-user food event history should use the user-scoped storage convention.");
assert(app.includes("FoodEvents: [\"chefNovaFoodEvents\"]"), "Legacy shared food event key should be declared for migration.");
assert(app.includes("guestSessionData.foodEventHistory"), "Guest session data should include temporary food event history.");
assert(app.includes("state.foodEventHistory"), "Application state should keep one active food event history.");
assert(app.includes("idempotencyIndex"), "Food event history should store an idempotency index.");
assert(app.includes("idempotencyKey"), "Food events should require idempotency keys.");
assert(app.includes("eventOrder"), "Food events should preserve deterministic event ordering.");
assert(app.includes("unsupportedFutureVersion"), "Unsupported future event histories should be preserved and blocked from overwrite.");

assert(app.includes("renderFoodEventHistoryForPantryItem(item)"), "Pantry cards should render item history.");
assert(app.includes("Food History"), "Pantry history heading should be visible.");
assert(app.includes("Pantry history needs review."), "Reconciliation warnings should be visible as text.");
assert(app.includes("Baseline from existing Pantry data. This is not a user action."), "Legacy baseline events should not fabricate old user actions.");
assert(app.includes("Pantry record removed from the current Pantry view. This is not a discard event."), "Removing a Pantry record should not be recorded as discarded food.");
assert(app.includes("corrected: correctedIds.has(event.eventId)"), "Corrected events should remain visible but flagged.");
assert(app.includes("effectiveForQuantityTotals: !correctedIds.has(event.eventId) && event.eventCategory !== FOOD_EVENT_CATEGORIES.MIGRATION"), "Corrections and baselines should be excluded from effective totals.");
assert(app.includes("event.eventCategory === FOOD_EVENT_CATEGORIES.MIGRATION"), "Food summaries should exclude migration baseline events.");
assert(app.includes("event.eventCategory === FOOD_EVENT_CATEGORIES.CORRECTION"), "Food summaries should classify correction records separately.");

assert(app.includes("commandType: FOOD_EVENT_TYPES.ITEM_ADDED"), "Pantry add flows should create Item Added events.");
assert(app.includes("const eventType = existingRecordId ? FOOD_EVENT_TYPES.DATE_CORRECTED : FOOD_EVENT_TYPES.DATE_ADDED"), "Date add flow should create Date Added events.");
assert(app.includes("FOOD_EVENT_TYPES.DATE_CORRECTED"), "Date correction flow should create Date Corrected events.");
assert(app.includes("FOOD_EVENT_TYPES.DATE_REMOVED"), "Date removal flow should create Date Removed events.");
assert(app.includes("commandType: FOOD_EVENT_TYPES.QUANTITY_USED"), "Meal completion should create Quantity Used events.");
assert(app.includes("sourceType: FOOD_EVENT_SOURCE_TYPES.MEAL_COMPLETION"), "Meal completion events should carry a meal source.");
assert(app.includes("sourceType: FOOD_EVENT_SOURCE_TYPES.SHOPPING_LIST"), "Shopping List Pantry adds should carry a Shopping List source.");
assert(app.includes("package-remainder:${transactionId}:v1"), "Package remainders should use the shared Pantry command path.");
assert(app.includes("pantryDeductionsApplied?.[mealKey]"), "Meal completion should keep duplicate deduction protection.");
assert(app.includes("commitPantrySnapshotAndFoodEvents(updatedPantry, foodEvents)"), "Meal completion should commit Pantry and events together.");
assert(!app.includes("dateInformation:"), "Food event history must not replace Step 3 date records.");

[
  ".pantry-history",
  ".pantry-history-heading",
  ".pantry-history-warning",
  ".pantry-history li",
  "@media (max-width: 640px)"
].forEach((selector) => assert(css.includes(selector), `Missing Pantry history CSS: ${selector}`));

console.log("Cook Before It Spoils Step 5 food event history static checks passed.");
