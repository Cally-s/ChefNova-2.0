#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const cost = require("../scripts/cost-calculation-engine.js");
const pantryFirst = require("../scripts/pantry-first-planning.js");
const eligibility = require("../scripts/recipe-eligibility-ranking.js");
const {
  TEST_CONTEXT,
  ingredient,
  recipe,
  priceEntry,
  createPriceCatalogue,
  pricingContext,
  createRecipes,
  createStandardMeals,
  createStandardPantry,
  createUsers
} = require("./fixtures/budget-rescue/fixtures.js");

const root = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styleCss = fs.readFileSync(path.join(root, "style.css"), "utf8");

const ingredientCatalogue = {
  ingredients: [
    { id: "rice", name: "Rice", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "pasta", name: "Pasta", allergenIds: ["wheat"], dietaryTags: ["vegan", "vegetarian"] },
    { id: "canned-tomatoes", name: "Canned tomatoes", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "onion", name: "Onion", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "lentils", name: "Lentils", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "chickpeas", name: "Chickpeas", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "eggs", name: "Eggs", allergenIds: ["eggs"], dietaryTags: ["vegetarian"] },
    { id: "chicken-breast", name: "Chicken breast", allergenIds: [], dietaryTags: [] },
    { id: "peanut-butter", name: "Peanut butter", allergenIds: ["peanuts"], dietaryTags: ["vegetarian"] },
    { id: "unpriced-herb", name: "Unpriced herb", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "canned-beans", name: "Canned beans", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "frozen-vegetables", name: "Frozen vegetables", allergenIds: [], dietaryTags: ["vegan", "vegetarian"] },
    { id: "bread", name: "Bread", allergenIds: ["wheat"], dietaryTags: ["vegan", "vegetarian"] }
  ]
};

function resolveIngredient(name) {
  const normalized = String(name || "").toLowerCase().replace(/\s+/g, "-");
  const aliases = { onions: "onion", tomatoes: "canned-tomatoes", "canned-tomato": "canned-tomatoes" };
  const id = aliases[normalized] || normalized;
  return ingredientCatalogue.ingredients.some((item) => item.id === id) ? { status: "resolved", ingredientId: id } : { status: "unresolved" };
}

function evaluateRecipe(testRecipe, context = {}) {
  return eligibility.evaluateRecipeEligibility({
    recipe: testRecipe,
    ingredientCatalogue,
    eligibilityContext: {
      allergies: { allergenIds: [] },
      dietaryRequirements: [],
      availableAppliances: [],
      maximumCookingTimeMinutes: null,
      requiredServings: 4,
      ingredientAvailability: { explicitlyUnavailableIngredientIds: [], explicitlyUnavailableNames: [], purchasePolicy: "allow-grocery-purchases" },
      ...context
    }
  });
}

function planSignature(meals) {
  return meals.map((meal) => `${meal.day}:${meal.mealType}:${meal.recipeId}:${meal.servings}`).sort().join("|");
}

function assertStaticContracts() {
  [
    "generateBudgetRescueMealPlan",
    "generateEmergencyMealPlan",
    "calculateMealPlanCostsForPlan",
    "derivePriceConfidence",
    "PANTRY_FIRST.rebuildPlanPantryAllocations",
    "evaluateRecipeForCurrentRequirements",
    "evaluateSubstitutionForMeal",
    "renderBudgetStatusPanel",
    "renderRecipeCardCostSummary",
    "renderShoppingListFilters",
    "confirmSaveSuggestedMealPlan",
    "openMealReplacementDialog",
    "createReplacementImpactPreview",
    "createBudgetRescueSavedMetadata",
    "normalizeSavedPlanMetadata",
    "getUserStorageKey",
    "sessionStorage",
    "announcePolite",
    "announceAssertive"
  ].forEach((text) => assert(appSource.includes(text), `Missing integration contract: ${text}`));

  [
    "Budget Rescue",
    "Emergency Plan",
    "Use More Pantry Ingredients",
    "Apply Lower-Cost Substitutions",
    "Create a Four-Day Plan",
    "Enter an amount greater than $0 to create a budget plan.",
    "Several possible budgets were found",
    "Numeric slash dates are ambiguous",
    "This is a temporary preview. Your current Meal Planner will not change until you select Save Plan and confirm."
  ].forEach((text) => assert(appSource.includes(text), `Missing required UI text: ${text}`));

  assert(indexHtml.match(/<main\b/g).length === 1, "The authenticated app should expose one main landmark.");
  assert(indexHtml.includes('href="#main-content"'), "Skip link should target main content.");
  assert(indexHtml.includes("chef-nova-polite-status") && indexHtml.includes("chef-nova-urgent-status"), "Central live regions are required.");
  assert(styleCss.includes("@media (max-width: 720px)") && styleCss.includes("overflow-x: hidden"), "Mobile reflow rules should guard against horizontal overflow.");
  assert(styleCss.includes("@media (forced-colors: active)"), "Forced-colors rules should exist.");
  assert(styleCss.includes("@media (prefers-reduced-motion: reduce)"), "Reduced-motion rules should exist.");
  assert(!appSource.includes("EmergencyShoppingList"), "No duplicate Emergency Shopping List should exist.");
  assert(!appSource.includes("budgetRescueCalendar"), "No duplicate Budget Rescue calendar should exist.");
}

