# Chef Nova Impact Ledger Double-Counting Tests

## 1. Purpose

Step 63 validates that the Impact Ledger does not double-count the same physical food quantity across freezing, recipe preparation, and confirmed consumption.

## 2. Fixed Context

The test uses America/Toronto and fixed local timestamps:

- Package opened: August 13, 2026 at 6:00 PM.
- Spinach frozen: August 15, 2026 at 6:00 PM.
- Spinach added to soup: August 20, 2026 at 5:45 PM.
- Soup consumed: August 20, 2026 at 6:30 PM.

The tracked quantity is 100 g frozen spinach.

## 3. Physical Quantity Identity

The exact tracked quantity uses:

```text
impact-test-spinach-tranche-100g
```

This identity must survive storage movement, freezing, Freezer Inventory, meal selection, recipe use, consumption, reload, export, and correction history.

## 4. Source Package Fixture

The source Pantry package is baby spinach:

- Package ID: `impact-test-spinach-package`
- User scope: `impact-test-user`
- Original quantity: 300 g
- Refrigerator quantity before freezing: 200 g
- Price paid: $4.50 CAD for 300 g
- Unit cost: $0.015 per gram
- Tracked value: 100 g x $0.015 = $1.50 CAD

## 5. Freezer Segment Fixture

After freezing:

- Refrigerator spinach: 100 g
- Freezer segment: `impact-test-spinach-freezer-segment`
- Freezer quantity: 100 g
- Physical quantity tranche: `impact-test-spinach-tranche-100g`

The freezer segment must not overlap the remaining refrigerator quantity.

## 6. Required Events

The Step 63 chain uses:

- `impact-test-freezing-event`
- `impact-test-recipe-use-event`
- `impact-test-consumption-event`

Each event references the same physical quantity tranche.

## 7. Recipe and Meal Fixtures

The rescue recipe is Spinach Vegetable Soup. It requires 100 g baby spinach and accepts frozen spinach.

The scheduled meal is `impact-test-spinach-soup-meal`. Scheduling may reserve the freezer segment, but it must not create rescue impact, deduct freezer quantity, or mark the spinach consumed.

## 8. Action Metrics

Action metrics answer what happened. They are counts:

```text
Freezing actions: 1
Rescue recipes: 1
```

Action quantities may be metadata, but action quantities are not summed into permanent waste-avoided weight or savings.

## 9. Outcome Metrics

Outcome metrics answer what qualifying physical food outcome occurred. They are deduplicated by physical quantity identity.

Final expected outcome:

```text
Possible food waste avoided: 100 g
Estimated savings: $1.50 CAD
```

## 10. Stage Totals

Before freezing:

```text
Freezing actions: 0
Rescue recipes: 0
Protected quantity: 0 g
Permanent food waste avoided: 0 g
Estimated savings: $0.00
```

After freezing:

```text
Freezing actions: 1
Rescue recipes: 0
Protected quantity: 100 g
Permanent food waste avoided: 0 g
Estimated savings: $0.00
```

After scheduling:

```text
Freezing actions: 1
Rescue recipes: 0
Protected quantity: 100 g
Permanent food waste avoided: 0 g
Estimated savings: $0.00
```

After recipe use under the conservative policy:

```text
Freezing actions: 1
Rescue recipes: 1
Protected quantity: 100 g
Permanent food waste avoided: 0 g
Estimated savings: $0.00
```

After recipe use under the existing recipe-use credit policy:

```text
Freezing actions: 1
Rescue recipes: 1
Protected quantity: 100 g
Permanent food waste avoided: 100 g
Estimated savings: $1.50
```

After confirmed consumption:

```text
Freezing actions: 1
Rescue recipes: 1
Protected quantity: 0 g
Permanent food waste avoided: 100 g
Estimated savings: $1.50
```

## 11. Deduplication Keys

Permanent impact uses a physical lineage key:

```text
permanent-impact:impact-test-user:impact-test-spinach-tranche-100g
```

Estimated savings uses:

```text
estimated-savings:impact-test-user:impact-test-spinach-tranche-100g
```

The ledger must not deduplicate only by ingredient ID, meal ID, or event type.

## 12. Full Lineage

The permanent record preserves:

```text
source Pantry item -> freezer segment -> soup meal -> consumption
```

The source event chain is:

```text
impact-test-freezing-event
impact-test-recipe-use-event
impact-test-consumption-event
```

## 13. Corrections

Corrections recalculate the effective ledger record. They do not append a second permanent record for the same tranche.

The original impact record remains auditable through replacement or correction history.

## 14. Retries, Reloads, and Multi-Tab Actions

Retrying freeze, recipe-use, or consumption commands with the same request identity must not duplicate:

- Freezing actions
- Rescue recipe actions
- Protected stock
- Permanent food waste avoided
- Estimated savings

Reloading the projection must produce the same output.

## 15. Separate Physical Quantities

Two separate spinach tranches may each count once. Deduplication prevents duplicate credit for the same physical tranche, not legitimate credit for different source quantities.

## 16. Dashboard Wording

The dashboard may show:

```text
Freezing actions: 1
Rescue recipes: 1
Physical spinach ultimately used: 100 g
Possible food waste avoided: 100 g
Estimated savings: $1.50 CAD
Food protected for later use: 0 g
```

It must not show:

```text
Possible food waste avoided: 300 g
Estimated savings: $4.50
Ingredients rescued: 3
```

## 17. Environmental Boundary

No environmental-impact claim is created by Step 63. Do not add carbon, CO2e, water-footprint, landfill, or climate-impact calculations.

## 18. Manual Checks

Where browser verification is available, manually confirm:

- The audit view shows action records separately from permanent outcome records.
- The full lineage is reviewable internally.
- Reloading the page does not duplicate metrics.
- Correcting the recipe-use or consumption event recalculates existing impact.
- Print and export output keep action counts separate from permanent impact totals.
- No environmental claim appears in visible, printed, or exported output.

## 19. Commands

Run:

```text
node --check app.js
node --check rules.js
node --check tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js
node tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js
node tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js
node tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js
node tests/cook-before-it-spoils-step-35-monthly-impact-dashboard-static.test.js
node tests/cook-before-it-spoils-step-60-freezer-actions.test.js
node tests/cook-before-it-spoils-step-62-waste-diary-patterns.test.js
```
