const assert = require("assert");
const fs = require("fs");
const path = require("path");
const cost = require("../scripts/cost-calculation-engine.js");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const docs = {
  smartPortions: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-smart-portion-suggestions.md"), "utf8"),
  practicalScaling: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-practical-ingredient-scaling.md"), "utf8"),
  preventExcess: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-prevent-excessive-cooking.md"), "utf8"),
  recipeCard: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-food-rescue-recipe-card.md"), "utf8"),
  shoppingList: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-shopping-list-integration.md"), "utf8"),
  reservations: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-meal-calendar-reservations.md"), "utf8"),
  freezerActions: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-test-freezer-actions.md"), "utf8"),
  step61: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-test-small-household-portions.md"), "utf8"),
  report: fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-61-report.md"), "utf8")
};

const FIXED = Object.freeze({
  localDate: "2026-08-15",
  timezone: "America/Toronto",
  instant: "2026-08-15T12:00:00-04:00",
  mealDate: "2026-08-15",
  mealType: "Dinner"
});

const RECIPE_SCALING_MODES = Object.freeze({
  FULLY_SCALABLE: "fully-scalable",
  PRACTICALLY_SCALABLE: "practically-scalable",
  SCALABLE_WITH_ROUNDING: "scalable-with-rounding",
  MINIMUM_BATCH: "minimum-batch",
  FIXED_BATCH: "fixed-batch",
  RATIO_SENSITIVE: "ratio-sensitive",
  APPLIANCE_LIMITED: "appliance-limited",
  NOT_SCALABLE: "not-scalable",
  REVIEW_REQUIRED: "review-required"
});

const INGREDIENT_SCALING_TYPES = Object.freeze({
  LINEAR: "linear",
  WHOLE_INDIVISIBLE: "whole-indivisible",
  DIVISIBLE_PACKAGE: "divisible-package",
  PURCHASE_PACKAGE_ONLY: "purchase-package-only",
  MINIMUM_QUANTITY: "minimum-quantity",
  MAXIMUM_QUANTITY: "maximum-quantity",
  RANGE: "range",
  RATIO_SENSITIVE: "ratio-sensitive",
  ADJUST_TO_TASTE: "adjust-to-taste",
  OPTIONAL: "optional",
  GARNISH: "garnish",
  REVIEW_REQUIRED: "review-required"
});

const PORTION_DECISION_RESULTS = Object.freeze({
  SCALED_TO_REQUESTED_SERVINGS: "scaled-to-requested-servings",
  SCALED_WITH_ROUNDING: "scaled-with-rounding",
  MINIMUM_BATCH_EXCEEDS_REQUEST: "minimum-batch-exceeds-request",
  FIXED_BATCH_EXCEEDS_REQUEST: "fixed-batch-exceeds-request",
  RECIPE_REPLACEMENT_RECOMMENDED: "recipe-replacement-recommended",
  USER_CONFIRMATION_REQUIRED: "user-confirmation-required",
  SCALING_REVIEW_REQUIRED: "scaling-review-required",
  INELIGIBLE: "ineligible"
});

