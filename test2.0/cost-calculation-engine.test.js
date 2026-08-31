#!/usr/bin/env node
"use strict";

const assert = require("assert");
const cost = require("../scripts/cost-calculation-engine.js");

const priceProfiles = {
  priceCatalogueVersion: 1,
  currency: "CAD",
  profiles: [{
    id: "generic-budget-store",
    name: "Chef Nova Budget Store",
    isBuiltIn: true,
    entries: [
      { id: "lentils-900", ingredientId: "lentils", storeProfileId: "generic-budget-store", sourceType: "chef-nova-estimate", priceBasis: "package", pricedQuantity: 900, pricedUnit: "g", regularPriceCents: 360, currency: "CAD", updatedAt: "2026-08-10", isPreferred: true },
      { id: "chicken-kg", ingredientId: "chicken", storeProfileId: "generic-budget-store", sourceType: "chef-nova-estimate", priceBasis: "unit-rate", pricedQuantity: 1, pricedUnit: "kg", regularPriceCents: 1499, currency: "CAD", updatedAt: "2026-08-10", isPreferred: true },
      { id: "onions-10", ingredientId: "onion", storeProfileId: "generic-budget-store", sourceType: "chef-nova-estimate", priceBasis: "package", pricedQuantity: 10, pricedUnit: "each", regularPriceCents: 300, currency: "CAD", updatedAt: "2026-08-10", isPreferred: true },
      { id: "tomatoes-can", ingredientId: "tomato", storeProfileId: "generic-budget-store", sourceType: "chef-nova-estimate", priceBasis: "package", pricedQuantity: 1, pricedUnit: "can", regularPriceCents: 199, currency: "CAD", updatedAt: "2026-08-10", isPreferred: true },
      { id: "oil-sale", ingredientId: "olive-oil", storeProfileId: "generic-budget-store", sourceType: "chef-nova-estimate", priceBasis: "package", pricedQuantity: 1, pricedUnit: "l", regularPriceCents: 360, salePriceCents: 320, saleEndsOn: "2026-08-15", currency: "CAD", updatedAt: "2026-08-10", isPreferred: true },
      { id: "rice-expired-sale", ingredientId: "rice", storeProfileId: "generic-budget-store", sourceType: "chef-nova-estimate", priceBasis: "package", pricedQuantity: 1, pricedUnit: "kg", regularPriceCents: 500, salePriceCents: 100, saleEndsOn: "2026-08-01", currency: "CAD", updatedAt: "2026-08-10", isPreferred: true }
    ]
  }]
};
const pricingContext = {
  selectedPriceSource: "chef-nova-estimate",
  selectedProfileId: "",
  sessionPriceOverrides: [],
  userPriceProfiles: [],
  chefNovaEstimateCatalogue: priceProfiles
};
const recipe = (id, ingredient, servings = 4) => ({ id, name: id, servings, structuredIngredients: [ingredient] });
const ing = (ingredientId, quantity, unit, extra = {}) => ({ ingredientId, displayName: ingredientId, displayText: `${quantity} ${unit} ${ingredientId}`, quantity, unit, measurementStatus: "exact", resolutionStatus: "resolved", optional: false, ...extra });

