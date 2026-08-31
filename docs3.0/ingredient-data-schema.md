# Chef Nova Ingredient Data Schema

## 1. Purpose

Structured ingredient data prepares Chef Nova for future budget, pantry, shopping-list, substitution, serving-scale, and package-size work.

The original recipe ingredient wording is still preserved for display.

## 2. Canonical Ingredient Catalogue

The canonical catalogue lives in `data/ingredients.json`.

Each ingredient includes:

- `id`: stable lowercase kebab-case ID.
- `name`: standard display name.
- `aliases`: same-ingredient names only.
- `baseUnit`: preferred base unit for future calculations.
- `category`: controlled ingredient category.
- `pantryStaple`: classification only. It does not mean the user owns the item.

Optional metadata includes:

- `substituteGroups`: future substitution grouping.
- `commonForms`: common ingredient forms such as canned, dry, frozen, or cooked.
- `notes`: developer notes.

## 3. Structured Recipe Ingredients

Recipes keep their existing `ingredients` and `optionalIngredients` arrays.

Step 4 adds:

- `ingredientSchemaVersion`
- `structuredIngredients`
- `structuredOptionalIngredients`

Each structured ingredient includes:

- `ingredientId`
- `displayName`
- `displayText`
- `quantity`
- `quantityMax`
- `unit`
- `optional`
- `category`
- `substituteGroup`
- `form`
- `preparation`
- `packageSize`
- `amountText`
- `section`
- `notes`
- `measurementStatus`
- `resolutionStatus`

## 4. Ingredient IDs

Ingredient IDs are stable, lowercase, kebab-case, and independent of quantity, store, brand, or preparation.

Examples:

- `chickpeas`
- `olive-oil`
- `brown-rice`
- `tomato-sauce`

Do not create IDs such as `two-cups-rice`, `walmart-beans`, or `diced-onion`.

## 5. Alias Resolution

Aliases are same-ingredient names.

Examples:

- `chickpea`, `chickpeas`, `garbanzo bean`, and `garbanzo beans` resolve to `chickpeas`.
- `tomato` and `tomatoes` resolve to `tomato`.

Aliases are not substitutes. Margarine is not an alias for butter, oat milk is not an alias for dairy milk, and almonds are not an alias for peanuts.

Resolver statuses:

- `resolved`
- `ambiguous`
- `unresolved`

Alias collisions fail validation.

## 6. Units and Conversions

Canonical unit IDs include mass, volume, count, package, and approximate culinary units.

Examples:

- `g`
- `kg`
- `ml`
- `l`
- `tsp`
- `tbsp`
- `cup`
- `each`
- `clove`
- `slice`
- `piece`
- `can`
- `package`
- `pinch`

Safe unit normalization includes plural-to-singular and common abbreviations.

Chef Nova does not use unsafe universal conversions such as cups of pasta to grams or cans to grams.

## 7. Measurement Statuses

Supported statuses:

- `exact`
- `range`
- `approximate`
- `unquantified`
- `to-taste`
- `as-needed`
- `package-size-unknown`
- `unresolved`

Null quantities are not treated as zero or free.

## 8. Forms and Preparation

Ingredient identity is separate from form and preparation.

Examples:

- `chickpeas` with `form: "canned"`
- `pasta` with `form: "dry"`
- `onion` with `preparation: "finely diced"`

Do not put preparation words in canonical IDs.

## 9. Backward Compatibility

Older recipe data with only `ingredients` still renders.

The compatibility adapter creates unresolved structured records at runtime rather than guessing IDs or quantities.

## 10. Migration Process

Run:

```bash
node scripts/migrate-recipe-ingredients.js
node scripts/validate-ingredient-data.js
```

The migration reads `data/recipes.json`, creates/updates structured ingredient data, writes `data/ingredients.json`, regenerates direct-file JavaScript fallbacks, and updates `docs/ingredient-migration-report.md`.

## 11. Adding a New Ingredient

Add the ingredient to `data/ingredients.json` through the migration metadata or a reviewed catalogue update.

Required checks:

- Stable ID
- Name
- Aliases array
- Valid base unit
- Valid category
- Boolean pantry-staple value
- No unsafe alias

Then run the validation script.

## 12. Adding a New Recipe

Add the recipe to `data/recipes.json` using the existing readable ingredient objects.

Then run the migration script to create:

- `ingredientSchemaVersion`
- `structuredIngredients`
- `structuredOptionalIngredients`

Do not manually edit `data/recipes.js`; it is generated from `data/recipes.json`.

## 13. Safety Considerations

Ingredient structure does not replace existing recipe-level allergy and dietary tags.

Do not collapse distinct allergens into broad aliases. Do not treat substitute groups as safe replacements. Do not infer that an ingredient is safe because its category seems safe.

Budget, pricing, package purchasing, and substitution decisions are intentionally deferred to later Budget Rescue steps.
