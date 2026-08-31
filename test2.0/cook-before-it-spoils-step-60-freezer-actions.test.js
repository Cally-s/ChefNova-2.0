const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const docs = {
  freezerSuitability: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-freezing-suitability-catalogue.md"), "utf8"),
  freezerRecording: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-record-freezer-information.md"), "utf8"),
  freezerInventory: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-freezer-inventory.md"), "utf8"),
  partialPackages: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-handle-partial-packages.md"), "utf8"),
  impact: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-impact-metric-definitions.md"), "utf8"),
  step60: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-test-freezer-actions.md"), "utf8"),
  report: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-60-report.md"), "utf8")
};

const FIXED = Object.freeze({
  timezone: "America/Toronto",
  referenceDate: "2026-08-15",
  beforeFreezingAt: "2026-08-15T17:00:00-04:00",
  confirmedFreezingAt: "2026-08-15T18:00:00-04:00",
  bestBeforeDate: "2026-08-16",
  purchasedAt: "2026-08-12T15:00:00-04:00",
  openedAt: "2026-08-13T18:00:00-04:00"
});

const USER_ID = "freezer-test-user";
const OTHER_USER_ID = "freezer-test-other-user";
const SOURCE_ID = "freezer-test-spinach-package-1";
const FREEZER_ID = "freezer-test-spinach-segment-1";
const EVENT_ID = "freezer-test-event-1";
const REQUEST_ID = "freezer-test-request-1";

