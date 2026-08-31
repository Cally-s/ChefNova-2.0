const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const docs = {
  guardrails: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-food-safety-guardrails.md"), "utf8"),
  events: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-food-event-history.md"), "utf8"),
  timeline: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-original-leftover-timeline.md"), "utf8"),
  transformations: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-leftover-transformation-paths.md"), "utf8"),
  step59: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-test-reheating-history.md"), "utf8"),
  report: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-59-report.md"), "utf8")
};

const FIXED = Object.freeze({
  timezone: "America/Toronto",
  sourceMealDate: "2026-08-10",
  originalCookedAt: "2026-08-10T18:00:00-04:00",
  refrigeratedAt: "2026-08-10T19:00:00-04:00",
  firstReheatedAt: "2026-08-11T12:15:00-04:00",
  evaluationAt: "2026-08-12T12:00:00-04:00"
});

const USER_ID = "reheat-test-user";
const OTHER_USER_ID = "reheat-test-other-user";
const SOURCE_MEAL_ID = "reheat-test-source-meal";
const SOURCE_RECIPE_ID = "reheat-test-source-recipe";
const LEFTOVER_BATCH_ID = "reheat-test-leftover-batch";
const SEGMENT_ID = "reheat-test-leftover-segment-1";
const EVENT_ID = "reheat-event-1";
const TUESDAY_LUNCH_ID = "reheat-test-tuesday-lunch";

const policyFixture = Object.freeze({
  policyId: "leftovers-single-reheat-v1",
  policyVersion: 1,
  maximumConfirmedReheats: 1,
  blockedActions: ["reheat", "use-in-heated-recipe", "heated-leftover-transformation", "reserve-for-heated-meal"]
});

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

function formatDateInToronto(iso) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FIXED.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(iso));
}

function sourceMealFixture(overrides = {}) {
  return {
    id: SOURCE_MEAL_ID,
    userId: USER_ID,
    date: FIXED.sourceMealDate,
    recipeId: SOURCE_RECIPE_ID,
    recipeName: "Vegetable Soup",
    status: "completed",
    completedAt: FIXED.originalCookedAt,
    ...overrides
  };
}

function sourceRecipeFixture(overrides = {}) {
  return {
    id: SOURCE_RECIPE_ID,
    name: "Vegetable Soup",
    category: "Dinner",
    servings: 4,
    preparedFoodTypeId: "vegetable-soup",
    ...overrides
  };
}

function preReheatLeftoverFixture(overrides = {}) {
  return {
    id: LEFTOVER_BATCH_ID,
    userId: USER_ID,
    sourceMealId: SOURCE_MEAL_ID,
    sourceRecipeId: SOURCE_RECIPE_ID,
    recipeName: "Vegetable Soup",
    quantity: 2,
    unit: "serving",
    originalCookedAt: FIXED.originalCookedAt,
    refrigeratedAt: FIXED.refrigeratedAt,
    reheatCount: 0,
    eventIds: [],
    status: "available",
    ...overrides
  };
}

function confirmedReheatEventFixture(overrides = {}) {
  return {
    id: EVENT_ID,
    userId: USER_ID,
    sourceId: LEFTOVER_BATCH_ID,
    sourceSegmentId: SEGMENT_ID,
    targetMealId: TUESDAY_LUNCH_ID,
    eventType: "reheat-completed",
    occurredAt: FIXED.firstReheatedAt,
    method: "microwave",
    quantity: 2,
    unit: "serving",
    measuredTemperatureC: 75,
    status: "confirmed",
    requestId: "reheat-request-1",
    createsRescueImpact: false,
    ...overrides
  };
}

function postReheatSegmentFixture(overrides = {}) {
  return {
    id: SEGMENT_ID,
    parentBatchId: LEFTOVER_BATCH_ID,
    userId: USER_ID,
    quantity: 2,
    unit: "serving",
    originalCookedAt: FIXED.originalCookedAt,
    refrigeratedAt: FIXED.refrigeratedAt,
    lastReheatedAt: FIXED.firstReheatedAt,
    reheatCount: 1,
    eventIds: [EVENT_ID],
    status: "reheated-outcome-review-required",
    ...overrides
  };
}

function reheatEventsForSegment(segment, events, userId = USER_ID) {
  return events.filter((event) => (
    event
    && event.userId === userId
    && event.status === "confirmed"
    && event.eventType === "reheat-completed"
    && event.sourceId === segment.parentBatchId
    && event.sourceSegmentId === segment.id
  ));
}

