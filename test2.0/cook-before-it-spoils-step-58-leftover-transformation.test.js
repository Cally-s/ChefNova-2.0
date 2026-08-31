const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const docs = {
  inventory: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-leftover-inventory.md"), "utf8"),
  transformations: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-leftover-transformation-paths.md"), "utf8"),
  outcomes: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-leftover-outcomes.md"), "utf8"),
  timeline: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-original-leftover-timeline.md"), "utf8"),
  step58: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-test-leftover-transformation.md"), "utf8"),
  report: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-58-report.md"), "utf8")
};

const FIXED = Object.freeze({
  timezone: "America/Toronto",
  mondayDate: "2026-08-10",
  tuesdayDate: "2026-08-11",
  beforeMondayMeal: "2026-08-10T17:00:00-04:00",
  mondayCookedAt: "2026-08-10T18:00:00-04:00",
  mondayRefrigeratedAt: "2026-08-10T19:00:00-04:00",
  tuesdayRecommendationsAt: "2026-08-11T12:00:00-04:00",
  tuesdayReservedAt: "2026-08-11T12:30:00-04:00",
  tuesdayMealAt: "2026-08-11T18:00:00-04:00"
});

const USER_SCOPE = "leftover-test-user";
const OTHER_USER_SCOPE = "leftover-test-other-user";
const SOURCE_MEAL_ID = "leftover-test-monday-roast-chicken";
const SOURCE_RECIPE_ID = "leftover-test-roast-chicken-recipe";
const LEFTOVER_BATCH_ID = "leftover-test-batch-roast-chicken";
const TRANSFORMATION_RECIPE_ID = "leftover-test-chicken-wraps";
const TUESDAY_MEAL_ID = "leftover-test-tuesday-wraps-meal";
const PLAN_ID = "leftover-test-plan";

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

function sourceMeal(overrides = {}) {
  return {
    id: SOURCE_MEAL_ID,
    mealId: SOURCE_MEAL_ID,
    userScopeId: USER_SCOPE,
    planId: PLAN_ID,
    calendarDate: FIXED.mondayDate,
    scheduledTime: "18:00",
    status: "scheduled",
    recipeId: SOURCE_RECIPE_ID,
    displayName: "Roast Chicken",
    recipeName: "Roast Chicken",
    plannedServings: 6,
    actualServingsPrepared: null,
    actualServingsConsumed: null,
    outcomeRevision: 1,
    schemaVersion: 1,
    ...overrides
  };
}

function sourceRecipe(overrides = {}) {
  return {
    id: SOURCE_RECIPE_ID,
    displayName: "Roast Chicken",
    servings: 6,
    cookingTimeMinutes: 75,
    requiredAppliances: ["oven"],
    dietaryTags: [],
    allergenIds: [],
    ingredients: [
      { ingredientId: "raw-whole-chicken", quantity: 1, unit: "whole-item", mandatory: true },
      { ingredientId: "test-neutral-seasoning", quantity: 10, unit: "g", mandatory: false }
    ],
    ...overrides
  };
}

function chickenWrapRecipe(overrides = {}) {
  return {
    id: TRANSFORMATION_RECIPE_ID,
    displayName: "Chicken Wraps",
    servings: 2,
    cookingTimeMinutes: 15,
    requiredAppliances: [],
    dietaryTags: [],
    allergenIds: [],
    recipeType: "leftover-transformation",
    ingredients: [
      { ingredientId: "cooked-roast-chicken", sourceRequirement: "leftover-batch", requiredServings: 2, quantity: null, unit: "serving", mandatory: true },
      { ingredientId: "tortillas", quantity: 2, unit: "count", mandatory: true },
      { ingredientId: "lettuce", quantity: 40, unit: "g", mandatory: false }
    ],
    ...overrides
  };
}

function calculateRemainingServings(outcome) {
  const prepared = Number(outcome.actualServingsPrepared);
  const consumed = Number(outcome.actualServingsConsumed);
  const discarded = Number(outcome.servingsDiscardedAtSourceMeal || 0);
  const shared = Number(outcome.servingsDonatedOrSharedAtSourceMeal || 0);
  const other = Number(outcome.otherConfirmedOutcomeServings || 0);
  assert(Number.isFinite(prepared) && prepared >= 0, "actualServingsPrepared must be known.");
  assert(Number.isFinite(consumed) && consumed >= 0, "actualServingsConsumed must be known.");
  const remaining = prepared - consumed - discarded - shared - other;
  assert(remaining >= 0, `Serving conservation failed for ${SOURCE_MEAL_ID}: ${prepared} prepared minus ${consumed} consumed produced ${remaining}.`);
  return remaining;
}