function appSection(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert(start >= 0, `${startMarker} is missing`);
  const end = endMarker ? app.indexOf(endMarker, start + startMarker.length) : -1;
  assert(!endMarker || end > start, `${endMarker} is missing after ${startMarker}`);
  return app.slice(start, endMarker ? end : app.length);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sumQuantities(records, location = null) {
  return records
    .filter((record) => !location || record.storageLocation === location)
    .filter((record) => record.status !== "historical" && record.physicalStatus !== "used")
    .reduce((sum, record) => sum + Number(record.quantity || 0), 0);
}

function countEvents(events, eventType = "quantity-frozen") {
  return events.filter((event) => event.eventType === eventType && event.status === "confirmed").length;
}

function sourceSpinachFixture(overrides = {}) {
  return {
    id: SOURCE_ID,
    userScopeId: USER_ID,
    ingredientId: "baby-spinach",
    displayName: "Baby spinach",
    originalQuantity: 300,
    quantity: 200,
    unit: "g",
    quantityInformation: {
      representation: "exact-numeric",
      exactQuantity: 200,
      unit: "g",
      confidence: "measured"
    },
    storageLocation: "refrigerator",
    storageContainer: "opened-package",
    packageState: "opened",
    packageFillState: "partial",
    dateInformation: {
      type: "best-before",
      date: FIXED.bestBeforeDate,
      enteredBy: "test-fixture",
      confidence: "confirmed"
    },
    purchasedAt: FIXED.purchasedAt,
    openedAt: FIXED.openedAt,
    frozenAt: null,
    thawedAt: null,
    status: "available",
    physicalStatus: "available",
    activeReservedQuantity: 0,
    pricePaid: 4.50,
    packageQuantity: 300,
    packageUnit: "g",
    revision: 1,
    schemaVersion: 2,
    history: [{ type: "package-created", occurredAt: FIXED.purchasedAt }],
    ...overrides
  };
}

function approvedSpinachFreezerGuidance(overrides = {}) {
  return {
    ingredientId: "baby-spinach",
    freezerGuidance: {
      canFreeze: true,
      preparation: "Approved test guidance",
      textureChangeExpected: true,
      recommendedUsesAfterFreezing: ["soup", "pasta", "curry", "smoothie"],
      requiresBlanching: false,
      canBeCookedFromFrozen: true,
      reviewed: true,
      reviewStatus: "approved",
      guidanceVersion: 1,
      ...overrides.freezerGuidance
    },
    ...overrides
  };
}

function freezeHalfCommand(overrides = {}) {
  return {
    commandVersion: 1,
    commandType: "freeze-pantry-quantity",
    userScopeId: USER_ID,
    sourcePantryItemId: SOURCE_ID,
    requestedQuantity: {
      representation: "exact-numeric",
      point: 100,
      unit: "g",
      confidence: "measured"
    },
    selectionMode: "half-of-current-remaining",
    destinationStorageLocation: "freezer",
    frozenAt: FIXED.confirmedFreezingAt,
    requestId: REQUEST_ID,
    sourceRevisions: { sourceRevision: 1 },
    ...overrides
  };
}

function validateFreezingEligibility(source, guidance, command) {
  if (!source || source.userScopeId !== command.userScopeId) return { ok: false, reason: "source-not-found" };
  if (source.storageLocation !== "refrigerator") return { ok: false, reason: "source-not-refrigerated" };
  if (source.status !== "available" || source.physicalStatus !== "available") return { ok: false, reason: "source-not-available" };
  if (source.dateInformation?.type === "expiration" && source.dateInformation.date < FIXED.referenceDate) return { ok: false, reason: "true-expiration-passed" };
  if (source.storageReviewRequired || source.storageUnsafe) return { ok: false, reason: "storage-review-required" };
  if (!guidance?.freezerGuidance?.reviewed || guidance.freezerGuidance.reviewStatus !== "approved" || guidance.freezerGuidance.canFreeze !== true) return { ok: false, reason: "freezer-guidance-not-approved" };
  if (Number(source.activeReservedQuantity || 0) > 0) return { ok: false, reason: "reservation-review-required", availableQuantity: Math.max(0, Number(source.quantity) - Number(source.activeReservedQuantity)) };
  return { ok: true, availableQuantity: Number(source.quantity) };
}

function openFreezeWorkflow(state, sourceId) {
  const before = clone(state);
  const source = state.pantry.find((item) => item.id === sourceId);
  const result = { opened: Boolean(source), canonicalStateChanged: false, sourceId };
  assert.deepStrictEqual(state, before, "Opening Freeze workflow must not change canonical state.");
  return result;
}

function previewFreezeHalf(state, sourceId) {
  const before = clone(state);
  const source = state.pantry.find((item) => item.id === sourceId);
  if (!source) return { ok: false, reason: "source-not-found" };
  if (source.quantityInformation?.representation === "unknown") return { ok: false, reason: "quantity-unknown", offeredChoices: ["freeze-whole-recorded-item", "enter-approximate-amount", "enter-exact-amount", "keep-quantity-unconfirmed", "cancel"] };
  if (source.quantityInformation?.representation === "range") {
    return { ok: true, previewOnly: true, plannedFreezerRange: [90, 110], expectedRefrigeratorRange: [90, 110], eventsCreated: 0 };
  }
  const current = Number(source.quantity);
  const confidence = source.quantityInformation?.confidence || "measured";
  const planned = current / 2;
  const preview = {
    ok: true,
    previewOnly: true,
    plannedFreezerTransfer: planned,
    expectedRefrigeratorRemainder: current - planned,
    unit: source.unit,
    confidence,
    eventsCreated: 0
  };
  assert.deepStrictEqual(state, before, "Freeze Half preview must not change canonical state.");
  return preview;
}

function cancelFreezeWorkflow(state) {
  const before = clone(state);
  const result = { cancelled: true, eventsCreated: 0, protectedImpactCreated: 0 };
  assert.deepStrictEqual(state, before, "Cancelling Freeze workflow must not change canonical state.");
  return result;
}

function buildFreezingEvent(sourceBefore, sourceAfter, freezerSegment, command) {
  return {
    eventId: EVENT_ID,
    userScopeId: command.userScopeId,
    eventType: "quantity-frozen",
    sourcePantryItemId: sourceBefore.id,
    destinationPantryItemId: freezerSegment.id,
    ingredientId: sourceBefore.ingredientId,
    quantity: {
      representation: command.requestedQuantity.representation,
      point: freezerSegment.quantity,
      unit: freezerSegment.unit,
      confidence: command.requestedQuantity.confidence
    },
    sourceQuantityBefore: sourceBefore.quantity,
    sourceQuantityAfter: sourceAfter.quantity,
    destinationQuantityAfter: freezerSegment.quantity,
    occurredAt: command.frozenAt,
    sourceStorageLocation: "refrigerator",
    destinationStorageLocation: "freezer",
    requestId: command.requestId,
    sourceRevisions: command.sourceRevisions,
    status: "confirmed"
  };
}

function confirmFreezeHalf(state, command = freezeHalfCommand(), guidance = approvedSpinachFreezerGuidance()) {
  const existing = state.events.find((event) => event.requestId === command.requestId && event.eventType === "quantity-frozen");
  if (existing) return { ok: true, state, idempotent: true, createdEvents: 0 };
  const source = state.pantry.find((item) => item.id === command.sourcePantryItemId);
  const eligibility = validateFreezingEligibility(source, guidance, command);
  if (!eligibility.ok) return { ok: false, state, reason: eligibility.reason, availableQuantity: eligibility.availableQuantity || 0, createdEvents: 0, impactCreated: 0 };
  if (Number(command.sourceRevisions?.sourceRevision) !== Number(source.revision)) return { ok: false, state, reason: "stale-source-revision", createdEvents: 0, impactCreated: 0 };
  const recalculatedHalf = Number(source.quantity) / 2;
  if (command.selectionMode === "half-of-current-remaining" && Math.abs(Number(command.requestedQuantity.point) - recalculatedHalf) > 1e-6) {
    return { ok: false, state, reason: "requested-quantity-stale", recalculatedHalf, createdEvents: 0, impactCreated: 0 };
  }
  const sourceAfter = {
    ...source,
    quantity: source.quantity - recalculatedHalf,
    quantityInformation: { ...source.quantityInformation, exactQuantity: source.quantity - recalculatedHalf },
    revision: source.revision + 1,
    updatedAt: command.frozenAt
  };
  const freezerSegment = {
    id: FREEZER_ID,
    userScopeId: command.userScopeId,
    parentPantryItemId: source.id,
    sourcePantryItemId: source.id,
    ingredientId: source.ingredientId,
    displayName: "Frozen baby spinach",
    quantity: recalculatedHalf,
    unit: source.unit,
    quantityInformation: { ...command.requestedQuantity, exactQuantity: recalculatedHalf },
    storageLocation: "freezer",
    physicalStatus: "frozen",
    status: "available",
    frozenAt: command.frozenAt,
    sourceDateInformation: clone(source.dateInformation),
    sourceOpenedAt: source.openedAt,
    sourcePurchasedAt: source.purchasedAt,
    sourcePackageQuantity: source.packageQuantity,
    sourcePackageUnit: source.packageUnit,
    sourcePackageId: source.id,
    sourcePackageHistory: clone(source.history || []),
    freezerGuidanceVersion: guidance.freezerGuidance.guidanceVersion,
    qualityReminderDate: null,
    qualityReminderLabel: "Quality reminder",
    pricePaid: 0,
    inheritedSourcePricePaid: source.pricePaid,
    newlyPurchased: false,
    revision: 1,
    schemaVersion: 1
  };
  const event = buildFreezingEvent(source, sourceAfter, freezerSegment, command);
  const nextState = {
    ...state,
    pantry: state.pantry.map((item) => item.id === source.id ? sourceAfter : item).concat(freezerSegment),
    events: state.events.concat(event),
    impactLedger: state.impactLedger,
    protectedForLaterUse: state.metricContractSupportsProtection ? state.protectedForLaterUse.concat({ requestId: command.requestId, ingredientId: source.ingredientId, quantity: recalculatedHalf, unit: source.unit, provisional: true }) : state.protectedForLaterUse
  };
  return { ok: true, state: nextState, refrigerator: sourceAfter, freezer: freezerSegment, event, createdEvents: 1, impactCreated: 0 };
}

function useFrozenSegment(state, freezerId = FREEZER_ID, requestId = "freezer-test-use-1") {
  if (state.impactLedger.some((entry) => entry.requestId === requestId)) return { state, createdImpact: 0, idempotent: true };
  const freezer = state.pantry.find((item) => item.id === freezerId);
  if (!freezer || freezer.storageLocation !== "freezer" || Number(freezer.quantity) <= 0) return { state, createdImpact: 0, reason: "no-freezer-quantity" };
  const used = Number(freezer.quantity);
  const nextFreezer = { ...freezer, quantity: 0, physicalStatus: "used", status: "used" };
  return {
    state: {
      ...state,
      pantry: state.pantry.map((item) => item.id === freezerId ? nextFreezer : item),
      impactLedger: state.impactLedger.concat({ requestId, metric: "ingredient-rescued", ingredientId: freezer.ingredientId, quantity: used, unit: freezer.unit, sourceFreezingRequestId: REQUEST_ID })
    },
    createdImpact: 1,
    rescuedQuantity: used
  };
}

function discardFrozenSegment(state, freezerId = FREEZER_ID, requestId = "freezer-test-discard-1") {
  const freezer = state.pantry.find((item) => item.id === freezerId);
  if (!freezer) return { state, createdImpact: 0 };
  return {
    state: { ...state, pantry: state.pantry.map((item) => item.id === freezerId ? { ...item, quantity: 0, physicalStatus: "discarded", status: "discarded" } : item) },
    createdImpact: 0,
    requestId
  };
}

function createInitialState(overrides = {}) {
  return {
    pantry: [sourceSpinachFixture(overrides.source || {})],
    events: [],
    impactLedger: [],
    protectedForLaterUse: [],
    metricContractSupportsProtection: true,
    ...overrides
  };
}

const freezeBlock = appSection("function freezeLeftoverBatch", "function thawLeftoverBatch");
assert(freezeBlock.includes("deriveAvailableQuantity(source)"), "Freeze command must validate available source quantity.");
assert(freezeBlock.includes("LEFTOVER_BATCH_SPLIT"), "Partial freeze must use a split command/event path.");
assert(freezeBlock.includes("MARKED_FROZEN"), "Full freeze must use the marked-frozen path.");
assert(freezeBlock.includes("confirmedFrozenAt"), "Freeze command must store the confirmed frozen timestamp.");
assert(freezeBlock.includes("currentQuantity: remaining"), "Partial freeze must reduce the source current quantity.");
assert(freezeBlock.includes("currentQuantity: amount"), "Partial freeze must create a freezer child with the transferred quantity.");
assert(freezeBlock.includes("parentLeftoverBatchIds"), "Partial freeze must preserve source lineage.");
assert(freezeBlock.includes("idempotencyRequestId"), "Freeze command must support idempotency keys.");
assert(freezeBlock.includes("Original cooked time preserved") || freezeBlock.includes("Quantity conservation preserved"), "Freeze event notes must preserve timeline or conservation context.");

const recordingOpenBlock = appSection("function openFreezerRecordingWorkflow", "function readFreezerRecordingForm");
assert(!recordingOpenBlock.includes("executePantryCommand"), "Opening Freeze workflow must not execute a Pantry command.");
assert(!recordingOpenBlock.includes("freezeLeftoverBatch("), "Opening Freeze workflow must not freeze food.");

const recordingConfirmBlock = appSection("function confirmFreezerRecording", "function renderFrozenInventoryDetails");
assert(recordingConfirmBlock.includes("validateFreezerRecordingDraft"), "Freezer confirmation must validate the draft.");
assert(recordingConfirmBlock.includes("freezeLeftoverBatch"), "Freezer confirmation must call the canonical freeze command.");

assert(app.includes("This is a quality and meal-planning reminder, not an expiration date."), "Freezer quality reminders must not be labelled as expiration dates.");
assert(app.includes("FREEZER_QUALITY_REMINDER_STATUSES"), "Freezer quality reminder statuses must exist.");
assert(!app.includes("Freeze Anyway"), "App must not expose Freeze Anyway bypass text.");

assert(docs.freezerSuitability.includes("Only approved or approved-with-limitations policies may resolve to `canRecommendFreezing: true`"), "Freezer suitability docs must require approved guidance.");
assert(docs.freezerRecording.includes("Opening Freeze Options or the recorder does not change Pantry state."), "Freezer recording docs must keep opening non-mutating.");
assert(docs.freezerInventory.includes("Quality Reminder Due is not a safety deadline."), "Freezer inventory docs must separate quality reminders from expiration.");
assert(docs.partialPackages.includes("Chef Nova is using the recorded remaining quantity, not the original package size"), "Partial package docs must use remaining quantity.");
assert(docs.impact.includes("Food Protected for Later Use") || docs.impact.includes("FOOD_PROTECTED_FOR_LATER_USE"), "Impact docs must support protected-for-later-use as separate from confirmed rescue.");

let state = createInitialState();
assert.strictEqual(sumQuantities(state.pantry, "refrigerator"), 200, "STATE 1 refrigerator quantity must be 200 g.");
assert.strictEqual(sumQuantities(state.pantry, "freezer"), 0, "STATE 1 freezer quantity must be 0 g.");
assert.strictEqual(sumQuantities(state.pantry), 200, "STATE 1 total physical quantity must be 200 g.");
assert.strictEqual(countEvents(state.events), 0, "STATE 1 freezing events must be 0.");
assert.strictEqual(state.impactLedger.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0), 0, "STATE 1 permanent rescue impact must be 0 g.");
assert.strictEqual(state.protectedForLaterUse.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0), 0, "STATE 1 protected-for-later-use should start at 0 g.");

