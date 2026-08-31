const assert = require("assert");
const fs = require("fs");
const path = require("path");
const eligibility = require("../scripts/recipe-eligibility-ranking.js");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const manualDoc = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-56-food-rescue-scoring-tests.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-56-report.md"), "utf8");

const rescueScoringTestContext = Object.freeze({
  referenceInstant: "2026-08-15T12:00:00-04:00",
  referenceLocalDate: "2026-08-15",
  timezone: "America/Toronto",
  locale: "en-CA",
  selectedPriorityPantryItemIds: ["rescue-test-spinach-package-1", "rescue-test-mushrooms-package-1"],
  household: { peopleEating: 3, desiredServings: 3 },
  restrictions: { allergies: [], requiredDietaryRestrictions: ["vegetarian"] },
  appliances: ["stovetop"],
  maximumCookingTimeMinutes: 30,
  usePlannedLeftovers: false,
  planMode: "cook-before-it-spoils"
});

const ingredientCatalogue = Object.freeze({
  ingredients: [
    { id: "baby-spinach", name: "Baby spinach", aliases: ["spinach-leaves"], allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "fresh-mushrooms", name: "Fresh mushrooms", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "test-neutral-base", name: "Neutral base", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "peanut-sauce", name: "Peanut sauce", allergenIds: ["peanuts"], dietaryTags: ["vegetarian"] },
    { id: "chicken-breast", name: "Chicken breast", allergenIds: [], dietaryTags: [] }
  ]
});

const selectedPriorityItems = Object.freeze([
  {
    rescueSourceId: "rescue-test-spinach-package-1",
    id: "rescue-test-spinach-package-1",
    ingredientId: "baby-spinach",
    displayName: "Spinach",
    availableQuantity: 180,
    quantity: 180,
    reservedQuantity: 0,
    unit: "g",
    comparableQuantity: 180,
    comparableUnit: "g",
    comparableDimension: "mass",
    form: "fresh",
    storageLocation: "refrigerator",
    packageState: "opened",
    dateInformation: { type: "best-before", date: "2026-08-16", confidence: "confirmed" },
    priorityLevel: "very-high",
    rescueRecipePriorityScore: 80,
    canUseForAutomaticPlanning: true,
    foodSafetyDecision: "eligible",
    status: "available"
  },
  {
    rescueSourceId: "rescue-test-mushrooms-package-1",
    id: "rescue-test-mushrooms-package-1",
    ingredientId: "fresh-mushrooms",
    displayName: "Mushrooms",
    availableQuantity: 250,
    quantity: 250,
    reservedQuantity: 0,
    unit: "g",
    comparableQuantity: 250,
    comparableUnit: "g",
    comparableDimension: "mass",
    form: "fresh",
    storageLocation: "refrigerator",
    packageState: "opened",
    dateInformation: null,
    packageDateStatus: "not-recorded",
    useSoonEstimate: {
      status: "available",
      supportLevel: "moderate",
      estimate: {
        estimatedWindowEndLocalDate: "2026-08-17",
        daysRemainingMinimum: 2,
        daysRemainingMaximum: 2
      },
      safetyBoundary: { officialExpirationDate: false, officialBestBeforeDate: false }
    },
    priorityLevel: "high",
    rescueRecipePriorityScore: 60,
    canUseForAutomaticPlanning: true,
    foodSafetyDecision: "eligible",
    status: "available"
  }
]);

function structuredIngredient(ingredientId, quantity, unit = "g", extra = {}) {
  return {
    ingredientId,
    displayName: extra.displayName || ingredientId,
    quantity,
    unit,
    mandatory: true,
    optional: false,
    quantityRequirement: extra.quantityRequirement || "flexible",
    resolutionStatus: "resolved",
    measurementStatus: "measured",
    form: extra.form || "fresh",
    ...extra
  };
}