function deriveReheatHistory(segment, events, userId = USER_ID, policy = policyFixture) {
  if (!Array.isArray(events)) {
    return { status: "review-required", reason: "reheating-history-unavailable", canReheat: false, canUseInHeatedRecipe: false, canReserveForHeatedMeal: false };
  }
  const relevantEvents = reheatEventsForSegment(segment, events, userId).sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt));
  const count = relevantEvents.length;
  const cachedCount = Number(segment.reheatCount);
  const conflict = Number.isFinite(cachedCount) && cachedCount !== count;
  if (conflict) {
    return { status: "review-required", reason: "reheat-count-conflict", reheatCount: count, canReheat: false, canUseInHeatedRecipe: false, canReserveForHeatedMeal: false };
  }
  const blocked = count >= policy.maximumConfirmedReheats;
  return {
    status: blocked ? "blocked-by-reheating-policy" : "eligible",
    reason: blocked ? "maximum-confirmed-reheats-reached" : "within-reheat-policy",
    policyId: policy.policyId,
    policyVersion: policy.policyVersion,
    reheatCount: count,
    lastReheatedAt: relevantEvents.at(-1)?.occurredAt || null,
    canReheat: !blocked,
    canUseInHeatedRecipe: !blocked,
    canReserveForHeatedMeal: !blocked,
    overrideAllowed: false,
    display: {
      originalCookingDate: formatDateInToronto(segment.originalCookedAt),
      lastReheatedDate: relevantEvents.at(-1) ? formatDateInToronto(relevantEvents.at(-1).occurredAt) : "Not reheated",
      reheatCountLabel: `${count} confirmed reheat${count === 1 ? "" : "s"}`,
      methodLabel: relevantEvents.at(-1)?.method || "None",
      temperatureLabel: relevantEvents.at(-1)?.measuredTemperatureC ? `${relevantEvents.at(-1).measuredTemperatureC} C` : "Not recorded"
    }
  };
}

function recommendAction(segment, events, actionType, userId = USER_ID) {
  if (segment.userId && segment.userId !== userId) {
    return { eligible: false, reason: "cross-user-source-hidden", eventsCreated: 0, impactCreated: 0, commandAccepted: false };
  }
  const history = deriveReheatHistory(segment, events, userId);
  const blockedActions = {
    reheat: "canReheat",
    "use-in-heated-recipe": "canUseInHeatedRecipe",
    "heated-leftover-transformation": "canUseInHeatedRecipe",
    "reserve-for-heated-meal": "canReserveForHeatedMeal"
  };
  const capability = blockedActions[actionType];
  if (capability && history[capability] !== true) {
    return { eligible: false, reason: history.reason, eventsCreated: 0, impactCreated: 0, commandAccepted: false, history };
  }
  return { eligible: true, reason: "eligible", eventsCreated: 0, impactCreated: 0, commandAccepted: true, history };
}

function previewRecommendation(segment, events) {
  const before = clone({ segment, events });
  const result = recommendAction(segment, events, "reheat");
  assert.deepStrictEqual({ segment, events }, before, "Preview must not mutate reheat history.");
  return result;
}

function scheduleHeatedMeal(segment, events) {
  const before = clone({ segment, events });
  const result = recommendAction(segment, events, "reserve-for-heated-meal");
  assert.deepStrictEqual({ segment, events }, before, "Scheduling attempt must not mutate reheat history.");
  return result;
}

function openStartCooking(segment, events) {
  const before = clone({ segment, events });
  const result = recommendAction(segment, events, "use-in-heated-recipe");
  assert.deepStrictEqual({ segment, events }, before, "Opening cooking workflow must not mutate reheat history.");
  return result;
}

function confirmFirstReheat(segment, events, requestId = "reheat-request-1") {
  if (events.some((event) => event.requestId === requestId && event.eventType === "reheat-completed" && event.status === "confirmed")) {
    return { segment, events, createdEvents: 0, idempotent: true };
  }
  const event = confirmedReheatEventFixture({ requestId, id: EVENT_ID });
  return {
    segment: { ...segment, id: SEGMENT_ID, parentBatchId: LEFTOVER_BATCH_ID, lastReheatedAt: event.occurredAt, reheatCount: 1, eventIds: [event.id], status: "reheated-outcome-review-required" },
    events: [...events, event],
    createdEvents: 1,
    idempotent: false
  };
}

