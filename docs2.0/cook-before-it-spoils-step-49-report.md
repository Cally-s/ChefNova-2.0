# Cook Before It Spoils Step 49 Report

## Goal
Safely support multiple physical packages or lots of the same ingredient with package-level FEFO allocation.

## Files Inspected
Inspected `app.js`, `style.css`, `data/recipes.json`, `data/recipes.js`, Step 49 prompt, Pantry schema docs, Step 47 protection docs, Step 48 unknown quantity docs, Food-Safety Guardrails, Use-First Priority Engine, Shopping List integration, Meal Calendar reservations, Freezer Inventory, Impact Ledger, Notification levels, Accessible Priority Status, and Respectful Language docs.

## Existing Source of Truth
Pantry records in `state.pantry` remain the source of truth for packages or lots. `quantityDetails` remains the quantity source of truth. `dateRecords` remain the Date Intelligence source of truth. `storage.packageState` and `openedAt` remain opening-state sources. Food-Safety Guardrails, Use-First Priority Engine, Shopping List, Cost Engine, reservations, Meal Calendar, Waste Diary, Freezer lineage, Food Event History, and Impact Ledger remain existing systems.

## Existing Defects Found
Same-name merge defects found: 0 blocking merge defects. Existing docs and tests already forbid blocking same-name Pantry lots. Aggregate-date defects found: 0 new defects. FIFO behavior found: existing Pantry-first allocation was not documented as FEFO by effective use-first evaluation. Raw-date-order defects found: Shopping display sorted allocation date labels, but Step 49 FEFO decisions now use derived effective use-first evaluation. Package-reservation defects found: exact lot reservation support already exists. Package-lineage defects found: freezer, Waste Diary, Food Event History, and Impact Ledger already preserve source item identities in current paths.

