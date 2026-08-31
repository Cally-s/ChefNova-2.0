# Budget Rescue Meal Planner - Step 2 Planning Modes Report

## Goal

Add three planning modes to the existing Chef Nova Meal Planner:

- Standard Meal Plan
- Budget Rescue
- Emergency Plan

The modes are part of the existing Meal Planner and do not create a separate planning app.

## Files Inspected

- `docs/budget-rescue-audit.md`
- `index.html`
- `app.js`
- `style.css`
- `data/recipes.json`
- `data/recipes.js`

## Files Changed

- `app.js`
- `style.css`
- `tests/planning-mode-static.test.js`
- `co-gpt/budget-rescue-step-2-planning-modes-report.md`
- `co-gpt/gpt-copy-paste (1).md`

## Existing Systems Reused

The implementation reuses:

- existing Meal Planner page: `#planner-page`
- existing planner render: `displayMealPlanner()`
- existing weekly planner: `renderDayTabs()`, `displayActiveMealDay()`, `mealSlot()`
- existing monthly calendar: `renderMonthlyMealPlanner()`
- existing generation flow: `openMealPlanGenerationOptions()`, `createSuggestedMealPlanPreview()`, `generatePersonalizedMealPlan()`
- existing Save Plan workflow: `saveMealPlan()`
- existing Replace Meal workflow: `openMealReplacementDialog()`, `applySelectedMealReplacement()`
- existing pantry state: `state.pantry`
- existing dietary and allergy filters: `matchesDietaryPreferences()`, `isRecipeSafeForUser()`
- existing shopping list helpers: `addGeneratedPlanMissingIngredientsToShoppingList()`, `saveShoppingListItems()`
- existing user and guest storage helpers

No duplicate planner, pantry, dietary profile, allergy profile, calendar, shopping list, Save Plan workflow, or Replace Meal workflow was created.

## Planning Mode Storage

Added:

```js
const PLANNING_MODES = Object.freeze({
  STANDARD: "standard",
  BUDGET_RESCUE: "budget-rescue",
  EMERGENCY: "emergency"
});
```

The app state now includes:

```js
planningMode: "standard"
planningModeInputs: {
  budgetRescue: { weeklyGroceryBudget: "" },
  emergency: { request: "" }
}
```

Saved meal plans now safely include:

```js
planningMode
modeInputs
```

Old plans without `planningMode` still load as Standard Meal Plan.

Invalid saved modes fall back to Standard Meal Plan through `normalizePlanningMode()`.

Old saved plans are normalized in memory on load and are not rewritten during startup. The metadata is written only when the user saves the meal plan.

## Conditional Sections

Added inside the existing Meal Planner render:

- `renderPlanningModeSelector()`
- `renderBudgetRescueFields()`
- `renderEmergencyPlanFields()`
- `renderSharedPlanningSummary()`

Standard mode:

- Budget Rescue fields are hidden.
- Emergency fields are hidden.
- Existing planner controls remain available.

Budget Rescue mode:

- Weekly grocery budget field is visible.
- Emergency fields are hidden.
- Shared pantry, dietary, allergy, servings, cooking-time, calendar, and shopping list systems remain connected.

Emergency mode:

- Emergency request textarea is visible.
- Budget Rescue fields are hidden.
- Shared pantry, dietary, allergy, servings, cooking-time, calendar, and shopping list systems remain connected.

Switching modes preserves the current session's Budget Rescue and Emergency input values.

Hidden mode-specific values do not affect Standard generation.

## Generate Plan Integration

The existing Generate Suggested Meal Plan button now uses one shared entry point:

```js
handleMealPlanGenerationRequest()
```

Standard Meal Plan calls the existing generator:

```js
openMealPlanGenerationOptions()
```

Budget Rescue validates and stores the weekly grocery budget, then shows a development-stage message.

Emergency Plan validates and stores the request text, then shows a development-stage message.

The app does not falsely claim a plan is within budget or emergency-optimized.

## Validation

Budget Rescue:

- Weekly grocery budget is required.
- Amount must be greater than zero.
- Decimal currency values are accepted.
- Invalid values show the inline message:

`Enter a weekly grocery budget greater than $0.`

Emergency Plan:

- Request text is required.
- Whitespace-only text is rejected.
- Text is limited to 240 characters.
- Invalid values show the inline message:

`Describe your budget situation, such as "I have $25 until Friday."`

Standard Meal Plan:

- Does not require a budget.
- Does not require emergency text.
- Uses the existing generation behavior.

## Accessibility

Added:

- semantic `fieldset`
- visible `legend`: Planning Mode
- native radio inputs
- accessible labels and descriptions
- visible selected state that does not rely only on color
- native `hidden` attribute for inactive mode sections
- inline errors associated with the relevant fields
- polite live status text for mode changes

Keyboard users can tab to and change the planning mode with native radio behavior.

## Responsive Styling

Added responsive styles for:

- planning mode panel
- mode option cards
- Budget Rescue field section
- Emergency field section
- currency input
- shared planning summary

Desktop uses three mode cards in one row.

Tablet uses two columns.

Mobile stacks controls in one column without horizontal scrolling.

## Tests Added

Added:

`tests/planning-mode-static.test.js`

The test checks:

- planning mode constants exist
- Standard default exists
- mode normalizer exists
- selector render function exists
- shared Generate button uses the mode-aware entry point
- Budget Rescue and Emergency field identifiers exist
- mode metadata is normalized into meal plans
- styling selectors exist
- no separate Budget Rescue page exists
- no separate Emergency Plan page exists

## Validation Results

Passed:

```bash
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check languageGuidelines.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8'))"
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/planning-mode-static.test.js
```

No `package.json`, build command, lint command, or existing test framework was found.

## Deferred to Later Steps

Intentionally not implemented in Step 2:

- ingredient pricing engine
- store price catalogue
- recipe cost calculation
- cost per serving
- grocery purchase totals
- pantry quantity simulation
- budget optimization algorithm
- cheaper substitutions
- emergency natural-language parser
- emergency meal-selection algorithm
- household-size controls
- separate price confidence calculations

## Confirmation

Step 2 is complete.

The existing Chef Nova Meal Planner now has Standard Meal Plan, Budget Rescue, and Emergency Plan modes.

The implementation preserves the existing Meal Planner architecture and does not duplicate core systems.
