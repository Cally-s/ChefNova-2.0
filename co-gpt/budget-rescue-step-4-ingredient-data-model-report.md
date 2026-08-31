# Budget Rescue Step 4 Ingredient Data Model Report

## Goal
Introduce a reliable structured ingredient data model for Chef Nova without changing recipe display, pantry behavior, shopping-list behavior, saved meal plans, dietary filters, allergy filters, or Budget Rescue planning modes.

## Files Inspected
- `docs/budget-rescue-audit.md`
- `app.js`
- `index.html`
- `data/recipes.json`
- `data/recipes.js`
- `tests/planning-mode-static.test.js`
- `tests/budget-rescue-form-static.test.js`

## Canonical Recipe Source
`data/recipes.json` is the canonical recipe source.

`data/recipes.js` is a generated browser fallback required for opening `index.html` directly from the filesystem.

## Files Created
- `data/ingredients.json`
- `data/ingredients.js`
- `data/ingredient-migration-overrides.json`
- `scripts/ingredient-data-shared.js`
- `scripts/migrate-recipe-ingredients.js`
- `scripts/validate-ingredient-data.js`
- `docs/ingredient-data-schema.md`
- `docs/ingredient-migration-report.md`
- `tests/ingredient-data.test.js`
- `co-gpt/budget-rescue-step-4-ingredient-data-model-report.md`

## Files Changed
- `app.js`
- `index.html`
- `data/recipes.json`
- `data/recipes.js`

## Canonical Ingredient Schema
Each canonical ingredient includes:

- `id`
- `name`
- `aliases`
- `baseUnit`
- `category`
- `pantryStaple`

Optional metadata includes `substituteGroups`, `commonForms`, and `notes`.

## Structured Recipe-Ingredient Schema
Each migrated recipe now includes:

- `ingredientSchemaVersion: 1`
- `structuredIngredients`
- `structuredOptionalIngredients`

Each structured ingredient includes identity, display text, quantity, unit, optional status, category, substitute group, form, preparation, package size, amount text, measurement status, and resolution status.

## Unit and Measurement-Status Design
Controlled units include mass, volume, count, package, and approximate culinary units.

Controlled measurement statuses include:

- `exact`
- `range`
- `approximate`
- `unquantified`
- `to-taste`
- `as-needed`
- `package-size-unknown`
- `unresolved`

No unsafe cup-to-gram, can-to-gram, or produce-count-to-weight conversions were added.

## Alias-Resolution Design
Alias resolution is centralized in `scripts/ingredient-data-shared.js`.

The shared utility builds an alias index from `data/ingredients.json`, returns `resolved`, `ambiguous`, or `unresolved`, and reports alias collisions during validation.

## Ambiguous Alias Handling
Alias collisions fail validation.

The resolver does not silently choose the first candidate. Broad terms such as `pasta` resolve only to the broad `pasta` record.

## Forms and Preparation
Forms such as canned, dry, frozen, fresh, and cooked are stored separately from `ingredientId`.

Preparation text such as `finely diced` is stored in `preparation`, not in canonical IDs.

## Display Wording Preservation
Original visible ingredient wording is stored in `displayText`.

The app's `ingredientTag()` now prefers `displayText`, so recipe cards and details keep the same user-facing wording.

## Migration Approach
Added a repeatable migration script:

```bash
node scripts/migrate-recipe-ingredients.js
```

The script reads `data/recipes.json`, builds the canonical catalogue, resolves ingredient IDs, creates structured entries, regenerates `data/recipes.js` and `data/ingredients.js`, and writes the migration report.

## Migration Counts
- Recipes migrated: 35
- Ingredient lines migrated: 241
- Canonical ingredients created: 100
- Manual overrides required: 0
- Unquantified ingredients: 0
- Package-size-unknown ingredients: 0
- Remaining unresolved ingredient identities: 0
- Optional ingredients migrated: 35

The current production recipes already had numeric quantities and simple units, so no production ingredient required an unquantified or package-size-unknown status.

## Validation Results
Passed:

- Ingredient catalogue validation
- Structured recipe ingredient validation
- Alias collision validation
- Generated JSON/JS consistency validation
- Display text preservation validation

## Dietary and Allergy Regression Results
Existing recipe-level `dietaryTags` and `allergies` were preserved.

The migration does not replace current dietary or allergy filtering with ingredient-only logic.

## Pantry and Shopping-List Regression Results
Existing pantry data was not migrated or renamed.

Existing shopping-list behavior still uses readable ingredient names, quantities, and units. No duplicate shopping list was created.

## Build, Type-Check, and Test Results
Passed:

- `node --check app.js`
- `node --check rules.js`
- `node --check languageGuidelines.js`
- `node --check data/recipes.js`
- `node --check data/ingredients.js`
- `node --check scripts/ingredient-data-shared.js`
- `node --check scripts/migrate-recipe-ingredients.js`
- `node --check scripts/validate-ingredient-data.js`
- Parse `data/recipes.json`
- Parse `data/ingredients.json`
- Parse `data/ingredient-migration-overrides.json`
- `node scripts/validate-ingredient-data.js`
- `node tests/ingredient-data.test.js`
- `node tests/planning-mode-static.test.js`
- `node tests/budget-rescue-form-static.test.js`

## Pre-existing Errors
No script or data validation errors were found during this step.

## Deferred to Later Steps
Not implemented in Step 4:

- Ingredient pricing
- Recipe cost
- Cost per serving
- Grocery purchase totals
- Store-specific price catalogues
- Full package-cost calculations
- Budget optimization
- Cheaper substitution recommendations
- Live grocery prices
- Store scraping
- Pantry deduction
- Emergency Plan optimization

## Duplicate System Check
No duplicate Recipe Database, Ingredient Catalogue, Pantry, Shopping List, Dietary Profile, Allergy Profile, Save Plan workflow, or Replace Meal workflow was created.
