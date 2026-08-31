# Chef Nova Missing Prices and Quantities Tests

## 1. Purpose

Step 64 verifies that missing prices and quantities stay distinct from real zeros. Chef Nova may show known partial subtotals, but it must label them incomplete and preserve data-coverage counts.

## 2. Fixed Test Context

The test context uses August 2026, August 15, 2026, `2026-08-15T12:00:00-04:00`, and America/Toronto. The fixed reporting month is `2026-08`.

## 3. Complete Baseline Fixture

The complete fixture has four records:

- Spinach: 100 g used, $4.50 per 300 g, contribution $1.50.
- Mushrooms: 200 g used, $2.00 per 200 g, contribution $2.00.
- Yogurt: 100 g used, $1.00 per 100 g, contribution $1.00.
- Rice: 250 g used, $3.60 per 900 g, contribution $1.00.

Complete result:

- Weight: 0.65 kg.
- Estimated value: $5.50 CAD.
- Quantity coverage: 4 of 4.
- Price coverage: 4 of 4.
- Complete savings-input coverage: 4 of 4.

## 4. Incomplete Fixture

The incomplete fixture changes only:

- Mushrooms: package price missing.
- Yogurt: used quantity unknown.

Required result:

- Known weight subtotal: 0.55 kg.
- Known savings subtotal: $2.50 CAD.
- Quantity coverage: 3 of 4.
- Price coverage: 3 of 4.
- Complete savings-input coverage: 2 of 4.
- Missing prices: 1.
- Missing quantities: 1.

## 5. Missing Versus Zero

Missing means no value was provided. Unknown means the user or source explicitly said the value is unknown. Invalid means a provided value cannot be accepted. Confirmed zero means a real zero has provenance. Not applicable means the field does not apply.

These states must not collapse into one falsy value.

## 6. Quantity Statuses

Quantity statuses include exact, user-confirmed, estimated point, estimated range, qualitative, confirmed zero, missing, unknown, invalid, unit incompatible, unit missing, and not applicable.

Confirmed zero quantity is known. Unknown quantity is not 0.

## 7. Price Statuses

Price statuses include confirmed price, user-entered estimate, saved-store estimate, Chef Nova estimate, confirmed zero, missing, unknown, invalid, currency missing, package quantity missing, and not applicable.

Confirmed zero price is a real free item only when provenance supports it. Missing price is not $0.

## 8. Known Partial Subtotals

The incomplete fixture may show:

```text
Known quantity subtotal: 0.55 kg
Known savings subtotal: $2.50 CAD
```

Both must be labelled incomplete. They are not final complete totals.

## 9. Coverage Counts

Coverage denominators use all eligible records under review:

```text
Quantity information: 3 of 4
Price information: 3 of 4
Complete quantity-and-price information: 2 of 4
```

Incomplete records must not be removed to create 3 of 3 coverage.

## 10. Confidence

The incomplete fixture has lower confidence than the complete fixture. Missing quantity lowers weight confidence. Missing price lowers savings confidence, but it does not reduce the known physical weight subtotal.

Confidence returns only after missing data is completed.

## 11. Recipe Costs

A recipe with a missing required ingredient price must display incomplete cost:

```text
Estimated recipe cost: Incomplete
Known ingredient subtotal: $4.20
Price missing: Mushrooms
Cost per serving: Incomplete
```

Mushrooms must not be treated as free.

## 12. Shopping Lists

Unpriced Shopping List items display Price needed and keep the total incomplete. Unknown Pantry quantities use a quantity-confirmation workflow rather than assuming 0 g or unlimited supply.

## 13. Budget Rescue

When an item is unpriced, Budget Rescue may show a known subtotal but not a final reliable remaining budget. If known prices already exceed the budget, Chef Nova may say the known subtotal is above budget while still labelling the final total incomplete.

## 14. Waste Diary