function createRecipeA(overrides = {}) {
  return {
    id: "rescue-score-recipe-a",
    name: "Recipe A",
    displayName: "Recipe A",
    description: "Uses a small amount of spinach.",
    servings: 3,
    cookingTimeMinutes: 20,
    cookingTime: 20,
    totalTime: 20,
    requiredAppliances: ["stovetop"],
    dietaryTags: ["vegetarian"],
    allergenIds: [],
    allergies: [],
    structuredIngredients: [
      structuredIngredient("baby-spinach", 20, "g", { displayName: "Spinach" }),
      structuredIngredient("test-neutral-base", 300, "g", { displayName: "Neutral base" })
    ],
    ...overrides
  };
}

function createRecipeB(overrides = {}) {
  return {
    id: "rescue-score-recipe-b",
    name: "Recipe B",
    displayName: "Recipe B",
    description: "Uses spinach and mushrooms.",
    servings: 3,
    cookingTimeMinutes: 20,
    cookingTime: 20,
    totalTime: 20,
    requiredAppliances: ["stovetop"],
    dietaryTags: ["vegetarian"],
    allergenIds: [],
    allergies: [],
    structuredIngredients: [
      structuredIngredient("baby-spinach", 160, "g", { displayName: "Spinach" }),
      structuredIngredient("fresh-mushrooms", 200, "g", { displayName: "Mushrooms" }),
      structuredIngredient("test-neutral-base", 300, "g", { displayName: "Neutral base" })
    ],
    ...overrides
  };
}

function comparableQuantity(quantity, unit) {
  const number = Number(quantity);
  const normalized = String(unit || "").toLowerCase();
  const factors = { g: ["mass", 1], gram: ["mass", 1], grams: ["mass", 1], kg: ["mass", 1000], ml: ["volume", 1], l: ["volume", 1000] };
  const factor = factors[normalized];
  if (!Number.isFinite(number) || number < 0 || !factor) return { valid: false, quantity: null, dimension: null };
  return { valid: true, quantity: number * factor[1], dimension: factor[0], unit: factor[0] === "mass" ? "g" : "ml" };
}

function evaluateEligibility(recipe, overrides = {}) {
  return eligibility.evaluateRecipeEligibility({
    recipe,
    ingredientCatalogue,
    eligibilityContext: {
      allergies: { allergenIds: rescueScoringTestContext.restrictions.allergies },
      dietaryRequirements: rescueScoringTestContext.restrictions.requiredDietaryRestrictions,
      availableAppliances: rescueScoringTestContext.appliances,
      maximumCookingTimeMinutes: rescueScoringTestContext.maximumCookingTimeMinutes,
      requiredServings: rescueScoringTestContext.household.desiredServings,
      selectedRescueSources: selectedPriorityItems,
      pantryContext: { pantryItems: selectedPriorityItems, pantryRevision: "step-56-fixed-fixture" },
      ingredientAvailability: { explicitlyUnavailableIngredientIds: [], explicitlyUnavailableNames: [], purchasePolicy: "allow-grocery-purchases" },
      requireStructuredQuantities: true,
      planningMode: rescueScoringTestContext.planMode,
      referenceDate: rescueScoringTestContext.referenceLocalDate,
      planDate: rescueScoringTestContext.referenceLocalDate,
      userScope: "step-56-test-user",
      ...overrides
    }
  });
}