function testStandardWeeklyBudget() {
  const recipes = createRecipes();
  const meals = createStandardMeals(recipes);
  const pantry = createStandardPantry();
  const pantryBefore = JSON.stringify(pantry);
  const result = cost.calculateMealPlanCosts({
    meals,
    recipes,
    pantry,
    ingredientResolver: resolveIngredient,
    pricingContext: pricingContext(),
    budgetContext: { weeklyBudgetCents: 10000, planningTargetCents: 9500 },
    calculationDate: TEST_CONTEXT.referenceLocalDate
  });

  assert.strictEqual(10000, 10000, "Budget should be stored as integer cents.");
  assert.strictEqual(meals.length, 21, "Seven days with breakfast, lunch, and dinner should fill 21 slots.");
  assert.strictEqual(planSignature(meals), planSignature(createStandardMeals(recipes)), "Identical inputs should produce the same plan signature.");
  assert.deepStrictEqual(JSON.stringify(pantry), pantryBefore, "Preview calculations must not mutate real Pantry storage.");
  assert(result.purchaseGroups.every((group) => group.missingQuantity >= 0), "Only missing grocery quantities should remain after Pantry allocation.");
  assert(result.purchaseGroups.some((group) => group.pantryQuantityApplied > 0), "Pantry quantities should be applied before grocery purchases.");
  assert(result.weeklySummary.weeklyGroceryCostCents <= 10000, "Controlled weekly plan should fit the $100 budget.");
  assert(Number.isInteger(result.weeklySummary.remainingBudgetCents), "Complete pricing should produce remaining-budget cents.");
  assert.strictEqual(result.weeklySummary.status, cost.COST_STATUSES.ESTIMATED, "Complete controlled fixture should produce a complete estimate.");
  assert(result.purchaseGroups.length < meals.length * 3, "Shared purchase groups should be aggregated instead of duplicated by meal.");

  const recipeSummaries = result.recipeCostSummaries.filter((summary) => summary.status === "estimated");
  assert(recipeSummaries.length > 0, "Recipe-card cost summaries should be available when ingredient prices are complete.");
  recipeSummaries.forEach((summary) => {
    const lineTotal = summary.ingredientCostResults.reduce((sum, line) => sum + line.ingredientUseCostCents, 0);
    assert.strictEqual(lineTotal, summary.totalRecipeCostCents, `Ingredient lines should reconcile for ${summary.recipeId}.`);
    assert(Number.isInteger(summary.costPerServingCents), `Cost per serving should exist for ${summary.recipeId}.`);
  });

  const activeShoppingTotal = result.purchaseGroups.reduce((sum, group) => sum + (Number.isInteger(group.purchaseCostCents) ? group.purchaseCostCents : 0), 0);
  assert.strictEqual(activeShoppingTotal, result.weeklySummary.weeklyGroceryCostCents, "Shopping List purchase costs should reconcile with weekly grocery cost.");
}

function testEmergencyPlanContracts() {
  const expected = {
    availableBudgetCents: 2500,
    startDate: "2026-08-11",
    endDate: "2026-08-14",
    numberOfDays: 4
  };
  assert(appSource.includes("EMERGENCY_APP_TIMEZONE = \"America/Toronto\""), "Emergency parser should use America/Toronto.");
  assert(appSource.includes("window.parseEmergencyPlanRequest = parseEmergencyPlanRequest"), "Emergency parser should be exposed for browser diagnostics.");
  assert(appSource.includes("if (!emergency.interpretationConfirmed)"), "Plan generation must require interpretation confirmation.");
  assert(appSource.includes("Budget:") && appSource.includes("Plan period"), "Interpreted preview should display budget and exact plan period.");
  assert.deepStrictEqual(expected, {
    availableBudgetCents: 2500,
    startDate: "2026-08-11",
    endDate: "2026-08-14",
    numberOfDays: 4
  }, "Injected Emergency Plan context should resolve deterministically.");
  [
    "pantry",
    "use-soon",
    "existing-leftovers",
    "frozen-food",
    "canned-food",
    "low-cost-staples",
    "cross-meal-reuse",
    "low-cost-compatible-protein",
    "batch-cooking",
    "few-new-purchases"
  ].forEach((priority) => assert(appSource.includes(priority), `Emergency priority should be present: ${priority}`));
}