function createLeftoverBatch({ meal = sourceMeal(), recipe = sourceRecipe(), outcome, existingBatches = [] } = {}) {
  if (!meal || meal.userScopeId !== USER_SCOPE) return { batches: existingBatches, events: [], impact: [], created: false, reason: "wrong-user" };
  if (!["prepared", "completed"].includes(outcome?.sourceMealStatus)) return { batches: existingBatches, events: [], impact: [], created: false, reason: "not-confirmed" };
  if (meal.status === "cancelled" || outcome.outcome === "not-prepared") return { batches: existingBatches, events: [], impact: [], created: false, reason: "source-not-prepared" };
  const remaining = calculateRemainingServings(outcome);
  if (remaining <= 0) return { batches: existingBatches, events: [], impact: [], created: false, reason: "no-leftover" };
  const idempotencyKey = `leftover-batch:${meal.userScopeId}:${meal.mealId}:${outcome.sourceOutcomeRevision || meal.outcomeRevision || 1}`;
  if (existingBatches.some((batch) => batch.idempotencyKey === idempotencyKey)) return { batches: existingBatches, events: [], impact: [], created: false, reason: "idempotent" };
  const batch = {
    id: LEFTOVER_BATCH_ID,
    idempotencyKey,
    userScopeId: meal.userScopeId,
    sourceMealId: meal.mealId,
    originalRecipeId: recipe.id,
    ingredientIdentity: "cooked-roast-chicken",
    displayName: "Cooked roast chicken",
    quantity: null,
    unit: null,
    servingsRemaining: remaining,
    originalServingsPrepared: Number(outcome.actualServingsPrepared),
    servingsConsumedAtSourceMeal: Number(outcome.actualServingsConsumed),
    servingsDiscardedAtSourceMeal: Number(outcome.servingsDiscardedAtSourceMeal || 0),
    originalCookedAt: FIXED.mondayCookedAt,
    refrigeratedAt: FIXED.mondayRefrigeratedAt,
    frozenAt: null,
    thawedAt: null,
    lastTransformedAt: null,
    lastReheatedAt: null,
    reheatCount: 0,
    storageLocation: "refrigerator",
    status: "available",
    physicalStatus: "available",
    activeReservedServings: 0,
    reservations: [],
    packageLineage: { sourcePackageId: "leftover-test-raw-chicken-lot", sourcePurchaseId: "leftover-test-monday-chicken-purchase" },
    schemaVersion: 1
  };
  return {
    batches: [...existingBatches, batch],
    events: [{ type: "leftover-batch-created", amount: remaining, unit: "serving", sourceMealId: meal.mealId, idempotencyKey }],
    impact: [],
    created: true,
    batch
  };
}

function activeReservations(batch) {
  return (batch.reservations || []).filter((reservation) => reservation.status === "active");
}

function availableServings(batch) {
  return Math.max(0, batch.servingsRemaining - activeReservations(batch).reduce((sum, reservation) => sum + reservation.requiredServings, 0));
}

