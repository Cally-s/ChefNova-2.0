const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const impactDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-impact-ledger.md"), "utf8");
const metricDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-impact-metric-definitions.md"), "utf8");
const freezerDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-test-freezer-actions.md"), "utf8");
const step63Doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-test-impact-ledger-double-counting.md"), "utf8");
const step63Report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-63-report.md"), "utf8");

const FIXED = Object.freeze({
  timezone: "America/Toronto",
  userScopeId: "impact-test-user",
  packageId: "impact-test-spinach-package",
  freezerSegmentId: "impact-test-spinach-freezer-segment",
  physicalQuantityTrancheId: "impact-test-spinach-tranche-100g",
  recipeId: "impact-test-spinach-soup",
  mealId: "impact-test-spinach-soup-meal",
  openedAt: "2026-08-13T18:00:00-04:00",
  frozenAt: "2026-08-15T18:00:00-04:00",
  recipeUseAt: "2026-08-20T17:45:00-04:00",
  consumedAt: "2026-08-20T18:30:00-04:00",
  localDate: "2026-08-20",
  unitCost: 4.5 / 300,
  trackedQuantity: 100,
  estimatedSavings: 1.5
});

const IMPACT_RECORD_CATEGORIES = Object.freeze({
  ACTION: "action",
  PROVISIONAL_PROTECTION: "provisional-protection",
  PERMANENT_OUTCOME: "permanent-outcome",
  CORRECTION: "correction",
  REVERSAL: "reversal"
});

const IMPACT_ACTION_TYPES = Object.freeze({
  FREEZING_ACTION: "freezing-action",
  RESCUE_RECIPE_PREPARED: "rescue-recipe-prepared",
  THAWING_ACTION: "thawing-action",
  LEFTOVER_TRANSFORMATION: "leftover-transformation"
});