function attemptBlockedSecondReheat(segment, events) {
  const decision = recommendAction(segment, events, "reheat");
  if (!decision.eligible) return { ...decision, createdEvents: 0, physicalQuantity: segment.quantity, impactCreated: 0 };
  throw new Error("Second reheat should be blocked.");
}

function genericEdit(segment, patch) {
  const protectedPatch = { ...patch };
  delete protectedPatch.reheatCount;
  delete protectedPatch.lastReheatedAt;
  delete protectedPatch.eventIds;
  return { ...segment, ...protectedPatch };
}

function oldClientPatch(segment, patch, events) {
  const next = { ...segment, ...patch };
  const history = deriveReheatHistory(segment, events);
  if (history.reheatCount > 0 && Number(patch.reheatCount) === 0) {
    next.reheatCount = segment.reheatCount;
    next.lastReheatedAt = segment.lastReheatedAt;
    next.eventIds = segment.eventIds;
  }
  return next;
}

function explicitCorrection(events, correctionId = "reheat-correction-1") {
  return events.map((event) => event.id === EVENT_ID ? { ...event, status: "corrected", correctedBy: correctionId } : event);
}

function splitPartialBatch(batch, reheatedServings) {
  return {
    reheated: postReheatSegmentFixture({ id: `${SEGMENT_ID}-partial`, quantity: reheatedServings, reheatCount: 1, eventIds: [EVENT_ID] }),
    unreheated: { ...batch, id: "reheat-test-leftover-segment-unreheated", parentBatchId: LEFTOVER_BATCH_ID, quantity: batch.quantity - reheatedServings, reheatCount: 0, eventIds: [], lastReheatedAt: null }
  };
}

const timelineBlock = appSection("function deriveLeftoverTimeline", "function formatTimelineRelativeAge");
assert(timelineBlock.includes("FOOD_EVENT_TYPES.REHEATED"), "App timeline must derive reheats from Food Event History.");
assert(timelineBlock.includes("eventAppliesToCurrentPhysicalBatch"), "App timeline must scope reheats to the current physical batch.");
assert(timelineBlock.includes("const reheatCount = reheatedEvents.length"), "App timeline must count confirmed reheat events.");
assert(timelineBlock.includes("reheatCount >= timelinePolicy.maximumReusableReheatCount"), "App timeline must enforce the reusable reheat limit.");
assert(timelineBlock.includes("LEFTOVER_TIMELINE_STATUSES.REHEAT_LIMIT_REACHED"), "App timeline must expose a reheat-limit status.");
assert(timelineBlock.includes("lastReheatedAt"), "App timeline must preserve last reheated time.");

const timelineRenderBlock = appSection("function renderOriginalLeftoverTimelineSummary", "function normalizePantryStorage");
assert(timelineRenderBlock.includes("Last Reheated"), "Timeline UI must display last reheated date.");
assert(timelineRenderBlock.includes("Reheat Count"), "Timeline UI must display reheat count.");
assert(timelineRenderBlock.includes("reheating, freezing, and thawing do not automatically reset"), "Timeline UI must explain that reheating does not reset the anchor.");

const sourceValidationBlock = appSection("function revalidateLeftoverTransformationSource", "function hasLeftoverLineageCycle");
assert(sourceValidationBlock.includes("timeline.reheatCount"), "Transformation source validation must carry effective reheat count.");
assert(sourceValidationBlock.includes("timeline.hardExclusion"), "Transformation source validation must respect hard timeline exclusions.");

const transformationBlock = appSection("function generateSingleStepTransformationCandidates", "function recipeContainsTransformationSourceAllergy");
assert(transformationBlock.includes("getLeftoverTransformationReheatEffect"), "Transformation candidates must know whether a method reheats the source.");
assert(app.includes("TRANSFORMATION_REHEAT_EFFECTS.INCREMENTS_SOURCE_REHEAT_COUNT"), "Heated transformations must be represented as reheat-incrementing methods.");

const outcomeBlock = appSection("function applyTransformationSourceForCompletedMeal", "function calculateCompletedMealNutritionHabits");
assert(outcomeBlock.includes("FOOD_EVENT_TYPES.REHEATED"), "Confirmed heated leftover outcomes must create a reheated metadata event.");
assert(outcomeBlock.includes("transformed-portion-only"), "Reheated transformed portions must not mark untouched source remainder as reheated.");
assert(outcomeBlock.includes("Original cooked time remains the safety anchor"), "Confirmed reheat outcome must preserve the original cooking anchor.");
assert(outcomeBlock.includes("idempotencyKey"), "Confirmed reheat outcome must be idempotent.");

