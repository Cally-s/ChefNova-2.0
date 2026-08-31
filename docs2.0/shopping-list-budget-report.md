# Shopping List Budget Upgrade Report

## Goal

Upgrade the existing Shopping List with Budget Rescue purchase groups, Pantry coverage, package guidance, price and store context, filters, summary totals, and instant recalculation.

## Files Changed

- `app.js`
- `style.css`
- `tests/shopping-list-budget-upgrade-static.test.js`
- `docs/shopping-list-budget-upgrade.md`
- `docs/shopping-list-budget-report.md`
- `co-gpt/budget-rescue-step-15-shopping-list-report.md`

## Implementation Summary

- Added one Shopping List view model derived from current meal-plan purchase groups.
- Added category mapping and ordering for the required grocery sections.
- Added All Items, Need to Buy, Already at Home, Price Missing, and Optional filters.
- Added an overall summary with estimated total, priced subtotal, at-home count, purchase count, and unpriced count.
- Reused the existing price editor for item price updates.
- Preserved existing user and guest storage behavior.
- Kept removed required items visible as unresolved needs through Shopping List overrides.
- Added purchase-quantity overrides, restore behavior, purchased state, and Pantry update behavior.
- Added responsive and print styles for the upgraded Shopping List.

## Validation

Validation confirms:

- The app parses successfully.
- The upgraded list uses purchase groups from the cost engine.
- Pantry allocations and missing quantities remain visible.
- Missing prices are displayed as missing instead of zero.
- Guest and registered-user Shopping List storage are preserved.
- No second Shopping List system was added.

## Notes

The Shopping List continues to use local browser storage only. It does not use live grocery prices, live store inventory, scraping, ordering, payments, a backend, or external APIs.