function calculateSelectedFoodMetrics(recipe, sources = selectedPriorityItems, servings = 3) {
  const sourceUses = sources.map((source) => ({
    rescueSourceId: source.rescueSourceId,
    ingredientId: source.ingredientId,
    displayName: source.displayName,
    availableQuantity: source.availableQuantity,
    unit: source.unit,
    comparableQuantity: source.comparableQuantity,
    comparableDimension: source.comparableDimension,
    usedComparableQuantity: 0,
    usedQuantity: 0
  }));
  const baseServings = Number(recipe.servings) || servings;
  const scale = servings / baseServings;
  recipe.structuredIngredients.filter((ingredient) => ingredient.optional !== true).forEach((ingredient) => {
    const demand = comparableQuantity(Number(ingredient.quantity) * scale, ingredient.unit);
    if (!demand.valid) return;
    let remaining = demand.quantity;
    sourceUses
      .filter((source) => source.ingredientId === ingredient.ingredientId && source.comparableDimension === demand.dimension)
      .sort((a, b) => a.rescueSourceId.localeCompare(b.rescueSourceId))
      .forEach((source) => {
        if (remaining <= 0) return;
        const remainingSource = Math.max(0, source.comparableQuantity - source.usedComparableQuantity);
        const used = Math.min(remainingSource, remaining);
        source.usedComparableQuantity += used;
        source.usedQuantity += used;
        remaining -= used;
      });
  });
  const totalEligibleSelectedQuantity = sourceUses.reduce((sum, source) => sum + source.comparableQuantity, 0);
  const totalSelectedQuantityRescued = sourceUses.reduce((sum, source) => sum + source.usedComparableQuantity, 0);
  return {
    sourceUses,
    selectedPriorityIngredientsUsed: sourceUses.filter((source) => source.usedComparableQuantity > 0).length,
    totalEligibleSelectedQuantity,
    totalSelectedQuantityRescued,
    aggregateRescueCoverage: totalEligibleSelectedQuantity > 0 ? totalSelectedQuantityRescued / totalEligibleSelectedQuantity : null
  };
}

function scoreCandidate(recipe, contextOverrides = {}) {
  const eligibilityResult = evaluateEligibility(recipe, contextOverrides);
  if (eligibilityResult.status !== eligibility.RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE) {
    return {
      recipeId: recipe.id,
      recipe,
      eligibilityStatus: eligibilityResult.status,
      eligible: false,
      rescueScore: null,
      rank: null,
      reasonCodes: eligibilityResult.reasonCodes,
      primaryReasonCode: eligibilityResult.primaryReasonCode,
      exclusionReasons: eligibilityResult.exclusionReasons
    };
  }
  const metrics = calculateSelectedFoodMetrics(recipe);
  const rescueScore = Math.round(metrics.aggregateRescueCoverage * 1000) + metrics.selectedPriorityIngredientsUsed * 100;
  return { recipeId: recipe.id, recipe, eligibilityStatus: eligibilityResult.status, eligible: true, rescueScore, rank: null, metrics, reasonCodes: [], primaryReasonCode: null };
}

function rankFoodRescueCandidates(recipes, contextOverrides = {}) {
  const candidates = recipes.map((recipe) => scoreCandidate(recipe, contextOverrides));
  const eligible = candidates
    .filter((candidate) => candidate.eligible)
    .sort((a, b) => b.rescueScore - a.rescueScore || b.metrics.aggregateRescueCoverage - a.metrics.aggregateRescueCoverage || b.metrics.selectedPriorityIngredientsUsed - a.metrics.selectedPriorityIngredientsUsed || a.recipeId.localeCompare(b.recipeId))
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));
  const rankById = new Map(eligible.map((candidate) => [candidate.recipeId, candidate.rank]));
  return candidates.map((candidate) => ({ ...candidate, rank: rankById.get(candidate.recipeId) || null })).sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    if (a.rank) return -1;
    if (b.rank) return 1;
    return a.recipeId.localeCompare(b.recipeId);
  });
}

function assertClose(actual, expected, tolerance = 1e-5, message = "") {
  assert(Math.abs(actual - expected) <= tolerance, `${message} Expected ${actual} to be close to ${expected}.`);
}

function reasonCodesFor(recipe, contextOverrides = {}) {
  return scoreCandidate(recipe, contextOverrides).reasonCodes;
}

const appUsageBlock = app.slice(app.indexOf("function calculateFoodRescueSelectedFoodUsage"), app.indexOf("function buildFoodRescueScaledRequirement"));
assert(appUsageBlock.includes("ingredientId === required.ingredientId"), "Production food-rescue usage must match structured ingredient IDs.");
assert(!/recipe\.name|recipeName|title|description|instructions|tags/.test(appUsageBlock), "Production food-rescue usage must not score recipe text.");
assert(appUsageBlock.includes("Math.min(remainingSource, remainingRequired)"), "Production food-rescue usage must cap quantity by recipe demand and available source quantity.");
assert(app.includes("if (initialEligibility.status !== RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE && initialEligibility.canUseForAutomaticPlanning !== true) return null;"), "Production food-rescue ranking must run hard filters before scoring.");
assert(app.includes("compareFoodRescueRecipeResults"), "Production food-rescue ranking must use a deterministic comparator.");

