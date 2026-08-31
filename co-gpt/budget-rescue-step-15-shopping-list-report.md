# Budget Rescue Step 15 — Shopping List Upgrade Report

## Goal

Upgrade the existing Chef Nova Shopping List with Budget Rescue purchase groups, Pantry coverage, package quantities, price/store context, filtering, summary totals, and immediate recalculation.

## Files Changed

- `app.js`
- `style.css`
- `tests/shopping-list-budget-upgrade-static.test.js`
- `docs/shopping-list-budget-upgrade.md`
- `docs/shopping-list-budget-report.md`
- `co-gpt/budget-rescue-step-15-shopping-list-report.md`

## What Changed

- Added one Shopping List view model based on Step 6 purchase groups.
- Preserved the existing Shopping List storage source for registered users and guests.
- Added grouped sections: Produce, Grains, Protein, Dairy or alternatives, Frozen food, Canned goods, Pantry staples, and Other.
- Added filters: All Items, Need to Buy, Already at Home, Price Missing, and Optional.
- Added summary totals for grocery cost, at-home items, items to purchase, and unpriced items.
- Added item-level display for needed quantity, Pantry quantity, missing quantity, suggested purchase, estimated price, active price source, and preferred store/profile.
- Added purchase quantity editing, remove/restore behavior, purchased-item behavior, and already-at-home Pantry updates.
- Reused the existing grocery price editor for price changes.
- Kept required shortages visible when removed or under-purchased.
- Added responsive and print styling.

## Validation Performed

- JavaScript syntax checks
- JSON parse check
- Existing Budget Rescue static and engine tests
- New Shopping List budget upgrade static test
- Ingredient and price data validations

## Result

The Shopping List is now the single upgraded grocery planning surface for Budget Rescue. It uses the existing data flow, keeps missing prices visible, updates dependent budget views immediately, and does not add a duplicate shopping-list system.