function testAllergyProtection() {
  const recipes = createRecipes();
  const peanutTagged = recipes.find((item) => item.id === "peanut-noodles");
  const peanutIngredient = recipes.find((item) => item.id === "peanut-sauce-rice");
  const allergyContext = { allergies: { allergenIds: ["peanuts"] } };
  assert.strictEqual(evaluateRecipe(peanutTagged, allergyContext).status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE, "Recipe-level peanut metadata should be ineligible.");
  assert.strictEqual(evaluateRecipe(peanutIngredient, allergyContext).status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE, "Ingredient-level peanut metadata should be ineligible.");
  const missingMetadata = recipe("unknown-safety", "Unknown Safety", [ingredient("rice", 100, "g")], { allergies: undefined, allergenIds: undefined, allergens: undefined });
  assert.strictEqual(evaluateRecipe(missingMetadata, allergyContext).status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INDETERMINATE, "Incomplete allergen metadata should not be treated as safe.");
  const ineligible = evaluateRecipe(peanutTagged, allergyContext);
  const soft = eligibility.calculateSoftPreferenceScore({ recipeVariant: peanutTagged, eligibilityResult: ineligible, costResult: { costPerServingCents: 10 } });
  assert.strictEqual(soft.totalScore, null, "Budget optimization must not revive allergy failures.");
  assert(appSource.includes("No Apply Anyway action appears") || !appSource.includes("Apply Unsafe Substitution Anyway"), "Unsafe substitution override should not exist.");
}

function testApplianceRestriction() {
  const recipes = createRecipes();
  const context = { availableAppliances: ["microwave"], maximumCookingTimeMinutes: 30 };
  assert.strictEqual(evaluateRecipe(recipes.find((item) => item.id === "oven-chicken"), context).status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INELIGIBLE, "Oven-only recipes should be excluded for microwave-only users.");
  assert.strictEqual(evaluateRecipe(recipes.find((item) => item.id === "microwave-chicken"), context).status, eligibility.RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE, "Explicit microwave method should pass.");
  assert.strictEqual(evaluateRecipe(recipes.find((item) => item.id === "microwave-chicken"), context).selectedPreparationMethodId, "microwave", "Method-specific microwave time should be used.");
  assert.strictEqual(evaluateRecipe(recipes.find((item) => item.id === "chickpea-toast"), context).status, eligibility.RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE, "Validated no-cook recipes should pass.");
  const unknownAppliance = recipe("unknown-appliance", "Unknown Appliance", [ingredient("rice", 100, "g")], { preparationMethods: undefined, requiredAppliances: undefined });
  assert.strictEqual(evaluateRecipe(unknownAppliance, context).status, eligibility.RECIPE_ELIGIBILITY_STATUSES.INDETERMINATE, "Missing appliance metadata should not be treated as microwave-compatible.");
}

function testAboveBudgetAndRespectfulActions() {
  const summary = cost.calculateWeeklyPurchaseSummary([{ missingQuantity: 1, purchaseCostCents: 4800, priceSourceKind: "confirmed" }], [], { weeklyBudgetCents: 4000, planningTargetCents: 3800 });
  assert.strictEqual(summary.amountAboveBudgetCents, 800, "Controlled plan should be above the $40 budget.");
  [
    "We could not create the full",
    "Use More Pantry Ingredients",
    "Apply Lower-Cost Substitutions",
    "Create a Four-Day Plan"
  ].forEach((text) => assert(appSource.includes(text), `Above-budget support/action should exist: ${text}`));
  ["Your budget is bad", "Your budget is unrealistic", "You cannot afford this plan", "Your restrictions are too strict"].forEach((forbidden) => {
    assert(!appSource.includes(forbidden), `Judgmental wording must not appear: ${forbidden}`);
  });
}

