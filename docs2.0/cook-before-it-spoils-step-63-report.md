# Cook Before It Spoils Step 63 Report

## Goal

Create automated and documented manual tests that prevent Impact Ledger double-counting when the same physical spinach quantity is frozen, added to a rescue recipe, and confirmed consumed.

## Files Created

- `tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js`
- `docs/cook-before-it-spoils-test-impact-ledger-double-counting.md`
- `docs/cook-before-it-spoils-step-63-report.md`

## Files Changed

- `tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js`
- `docs/cook-before-it-spoils-test-impact-ledger-double-counting.md`
- `docs/cook-before-it-spoils-step-63-report.md`

## Existing Systems Inspected

- Existing Impact Ledger source of truth inspected: `buildImpactLedger()`.
- Existing effective ledger selector inspected: `selectEffectiveImpactLedgerEntries()`.
- Existing metric balance APIs inspected: `getEffectiveMetricBalance()`, `getActivityCount()`, and `getProtectedStockBalance()`.
- Existing activity types inspected: freezing action and rescue recipe completion.
- Existing permanent metrics inspected: possible food waste avoided, estimated money saved, and food protected for later use.
- Existing physical-segment deduplication inspected: `physicalSegmentId`, credited mass segments, credited value segments, and duplicate physical segment exclusions.
- Existing freezer-action boundary inspected: Step 60 freezer action tests and documentation.
- Existing no-environmental-claim boundary inspected: Impact Ledger documentation and claim policy.

## Fixed Test Context

- Required timezone: America/Toronto.
- Package opened: `2026-08-13T18:00:00-04:00`.
- Spinach frozen: `2026-08-15T18:00:00-04:00`.
- Spinach added to soup: `2026-08-20T17:45:00-04:00`.
- Soup consumed: `2026-08-20T18:30:00-04:00`.
- Test user scope: `impact-test-user`.
- Source package: `impact-test-spinach-package`.
- Freezer segment: `impact-test-spinach-freezer-segment`.
- Physical quantity tranche: `impact-test-spinach-tranche-100g`.
- Soup recipe: `impact-test-spinach-soup`.
- Soup meal: `impact-test-spinach-soup-meal`.

## Required Fixture Values

- Required tracked quantity: 100 g spinach.
- Physical quantity tranche: impact-test-spinach-tranche-100g.
- Source package price: $4.50 CAD.
- Source package quantity: 300 g.
- Unit cost: $0.015 per gram.
- Required tracked value: $1.50 CAD.

## Stage Results

- Before freezing freezing actions: 0.
- Before freezing rescue recipes: 0.
- Before freezing protected quantity: 0 g.
- Before freezing permanent waste avoided: 0 g.
- Before freezing estimated savings: $0.00.
- After freezing freezing actions: 1.
- After freezing rescue recipes: 0.
- After freezing protected quantity: 100 g.
- After freezing permanent waste avoided: 0 g.
- After freezing estimated savings: $0.00.
- After scheduling permanent impact: 0 g and $0.00.
- After scheduling freezer quantity unchanged: 100 g.
- After recipe use under conservative policy permanent impact: 0 g and $0.00.
- After recipe use under existing recipe-use credit policy permanent impact: 100 g and $1.50.
- After consumption permanent impact: 100 g and $1.50.

## Final Required Results

- Final freezing actions: 1.
- Final rescue recipes: 1.
- Final possible food waste avoided: 100 g.
- Final possible food waste avoided in kg: 0.10 kg.
- Final estimated savings: $1.50 CAD.
- Final protected quantity: 0 g.
- Permanent outcome records for tracked tranche: 1.
- Freezing-created permanent waste-avoided records: 0.
- Freezing-created permanent savings records: 0.
- Recipe-use and consumption duplicate permanent records: 0.
- Duplicate retries creating extra impact: 0.
- Reload-created duplicate impact records: 0.
- Correction-created duplicate impact records: 0.
- Same spinach counted as ingredient rescued and frozen food ultimately used: 0.
- Same savings counted at freezing, recipe preparation, and consumption: 0.
- Environmental-impact claims created: 0.

## Deduplication Results

- Permanent impact deduplication key: `permanent-impact:impact-test-user:impact-test-spinach-tranche-100g`.
- Estimated savings deduplication key: `estimated-savings:impact-test-user:impact-test-spinach-tranche-100g`.
- Deduplication by ingredient ID only: not used.
- Deduplication by meal ID only: not used.
- Deduplication by event type only: not used.
- Separate physical spinach tranche result: a second tranche may count once separately.

## Lineage Results

The permanent record preserves this chain:

```text
impact-test-spinach-package
impact-test-freezing-event
impact-test-spinach-freezer-segment
impact-test-recipe-use-event
impact-test-spinach-soup-meal
impact-test-consumption-event
impact-outcome-spinach-100g
```

Qualifying pathways retained:

- frozen-for-later-use
- used-in-rescue-recipe
- confirmed-consumed

## Credit-Timing Policy

The Step 63 test validates both allowed timing models:

- Conservative policy: permanent weight and savings finalize at confirmed consumption.
- Existing recipe-use credit policy: permanent weight and savings may start at confirmed recipe use, then consumption finalizes the same record.

Final totals are identical under both policies.

## Boundaries Confirmed

- Freezing action is an action count, not food waste avoided.
- Rescue recipe preparation is an action count, not another 100 g credit.
- Protected stock is current outstanding quantity, not permanent waste avoided.
- Recipe use does not create a new physical quantity identity.
- Consumption does not create another permanent record for the same tranche.
- Estimated savings is counted once for the physical tranche.
- No environmental-impact calculation or claim is introduced.

## Tests Added

- `tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js`

## Commands Run

Selected commands:

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

## Validation Results

- Build result: not applicable; this static app has no package build script in scope.
- Lint result: not applicable; no project lint command was available in scope.
- Type-check result: not applicable; plain JavaScript project.
- Syntax result: `app.js`, `rules.js`, and the Step 63 test file passed `node --check`.
- Unit-test result: Step 63 focused Node test passed.
- Integration-test result: related Step 33, 34, 35, 60, and 62 focused tests passed.
- Browser-test result: documented manual checks cover audit view, reload, correction, print, and export behavior.
- Accessibility-test result: existing Impact Ledger audit CSS and manual checks cover keyboard, forced-color, reduced-motion, and print behavior.

## Failures and Defects

- Pre-existing failures: none recorded during Step 63 validation.
- New defects found: none.
- Defects fixed: none; Step 63 adds tests and documentation only.
- Remaining issues: manual browser checks are documented because this feature family currently uses focused Node/static tests.

## Actual Command Outcomes

- `node --check app.js`: passed.
- `node --check rules.js`: passed.
- `node --check tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js`: passed.
- `node tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js`: passed.
- `node tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-35-monthly-impact-dashboard-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-60-freezer-actions.test.js`: passed.
- `node tests/cook-before-it-spoils-step-62-waste-diary-patterns.test.js`: passed.

## Completion Status

Step 63 completion status: Complete.

## Recommended Starting Point for Step 64

Use the Step 63 100 g tranche fixture to test any future impact dashboards, exports, or correction workflows that aggregate action counts and permanent outcome metrics in the same view.