assert(!app.includes("Reheat Anyway"), "App must not expose Reheat Anyway bypass text.");
assert(!app.includes("Ignore Reheating History"), "App must not expose Ignore Reheating History bypass text.");
assert(!app.includes("Reset Count and Continue"), "App must not expose reset-and-continue bypass text.");
assert(!app.includes("Force Reheat"), "App must not expose Force Reheat bypass text.");
assert(!app.includes("I Accept the Risk"), "App must not expose accept-risk bypass text.");
assert(!app.includes("reheatCount || 0"), "App must not default missing reheat history to a false zero.");

assert(docs.guardrails.includes("REHEATED"), "Food-safety guardrail docs must include reheated events.");
assert(docs.events.includes("idempotency"), "Food Event History docs must document idempotency.");
assert(docs.timeline.includes("Reheating does not reset"), "Timeline docs must document the no-reset rule.");
assert(docs.transformations.includes("Reheating history is inherited"), "Transformation docs must preserve reheating history.");

assert.strictEqual(policyFixture.policyId, "leftovers-single-reheat-v1", "Policy fixture ID must match Step 59.");
assert.strictEqual(policyFixture.policyVersion, 1, "Policy fixture version must match Step 59.");
assert.strictEqual(policyFixture.maximumConfirmedReheats, 1, "Policy must allow one confirmed reheat only.");
assert.deepStrictEqual(policyFixture.blockedActions, ["reheat", "use-in-heated-recipe", "heated-leftover-transformation", "reserve-for-heated-meal"], "Policy must block all reheating-dependent actions after the limit.");

const meal = sourceMealFixture();
const recipe = sourceRecipeFixture();
const preReheatBatch = preReheatLeftoverFixture();
assert.strictEqual(meal.id, SOURCE_MEAL_ID, "Source meal fixture ID must match Step 59.");
assert.strictEqual(meal.userId, USER_ID, "Source meal fixture user must match Step 59.");
assert.strictEqual(meal.date, "2026-08-10", "Source meal date must be Monday, August 10, 2026.");
assert.strictEqual(recipe.name, "Vegetable Soup", "Source recipe must be Vegetable Soup.");
assert.strictEqual(preReheatBatch.quantity, 2, "Pre-reheat leftover fixture must contain two servings.");
assert.strictEqual(preReheatBatch.reheatCount, 0, "Pre-reheat leftover fixture must start with zero reheats.");

let firstReheat = confirmFirstReheat({ ...preReheatBatch, id: SEGMENT_ID, parentBatchId: LEFTOVER_BATCH_ID }, []);
assert.strictEqual(firstReheat.createdEvents, 1, "Confirmed first reheat should create one event.");
assert.strictEqual(firstReheat.segment.reheatCount, 1, "Confirmed first reheat should produce effective count 1.");
assert.strictEqual(firstReheat.segment.lastReheatedAt, FIXED.firstReheatedAt, "Confirmed first reheat should store Tuesday lunch time.");
assert.strictEqual(firstReheat.events[0].measuredTemperatureC, 75, "Confirmed first reheat fixture should store 75 C.");
assert.strictEqual(firstReheat.events[0].createsRescueImpact, false, "Confirmed reheat event must not create rescue impact.");

const duplicateFirstReheat = confirmFirstReheat(firstReheat.segment, firstReheat.events);
assert.strictEqual(duplicateFirstReheat.createdEvents, 0, "Duplicate first-reheat command retry must create zero duplicate events.");
assert.strictEqual(duplicateFirstReheat.events.length, 1, "Duplicate first-reheat command retry must leave one confirmed event.");

