# Step 3 Implementation Report — Save Meal Nutrition Data in Meal Planner

## Goal
Update the Chef Nova Meal Planner so saved meals store enough information for future nutrition calculations while preserving older saved meal plans.

## Files Changed
- `app.js`
- `style.css`
- `data/mealPlans.json`

## New Meal-Plan Data Structure
Meal plans are still stored by day and meal type using the existing `chefNovaMealPlan` localStorage key.

Each saved recipe meal now uses:

```json
{
  "recipeId": "omelette",
  "recipeName": "Omelette",
  "servings": 1,
  "nutritionAvailable": true
}
```

Empty meal slots are now stored as:

```json
null
```

## Recipe Meal Storage
When a Chef Nova recipe is selected or exactly matched by name:
- `recipeId` is saved from the real recipe database.
- `recipeName` is saved from the real recipe name.
- `servings` is saved from the servings input.
- `nutritionAvailable` is set to `true`.
- Full nutrition values are not copied into the meal plan. They remain available through recipe lookup by `recipeId`.

## Custom Meal Storage
When a user types a custom meal:
- `recipeId` is set to `null`.
- `recipeName` preserves the user's custom meal name.
- `servings` is saved.
- `nutritionAvailable` is set to `false`.
- No nutrition values are invented or estimated.

## Servings Input
Each Breakfast, Lunch, and Dinner card now includes:
- one combined recipe/custom meal combobox input
- one numeric `Servings` input
- Save button
- Delete button

Servings input rules:
- `type="number"`
- `min="1"`
- `step="1"`
- defaults to `1`
- rejects empty, zero, negative, and non-whole-number values

Invalid servings show:

```text
Please enter a valid number of servings
```

## nutritionAvailable Behavior
- Recipe meals save `nutritionAvailable: true`.
- Custom meals save `nutritionAvailable: false`.
- During migration, old meal names that exactly match recipe names are converted into recipe-linked meals.
- Old custom meal names are converted into custom meals.

## Old Data Migration
Added `normalizeMealPlanEntry(entry)` to support older saved data.

Migration supports:
- string meal names
- objects with `recipeId`
- objects with `recipeName`
- older `recipe` or `customMeal` fields
- missing `servings`
- missing `nutritionAvailable`

Older saved localStorage meal plans are normalized and written back to `chefNovaMealPlan` on load.

## localStorage Updates
- The existing localStorage key is unchanged:
  - `chefNovaMealPlan`
- Saving replaces only the selected day and meal type.
- Deleting sets only the selected meal entry to `null`.
- Other meals for the same day remain untouched.

## Validation and Notifications
Success toasts:
- `Meal plan updated`
- `Meal removed`

Error toasts:
- `Please select a recipe or enter a custom meal`
- `Please enter a valid number of servings`
- `Unable to save meal plan`

No `alert()` calls were added.

## Starter Data
Updated `data/mealPlans.json` to use the new object/null structure.

All starter recipe IDs were verified against `data/recipes.json`.

## Tests Run
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js`
- Parsed `data/mealPlans.json`.
- Parsed `data/recipes.json`.
- Verified starter meal entries are object or `null`.
- Verified starter recipe IDs exist in the recipe database.
- Verified required helper functions exist.
- Verified CSS braces are balanced.

## Risks or Remaining Notes
- Meal plan entries store planned servings, not copied nutrition totals. Future nutrition calculations should look up nutrition per serving from `data/recipes.json` using `recipeId`.
- Custom meals intentionally do not receive nutrition estimates.
- Existing saved string meal plans are migrated automatically when the app loads.
