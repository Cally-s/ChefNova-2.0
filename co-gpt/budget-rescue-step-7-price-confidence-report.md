# Budget Rescue Step 7 - Price Confidence Protection Report

## Goal

Add price-confidence protection to Budget Rescue so Chef Nova does not make unsafe budget claims when grocery prices are missing, incompatible, or otherwise unusable.

## Files Changed

- `app.js`
- `style.css`
- `tests/price-confidence-static.test.js`
- `docs/price-confidence-protection.md`
- `docs/price-confidence-report.md`
- `co-gpt/budget-rescue-step-7-price-confidence-report.md`

## Implementation Summary

Chef Nova now derives one price-confidence result from the Step 6 cost-engine purchase groups and weekly cost summary.

The result includes:

- pricing coverage percentage
- usable grocery price count
- unresolved grocery item count
- user-entered price count
- saved profile price count
- Chef Nova estimate count
- estimate fallback count
- user-confirmed price count
- estimate-based price count
- known priced subtotal
- complete grocery total availability
- safe budget-message flags
- unresolved item reasons

## Confidence Statuses

Implemented statuses:

- High confidence
- Estimated
- Incomplete estimate

Incomplete estimate takes priority when any required grocery purchase group cannot produce a reliable purchase cost.

## Coverage Denominator

Coverage uses Step 6 aggregated purchase groups where `missingQuantity > 0`.

This means:

- shared ingredients count once
- Pantry-covered ingredients are excluded from the grocery purchase denominator
- optional or excluded items do not affect confidence
- raw recipe ingredient lines are not used as the denominator

## Safe Budget Messaging

Chef Nova now shows remaining budget only when the complete grocery total is available.

When pricing is incomplete, Chef Nova shows:

- currently priced subtotal
- unresolved item count
- reason-specific warnings
- a message that the final total may be higher

Chef Nova does not show a within-budget claim for incomplete totals.

## Add Missing Prices Workflow

The Add Missing Prices and Review Cost Issues actions reuse the existing Shopping List and Step 5 grocery price editor.

The workflow:

- preserves the current plan
- preserves Pantry data
- preserves Budget Rescue settings
- opens the Shopping List
- filters to grocery items needing review
- focuses the first price-edit button
- recalculates after a price is saved

No duplicate price editor or duplicate grocery-list system was created.

## Grocery List Indicators

Shopping-list items with unresolved cost issues now show:

- incomplete purchase cost
- reason-specific warning
- visible review styling
- existing Update Price or Add Approximate Price actions

Unresolved items are not hidden and are not displayed as `$0.00`.

## Accessibility

The confidence panel includes:

- visible `Price confidence` heading
- readable status text
- exact item counts
- progress semantics when coverage applies
- no progress bar for no-purchase plans
- keyboard-accessible actions
- polite live-region updates through the existing planner/shopping regions

## Tests Added

Added:

- `tests/price-confidence-static.test.js`

The test checks that Step 7 guardrails exist, including:

- centralized confidence derivation
- purchase-group denominator
- incomplete coverage not rounding to 100%
- safe remaining-budget guards
- Add Missing Prices workflow
- no-purchases-required handling

## Validation Summary

Required safety results:

- Missing prices treated as zero: 0
- Incomplete totals labelled as complete: 0
- Unsafe within-budget claims: 0
- Unpriced items hidden from grocery list: 0
- Fallback estimates counted as confirmed: 0
- Shared ingredients double-counted in coverage: 0

## Deferred Work

Not implemented in Step 7:

- Budget optimization algorithm
- pantry-first recipe-generation algorithm
- cheaper substitution engine
- Emergency Plan optimizer
- full Budget Status panel
- grocery-list redesign
- live grocery-price API
- retailer scraping
- store comparison
- automatic package selection
- automatic price verification
- cloud synchronization
