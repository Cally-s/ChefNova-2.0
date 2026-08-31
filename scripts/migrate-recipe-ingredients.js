#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const {
  INGREDIENT_SCHEMA_VERSION,
  MEASUREMENT_STATUSES,
  VALID_CATEGORIES,
  normalizeIngredientName,
  normalizeUnit,
  ingredientDisplayText,
  buildIngredientAliasIndex,
  resolveIngredientName,
  validateIngredientCatalogue,
  validateStructuredRecipeIngredients
} = require("./ingredient-data-shared.js");

const ROOT = path.resolve(__dirname, "..");
const RECIPES_JSON = path.join(ROOT, "data", "recipes.json");
const RECIPES_JS = path.join(ROOT, "data", "recipes.js");
const INGREDIENTS_JSON = path.join(ROOT, "data", "ingredients.json");
const INGREDIENTS_JS = path.join(ROOT, "data", "ingredients.js");
const REPORT_PATH = path.join(ROOT, "docs", "ingredient-migration-report.md");
const OVERRIDES_PATH = path.join(ROOT, "data", "ingredient-migration-overrides.json");

const CATEGORY_BY_NAME = {
  apple: "produce", avocado: "produce", banana: "produce", basil: "herbs-spices", "bell pepper": "produce", berries: "produce", broccoli: "produce", cabbage: "produce", carrots: "produce", celery: "produce", chives: "herbs-spices", cilantro: "herbs-spices", cucumber: "produce", garlic: "produce", ginger: "produce", "green beans": "produce", "green onion": "produce", lemon: "produce", lettuce: "produce", lime: "produce", mango: "produce", mushrooms: "produce", onion: "produce", parsley: "herbs-spices", peas: "produce", potatoes: "produce", romaine: "produce", spinach: "produce", "sweet potato": "produce", tomato: "produce",
  pasta: "grains", macaroni: "grains", noodles: "grains", oats: "grains", quinoa: "grains", rice: "grains", spaghetti: "grains", flour: "grains", granola: "grains",
  bread: "bakery", breadcrumbs: "bakery", croutons: "bakery", "pizza dough": "bakery", tortilla: "bakery",
  "black beans": "legumes", chickpeas: "legumes", lentils: "legumes", tofu: "legumes",
  beef: "meat", chicken: "meat", turkey: "meat",
  salmon: "seafood", shrimp: "seafood",
  egg: "eggs",
  butter: "dairy", cheddar: "dairy", cream: "dairy", milk: "dairy", mozzarella: "dairy", parmesan: "dairy", "sour cream": "dairy", yogurt: "dairy", "yogurt sauce": "dairy",
  "coconut milk": "dairy-alternatives",
  "olive oil": "oils-fats", "sesame oil": "oils-fats",
  "baking powder": "bakery", cardamom: "herbs-spices", "chili flakes": "herbs-spices", "chili powder": "herbs-spices", cinnamon: "herbs-spices", cumin: "herbs-spices", "curry powder": "herbs-spices", paprika: "herbs-spices", "black pepper": "herbs-spices", salt: "herbs-spices",
  "balsamic vinegar": "condiments-sauces", "caesar dressing": "condiments-sauces", mayonnaise: "condiments-sauces", mustard: "condiments-sauces", olives: "condiments-sauces", pickle: "condiments-sauces", salsa: "condiments-sauces", "soy sauce": "condiments-sauces", tahini: "condiments-sauces", "tomato sauce": "condiments-sauces",
  honey: "sweeteners", "maple syrup": "sweeteners", sugar: "sweeteners",
  ice: "beverages",
  corn: "produce", "dried cranberries": "produce", "chocolate chips": "sweeteners", "chia seeds": "other", "sesame seeds": "other", walnuts: "other", nori: "other", "peanut butter": "condiments-sauces"
};

const BASE_UNIT_BY_CATEGORY = {
  produce: "g",
  grains: "g",
  legumes: "g",
  meat: "g",
  seafood: "g",
  eggs: "each",
  dairy: "g",
  "dairy-alternatives": "ml",
  bakery: "g",
  "canned-goods": "g",
  frozen: "g",
  "oils-fats": "ml",
  "herbs-spices": "g",
  "condiments-sauces": "ml",
  sweeteners: "g",
  beverages: "ml",
  "prepared-foods": "g",
  other: "g"
};