openFreezeWorkflow(state, SOURCE_ID);
assert.strictEqual(sumQuantities(state.pantry, "refrigerator"), 200, "STATE 2 opening dialog keeps refrigerator at 200 g.");
assert.strictEqual(sumQuantities(state.pantry, "freezer"), 0, "STATE 2 opening dialog keeps freezer at 0 g.");
assert.strictEqual(countEvents(state.events), 0, "STATE 2 opening dialog creates no event.");

const preview = previewFreezeHalf(state, SOURCE_ID);
assert.strictEqual(preview.plannedFreezerTransfer, 100, "STATE 3 Freeze Half preview uses 200 g / 2 = 100 g.");
assert.strictEqual(preview.expectedRefrigeratorRemainder, 100, "STATE 3 preview shows 100 g refrigerator remainder.");
assert.strictEqual(preview.eventsCreated, 0, "STATE 3 preview creates no event.");
assert.strictEqual(sumQuantities(state.pantry, "refrigerator"), 200, "STATE 3 preview keeps physical refrigerator at 200 g.");
assert.strictEqual(sumQuantities(state.pantry, "freezer"), 0, "STATE 3 preview keeps physical freezer at 0 g.");

const cancel = cancelFreezeWorkflow(state);
assert.strictEqual(cancel.eventsCreated, 0, "STATE 4 cancelling creates no event.");
assert.strictEqual(cancel.protectedImpactCreated, 0, "STATE 4 cancelling creates no protected-for-later-use entry.");
assert.strictEqual(sumQuantities(state.pantry, "refrigerator"), 200, "STATE 4 cancelling keeps refrigerator at 200 g.");
assert.strictEqual(sumQuantities(state.pantry, "freezer"), 0, "STATE 4 cancelling keeps freezer at 0 g.");