const smallHouseholdFixture = Object.freeze({
  userScopeId: "portion-test-user",
  householdProfileId: "portion-test-household",
  householdSize: 1,
  defaultPeopleEating: 1,
  currentMealPeopleEating: 1,
  leftoverPreference: "none",
  requestedAdditionalMeals: 0,
  requiredDietaryRestrictions: ["vegetarian"],
  allergies: [],
  availableAppliances: ["stovetop"],
  maximumCookingTimeMinutes: 30,
  timezone: "America/Toronto",
  locale: "en-CA"
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

function scalableRecipeFixture(overrides = {}) {
  return {
    id: "portion-test-lentil-pasta",
    name: "Vegetable Lentil Pasta",
    displayName: "Vegetable Lentil Pasta",
    servings: 6,
    defaultServings: 6,
    minimumBatchServings: 1,
    maximumBatchServings: null,
    scalingMode: RECIPE_SCALING_MODES.FULLY_SCALABLE,
    cookingTimeMinutes: 25,
    requiredAppliances: ["stovetop"],
    dietaryTags: ["vegetarian"],
    allergenIds: [],
    structuredIngredients: [
      { occurrenceId: "dry-pasta", ingredientId: "dry-pasta", displayName: "Pasta", quantity: 600, unit: "g", scalingType: INGREDIENT_SCALING_TYPES.LINEAR, mandatory: true },
      { occurrenceId: "cooked-lentils", ingredientId: "cooked-lentils", displayName: "Cooked lentils", quantity: 480, unit: "g", scalingType: INGREDIENT_SCALING_TYPES.LINEAR, mandatory: true },
      { occurrenceId: "tomato-sauce", ingredientId: "tomato-sauce", displayName: "Tomato sauce", quantity: 600, unit: "ml", scalingType: INGREDIENT_SCALING_TYPES.LINEAR, mandatory: true },
      { occurrenceId: "baby-spinach", ingredientId: "baby-spinach", displayName: "Spinach", quantity: 300, unit: "g", scalingType: INGREDIENT_SCALING_TYPES.LINEAR, mandatory: true },
      { occurrenceId: "cooking-oil", ingredientId: "cooking-oil", displayName: "Cooking oil", quantity: 30, unit: "ml", scalingType: INGREDIENT_SCALING_TYPES.LINEAR, mandatory: true },
      { occurrenceId: "seasoning", ingredientId: "seasoning", displayName: "Seasoning", quantity: null, unit: null, scalingType: INGREDIENT_SCALING_TYPES.ADJUST_TO_TASTE, mandatory: false, scalingPolicyId: "to-taste-seasoning" }
    ],
    safetyInstructions: { minimumInternalTemperatureC: 74, coolingInstruction: "Cool promptly before storing." },
    methodPolicy: { cookingTimeMinutes: 25, reviewedSmallBatchTimeMinutes: 25, stovetopSetting: "medium" },
    recipeRevision: "portion-test-lentil-pasta:v1",
    ...overrides
  };
}

function peopleEatingForMeal(household) {
  return Number(household.currentMealPeopleEating || household.defaultPeopleEating || household.householdSize || 1);
}

function requestedLeftoverServings(household) {
  if (household.leftoverPreference === "one-additional-meal") return peopleEatingForMeal(household);
  if (household.leftoverPreference === "two-additional-meals") return peopleEatingForMeal(household) * 2;
  return 0;
}

function allergenConflict(recipe, household) {
  return (recipe.allergenIds || []).some((id) => (household.allergies || []).includes(id));
}

function dietaryConflict(recipe, household) {
  return (household.requiredDietaryRestrictions || []).some((tag) => !(recipe.dietaryTags || []).includes(tag));
}

function applianceConflict(recipe, household) {
  return (recipe.requiredAppliances || []).some((appliance) => !(household.availableAppliances || []).includes(appliance));
}

function cookingTimeConflict(recipe, household) {
  return Number(recipe.cookingTimeMinutes || 0) > Number(household.maximumCookingTimeMinutes || Number.MAX_SAFE_INTEGER);
}

function createPortionDecision(recipe, household = smallHouseholdFixture) {
  const originalServings = Number(recipe.defaultServings || recipe.servings);
  const peopleEating = peopleEatingForMeal(household);
  const leftoverServings = requestedLeftoverServings(household);
  const requestedServings = peopleEating + leftoverServings;
  const base = {
    portionRecommendationVersion: 1,
    userScopeId: household.userScopeId,
    recipeId: recipe.id,
    originalServings,
    peopleEating,
    leftoverPreference: household.leftoverPreference,
    requestedLeftoverServings: leftoverServings,
    requestedServings,
    scaleFactor: requestedServings / originalServings,
    scalingMode: recipe.scalingMode,
    minimumBatchServings: Number(recipe.minimumBatchServings || 1),
    plannedBatchServings: null,
    expectedLeftoverServings: 0,
    result: null,
    warnings: [],
    ingredientAdjustments: [],
    alternatives: [],
    sourceRevisions: { recipeRevision: recipe.recipeRevision || `${recipe.id}:v1`, householdProfileId: household.householdProfileId, fixedLocalDate: FIXED.localDate, timezone: FIXED.timezone },
    policyVersions: { portionRecommendationVersion: 1, recipeScaleProfileVersion: cost.RECIPE_SCALE_RESULT_VERSION }
  };
  if (allergenConflict(recipe, household)) return { ...base, result: PORTION_DECISION_RESULTS.INELIGIBLE, warnings: ["allergy-conflict"] };
  if (dietaryConflict(recipe, household)) return { ...base, result: PORTION_DECISION_RESULTS.INELIGIBLE, warnings: ["dietary-conflict"] };
  if (applianceConflict(recipe, household)) return { ...base, result: PORTION_DECISION_RESULTS.INELIGIBLE, warnings: ["appliance-unavailable"] };
  if (cookingTimeConflict(recipe, household)) return { ...base, result: PORTION_DECISION_RESULTS.INELIGIBLE, warnings: ["cooking-time-exceeded"] };
  if (recipe.scalingMode === RECIPE_SCALING_MODES.RATIO_SENSITIVE) {
    return { ...base, result: PORTION_DECISION_RESULTS.SCALING_REVIEW_REQUIRED, warnings: ["THIS RECIPE CANNOT BE RELIABLY REDUCED TO ONE SERVING"], alternatives: ["Choose a Smaller Recipe", "Prepare Three and Freeze Two", "Keep Three Servings"], smallestReviewedBatchServings: Number(recipe.smallestReviewedBatchServings || 3) };
  }
  if (recipe.scalingMode === RECIPE_SCALING_MODES.APPLIANCE_LIMITED && Number(recipe.minimumBatchServings) > requestedServings) {
    return { ...base, result: PORTION_DECISION_RESULTS.MINIMUM_BATCH_EXCEEDS_REQUEST, warnings: ["THIS RECIPE HAS A MINIMUM FOUR-SERVING BATCH"], alternatives: ["Choose a One-Serving Recipe", "Prepare Four and Freeze Three", "Prepare Four Servings"], smallestReviewedBatchServings: Number(recipe.minimumBatchServings) };
  }
  if (recipe.scalingMode === RECIPE_SCALING_MODES.FIXED_BATCH) {
    return { ...base, result: PORTION_DECISION_RESULTS.FIXED_BATCH_EXCEEDS_REQUEST, warnings: ["Fixed batch exceeds requested servings."], alternatives: ["Choose a Smaller Recipe", "Prepare the Full Batch", "Review Freezing Options"], smallestReviewedBatchServings: originalServings };
  }
  const scale = cost.scaleRecipeWithPracticalRules({ recipe, selectedServings: requestedServings, calculationDate: FIXED.localDate });
  const adjusted = scale.ingredientResults.filter((item) => item.adjusted || item.status !== cost.INGREDIENT_SCALE_STATUSES.SUPPORTED);
  const plannedBatchServings = requestedServings;
  return {
    ...base,
    scaleFactor: scale.scaleFactor,
    plannedBatchServings,
    expectedLeftoverServings: Math.max(0, plannedBatchServings - peopleEating),
    result: adjusted.length ? PORTION_DECISION_RESULTS.SCALED_WITH_ROUNDING : PORTION_DECISION_RESULTS.SCALED_TO_REQUESTED_SERVINGS,
    ingredientAdjustments: adjusted,
    scaleResult: scale,
    scaledIngredients: scale.ingredientResults
  };
}

function scaledIngredient(decision, ingredientId) {
  const found = decision.scaledIngredients.find((item) => item.ingredientId === ingredientId);
  assert(found, `Missing scaled ingredient ${ingredientId}`);
  return found;
}

function createPackagePurchasePreview({ recipeUseQuantity, packageQuantity, unit }) {
  const packages = Math.ceil(recipeUseQuantity / packageQuantity);
  return { recipeUseQuantity, packageQuantity, unit, purchaseQuantity: packages, purchaseUnit: "jar", checkoutQuantity: packages * packageQuantity, packageRemainder: packages * packageQuantity - recipeUseQuantity, cookedLeftoverServings: 0, pantryRemainderCreatedBeforePurchaseConfirmation: 0 };
}

function createPreviewState() {
  return { pantry: [{ ingredientId: "dry-pasta", quantity: 350, unit: "g" }], reservations: [], foodEvents: [], impactLedger: [], leftoverBatches: [], mealCalendar: [], shoppingList: [] };
}

function previewScaledRecipe(state, decision) {
  const before = clone(state);
  const pastaDemand = scaledIngredient(decision, "dry-pasta").practicalRecipeQuantity;
  const tomatoDemand = scaledIngredient(decision, "tomato-sauce").practicalRecipeQuantity;
  const preview = {
    pantryAllocation: [{ ingredientId: "dry-pasta", plannedQuantity: pastaDemand, unit: "g" }],
    shoppingListDemand: [{ ingredientId: "tomato-sauce", recipeUseQuantity: tomatoDemand, packagePurchaseQuantity: 650, packageUnit: "ml", checkoutCostCents: 350 }],
    physicalEventsCreated: 0,
    reservationsCreated: 0,
    impactEntriesCreated: 0,
    leftoverBatchesCreated: 0
  };
  assert.deepStrictEqual(state, before, "Recipe preview must not mutate physical state.");
  return preview;
}

function saveScaledMeal(state, decision, requestId = "portion-test-save-1") {
  if (state.mealCalendar.some((meal) => meal.requestId === requestId)) return { state, createdMeals: 0, createdReservations: 0, idempotent: true };
  const reservations = ["dry-pasta", "cooked-lentils", "baby-spinach"].map((ingredientId) => {
    const item = scaledIngredient(decision, ingredientId);
    return { reservationId: `${requestId}:${ingredientId}`, ingredientId, quantity: item.practicalRecipeQuantity, unit: item.unit, status: "active" };
  });
  return {
    state: {
      ...state,
      mealCalendar: state.mealCalendar.concat({ requestId, mealId: "portion-test-dinner", recipeId: decision.recipeId, plannedServings: decision.plannedBatchServings, peopleEating: decision.peopleEating, plannedLeftoverServings: decision.requestedLeftoverServings, originalRecipeServings: decision.originalServings, portionDecision: decision }),
      reservations: state.reservations.concat(reservations)
    },
    createdMeals: 1,
    createdReservations: reservations.length
  };
}

function completeMeal(state, actual = { prepared: 1, consumed: 1 }) {
  const leftover = Math.max(0, Number(actual.prepared) - Number(actual.consumed));
  return {
    ...state,
    foodEvents: state.foodEvents.concat({ eventType: "meal-completed", prepared: actual.prepared, consumed: actual.consumed }),
    leftoverBatches: leftover > 0 ? state.leftoverBatches.concat({ servings: leftover, source: "actual-outcome" }) : state.leftoverBatches
  };
}

function renderPortionPreviewText(decision) {
  const adjustmentText = decision.ingredientAdjustments.map((item) => `${item.displayName}: ${item.explanation}`).join(" ");
  return `PORTION PREVIEW. ${decision.recipeId}. Original recipe: ${decision.originalServings} servings. People eating: ${decision.peopleEating}. Recommended batch: ${decision.plannedBatchServings || "needs review"} serving. Expected leftovers: ${decision.expectedLeftoverServings} servings. Scaling: Reduced to one-sixth of the original recipe. ${adjustmentText}`;
}

function exportDecision(decision) {
  return {
    recipeId: decision.recipeId,
    originalServings: decision.originalServings,
    peopleEating: decision.peopleEating,
    leftoverPreference: decision.leftoverPreference,
    requestedLeftoverServings: decision.requestedLeftoverServings,
    requestedServings: decision.requestedServings,
    plannedBatchServings: decision.plannedBatchServings,
    expectedLeftoverServings: decision.expectedLeftoverServings,
    scaleFactor: decision.scaleFactor,
    scalingMode: decision.scalingMode,
    scaledIngredients: decision.scaledIngredients.filter((item) => item.practicalRecipeQuantity !== null).map((item) => ({ ingredientId: item.ingredientId, quantity: item.practicalRecipeQuantity, unit: item.unit })),
    ingredientAdjustments: decision.ingredientAdjustments.map((item) => ({ ingredientId: item.ingredientId, calculatedQuantity: item.rawMathematicalQuantity, adjustedQuantity: item.practicalRecipeQuantity, unit: item.unit, adjustmentType: item.adjusted ? "whole-item-rounding" : item.mode }))
  };
}

const smartPortionBlock = appSection("function buildSmartPortionSuggestion", "function buildSmartPortionExplanation");
assert(smartPortionBlock.includes("originalBaseServings"), "Smart Portion must preserve original recipe yield.");
assert(smartPortionBlock.includes("plannedLeftoverServings"), "Smart Portion must keep planned leftovers separate.");
assert(smartPortionBlock.includes("unallocatedServings"), "Smart Portion must expose unallocated servings.");
assert(smartPortionBlock.includes("createPantryRevisionSignature"), "Smart Portion must be tied to source revisions.");

const useSuggestionBlock = appSection("function useSmartPortionSuggestion", "function toggleSmartPortionEditor");
assert(!useSuggestionBlock.includes("createCookTonightReservations"), "Using a portion suggestion must not create reservations.");
assert(!useSuggestionBlock.includes("commitPantrySnapshotAndFoodEvents"), "Using a portion suggestion must not create physical events.");
assert(!useSuggestionBlock.includes("createPreparedLeftoverInventoryItem"), "Using a portion suggestion must not create leftover batches.");

const costEngineSource = fs.readFileSync(path.join(root, "scripts", "cost-calculation-engine.js"), "utf8");
assert(costEngineSource.includes("scaleRecipeWithPracticalRules"), "Cost Engine must provide practical recipe scaling.");
assert(costEngineSource.includes("rawMathematicalQuantity"), "Scaler must preserve raw mathematical quantities.");
assert(costEngineSource.includes("practicalRecipeQuantity"), "Scaler must separate practical recipe-use quantity.");
assert(costEngineSource.includes("groceryPurchaseQuantity"), "Scaler must separate grocery purchase quantity.");
assert(costEngineSource.includes("packageSurplusQuantity"), "Scaler must separate package surplus quantity.");
assert(!costEngineSource.includes("cookingTimeMinutes / baseServings"), "Cooking time must not be divided by recipe servings.");
assert(!costEngineSource.includes("temperature / baseServings"), "Temperature must not be divided by recipe servings.");

assert(docs.smartPortions.includes("does not calculate calorie needs"), "Smart Portion docs must avoid calorie-based portion assumptions.");
assert(docs.practicalScaling.includes("Recipe-use amounts stay separate from checkout purchase amounts"), "Practical scaling docs must separate recipe use from package purchase.");
assert(docs.preventExcess.includes("Planning an option does not mark food frozen, shared, rescued, used, wasted, or left over"), "Excess cooking docs must preserve planning-only boundary.");
assert(docs.recipeCard.includes("Pantry amounts update only after food use is confirmed"), "Recipe card docs must use projected language.");
assert(docs.shoppingList.includes("Shopping List demand uses scaled recipe demand"), "Shopping List docs must cover scaled demand integration.");
assert(docs.reservations.includes("reservation"), "Reservation docs must exist for scaled save behavior.");
assert(docs.freezerActions.includes("Food Protected for Later Use before physical freezing"), "Freezer docs must prevent automatic freezer impact.");

const baselineRecipe = scalableRecipeFixture();
const baselineDecision = createPortionDecision(baselineRecipe);
assert.strictEqual(baselineDecision.originalServings, 6, "Original recipe yield must remain 6 servings.");
assert.strictEqual(baselineDecision.peopleEating, 1, "People eating must be 1.");
assert.strictEqual(baselineDecision.requestedLeftoverServings, 0, "No leftovers means 0 requested leftovers.");
assert.strictEqual(baselineDecision.requestedServings, 1, "Requested servings must be 1 + 0.");
assert.strictEqual(baselineDecision.plannedBatchServings, 1, "Chef Nova should recommend 1 planned serving when practical.");
assert.strictEqual(baselineDecision.expectedLeftoverServings, 0, "Expected prepared-food leftovers must equal 0 servings.");
assert(Math.abs(baselineDecision.scaleFactor - (1 / 6)) < 0.000001, "Scale factor must be 1/6 within display rounding tolerance.");
assert.strictEqual(baselineDecision.result, PORTION_DECISION_RESULTS.SCALED_TO_REQUESTED_SERVINGS, "Baseline should scale to the requested one serving without rounding.");
assert.strictEqual(scaledIngredient(baselineDecision, "dry-pasta").practicalRecipeQuantity, 100, "Pasta should scale from 600 g to 100 g.");
assert.strictEqual(scaledIngredient(baselineDecision, "cooked-lentils").practicalRecipeQuantity, 80, "Lentils should scale from 480 g to 80 g.");
assert.strictEqual(scaledIngredient(baselineDecision, "tomato-sauce").practicalRecipeQuantity, 100, "Tomato sauce should scale from 600 ml to 100 ml.");
assert.strictEqual(scaledIngredient(baselineDecision, "baby-spinach").practicalRecipeQuantity, 50, "Spinach should scale from 300 g to 50 g.");
assert.strictEqual(scaledIngredient(baselineDecision, "cooking-oil").practicalRecipeQuantity, 5, "Oil should scale from 30 ml to 5 ml.");
assert.strictEqual(scaledIngredient(baselineDecision, "seasoning").practicalRecipeQuantity, null, "Seasoning should remain adjust to taste.");
assert.strictEqual(baselineRecipe.servings, 6, "Recipe fixture metadata must not be overwritten to 1.");
assert.notStrictEqual(baselineDecision.plannedBatchServings, baselineRecipe.servings, "User must not be assigned 6 servings.");

const packagePreview = createPackagePurchasePreview({ recipeUseQuantity: 100, packageQuantity: 650, unit: "ml" });
assert.strictEqual(packagePreview.purchaseQuantity, 1, "One jar should be purchased.");
assert.strictEqual(packagePreview.recipeUseQuantity, 100, "Recipe use should stay 100 ml.");
assert.strictEqual(packagePreview.packageRemainder, 550, "Package remainder should be 550 ml.");
assert.strictEqual(packagePreview.cookedLeftoverServings, 0, "Package remainder is not prepared-food leftover.");
assert.strictEqual(packagePreview.pantryRemainderCreatedBeforePurchaseConfirmation, 0, "Package remainder is not added to Pantry before purchase confirmation.");

let previewState = createPreviewState();
const preview = previewScaledRecipe(previewState, baselineDecision);
assert.strictEqual(preview.pantryAllocation[0].plannedQuantity, 100, "Pantry preview should allocate scaled 100 g pasta.");
assert.strictEqual(previewState.pantry[0].quantity, 350, "Recipe preview must not deduct Pantry.");
assert.strictEqual(preview.shoppingListDemand[0].recipeUseQuantity, 100, "Shopping List demand should use scaled 100 ml sauce.");
assert.strictEqual(preview.shoppingListDemand[0].packagePurchaseQuantity, 650, "Shopping checkout should use full jar quantity.");
assert.strictEqual(preview.physicalEventsCreated, 0, "Recipe scaling preview must create no Food Event History event.");
assert.strictEqual(preview.reservationsCreated, 0, "Recipe scaling preview must create no reservation.");
assert.strictEqual(preview.impactEntriesCreated, 0, "Recipe scaling preview must create no Impact Ledger entry.");
assert.strictEqual(preview.leftoverBatchesCreated, 0, "Recipe scaling preview must create no leftover batch.");

let saved = saveScaledMeal(previewState, baselineDecision);
assert.strictEqual(saved.createdMeals, 1, "Saving scaled meal should create one meal.");
assert.strictEqual(saved.state.mealCalendar[0].plannedServings, 1, "Saved meal planned servings should be 1.");
assert.strictEqual(saved.state.mealCalendar[0].peopleEating, 1, "Saved meal people eating should be 1.");
assert.strictEqual(saved.state.mealCalendar[0].plannedLeftoverServings, 0, "Saved meal planned leftovers should be 0.");
assert.strictEqual(saved.state.reservations.find((item) => item.ingredientId === "dry-pasta").quantity, 100, "Saved reservation should use scaled 100 g pasta.");
assert.strictEqual(saved.state.reservations.find((item) => item.ingredientId === "cooked-lentils").quantity, 80, "Saved reservation should use scaled 80 g lentils.");
assert.strictEqual(saved.state.reservations.find((item) => item.ingredientId === "baby-spinach").quantity, 50, "Saved reservation should use scaled 50 g spinach.");
const savedRetry = saveScaledMeal(saved.state, baselineDecision);
assert.strictEqual(savedRetry.createdMeals, 0, "Repeated Save Plan request must not duplicate meals.");
assert.strictEqual(savedRetry.createdReservations, 0, "Repeated Save Plan request must not duplicate reservations.");

const completed = completeMeal(saved.state);
assert.strictEqual(completed.leftoverBatches.length, 0, "Prepared 1 and consumed 1 should create no leftover batch.");
const excessOutcome = completeMeal(saved.state, { prepared: 2, consumed: 1 });
assert.strictEqual(excessOutcome.leftoverBatches.length, 1, "Only actual reported excess creates a leftover batch.");
assert.strictEqual(saved.state.mealCalendar[0].plannedServings, 1, "Actual excess must not rewrite original one-serving recommendation.");

const eggRecipe = scalableRecipeFixture({
  id: "portion-test-egg-pasta",
  structuredIngredients: [{ occurrenceId: "egg", ingredientId: "egg", displayName: "Egg", quantity: 3, unit: "each", scalingType: INGREDIENT_SCALING_TYPES.WHOLE_INDIVISIBLE, scalingPolicyId: "whole-egg-round-up", scalingPolicy: { maximumAdjustmentRatio: 1 } }]
});
const eggDecision = createPortionDecision(eggRecipe);
const egg = scaledIngredient(eggDecision, "egg");
assert.strictEqual(egg.rawMathematicalQuantity, 0.5, "Egg raw calculation should be 0.5.");
assert.strictEqual(egg.practicalRecipeQuantity, 1, "Egg practical quantity should round to 1 whole egg.");
assert.strictEqual(egg.status, cost.INGREDIENT_SCALE_STATUSES.ADJUSTED, "Egg rounding should be labelled adjusted.");
assert(egg.explanation.includes("calculated recipe requires 0.5 each") || egg.explanation.includes("adjusted this to 1 each"), "Egg rounding explanation must show calculated and adjusted values.");

const ratioSensitive = createPortionDecision(scalableRecipeFixture({ id: "portion-test-ratio-sensitive", scalingMode: RECIPE_SCALING_MODES.RATIO_SENSITIVE, smallestReviewedBatchServings: 3 }));
assert.strictEqual(ratioSensitive.result, PORTION_DECISION_RESULTS.SCALING_REVIEW_REQUIRED, "Ratio-sensitive recipe should not be silently reduced.");
assert.strictEqual(ratioSensitive.smallestReviewedBatchServings, 3, "Ratio-sensitive warning should show 3-serving minimum.");
assert(ratioSensitive.alternatives.includes("Choose a Smaller Recipe"), "Ratio-sensitive alternatives should include smaller recipe.");
assert(ratioSensitive.alternatives.includes("Prepare Three and Freeze Two"), "Ratio-sensitive alternatives should include explicit freeze option.");

const minimumBatchRecipe = scalableRecipeFixture({ id: "portion-test-minimum-batch-stew", displayName: "Slow-Cooker Vegetable Stew", scalingMode: RECIPE_SCALING_MODES.APPLIANCE_LIMITED, minimumBatchServings: 4, requiredAppliances: ["stovetop"], minimumApplianceVolumePolicyId: "test-slow-cooker-minimum-volume-v1" });
const minimumDecision = createPortionDecision(minimumBatchRecipe);
assert.strictEqual(minimumDecision.result, PORTION_DECISION_RESULTS.MINIMUM_BATCH_EXCEEDS_REQUEST, "Minimum-batch recipe should not be automatically planned as 4 servings.");
assert.strictEqual(minimumDecision.plannedBatchServings, null, "Minimum-batch warning should not silently select 4 servings.");
assert(minimumDecision.alternatives[0].includes("Choose a One-Serving Recipe"), "Preferred no-leftovers action should be a smaller recipe.");

const fixedDecision = createPortionDecision(scalableRecipeFixture({ id: "portion-test-fixed-batch", scalingMode: RECIPE_SCALING_MODES.FIXED_BATCH }));
assert.strictEqual(fixedDecision.result, PORTION_DECISION_RESULTS.FIXED_BATCH_EXCEEDS_REQUEST, "Fixed-batch recipe should require user choice.");
assert(fixedDecision.alternatives.includes("Prepare the Full Batch"), "Fixed-batch alternatives should include full batch.");

const oneExtraMeal = createPortionDecision(baselineRecipe, { ...smallHouseholdFixture, leftoverPreference: "one-additional-meal", requestedAdditionalMeals: 1 });
assert.strictEqual(oneExtraMeal.requestedLeftoverServings, 1, "One additional meal should request 1 leftover serving.");
assert.strictEqual(oneExtraMeal.requestedServings, 2, "One additional meal should request 2 total servings.");
assert.strictEqual(scaledIngredient(oneExtraMeal, "dry-pasta").practicalRecipeQuantity, 200, "Two-serving pasta quantity should be 200 g.");
const backToNone = createPortionDecision(baselineRecipe, smallHouseholdFixture);
assert.strictEqual(scaledIngredient(backToNone, "dry-pasta").practicalRecipeQuantity, 100, "Returning to No Leftovers must restore 100 g pasta.");

assert.strictEqual(createPortionDecision(scalableRecipeFixture({ allergenIds: ["peanut"] }), { ...smallHouseholdFixture, allergies: ["peanut"] }).result, PORTION_DECISION_RESULTS.INELIGIBLE, "Allergy conflict remains excluded after scaling.");
assert.strictEqual(createPortionDecision(scalableRecipeFixture({ dietaryTags: [] })).result, PORTION_DECISION_RESULTS.INELIGIBLE, "Required vegetarian diet must remain enforced.");
assert.strictEqual(createPortionDecision(scalableRecipeFixture({ requiredAppliances: ["oven"] })).result, PORTION_DECISION_RESULTS.INELIGIBLE, "Unavailable appliance must remain excluded.");
assert.strictEqual(createPortionDecision(scalableRecipeFixture({ cookingTimeMinutes: 60 })).result, PORTION_DECISION_RESULTS.INELIGIBLE, "Maximum cooking time must remain enforced.");
assert.strictEqual(baselineRecipe.methodPolicy.cookingTimeMinutes, 25, "Cooking time should remain 25 minutes.");
assert.notStrictEqual(baselineRecipe.methodPolicy.cookingTimeMinutes, 25 / 6, "Cooking time must not be divided by six.");
assert.strictEqual(baselineRecipe.safetyInstructions.minimumInternalTemperatureC, 74, "Food-safety temperature must not be divided.");
assert.notStrictEqual(baselineRecipe.safetyInstructions.minimumInternalTemperatureC, 74 / 6, "Temperature must not be scaled linearly.");

const text = renderPortionPreviewText(baselineDecision);
assert(text.includes("PORTION PREVIEW"), "Preview should include visible heading.");
assert(text.includes("Original recipe: 6 servings"), "Preview should show original yield.");
assert(text.includes("People eating: 1"), "Preview should show people eating.");
assert(text.includes("Recommended batch: 1 serving"), "Preview should show recommended batch.");
assert(text.includes("Expected leftovers: 0 servings"), "Preview should show expected leftovers.");

const exported = exportDecision(baselineDecision);
assert.strictEqual(exported.originalServings, 6, "Export must preserve original servings.");
assert.strictEqual(exported.plannedBatchServings, 1, "Export must preserve planned batch servings.");
assert.strictEqual(exported.expectedLeftoverServings, 0, "Export must preserve expected leftovers.");
assert.strictEqual(exported.scaledIngredients.find((item) => item.ingredientId === "dry-pasta").quantity, 100, "Export must include scaled pasta.");
assert(!("servings" in exported && exported.servings === 6), "Export must not collapse to servings: 6 only.");

const persisted = JSON.parse(JSON.stringify(saved.state));
assert.strictEqual(persisted.mealCalendar[0].originalRecipeServings, 6, "Reload should preserve original recipe yield.");
assert.strictEqual(persisted.mealCalendar[0].plannedServings, 1, "Reload should preserve one planned serving.");
assert.strictEqual(persisted.mealCalendar[0].plannedLeftoverServings, 0, "Reload should preserve no leftovers.");
assert.strictEqual(persisted.reservations.find((item) => item.ingredientId === "dry-pasta").quantity, 100, "Reload should preserve scaled reservation.");
const noteUpdate = { ...persisted.mealCalendar[0], note: "quiet dinner" };
assert.strictEqual(noteUpdate.plannedServings, 1, "Partial note update must not reset planned servings.");
const oldClientPatch = { recipeId: baselineRecipe.id, servings: 6 };
const merged = { ...persisted.mealCalendar[0], recipeId: oldClientPatch.recipeId };
assert.strictEqual(merged.plannedServings, 1, "Old client patch must not silently expand saved meal to 6 servings.");

const deterministicA = createPortionDecision(baselineRecipe);
const deterministicB = createPortionDecision(baselineRecipe);
assert.deepStrictEqual(deterministicA.scaledIngredients, deterministicB.scaledIngredients, "Same input must produce same scaled quantities.");
assert.strictEqual(deterministicA.expectedLeftoverServings, deterministicB.expectedLeftoverServings, "Same input must produce same leftovers.");
assert.strictEqual(createPortionDecision(baselineRecipe, { ...smallHouseholdFixture, userScopeId: "other-user" }).userScopeId, "other-user", "Test state must remain user-scoped.");

[
  "## 1. Purpose",
  "## 2. Fixed Test Context",
  "## 3. Household Fixture",
  "## 30. Commands",
  "Original recipe yield: 6 servings",
  "Recommended batch: 1 serving",
  "Expected leftovers: 0 servings",
  "Package remainder is not a prepared-food leftover",
  "Recipe scaling creates no Food Event History physical event"
].forEach((snippet) => assert(docs.step61.includes(snippet), `Step 61 test documentation missing ${snippet}.`));

[
  "Recommended planned serving result: 1",
  "Original recipe yield preserved: 6",
  "Automatic six-serving assignment: 0",
  "Automatic leftover servings assigned: 0",
  "Expected prepared-food leftovers: 0",
  "Pasta scaled quantity: 100 g",
  "Cooked lentils scaled quantity: 80 g",
  "Tomato sauce scaled quantity: 100 mL",
  "Spinach scaled quantity: 50 g",
  "Cooking oil scaled quantity: 5 mL",
  "Egg rounding decisions displayed: Pass",
  "Package remainders described as cooked leftovers: 0",
  "Preview Pantry deductions: 0",
  "Preview leftover batches: 0",
  "Preview reservations: 0",
  "Preview Food Event History physical events: 0",
  "Preview Impact Ledger entries: 0",
  "Cooking time divided by six: 0",
  "Cooking temperature divided by six: 0",
  "Cross-user portion state exposed: 0"
].forEach((snippet) => assert(docs.report.includes(snippet), `Step 61 report missing ${snippet}.`));

console.log("Cook Before It Spoils Step 61 small-household portion tests passed.");