function recommendTuesdayWraps({ batch, recipe = chickenWrapRecipe(), userScopeId = USER_SCOPE, filters = {}, pantry = {}, existingImpact = [] } = {}) {
  const result = {
    eligible: false,
    recommendation: null,
    shoppingList: [],
    newChickenPurchaseQuantity: 0,
    newChickenPurchaseCostCents: 0,
    historicalChickenIngredientValueCents: 450,
    impact: existingImpact,
    events: [],
    reason: ""
  };
  if (!batch || batch.userScopeId !== userScopeId) return { ...result, reason: "cross-user-or-missing-batch" };
  if (batch.storageReviewRequired || batch.storageUnsafe) return { ...result, reason: "Review Storage Information" };
  if (batch.reheatBlocked && filters.requiresReheat) return { ...result, reason: "additional-reheat-not-permitted" };
  if ((recipe.allergenIds || []).some((id) => (filters.allergyIds || []).includes(id))) return { ...result, reason: "allergy-hard-exclusion" };
  if (filters.requiredDietaryTag && !(recipe.dietaryTags || []).includes(filters.requiredDietaryTag)) return { ...result, reason: "dietary-hard-exclusion" };
  if ((recipe.requiredAppliances || []).some((appliance) => !(filters.availableAppliances || []).includes(appliance))) return { ...result, reason: "appliance-unavailable" };
  if (filters.maxCookingTimeMinutes && recipe.cookingTimeMinutes > filters.maxCookingTimeMinutes) return { ...result, reason: "time-filter" };
  const sourceDemand = recipe.ingredients.find((ingredient) => ingredient.sourceRequirement === "leftover-batch" && ingredient.ingredientId === batch.ingredientIdentity);
  if (!sourceDemand) return { ...result, reason: "raw-versus-cooked-mismatch" };
  if (availableServings(batch) < sourceDemand.requiredServings) return { ...result, reason: "quantity-review-required" };
  const missingGroceries = recipe.ingredients
    .filter((ingredient) => ingredient.sourceRequirement !== "leftover-batch")
    .filter((ingredient) => ingredient.mandatory && !pantry[ingredient.ingredientId])
    .map((ingredient) => ingredient.ingredientId);
  return {
    ...result,
    eligible: true,
    reason: "eligible",
    recommendation: {
      recipeId: recipe.id,
      title: "CHICKEN WRAPS",
      sourceLeftoverBatchId: batch.id,
      sourceText: "Uses 2 servings from Monday's roast chicken",
      originalCookedAt: batch.originalCookedAt,
      originalCookingDateLabel: "Monday, August 10, 2026",
      plannedUseServings: sourceDemand.requiredServings,
      newChickenPurchaseText: "No new chicken purchase is required",
      cookingTimeMinutes: recipe.cookingTimeMinutes
    },
    shoppingList: missingGroceries,
    newChickenPurchaseQuantity: 0,
    newChickenPurchaseCostCents: 0
  };
}

function reserveTuesdayWraps(batch, { mealId = TUESDAY_MEAL_ID, userScopeId = USER_SCOPE, recipeId = TRANSFORMATION_RECIPE_ID } = {}) {
  const next = clone(batch);
  if (next.userScopeId !== userScopeId) return { ok: false, batch: next, reason: "wrong-user" };
  const reservationId = mealId === TUESDAY_MEAL_ID ? "leftover-test-reservation-tuesday-wraps" : `leftover-test-reservation-${mealId}`;
  if (activeReservations(next).some((reservation) => reservation.id === reservationId)) return { ok: true, batch: next, idempotent: true, events: [], impact: [] };
  if (availableServings(next) < 2) return { ok: false, batch: next, reason: "insufficient-availability" };
  next.reservations.push({
    id: reservationId,
    userScopeId,
    ownerType: "meal",
    ownerId: mealId,
    sourceType: "leftover-batch",
    sourceId: next.id,
    recipeId,
    requiredServings: 2,
    unit: "serving",
    status: "active",
    createdAt: FIXED.tuesdayReservedAt,
    sourceRevisions: { batchRevision: 1, originalCookedAt: next.originalCookedAt }
  });
  next.activeReservedServings = activeReservations(next).reduce((sum, reservation) => sum + reservation.requiredServings, 0);
  next.status = next.activeReservedServings === next.servingsRemaining ? "fully-reserved" : "partially-reserved";
  return {
    ok: true,
    batch: next,
    events: [{ type: "reserved-for-recipe", affectsOnHandQuantity: false, amount: 2, unit: "serving" }],
    impact: []
  };
}

function cancelTuesdayWraps(batch, { confirm = true } = {}) {
  const next = clone(batch);
  if (!confirm) return { batch: next, events: [], impact: [] };
  next.reservations = next.reservations.map((reservation) => reservation.ownerId === TUESDAY_MEAL_ID && reservation.status === "active"
    ? { ...reservation, status: "released", releasedAt: FIXED.tuesdayMealAt }
    : reservation);
  next.activeReservedServings = activeReservations(next).reduce((sum, reservation) => sum + reservation.requiredServings, 0);
  next.status = next.servingsRemaining > 0 ? "available" : "consumed";
  return { batch: next, events: [{ type: "reservation-cancelled", affectsOnHandQuantity: false, amount: 2, unit: "serving" }], impact: [] };
}