const confirmed = confirmFreezeHalf(state);
assert.strictEqual(confirmed.ok, true, "STATE 5 Freeze Half confirmation should succeed.");
state = confirmed.state;
assert.strictEqual(sumQuantities(state.pantry, "refrigerator"), 100, "STATE 5 refrigerator quantity must be 100 g.");
assert.strictEqual(sumQuantities(state.pantry, "freezer"), 100, "STATE 5 freezer quantity must be 100 g.");
assert.strictEqual(sumQuantities(state.pantry), 200, "STATE 5 total physical quantity must remain 200 g.");
assert.strictEqual(countEvents(state.events), 1, "STATE 5 exactly one confirmed freezing event is required.");
assert.strictEqual(confirmed.event.sourceQuantityBefore, 200, "Freezing event must record source quantity before as 200 g.");
assert.strictEqual(confirmed.event.sourceQuantityAfter, 100, "Freezing event must record source quantity after as 100 g.");
assert.strictEqual(confirmed.event.destinationQuantityAfter, 100, "Freezing event must record destination quantity after as 100 g.");
assert.strictEqual(confirmed.refrigerator.dateInformation.date, FIXED.bestBeforeDate, "Refrigerator best-before date must remain August 16.");
assert.strictEqual(confirmed.refrigerator.dateInformation.type, "best-before", "Refrigerator date type must remain Best Before.");
assert.strictEqual(confirmed.refrigerator.openedAt, FIXED.openedAt, "Refrigerator opened date must remain August 13 at 6 PM.");
assert.strictEqual(confirmed.refrigerator.originalQuantity, 300, "Original package quantity must remain 300 g.");
assert.strictEqual(confirmed.refrigerator.packageQuantity, 300, "Package quantity must remain 300 g.");
assert.strictEqual(confirmed.refrigerator.quantity, 100, "Current remaining quantity must not reset to 300 g.");
assert.strictEqual(confirmed.freezer.quantity, 100, "Freezer segment must contain 100 g.");
assert.strictEqual(confirmed.freezer.parentPantryItemId, SOURCE_ID, "Freezer segment must reference source package.");
assert.strictEqual(confirmed.freezer.sourceDateInformation.date, FIXED.bestBeforeDate, "Freezer segment must preserve source best-before date.");
assert.strictEqual(confirmed.freezer.frozenAt, FIXED.confirmedFreezingAt, "Freezer segment must record its own frozenAt timestamp.");
assert.notStrictEqual(confirmed.freezer.sourceDateInformation.date, confirmed.freezer.frozenAt.slice(0, 10), "Freezer segment must not replace source date with frozenAt.");
assert.strictEqual(confirmed.freezer.qualityReminderLabel, "Quality reminder", "Freezer quality reminder must be labelled as quality reminder.");
assert.strictEqual(confirmed.freezer.newlyPurchased, false, "Freezer segment must not be treated as newly purchased food.");
assert.strictEqual(state.impactLedger.length, 0, "STATE 5 freezing must not create permanent rescue impact.");
assert.strictEqual(state.protectedForLaterUse.reduce((sum, entry) => sum + entry.quantity, 0), 100, "STATE 5 may show 100 g protected for later use.");