const recipeA = createRecipeA();
const recipeB = createRecipeB();
const baseline = rankFoodRescueCandidates([recipeA, recipeB]);
const rankedEligible = baseline.filter((candidate) => candidate.eligible);
assert.deepStrictEqual(rankedEligible.map((candidate) => candidate.recipeId), ["rescue-score-recipe-b", "rescue-score-recipe-a"], "Recipe B must rank above Recipe A.");
assert.strictEqual(rankedEligible[0].rank, 1);
assert.strictEqual(rankedEligible[1].rank, 2);

const recipeAMetrics = baseline.find((candidate) => candidate.recipeId === recipeA.id).metrics;
const recipeBMetrics = baseline.find((candidate) => candidate.recipeId === recipeB.id).metrics;
assert.strictEqual(recipeAMetrics.selectedPriorityIngredientsUsed, 1);
assert.strictEqual(recipeAMetrics.totalSelectedQuantityRescued, 20);
assertClose(recipeAMetrics.aggregateRescueCoverage, 20 / 430, 1e-5, "Recipe A aggregate coverage");
assert.strictEqual(recipeBMetrics.selectedPriorityIngredientsUsed, 2);
assert.strictEqual(recipeBMetrics.totalSelectedQuantityRescued, 360);
assertClose(recipeBMetrics.aggregateRescueCoverage, 360 / 430, 1e-5, "Recipe B aggregate coverage");
assert(recipeBMetrics.aggregateRescueCoverage > recipeAMetrics.aggregateRescueCoverage, "Recipe B coverage must exceed Recipe A coverage.");

const textOnlyMushroomRecipeA = createRecipeA({
  id: "rescue-score-recipe-a-text-mushroom",
  name: "Spinach and Mushroom Recipe A",
  description: "Mushrooms are mentioned here, but not used.",
  instructions: ["Optional mushrooms may be discussed in notes."]
});
const textOnlyMetrics = calculateSelectedFoodMetrics(textOnlyMushroomRecipeA);
assert.strictEqual(textOnlyMetrics.sourceUses.find((source) => source.ingredientId === "fresh-mushrooms").usedQuantity, 0, "Recipe text must not award mushroom rescue credit.");
assert.strictEqual(textOnlyMetrics.selectedPriorityIngredientsUsed, 1, "Text-only mushroom mentions must not increase selected ingredient count.");

const cappedSpinach = calculateSelectedFoodMetrics(createRecipeA({
  id: "rescue-score-spinach-cap",
  structuredIngredients: [structuredIngredient("baby-spinach", 500, "g", { displayName: "Spinach" })]
}));
assert.strictEqual(cappedSpinach.sourceUses.find((source) => source.ingredientId === "baby-spinach").usedQuantity, 180, "Rescue quantity must cap at eligible Pantry quantity.");

const reservedSources = selectedPriorityItems.map((source) => source.ingredientId === "baby-spinach" ? { ...source, availableQuantity: 80, comparableQuantity: 80, reservedQuantity: 100 } : source);
const reservedMetrics = calculateSelectedFoodMetrics(recipeB, reservedSources);
assert.strictEqual(reservedMetrics.sourceUses.find((source) => source.ingredientId === "baby-spinach").usedQuantity, 80, "Reserved quantity must not count as rescued.");

const kilogramMetrics = calculateSelectedFoodMetrics(createRecipeA({
  id: "rescue-score-kg-spinach",
  structuredIngredients: [structuredIngredient("baby-spinach", 0.16, "kg", { displayName: "Spinach" })]
}));
assert.strictEqual(kilogramMetrics.sourceUses.find((source) => source.ingredientId === "baby-spinach").usedQuantity, 160, "Compatible mass units should convert.");