const SUBSTITUTE_GROUP_BY_NAME = {
  pasta: "pasta", spaghetti: "pasta", macaroni: "pasta", noodles: "noodles", rice: "rice", quinoa: "grains", oats: "grains",
  chickpeas: "legumes", lentils: "legumes", "black beans": "legumes", tofu: "plant-protein",
  chicken: "poultry", turkey: "poultry", beef: "beef", salmon: "seafood", shrimp: "seafood",
  "olive oil": "cooking-oil", "sesame oil": "cooking-oil", butter: "cooking-fat",
  lettuce: "leafy-greens", romaine: "leafy-greens", spinach: "leafy-greens", basil: "fresh-herbs", cilantro: "fresh-herbs", parsley: "fresh-herbs", chives: "fresh-herbs",
  milk: "milk", "coconut milk": "plant-milk", yogurt: "yogurt", cheddar: "cheese", mozzarella: "cheese", parmesan: "cheese",
  "soy sauce": "soy-sauce", "tomato sauce": "tomato-sauce", salsa: "salsa", "yogurt sauce": "yogurt-sauce",
  honey: "sweetener", sugar: "sweetener", "maple syrup": "sweetener", "peanut butter": "nut-butter"
};

const ALIASES_BY_NAME = {
  chickpeas: ["chickpea", "garbanzo bean", "garbanzo beans", "canned chickpeas"],
  tomato: ["tomatoes"],
  pasta: ["plain pasta"],
  spaghetti: ["spaghetti pasta"],
  macaroni: ["macaroni pasta"],
  rice: ["cooked rice"],
  egg: ["eggs"],
  tomato: ["tomatoes"],
  carrots: ["carrot"],
  potatoes: ["potato"],
  noodles: ["noodle"],
  shrimp: ["prawns"],
  "green onion": ["scallion", "scallions", "spring onion"],
  "bell pepper": ["pepper", "sweet pepper"],
  "black beans": ["black bean"],
  "olive oil": ["extra virgin olive oil"],
  "soy sauce": ["soya sauce"],
  "coconut milk": ["canned coconut milk"],
  "peanut butter": ["peanut spread"]
};

const PANTRY_STAPLES = new Set(["pasta", "rice", "noodles", "spaghetti", "macaroni", "oats", "flour", "olive oil", "sesame oil", "soy sauce", "salt", "black pepper", "sugar", "honey", "baking powder", "chili flakes", "chili powder", "cinnamon", "cumin", "curry powder", "paprika", "tomato sauce", "vegetable stock", "chicken stock", "peanut butter", "chickpeas", "black beans", "lentils"]);

