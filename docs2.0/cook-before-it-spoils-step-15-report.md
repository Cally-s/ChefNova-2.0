# Step 15 Report: Prevent Excessive or Unplanned Cooking

## Goal

Add a Portion Preview before Cook This Tonight confirmation so users must see and handle extra prepared servings before Chef Nova reserves Pantry food, adds Shopping List demand, saves the meal, or records cooking outcomes.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-prevent-excessive-cooking.md`
- `docs/cook-before-it-spoils-step-15-report.md`
- `tests/cook-before-it-spoils-step-15-portion-preview-static.test.js`

## Implementation Summary

- Added versioned Portion Preview and serving-allocation metadata.
- Added excessive prepared-food statuses, minimum-batch reason codes, and explicit extra-serving action types.
- Added `buildCookTonightPortionPreview()`, `renderCookTonightPortionPreview()`, `applyPortionPreviewOption()`, and supporting helpers.
- Replaced completion-language wording with projected-use wording: “Priority foods projected to be used.”
- Added a minimum-batch notice when the recipe yield is greater than the user’s current serving allocation.
- Blocked Cook This Tonight review and final confirmation when unallocated servings need a user decision.
- Preserved planned frozen servings, planned shared servings, explicit unallocated acceptance, and the full portion preview in saved meal metadata.
- Added outcome fields so actual frozen/shared/unallocated serving results can be confirmed after cooking.
- Added food-event history entries for frozen/shared servings only after completion confirmation.

## User Actions Added

- Cook and Freeze
- Find a Smaller Recipe
- Plan to Share
- Keep Full Yield

Each visible action is wired to an existing or new behavior. Preview actions do not reserve Pantry food, deduct Pantry food, update Shopping List demand, create calendar meals, or create food-event history.

## Safety and Data Boundaries

- No Pantry quantity is deducted during preview or plan confirmation.
- No food is marked frozen, shared, rescued, used, wasted, or left over during preview.
- Pantry reservations still happen only during final plan confirmation.
- Pantry deductions and actual outcome events still happen only after the user confirms meal completion.
- Existing Smart Portion, Practical Scaling, hard filters, Food Rescue ranking, Pantry allocation, Shopping List, meal planner, and account storage are preserved.

## Validation Performed

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parsed `data/recipes.json`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- `node tests/cook-before-it-spoils-step-15-portion-preview-static.test.js`
- full `tests/*.js` suite

## Notes

Direct browser verification for local `file://` pages may be limited by the in-app browser’s URL policy. The feature was validated with syntax checks and static tests.
