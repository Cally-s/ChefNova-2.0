# Budget Rescue Step 14 - Recipe Card Cost Information Report

## Goal

Add clear cost information to every existing Chef Nova recipe-card path using one shared recipe-card cost model and renderer.

## Files Changed

- `app.js`
- `style.css`
- `tests/recipe-card-cost-information-static.test.js`
- `docs/recipe-card-cost-information.md`
- `docs/recipe-card-cost-report.md`
- `co-gpt/budget-rescue-step-14-recipe-card-cost-report.md`

## Card Paths Inspected

Six recipe-card paths were inspected:

1. Recipe Finder cards: `recipeCard()`
2. Favorite recipe cards: `favoriteRecipeCard()`
3. Suggested plan review meal cards: `renderSuggestedMealCard()`
4. Replacement candidate cards: `renderSuggestedReplacementOption()`
5. Weekly meal slots: `mealSlot()`
6. Generated meal preview rows: `renderGeneratedMealPreview()`

Monthly calendar cards were inspected and intentionally left compact because they are day buttons, not detailed recipe cards.

## Shared System

Added:

- `deriveRecipeCardCostModel()`
- `renderRecipeCardCostSummary()`
- `renderRecipeCardCostBreakdown()`
- Controlled `RECIPE_CARD_CONTEXTS`
- Controlled `NEW_GROCERY_COST_CONTEXTS`

Separate Budget Recipe cards created: 0

## Guardrail Results

- Missing prices treated as zero: 0
- Partial recipe subtotals labelled complete: 0
- Recipe ingredient value labelled as checkout cost: 0
- Leftover source costs double-counted: 0
- Pantry quantities applied twice: 0
- Card marginal costs summed into weekly total: 0
- Stale base-recipe costs shown after substitution: 0
- Unresolved ingredients hidden from breakdown: 0
- Cost-breakdown totals failing to reconcile: 0

## Validation

Run:

```bash
node --check app.js
node tests/recipe-card-cost-information-static.test.js
```

Recommended full validation:

```bash
node tests/cost-calculation-engine.test.js
node tests/price-confidence-static.test.js
node tests/pantry-first-planning.test.js
node tests/budget-planning-algorithm-static.test.js
node tests/leftover-batch-cooking-static.test.js
node tests/cheaper-substitution-static.test.js
node tests/budget-status-panel-static.test.js
```