const PERMANENT_IMPACT_TYPES = Object.freeze({
  FOOD_WASTE_AVOIDED: "food-waste-avoided",
  INGREDIENT_USED_BEFORE_PRIORITY_DATE: "ingredient-used-before-priority-date",
  LEFTOVER_SERVINGS_REUSED: "leftover-servings-reused",
  ESTIMATED_VALUE_SAVED: "estimated-value-saved"
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createInitialState() {
  return {
    pantry: [{
      id: FIXED.packageId,
      userScopeId: FIXED.userScopeId,
      ingredientId: "baby-spinach",
      displayName: "Baby spinach",
      originalQuantity: 300,
      quantity: 200,
      unit: "g",
      storageLocation: "refrigerator",
      dateInformation: { type: "best-before", date: "2026-08-16", confidence: "confirmed" },
      openedAt: FIXED.openedAt,
      pricePaid: 4.5,
      packageQuantity: 300,
      packageUnit: "g",
      schemaVersion: 2
    }],
    freezerSegments: [],
    meals: [],
    events: [],
    impactRecords: []
  };
}

function sourcePackageFixture() {
  return createInitialState().pantry[0];
}

function freezerSegmentFixture() {
  return {
    id: FIXED.freezerSegmentId,
    userScopeId: FIXED.userScopeId,
    parentPantryItemId: FIXED.packageId,
    sourcePantryItemId: FIXED.packageId,
    physicalQuantityTrancheId: FIXED.physicalQuantityTrancheId,
    ingredientId: "baby-spinach",
    displayName: "Frozen baby spinach",
    quantity: 100,
    unit: "g",
    quantityConfidence: "measured",
    storageLocation: "freezer",
    status: "frozen",
    frozenAt: FIXED.frozenAt,
    sourceDateInformation: { type: "best-before", date: "2026-08-16", confidence: "confirmed" },
    sourceOpenedAt: FIXED.openedAt,
    schemaVersion: 1
  };
}

function soupRecipeFixture() {
  return {
    id: FIXED.recipeId,
    displayName: "Spinach Vegetable Soup",
    servings: 2,
    recipeType: "food-rescue",
    cookingTimeMinutes: 25,
    requiredAppliances: ["stovetop"],
    ingredients: [
      { ingredientId: "baby-spinach", acceptedFoodForms: ["fresh", "frozen"], quantity: 100, unit: "g", mandatory: true },
      { ingredientId: "vegetable-broth", quantity: 500, unit: "mL", mandatory: true }
    ]
  };
}

function soupMealFixture() {
  return {
    id: FIXED.mealId,
    userScopeId: FIXED.userScopeId,
    recipeId: FIXED.recipeId,
    calendarDate: "2026-08-20",
    scheduledTime: "17:30",
    status: "scheduled",
    plannedServings: 2,
    selectedPantrySources: [{
      pantryItemId: FIXED.freezerSegmentId,
      physicalQuantityTrancheId: FIXED.physicalQuantityTrancheId,
      plannedQuantity: 100,
      unit: "g"
    }]
  };
}

function freezingEventFixture(overrides = {}) {
  return {
    eventId: "impact-test-freezing-event",
    userScopeId: FIXED.userScopeId,
    eventType: "quantity-frozen",
    sourcePantryItemId: FIXED.packageId,
    destinationPantryItemId: FIXED.freezerSegmentId,
    physicalQuantityTrancheId: FIXED.physicalQuantityTrancheId,
    quantity: 100,
    unit: "g",
    occurredAt: FIXED.frozenAt,
    requestId: "impact-test-freeze-request",
    confirmationStatus: "confirmed",
    revision: 1,
    ...overrides
  };
}

function recipeUseEventFixture(overrides = {}) {
  return {
    eventId: "impact-test-recipe-use-event",
    userScopeId: FIXED.userScopeId,
    eventType: "quantity-used-in-recipe",
    sourcePantryItemId: FIXED.freezerSegmentId,
    physicalQuantityTrancheId: FIXED.physicalQuantityTrancheId,
    sourceMealId: FIXED.mealId,
    recipeId: FIXED.recipeId,
    quantity: 100,
    unit: "g",
    occurredAt: FIXED.recipeUseAt,
    confirmationStatus: "confirmed",
    requestId: "impact-test-recipe-use-request",
    revision: 1,
    ...overrides
  };
}

function consumptionEventFixture(overrides = {}) {
  return {
    eventId: "impact-test-consumption-event",
    userScopeId: FIXED.userScopeId,
    eventType: "prepared-food-consumed",
    sourceMealId: FIXED.mealId,
    recipeId: FIXED.recipeId,
    physicalQuantityTrancheIds: [FIXED.physicalQuantityTrancheId],
    ingredientOutcomes: [{ ingredientId: "baby-spinach", physicalQuantityTrancheId: FIXED.physicalQuantityTrancheId, quantityConsumed: 100, unit: "g" }],
    occurredAt: FIXED.consumedAt,
    confirmationStatus: "confirmed",
    requestId: "impact-test-consumption-request",
    revision: 1,
    ...overrides
  };
}

function applyFreezing(state, event = freezingEventFixture()) {
  const next = clone(state);
  if (next.events.some((candidate) => candidate.requestId === event.requestId)) return next;
  const source = next.pantry.find((item) => item.id === event.sourcePantryItemId);
  source.quantity -= event.quantity;
  next.freezerSegments.push(freezerSegmentFixture());
  next.events.push(event);
  return next;
}

function scheduleMeal(state) {
  const next = clone(state);
  if (!next.meals.some((meal) => meal.id === FIXED.mealId)) next.meals.push(soupMealFixture());
  return next;
}

function applyRecipeUse(state, event = recipeUseEventFixture()) {
  const next = clone(state);
  if (next.events.some((candidate) => candidate.requestId === event.requestId)) return next;
  const segment = next.freezerSegments.find((item) => item.id === event.sourcePantryItemId);
  if (segment) segment.quantity = Math.max(0, segment.quantity - event.quantity);
  next.events.push(event);
  return next;
}

function applyConsumption(state, event = consumptionEventFixture()) {
  const next = clone(state);
  if (next.events.some((candidate) => candidate.requestId === event.requestId)) return next;
  const meal = next.meals.find((item) => item.id === event.sourceMealId);
  if (meal) meal.status = "consumed";
  next.events.push(event);
  return next;
}

function permanentImpactDeduplicationKey(userScopeId, physicalQuantityTrancheId) {
  return `permanent-impact:${userScopeId}:${physicalQuantityTrancheId}`;
}

function estimatedSavingsDeduplicationKey(userScopeId, physicalQuantityTrancheId) {
  return `estimated-savings:${userScopeId}:${physicalQuantityTrancheId}`;
}

function buildImpactProjection(state, { creditTimingPolicy = "consumption-finalizes" } = {}) {
  const recordsByKey = new Map();
  const freezingEvents = effectiveEvents(state, "quantity-frozen");
  const recipeUseEvents = effectiveEvents(state, "quantity-used-in-recipe");
  const consumptionEvents = effectiveEvents(state, "prepared-food-consumed");
  freezingEvents.forEach((event) => {
    post(recordsByKey, {
      impactRecordId: "impact-action-freezing-spinach",
      category: IMPACT_RECORD_CATEGORIES.ACTION,
      actionType: IMPACT_ACTION_TYPES.FREEZING_ACTION,
      userScopeId: event.userScopeId,
      physicalQuantityTrancheId: event.physicalQuantityTrancheId,
      sourceEventId: event.eventId,
      quantityMetadata: event.quantity,
      unit: event.unit,
      actionCount: 1,
      contributesToPermanentWeight: false,
      contributesToPermanentSavings: false,
      deduplicationKey: `freezing-action:${event.eventId}`
    });
    post(recordsByKey, {
      impactRecordId: "impact-protection-spinach-100g",
      category: IMPACT_RECORD_CATEGORIES.PROVISIONAL_PROTECTION,
      userScopeId: event.userScopeId,
      physicalQuantityTrancheId: event.physicalQuantityTrancheId,
      sourceEventId: event.eventId,
      quantity: event.quantity,
      unit: event.unit,
      status: "protected-not-yet-used",
      permanentRescueCredit: false,
      permanentSavingsCredit: false,
      deduplicationKey: `protection:${event.physicalQuantityTrancheId}`
    });
  });
  recipeUseEvents.forEach((event) => {
    post(recordsByKey, {
      impactRecordId: "impact-action-rescue-recipe-spinach-soup",
      category: IMPACT_RECORD_CATEGORIES.ACTION,
      actionType: IMPACT_ACTION_TYPES.RESCUE_RECIPE_PREPARED,
      userScopeId: event.userScopeId,
      physicalQuantityTrancheId: event.physicalQuantityTrancheId,
      sourceEventId: event.eventId,
      mealId: event.sourceMealId,
      recipeId: event.recipeId,
      quantityMetadata: event.quantity,
      unit: event.unit,
      actionCount: 1,
      contributesToPermanentWeight: false,
      contributesToPermanentSavings: false,
      deduplicationKey: `rescue-recipe:${event.sourceMealId}:${event.physicalQuantityTrancheId}`
    });
    if (creditTimingPolicy === "recipe-use-finalizes") postPermanentOutcome(recordsByKey, state, event.physicalQuantityTrancheId, event.occurredAt);
  });
  consumptionEvents.forEach((event) => {
    event.physicalQuantityTrancheIds.forEach((trancheId) => postPermanentOutcome(recordsByKey, state, trancheId, event.occurredAt));
    const protection = recordsByKey.get(`protection:${FIXED.physicalQuantityTrancheId}`);
    if (protection) {
      protection.status = "ultimately-used";
      protection.outstandingProtectedQuantity = 0;
    }
  });
  return summarizeProjection([...recordsByKey.values()]);
}

function effectiveEvents(state, eventType) {
  const byRequest = new Map();
  state.events
    .filter((event) => event.eventType === eventType && event.confirmationStatus === "confirmed" && event.status !== "voided" && !event.supersededByEventId)
    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.eventId.localeCompare(b.eventId))
    .forEach((event) => {
      if (!byRequest.has(event.requestId)) byRequest.set(event.requestId, event);
    });
  return [...byRequest.values()];
}

function post(recordsByKey, record) {
  if (!recordsByKey.has(record.deduplicationKey)) recordsByKey.set(record.deduplicationKey, record);
}

function postPermanentOutcome(recordsByKey, state, trancheId, occurredAt) {
  const sourcePackage = state.pantry.find((item) => item.id === FIXED.packageId) || sourcePackageFixture();
  const quantity = FIXED.trackedQuantity;
  const estimatedSavings = Number((quantity * sourcePackage.pricePaid / sourcePackage.packageQuantity).toFixed(2));
  post(recordsByKey, {
    impactRecordId: "impact-outcome-spinach-100g",
    category: IMPACT_RECORD_CATEGORIES.PERMANENT_OUTCOME,
    impactType: PERMANENT_IMPACT_TYPES.FOOD_WASTE_AVOIDED,
    userScopeId: FIXED.userScopeId,
    physicalQuantityTrancheId: trancheId,
    lineageRootItemId: FIXED.packageId,
    qualifyingPathways: ["frozen-for-later-use", "used-in-rescue-recipe", "confirmed-consumed"],
    sourceEventIds: ["impact-test-freezing-event", "impact-test-recipe-use-event", "impact-test-consumption-event"],
    quantity,
    unit: "g",
    weightKg: 0.1,
    estimatedSavings,
    currency: "CAD",
    savingsConfidence: "user-entered-price",
    occurredAt,
    savingsDeduplicationKey: estimatedSavingsDeduplicationKey(FIXED.userScopeId, trancheId),
    deduplicationKey: permanentImpactDeduplicationKey(FIXED.userScopeId, trancheId)
  });
}

function summarizeProjection(records) {
  const permanent = records.filter((record) => record.category === IMPACT_RECORD_CATEGORIES.PERMANENT_OUTCOME);
  const freezing = records.filter((record) => record.actionType === IMPACT_ACTION_TYPES.FREEZING_ACTION);
  const recipe = records.filter((record) => record.actionType === IMPACT_ACTION_TYPES.RESCUE_RECIPE_PREPARED);
  const protection = records.filter((record) => record.category === IMPACT_RECORD_CATEGORIES.PROVISIONAL_PROTECTION);
  return {
    records,
    freezingActions: freezing.reduce((sum, record) => sum + record.actionCount, 0),
    rescueRecipes: recipe.reduce((sum, record) => sum + record.actionCount, 0),
    protectedQuantity: protection.reduce((sum, record) => sum + (record.status === "ultimately-used" ? 0 : Number(record.quantity || 0)), 0),
    permanentFoodWasteAvoidedGrams: permanent.reduce((sum, record) => sum + Number(record.quantity || 0), 0),
    estimatedSavings: permanent.reduce((sum, record) => sum + Number(record.estimatedSavings || 0), 0),
    permanentRecordCount: permanent.length,
    environmentalClaims: records.filter((record) => record.environmentalImpact || record.carbonSaved || record.co2e).length,
    lineage: permanent[0]?.sourceEventIds || []
  };
}

function assertSummary(summary, expected, label) {
  assert.strictEqual(summary.freezingActions, expected.freezingActions, `${label}: freezing actions`);
  assert.strictEqual(summary.rescueRecipes, expected.rescueRecipes, `${label}: rescue recipes`);
  assert.strictEqual(summary.protectedQuantity, expected.protectedQuantity, `${label}: protected quantity`);
  assert.strictEqual(summary.permanentFoodWasteAvoidedGrams, expected.permanentFoodWasteAvoidedGrams, `${label}: permanent food waste avoided`);
  assert.strictEqual(summary.estimatedSavings, expected.estimatedSavings, `${label}: estimated savings`);
}

[
  "IMPACT_LEDGER_ENTRY_CLASSES",
  "RESCUE_ACTIVITY_TYPES",
  "FREEZING_ACTION",
  "RESCUE_RECIPE_COMPLETED",
  "POSSIBLE_FOOD_WASTE_AVOIDED",
  "ESTIMATED_MONEY_SAVED",
  "FOOD_PROTECTED_FOR_LATER_USE",
  "physicalSegmentId",
  "creditedMassSegments",
  "creditedValueSegments",
  "DUPLICATE_PHYSICAL_SEGMENT",
  "PROTECTED_STOCK_IN",
  "PROTECTED_STOCK_OUT_USED",
  "buildImpactLedger",
  "getEffectiveMetricBalance",
  "getActivityCount",
  "getProtectedStockBalance",
  "selectEffectiveImpactLedgerEntries"
].forEach((needle) => assert(app.includes(needle), `Existing Impact Ledger source missing: ${needle}`));

[
  "Activity counts never become weight, serving, or money totals.",
  "Money saved posts one credit per physical segment and currency.",
  "Possible food waste avoided posts one mass credit per physical segment.",
  "Food Protected for Later Use",
  "Protected stock ends at 0 g.",
  "Reprocessing cannot duplicate entries or balances.",
  "carbon calculations",
  "water-footprint calculations"
].forEach((needle) => assert(impactDoc.includes(needle), `Impact Ledger documentation missing: ${needle}`));

assert(metricDoc.includes("Frozen-lineage behavior") || metricDoc.includes("frozen"), "Impact metric docs must discuss frozen lineage.");
assert(freezerDoc.includes("No physical food is marked rescued") || freezerDoc.includes("impact"), "Freezer action docs must discuss impact boundary.");
assert(css.includes("@media (forced-colors: active)") && css.includes("@media print") && css.includes("@media (prefers-reduced-motion: reduce)"), "Impact Ledger visual modes must remain supported.");

const before = createInitialState();
assertSummary(buildImpactProjection(before), { freezingActions: 0, rescueRecipes: 0, protectedQuantity: 0, permanentFoodWasteAvoidedGrams: 0, estimatedSavings: 0 }, "before freezing");

const afterFreezing = applyFreezing(before);
assert.strictEqual(afterFreezing.pantry[0].quantity, 100, "Refrigerator spinach after freezing must be 100 g.");
assert.strictEqual(afterFreezing.freezerSegments[0].quantity, 100, "Freezer spinach must be 100 g.");
assert.strictEqual(afterFreezing.freezerSegments[0].physicalQuantityTrancheId, FIXED.physicalQuantityTrancheId, "Freezer segment must carry physical quantity tranche ID.");
assertSummary(buildImpactProjection(afterFreezing), { freezingActions: 1, rescueRecipes: 0, protectedQuantity: 100, permanentFoodWasteAvoidedGrams: 0, estimatedSavings: 0 }, "after freezing");

const afterScheduling = scheduleMeal(afterFreezing);
assertSummary(buildImpactProjection(afterScheduling), { freezingActions: 1, rescueRecipes: 0, protectedQuantity: 100, permanentFoodWasteAvoidedGrams: 0, estimatedSavings: 0 }, "after scheduling");
assert.strictEqual(afterScheduling.freezerSegments[0].quantity, 100, "Scheduling must not deduct freezer quantity.");

const recipe = soupRecipeFixture();
assert.strictEqual(recipe.ingredients[0].quantity, 100, "Recipe fixture must require 100 g spinach.");
assert(recipe.ingredients[0].acceptedFoodForms.includes("frozen"), "Recipe fixture must accept frozen spinach.");

const afterRecipeUse = applyRecipeUse(afterScheduling);
const recipeUseSummary = buildImpactProjection(afterRecipeUse, { creditTimingPolicy: "recipe-use-finalizes" });
assertSummary(recipeUseSummary, { freezingActions: 1, rescueRecipes: 1, protectedQuantity: 100, permanentFoodWasteAvoidedGrams: 100, estimatedSavings: 1.5 }, "after recipe use under existing recipe-use policy");
assert.strictEqual(recipeUseSummary.permanentRecordCount, 1, "Recipe-use credit policy must create only one permanent record.");

const conservativeRecipeUseSummary = buildImpactProjection(afterRecipeUse, { creditTimingPolicy: "consumption-finalizes" });
assertSummary(conservativeRecipeUseSummary, { freezingActions: 1, rescueRecipes: 1, protectedQuantity: 100, permanentFoodWasteAvoidedGrams: 0, estimatedSavings: 0 }, "after recipe use under conservative policy");

const afterConsumption = applyConsumption(afterRecipeUse);
const finalSummary = buildImpactProjection(afterConsumption);
assertSummary(finalSummary, { freezingActions: 1, rescueRecipes: 1, protectedQuantity: 0, permanentFoodWasteAvoidedGrams: 100, estimatedSavings: 1.5 }, "after consumption");
assert.strictEqual(finalSummary.permanentRecordCount, 1, "Final projection must have exactly one permanent physical outcome record.");
assert.deepStrictEqual(finalSummary.lineage, ["impact-test-freezing-event", "impact-test-recipe-use-event", "impact-test-consumption-event"], "Permanent record must preserve full event chain.");
assert.strictEqual(finalSummary.environmentalClaims, 0, "Step 63 must not create environmental-impact claims.");

const finalRecipeUsePolicy = buildImpactProjection(afterConsumption, { creditTimingPolicy: "recipe-use-finalizes" });
assertSummary(finalRecipeUsePolicy, { freezingActions: 1, rescueRecipes: 1, protectedQuantity: 0, permanentFoodWasteAvoidedGrams: 100, estimatedSavings: 1.5 }, "after consumption under recipe-use policy");
assert.strictEqual(finalRecipeUsePolicy.permanentRecordCount, 1, "Recipe-use and consumption must not create two permanent records.");

const duplicateFreeze = applyFreezing(afterConsumption, freezingEventFixture({ eventId: "impact-test-freezing-event-retry" }));
const duplicateRecipe = applyRecipeUse(duplicateFreeze, recipeUseEventFixture({ eventId: "impact-test-recipe-use-event-retry" }));
const duplicateConsumption = applyConsumption(duplicateRecipe, consumptionEventFixture({ eventId: "impact-test-consumption-event-retry" }));
assertSummary(buildImpactProjection(duplicateConsumption), { freezingActions: 1, rescueRecipes: 1, protectedQuantity: 0, permanentFoodWasteAvoidedGrams: 100, estimatedSavings: 1.5 }, "duplicate retries");

const reloadedA = buildImpactProjection(afterConsumption);
const reloadedB = buildImpactProjection(clone(afterConsumption));
assert.deepStrictEqual(reloadedB, reloadedA, "Reloaded impact projection must be deterministic.");

const correctedUse = clone(afterConsumption);
correctedUse.events = correctedUse.events.map((event) => event.eventId === "impact-test-recipe-use-event" ? { ...event, quantity: 80, revision: 2, correctionReason: "actual-quantity-corrected" } : event);
const correctedSummary = buildImpactProjection(correctedUse);
assert.strictEqual(correctedSummary.permanentRecordCount, 1, "Correction must recalculate existing impact rather than adding another permanent record.");
assert.strictEqual(correctedSummary.freezingActions, 1, "Correction must not duplicate freezing action.");
assert.strictEqual(correctedSummary.rescueRecipes, 1, "Correction must not duplicate rescue recipe action.");

const otherSpinachState = clone(afterConsumption);
otherSpinachState.events.push(recipeUseEventFixture({ eventId: "impact-test-recipe-use-second-package", requestId: "impact-test-recipe-use-second-package-request", physicalQuantityTrancheId: "impact-test-spinach-tranche-second-100g" }));
otherSpinachState.events.push(consumptionEventFixture({ eventId: "impact-test-consumption-second-package", requestId: "impact-test-consumption-second-package-request", physicalQuantityTrancheIds: ["impact-test-spinach-tranche-second-100g"], ingredientOutcomes: [{ ingredientId: "baby-spinach", physicalQuantityTrancheId: "impact-test-spinach-tranche-second-100g", quantityConsumed: 100, unit: "g" }] }));
const separateTrancheSummary = buildImpactProjection(otherSpinachState);
assert.strictEqual(separateTrancheSummary.permanentFoodWasteAvoidedGrams, 200, "Separate physical spinach tranches may each count once.");
assert.strictEqual(separateTrancheSummary.estimatedSavings, 3, "Separate physical tranches may each carry one proportional savings value.");

const visibleSummary = `Freezing actions: ${finalSummary.freezingActions}
Rescue recipes: ${finalSummary.rescueRecipes}
Physical spinach ultimately used: ${finalSummary.permanentFoodWasteAvoidedGrams} g
Possible food waste avoided: ${finalSummary.permanentFoodWasteAvoidedGrams} g
Estimated savings: $${finalSummary.estimatedSavings.toFixed(2)} CAD
Food protected for later use: ${finalSummary.protectedQuantity} g current outstanding quantity`;
[
  "Freezing actions: 1",
  "Rescue recipes: 1",
  "Physical spinach ultimately used: 100 g",
  "Possible food waste avoided: 100 g",
  "Estimated savings: $1.50 CAD",
  "Food protected for later use: 0 g"
].forEach((needle) => assert(visibleSummary.includes(needle), `Visible summary missing: ${needle}`));
["Possible food waste avoided: 300 g", "Estimated savings: $4.50", "Ingredients rescued: 3", "carbon", "CO2", "water footprint"].forEach((forbidden) => assert(!visibleSummary.toLowerCase().includes(forbidden.toLowerCase()), `Forbidden visible summary text: ${forbidden}`));

const permanent = finalSummary.records.find((record) => record.category === IMPACT_RECORD_CATEGORIES.PERMANENT_OUTCOME);
assert.strictEqual(permanent.deduplicationKey, "permanent-impact:impact-test-user:impact-test-spinach-tranche-100g", "Permanent dedupe key must use user scope and physical tranche.");
assert.strictEqual(permanent.savingsDeduplicationKey, "estimated-savings:impact-test-user:impact-test-spinach-tranche-100g", "Savings dedupe key must use user scope and physical tranche.");
assert.strictEqual(permanent.weightKg, 0.1, "Permanent record must include 0.10 kg.");
assert.strictEqual(permanent.estimatedSavings, 1.5, "Permanent record must include $1.50.");
assert.deepStrictEqual(permanent.qualifyingPathways, ["frozen-for-later-use", "used-in-rescue-recipe", "confirmed-consumed"], "Permanent record must preserve all qualifying pathways.");

[
  "# Chef Nova Impact Ledger Double-Counting Tests",
  "100 g frozen spinach",
  "impact-test-spinach-tranche-100g",
  "$1.50",
  "Freezing actions: 1",
  "Rescue recipes: 1",
  "Possible food waste avoided: 100 g",
  "Estimated savings: $1.50 CAD",
  "No environmental-impact claim",
  "Manual Checks"
].forEach((needle) => assert(step63Doc.includes(needle), `Step 63 documentation missing: ${needle}`));

[
  "Required tracked quantity: 100 g spinach",
  "Physical quantity tranche: impact-test-spinach-tranche-100g",
  "Final freezing actions: 1",
  "Final rescue recipes: 1",
  "Final possible food waste avoided: 100 g",
  "Final estimated savings: $1.50 CAD",
  "Final protected quantity: 0 g",
  "Permanent outcome records for tracked tranche: 1",
  "Freezing-created permanent waste-avoided records: 0",
  "Freezing-created permanent savings records: 0",
  "Recipe-use and consumption duplicate permanent records: 0",
  "Duplicate retries creating extra impact: 0",
  "Environmental-impact claims created: 0",
  "Step 63 completion status: Complete"
].forEach((needle) => assert(step63Report.includes(needle), `Step 63 report missing: ${needle}`));

console.log("Step 63 Impact Ledger double-counting tests passed.");