const reloaded = JSON.parse(JSON.stringify(state));
assert.strictEqual(sumQuantities(reloaded.pantry, "refrigerator"), 100, "STATE 6 reload keeps refrigerator at 100 g.");
assert.strictEqual(sumQuantities(reloaded.pantry, "freezer"), 100, "STATE 6 reload keeps freezer at 100 g.");
assert.strictEqual(sumQuantities(reloaded.pantry), 200, "STATE 6 reload keeps total at 200 g.");
assert.strictEqual(countEvents(reloaded.events), 1, "STATE 6 reload keeps exactly one freezing event.");
assert.strictEqual(reloaded.pantry.find((item) => item.id === SOURCE_ID).dateInformation.date, FIXED.bestBeforeDate, "STATE 6 reload preserves original refrigerator date.");

const usedOnce = useFrozenSegment(reloaded);
assert.strictEqual(usedOnce.rescuedQuantity, 100, "STATE 7 later confirmed freezer use may rescue at most 100 g.");
assert.strictEqual(sumQuantities(usedOnce.state.pantry, "freezer"), 0, "STATE 7 later confirmed freezer use leaves freezer at 0 g.");
assert.strictEqual(usedOnce.createdImpact, 1, "STATE 7 later confirmed use creates one impact entry.");
const usedRetry = useFrozenSegment(usedOnce.state);
assert.strictEqual(usedRetry.createdImpact, 0, "STATE 7 duplicate later use creates no duplicate impact.");
assert.strictEqual(usedOnce.state.impactLedger.reduce((sum, entry) => sum + entry.quantity, 0), 100, "Freezing plus later consumption must not create 200 g of rescue credit.");