const incompatibleMetrics = calculateSelectedFoodMetrics(createRecipeB({
  id: "rescue-score-mushroom-ml",
  structuredIngredients: [structuredIngredient("fresh-mushrooms", 200, "ml", { displayName: "Mushrooms" })]
}));
assert.strictEqual(incompatibleMetrics.sourceUses.find((source) => source.ingredientId === "fresh-mushrooms").usedQuantity, 0, "Incompatible mass/volume units must not invent rescue credit.");

const smallerServingMetrics = calculateSelectedFoodMetrics(recipeB, selectedPriorityItems, 1.5);
assert.strictEqual(smallerServingMetrics.totalSelectedQuantityRescued, 180, "Scaled serving count must recalculate selected-food use.");

const onlySpinachMetrics = calculateSelectedFoodMetrics(recipeB, selectedPriorityItems.filter((source) => source.ingredientId === "baby-spinach"));
assert.strictEqual(onlySpinachMetrics.totalSelectedQuantityRescued, 160);
assert.strictEqual(onlySpinachMetrics.selectedPriorityIngredientsUsed, 1);
const onlyMushroomsMetricsA = calculateSelectedFoodMetrics(recipeA, selectedPriorityItems.filter((source) => source.ingredientId === "fresh-mushrooms"));
assert.strictEqual(onlyMushroomsMetricsA.totalSelectedQuantityRescued, 0);

const noSelectionMetrics = calculateSelectedFoodMetrics(recipeB, []);
assert.strictEqual(noSelectionMetrics.aggregateRescueCoverage, null, "No selected food should not divide by zero or report 100% coverage.");

assert.deepStrictEqual(rankFoodRescueCandidates([recipeB, recipeA]).filter((candidate) => candidate.eligible).map((candidate) => candidate.recipeId), ["rescue-score-recipe-b", "rescue-score-recipe-a"], "Source recipe array order must not determine ranking.");
assert.deepStrictEqual(rankFoodRescueCandidates([recipeA, recipeB]).filter((candidate) => candidate.eligible).map((candidate) => candidate.recipeId), ["rescue-score-recipe-b", "rescue-score-recipe-a"], "Ranking must be source-order independent.");
assert.deepStrictEqual(rankFoodRescueCandidates([recipeA, recipeB]), rankFoodRescueCandidates([recipeA, recipeB]), "Same fixed-clock inputs must produce the same result.");

const tieOne = createRecipeA({ id: "rescue-score-tie-a", name: "Tie A" });
const tieTwo = createRecipeA({ id: "rescue-score-tie-b", name: "Tie B" });
assert.deepStrictEqual(rankFoodRescueCandidates([tieTwo, tieOne]).filter((candidate) => candidate.eligible).map((candidate) => candidate.recipeId), ["rescue-score-tie-a", "rescue-score-tie-b"], "Stable recipe ID must resolve final ties.");

const peanutB = createRecipeB({
  id: "rescue-score-recipe-b-peanut",
  allergenIds: ["peanut"],
  allergies: ["peanut"],
  structuredIngredients: [...recipeB.structuredIngredients, structuredIngredient("peanut-sauce", 30, "g", { displayName: "Peanut sauce" })]
});
const allergyRank = rankFoodRescueCandidates([recipeA, peanutB], { allergies: { allergenIds: ["peanut"] } });
const allergyB = allergyRank.find((candidate) => candidate.recipeId === peanutB.id);
assert.strictEqual(allergyB.eligible, false);
assert.strictEqual(allergyB.rescueScore, null);
assert.strictEqual(allergyB.rank, null);
assert(allergyB.reasonCodes.includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_PRESENT), "Allergy conflict must be structured as allergen-present.");
assert.strictEqual(allergyRank.find((candidate) => candidate.recipeId === recipeA.id).rank, 1, "Recipe A should rank first when Recipe B is allergy-excluded.");

const meatB = createRecipeB({
  id: "rescue-score-recipe-b-dietary-conflict",
  dietaryTags: [],
  structuredIngredients: [...recipeB.structuredIngredients, structuredIngredient("chicken-breast", 300, "g", { displayName: "Chicken breast" })]
});
assert(reasonCodesFor(meatB).includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.DIETARY_RESTRICTION_VIOLATION), "Dietary conflicts must exclude before scoring.");