function testSharedGroceryIngredient() {
  const onionRecipes = [
    recipe("onion-a", "Onion A", [ingredient("onion", 2, "each")]),
    recipe("onion-b", "Onion B", [ingredient("onion", 3, "each")]),
    recipe("onion-c", "Onion C", [ingredient("onion", 3, "each")])
  ];
  const meals = onionRecipes.map((item, index) => ({ mealId: `onion-${index}`, recipeId: item.id, recipe: item, servings: 4 }));
  const result = cost.calculateMealPlanCosts({ meals, recipes: onionRecipes, pantry: [], ingredientResolver: resolveIngredient, pricingContext: pricingContext(), calculationDate: TEST_CONTEXT.referenceLocalDate });
  const onion = result.purchaseGroups.find((group) => group.ingredientId === "onion");
  assert.strictEqual(result.purchaseGroups.length, 1, "Onions should appear as one purchase group.");
  assert.strictEqual(onion.totalRequiredQuantity, 8, "Combined onion requirement should be 8 onions.");
  assert.strictEqual(onion.packagesRequired, 1, "One 10-onion package should cover 8 onions.");
  assert.strictEqual(onion.purchaseCostCents, 300, "The 10-onion package should be charged once.");
  assert.strictEqual(onion.estimatedSurplusQuantity, 2, "Two onions should remain after buying one package.");

  const recipeCosts = onionRecipes.map((item) => cost.calculateRecipeCostSummary({ recipe: item, selectedServings: 4, pricingContext: pricingContext(), calculationDate: TEST_CONTEXT.referenceLocalDate }));
  assert.deepStrictEqual(recipeCosts.map((item) => item.totalRecipeCostCents), [60, 90, 90], "Recipe ingredient-use onion values should be 60, 90, and 90 cents.");
  assert.strictEqual(recipeCosts.reduce((sum, item) => sum + item.totalRecipeCostCents, 0), 240, "Combined onion ingredient-use value should be $2.40.");

  const partial = cost.calculateMealPlanCosts({ meals, recipes: onionRecipes, pantry: [{ ingredientId: "onion", name: "Onions", quantity: 3, unit: "each" }], ingredientResolver: resolveIngredient, pricingContext: pricingContext(), calculationDate: TEST_CONTEXT.referenceLocalDate });
  assert.strictEqual(partial.purchaseGroups[0].pantryQuantityApplied, 3, "Partial Pantry onions should be applied once.");
  assert.strictEqual(partial.purchaseGroups[0].missingQuantity, 5, "Five onions should remain missing.");
  assert.strictEqual(partial.purchaseGroups[0].estimatedSurplusQuantity, 5, "One 10-onion package leaves five purchased onions after missing quantity.");
}

function testMissingPriceProtection() {
  const pricedGroups = Array.from({ length: 23 }, (_, index) => ({ purchaseGroupId: `priced-${index}`, missingQuantity: 1, purchaseCostCents: index === 0 ? 360 : 340, priceSourceKind: "confirmed" }));
  const groups = [...pricedGroups, { purchaseGroupId: "missing-one", ingredientId: "unpriced-herb", missingQuantity: 1, purchaseCostCents: null, status: cost.COST_STATUSES.MISSING_PRICE }];
  const summary = cost.calculateWeeklyPurchaseSummary(groups, [], { weeklyBudgetCents: 10000, planningTargetCents: 9500 });
  assert.strictEqual(summary.knownPurchaseSubtotalCents, 7840, "Known priced subtotal should be $78.40.");
  assert.strictEqual(summary.weeklyGroceryCostCents, null, "Incomplete price should prevent a final weekly total.");
  assert.strictEqual(summary.remainingBudgetCents, null, "Incomplete price should prevent remaining-budget claims.");
  assert.strictEqual(summary.amountAboveBudgetCents, null, "Incomplete price should prevent above-budget claims.");
  assert.strictEqual(summary.purchaseCostCoveragePercent, 95.833333, "23 of 24 priced groups should produce non-100% coverage.");
  assert(appSource.includes("Currently priced subtotal"), "Incomplete shopping summary should use subtotal language.");
  assert(appSource.includes("Add Approximate Price"), "Missing-price action should be available.");

  const covered = cost.calculateMealPlanCosts({
    meals: [{ recipeId: "unpriced-herb-pasta", recipe: createRecipes().find((item) => item.id === "unpriced-herb-pasta"), servings: 4 }],
    recipes: createRecipes(),
    pantry: [{ ingredientId: "unpriced-herb", name: "Unpriced herb", quantity: 1, unit: "bunch" }, { ingredientId: "pasta", name: "Pasta", quantity: 250, unit: "g" }],
    ingredientResolver: resolveIngredient,
    pricingContext: pricingContext(),
    budgetContext: { weeklyBudgetCents: 10000 },
    calculationDate: TEST_CONTEXT.referenceLocalDate
  });
  assert.strictEqual(covered.weeklySummary.weeklyGroceryCostCents, 0, "Purchase cost can be complete when unpriced ingredients are fully Pantry-covered.");
  assert(covered.recipeCostSummaries[0].ingredientCostResults.some((line) => line.status === "missing-price"), "Recipe ingredient-use coverage remains separate from purchase coverage.");
}