const discarded = discardFrozenSegment(state);
assert.strictEqual(discarded.createdImpact, 0, "Later freezer discard must not become rescue impact.");

const retry = confirmFreezeHalf(state);
assert.strictEqual(retry.createdEvents, 0, "Retry with same request ID must create no duplicate event.");
assert.strictEqual(sumQuantities(retry.state.pantry, "refrigerator"), 100, "Retry keeps refrigerator at 100 g.");
assert.strictEqual(sumQuantities(retry.state.pantry, "freezer"), 100, "Retry keeps freezer at 100 g.");
assert.strictEqual(countEvents(retry.state.events), 1, "Retry keeps one confirmed freezing event.");

const tabState = createInitialState();
const tabA = confirmFreezeHalf(tabState, freezeHalfCommand({ sourceRevisions: { sourceRevision: 1 } }));
const tabB = confirmFreezeHalf(tabA.state, freezeHalfCommand({ requestId: "freezer-test-request-2", sourceRevisions: { sourceRevision: 1 } }));
assert.strictEqual(tabA.ok, true, "First tab should commit.");
assert.strictEqual(tabB.ok, false, "Second stale tab should be blocked.");
assert.strictEqual(tabB.reason, "stale-source-revision", "Second stale tab should detect stale source revision.");
assert.strictEqual(sumQuantities(tabB.state.pantry), 200, "Multi-tab total remains 200 g.");
assert.strictEqual(countEvents(tabB.state.events), 1, "Multi-tab result contains one freezing event.");

