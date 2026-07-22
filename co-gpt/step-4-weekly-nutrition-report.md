# Step 4 Implementation Report — Weekly Nutrition Page

## Goal
Create a Weekly Nutrition page that calculates estimated weekly nutrition totals from meals saved in the Meal Planner.

Nutrition values are estimates based on the recipe data and planned servings. They are not medical or professional dietary advice.

## Files Changed
- `index.html`
- `app.js`
- `style.css`

## New Weekly Nutrition Page
Added a new page section:
- `weeklyNutritionPage`
- page key: `weekly-nutrition`

The page includes:
- title: `Weekly Nutrition`
- description
- estimate note
- summary cards
- missing-data notice
- empty state
- daily breakdown

## Navigation Update
Added a new navigation link:
- `Weekly Nutrition`

It uses the existing Chef Nova hash/page navigation system and does not reload the website.

## Eight Summary Cards
The Weekly Nutrition page displays:
- Total Calories
- Average Calories per Day
- Total Protein
- Average Protein per Day
- Vegetable Servings
- Sugar
- Meals with Nutrition Data
- Meals without Nutrition Data

## Weekly Calculation Rules
Added reusable calculation/display helpers:
- `getWeeklyNutritionSummary()`
- `calculateMealNutrition(mealEntry)`
- `isRecipeNutritionValid(recipe)`
- `getPlannedMeals()`
- `displayWeeklyNutrition()`
- `formatNutritionNumber(value)`
- `updateWeeklyNutritionPage()`

The page validates complete recipe nutrition before counting a recipe as nutrition-ready:
- `calories`
- `protein`
- `carbohydrates`
- `fat`
- `sugar`
- `vegetableServings`

## Serving Multiplication
For recipe meals with nutrition data, the calculation uses:

```text
recipe nutrition per serving * planned meal servings
```

It does not multiply by the recipe's default total `servings` field.

## Meals With and Without Nutrition Data
Meals count as having nutrition data only when:
- `nutritionAvailable` is true
- `recipeId` exists
- the matching recipe exists
- all required nutrition fields are valid numbers

Meals count as missing nutrition when:
- they are custom meals
- `nutritionAvailable` is false
- `recipeId` is missing
- the linked recipe cannot be found
- required nutrition fields are missing or invalid

Each meal entry counts once, regardless of planned serving count.

## Daily Breakdown
Added a daily breakdown for:
- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

Each day displays:
- calories
- protein
- vegetable servings
- sugar
- meals with nutrition data
- meals without nutrition data

Days with no planned meals show:

```text
No meals planned
```

## Automatic Recalculation
Weekly Nutrition recalculates when:
- the page opens
- the app renders
- a meal is saved
- a meal is deleted
- the weekly plan is saved

Calculated totals are not stored permanently; they are derived from the current Meal Planner state.

## Empty and Missing-Data States
When no meals are planned:
- summary cards show zero values
- an empty state appears with an `Open Meal Planner` button

When planned meals lack nutrition data:
- a missing-data notice appears
- the notice includes the number of meals not included in nutrition totals

## User Guide Step 9
Added a new User Guide card:
- Step 9 — Weekly Nutrition

The details modal explains:
- what Weekly Nutrition does
- how to use it
- Chef Nova recipes contribute nutrition totals
- custom meals are counted but excluded from nutrition totals
- averages are calculated across seven days
- nutrition values are estimates per serving

## Responsive Behavior
- Desktop summary cards use up to four columns.
- Tablet summary cards use two columns.
- Mobile summary cards stack in one column.
- Daily breakdown shifts from three columns to two columns to one column.
- Text and buttons remain within available width.

## Accessibility
- Summary values use visible text labels and units.
- The navigation link is keyboard accessible through the existing navigation system.
- Empty-state and missing-data messages are readable text.
- Cards use semantic article elements and headings.
- Color is not the only source of meaning; labels and counts are shown in text.

## Tests Run
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js`
- Static verification:
  - Weekly Nutrition navigation exists.
  - Weekly Nutrition page section exists.
  - all eight summary labels exist.
  - calculation helper functions exist.
  - missing-data notice exists.
  - empty state exists.
  - Step 9 guide content exists.
  - Weekly Nutrition CSS exists.
  - CSS braces are balanced.
- Starter meal-plan calculation check:
  - planned meals: 9
  - meals with nutrition data: 9
  - meals without nutrition data: 0
  - total calories: 3990
  - average calories per day: 570

## Risks or Remaining Notes
- Nutrition values are only as accurate as the estimated recipe data.
- Custom meals are intentionally excluded from nutrition totals until a future feature adds custom nutrition entry.
- Missing or invalid linked recipe IDs are handled safely and counted as meals without nutrition data.
