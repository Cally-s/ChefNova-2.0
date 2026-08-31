const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const docs = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-meal-calendar-reservations.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-39-report.md"), "utf8");

function bodyOf(name) {
  const marker = `function ${name}`;
  const start = app.indexOf(marker);
  assert(start >= 0, `${name} is missing`);
  const signatureEnd = app.indexOf(") {", start);
  const braceStart = signatureEnd >= 0 ? app.indexOf("{", signatureEnd) : app.indexOf("{", start);
  let depth = 0;
  for (let index = braceStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`${name} body was not closed`);
}

[
  "PANTRY_RESERVATION_SCHEMA_VERSION",
  "PANTRY_RESERVATION_GROUP_SCHEMA_VERSION",
  "PANTRY_RESERVATION_POLICY_VERSION",
  "PANTRY_RESERVATION_ORIGINS",
  "PANTRY_RESERVATION_SCOPES"
].forEach((token) => assert(app.includes(token), `${token} is missing`));

[
  "DRAFT",
  "ACTIVE",
  "NEEDS_OUTCOME_REVIEW",
  "NEEDS_QUANTITY_REVIEW",
  "NEEDS_SAFETY_REVIEW",
  "PARTIALLY_FULFILLED",
  "FULFILLED",
  "RELEASED",
  "CANCELLED",
  "SUPERSEDED",
  "INVALID"
].forEach((status) => assert(app.includes(status), `${status} status is missing`));

const schedule = bodyOf("scheduleMealWithReservations");
assert(schedule.includes("releaseMealReservations"), "calendar scheduling must release changed reservations");
assert(schedule.includes("reservePantryForMeal"), "calendar scheduling must reserve Pantry lots");
assert(schedule.includes("commitPantrySnapshotAndFoodEvents"), "calendar scheduling must commit Pantry/events atomically");
assert(schedule.includes("saveMealPlan"), "calendar scheduling must save the meal plan");
assert(schedule.includes("ensureBudgetPurchaseGroupsInShoppingList"), "calendar scheduling must update existing Shopping List demand");

const saveCalendarDay = bodyOf("saveCalendarDay");
assert(saveCalendarDay.includes("scheduleMealWithReservations"), "Calendar save must use reservation scheduler");
assert(!saveCalendarDay.includes("state.mealPlans.calendar[date] = normalizeMealDay(next"), "Calendar save should not bypass scheduler");

const reserve = bodyOf("reservePantryForMeal");
[
  "pantryItemId",
  "reservationGroupId",
  "ingredientDemandId",
  "PANTRY_RESERVATION_SCHEMA_VERSION",
  "PANTRY_RESERVATION_GROUP_SCHEMA_VERSION",
  "affectsOnHandQuantity: false",
  "affectsReservedQuantity: true",
  "RESERVED_FOR_RECIPE"
].forEach((token) => assert(reserve.includes(token), `reservePantryForMeal must include ${token}`));
assert(!reserve.includes("QUANTITY_USED"), "scheduling must not mark Pantry quantity as used");
assert(!reserve.includes("createImpactLedgerPosting"), "scheduling must not credit impact");

const release = bodyOf("releaseMealReservations");
assert(release.includes("RESERVATION_CANCELLED"), "release must record planning release events");
assert(release.includes("affectsOnHandQuantity: false"), "release must not affect physical Pantry quantity");
assert(!release.includes("DISCARDED"), "release must not discard food");
assert(!release.includes("MARKED_FROZEN"), "release must not freeze food");
assert(!release.includes("createImpactLedgerPosting"), "release must not credit impact");

const availability = bodyOf("deriveAvailableQuantity");
assert(availability.includes("PANTRY_RESERVATION_SCOPES.ENTIRE_ITEM"), "entire-item holds must affect availability");

const reserved = bodyOf("deriveReservedQuantity");
assert(reserved.includes("NEEDS_OUTCOME_REVIEW"), "outcome-review reservations must remain active holds");
assert(reserved.includes("NEEDS_SAFETY_REVIEW"), "safety-review reservations must remain active holds");

const renderDetails = bodyOf("renderCalendarReservationDetails");
[
  "PANTRY RESERVED",
  "Still needed",
  "The Pantry quantities have not been reduced",
  "View Reserved Ingredients",
  "Change Servings",
  "Replace Meal",
  "Cancel Meal"
].forEach((token) => assert(renderDetails.includes(token), `Calendar reservation details must render ${token}`));

const allocation = bodyOf("buildPantryAllocationForPlan");
assert(allocation.includes("pantryItems = state.pantry"), "allocation builder must accept a Pantry snapshot");
assert(allocation.includes("pantryItems,"), "allocation builder must pass the provided Pantry snapshot");

[
  "rescueCalendar",
  "reservedPantryInventory",
  "mealReservationCalendar",
  "calendarPantryCopy",
  "foodRescueReservationStore",
  "scheduledIngredientInventory"
].forEach((forbidden) => assert(!app.includes(forbidden), `${forbidden} must not be introduced`));

assert(docs.includes("# Chef Nova Meal Calendar Pantry Reservations"), "reservation documentation is missing");
assert(docs.includes("Released Is Not Fulfilled"), "release semantics must be documented");
assert(docs.includes("Unknown Pantry quantities are not converted to zero"), "unknown quantity rule must be documented");
assert(report.includes("Step 39 Implementation Report"), "Step 39 report is missing");
assert(report.includes("No duplicate Calendar or reservation system was created."), "duplicate-system result must be reported");

console.log("Step 39 Meal Calendar reservation static checks passed.");