let result = cost.calculateIngredientUseCost({ recipe: recipe("lentil", ing("lentils", 300, "g")), ingredient: ing("lentils", 300, "g"), pricingContext, calculationDate: "2026-08-10" });
assert.equal(result.ingredientUseCostCents, 120);

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "lentil", servings: 4 }], recipes: [recipe("lentil", ing("lentils", 300, "g"))], pantry: [], pricingContext, budgetContext: { weeklyBudgetCents: 10000, planningTargetCents: 9500 }, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].packagesRequired, 1);
assert.equal(result.purchaseGroups[0].purchaseCostCents, 360);
assert.equal(result.purchaseGroups[0].estimatedSurplusQuantity, 600);

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "lentil", servings: 4 }], recipes: [recipe("lentil", ing("lentils", 300, "g"))], pantry: [{ id: "p1", name: "lentils", ingredientId: "lentils", quantity: 100, unit: "g" }], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].missingQuantity, 200);
assert.equal(result.purchaseGroups[0].packagesRequired, 1);
assert.equal(result.purchaseGroups[0].purchaseCostCents, 360);
assert.equal(result.purchaseGroups[0].estimatedSurplusQuantity, 700);

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "lentil", servings: 4 }], recipes: [recipe("lentil", ing("lentils", 300, "g"))], pantry: [{ id: "p1", name: "lentils", ingredientId: "lentils", quantity: 500, unit: "g" }], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].missingQuantity, 0);
assert.equal(result.purchaseGroups[0].purchaseCostCents, 0);
assert.equal(result.weeklySummary.weeklyGroceryCostCents, 0);
assert.equal(result.weeklySummary.status, "no-purchases-required");

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "lentil", servings: 12 }], recipes: [recipe("lentil", ing("lentils", 300, "g"), 4)], pantry: [], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].missingQuantity, 900);
assert.equal(result.purchaseGroups[0].packagesRequired, 1);

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "lentil", servings: 12.013333333 }], recipes: [recipe("lentil", ing("lentils", 300, "g"), 4)], pantry: [], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].packagesRequired, 2);
assert.equal(result.purchaseGroups[0].purchaseCostCents, 720);

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "chicken", servings: 4 }], recipes: [recipe("chicken", ing("chicken", 500, "g"))], pantry: [], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].purchaseCostCents, 750);

const recipeSummary = cost.calculateRecipeCostSummary({ recipe: { id: "combo", servings: 4, structuredIngredients: [ing("lentils", 900, "g"), ing("onion", 10, "each")] }, selectedServings: 4, pricingContext, calculationDate: "2026-08-10" });
assert.equal(recipeSummary.totalRecipeCostCents, 660);
assert.equal(recipeSummary.costPerServingCents, 165);

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "a", servings: 4 }, { recipeId: "b", servings: 4 }, { recipeId: "c", servings: 4 }], recipes: [recipe("a", ing("onion", 2, "each")), recipe("b", ing("onion", 3, "each")), recipe("c", ing("onion", 3, "each"))], pantry: [], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups.length, 1);
assert.equal(result.purchaseGroups[0].totalRequiredQuantity, 8);
assert.equal(result.purchaseGroups[0].packagesRequired, 1);
assert.equal(result.weeklySummary.weeklyGroceryCostCents, 300);

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "a", servings: 4 }, { recipeId: "b", servings: 4 }, { recipeId: "c", servings: 4 }], recipes: [recipe("a", ing("onion", 2, "each")), recipe("b", ing("onion", 3, "each")), recipe("c", ing("onion", 3, "each"))], pantry: [{ ingredientId: "onion", quantity: 3, unit: "each" }], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].missingQuantity, 5);
assert.equal(result.purchaseGroups[0].estimatedSurplusQuantity, 5);

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "pasta", servings: 4 }], recipes: [recipe("pasta", ing("lentils", 2, "cup"))], pantry: [], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].status, "incompatible-unit");

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "tomato", servings: 4 }], recipes: [recipe("tomato", ing("tomato", 300, "g"))], pantry: [], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].status, "unknown-package-size");

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "tomato", servings: 4 }], recipes: [recipe("tomato", ing("tomato", 2, "can"))], pantry: [], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert.equal(result.purchaseGroups[0].purchaseCostCents, 398);

const rangeIngredient = ing("olive-oil", 1, "tbsp", { quantityMax: 2, measurementStatus: "range" });
result = cost.calculateRecipeCostSummary({ recipe: recipe("oil", rangeIngredient), selectedServings: 4, pricingContext, calculationDate: "2026-08-10" });
assert.equal(result.ingredientCostResults[0].ingredientUseCostMinCents, 5);
assert.equal(result.ingredientCostResults[0].ingredientUseCostMaxCents, 10);

result = cost.calculateRecipeCostSummary({ recipe: recipe("some-oil", ing("olive-oil", null, "tbsp", { measurementStatus: "unquantified" })), selectedServings: 4, pricingContext, calculationDate: "2026-08-10" });
assert.equal(result.status, "incomplete");
assert.equal(result.ingredientCostResults[0].ingredientUseCostCents, null);

result = cost.calculateRecipeCostSummary({ recipe: recipe("unknown", ing("unknown", 100, "g")), selectedServings: 4, pricingContext, calculationDate: "2026-08-10" });
assert.equal(result.ingredientCostResults[0].status, "missing-price");

