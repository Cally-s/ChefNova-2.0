# Ingredient Migration Report

## Summary
- Recipes inspected: 35
- Ingredient lines inspected: 241
- Structured entries created: 241
- Canonical ingredients created: 100
- Aliases created: 24
- Exact quantities: 241
- Ranges: 0
- Approximate quantities: 0
- Unquantified amounts: 0
- Package-size-unknown entries: 0
- Optional ingredients: 35
- Manually reviewed overrides: 0
- Unresolved ingredient identities: 0
- Ambiguous aliases: 0
- Unknown units: 0

## Validation Result
Passed. No validation errors found.

## Files Changed
- `data/ingredients.json`
- `data/ingredients.js`
- `data/recipes.json`
- `data/recipes.js`
- `data/ingredient-migration-overrides.json`
- `docs/ingredient-migration-report.md`

## Notes
- `data/recipes.json` is the canonical recipe source.
- `data/recipes.js` is regenerated for direct `index.html` opening.
- Original visible ingredient wording is preserved in `displayText`.
- No prices, budget totals, package guesses, or grocery-cost claims were added.
