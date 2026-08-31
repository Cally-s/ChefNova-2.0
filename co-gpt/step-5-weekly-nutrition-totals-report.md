# Step 5 Implementation Report — Calculate Weekly Nutrition Totals

## Goal
Harden the Weekly Nutrition calculations so totals are derived from the saved Meal Planner data, linked recipes, selected servings, and validated per-serving nutrition fields.

Nutrition values are estimates based on recipe data and selected servings. They are not medical or professional dietary advice.

## Files Changed
- `app.js`

## localStorage Meal-Plan Reading
Added `getSavedMealPlan()` so Weekly Nutrition reads from the existing meal-plan storage key:

- `chefNovaMealPlan`

The function safely falls back to the in-memory `state.mealPlans` value and normalizes the plan before calculating totals.

## Recipe Lookup Logic
Weekly Nutrition uses:
- `findRecipeById(recipeId)` when a saved meal has a recipe ID.
- `findRecipeByName(recipeName)` through existing migration/normalization for older meal-plan entries.

No fake recipe IDs are created.

## Serving Multiplication
Added `normalizeSelectedServings(value)`.

Rules:
- servings must be a positive whole number
- invalid or missing servings default to `1`
- recipe default servings are not used for multiplication

Formula used for valid recipe meals:

```text
recipe nutrition per serving * selected servings
```

## Weekly Total Calculations
Weekly totals now calculate:
- `totalCalories`
- `totalProtein`
- `totalCarbohydrates`
- `totalFat`
- `totalSugar`
- `totalVegetableServings`
- `mealsWithNutrition`
- `mealsWithoutNutrition`

The calculation keeps full numeric precision and only rounds for display.

## Daily Calculations
Daily summary objects now include:
- calories
- protein
- carbohydrates
- fat
- sugar
- vegetable servings
- meals with nutrition data
- meals without nutrition data

The daily breakdown display now includes carbohydrates and fat in addition to the existing displayed fields.

## Average Daily Calculations
Averages are calculated across all seven days:

```text
averageCaloriesPerDay = totalCalories / 7
averageProteinPerDay = totalProtein / 7
```

The calculation does not divide by only days that contain meals.

## Custom and Missing-Meal Handling
Meals are counted under `mealsWithoutNutrition` when:
- `nutritionAvailable` is false
- recipe ID is missing
- recipe ID is invalid
- the recipe cannot be found
- nutrition fields are missing or invalid
- the meal is a custom meal

Custom meals do not add estimated nutrition values.

Each meal entry counts once, regardless of selected servings.

## Validation and Error Safety
Weekly Nutrition validates complete recipe nutrition with `isRecipeNutritionValid(recipe)`.

Required fields:
- calories
- protein
- carbohydrates
- fat
- sugar
- vegetableServings

Invalid recipes are counted as missing nutrition data instead of crashing the page.

The calculation safely handles:
- missing meal plans
- missing days
- missing meal types
- null entries
- invalid servings
- missing or invalid recipe IDs
- invalid recipe nutrition values

## Automatic Recalculation
Weekly Nutrition recalculates:
- when the page opens
- when the app renders
- after saving a meal
- after deleting a meal
- after saving the weekly plan
- after older meal-plan data is normalized

Calculated totals are not permanently saved.

## Tests Run
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js`

Additional calculation checks:
- Example recipe with 2 servings produced:
  - calories: 600
  - protein: 40
  - carbohydrates: 50
  - fat: 24
  - sugar: 8
  - vegetable servings: 2
  - meals with nutrition: 1
- Example custom meal with 3 servings produced:
  - no nutrition added
  - meals without nutrition: 1
- Starter meal-plan totals:
  - total calories: 3990
  - total protein: 199
  - total carbohydrates: 448
  - total fat: 159
  - total sugar: 92
  - total vegetable servings: 10
  - meals with nutrition: 9
  - meals without nutrition: 0
  - average calories per day: 570
  - average protein per day: about 28.4
- Verified daily totals sum back to weekly totals.
- Verified CSS braces remain balanced.
- Verified no `alert(` or `confirm(` calls were added.

## Risks or Remaining Notes
- Nutrition totals depend on linked recipe IDs and estimated recipe nutrition data.
- Custom meals remain intentionally excluded from nutrition totals until a future custom nutrition-entry feature exists.
- The Weekly Nutrition page is informational only and does not provide dietary or medical guidance.