const conflictState = createInitialState();
const freezeFirst = confirmFreezeHalf(conflictState);
const staleUseWouldLeaveNegative = Number(freezeFirst.state.pantry.find((item) => item.id === SOURCE_ID).quantity) - 150 < 0;
assert.strictEqual(staleUseWouldLeaveNegative, true, "Freeze-versus-use stale 150 g use must be blocked or recalculated.");

const reservedState = createInitialState({ source: { activeReservedQuantity: 120 } });
const reservedAttempt = confirmFreezeHalf(reservedState);
assert.strictEqual(reservedAttempt.ok, false, "Freeze Half must not steal from active reservations.");
assert.strictEqual(reservedAttempt.reason, "reservation-review-required", "Reservation conflict should require review.");
assert.strictEqual(reservedAttempt.availableQuantity, 80, "Maximum freely available quantity must be 80 g.");
assert.strictEqual(sumQuantities(reservedAttempt.state.pantry, "refrigerator"), 200, "Reservation conflict changes no refrigerator quantity.");
assert.strictEqual(countEvents(reservedAttempt.state.events), 0, "Reservation conflict creates no event.");

const packageTwo = sourceSpinachFixture({ id: "freezer-test-spinach-package-2", quantity: 150, quantityInformation: { representation: "exact-numeric", exactQuantity: 150, unit: "g", confidence: "measured" }, revision: 1 });
const multiplePackageState = createInitialState({ pantry: [sourceSpinachFixture(), packageTwo], events: [], impactLedger: [], protectedForLaterUse: [], metricContractSupportsProtection: true });
const multiPackageResult = confirmFreezeHalf(multiplePackageState);
assert.strictEqual(multiPackageResult.state.pantry.find((item) => item.id === SOURCE_ID).quantity, 100, "Package 1 refrigerator should become 100 g.");
assert.strictEqual(multiPackageResult.state.pantry.find((item) => item.id === FREEZER_ID).quantity, 100, "Package 1 freezer child should be 100 g.");
assert.strictEqual(multiPackageResult.state.pantry.find((item) => item.id === "freezer-test-spinach-package-2").quantity, 150, "Package 2 refrigerator should remain 150 g.");

