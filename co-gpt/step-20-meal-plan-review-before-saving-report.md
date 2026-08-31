# Step 20 - Meal-Plan Review Before Saving Implementation Report

## Files Changed

- `app.js`
- `style.css`
- `co-gpt/step-20-meal-plan-review-before-saving-report.md`

## Suggested Weekly Plan Review

Added a full `Suggested Weekly Plan` review flow after `generatePersonalizedMealPlan()` creates a temporary result.

Suggested Weekly Plan must remain a temporary review and must not automatically overwrite or save the user’s existing Meal Planner.

The review must show meals for Monday through Sunday, daily estimated calories, protein, carbohydrates, fat, vegetable servings, missing nutrition information, and neutral reasons for each suggested meal.

## Temporary Review-State Handling

Added in-memory-only review state:

- `suggestedMealPlanReviewState`
- `suggestedMealPlanReviewBusy`

The review state stores a cloned generated result, cloned draft plan, cloned original saved plan, generation options, context version, focus reference, and unsaved-change flag.

Temporary scores, suggestion reasons, replacement candidates, and review drafts must not be permanently stored.

## Monday-through-Sunday Layout

The review displays seven day cards from Monday through Sunday inside a responsive grid.

Each day card uses a unique heading ID and includes Breakfast, Lunch, and Dinner meal cards.

## Meal-Card Information

Each recipe meal card shows:

- Meal type
- Recipe name
- Selected servings
- Cooking time
- Up to three nutrition tags
- Why suggested
- Replace Meal
- Edit Servings

Protected manual/custom meals are marked as existing preserved meals and do not show Replace Meal.

## Suggestion-Reason Logic

Added `buildMealSuggestionReasons()` with neutral reasons based on diet match, nutrition fit, Pantry match, goal match, variety, cooking-time match, and fallback generated reasons.

No raw score numbers are shown.

Chef Nova must not guarantee weight change, muscle gain, athletic performance, recovery, or medical outcomes.

## Daily Nutrition Summaries

Added daily planned nutrition display for:

- Calories
- Protein
- Carbohydrates
- Fat
- Vegetable servings

Daily values use selected serving amounts and are described as estimated planned nutrition, not actual intake.

## Missing-Nutrition Handling

Meals without valid core nutrition show `Nutrition information unavailable`.

Missing nutrition data must reduce coverage and must not be treated as zero.

## Nutrition-Data Coverage

Added `calculateDayNutritionCoverage()` for daily coverage and `calculateGeneratedPlanNutritionCoverage()` for the full draft.

The review shows coverage percentages and missing-data notices.

## Weekly Planning Summary

Added a neutral weekly planning summary with:

- Total planned meals
- Unique recipes
- Protein-source groups
- Carbohydrate-source groups
- Days with vegetables or fruit
- Nutrition-data coverage
- Goal explanation
- Generation notes

## Save Plan Confirmation

Users must be able to Regenerate, Replace Meal, Edit Servings, Cancel, and request Save Plan from the review.

Save Plan must open a clear confirmation before changing the active Meal Planner.

## Fill-Empty-Slots Save Wording

The confirmation explains that existing meals preserved during generation remain in place and new suggestions are added to selected empty slots.

## Replace-Entire-Plan Save Wording

The confirmation explains that the current saved Meal Planner will be replaced with the reviewed suggested plan.

## Context-Version Guard

Added `buildMealPlanContextVersion()` to compare the active user, guest mode, allergies, dietary preferences, avoided foods, goal, Pantry signature, profile update time, target update time, and meal-planning preference update time.

If profile, allergy, dietary, Pantry, goal, or meal-planning settings change while the review is open, Chef Nova must revalidate or regenerate before saving.

## Final Safety Validation

Before saving, Chef Nova revalidates the draft plan with `validateGeneratedMealPlanSafety()`.

Allergy safety, dietary preferences, foods to avoid, and age-based protections must be checked again before the reviewed plan is saved.

## Regenerate Behaviour

Regenerate uses the latest profile and preferences with the same generation mode.

If the review has unsaved edits, Chef Nova asks before replacing the temporary preview.

## Unsaved-Change Protection

Replacing a meal or editing servings sets `hasUnsavedChanges`.

Cancel and Escape use discard confirmation when preview edits exist.

## Replace Meal Flow

Added replacement selection flow:

- Rechecks current context before showing alternatives.
- Filters by allergy safety, dietary preferences, avoided foods, and meal type.
- Excludes the current recipe where alternatives exist.
- Shows up to six ranked alternatives.
- Replaces only after the user chooses Select.

Replacing a meal or editing servings must update only the temporary draft and must recalculate the affected nutrition summaries.

## Replacement Scoring and Safety Checks

Replacement options use the existing meal-plan safety filters and recipe ranking system with current draft context.

Stale replacement choices are rejected if safety or preference data no longer matches.

## Edit Servings Flow

Added serving editor with Decrease, numeric input, Increase, Apply, and Cancel.

The editor uses visible labels and updates only the temporary preview.

## Serving Validation

Added `normalizeReviewServingAmount()`.

Accepted range is 0.5 to 10 servings in 0.5 increments.

Zero, negative values, non-numeric values, infinity, and very large values are rejected.

## Cancel and Discard Behaviour

Cancel without edits closes the temporary preview.

Cancel with edits opens a discard confirmation and never alters the saved Meal Planner.

## Escape-Key Behaviour

Escape uses the same logic as Cancel.

Edited previews are not silently discarded.

## Minor Protections

For users under 18 with Gradually change weight, the exact professional-guidance notice appears near the top of the review and again in Save confirmation.

## Unknown-Age Behaviour

When age is unknown and the goal is Gradually change weight, Chef Nova shows maintenance-style planning notice and still allows review and save after safety validation.

## Guest Mode Behaviour

Guest users can review and edit temporary plans.

The preview is not written to sessionStorage before confirmed Save.

After confirmed Save, only the final reviewed guest meal plan is saved to the existing guest Meal Planner session key.

## Account-Switch Protection

Authentication dialog cleanup closes the review and clears temporary review state during logout, account switch, and Guest Mode exit.

Account isolation remains intact.

## Privacy Result

No external APIs, backend, or database were added.

Temporary preview data, reasons, scores, context signatures, and replacement candidates are not stored permanently.

No private nutrition/profile details are logged.

## Accessibility Result

The review modal has a clear heading, logical day headings, keyboard-accessible buttons, visible button labels, Escape handling, focus trapping through the existing modal handler, and focus restoration after closing.

## Responsive Result

Added responsive styling for review day cards, nutrition summaries, replacement cards, serving controls, and action buttons.

Desktop shows a compact grid, tablet uses fewer columns, and mobile stacks content into one column.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- Parsed `data/recipes.json` successfully
- Searched for prohibited wording
- Searched generation-area code for automatic storage/write behavior