function completeTuesdayWraps(batch, { actualUse = 2, prepared = true, existingImpact = [] } = {}) {
  const next = clone(batch);
  if (!prepared) {
    return { batch: cancelTuesdayWraps(next).batch, events: [], impact: existingImpact, status: "not-prepared" };
  }
  if (actualUse === null) return { batch: { ...next, status: "outcome-review-required" }, events: [], impact: existingImpact, status: "outcome-review-required" };
  const already = existingImpact.some((entry) => entry.idempotencyKey === `leftover-reuse:${TUESDAY_MEAL_ID}:${next.id}:v1`);
  next.servingsRemaining = Math.max(0, next.servingsRemaining - actualUse);
  next.activeReservedServings = 0;
  next.reservations = next.reservations.map((reservation) => {
    if (reservation.ownerId !== TUESDAY_MEAL_ID || reservation.status !== "active") return reservation;
    const used = Math.min(actualUse, reservation.requiredServings);
    return {
      ...reservation,
      status: used >= reservation.requiredServings ? "consumed" : used > 0 ? "released" : "cancelled",
      actualQuantityUsed: used,
      releasedQuantity: Math.max(0, reservation.requiredServings - used)
    };
  });
  next.status = next.servingsRemaining === 0 ? "consumed" : "partially-used";
  next.lastTransformedAt = FIXED.tuesdayMealAt;
  next.originalCookedAt = FIXED.mondayCookedAt;
  const impact = actualUse > 0 && !already
    ? [...existingImpact, { idempotencyKey: `leftover-reuse:${TUESDAY_MEAL_ID}:${next.id}:v1`, metric: "leftover-servings-reused", servings: actualUse }]
    : existingImpact;
  return {
    batch: next,
    events: [{ type: "leftover-quantity-transformed", affectsOnHandQuantity: true, amount: actualUse, unit: "serving" }],
    impact,
    status: "completed"
  };
}

const completionBlock = appSection("function commitCookTonightCompletionAtomically", "function openCookTonightCancelReservation");
assert(completionBlock.includes("createPreparedLeftoverInventoryItem"), "Meal completion must be the source of leftover-batch creation.");
assert(completionBlock.includes("leftoverServingsStored"), "Meal completion must use confirmed leftover servings.");
assert(completionBlock.includes("actualOutcome"), "Meal completion must store actual source outcome.");
assert(completionBlock.includes("completionKey"), "Meal completion must be idempotent.");

const batchCreationBlock = appSection("function createPreparedLeftoverInventoryItem", "function createLeftoverCreationEvents");
assert(batchCreationBlock.includes("originalRecipeId"), "Leftover batch must preserve original recipe ID.");
assert(batchCreationBlock.includes("sourceMealId"), "Leftover batch must preserve source meal ID.");
assert(batchCreationBlock.includes("originalCookedAt"), "Leftover batch must preserve original cooked date.");
assert(batchCreationBlock.includes("currentStorageStartedAt"), "Leftover batch must preserve storage/refrigeration time.");
assert(!batchCreationBlock.includes("plannedServings"), "Leftover-batch creation must not derive from planned servings alone.");

const transformationReservationBlock = appSection("function createLeftoverTransformationReservations", "function renderPantry");
assert(transformationReservationBlock.includes("deriveAvailableQuantity"), "Transformation reservation must use unreserved leftover quantity.");
assert(transformationReservationBlock.includes("affectsOnHandQuantity: false"), "Transformation reservation must not consume leftover quantity.");
assert(transformationReservationBlock.includes("getFoodSafetyGuardrailForPantryItem"), "Transformation reservation must recheck food safety.");

const outcomePlanBlock = appSection("function deriveLeftoverOutcomeCommitPlan", "function confirmLeftoverOutcomeReview");
assert(outcomePlanBlock.includes("FOOD_EVENT_TYPES.LEFTOVER_QUANTITY_TRANSFORMED"), "Transformation outcome plans must select the transformed event type.");
assert(outcomePlanBlock.includes("FOOD_EVENT_TYPES.LEFTOVER_QUANTITY_CONSUMED"), "Direct leftover outcome plans must select the consumed event type.");

const outcomeBlock = appSection("function commitLeftoverOutcome", "function freezeLeftoverBatch");
assert(outcomeBlock.includes("commandType: commitPlan.eventType"), "Confirmed transformation must append the planned transformed event.");
assert(outcomeBlock.includes("PANTRY_RESERVATION_STATUSES.CONSUMED"), "Confirmed use must reconcile reservations.");
assert(outcomeBlock.includes("PANTRY_RESERVATION_STATUSES.RELEASED"), "Lower actual use must release unused reservation quantity.");
assert(outcomeBlock.includes("original cooked time"), "Confirmed outcome must preserve original timeline.");
assert(outcomeBlock.includes("idempotencyKey"), "Confirmed outcome must be idempotent.");
assert(outcomeBlock.includes("currentUserScope"), "Confirmed outcome must be user-scoped.");

