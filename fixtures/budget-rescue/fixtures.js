"use strict";

const TEST_CONTEXT = Object.freeze({
  referenceDateTime: "2026-08-10T14:30:00-04:00",
  referenceLocalDate: "2026-08-10",
  timezone: "America/Toronto",
  locale: "en-CA",
  currency: "CAD"
});

function ingredient(ingredientId, quantity, unit, extra = {}) {
  return {
    ingredientId,
    displayName: extra.displayName || ingredientId.replace(/-/g, " "),
    displayText: `${quantity} ${unit} ${(extra.displayName || ingredientId).replace(/-/g, " ")}`,
    quantity,
    unit,
    measurementStatus: "exact",
    resolutionStatus: "resolved",
    optional: false,
    ...extra
  };
}

function recipe(id, name, ingredients, extra = {}) {
  return {
    id,
    name,
    category: extra.category || "Dinner",
    dietaryTags: extra.dietaryTags || [],
    allergies: extra.allergies || [],
    servings: extra.servings || 4,
    scalable: extra.scalable !== false,
    batchable: extra.batchable === true,
    maximumBatches: extra.maximumBatches || 1,
    cookingTime: extra.cookingTime || 25,
    totalTime: extra.totalTime || extra.cookingTime || 25,
    structuredIngredients: ingredients,
    preparationMethods: extra.preparationMethods || [{ id: "stovetop", requiredAppliances: ["stove"], totalTimeMinutes: extra.totalTime || extra.cookingTime || 25 }],
    ...extra
  };
}

function priceEntry(ingredientId, regularPriceCents, pricedQuantity, pricedUnit, extra = {}) {
  return {
    id: extra.id || `${ingredientId}-test-price`,
    ingredientId,
    storeProfileId: "budget-rescue-test-store",
    sourceType: extra.sourceType || "chef-nova-estimate",
    priceBasis: extra.priceBasis || "package",
    pricedQuantity,
    pricedUnit,
    regularPriceCents,
    currency: "CAD",
    updatedAt: "2026-08-10",
    isPreferred: true,
    ...extra
  };
}

function createPriceCatalogue(overrides = []) {
  return {
    priceCatalogueVersion: 1,
    currency: "CAD",
    profiles: [{
      id: "budget-rescue-test-store",
      name: "Budget Rescue Test Store",
      isBuiltIn: true,
      entries: [
        priceEntry("rice", 400, 1, "kg"),
        priceEntry("pasta", 250, 500, "g"),
        priceEntry("canned-tomatoes", 150, 1, "can"),
        priceEntry("onion", 300, 10, "each"),
        priceEntry("lentils", 360, 900, "g"),
        priceEntry("chickpeas", 160, 1, "can"),
        priceEntry("eggs", 420, 12, "each"),
        priceEntry("chicken-breast", 1200, 1, "kg", { priceBasis: "unit-rate" }),
        priceEntry("frozen-vegetables", 500, 1, "kg"),
        priceEntry("canned-beans", 140, 1, "can"),
        priceEntry("bread", 300, 1, "loaf"),
        priceEntry("peanut-butter", 500, 1, "jar"),
        priceEntry("oil", 360, 1, "l", { salePriceCents: 320, saleEndsOn: "2026-08-15" }),
        priceEntry("expired-sale-rice", 500, 1, "kg", { ingredientId: "expired-sale-rice", salePriceCents: 100, saleEndsOn: "2026-08-01" }),
        priceEntry("promotion-pasta", 250, 500, "g", { ingredientId: "promotion-pasta", promotions: [{ promotionType: "multi-buy", purchasePackageCount: 3, bundlePriceCents: 600, startsOn: "2026-08-01", endsOn: "2026-08-31" }] }),
        ...overrides
      ]
    }]
  };
}

function pricingContext(priceCatalogue = createPriceCatalogue()) {
  return {
    selectedPriceSource: "chef-nova-estimate",
    selectedProfileId: "",
    sessionPriceOverrides: [],
    userPriceProfiles: [],
    chefNovaEstimateCatalogue: priceCatalogue
  };
}