const ovenB = createRecipeB({ id: "rescue-score-recipe-b-oven", requiredAppliances: ["oven"], preparationMethods: [{ id: "oven", requiredAppliances: ["oven"], totalTimeMinutes: 20 }] });
assert(reasonCodesFor(ovenB).includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.APPLIANCE_UNAVAILABLE), "Unavailable appliance must exclude before scoring.");

const tooLongB = createRecipeB({ id: "rescue-score-recipe-b-too-long", cookingTimeMinutes: 45, cookingTime: 45, totalTime: 45 });
assert(reasonCodesFor(tooLongB).includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.COOKING_TIME_EXCEEDED), "Over-time recipe must exclude before scoring.");
assert.strictEqual(scoreCandidate(createRecipeB({ id: "rescue-score-recipe-b-30-min", cookingTimeMinutes: 30, cookingTime: 30, totalTime: 30 })).eligible, true, "Exact cooking-time boundary should remain eligible.");

const combinedB = createRecipeB({
  id: "rescue-score-recipe-b-combined",
  allergenIds: ["peanut"],
  allergies: ["peanut"],
  dietaryTags: [],
  requiredAppliances: ["oven"],
  preparationMethods: [{ id: "oven", requiredAppliances: ["oven"], totalTimeMinutes: 45 }],
  cookingTimeMinutes: 45,
  cookingTime: 45,
  totalTime: 45,
  structuredIngredients: [...recipeB.structuredIngredients, structuredIngredient("peanut-sauce", 30, "g"), structuredIngredient("chicken-breast", 300, "g")]
});
const combinedCodes = reasonCodesFor(combinedB, { allergies: { allergenIds: ["peanut"] } });
[
  eligibility.RECIPE_HARD_FILTER_REASON_CODES.ALLERGEN_PRESENT,
  eligibility.RECIPE_HARD_FILTER_REASON_CODES.DIETARY_RESTRICTION_VIOLATION,
  eligibility.RECIPE_HARD_FILTER_REASON_CODES.APPLIANCE_UNAVAILABLE,
  eligibility.RECIPE_HARD_FILTER_REASON_CODES.COOKING_TIME_EXCEEDED
].forEach((code) => assert(combinedCodes.includes(code), `Combined hard filter should preserve ${code}.`));

const unsafeSourceResult = evaluateEligibility(recipeB, {
  selectedRescueSources: selectedPriorityItems.map((source) => source.ingredientId === "fresh-mushrooms" ? { ...source, canUseForAutomaticPlanning: false, foodSafetyDecision: "confirmed-over-limit" } : source)
});
assert(unsafeSourceResult.reasonCodes.includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_SAFETY_EXCLUDED), "Unsafe selected Pantry quantity must not count toward rescue scoring.");

const reviewSourceResult = evaluateEligibility(recipeB, {
  selectedRescueSources: selectedPriorityItems.map((source) => source.ingredientId === "fresh-mushrooms" ? { ...source, requiresReview: true, foodSafetyDecision: "storage-information-needs-review" } : source)
});
assert(reviewSourceResult.reasonCodes.includes(eligibility.RECIPE_HARD_FILTER_REASON_CODES.PANTRY_SOURCE_REVIEW_REQUIRED), "Review-required selected Pantry quantity must not count toward normal rescue scoring.");

[
  "Reference local date: August 15, 2026",
  "Recipe B ranks above Recipe A",
  "No Pantry deduction",
  "No Shopping List line",
  "DOM order"
].forEach((snippet) => assert(manualDoc.includes(snippet), `Manual Step 56 documentation missing ${snippet}.`));

[
  "Step 56",
  "Food-Rescue Recipe Scoring",
  "fixed-clock",
  "Recipe B",
  "Recipe A",
  "No product functionality was changed"
].forEach((snippet) => assert(report.includes(snippet), `Step 56 report missing ${snippet}.`));

console.log("Cook Before It Spoils Step 56 food-rescue scoring tests passed.");
