# Cook Before It Spoils Step 50 Report

## Goal
Handle partially used packages while keeping original package size separate from current remaining quantity.

## Files Inspected
Inspected `app.js`, `style.css`, Step 48 and Step 49 code, relevant Pantry, quantity, FEFO, Shopping List, Cost Engine, reservation, Waste Diary, Freezer, Priority, notification, Food Event History, Impact, user-storage, guest-storage, migration, accessibility, responsive, print, and documentation files.

## Existing Source of Truth
- Pantry: `state.pantry`, registered user `Pantry` storage, guest `chefNovaGuestPantry`.
- Package source: Pantry item/lot records.
- Original package quantity: `purchase.packageQuantity` and `quantityDetails.originalQuantity`.
- Current quantity: `quantityDetails.currentQuantity` plus Step 48 `quantityInformation`.
- Quantity confidence: `quantityDetails.confidence`, `quantityInformation.confidence`, and Step 48 representations.
- Unit Registry: `normalizePantryUnit()`, `resolveQuantityDimension()`, and `state.ingredientCatalogue.units`.
- Opening state: `storage.packageState`, `opened`, and opened date records.
- Date Intelligence: `dateRecords`, `deriveFoodDateIntelligence()`, and Food-Safety Guardrails.
- FEFO: Step 49 package evaluation and allocation helpers.
- Pantry allocation: `deriveAvailableQuantity()`, reservations, and package FEFO allocation.
- Shopping List: existing Step 38 purchase groups and edge-case controls.
- Cost Engine: Budget Rescue price and cost helpers.
- Budget Rescue and Emergency Plan: existing planning mode/cost systems.
- Reservation and Meal Calendar: Pantry reservation records and saved meal plan metadata.
- Start Cooking and meal completion: existing preview/outcome flows and Food Event History writes.
- Waste Diary: linked discard workflow and discard cost/weight helpers.
- Freezer lineage: freezer split/recording workflows.
- Priority Engine: current Pantry item priority model.
- Notifications: existing notification levels and fatigue controls.
- Food Event History: `FoodEvents` / `chefNovaFoodEvents` and guest `chefNovaGuestFoodEvents`.
- Impact Ledger boundary: derived from confirmed events, not previews.

## Existing Defects Found
- Package-size-as-current defects found: 0 new confirmed Step 50 defects.
- Quantity-reset defects found: 0 new confirmed Step 50 defects.
- Full-package-coverage defects found: 0 new confirmed Step 50 defects.
- Cost-overstatement defects found: 0 new confirmed Step 50 defects.
- Duplicate-allocation defects found: 0 new confirmed Step 50 defects.
- Estimate-label defects found: Step 49 recipe allocation cards needed stronger approximate/current-versus-original language; fixed in Step 50.