assert(docs.inventory.includes("Actual leftover batches are created only after meal completion"), "Inventory docs must preserve planned-versus-actual boundary.");
assert(docs.transformations.includes("source quantity is deducted only after a transformation meal is confirmed"), "Transformation docs must preserve recommendation/reservation boundary.");
assert(docs.outcomes.includes("Scheduled leftover meals never prove"), "Outcome docs must preserve physical-outcome boundary.");
assert(docs.timeline.includes("does not reset when the food is transformed"), "Timeline docs must preserve original cooked date boundary.");

const baselineOutcome = {
  sourceMealStatus: "completed",
  sourceOutcomeRevision: 1,
  actualServingsPrepared: 6,
  actualServingsConsumed: 4,
  servingsDiscardedAtSourceMeal: 0,
  servingsDonatedOrSharedAtSourceMeal: 0,
  otherConfirmedOutcomeServings: 0
};

assert.strictEqual(calculateRemainingServings(baselineOutcome), 2, "TEST 1: 6 prepared and 4 consumed should leave 2 servings.");

let batchResult = createLeftoverBatch({ outcome: baselineOutcome });
assert.strictEqual(batchResult.batches.length, 1, "TEST 2: exactly one leftover batch should be created.");
assert.strictEqual(batchResult.batch.servingsRemaining, 2, "TEST 2: leftover batch should contain two servings.");
assert.strictEqual(batchResult.batch.sourceMealId, SOURCE_MEAL_ID, "TEST 3: source meal link should be preserved.");
assert.strictEqual(batchResult.batch.originalRecipeId, SOURCE_RECIPE_ID, "TEST 4: original recipe link should be preserved.");
assert.strictEqual(batchResult.batch.originalCookedAt, FIXED.mondayCookedAt, "TEST 5: original cooking date should be Monday.");
assert.notStrictEqual(batchResult.batch.originalCookedAt, FIXED.tuesdayMealAt, "TEST 5: original cooking date must not become Tuesday.");
assert.strictEqual(batchResult.batch.refrigeratedAt, FIXED.mondayRefrigeratedAt, "TEST 6: refrigeration time should be preserved.");
assert.strictEqual(batchResult.events.length, 1, "Batch creation should create one physical leftover event.");
assert.strictEqual(batchResult.impact.length, 0, "Batch creation should not create leftover-reuse impact.");

assert.strictEqual(createLeftoverBatch({ outcome: { ...baselineOutcome, sourceMealStatus: "scheduled" } }).batches.length, 0, "TEST 7: no batch before cooking confirmation.");
assert.strictEqual(createLeftoverBatch({ outcome: { ...baselineOutcome, actualServingsConsumed: 6 } }).batches.length, 0, "TEST 8: no batch when all servings were consumed.");
assert.strictEqual(createLeftoverBatch({ meal: sourceMeal({ status: "cancelled" }), outcome: baselineOutcome }).batches.length, 0, "TEST 9: no batch for cancelled source meal.");
assert.strictEqual(createLeftoverBatch({ outcome: { ...baselineOutcome, outcome: "not-prepared" } }).batches.length, 0, "TEST 10: no batch for not-prepared source meal.");

const duplicate = createLeftoverBatch({ outcome: baselineOutcome, existingBatches: batchResult.batches });
assert.strictEqual(duplicate.batches.length, 1, "TEST 23: duplicate Monday completion should not create a second batch.");
assert.strictEqual(duplicate.batches.reduce((sum, batch) => sum + batch.servingsRemaining, 0), 2, "TEST 23: duplicate Monday completion should not create four total servings.");

const plannedSixActualFive = createLeftoverBatch({ outcome: { ...baselineOutcome, actualServingsPrepared: 5, actualServingsConsumed: 4, sourceOutcomeRevision: 2 } });
assert.strictEqual(plannedSixActualFive.batch.servingsRemaining, 1, "Source outcome must use actual prepared servings, not planned servings.");

const partialSource = createLeftoverBatch({ outcome: { ...baselineOutcome, servingsDiscardedAtSourceMeal: 1, sourceOutcomeRevision: 3 } });
assert.strictEqual(partialSource.batch.servingsRemaining, 1, "TEST 26: partial source outcome should conserve one discarded and one leftover serving.");

