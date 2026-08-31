# Cook Before It Spoils Step 20 Report

## Goal

Add quantity-aware Leftover Outcome Confirmation so scheduled leftover meals never change Pantry until the user confirms what actually happened.

## Existing Behavior Inspected

Inspected `app.js`, `style.css`, Step 16 leftover inventory, Step 17 transformation paths, Step 18 original timeline, Step 19 transformation cards, Food Event History, Pantry reservations, Nutrition Tracker meal completion, calendar updates, Shopping List refresh, guest storage, and the existing validation tests.

## Findings

- Existing outcome systems inspected: Pantry quantity actions, Cook This Tonight outcomes, transformation completion, reservation release/consume events, and Food Event History.
- Existing automatic-consumption behavior found: checking a transformation meal completed called `applyTransformationSourceForCompletedMeal()` immediately.
- Duplicate quantity-update logic found: manual leftover quantity actions and transformation completion both changed leftover quantity. Step 20 reuses them but routes meal-scoped transformations through one outcome review before deduction.
- Second leftover quantity systems created: 0.
- Scheduled meals automatically consuming leftovers: 0 after this update.
- Calendar time automatically consuming leftovers: 0.
- Start Cooking automatically consuming leftovers: 0.

## Implementation

- Outcome-review schema version: `LEFTOVER_OUTCOME_REVIEW_VERSION = 1`.
- Outcome-state-machine version: `LEFTOVER_OUTCOME_STATE_MACHINE_VERSION = 1`.
- Outcome-context version: `LEFTOVER_OUTCOME_CONTEXT_VERSION = 1`.
- Outcome use types: direct consumption, transformation input, planned leftover meal, direct Pantry action.
- Outcome scopes: planned allocation, entire batch, user-selected quantity.
- Outcome types: All Used, Some Used, Frozen, Still Refrigerated, Discarded, Mixed, Unknown.
- Quantity confidence: confirmed measured, user estimated, serving-count estimate, unknown.
- Planned and actual quantities are stored separately on the Pantry item metadata and calendar meal.
- Direct consumption uses `LEFTOVER_QUANTITY_CONSUMED`.
- Transformation input uses `LEFTOVER_QUANTITY_TRANSFORMED`.
- Discard uses `DISCARDED`.
- Sharing uses `DONATED_SHARED`.
- Freezing uses `MARKED_FROZEN`.
- Still refrigerated and unknown use factual storage confirmation without quantity decrease.

## Behavior Covered

- All Used deducts only the visible planned amount.
- Some Used derives actual use from before quantity minus remaining quantity.
- Lower actual use releases unused reservation quantity.
- Higher actual use marks meal/path review when later reservations may be affected.
- Mixed outcomes require conservation across used, refrigerated, frozen, discarded, and shared amounts.
- Frozen outcomes do not count as consumption or transformation.
- Still refrigerated outcomes do not reduce quantity or complete the meal.
- Unknown quantity remains review-required and is never stored as zero.
- Original cooked time and storage timeline are not reset.
- Factual storage and freezing are not represented as food-safety approval.
- Outcome commits are idempotent using stable outcome keys.
- Stale source-batch revisions block commit.
- Registered user scope and guest scope are checked before commit.

## Files Changed

- `app.js`
- `style.css`

## Files Created

- `docs/cook-before-it-spoils-leftover-outcomes.md`
- `docs/cook-before-it-spoils-step-20-report.md`
- `tests/cook-before-it-spoils-step-20-leftover-outcomes-static.test.js`

## Validation Targets

Required results:

- All Used deducting the entire batch instead of the planned amount: 0.
- Partial use deducting the full planned quantity: 0.
- Mass and servings independently decremented: 0.
- Unknown remaining quantities converted to zero: 0.
- Mixed outcome quantities failing conservation: 0.
- Frozen quantities recorded as consumed: 0.
- Discarded quantities recorded as consumed: 0.
- Still-refrigerated outcomes reducing quantity: 0.
- Original cooked times reset by outcome confirmation: 0.
- Reservations consumed beyond actual quantity used: 0.
- Downstream path quantities becoming negative: 0.
- Duplicate outcome confirmations deducting twice: 0.
- Partial atomic commits: 0.
- Cross-user leftover outcomes exposed: 0.
- Guest outcomes persisted into registered-user storage automatically: 0.

## Commands Run

- `node --check app.js`: passed.
- `node --check rules.js`: passed.
- `node --check data/recipes.js`: passed.
- `node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8'))"`: passed.
- `node scripts/validate-ingredient-data.js`: passed.
- `node scripts/validate-price-data.js`: passed.
- `node tests/cook-before-it-spoils-step-20-leftover-outcomes-static.test.js`: passed.
- Full `tests/*.js` suite: passed.

## Validation Result

Build scripts, lint scripts, type-check scripts, browser automation, and automated accessibility tooling are not present in this static HTML project. Available syntax, data, static, and integration-style Node tests passed.

## Deferred

Advanced rescheduling, richer split child-batch editing for every mixed storage branch, browser accessibility audits, waste analytics, household-pattern learning, and environmental-impact claims remain deferred.
