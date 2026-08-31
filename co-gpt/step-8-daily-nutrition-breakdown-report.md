# Step 8 - Daily Nutrition Breakdown Implementation Report

## Goal

Show a Daily Nutrition Breakdown on the Weekly Nutrition page with nutrition totals for Monday through Sunday.

## Files Changed

- `app.js`
- `style.css`

## Daily Breakdown Structure

Daily summaries are calculated with this structure for each day:

```js
{
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
  vegetableServings: 0,
  sugar: 0,
  mealsWithNutrition: 0,
  mealsWithoutNutrition: 0,
  plannedMeals: 0
}
```

Daily nutrition totals only include planned Chef Nova recipes with valid nutrition information.

## Seven Day Cards

The Weekly Nutrition page now always renders seven day cards in this order:

1. Monday
2. Tuesday
3. Wednesday
4. Thursday
5. Friday
6. Saturday
7. Sunday

Each card displays:

- Calories
- Protein
- Vegetables
- Sugar
- Nutrition available
- Nutrition unavailable

## Calculation Rules

Daily summaries are built from the saved Meal Planner data for Breakfast, Lunch, and Dinner. Null or empty meal entries are ignored. Meals must have valid nutrition data before they contribute nutrition values.

## Serving Multiplication

The daily calculation uses only the selected servings saved in the Meal Planner entry:

- `recipe.calories * selectedServings`
- `recipe.protein * selectedServings`
- `recipe.vegetableServings * selectedServings`
- `recipe.sugar * selectedServings`

The recipe's default `servings` value is not used for daily totals.

## Valid-Meal Filtering

A meal contributes nutrition only when:

- `nutritionAvailable` is true
- a saved `recipeId` exists
- the recipe exists in the recipe database
- all required nutrition fields are valid
- selected servings are valid

Required nutrition fields validated:

- `calories`
- `protein`
- `carbohydrates`
- `fat`
- `sugar`
- `vegetableServings`

## Custom-Meal Handling

Custom meals and meals without valid nutrition information are counted as planned meals without nutrition data. They do not add zero-value nutrition as complete data.

## Empty-Day States

- Days with no planned meals show `No meals planned` and zero nutrition values.
- Days with planned meals but no valid nutrition data show `No nutrition data available for this day.` and zero nutrition values.

## Automatic Updates

The breakdown is calculated from the current saved meal plan each time the Weekly Nutrition page renders. Existing Meal Planner add, edit, delete, and serving changes call the Weekly Nutrition update path, so daily cards refresh with the current plan.

## User Guide Update

Step 9 - Weekly Nutrition now includes a `Daily nutrition breakdown` subsection explaining:

- Monday through Sunday daily totals
- calories, protein, vegetable servings, and sugar
- selected serving multiplication
- custom meal exclusion from nutrition totals
- zero nutrition states for days without valid Chef Nova recipes

## Responsive Layout

The daily card grid keeps the Chef Nova green and cream theme:

- desktop: three columns
- tablet: two columns
- mobile: one column

No horizontal scrolling was added.

## Accessibility

- The section uses a clear heading and `aria-labelledby`.
- Day names are rendered as card headings.
- Nutrition labels and units are visible text.
- Empty and no-data states are written as text, not only color.
- Mobile text remains readable in the existing responsive layout.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- Verified all seven days render Monday through Sunday.
- Verified recipe meals contribute nutrition.
- Verified custom meals do not contribute nutrition.
- Verified selected servings multiply nutrition values.
- Verified recipe default servings are not used.
- Verified Breakfast, Lunch, and Dinner are checked.
- Verified missing recipe IDs are excluded safely.
- Verified empty days show the empty state.
- Verified days with only custom meals show no nutrition data.
- Verified weekly totals equal the sum of daily totals.
- Verified locale-friendly rounding and number formatting.
- Verified singular/plural serving labels are present in the card rendering.
- Verified CSS braces are balanced.

## Risks or Remaining Notes

- Daily totals are app estimates based on recipe data and planned servings.
- If older saved meal entries do not include a `recipeId`, they are counted as planned meals without nutrition data until the user saves them again as Chef Nova recipes.