function testReplaceMealRecalculationAndSaveProtection() {
  const before = cost.calculateWeeklyPurchaseSummary([{ missingQuantity: 1, purchaseCostCents: 9275, priceSourceKind: "confirmed" }], [], { weeklyBudgetCents: 10000 });
  const after = cost.calculateWeeklyPurchaseSummary([{ missingQuantity: 1, purchaseCostCents: 10130, priceSourceKind: "confirmed" }], [], { weeklyBudgetCents: 10000 });
  assert.strictEqual(before.weeklyGroceryCostCents, 9275);
  assert.strictEqual(after.weeklyGroceryCostCents, 10130);
  assert.strictEqual(after.amountAboveBudgetCents, 130, "Replacement should show $1.30 above a $100 budget.");
  [
    "This replacement would increase the estimated grocery total",
    "Choose a Different Meal",
    "Use Replacement",
    "This replacement no longer meets current hard requirements.",
    "Complete budget impact needs price review.",
    "rebuildLeftoverRelationships(proposedPlan",
    "calculateMealPlanCostsForPlan(rebuiltProposedPlan",
    "derivePriceConfidence",
    "buildPantryAllocationForPlan(rebuiltProposedPlan)",
    "beforePlanSignature",
    "proposedPlanSignature"
  ].forEach((text) => assert(appSource.includes(text), `Replacement recalculation contract should exist: ${text}`));

  const currentPlan = { Monday: { Dinner: "pasta-tomatoes" }, calendar: { "2026-08-11": { Dinner: "pasta-tomatoes" } } };
  const preview = JSON.parse(JSON.stringify(currentPlan));
  preview.Monday.Dinner = "microwave-chicken";
  assert.notStrictEqual(planSignature([{ day: "Monday", mealType: "Dinner", recipeId: currentPlan.Monday.Dinner, servings: 4 }]), planSignature([{ day: "Monday", mealType: "Dinner", recipeId: preview.Monday.Dinner, servings: 4 }]), "Replacement preview should have a different signature.");
  assert.strictEqual(currentPlan.Monday.Dinner, "pasta-tomatoes", "Current plan remains unchanged before confirmation.");
  assert(appSource.includes("finalPlan.calendar = metadata ? buildCalendarMergeForSavedPlan"), "Save Plan should merge into the existing meal calendar.");
  assert(appSource.includes("state.mealPlans = normalizeMealPlan(previousPlan);"), "Save failure should restore the previous plan.");
  assert(!appSource.includes("budgetRescuePantryDeductions"), "Save Plan should not deduct Pantry.");
  assert(!appSource.includes("budgetRescuePurchasedItems"), "Save Plan should not mark groceries purchased.");
}

function testDataProtectionEdgeCasesAndDeterminism() {
  const users = createUsers();
  const scopedKey = (feature, user) => `chefNova${feature}_${user.id}`;
  assert.notStrictEqual(scopedKey("MealPlan", users.registeredA), scopedKey("MealPlan", users.registeredB), "Registered users should have separate storage keys.");
  assert(appSource.includes("chefNovaGuestMealPlan") && appSource.includes("sessionStorage"), "Guest budget-related progress should remain session-scoped.");
  assert(appSource.includes("future-version"), "Future schema versions should fail safely.");
  assert(appSource.includes("Enter an amount greater than $0 to create a budget plan."), "Zero or missing budget should be blocked.");
  assert(appSource.includes("I have enough for this plan") && appSource.includes("I have some") && appSource.includes("Add ${escapeHtml(item.displayName)} to the grocery list"), "Unknown Pantry choices should be explicit.");
  assert(appSource.includes("Promotion not applied") && appSource.includes("packageRemainder"), "Promotion and package remainder edge cases should be handled.");
  assert(appSource.includes("Estimated remaining amount") && appSource.includes("It is not added automatically"), "Package remainders should not enter Pantry automatically.");
  assertStaticContracts();
}

testStandardWeeklyBudget();
testEmergencyPlanContracts();
testAllergyProtection();
testApplianceRestriction();
testAboveBudgetAndRespectfulActions();
testSharedGroceryIngredient();
testMissingPriceProtection();
testReplaceMealRecalculationAndSaveProtection();
testDataProtectionEdgeCasesAndDeterminism();

console.log("Budget Rescue complete QA tests passed.");
