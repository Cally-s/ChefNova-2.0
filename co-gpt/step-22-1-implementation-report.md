# Step 22.1 Implementation Report — Simplify Meal Planner Input

## Goal
Simplify the Chef Nova Meal Planner so each meal slot uses one combined field instead of a separate recipe dropdown and custom meal input.

## Files Changed
- `app.js`
- `style.css`

## Duplicate Input Fields Removed
- Removed the old recipe dropdown from each meal slot.
- Removed the separate custom meal input pattern.
- Removed the old Edit button because the combined field is always directly editable.
- Removed JavaScript that copied a selected dropdown value into a second input.

## Combined Recipe and Custom Meal Field
- Each Breakfast, Lunch, and Dinner slot now has one visible field labeled `Meal`.
- Placeholder:
  - `Select a recipe or type a custom meal`
- Existing saved meals display once in:
  - the `Planned:` text
  - the single combined input field

## Autocomplete Behavior
- Recipe suggestions come from the loaded Chef Nova recipe database.
- Suggestions are:
  - case-insensitive
  - deduplicated by recipe name
  - limited to 8 visible results
- Users can type a custom meal that does not match any recipe.
- Keyboard support includes:
  - Arrow Down
  - Arrow Up
  - Enter to select
  - Escape to close
- Suggestions close when clicking outside the meal combobox.

## Saved Data Compatibility
- The existing `chefNovaMealPlan` localStorage key is unchanged.
- The saved meal format remains the meal name string.
- Older saved plans load into the new combined input without data migration.
- Custom meal names continue to save normally.

## Save and Delete Behavior
- Save stores the selected recipe name or custom typed meal.
- Empty input is blocked with:
  - `Please select a recipe or enter a custom meal`
- Successful save shows:
  - `Meal plan updated`
- Delete clears the planned meal and shows:
  - `Meal removed`

## Responsive Design
- The combined input uses the full meal card width.
- Save and Delete appear in a clean two-button row on desktop.
- Buttons stack on small mobile screens through the existing responsive rules.
- Suggestion dropdown is constrained and scrollable to avoid overflow.

## Accessibility
- The field has a visible `Meal` label.
- The input uses combobox ARIA attributes:
  - `role="combobox"`
  - `aria-autocomplete="list"`
  - `aria-expanded`
  - `aria-controls`
  - `aria-activedescendant`
- Suggestions use `role="listbox"` and `role="option"`.
- Active suggestions are visually highlighted and marked with `aria-selected`.

## Tests Run
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js`
- Static verification:
  - Old `data-meal-select` dropdown references removed.
  - Old edit meal action removed.
  - Combined placeholder exists.
  - Empty validation message exists.
  - Suggestion limit exists.
  - Keyboard handler exists.
  - Click-outside close handler exists.
  - Suggestion CSS exists.
  - CSS braces are balanced.
  - No `alert(` calls.
  - No `confirm(` calls.

## Risks or Remaining Notes
- The current meal plan structure stores the meal name only, so recipe IDs are not added. This preserves compatibility with all existing saved plans.
- Custom meals are not added to the recipe database, as requested.
