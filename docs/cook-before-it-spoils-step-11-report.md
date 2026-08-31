# Cook Before It Spoils Step 11 Report

## Goal

Add a food-rescue presentation and action layer to existing Chef Nova recipe cards without creating a second recipe-card system.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-food-rescue-recipe-card.md`
- `docs/cook-before-it-spoils-step-11-report.md`
- `tests/cook-before-it-spoils-step-11-food-rescue-card-static.test.js`

## Implementation Summary

- Added a `buildFoodRescueCardViewModel()` presentation adapter for Step 9 ranking output.
- Extended the existing `recipeCard()` food-rescue summary area.
- Kept Step 10 hard-filter eligibility as the display gate.
- Added projected-use rows for each selected pantry source.
- Added coverage, pantry coverage, grocery count, cost estimate, time, servings, effective yield, leftover fit, explanation, and risk information.
- Added action buttons for cooking tonight, adjusting portions, viewing details, searching other recipes, finding a second use, and reviewing freeze options.
- Added remainder-aware second-use search that excludes the first recipe.
- Added stale-data revalidation before saving a Cook This Tonight meal entry.
- Added responsive, print, and forced-color styling for the expanded card section.

## Wording Protection

The recipe card uses projected wording such as `Would Use`, `would remain`, and `planning estimates`. It does not claim food was rescued, saved, or removed from waste before cooking is confirmed.

## Storage Protection

The card does not deduct pantry quantities, write food-event history, or change pantry storage during rendering, details, freeze guidance, or portion preview. Meal-plan saves use the existing meal-plan storage layer.

## Validation Performed

Validation completed after implementation:

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- `node --check scripts/recipe-eligibility-ranking.js`
- parsed `data/recipes.json`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- all tests in `tests/*.js`

## Results

All available static checks and tests passed.

## Notes

This workspace does not include a package build command or a Git repository. No Git commit was created.
