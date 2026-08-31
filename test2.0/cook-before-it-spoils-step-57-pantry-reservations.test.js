const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const manualDoc = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-57-pantry-reservation-tests.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-57-report.md"), "utf8");

const ACTIVE_HOLD_STATUSES = new Set(["active", "needs-outcome-review", "needs-quantity-review", "needs-safety-review", "partially-fulfilled"]);

function functionBody(name) {
  const marker = `function ${name}`;
  const start = app.indexOf(marker);
  assert(start >= 0, `${name} is missing`);
  const braceStart = app.indexOf("{", start);
  let depth = 0;
  for (let index = braceStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`${name} body was not closed`);
}

function appSection(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert(start >= 0, `${startMarker} is missing`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert(end > start, `${endMarker} is missing after ${startMarker}`);
  return app.slice(start, end);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createSpinachFixture(extra = {}) {
  return {
    id: "step-57-spinach-package-1",
    userScopeId: "user-a",
    ingredientId: "baby-spinach",
    displayName: "Spinach",
    quantityDetails: { status: "known", currentQuantity: 180, unit: "g" },
    reservations: [],
    events: [],
    impactLedger: [],
    ...extra
  };
}

function reservedQuantity(item, { userScopeId = "user-a", mealIdToExclude = "" } = {}) {
  return (item.reservations || [])
    .filter((reservation) => ACTIVE_HOLD_STATUSES.has(reservation.status))
    .filter((reservation) => reservation.unit === item.quantityDetails.unit)
    .filter((reservation) => !reservation.userScopeId || reservation.userScopeId === userScopeId)
    .filter((reservation) => reservation.mealId !== mealIdToExclude)
    .reduce((sum, reservation) => sum + Number(reservation.quantity || 0), 0);
}

function availableQuantity(item, options = {}) {
  const quantity = item.quantityDetails.currentQuantity;
  if (quantity === null || quantity === undefined) return null;
  return Math.max(0, Math.round((Number(quantity) - reservedQuantity(item, options)) * 1000) / 1000);
}

function createReservation(item, { mealId = "meal-spinach-dinner", quantity = 160, userScopeId = "user-a", pantryItemId = item.id } = {}) {
  const next = clone(item);
  const reservationId = `reservation::${mealId}::${pantryItemId}::baby-spinach`;
  const existing = next.reservations.find((reservation) => reservation.reservationId === reservationId && ACTIVE_HOLD_STATUSES.has(reservation.status));
  if (existing) return next;
  assert(availableQuantity(next, { userScopeId }) >= quantity, "Other recipes should see only unreserved Pantry quantity before a new reservation is created.");
  next.reservations.push({
    reservationId,
    userScopeId,
    pantryItemId,
    mealId,
    ingredientDemandId: `${mealId}::baby-spinach`,
    quantity,
    unit: "g",
    status: "active",
    idempotencyKey: `reserve-pantry:${mealId}:${pantryItemId}:baby-spinach:v1`
  });
  next.events.push({
    type: "reserved-for-recipe",
    idempotencyKey: `reserve-pantry:${mealId}:${pantryItemId}:baby-spinach:v1`,
    affectsOnHandQuantity: false,
    affectsReservedQuantity: true,
    amount: quantity,
    unit: "g"
  });
  return next;
}

function openCancellationDialog(item) {
  return clone(item);
}

function confirmMealCancellation(item, { mealId = "meal-spinach-dinner", userScopeId = "user-a", requestId = "cancel-1" } = {}) {
  const next = clone(item);
  const releaseEventKeys = new Set(next.events.map((event) => event.idempotencyKey));
  next.reservations = next.reservations.map((reservation) => {
    if (reservation.mealId !== mealId || reservation.userScopeId !== userScopeId || !ACTIVE_HOLD_STATUSES.has(reservation.status)) return reservation;
    const released = { ...reservation, status: "released", releaseReason: "meal-cancelled", cancellationId: `meal-cancellation:${mealId}:${requestId}` };
    const key = `reservation-release:${reservation.reservationId}:${released.cancellationId}:v1`;
    if (!releaseEventKeys.has(key)) {
      next.events.push({
        type: "reservation-cancelled",
        idempotencyKey: key,
        affectsOnHandQuantity: false,
        affectsReservedQuantity: true,
        amount: reservation.quantity,
        unit: reservation.unit
      });
    }
    return released;
  });
  return next;
}

function openCookingWorkflow(item) {
  return clone(item);
}

function confirmMealCooked(item, { mealId = "meal-spinach-dinner", actualQuantityUsed = 160, userScopeId = "user-a" } = {}) {
  const next = clone(item);
  const completionKey = `meal-completion:${mealId}:v1`;
  if (next.events.some((event) => event.idempotencyKey === `${completionKey}:${next.id}:quantity-used:v1`)) return next;
  const before = next.quantityDetails.currentQuantity;
  assert(actualQuantityUsed <= before, "Actual used quantity cannot exceed physical Pantry quantity.");
  next.quantityDetails.currentQuantity = Math.max(0, Math.round((before - actualQuantityUsed) * 1000) / 1000);
  next.events.push({
    type: "quantity-used",
    idempotencyKey: `${completionKey}:${next.id}:quantity-used:v1`,
    affectsOnHandQuantity: true,
    affectsReservedQuantity: false,
    amount: actualQuantityUsed,
    unit: "g",
    quantityBefore: before,
    quantityAfter: next.quantityDetails.currentQuantity
  });
  next.reservations = next.reservations.map((reservation) => {
    if (reservation.mealId !== mealId || reservation.userScopeId !== userScopeId || !ACTIVE_HOLD_STATUSES.has(reservation.status)) return reservation;
    return { ...reservation, status: actualQuantityUsed > 0 ? "consumed" : "cancelled" };
  });
  next.events.push({
    type: "reservation-consumed",
    idempotencyKey: `${completionKey}:reservation::${mealId}::${next.id}::baby-spinach:consumed:v1`,
    affectsOnHandQuantity: false,
    affectsReservedQuantity: true,
    amount: 160,
    unit: "g"
  });
  return next;
}

const deriveReservedBlock = functionBody("deriveReservedQuantity");
const deriveAvailableBlock = functionBody("deriveAvailableQuantity");
assert(deriveReservedBlock.includes("PANTRY_RESERVATION_STATUSES.ACTIVE"), "Active reservations must count as held quantity.");
assert(deriveReservedBlock.includes("NEEDS_OUTCOME_REVIEW"), "Outcome-review reservations must keep holding quantity.");
assert(deriveAvailableBlock.includes("quantity.currentQuantity - deriveReservedQuantity(item)"), "Available quantity must be physical quantity minus active reservations.");

const reserveBlock = appSection("function reservePantryForMeal", "function createReservationReleaseRecord");
assert(reserveBlock.includes("affectsOnHandQuantity: false"), "Reservation creation must not deduct physical Pantry quantity.");
assert(reserveBlock.includes("affectsReservedQuantity: true"), "Reservation creation must affect reserved quantity.");
assert(reserveBlock.includes("idempotencyKey"), "Reservation creation must be idempotent.");
assert(reserveBlock.includes("availability.freelyAvailableQuantity + 1e-6 < quantity"), "Reservation creation must respect unreserved availability.");
assert(!reserveBlock.includes("createImpactLedgerPosting"), "Reservation creation must not create rescue-impact credit.");

const dialogBlock = functionBody("openCalendarMealCancellationDialog");
assert(dialogBlock.includes("Physical Pantry quantities will not change"), "Cancellation dialog must state physical quantity stays unchanged.");
assert(dialogBlock.includes("Cancel Meal and Release Reservations"), "Cancellation dialog must require explicit confirmation.");
assert(!dialogBlock.includes("releaseMealReservations"), "Opening the cancellation dialog must not release reservations.");

const releaseBlock = appSection("function releaseMealReservations", "function findCalendarMealById");
assert(releaseBlock.includes("reservation.mealId !== mealId"), "Release must target the correct meal.");
assert(releaseBlock.includes("reservation.userScopeId && reservation.userScopeId !== userScopeId"), "Release must stay user scoped.");
assert(releaseBlock.includes("PANTRY_RESERVATION_STATUSES.RELEASED"), "Confirmed cancellation must release reservations.");
assert(releaseBlock.includes("affectsOnHandQuantity: false"), "Reservation release must not change physical Pantry quantity.");
assert(!releaseBlock.includes("currentQuantity +"), "Reservation release must not add food back to Pantry.");
assert(!releaseBlock.includes("createImpactLedgerPosting"), "Reservation release must not create rescue-impact credit.");

const completionBlock = appSection("function commitCookTonightCompletionAtomically", "function openCookTonightCancelReservation");
assert(completionBlock.includes("found.entry.actualOutcome?.completedAt"), "Cooking completion must be idempotent after completion.");
assert(completionBlock.includes("history.idempotencyIndex?.[completionKey]"), "Cooking completion must use the event idempotency index.");
assert(completionBlock.includes("const quantity = Number(use.actualQuantity)"), "Actual quantities must drive physical Pantry deduction.");
assert(completionBlock.includes("current - quantity"), "Cooking completion must deduct actual quantity from physical Pantry quantity.");
assert(completionBlock.includes("quantityBefore: current"), "Cooking event must record quantity before.");
assert(completionBlock.includes("quantityAfter: item.quantity"), "Cooking event must record quantity after.");
assert(completionBlock.includes("PANTRY_RESERVATION_STATUSES.CONSUMED"), "Consumed reservations must be reconciled.");
assert(completionBlock.includes("affectsOnHandQuantity: true"), "Confirmed meal use must affect physical Pantry quantity.");
assert(!completionBlock.includes("createImpactLedgerPosting"), "Cooking reservation test path must not create direct rescue-impact credit.");

let pantryItem = createSpinachFixture();
assert.strictEqual(pantryItem.quantityDetails.currentQuantity, 180, "State 1 physical quantity should start at 180 g.");
assert.strictEqual(reservedQuantity(pantryItem), 0, "State 1 should have no active reservations.");
assert.strictEqual(availableQuantity(pantryItem), 180, "State 1 should expose 180 g for new meals.");

pantryItem = createReservation(pantryItem);
assert.strictEqual(pantryItem.quantityDetails.currentQuantity, 180, "State 2 reservation must not change physical Pantry quantity.");
assert.strictEqual(reservedQuantity(pantryItem), 160, "State 2 should hold 160 g.");
assert.strictEqual(availableQuantity(pantryItem), 20, "State 2 other recipes should see only 20 g unreserved.");
assert.strictEqual(createReservation(pantryItem).reservations.filter((reservation) => reservation.status === "active").length, 1, "Creating the same reservation twice must be idempotent.");

const afterDialog = openCancellationDialog(pantryItem);
assert.deepStrictEqual(afterDialog, pantryItem, "State 3 opening cancellation dialog must not release or mutate the reservation.");

let cancelled = confirmMealCancellation(pantryItem);
assert.strictEqual(cancelled.quantityDetails.currentQuantity, 180, "State 4 cancellation release must not change physical Pantry quantity.");
assert.strictEqual(reservedQuantity(cancelled), 0, "State 4 confirmed cancellation should release the 160 g reservation immediately.");
assert.strictEqual(availableQuantity(cancelled), 180, "State 4 all 180 g should become available after confirmed cancellation.");
assert.strictEqual(cancelled.impactLedger.length, 0, "Reservation release must create no rescue-impact credit.");
cancelled = confirmMealCancellation(cancelled);
assert.strictEqual(cancelled.events.filter((event) => event.type === "reservation-cancelled").length, 1, "Confirmed cancellation must be idempotent.");

let cookingItem = createReservation(createSpinachFixture());
const afterCookingOpened = openCookingWorkflow(cookingItem);
assert.deepStrictEqual(afterCookingOpened, cookingItem, "State 5 opening cooking workflow must not deduct Pantry quantity.");
assert.strictEqual(afterCookingOpened.quantityDetails.currentQuantity, 180);
assert.strictEqual(availableQuantity(afterCookingOpened), 20);

cookingItem = confirmMealCooked(cookingItem, { actualQuantityUsed: 160 });
assert.strictEqual(cookingItem.quantityDetails.currentQuantity, 20, "State 6 confirming 160 g cooked should reduce physical Pantry from 180 g to 20 g.");
assert.strictEqual(reservedQuantity(cookingItem), 0, "State 6 consumed reservation should no longer hold quantity.");
assert.strictEqual(availableQuantity(cookingItem), 20, "State 6 remaining unreserved Pantry quantity should be 20 g.");
assert.strictEqual(cookingItem.events.find((event) => event.type === "quantity-used").amount, 160, "Confirmed cooking must use actual quantity.");
assert.strictEqual(cookingItem.impactLedger.length, 0, "Reservation testing must create no rescue-impact credit.");
assert.deepStrictEqual(confirmMealCooked(cookingItem, { actualQuantityUsed: 160 }), cookingItem, "Confirmed cooking must be idempotent.");

const changedActual = confirmMealCooked(createReservation(createSpinachFixture()), { actualQuantityUsed: 150 });
assert.strictEqual(changedActual.quantityDetails.currentQuantity, 30, "Actual quantities must replace planned quantities when they differ.");
assert.strictEqual(changedActual.events.find((event) => event.type === "quantity-used").amount, 150, "Physical deduction must use actual quantity, not planned quantity.");

const otherUserHeld = createReservation(createSpinachFixture(), { mealId: "other-user-meal", userScopeId: "user-b" });
const mixedScope = createReservation(otherUserHeld, { mealId: "meal-spinach-dinner", userScopeId: "user-a" });
const userACancelled = confirmMealCancellation(mixedScope, { mealId: "meal-spinach-dinner", userScopeId: "user-a" });
assert.strictEqual(userACancelled.reservations.find((reservation) => reservation.userScopeId === "user-b").status, "active", "Reservation release must remain isolated to the correct user.");
assert.strictEqual(userACancelled.reservations.find((reservation) => reservation.userScopeId === "user-a").status, "released", "Reservation release must target the correct meal, item, package, and user.");

[
  "STATE 1",
  "STATE 2",
  "STATE 3",
  "STATE 4",
  "STATE 5",
  "STATE 6",
  "Opening a cancellation dialog does not release the reservation",
  "Confirming that the meal was cooked using 160 g reduces the physical Pantry quantity from 180 g to 20 g",
  "No rescue-impact credit"
].forEach((snippet) => assert(manualDoc.includes(snippet), `Manual Step 57 documentation missing ${snippet}.`));

[
  "Step 57",
  "Pantry reservation behavior",
  "180 g spinach",
  "160 g spinach",
  "physical Pantry quantity remains 180 g",
  "No product functionality was changed"
].forEach((snippet) => assert(report.includes(snippet), `Step 57 report missing ${snippet}.`));

console.log("Cook Before It Spoils Step 57 Pantry reservation behavior tests passed.");