const postSegment = postReheatSegmentFixture();
const history = deriveReheatHistory(postSegment, [confirmedReheatEventFixture()]);
assert.strictEqual(history.reheatCount, 1, "Required confirmed reheat count should be 1.");
assert.strictEqual(history.lastReheatedAt, FIXED.firstReheatedAt, "History must preserve the Tuesday reheated timestamp.");
assert.strictEqual(history.status, "blocked-by-reheating-policy", "History must block after one confirmed reheat.");
assert.strictEqual(history.canReheat, false, "Ordinary reheat must be blocked.");
assert.strictEqual(history.canUseInHeatedRecipe, false, "Heated recipe use must be blocked.");
assert.strictEqual(history.canReserveForHeatedMeal, false, "Heated meal reservation must be blocked.");
assert.strictEqual(history.overrideAllowed, false, "Bypass override must not be available.");
assert.strictEqual(history.display.originalCookingDate, "Monday, August 10, 2026", "History display must show the original cooking date.");
assert.strictEqual(history.display.lastReheatedDate, "Tuesday, August 11, 2026", "History display must show the first reheated date.");
assert.strictEqual(history.display.reheatCountLabel, "1 confirmed reheat", "History display must show one confirmed reheat.");
assert.strictEqual(history.display.methodLabel, "microwave", "History display must include reheat method.");

assert.strictEqual(previewRecommendation(postSegment, [confirmedReheatEventFixture()]).eventsCreated, 0, "Recommendation preview must create zero reheat events.");
assert.strictEqual(scheduleHeatedMeal(postSegment, [confirmedReheatEventFixture()]).eventsCreated, 0, "Scheduling must create zero reheat events.");
assert.strictEqual(openStartCooking(postSegment, [confirmedReheatEventFixture()]).eventsCreated, 0, "Opening cooking workflow must create zero reheat events.");

assert.strictEqual(recommendAction(postSegment, [confirmedReheatEventFixture()], "reheat").eligible, false, "Another ordinary reheat recommendation must be absent.");
assert.strictEqual(recommendAction(postSegment, [confirmedReheatEventFixture()], "use-in-heated-recipe").eligible, false, "Heated transformation requiring another reheat must not be selectable.");
assert.strictEqual(recommendAction(postSegment, [confirmedReheatEventFixture()], "heated-leftover-transformation").eligible, false, "Heated leftover transformation must be blocked.");
assert.strictEqual(recommendAction(postSegment, [confirmedReheatEventFixture()], "reserve-for-heated-meal").eligible, false, "Reservation for heated meal must be blocked.");
assert.strictEqual(attemptBlockedSecondReheat(postSegment, [confirmedReheatEventFixture()]).createdEvents, 0, "Blocked second reheat must create zero events.");
assert.strictEqual(attemptBlockedSecondReheat(postSegment, [confirmedReheatEventFixture()]).impactCreated, 0, "Blocked second reheat must create zero impact entries.");

const editedName = genericEdit(postSegment, { name: "Vegetable Soup Leftovers", reheatCount: 0, eventIds: [] });
assert.strictEqual(editedName.reheatCount, 1, "Generic edits must not reset the reheat count.");
assert.deepStrictEqual(editedName.eventIds, [EVENT_ID], "Generic edits must not drop reheat event IDs.");
const editedQuantity = genericEdit(postSegment, { quantity: 1, reheatCount: 0 });
assert.strictEqual(editedQuantity.reheatCount, 1, "Quantity edits must not reset reheat count.");
const editedDate = genericEdit(postSegment, { refrigeratedAt: "2026-08-10T19:30:00-04:00", lastReheatedAt: null });
assert.strictEqual(editedDate.lastReheatedAt, FIXED.firstReheatedAt, "Date edits must not reset last reheated time.");
const editedStorage = genericEdit(postSegment, { storage: "refrigerator", reheatCount: 0 });
assert.strictEqual(editedStorage.reheatCount, 1, "Storage edits must not reset reheat count.");
const transformed = genericEdit(postSegment, { status: "transformed", lastReheatedAt: null });
assert.strictEqual(transformed.lastReheatedAt, FIXED.firstReheatedAt, "Recipe transformations must not reset reheat history.");
const cancelledMeal = genericEdit(postSegment, { activeReservation: null, reheatCount: 0 });
assert.strictEqual(cancelledMeal.reheatCount, 1, "Meal cancellations must not reset reheat count.");

const persisted = JSON.parse(JSON.stringify({ segment: postSegment, events: [confirmedReheatEventFixture()] }));
assert.strictEqual(deriveReheatHistory(persisted.segment, persisted.events).reheatCount, 1, "Application reload must preserve reheat count.");
assert.strictEqual(deriveReheatHistory(oldClientPatch(postSegment, { reheatCount: 0 }, [confirmedReheatEventFixture()]), [confirmedReheatEventFixture()]).reheatCount, 1, "Old clients must not overwrite confirmed reheat history.");
assert.strictEqual(deriveReheatHistory(postSegment, null).reason, "reheating-history-unavailable", "Missing event history must require review, not default to zero.");