result = cost.calculateRecipeCostSummary({ recipe: recipe("oil", ing("olive-oil", 1, "l")), selectedServings: 4, pricingContext, calculationDate: "2026-08-10" });
assert.equal(result.totalRecipeCostCents, 320);
assert.equal(result.ingredientCostResults[0].usingSalePrice, true);

result = cost.calculateRecipeCostSummary({ recipe: recipe("rice", ing("rice", 1, "kg")), selectedServings: 4, pricingContext, calculationDate: "2026-08-10" });
assert.equal(result.totalRecipeCostCents, 500);
assert.equal(result.ingredientCostResults[0].usingSalePrice, false);

result = cost.calculateRecipeCostSummary({ recipe: recipe("scale", ing("lentils", 300, "g"), 4), selectedServings: 8, pricingContext, calculationDate: "2026-08-10" });
assert.equal(result.ingredientCostResults[0].normalizedRequiredQuantity, 600);

const optional = ing("lentils", 300, "g", { optional: true });
result = cost.calculateRecipeCostSummary({ recipe: recipe("optional", optional), selectedServings: 4, pricingContext, calculationDate: "2026-08-10" });
assert.equal(result.totalCostRelevantIngredientCount, 0);

result = cost.calculateWeeklyPurchaseSummary([{ missingQuantity: 1, purchaseCostCents: 9275, priceSourceKind: "confirmed" }], [], { weeklyBudgetCents: 10000, planningTargetCents: 9500 });
assert.equal(result.remainingBudgetCents, 725);
assert.equal(result.remainingPlanningTargetCents, 225);

result = cost.calculateWeeklyPurchaseSummary([{ missingQuantity: 1, purchaseCostCents: 10640, priceSourceKind: "confirmed" }], [], { weeklyBudgetCents: 10000, planningTargetCents: 9500 });
assert.equal(result.remainingBudgetCents, 0);
assert.equal(result.amountAboveBudgetCents, 640);

result = cost.calculateWeeklyPurchaseSummary([{ missingQuantity: 1, purchaseCostCents: 9700, priceSourceKind: "confirmed" }], [], { weeklyBudgetCents: 10000, planningTargetCents: 9500 });
assert.equal(result.remainingBudgetCents, 300);
assert.equal(result.amountAbovePlanningTargetCents, 200);

result = cost.calculateWeeklyPurchaseSummary([{ missingQuantity: 1, purchaseCostCents: 7840, priceSourceKind: "confirmed" }, { missingQuantity: 1, purchaseCostCents: null }], [], { weeklyBudgetCents: 10000, planningTargetCents: 9500 });
assert.equal(result.weeklyGroceryCostCents, null);
assert.equal(result.remainingBudgetCents, null);

result = cost.calculateWeeklyPurchaseSummary([
  ...Array.from({ length: 4 }, () => ({ missingQuantity: 1, purchaseCostCents: 100, priceSourceKind: "confirmed" })),
  ...Array.from({ length: 4 }, () => ({ missingQuantity: 1, purchaseCostCents: 100, priceSourceKind: "estimate" })),
  ...Array.from({ length: 2 }, () => ({ missingQuantity: 1, purchaseCostCents: null }))
], [], {});
assert.equal(result.resolvedPriceCoveragePercent, 80);
assert.equal(result.confirmedPriceCoveragePercent, 40);
assert.equal(result.estimatePriceCoveragePercent, 40);

result = cost.calculateMealPlanCosts({ meals: [{ recipeId: "lentil", servings: 4 }], recipes: [recipe("lentil", ing("lentils", 300, "g"))], pantry: [{ ingredientId: "lentils", quantity: "" }], pricingContext, budgetContext: {}, calculationDate: "2026-08-10" });
assert(result.purchaseGroups[0].warnings.length > 0);
assert.equal(result.purchaseGroups[0].pantryQuantityApplied, 0);

assert.equal(cost.normalizeComparableQuantity(1, "kg").quantity, 1000);
assert.equal(cost.normalizeComparableQuantity(1, "l").quantity, 1000);
assert.equal(cost.normalizeComparableQuantity(1, "cup").valid, false);

console.log("Cost calculation engine tests passed.");