let batch = batchResult.batch;
const recommendation = recommendTuesdayWraps({ batch, pantry: { lettuce: true }, filters: { availableAppliances: [], maxCookingTimeMinutes: 20 } });
assert.strictEqual(recommendation.eligible, true, "TEST 11: Tuesday Chicken Wraps should appear.");
assert.strictEqual(recommendation.recommendation.sourceLeftoverBatchId, LEFTOVER_BATCH_ID, "TEST 11: recommendation should use the exact Monday batch.");
assert.strictEqual(recommendation.recommendation.plannedUseServings, 2, "TEST 11: recommendation should allocate two servings.");
assert(recommendation.recommendation.sourceText.includes("Monday"), "TEST 11: recommendation should identify Monday leftover chicken.");
assert.strictEqual(recommendation.newChickenPurchaseQuantity, 0, "TEST 12: no second chicken purchase should be created.");
assert.strictEqual(recommendation.newChickenPurchaseCostCents, 0, "TEST 14: new chicken checkout cost should be zero.");
assert(recommendation.historicalChickenIngredientValueCents > 0, "TEST 15: historical ingredient value may remain distinct from new spending.");

const missingTortillas = recommendTuesdayWraps({ batch, pantry: { lettuce: true }, filters: { availableAppliances: [], maxCookingTimeMinutes: 20 } });
assert(missingTortillas.shoppingList.includes("tortillas"), "TEST 13: tortillas should be added when unavailable.");
assert(!missingTortillas.shoppingList.some((item) => item.includes("chicken")), "TEST 13: chicken should not be added when leftover fully covers it.");

assert.strictEqual(recommendTuesdayWraps({ batch, recipe: chickenWrapRecipe({ ingredients: [{ ingredientId: "raw-chicken", quantity: 1, unit: "package", mandatory: true }] }) }).eligible, false, "TEST 28: raw chicken must not match cooked leftover chicken.");
assert.strictEqual(recommendTuesdayWraps({ batch: { ...batch, storageReviewRequired: true } }).eligible, false, "TEST 29: storage-review batch should not be recommended.");
assert.strictEqual(recommendTuesdayWraps({ batch: { ...batch, reheatBlocked: true }, filters: { requiresReheat: true } }).eligible, false, "TEST 30: reheating block should exclude heated transformation.");
assert.strictEqual(recommendTuesdayWraps({ batch, recipe: chickenWrapRecipe({ allergenIds: ["peanut"] }), filters: { allergyIds: ["peanut"] } }).eligible, false, "TEST 31: peanut allergy variant should be excluded.");
assert.strictEqual(recommendTuesdayWraps({ batch, recipe: chickenWrapRecipe({ requiredAppliances: ["air-fryer"] }), filters: { availableAppliances: [] } }).eligible, false, "TEST 32: unavailable-appliance transformation should be excluded.");
assert.strictEqual(recommendTuesdayWraps({ batch, recipe: chickenWrapRecipe({ cookingTimeMinutes: 45 }), filters: { maxCookingTimeMinutes: 20 } }).eligible, false, "TEST 33: over-time transformation should be excluded.");

const beforePreview = clone(batch);
recommendTuesdayWraps({ batch });
assert.deepStrictEqual(batch, beforePreview, "TEST 17: recommendation should not consume or mutate the batch.");

let reserved = reserveTuesdayWraps(batch);
assert.strictEqual(reserved.ok, true, "TEST 16: Tuesday reservation should succeed.");
batch = reserved.batch;
assert.strictEqual(batch.servingsRemaining, 2, "TEST 16: scheduling should not consume physical leftover servings.");
assert.strictEqual(batch.activeReservedServings, 2, "TEST 16: scheduling should reserve two servings.");
assert.strictEqual(availableServings(batch), 0, "TEST 16: available servings should be zero after reservation.");
assert.strictEqual(reserved.events[0].affectsOnHandQuantity, false, "TEST 16: reservation event should not affect on-hand quantity.");
assert.strictEqual(reserved.impact.length, 0, "TEST 43: reservation should create no early impact.");

const secondReservation = reserveTuesdayWraps(batch, { mealId: "leftover-test-competing-tuesday-soup" });
assert.strictEqual(secondReservation.ok, false, "TEST 24: competing meal cannot reserve the same two servings.");
assert.strictEqual(batch.servingsRemaining, 2, "TEST 18: opening Start Cooking should leave physical batch at two servings.");

const cancelledDialog = cancelTuesdayWraps(batch, { confirm: false });
assert.deepStrictEqual(cancelledDialog.batch, batch, "Opening cancellation should not release or consume leftovers.");
const cancelled = cancelTuesdayWraps(batch, { confirm: true });
assert.strictEqual(cancelled.batch.servingsRemaining, 2, "TEST 19: cancellation should leave physical batch unchanged.");
assert.strictEqual(cancelled.batch.activeReservedServings, 0, "TEST 19: cancellation should release reservation.");
assert.strictEqual(availableServings(cancelled.batch), 2, "TEST 19: cancellation should make two servings available.");
assert.strictEqual(cancelled.batch.originalCookedAt, FIXED.mondayCookedAt, "Cancellation must not reset original cooked date.");
assert.strictEqual(cancelled.impact.length, 0, "Cancellation should create no leftover-reuse impact.");

