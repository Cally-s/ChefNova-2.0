#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const priceData = require("../scripts/price-data-shared.js");

const ingredients = JSON.parse(fs.readFileSync("data/ingredients.json", "utf8"));
const catalogue = JSON.parse(fs.readFileSync("data/price-estimates-cad.json", "utf8"));
const ingredientIds = new Set(ingredients.ingredients.map((ingredient) => ingredient.id));
const units = new Set(ingredients.units);
const profile = catalogue.profiles.find((item) => item.id === "generic-budget-store");
const entries = profile.entries;

entries.forEach((entry) => {
  assert.equal(priceData.validatePriceEntry(entry, { ingredientIds, units }).valid, true, entry.id);
});

assert.equal(priceData.formatPriceEntry({
  ingredientId: "lentils",
  priceBasis: "package",
  pricedQuantity: 900,
  pricedUnit: "g",
  regularPriceCents: 349,
  currency: "CAD"
}), "$3.49 per 900 g package");

assert.equal(priceData.formatPriceEntry({
  ingredientId: "chicken",
  priceBasis: "unit-rate",
  pricedQuantity: 1,
  pricedUnit: "kg",
  regularPriceCents: 1499,
  currency: "CAD"
}), "$14.99/kg");

["3.49", "14.99", "0.01", "100.00"].forEach((value) => {
  const result = priceData.dollarsToCents(value);
  assert.equal(result.valid, true);
  assert.equal(priceData.centsToCurrency(result.cents).includes("."), true);
});

["0", "-1", "NaN", "Infinity", ""].forEach((value) => {
  assert.equal(priceData.dollarsToCents(value).valid, false);
});

const profilePrice = { ...entries.find((entry) => entry.ingredientId === "chicken"), id: "user-chicken", sourceType: "store-profile", storeProfileId: "profile-a", regularPriceCents: 1299 };
const resolvedProfile = priceData.resolveIngredientPrice({
  ingredientId: "chicken",
  selectedPriceSource: "store-profile",
  selectedProfileId: "profile-a",
  userPriceProfiles: [{ id: "profile-a", name: "User Store", entries: [profilePrice] }],
  chefNovaEstimateCatalogue: catalogue
});
assert.equal(resolvedProfile.entry.regularPriceCents, 1299);
assert.equal(resolvedProfile.usedFallback, false);

const fallback = priceData.resolveIngredientPrice({
  ingredientId: "lentils",
  selectedPriceSource: "store-profile",
  selectedProfileId: "profile-a",
  userPriceProfiles: [{ id: "profile-a", name: "User Store", entries: [] }],
  chefNovaEstimateCatalogue: catalogue
});
assert.equal(fallback.status, "resolved");
assert.equal(fallback.usedFallback, true);

const missing = priceData.resolveIngredientPrice({
  ingredientId: "missing-ingredient",
  selectedPriceSource: "chef-nova-estimate",
  chefNovaEstimateCatalogue: catalogue
});
assert.equal(missing.status, "missing");
assert.equal(missing.entry, null);

console.log("Price data tests passed.");
