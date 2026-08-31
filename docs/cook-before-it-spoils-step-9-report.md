# Step 9 Implementation Report: Recipe Rescue Ranking

## Goal

Add a food-rescue recipe ranking profile that ranks eligible Recipe Finder results by how well they use selected Use These First Pantry foods.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-recipe-rescue-ranking.md`
- `docs/cook-before-it-spoils-step-9-report.md`
- `tests/cook-before-it-spoils-step-9-recipe-rescue-ranking-static.test.js`

## Implementation Summary

- Added `FOOD_RESCUE_RANKING_PROFILE`.
- Added score and version constants.
- Added temporary request state for selected rescue sources.
- Connected Use These First recipe search to the new ranking request.
- Revalidated selected Pantry sources before ranking.
- Ranked only recipes that pass the existing recipe eligibility engine.
- Used structured ingredient ids, compatible units, and compatible forms for rescue-source usage.
- Reused the shared Pantry-first allocation engine for Pantry coverage.
- Estimated full-package purchase impact for missing ingredients.
- Added rescue score, reasons, projected source use, and a details modal to recipe cards.

## Storage

No new localStorage or sessionStorage keys were added. Food-rescue ranking requests are temporary app state and are cleared when the recipe search is reset.

## Safety

Existing food-safety guardrails remain hard constraints. Sources that need review, have unknown quantity, or no longer pass automatic-planning rules are removed before recipe ranking.

## Validation Performed

- `node --check app.js`: passed
- `node --check rules.js`: passed
- `node --check data/recipes.js`: passed
- `node --check scripts/recipe-eligibility-ranking.js`: passed
- Parsed `data/recipes.json`: passed
- `node scripts/validate-ingredient-data.js`: passed
- `node scripts/validate-price-data.js`: passed
- All `tests/*.js`: passed

## Risks and Notes

- Prepared leftover source ranking is intentionally blocked until Chef Nova has validated leftover transformation rules.
- Price impact uses full-package purchase estimates when a new grocery group is needed.
- Ranking applies after normal Recipe Finder filters, allergies, dietary settings, and personalized filters.