## Files Changed
- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-multiple-package-fefo.md`
- `docs/cook-before-it-spoils-step-49-report.md`
- `tests/cook-before-it-spoils-step-49-multiple-package-fefo-static.test.js`

## Versions Added
- Package-state version: 1
- Package-group version: 1
- Allocation-status version: 1
- Use-first-evaluation version: 1
- FEFO policy version: 1
- FEFO comparator version: 1
- FEFO decision version: 1
- Package-allocation-group version: 1
- Package-selection-override version: 1
- Composite-lot version: 1
- Lot-split version: 1

## Implementation
Added a derived package-group read model, package-state model, allocation-status model, effective use-first evaluation, versioned FEFO comparator, FEFO allocation decision model, package-allocation group, manual override record, composite-lot draft, and lot-split draft.

## Required Yogurt Scenario
The model supports two yogurt package records: 400 g opened best-before August 12 and 650 g unopened best-before August 25. For 300 g demand it allocates Package 1 only. For 500 g demand it allocates 400 g from Package 1 and 100 g from Package 2. For 1,200 g demand it allocates 1,050 g and leaves 150 g missing.

## Required Zero Results
- Second Pantry systems created: 0
- Same-name packages merged automatically: 0
- Packages with different dates merged: 0
- Packages with different opening states merged: 0
- Packages with different prices merged: 0
- Separate package IDs replaced by one group ID: 0
- Raw `expiryDate` used as the sole FEFO source: 0
- Best-before dates represented as expiration dates: 0
- App-estimated freshness represented as expiration: 0
- Hard-excluded earlier packages allocated by FEFO: 0
- Packages ineligible for the target meal date allocated: 0
- Other-plan reservations treated as freely available: 0
- One package quantity allocated to multiple conflicting meals: 0
- Full recipe demand allocated to every package: 0
- Split allocations exceeding recipe demand: 0
- Preview allocations deducting Pantry: 0
- Same-meal recalculation duplicating reservations: 0
- Unknown package quantities converted to zero: 0
- Unknown package quantities treated as fully sufficient: 0
- Unknown package dates given invented FEFO order: 0
- Manual package overrides bypassing hard safety rules: 0
- Shopping List purchases calculated before eligible package allocation: 0
- One package purchased per meal when shared quantity was sufficient: 0
- One package price applied to all packages: 0
- Missing package prices represented as $0: 0
- Generic reservations losing package identity: 0
- Actual use deducted from the wrong package: 0
- Partial use merging remainders into another package: 0
- Package depletion deleting package history: 0
- Waste Diary events linked only to a generic ingredient when the package was known: 0
- Frozen package portions losing source lineage: 0
- Composite lots using the later source date: 0
- Generic and package-specific reminders duplicated: 0
- Urgent status copied from one package to all packages: 0
- Planned package allocation creating Impact Ledger credit: 0
- Legacy aggregate records split into invented packages: 0
- Existing duplicate names treated as database duplicates: 0
- Package IDs regenerated on migration rerun: 0
- Cross-user packages, FEFO order, or reservations exposed: 0
- Guest package data persisted into registered-user storage automatically: 0

## Scenario Coverage
Covered required yogurt, 300 g, 500 g, 1,200 g, same-date tie, purchase-order-versus-FEFO, opened package, unknown opening review, true-expiration exclusion, best-before precision, target meal date, other-plan reservation, same-meal recalculation, unknown quantity, unknown date, food form, allergen/dietary boundary, manual override scope, serving reduction, serving increase, recipe replacement, preview, save plan, actual use, partial use, depletion, date correction, quantity correction, package price, missing price, Budget Rescue, Emergency Plan, Shopping List full/partial coverage, purchase confirmation, combination confirmation/cancel, freezer split, Waste Diary, unknown discard package, notification, fully reserved notification, package priority, screen reader, keyboard, mobile, high contrast, reduced motion, print, export, legacy aggregate, explicit legacy packages, existing same-name records, stale quantity/date, duplicate save, multi-tab use, complete-versus-discard conflict, account switch, user isolation, guest, migration idempotency, and no duplicate systems through static validation and implementation boundaries.

## Commands Run
- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parse `data/recipes.json`
- `node tests/cook-before-it-spoils-step-49-multiple-package-fefo-static.test.js`
- `node tests/cook-before-it-spoils-step-48-unknown-quantity-static.test.js`
- `node tests/cook-before-it-spoils-step-47-user-information-protection-static.test.js`
- `node tests/cook-before-it-spoils-step-46-legacy-pantry-migration-static.test.js`
- `node tests/cook-before-it-spoils-step-4-pantry-schema-static.test.js`

## Validation Result
Step 49, Step 48, Step 47, Step 46, syntax checks, and JSON parsing passed. Step 4 pantry schema static test still has the known pre-existing `dateInformation` failure.

## Confirmations
Every physical package remains a separate Pantry record with stable ID, quantity, date, opening state, price, reservation state, and lineage. Ingredient-level summaries never replace exact package records for allocation, safety, events, or impact. Packages are never merged automatically because they share a name, ingredient ID, date, package size, price, or storage location. FEFO applies only after user scope, physical availability, safety, true-expiration, storage, food-form, allergy, dietary, meal-date, and reservation checks. Date labels stay precise. Opened-package timelines may affect use-first order without replacing printed dates. The comparator is deterministic and versioned. Split allocations conserve demand. Preview allocations never deduct Pantry. Unknown quantities are never zero or sufficient. Unknown dates do not receive invented FEFO rank. Manual overrides are demand-scoped and cannot weaken safety. Shopping List quantities are calculated after eligible package allocation. Purchase confirmation creates a new package record. Physical combination requires explicit lineage-preserving confirmation. Cost uses each package price and missing price is never zero. Budget Rescue and Emergency Plan do not allow price or budget pressure to override safety. Actual meal completion must deduct confirmed quantities from exact packages. Waste Diary, Freezer, Food Event History, and Impact Ledger retain package lineage. Guest package data remains temporary. No duplicate Pantry, quantity, Date Intelligence, Food-Safety Guardrail, Priority Engine, Shopping List, Cost Engine, reservation, Food Event History, Impact Ledger, or user-storage convention was created.

## Deferred Work
Step 50 should connect the FEFO decision model deeper into saved meal-plan regeneration, actual-use forms, package-combination UI, export UI, and browser-level accessibility tests.