Waste Diary missing prices show estimated discarded value unavailable, not $0. Missing quantities show exact discarded weight unavailable, not 0 g.

Pattern event counts stay separate from quantified totals.

## 15. Impact Dashboard

Impact metrics that require quantity or price must not create exact weight or savings when required data is missing. Missing records stay in coverage and may be review required.

## 16. Charts and Trends

Charts and trend exports use null, missing, partial, or another explicit incomplete state for missing months. Missing months are not plotted as zero.

## 17. Data Completion

Specific actions include:

- Add Mushroom Price
- Add Yogurt Quantity
- Review Incomplete Estimates

These actions open existing editors and must not create duplicate Pantry, price, Waste Diary, or Impact records.

## 18. Partial Updates and Old Clients

Omitted fields preserve existing values. Null clears a value only when the current API contract treats null as an explicit clear action, and the result is Missing, not confirmed zero.

Old clients cannot overwrite exact current values with omitted or null fields.

## 19. Migration and Database Defaults

Legacy `0` values without provenance require review. They must not become confirmed free items or confirmed depleted quantities automatically.

Absent legacy fields remain Missing or Unknown.

## 20. Idempotency and Multi-Tab Safety

Recalculation uses stable source revisions and policy versions. Adding the same missing price from two tabs updates once and does not duplicate price records or Dashboard totals.

## 21. User Isolation

Registered users remain isolated. User A with missing Mushroom price and Yogurt quantity must not borrow User B complete prices or quantities.

Guest missing-data state remains temporary and recalculates after sign-in.

## 22. Accessibility

The incomplete-estimate experience must show visible Data Coverage, Incomplete Estimate, Known Subtotal, Missing Price, Missing Quantity, Confidence, and coverage counts.

Screen-reader text must say the estimate is incomplete and that Chef Nova did not treat missing values as zero.

## 23. Mobile and Visual Modes

Mobile layouts preserve known subtotals, incomplete labels, coverage counts, missing-record names, and stacked completion actions.

High-contrast mode keeps textual labels. Reduced-motion mode avoids pulsing, shaking, or dramatic confidence animations.

## 24. Print and Export

Print and export preserve missing states:

- Weight subtotal: 0.55 kg, partial, missing Yogurt quantity.
- Savings subtotal: $2.50, partial, missing Mushrooms price and Yogurt quantity.
- Coverage: 3 of 4 quantities, 3 of 4 prices, 2 of 4 complete savings inputs.

## 25. Physical and Impact Boundaries

Dashboard calculation, coverage calculation, confidence calculation, display, print, export, reload, and chart rendering create no physical food event.

Missing-data detection creates no Food Waste Avoided, Ingredient Rescued, Estimated Money Saved, Food Protected for Later Use, Leftover Reused, Freezing Action, or Rescue Recipe credit.

## 26. Environmental-Claim Boundary

Step 64 creates no environmental claim, carbon calculation, water-footprint calculation, landfill claim, or climate-impact estimate.

## 27. Test Isolation

The Step 64 tests use isolated user, record, price, quantity, request, policy, and storage identities. They do not read real user prices, write production fixtures, call external APIs, send notifications, clear global storage, or upload analytics.

## 28. Commands

Run:

```text
node --check app.js
node --check rules.js
node --check tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js
node tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js
node tests/cook-before-it-spoils-step-28-estimated-discarded-cost-static.test.js
node tests/cook-before-it-spoils-step-29-careful-discarded-weight-static.test.js
node tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js
node tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js
node tests/cook-before-it-spoils-step-35-monthly-impact-dashboard-static.test.js
node tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js
node tests/cook-before-it-spoils-step-48-unknown-quantity-static.test.js
node tests/cook-before-it-spoils-step-50-partial-packages-static.test.js
node tests/cook-before-it-spoils-step-62-waste-diary-patterns.test.js
node tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js
node tests/price-confidence-static.test.js
node tests/respectful-budget-messages-static.test.js
```