function createRecipes() {
  return [
    recipe("rice-eggs", "Rice and Eggs", [ingredient("rice", 200, "g"), ingredient("eggs", 4, "each"), ingredient("onion", 1, "each")], { category: "Breakfast", cookingTime: 20, dietaryTags: ["vegetarian"], preparationMethods: [{ id: "stovetop", requiredAppliances: ["stove"], totalTimeMinutes: 20 }] }),
    recipe("pasta-tomatoes", "Pasta with Tomatoes", [ingredient("pasta", 250, "g"), ingredient("canned-tomatoes", 1, "can"), ingredient("onion", 1, "each")], { cookingTime: 25, dietaryTags: ["vegetarian"] }),
    recipe("lentil-rice", "Lentil Rice", [ingredient("lentils", 300, "g"), ingredient("rice", 200, "g"), ingredient("onion", 1, "each")], { cookingTime: 30, dietaryTags: ["vegan"] }),
    recipe("chickpea-toast", "Chickpea Toast", [ingredient("chickpeas", 1, "can"), ingredient("bread", 1, "loaf"), ingredient("onion", 1, "each")], { category: "Lunch", cookingTime: 15, dietaryTags: ["vegan"], preparationMethods: [{ id: "no-cook", requiredAppliances: [], noCook: true, totalTimeMinutes: 15 }] }),
    recipe("microwave-beans", "Microwave Beans", [ingredient("canned-beans", 2, "can"), ingredient("frozen-vegetables", 300, "g")], { category: "Dinner", cookingTime: 12, dietaryTags: ["vegan"], preparationMethods: [{ id: "microwave", requiredAppliances: ["microwave"], totalTimeMinutes: 12 }] }),
    recipe("oven-chicken", "Oven Chicken", [ingredient("chicken-breast", 600, "g"), ingredient("onion", 2, "each")], { cookingTime: 45, allergies: [], preparationMethods: [{ id: "oven", requiredAppliances: ["oven"], totalTimeMinutes: 45 }] }),
    recipe("microwave-chicken", "Microwave Chicken Bowl", [ingredient("chicken-breast", 400, "g"), ingredient("rice", 200, "g")], { cookingTime: 25, preparationMethods: [{ id: "microwave", requiredAppliances: ["microwave"], totalTimeMinutes: 25 }, { id: "oven", requiredAppliances: ["oven"], totalTimeMinutes: 45 }] }),
    recipe("peanut-noodles", "Peanut Noodles", [ingredient("peanut-butter", 1, "jar"), ingredient("pasta", 250, "g")], { allergies: ["Peanuts"], cookingTime: 20 }),
    recipe("peanut-sauce-rice", "Peanut Sauce Rice", [ingredient("peanut-butter", 1, "jar"), ingredient("rice", 250, "g")], { allergies: [], cookingTime: 20 }),
    recipe("unpriced-herb-pasta", "Herb Pasta", [ingredient("pasta", 250, "g"), ingredient("unpriced-herb", 1, "bunch")], { cookingTime: 20 })
  ];
}

function createStandardMeals(recipes = createRecipes()) {
  const ids = ["rice-eggs", "pasta-tomatoes", "lentil-rice"];
  return Array.from({ length: 21 }, (_, index) => ({
    mealId: `meal-${index + 1}`,
    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][Math.floor(index / 3)],
    mealType: ["Breakfast", "Lunch", "Dinner"][index % 3],
    recipeId: ids[index % ids.length],
    recipe: recipes.find((item) => item.id === ids[index % ids.length]),
    servings: 4
  }));
}

function createStandardPantry() {
  return [
    { id: "pantry-rice", ingredientId: "rice", name: "Rice", quantity: 1, unit: "kg" },
    { id: "pantry-pasta", ingredientId: "pasta", name: "Pasta", quantity: 500, unit: "g" },
    { id: "pantry-tomatoes", ingredientId: "canned-tomatoes", name: "Canned tomatoes", quantity: 2, unit: "can" },
    { id: "pantry-onions", ingredientId: "onion", name: "Onions", quantity: 4, unit: "each" }
  ];
}

function createUsers() {
  return {
    registeredA: { id: "user-a", name: "Budget User A", allergies: ["Peanuts"], dietaryPreference: "No preference" },
    registeredB: { id: "user-b", name: "Budget User B", allergies: [], dietaryPreference: "Vegetarian" },
    guest: { id: "guest-session", guestMode: true }
  };
}

module.exports = {
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
};