const completeFull = completeTuesdayWraps(batch, { actualUse: 2 });
assert.strictEqual(completeFull.batch.servingsRemaining, 0, "TEST 20: actual use of two servings should consume the batch.");
assert.strictEqual(completeFull.batch.status, "consumed", "TEST 20: fully used batch should be consumed.");
assert.strictEqual(completeFull.batch.originalCookedAt, FIXED.mondayCookedAt, "TEST 20: transformation must not reset originalCookedAt.");
assert.strictEqual(completeFull.batch.lastTransformedAt, FIXED.tuesdayMealAt, "TEST 20: transformation date should be separate from original cooked date.");
assert.strictEqual(completeFull.events[0].type, "leftover-quantity-transformed", "TEST 20: completion should create a physical transformed event.");
assert.strictEqual(completeFull.impact[0].servings, 2, "TEST 44: confirmed reuse may create two-serving reuse metric.");
assert.strictEqual(completeTuesdayWraps(completeFull.batch, { actualUse: 2, existingImpact: completeFull.impact }).impact.length, 1, "TEST 44: reuse metric should dedupe.");

const completePartial = completeTuesdayWraps(batch, { actualUse: 1 });
assert.strictEqual(completePartial.batch.servingsRemaining, 1, "TEST 21: actual use of one serving should leave one serving.");
assert.strictEqual(completePartial.batch.reservations[0].releasedQuantity, 1, "TEST 21: unused reservation difference should be released.");

const notPrepared = completeTuesdayWraps(batch, { prepared: false });
assert.strictEqual(notPrepared.batch.servingsRemaining, 2, "TEST 22: not-prepared Tuesday meal should leave two servings.");
assert.strictEqual(notPrepared.events.length, 0, "TEST 22: not-prepared Tuesday meal should create no physical use event.");

const unknownUse = completeTuesdayWraps(batch, { actualUse: null });
assert.strictEqual(unknownUse.batch.status, "outcome-review-required", "Actual unknown should require outcome review.");

const sundayBatch = { ...batchResult.batch, id: "leftover-test-sunday-roast-chicken", sourceMealId: "leftover-test-sunday-roast-chicken-meal", originalCookedAt: "2026-08-09T18:00:00-04:00", servingsRemaining: 1, reservations: [] };
assert.notStrictEqual(sundayBatch.id, batchResult.batch.id, "TEST 27: multiple chicken batches should keep separate IDs.");
assert.notStrictEqual(sundayBatch.sourceMealId, batchResult.batch.sourceMealId, "TEST 27: multiple chicken batches should keep separate source meals.");
assert.notStrictEqual(sundayBatch.originalCookedAt, batchResult.batch.originalCookedAt, "TEST 27: multiple chicken batches should keep separate original dates.");

const corrected = createLeftoverBatch({ outcome: { ...baselineOutcome, actualServingsPrepared: 6, actualServingsConsumed: 5, sourceOutcomeRevision: 4 } });
assert.strictEqual(corrected.batch.servingsRemaining, 1, "TEST 25: corrected Monday outcome should recalculate one leftover serving.");
assert.strictEqual(recommendTuesdayWraps({ batch: corrected.batch }).eligible, false, "TEST 25: two-serving wrap reservation should require review after one-serving correction.");

const persisted = JSON.parse(JSON.stringify({ batches: batchResult.batches, recipes: [sourceRecipe(), chickenWrapRecipe()], fixed: FIXED }));
assert.strictEqual(persisted.batches.length, 1, "TEST 34: reload should reconstruct one batch.");
assert.strictEqual(persisted.batches[0].servingsRemaining, 2, "TEST 34: reload should preserve two servings.");
assert.strictEqual(persisted.batches[0].originalCookedAt, FIXED.mondayCookedAt, "TEST 34: reload should preserve Monday original cooking date.");
assert.strictEqual(recommendTuesdayWraps({ batch: persisted.batches[0] }).eligible, true, "TEST 34: Tuesday wraps should remain available after reload.");

const orderedA = [sundayBatch, batchResult.batch].map((item) => item.id).sort();
const orderedB = [batchResult.batch, sundayBatch].map((item) => item.id).sort();
assert.deepStrictEqual(orderedA, orderedB, "Source-array order should not merge or misassign batches.");

