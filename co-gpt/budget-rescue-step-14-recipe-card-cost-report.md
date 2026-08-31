# Budget Rescue Step 14 - Recipe Card Cost Information Report

## Goal

Completed Step 14 by extending existing Chef Nova recipe cards with shared cost information.

## Files Changed

- `app.js`
- `style.css`
- `tests/recipe-card-cost-information-static.test.js`
- `docs/recipe-card-cost-information.md`
- `docs/recipe-card-cost-report.md`
- `co-gpt/budget-rescue-step-14-recipe-card-cost-report.md`

## Existing Card Components Reused

- `recipeCard()`
- `favoriteRecipeCard()`
- `renderSuggestedMealCard()`
- `renderSuggestedReplacementOption()`
- `mealSlot()`
- `renderGeneratedMealPreview()`

Separate Budget Recipe cards created: 0.

## Shared Renderer

Added one reusable model and renderer:

- `deriveRecipeCardCostModel()`
- `renderRecipeCardCostSummary()`
- `renderRecipeCardCostBreakdown()`

## Cost Behavior

- Recipe ingredient value uses Step 6 recipe ingredient-use cost.
- Cost per serving uses Step 6 `costPerServingCents`.
- New grocery spending is labelled separately from ingredient value.
- Current planned meals use a removal counterfactual.
- Replacement candidates use an addition counterfactual.
- Standalone recipe cards use a standalone one-recipe simulation.
- Leftover target cards show additional-only grocery cost.
- Batch source cards are labelled as batch production events.

## Pantry and Price Behavior

- Pantry coverage uses Step 8 allocation rows when meal context is available.
- Price confidence uses Step 7 labels.
- Missing prices and quantities are not treated as zero.
- Incomplete ingredient subtotals are labelled as known ingredient value.

## Breakdown Behavior

- Ingredient rows come from Step 6 ingredient cost results.
- Rows include Pantry quantity, missing quantity, price source, and warnings.
- Applied substitutions are displayed with the existing substitution caution.
- Marginal grocery values explain that they should not be summed.

## Styling

- Added compact cost metric grids.
- Added accessible inline breakdown details.
- Added incomplete-cost warning styles.
- Added mobile wrapping and print behavior.

## Validation

- Added `tests/recipe-card-cost-information-static.test.js`.
- Run the standard Budget Rescue validation suite after implementation.

## Deferred

Shopping List redesign, live grocery prices, retailer scraping, optional ingredient selection UI, and export redesign remain outside Step 14.
