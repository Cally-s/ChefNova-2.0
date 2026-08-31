#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const {
  INGREDIENT_SCHEMA_VERSION,
  buildIngredientAliasIndex,
  resolveIngredientName,
  normalizeUnit,
  validateIngredientCatalogue,
  validateStructuredRecipeIngredients,
  ingredientDisplayText
} = require("./ingredient-data-shared.js");

const ROOT = path.resolve(__dirname, "..");
const recipes = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "recipes.json"), "utf8"));
const catalogue = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "ingredients.json"), "utf8"));
const recipesJs = fs.readFileSync(path.join(ROOT, "data", "recipes.js"), "utf8");
const ingredientsJs = fs.readFileSync(path.join(ROOT, "data", "ingredients.js"), "utf8");
const errors = [];

if (catalogue.ingredientSchemaVersion !== INGREDIENT_SCHEMA_VERSION) errors.push("Ingredient catalogue schema version mismatch.");
recipes.forEach((recipe) => {
  if (recipe.ingredientSchemaVersion !== INGREDIENT_SCHEMA_VERSION) errors.push(`Recipe ${recipe.id}: missing ingredientSchemaVersion ${INGREDIENT_SCHEMA_VERSION}.`);
  (recipe.ingredients || []).forEach((ingredient, index) => {
    const structured = recipe.structuredIngredients?.[index];
    if (structured?.displayText !== ingredientDisplayText(ingredient)) errors.push(`Recipe ${recipe.id}, ingredient ${index + 1}: displayText changed.`);
  });
  (recipe.optionalIngredients || []).forEach((ingredient, index) => {
    const structured = recipe.structuredOptionalIngredients?.[index];
    if (structured?.displayText !== ingredientDisplayText(ingredient)) errors.push(`Recipe ${recipe.id}, optional ingredient ${index + 1}: displayText changed.`);
  });
});

errors.push(...validateIngredientCatalogue(catalogue));
errors.push(...validateStructuredRecipeIngredients(recipes, catalogue));

const aliasIndex = buildIngredientAliasIndex(catalogue);
["Chickpea", "Chickpeas", "Garbanzo bean", "Garbanzo beans"].forEach((term) => {
  const result = resolveIngredientName(term, catalogue, aliasIndex);
  if (result.status !== "resolved" || result.ingredientId !== "chickpeas") errors.push(`Alias ${term} did not resolve to chickpeas.`);
});
["margarine", "lentils", "oat milk", "almonds"].forEach((term) => {
  const result = resolveIngredientName(term, catalogue, aliasIndex);
  const forbidden = { margarine: "butter", lentils: "chicken", "oat milk": "milk", almonds: "peanut-butter" };
  if (result.status === "resolved" && result.ingredientId === forbidden[term]) errors.push(`${term} resolved as an unsafe substitute alias.`);
});

if (resolveIngredientName("pasta", catalogue, aliasIndex).ingredientId !== "pasta") errors.push("Broad pasta term must resolve to broad pasta record.");
if (normalizeUnit("cups") !== "cup" || normalizeUnit("tablespoons") !== "tbsp" || normalizeUnit("cloves") !== "clove") errors.push("Unit normalization failed.");
if (!recipesJs.includes(`window.CHEF_NOVA_RECIPES = ${JSON.stringify(recipes, null, 2)};`)) errors.push("data/recipes.js is not synchronized with data/recipes.json.");
if (!ingredientsJs.includes(`window.CHEF_NOVA_INGREDIENT_CATALOGUE = ${JSON.stringify(catalogue, null, 2)};`)) errors.push("data/ingredients.js is not synchronized with data/ingredients.json.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Ingredient data validation passed.");