## Files Changed
- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-handle-partial-packages.md`
- `docs/cook-before-it-spoils-step-50-report.md`
- `tests/cook-before-it-spoils-step-50-partial-packages-static.test.js`

## Versions Added
- Partial-package model version: `PARTIAL_PACKAGE_QUANTITY_VERSION = 1`
- Original-package-quantity version: `ORIGINAL_PACKAGE_QUANTITY_VERSION = 1`
- Remaining-quantity model version: `REMAINING_QUANTITY_MODEL_VERSION = 1`
- Package-fill-state version: `PACKAGE_FILL_STATE_VERSION = 1`
- Remaining-quantity-confidence version: `REMAINING_QUANTITY_CONFIDENCE_VERSION = 1`
- Effective-quantity-resolver version: `EFFECTIVE_PACKAGE_QUANTITY_RESOLVER_VERSION = 1`
- Partial-package policy version: `PARTIAL_PACKAGE_POLICY_VERSION = 1`

## Implementation Summary
Step 50 adds one derived partial-package resolver over existing Pantry records. It separates original package quantity from current remaining quantity, preserves confidence, supports exact, estimated, range, qualitative, and unknown quantities, derives package fill state, subtracts active reservations, integrates with Step 49 FEFO, updates Pantry package cards, updates recipe allocation cards, adds correction/review/outcome draft helpers, preserves package-specific price behavior, and avoids preview deductions.

## Required Pasta Scenario
For original package size `900 g` and estimated remaining quantity `350 g`, Chef Nova now uses approximately `350 g` as current Pantry availability. A `300 g` recipe previews approximately `300 g` planned use, approximately `50 g` expected remainder, and no new purchase. A `500 g` recipe previews approximately `350 g` Pantry allocation, approximately `150 g` missing, and a compatible full-package purchase suggestion.

## Scenario Coverage
Covered exact remaining, estimated point, estimated range, unknown remaining, fraction estimate, package-size correction, remaining correction, over-capacity review, no inferred use, FEFO, safety exclusion, package reservations, shared demand, serving changes, recipe replacement, Shopping List full and partial coverage, full-package checkout, purchase confirmation boundary, current value, ingredient-use value, missing price, package-size missing, same-meal recalculation, reservation conflict, Start Cooking check, actual use, direct remaining entry, estimate subtraction, range subtraction, depletion, Budget Rescue, Emergency Plan, multiple packages, package combination boundary, freezer split boundary, storage movement, discard, priority, notification, preview, save plan, meal completion, legacy valid and ambiguous data, migration rerun, stale quantity, duplicate save, multi-tab use, use-versus-discard conflict, account switch, user isolation, guest behavior, screen-reader package cards, screen-reader allocation cards, keyboard access, mobile, high contrast, reduced motion, print, export, AI-guessing boundary, and no duplicate systems.

## Required Zero Results
- Second partial-package inventories created: 0
- Second quantity systems created: 0
- Original package quantity used as current remaining quantity: 0
- Partial packages reset to full during application load: 0
- Partial packages reset to full after plan cancellation: 0
- Partial packages reset to full after migration: 0
- Opened partial packages treated as unopened full packages: 0
- Recipe coverage calculated from original package size: 0
- Shopping List purchases removed using original package size: 0
- Reservations created from original package size: 0
- Current Pantry value calculated from full package when only part remains: 0
- Food-rescue weight calculated from original package size rather than actual use: 0
- Estimated remaining quantities displayed as exact: 0
- Estimated reservations displayed as exact: 0
- Range maximum treated as guaranteed availability: 0
- Unknown remaining quantities treated as full packages: 0
- Unknown remaining quantities converted to zero: 0
- One partial package allocated fully to multiple meals: 0
- Active reservations exceeding current remaining quantity without review: 0
- Planned recipe use deducting physical Pantry quantity: 0
- Recipe replacement leaving stale package allocations: 0
- Full purchase cost calculated only from missing proportional quantity: 0
- New purchases merged into old partial packages automatically: 0
- Original package dates reset after quantity edits: 0
- Original opening dates reset after quantity edits: 0
- Package size minus remainder described as confirmed food used without events: 0
- Missing package prices represented as $0: 0
- Actual use deducted from the wrong package: 0
- Partial use removing the full package: 0
- Freezer splits duplicating quantity: 0
- Discard calculations using full package instead of current remainder: 0
- Notifications using original package size as the current amount: 0
- Priority quantity-at-risk using original package size: 0
- Planned remainders written as physical Pantry facts: 0
- Legacy ambiguous quantities interpreted silently: 0
- AI-generated package remainder guesses: 0
- Cross-user partial-package quantities or reservations exposed: 0
- Guest partial-package records persisted into registered-user storage automatically: 0

## Confirmations
Original package quantity and current remaining quantity remain separate fields with separate meanings. Recipe planning, Shopping Lists, reservations, costs, priorities, notifications, Waste Diary calculations, and impact boundaries use current remaining quantity rather than original package size. Original package size is not reduced when food is used, and remaining quantity is not reset during load, cancellation, recipe changes, or migration. Exact, estimated, ranged, fractional, and unknown quantities preserve confidence. Unknown is never zero, full, unlimited, or automatic Pantry coverage. Corrections preserve the other quantity field unless the user edits both. Over-capacity records require review. Original package quantity minus current remainder is not described as food used without events. Dates, opening state, storage, price, and lineage are preserved. FEFO uses current eligible partial remainders. Shopping List purchases use genuine missing quantity and full package prices. New purchases become distinct package records. Missing prices stay unavailable. Reservations reference exact packages and preserve estimate confidence. Planned remainders remain forecasts. Legacy ambiguous quantities require review. Registered-user data remains isolated and guest data remains temporary.

## Commands Run
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8')); console.log('recipes.json parses')"`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-50-partial-packages-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-49-multiple-package-fefo-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-48-unknown-quantity-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-47-user-information-protection-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-46-legacy-pantry-migration-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-4-pantry-schema-static.test.js`
- `ls package.json`

## Validation Result
Passed: JavaScript syntax checks for `app.js`, `rules.js`, and `data/recipes.js`; `data/recipes.json` parsing; Step 50 static checks; Step 49 FEFO checks; Step 48 unknown-quantity checks; Step 47 user-information protection checks; Step 46 legacy Pantry migration checks.

No repository build, lint, type-check, integration-test, browser-test, accessibility-test, responsive-test, localization-test, print-test, or export-test scripts were found because `package.json` is not present.

## Pre-existing Failures
The known Step 4 pantry schema static failure about legacy `dateInformation` existed before Step 50 and remains separate from this work.

## Deferred Work
Automatic visual quantity measurement, AI remainder guessing, automatic package combination, automatic Pantry deduction, automatic purchase confirmation, automatic impact recognition, and environmental calculations remain deferred. Recommended Step 51 starting point: connect the partial-package resolver to richer interactive quantity correction modals and saved reservation review screens.
