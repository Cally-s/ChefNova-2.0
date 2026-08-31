(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaIngredientData = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const INGREDIENT_SCHEMA_VERSION = 1;
  const MEASUREMENT_STATUSES = Object.freeze({
    EXACT: "exact",
    RANGE: "range",
    APPROXIMATE: "approximate",
    UNQUANTIFIED: "unquantified",
    TO_TASTE: "to-taste",
    AS_NEEDED: "as-needed",
    PACKAGE_SIZE_UNKNOWN: "package-size-unknown",
    UNRESOLVED: "unresolved"
  });
  const VALID_UNITS = Object.freeze(["mg", "g", "kg", "oz", "lb", "ml", "l", "tsp", "tbsp", "cup", "fl-oz", "each", "clove", "slice", "piece", "fillet", "sheet", "head", "stalk", "sprig", "bunch", "can", "jar", "bottle", "package", "bag", "box", "carton", "pinch", "dash", "handful"]);
  const VALID_CATEGORIES = Object.freeze(["produce", "grains", "legumes", "meat", "seafood", "eggs", "dairy", "dairy-alternatives", "bakery", "canned-goods", "frozen", "oils-fats", "herbs-spices", "condiments-sauces", "sweeteners", "beverages", "prepared-foods", "other"]);
  const UNIT_ALIASES = Object.freeze({
    gram: "g",
    grams: "g",
    kilogram: "kg",
    kilograms: "kg",
    tablespoon: "tbsp",
    tablespoons: "tbsp",
    tbs: "tbsp",
    teaspoon: "tsp",
    teaspoons: "tsp",
    cups: "cup",
    cloves: "clove",
    slices: "slice",
    pieces: "piece",
    fillets: "fillet",
    stalks: "stalk",
    cans: "can",
    jars: "jar",
    bottles: "bottle",
    packages: "package",
    bags: "bag",
    boxes: "box",
    cartons: "carton",
    litres: "l",
    liters: "l",
    millilitres: "ml",
    milliliters: "ml"
  });

  function normalizeIngredientName(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[‐‑‒–—]/g, "-")
      .replace(/\s+/g, " ")
      .replace(/[.,;:]+$/g, "")
      .trim();
  }

  function normalizeUnit(value) {
    const normalized = normalizeIngredientName(value);
    return UNIT_ALIASES[normalized] || normalized || null;
  }

  function buildIngredientAliasIndex(catalogue) {
    const ingredients = Array.isArray(catalogue) ? catalogue : catalogue?.ingredients || [];
    return ingredients.reduce((index, ingredient) => {
      const terms = [ingredient.name, ingredient.id, ...(ingredient.aliases || [])].map(normalizeIngredientName).filter(Boolean);
      terms.forEach((term) => {
        if (!index[term]) index[term] = [];
        if (!index[term].includes(ingredient.id)) index[term].push(ingredient.id);
      });
      return index;
    }, {});
  }

  function resolveIngredientName(input, catalogue, aliasIndex = buildIngredientAliasIndex(catalogue)) {
    const normalizedInput = normalizeIngredientName(input);
    const candidates = aliasIndex[normalizedInput] || [];
    if (candidates.length === 1) return { status: "resolved", ingredientId: candidates[0] };
    if (candidates.length > 1) return { status: "ambiguous", candidates: [...candidates], normalizedInput };
    return { status: "unresolved", normalizedInput };
  }

  function ingredientDisplayText(ingredient) {
    if (typeof ingredient === "string") return ingredient;
    const amount = ingredient?.quantity ? `${ingredient.quantity} ${ingredient.unit || ""}`.trim() + " " : "";
    return `${amount}${ingredient?.name || ""}`.trim();
  }

  function convertLegacyIngredientAtRuntime(ingredient) {
    return {
      ingredientId: null,
      displayName: typeof ingredient === "string" ? "Unknown ingredient" : ingredient?.name || "Unknown ingredient",
      displayText: ingredientDisplayText(ingredient),
      quantity: null,
      quantityMax: null,
      unit: null,
      optional: Boolean(ingredient?.optional),
      category: "other",
      substituteGroup: null,
      form: null,
      preparation: null,
      packageSize: null,
      amountText: null,
      measurementStatus: MEASUREMENT_STATUSES.UNRESOLVED,
      resolutionStatus: "unresolved"
    };
  }

  function parseQuantityText(text) {
    const fractions = { "¼": 0.25, "½": 0.5, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3 };
    const value = String(text || "").trim();
    if (fractions[value]) return fractions[value];
    const mixedUnicode = /^(\d+)\s*([¼½¾⅓⅔])$/.exec(value);
    if (mixedUnicode) return Number(mixedUnicode[1]) + fractions[mixedUnicode[2]];
    const mixedAscii = /^(\d+)\s+(\d+)\/(\d+)$/.exec(value);
    if (mixedAscii) return Number(mixedAscii[1]) + Number(mixedAscii[2]) / Number(mixedAscii[3]);
    const asciiFraction = /^(\d+)\/(\d+)$/.exec(value);
    if (asciiFraction) return Number(asciiFraction[1]) / Number(asciiFraction[2]);
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function parseIngredientLine(line, catalogue, aliasIndex = buildIngredientAliasIndex(catalogue)) {
    const displayText = String(line || "").trim();
    const lower = normalizeIngredientName(displayText);
    let working = displayText;
    let quantity = null;
    let quantityMax = null;
    let unit = null;
    let packageSize = null;
    let amountText = null;
    let measurementStatus = MEASUREMENT_STATUSES.EXACT;
    let optional = /\boptional\b/i.test(displayText);
    let preparation = null;

    const commaParts = working.split(",");
    if (commaParts.length > 1) {
      working = commaParts.shift().trim();
      preparation = commaParts.join(",").replace(/\boptional\b/ig, "").trim().replace(/^,\s*/, "") || null;
    }

    if (/\bto taste\b/i.test(displayText)) {
      measurementStatus = MEASUREMENT_STATUSES.TO_TASTE;
      working = working.replace(/\bto taste\b/i, "").trim();
    } else if (/\bas needed\b/i.test(displayText)) {
      measurementStatus = MEASUREMENT_STATUSES.AS_NEEDED;
      working = working.replace(/\bas needed\b/i, "").trim();
    } else {
      const quantityPattern = "(\\d+\\s+\\d+\\/\\d+|\\d+\\s*[¼½¾⅓⅔]|\\d+\\/\\d+|[¼½¾⅓⅔]|\\d+(?:\\.\\d+)?)";
      const packageMatch = new RegExp(`^${quantityPattern}\\s*[x×]\\s*${quantityPattern}\\s*(g|kg|ml|l)\\s+(cans?|jars?|bottles?|packages?|bags?|boxes?|cartons?)\\s+(?:of\\s+)?(.+)$`, "i").exec(working);
      const rangeMatch = new RegExp(`^${quantityPattern}\\s*[-–]\\s*${quantityPattern}\\s+([a-zA-Z-]+)\\s+(?:of\\s+)?(.+)$`, "i").exec(working);
      const amountMatch = /^(some|a splash|a handful)\s+(?:of\s+)?(.+)$/i.exec(working);
      const normalMatch = new RegExp(`^${quantityPattern}\\s+([a-zA-Z-]+)\\s+(?:of\\s+)?(.+)$`, "i").exec(working);
      const countMatch = new RegExp(`^${quantityPattern}\\s+(.+)$`, "i").exec(working);
      if (packageMatch) {
        quantity = parseQuantityText(packageMatch[1]);
        unit = normalizeUnit(packageMatch[4]);
        packageSize = { quantity: parseQuantityText(packageMatch[2]), unit: normalizeUnit(packageMatch[3]) };
        working = packageMatch[5];
      } else if (rangeMatch) {
        quantity = parseQuantityText(rangeMatch[1]);
        quantityMax = parseQuantityText(rangeMatch[2]);
        unit = normalizeUnit(rangeMatch[3]);
        working = rangeMatch[4];
        measurementStatus = MEASUREMENT_STATUSES.RANGE;
      } else if (amountMatch) {
        amountText = amountMatch[1].charAt(0).toUpperCase() + amountMatch[1].slice(1).toLowerCase();
        working = amountMatch[2];
        measurementStatus = MEASUREMENT_STATUSES.UNQUANTIFIED;
      } else if (normalMatch) {
        quantity = parseQuantityText(normalMatch[1]);
        unit = normalizeUnit(normalMatch[2]);
        working = normalMatch[3];
        if (["can", "jar", "bottle", "package", "bag", "box", "carton"].includes(unit)) measurementStatus = MEASUREMENT_STATUSES.PACKAGE_SIZE_UNKNOWN;
      } else if (countMatch) {
        quantity = parseQuantityText(countMatch[1]);
        unit = "each";
        working = countMatch[2];
      } else {
        measurementStatus = MEASUREMENT_STATUSES.UNQUANTIFIED;
      }
    }

    const cleanedName = working.replace(/\boptional\b/ig, "").replace(/\bfor garnish\b/ig, "").trim();
    if (!preparation && /\bfor garnish\b/i.test(displayText)) preparation = "for garnish";
    const resolution = resolveIngredientName(cleanedName, catalogue, aliasIndex);
    const record = resolution.status === "resolved" ? (Array.isArray(catalogue) ? catalogue : catalogue?.ingredients || []).find((ingredient) => ingredient.id === resolution.ingredientId) : null;
    return {
      ingredientId: record?.id || null,
      displayName: record?.name || cleanedName || "Unknown ingredient",
      displayText,
      quantity,
      quantityMax,
      unit,
      optional,
      category: record?.category || "other",
      substituteGroup: record?.substituteGroups?.[0] || null,
      form: lower.includes("canned") ? "canned" : null,
      preparation,
      packageSize,
      amountText,
      measurementStatus,
      resolutionStatus: resolution.status
    };
  }

  function getStructuredIngredients(recipe) {
    if (Array.isArray(recipe?.structuredIngredients) && recipe.structuredIngredients.length) return recipe.structuredIngredients;
    return (Array.isArray(recipe?.ingredients) ? recipe.ingredients : []).map(convertLegacyIngredientAtRuntime);
  }

  function validateIngredientCatalogue(catalogue) {
    const errors = [];
    const ingredients = Array.isArray(catalogue?.ingredients) ? catalogue.ingredients : [];
    const ids = new Set();
    const names = new Set();
    ingredients.forEach((ingredient, index) => {
      if (!ingredient.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(ingredient.id)) errors.push(`Ingredient ${index}: invalid id.`);
      if (ids.has(ingredient.id)) errors.push(`Ingredient ${ingredient.id}: duplicate id.`);
      ids.add(ingredient.id);
      const normalizedName = normalizeIngredientName(ingredient.name);
      if (!normalizedName) errors.push(`Ingredient ${ingredient.id || index}: missing name.`);
      if (names.has(normalizedName)) errors.push(`Ingredient ${ingredient.id}: duplicate name ${ingredient.name}.`);
      names.add(normalizedName);
      if (!Array.isArray(ingredient.aliases)) errors.push(`Ingredient ${ingredient.id}: aliases must be an array.`);
      (ingredient.aliases || []).forEach((alias) => {
        if (!normalizeIngredientName(alias)) errors.push(`Ingredient ${ingredient.id}: empty alias.`);
      });
      if (!VALID_UNITS.includes(ingredient.baseUnit)) errors.push(`Ingredient ${ingredient.id}: invalid baseUnit ${ingredient.baseUnit}.`);
      if (!VALID_CATEGORIES.includes(ingredient.category)) errors.push(`Ingredient ${ingredient.id}: invalid category ${ingredient.category}.`);
      if (typeof ingredient.pantryStaple !== "boolean") errors.push(`Ingredient ${ingredient.id}: pantryStaple must be boolean.`);
    });
    Object.entries(buildIngredientAliasIndex(catalogue)).forEach(([alias, candidates]) => {
      if (candidates.length > 1) errors.push(`Alias collision for "${alias}": ${candidates.join(", ")}.`);
    });
    return errors;
  }

  function validateStructuredRecipeIngredients(recipes, catalogue) {
    const errors = [];
    const ids = new Set((catalogue?.ingredients || []).map((ingredient) => ingredient.id));
    const validStatuses = new Set(Object.values(MEASUREMENT_STATUSES));
    const validUnits = new Set(VALID_UNITS);
    const validatePair = (recipe, legacy, structured, label) => {
      if (legacy.length !== structured.length) errors.push(`Recipe ${recipe.id} (${recipe.name}): missing ${label} structured counterparts.`);
      structured.forEach((ingredient, index) => {
        const original = ingredient.displayText || ingredientDisplayText(legacy[index]);
        const prefix = `Recipe ${recipe.id} (${recipe.name}), ${label} ingredient ${index + 1} "${original}"`;
        if (!ingredient.ingredientId || !ids.has(ingredient.ingredientId)) errors.push(`${prefix}: invalid ingredientId.`);
        if (!ingredient.displayName) errors.push(`${prefix}: missing displayName.`);
        if (!ingredient.displayText) errors.push(`${prefix}: missing displayText.`);
        if (!(ingredient.quantity === null || (typeof ingredient.quantity === "number" && Number.isFinite(ingredient.quantity) && ingredient.quantity > 0))) errors.push(`${prefix}: invalid quantity.`);
        if (!(ingredient.quantityMax === null || (typeof ingredient.quantityMax === "number" && Number.isFinite(ingredient.quantityMax) && ingredient.quantityMax >= (ingredient.quantity || 0)))) errors.push(`${prefix}: invalid quantityMax.`);
        if (!(ingredient.unit === null || validUnits.has(ingredient.unit))) errors.push(`${prefix}: invalid unit.`);
        if (typeof ingredient.optional !== "boolean") errors.push(`${prefix}: optional must be boolean.`);
        if (!validStatuses.has(ingredient.measurementStatus)) errors.push(`${prefix}: invalid measurementStatus.`);
        if (ingredient.quantity === null && ingredient.measurementStatus === MEASUREMENT_STATUSES.EXACT) errors.push(`${prefix}: exact measurements need a numeric quantity.`);
        if (ingredient.quantity !== null && ingredient.measurementStatus === MEASUREMENT_STATUSES.UNRESOLVED) errors.push(`${prefix}: resolved quantity cannot use unresolved status.`);
        if (ingredient.packageSize !== null) {
          if (!(ingredient.packageSize && typeof ingredient.packageSize.quantity === "number" && ingredient.packageSize.quantity > 0 && validUnits.has(ingredient.packageSize.unit))) errors.push(`${prefix}: invalid packageSize.`);
        }
      });
    };
    (Array.isArray(recipes) ? recipes : []).forEach((recipe) => {
      validatePair(recipe, Array.isArray(recipe.ingredients) ? recipe.ingredients : [], Array.isArray(recipe.structuredIngredients) ? recipe.structuredIngredients : [], "required");
      validatePair(recipe, Array.isArray(recipe.optionalIngredients) ? recipe.optionalIngredients : [], Array.isArray(recipe.structuredOptionalIngredients) ? recipe.structuredOptionalIngredients : [], "optional");
    });
    return errors;
  }

  return {
    INGREDIENT_SCHEMA_VERSION,
    MEASUREMENT_STATUSES,
    VALID_UNITS,
    VALID_CATEGORIES,
    UNIT_ALIASES,
    normalizeIngredientName,
    normalizeUnit,
    buildIngredientAliasIndex,
    resolveIngredientName,
    ingredientDisplayText,
    parseQuantityText,
    parseIngredientLine,
    convertLegacyIngredientAtRuntime,
    getStructuredIngredients,
    validateIngredientCatalogue,
    validateStructuredRecipeIngredients
  };
});