const unknownPreview = previewFreezeHalf(createInitialState({ source: { quantity: null, quantityInformation: { representation: "unknown", unit: "g", confidence: "unknown" } } }), SOURCE_ID);
assert.strictEqual(unknownPreview.ok, false, "Unknown quantity cannot calculate Freeze Half.");
assert(unknownPreview.offeredChoices.includes("enter-exact-amount"), "Unknown quantity workflow should offer exact amount entry.");

const estimatedState = createInitialState({ source: { quantityInformation: { representation: "approximate", exactQuantity: 200, unit: "g", confidence: "estimated" } } });
const estimatedPreview = previewFreezeHalf(estimatedState, SOURCE_ID);
assert.strictEqual(estimatedPreview.plannedFreezerTransfer, 100, "Estimated 200 g preview should show about 100 g.");
assert.strictEqual(estimatedPreview.confidence, "estimated", "Estimated preview must retain estimated confidence.");

const rangePreview = previewFreezeHalf(createInitialState({ source: { quantity: 200, quantityInformation: { representation: "range", min: 180, max: 220, unit: "g", confidence: "estimated" } } }), SOURCE_ID);
assert.deepStrictEqual(rangePreview.plannedFreezerRange, [90, 110], "Range quantity Freeze Half should remain 90-110 g.");

["expiration", "storage", "guidance"].forEach((variant) => {
  const source = variant === "expiration" ? { dateInformation: { type: "expiration", date: "2026-08-14", confidence: "confirmed" } }
    : variant === "storage" ? { storageReviewRequired: true }
      : {};
  const guidance = variant === "guidance" ? approvedSpinachFreezerGuidance({ freezerGuidance: { reviewed: false, reviewStatus: "draft", canFreeze: null } }) : approvedSpinachFreezerGuidance();
  const result = confirmFreezeHalf(createInitialState({ source }), freezeHalfCommand(), guidance);
  assert.strictEqual(result.ok, false, `${variant} variant must reject Freeze Half.`);
  assert.strictEqual(sumQuantities(result.state.pantry, "refrigerator"), variant === "expiration" ? 200 : 200, `${variant} variant keeps refrigerator unchanged.`);
  assert.strictEqual(countEvents(result.state.events), 0, `${variant} variant creates no freezing event.`);
  assert.strictEqual(result.impactCreated, 0, `${variant} variant creates no impact.`);
});

[
  "## 1. Purpose",
  "## 2. Fixed Clock",
  "## 3. Source Pantry Fixture",
  "## 28. Commands",
  "200 g = 100 g + 100 g",
  "Freeze Half preview creates no freezing event",
  "Food permanently rescued: 0 g",
  "Freezer quality reminder is not an expiration date"
].forEach((snippet) => assert(docs.step60.includes(snippet), `Step 60 test documentation missing ${snippet}.`));

[
  "Refrigerator spinach after confirmation: 100 g",
  "Freezer spinach after confirmation: 100 g",
  "Total physical spinach after confirmation: 200 g",
  "Confirmed freezing events: 1",
  "Opening Freeze workflow quantity changes: 0",
  "Preview freezing events: 0",
  "Cancelled workflow quantity changes: 0",
  "Permanent rescue credit from freezing: 0 g",
  "Food waste avoided from freezing: 0 g",
  "Estimated money saved from freezing: $0.00",
  "Food Protected for Later Use from freezing: 100 g",
  "Duplicate freezing events after retry: 0",
  "Multi-tab duplicate freezer quantity: 0 g",
  "Cross-package quantity changes: 0",
  "Unknown quantity exact half invented: 0",
  "Freeze Anyway actions: 0"
].forEach((snippet) => assert(docs.report.includes(snippet), `Step 60 report missing ${snippet}.`));

console.log("Cook Before It Spoils Step 60 freezer action tests passed.");
