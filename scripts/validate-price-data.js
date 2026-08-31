#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const priceData = require("./price-data-shared.js");

const root = path.resolve(__dirname, "..");
const ingredients = JSON.parse(fs.readFileSync(path.join(root, "data", "ingredients.json"), "utf8"));
const catalogue = JSON.parse(fs.readFileSync(path.join(root, "data", "price-estimates-cad.json"), "utf8"));
const ingredientIds = new Set(ingredients.ingredients.map((ingredient) => ingredient.id));
const units = new Set(ingredients.units);
const entries = catalogue.profiles.flatMap((profile) => profile.entries || []);
const ids = entries.map((entry) => entry.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
const invalid = entries.map((entry) => ({ entry, result: priceData.validatePriceEntry(entry, { ingredientIds, units }) })).filter((item) => !item.result.valid);
const invalidIngredientReferences = entries.filter((entry) => !ingredientIds.has(entry.ingredientId)).length;
const invalidUnits = entries.filter((entry) => !units.has(entry.pricedUnit)).length;
const invalidCurrencyValues = entries.filter((entry) => entry.currency !== "CAD").length;
const packageEntries = entries.filter((entry) => entry.priceBasis === "package").length;
const unitRateEntries = entries.filter((entry) => entry.priceBasis === "unit-rate").length;
const activeSales = entries.filter((entry) => priceData.isSaleActive(entry)).length;
const missingEstimates = ingredients.ingredients.length - new Set(entries.map((entry) => entry.ingredientId)).size;

console.log(`Canonical ingredients: ${ingredients.ingredients.length}`);
console.log(`Built-in estimate entries: ${entries.length}`);
console.log(`Estimate coverage: ${Math.round((entries.length / ingredients.ingredients.length) * 100)}%`);
console.log(`Package-price entries: ${packageEntries}`);
console.log(`Unit-rate entries: ${unitRateEntries}`);
console.log(`Active sale entries: ${activeSales}`);
console.log(`Missing estimate prices: ${missingEstimates}`);
console.log(`Invalid ingredient references: ${invalidIngredientReferences}`);
console.log(`Invalid units: ${invalidUnits}`);
console.log(`Duplicate price-entry IDs: ${duplicateIds.length}`);
console.log(`Invalid currency values: ${invalidCurrencyValues}`);

if (invalid.length || duplicateIds.length || invalidIngredientReferences || invalidUnits || invalidCurrencyValues) {
  invalid.slice(0, 10).forEach((item) => console.error(`${item.entry.id}: ${item.result.errors.join("; ")}`));
  process.exit(1);
}

console.log("Price catalogue validation passed.");
