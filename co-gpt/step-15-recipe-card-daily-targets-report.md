# Step 15 - Recipe Card Daily Target Connection Implementation Report

## Goal

Connect Chef Nova's saved Daily Nutrition Target to recipe cards and recipe detail views so users can see how a selected serving amount approximately contributes to their daily calorie, protein, carbohydrate, and fat ranges.

## Files Changed

- `app.js`
- `style.css`
- `co-gpt/step-15-recipe-card-daily-targets-report.md`

## Recipe Detail Updates

Added a new recipe detail section:

`How This Recipe Fits Your Plan`

The section includes:

- selected serving input
- selected serving nutrition
- approximate daily range contribution percentages
- neutral recipe nutrition tags
- unavailable state when no valid Daily Nutrition Target exists
- required planning disclaimers
- under-18 note when the active Nutrition Profile age is under 18

The selected servings input defaults to `1`, uses `type="number"`, and updates the recipe nutrition comparison immediately without changing the base recipe data.

## Helper Functions Added

- `calculateRecipeRangeContribution(nutrientAmount, dailyMinimum, dailyMaximum)`
- `formatApproximatePercentageRange(range)`
- `getRecipeNutritionForServings(recipe, servings = 1)`
- `buildRecipePlanFit(recipe, selectedServings, dailyTarget)`
- `buildRecipeNutritionTags(recipe, nutrition)`
- `formatRecipeNutritionValue(value, unit = "")`
- `buildRecipeContributionStatements(recipePlanFit)`
- `getRecipeNutritionTagScore(recipe)`
- `renderRecipePlanFit(recipe, selectedServings = 1)`
- `updateRecipePlanFitSection(recipeId)`

## Contribution Formula

Daily target range contributions use the requested reversed range formula:

- minimum percentage = recipe amount / daily maximum * 100
- maximum percentage = recipe amount / daily minimum * 100

Percentages are rounded to whole numbers.

Displayed percentages are capped at `999%`. Values above the cap show:

`More than 999%`

## Nutrition Tags

Recipe tags are neutral and limited to four visible tags.

Supported tags:

- Higher protein
- Vegetable-rich
- Higher fibre
- Carbohydrate-rich
- Lower added sugar
- Contains unsaturated fat
- Balanced meal option
- Workout-supporting

`Lower added sugar` appears only when `addedSugar` data exists. Total sugar is not treated as added sugar.

No unsupported or misleading labels were added.

## Missing Nutrition Handling

Recipe detail nutrition uses `Not available` for missing nutrient values.

Missing nutrition is not replaced with zero in the recipe-plan comparison.

Recipes with incomplete required nutrition are not treated as complete Weekly Nutrition entries.

## Storage

No recipe contribution percentages are stored in:

- recipes data
- Favorites
- Meal Planner
- Shopping List
- Nutrition Profile
- Daily Nutrition Target

Daily target data continues to use the existing account-specific registered storage and guest session storage behavior.

## User Guide Update

The Instructions page was updated to explain:

- Recipe Details can show selected-serving nutrition comparisons.
- Comparisons are approximate planning references.
- Neutral nutrition tags are not judgmental food labels.
- Personalized recipe percentages are calculated for display and are not saved into recipe data.

The existing Instructions layout and modal behavior were not redesigned.

## Styling

Added styles for:

- recipe nutrition tags
- recipe plan-fit panel
- serving selector
- selected serving nutrition grid
- daily contribution list
- unavailable comparison message
- under-18 note
- disclaimer text
- responsive stacking on smaller screens

## Validation Performed

- Confirmed all required helper functions and required display text are present.
- Confirmed 35 recipes are present in `data/recipes.json`.
- Confirmed all checked recipes include valid numeric nutrition and servings values.
- Confirmed recipe IDs remain unique.
- Confirmed unsupported nutrition labels are not present.
- Confirmed formula test examples produce expected percentage ranges.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- Parsed `data/recipes.json` successfully.
- Ran a targeted formula check for calorie, protein, carbohydrate, and fat contributions.
- Ran a prohibited wording scan across `app.js`, `index.html`, `style.css`, `data/recipes.json`, and `data/recipes.js`.

## Risks or Notes

- The in-app browser blocked direct `file://` navigation under its browser-use safety policy, so the final browser interaction check could not be completed there.
- The feature is display-only and does not make medical claims or strict daily-limit recommendations.
- Ingredient substitutions, toppings, sauces, oils, and portion changes may change real nutrition values.