function slugify(value) {
  return normalizeIngredientName(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function buildCatalogue(recipes) {
  const names = new Set();
  recipes.forEach((recipe) => {
    [...(recipe.ingredients || []), ...(recipe.optionalIngredients || [])].forEach((ingredient) => names.add(ingredient.name));
  });
  const ingredients = Array.from(names).sort((a, b) => slugify(a).localeCompare(slugify(b))).map((name) => {
    const id = slugify(name);
    const category = CATEGORY_BY_NAME[name] || "other";
    return {
      id,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      aliases: ALIASES_BY_NAME[name] || [],
      baseUnit: BASE_UNIT_BY_CATEGORY[category] || "g",
      category: VALID_CATEGORIES.includes(category) ? category : "other",
      pantryStaple: PANTRY_STAPLES.has(name),
      substituteGroups: SUBSTITUTE_GROUP_BY_NAME[name] ? [SUBSTITUTE_GROUP_BY_NAME[name]] : [],
      commonForms: inferCommonForms(name),
      notes: ""
    };
  });
  return {
    ingredientSchemaVersion: INGREDIENT_SCHEMA_VERSION,
    categories: VALID_CATEGORIES,
    units: require("./ingredient-data-shared.js").VALID_UNITS,
    measurementStatuses: Object.values(MEASUREMENT_STATUSES),
    ingredients
  };
}

function inferCommonForms(name) {
  if (["chickpeas", "black beans", "coconut milk"].includes(name)) return ["canned"];
  if (["pasta", "spaghetti", "macaroni", "noodles", "rice", "oats", "flour", "lentils"].includes(name)) return ["dry"];
  if (["peas", "berries", "mango", "ice", "corn"].includes(name)) return ["frozen"];
  if (["chicken", "beef", "turkey", "salmon", "shrimp", "tofu"].includes(name)) return ["cooked"];
  return [];
}

function inferForm(name, unit) {
  if (["chickpeas", "black beans", "coconut milk"].includes(name)) return "canned";
  if (["pasta", "spaghetti", "macaroni", "noodles", "rice", "oats", "flour", "lentils"].includes(name)) return "dry";
  if (["peas", "berries", "mango", "ice", "corn"].includes(name)) return "frozen";
  if (["chicken", "beef", "turkey", "salmon", "shrimp", "tofu"].includes(name)) return "cooked";
  if (unit === "clove") return "fresh";
  return null;
}

function buildStructuredIngredient(recipe, ingredient, optional, catalogue, aliasIndex) {
  const displayText = ingredient.displayText || ingredientDisplayText(ingredient);
  const resolution = resolveIngredientName(ingredient.name, catalogue, aliasIndex);
  if (resolution.status !== "resolved") throw new Error(`Unable to resolve ${recipe.id}: ${displayText}`);
  const catalogRecord = catalogue.ingredients.find((entry) => entry.id === resolution.ingredientId);
  const unit = normalizeUnit(ingredient.unit);
  const quantity = Number.isFinite(Number(ingredient.quantity)) && Number(ingredient.quantity) > 0 ? Number(ingredient.quantity) : null;
  const packageUnit = ["can", "jar", "bottle", "package", "bag", "box", "carton"].includes(unit);
  return {
    ingredientId: catalogRecord.id,
    displayName: catalogRecord.name,
    displayText,
    quantity,
    quantityMax: null,
    unit,
    optional,
    category: catalogRecord.category,
    substituteGroup: catalogRecord.substituteGroups?.[0] || null,
    form: inferForm(ingredient.name, unit),
    preparation: ingredient.preparation || null,
    packageSize: null,
    amountText: quantity === null ? ingredient.amountText || null : null,
    section: optional ? "optional" : "main",
    notes: null,
    measurementStatus: quantity === null ? MEASUREMENT_STATUSES.UNQUANTIFIED : packageUnit ? MEASUREMENT_STATUSES.PACKAGE_SIZE_UNKNOWN : MEASUREMENT_STATUSES.EXACT,
    resolutionStatus: "resolved"
  };
}

function migrateRecipes(recipes, catalogue) {
  const aliasIndex = buildIngredientAliasIndex(catalogue);
  return recipes.map((recipe) => ({
    ...recipe,
    ingredientSchemaVersion: INGREDIENT_SCHEMA_VERSION,
    structuredIngredients: (recipe.ingredients || []).map((ingredient) => buildStructuredIngredient(recipe, ingredient, false, catalogue, aliasIndex)),
    structuredOptionalIngredients: (recipe.optionalIngredients || []).map((ingredient) => buildStructuredIngredient(recipe, ingredient, true, catalogue, aliasIndex))
  }));
}

function buildStats(recipes, catalogue) {
  const allStructured = recipes.flatMap((recipe) => [...(recipe.structuredIngredients || []), ...(recipe.structuredOptionalIngredients || [])]);
  return {
    recipeCount: recipes.length,
    ingredientLineCount: allStructured.length,
    structuredEntryCount: allStructured.length,
    canonicalIngredientCount: catalogue.ingredients.length,
    aliasCount: catalogue.ingredients.reduce((count, ingredient) => count + ingredient.aliases.length, 0),
    exactCount: allStructured.filter((ingredient) => ingredient.measurementStatus === MEASUREMENT_STATUSES.EXACT).length,
    rangeCount: allStructured.filter((ingredient) => ingredient.measurementStatus === MEASUREMENT_STATUSES.RANGE).length,
    approximateCount: allStructured.filter((ingredient) => ingredient.measurementStatus === MEASUREMENT_STATUSES.APPROXIMATE).length,
    unquantifiedCount: allStructured.filter((ingredient) => ingredient.measurementStatus === MEASUREMENT_STATUSES.UNQUANTIFIED).length,
    packageSizeUnknownCount: allStructured.filter((ingredient) => ingredient.measurementStatus === MEASUREMENT_STATUSES.PACKAGE_SIZE_UNKNOWN).length,
    optionalCount: allStructured.filter((ingredient) => ingredient.optional).length,
    manualOverrideCount: 0,
    unresolvedCount: allStructured.filter((ingredient) => ingredient.resolutionStatus !== "resolved").length,
    unknownUnitCount: allStructured.filter((ingredient) => ingredient.unit && !require("./ingredient-data-shared.js").VALID_UNITS.includes(ingredient.unit)).length
  };
}

function writeRecipesJs(recipes) {
  fs.writeFileSync(RECIPES_JS, `window.CHEF_NOVA_RECIPES = ${JSON.stringify(recipes, null, 2)};\n`);
}

function writeIngredientsJs(catalogue) {
  fs.writeFileSync(INGREDIENTS_JS, `window.CHEF_NOVA_INGREDIENT_CATALOGUE = ${JSON.stringify(catalogue, null, 2)};\n`);
}

function writeReport(stats, validationErrors) {
  const report = `# Ingredient Migration Report

## Summary
- Recipes inspected: ${stats.recipeCount}
- Ingredient lines inspected: ${stats.ingredientLineCount}
- Structured entries created: ${stats.structuredEntryCount}
- Canonical ingredients created: ${stats.canonicalIngredientCount}
- Aliases created: ${stats.aliasCount}
- Exact quantities: ${stats.exactCount}
- Ranges: ${stats.rangeCount}
- Approximate quantities: ${stats.approximateCount}
- Unquantified amounts: ${stats.unquantifiedCount}
- Package-size-unknown entries: ${stats.packageSizeUnknownCount}
- Optional ingredients: ${stats.optionalCount}
- Manually reviewed overrides: ${stats.manualOverrideCount}
- Unresolved ingredient identities: ${stats.unresolvedCount}
- Ambiguous aliases: ${validationErrors.filter((error) => error.includes("Alias collision")).length}
- Unknown units: ${stats.unknownUnitCount}

## Validation Result
${validationErrors.length ? validationErrors.map((error) => `- ${error}`).join("\n") : "Passed. No validation errors found."}

## Files Changed
- \`data/ingredients.json\`
- \`data/ingredients.js\`
- \`data/recipes.json\`
- \`data/recipes.js\`
- \`data/ingredient-migration-overrides.json\`
- \`docs/ingredient-migration-report.md\`

## Notes
- \`data/recipes.json\` is the canonical recipe source.
- \`data/recipes.js\` is regenerated for direct \`index.html\` opening.
- Original visible ingredient wording is preserved in \`displayText\`.
- No prices, budget totals, package guesses, or grocery-cost claims were added.
`;
  fs.writeFileSync(REPORT_PATH, report);
}

function main() {
  const recipes = readJson(RECIPES_JSON);
  const catalogue = buildCatalogue(recipes);
  const migrated = migrateRecipes(recipes, catalogue);
  const validationErrors = [
    ...validateIngredientCatalogue(catalogue),
    ...validateStructuredRecipeIngredients(migrated, catalogue)
  ];
  writeJson(INGREDIENTS_JSON, catalogue);
  writeIngredientsJs(catalogue);
  writeJson(RECIPES_JSON, migrated);
  writeRecipesJs(migrated);
  writeJson(OVERRIDES_PATH, {
    ingredientSchemaVersion: INGREDIENT_SCHEMA_VERSION,
    overrides: [],
    notes: "No manual overrides were required for the current Chef Nova production recipe data."
  });
  writeReport(buildStats(migrated, catalogue), validationErrors);
  if (validationErrors.length) {
    console.error(validationErrors.join("\n"));
    process.exit(1);
  }
  console.log("Ingredient migration completed.");
}

if (require.main === module) main();