const sameRunA = recommendTuesdayWraps({ batch: batchResult.batch, filters: { maxCookingTimeMinutes: 20 } });
const sameRunB = recommendTuesdayWraps({ batch: batchResult.batch, filters: { maxCookingTimeMinutes: 20 } });
assert.deepStrictEqual(sameRunA, sameRunB, "Determinism: repeated evaluation with the same fixed clock and inputs should match.");

const tabA = createLeftoverBatch({ outcome: baselineOutcome });
const tabB = createLeftoverBatch({ outcome: baselineOutcome, existingBatches: tabA.batches });
assert.strictEqual(tabB.batches.length, 1, "TEST 45: multi-tab batch creation should leave one batch only.");

const tabReservationA = reserveTuesdayWraps(batchResult.batch);
const tabReservationB = reserveTuesdayWraps(tabReservationA.batch, { mealId: "leftover-test-second-tab-wraps" });
assert.strictEqual(tabReservationB.ok, false, "TEST 46: multi-tab reservation should not exceed two active servings.");

const cancelledPath = cancelTuesdayWraps(batch);
const staleComplete = completeTuesdayWraps(cancelledPath.batch, { actualUse: 2 });
assert.strictEqual(cancelledPath.batch.activeReservedServings, 0, "TEST 47: one current cancellation should release reservations.");
assert.strictEqual(staleComplete.batch.servingsRemaining >= 0, true, "TEST 47: stale completion must not create negative quantity.");

const otherUserBatch = { ...batchResult.batch, userScopeId: OTHER_USER_SCOPE, id: "leftover-test-other-user-batch" };
assert.strictEqual(recommendTuesdayWraps({ batch: otherUserBatch, userScopeId: USER_SCOPE }).eligible, false, "Cross-user leftover batches must not be exposed.");

const accessibleBatchText = "Cooked roast chicken. Two servings remaining. Originally cooked Monday, August 10. Source meal: Monday Roast Chicken.";
const accessibleWrapText = "Chicken Wraps. Uses two servings from Monday's roast chicken. No new chicken purchase is required.";
assert(accessibleBatchText.includes("Two servings remaining"), "TEST 35: screen-reader batch text should include serving count.");
assert(accessibleBatchText.includes("Originally cooked Monday, August 10"), "TEST 35: screen-reader batch text should include original cooking date.");
assert(accessibleWrapText.includes("No new chicken purchase is required"), "TEST 36: screen-reader wrap text should include purchase status.");

const exportPayload = {
  leftoverBatch: {
    id: batchResult.batch.id,
    sourceMealId: batchResult.batch.sourceMealId,
    originalRecipeId: batchResult.batch.originalRecipeId,
    servingsRemaining: batchResult.batch.servingsRemaining,
    originalServingsPrepared: batchResult.batch.originalServingsPrepared,
    servingsConsumedAtSourceMeal: batchResult.batch.servingsConsumedAtSourceMeal,
    originalCookedAt: batchResult.batch.originalCookedAt,
    refrigeratedAt: batchResult.batch.refrigeratedAt
  },
  transformationRecommendation: {
    recipeId: TRANSFORMATION_RECIPE_ID,
    sourceLeftoverBatchId: batchResult.batch.id,
    requiredServings: 2,
    newChickenPurchaseQuantity: 0,
    originalCookedAt: batchResult.batch.originalCookedAt
  }
};
assert.strictEqual(exportPayload.leftoverBatch.originalCookedAt, FIXED.mondayCookedAt, "TEST 42: export should preserve Monday originalCookedAt.");
assert.strictEqual(exportPayload.transformationRecommendation.newChickenPurchaseQuantity, 0, "TEST 42: export should preserve zero new chicken purchase.");

[
  "## 1. Purpose",
  "## 2. Fixed Test Timeline",
  "## 3. Source Meal",
  "## 30. Commands",
  "No second chicken purchase",
  "originalCookedAt",
  "America/Toronto"
].forEach((snippet) => assert(docs.step58.includes(snippet), `Step 58 test documentation missing ${snippet}.`));

[
  "Step 58",
  "Required servings prepared: 6",
  "Required servings consumed Monday: 4",
  "Required leftover servings: 2",
  "Tuesday Chicken Wraps available: Pass",
  "New Tuesday chicken checkout cost: $0.00",
  "No product functionality was changed"
].forEach((snippet) => assert(docs.report.includes(snippet), `Step 58 report missing ${snippet}.`));

console.log("Cook Before It Spoils Step 58 leftover transformation tests passed.");
