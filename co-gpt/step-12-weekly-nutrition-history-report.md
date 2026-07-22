# Step 12 - Weekly Nutrition History Implementation Report

## Goal

Allow users to optionally save completed Weekly Nutrition summaries so they can compare different weeks later.

## Files Changed

- `index.html`
- `app.js`
- `style.css`

## LocalStorage Key

The feature uses exactly this storage key:

chefNovaNutritionHistory

History is stored as a JSON array.

## Saved History Structure

Each saved entry includes:

```js
{
  weekStart: "2026-07-20",
  weekEnd: "2026-07-26",
  savedAt: "2026-07-26T18:30:00.000Z",
  calories: 12000,
  protein: 420,
  vegetableServings: 16,
  sugar: 290,
  mealsWithNutrition: 15,
  mealsWithoutNutrition: 3
}
```

Only weekly nutrition totals and coverage counts are saved. The full Meal Planner is not stored inside history entries.

## Week Date Calculation

Added helpers:

- `getStartOfWeek(date)`
- `getEndOfWeek(date)`
- `formatDateAsLocalISO(date)`
- `formatWeekDateRange(weekStart)`

Monday is used as `weekStart`, Sunday is used as `weekEnd`, and `weekStart` is stored as `YYYY-MM-DD` using local date formatting to avoid UTC date shifts.

## Save This Week Behavior

Added a `Save This Week` button to Weekly Nutrition.

When clicked, Chef Nova:

1. Recalculates the latest weekly nutrition summary.
2. Requires at least one meal with nutrition data.
3. Creates a compact numeric history entry.
4. Saves it to `chefNovaNutritionHistory`.
5. Refreshes the saved-history preview.
6. Shows `Weekly nutrition summary saved.`

## Duplicate-Week Replacement

Only one entry is stored for each `weekStart`. Saving the same Monday-to-Sunday week again replaces the old entry, updates `savedAt`, and shows:

`Weekly nutrition summary updated in history.`

## History Preview

Added a `Saved Weekly Summaries` section to Weekly Nutrition. It displays:

- week date range
- calories
- protein
- vegetable servings
- sugar
- saved date
- Delete button

When no history exists, the section shows:

`No weekly summaries saved yet.`

## Delete and Clear Actions

Each saved card includes a Delete button. Deleting removes only the selected week and shows:

`Saved weekly summary deleted.`

Added a `Clear History` button. It removes only `chefNovaNutritionHistory` and shows:

`Nutrition history cleared.`

The current Meal Planner and other localStorage data are not cleared.

## No-Data Validation

Chef Nova does not save a weekly history entry when `mealsWithNutrition === 0`. It shows:

`Add meals with nutrition data before saving this week.`

## User or Guest Storage Behavior

Chef Nova currently stores app data at the shared browser/localStorage level, so nutrition history also uses the required shared browser key `chefNovaNutritionHistory`. The account storage system was not redesigned.

## Accuracy Wording

Saved Weekly Summaries includes this note:

`Saved summaries contain estimated nutrition values from the week at the time they were saved.`

Required note:

Saved weekly summaries contain estimated nutrition values based on recipe data and selected servings. Custom meals may not be included.

## User Guide Update

Step 9 - Weekly Nutrition now includes a `Saving weekly history` subsection explaining:

- complete or update the Meal Planner
- open Weekly Nutrition
- select Save This Week
- Chef Nova saves the current Monday-to-Sunday estimated totals
- saving the same week again updates the existing entry
- saved summaries can be deleted later
- history is optional
- saved summaries may exclude custom meals

## Accessibility

- `Save This Week`, `Clear History`, and Delete are real buttons and keyboard accessible.
- Saved week headings are readable text.
- Dates and nutrition units are displayed as text.
- Meaning is not communicated only through color.
- Confirmations appear before deleting or clearing saved summaries.

## Responsive Design

- Desktop: saved summary cards display in a multi-column grid.
- Tablet: saved summary cards use two columns.
- Mobile: saved summary cards stack in one column with visible buttons.
- No horizontal scrolling was added.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- Verified `chefNovaNutritionHistory` is created as a JSON array.
- Verified saved calories, protein, vegetable servings, and sugar are stored as numbers.
- Verified current week Monday saves as `weekStart`.
- Verified current week Sunday saves as `weekEnd`.
- Verified saving the same week replaces the existing entry.
- Verified no-data summaries are not saved.
- Verified newest-first sorting.
- Verified deleting one week does not clear the Meal Planner.
- Verified Clear History removes only nutrition history.
- Verified corrupted history JSON returns an empty history instead of crashing.
- Verified required buttons, helper functions, guide text, and styles exist.
- Verified CSS braces are balanced.

## Risks or Remaining Notes

- History is optional and never saves automatically when the Meal Planner changes.
- Saved history is browser-local because the current Chef Nova app uses browser localStorage.
- Confirmation uses the app's available confirmation approach without changing the notification-specific modal.