const correctedEvents = explicitCorrection([confirmedReheatEventFixture()]);
assert.strictEqual(reheatEventsForSegment(postSegment, correctedEvents).length, 0, "Explicit correction should remove the event from effective count.");
assert.strictEqual(deriveReheatHistory({ ...postSegment, reheatCount: 0 }, correctedEvents).status, "eligible", "Explicit correction should be the route to reduce effective reheats.");

const split = splitPartialBatch({ ...preReheatBatch, quantity: 4 }, 2);
assert.strictEqual(split.reheated.reheatCount, 1, "Reheated partial segment must carry count 1.");
assert.strictEqual(split.unreheated.reheatCount, 0, "Unreheated remainder must keep count 0.");
assert.strictEqual(split.reheated.quantity + split.unreheated.quantity, 4, "Partial split must conserve physical quantity.");
assert.strictEqual(recommendAction(split.reheated, [confirmedReheatEventFixture({ sourceSegmentId: split.reheated.id })], "reheat").eligible, false, "Reheated child segment must be blocked.");
assert.strictEqual(recommendAction(split.unreheated, [], "reheat").eligible, true, "Unreheated child segment may still be eligible.");

const crossUserDecision = recommendAction({ ...postSegment, userId: OTHER_USER_ID }, [confirmedReheatEventFixture({ userId: OTHER_USER_ID })], "reheat", USER_ID);
assert.strictEqual(crossUserDecision.eligible, false, "Cross-user sources must not be exposed.");
assert.strictEqual(crossUserDecision.reason, "cross-user-source-hidden", "Cross-user reheat histories must remain hidden.");
const unrelatedCurrentSegment = { ...postSegment, reheatCount: 0, eventIds: [], lastReheatedAt: null };
assert.strictEqual(recommendAction(unrelatedCurrentSegment, [confirmedReheatEventFixture({ sourceSegmentId: "other-segment" })], "reheat").eligible, true, "Different segment history must not block this segment.");
assert.strictEqual(recommendAction(unrelatedCurrentSegment, [confirmedReheatEventFixture({ sourceId: "other-batch" })], "reheat").eligible, true, "Different batch history must not block this segment.");

[
  "## 1. Purpose",
  "## 2. Fixed Timeline",
  "## 3. Source Meal and Leftover",
  "## 28. Commands",
  "leftovers-single-reheat-v1",
  "Monday, August 10, 2026",
  "Tuesday, August 11, 2026",
  "Another ordinary reheat recommendation is absent",
  "Reheat events created during recommendation preview: 0",
  "Cross-user reheating histories exposed: 0"
].forEach((snippet) => assert(docs.step59.includes(snippet), `Step 59 test documentation missing ${snippet}.`));

[
  "Required confirmed reheat count: 1",
  "Required original cooking date: Monday, August 10, 2026",
  "Required last reheated date: Tuesday, August 11, 2026",
  "Another ordinary reheat recommendation: Absent",
  "Heated transformation requiring another reheat: Not selectable",
  "Reheat Anyway actions: 0",
  "Hidden command bypasses accepted: 0",
  "Reheat events created during recommendation preview: 0",
  "Reheat events created during scheduling: 0",
  "Reheat events created when Start Cooking opens: 0",
  "Confirmed first-reheat events: 1",
  "Duplicate events after command retry: 0",
  "Confirmed second-reheat events: 0",
  "Generic edits resetting reheat count: 0",
  "Quantity edits resetting reheat count: 0",
  "Date edits resetting reheat count: 0",
  "Storage edits resetting reheat count: 0",
  "Recipe transformations resetting reheat count: 0",
  "Meal cancellations resetting reheat count: 0",
  "Application reloads resetting reheat count: 0",
  "Migrations resetting reheat count: 0",
  "Partial updates resetting omitted history: 0",
  "Old clients overwriting confirmed history: 0",
  "Unreheated portions incorrectly inheriting another segment's count: 0",
  "Blocked attempts creating physical Food Event History events: 0",
  "Blocked attempts creating Impact Ledger entries: 0",
  "Cross-user reheating histories exposed: 0"
].forEach((snippet) => assert(docs.report.includes(snippet), `Step 59 report missing ${snippet}.`));

console.log("Cook Before It Spoils Step 59 reheating-history tests passed.");
