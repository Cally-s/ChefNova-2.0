# Cook Before It Spoils Step 13 Report

## Goal

Add household-based Smart Portion Suggestions to Food Rescue and Cook This Tonight without creating duplicate planning, Pantry, Shopping List, cost, calendar, leftover, or household systems.

## Files Inspected

Inspected `app.js`, `style.css`, `scripts/recipe-eligibility-ranking.js`, `scripts/pantry-first-planning.js`, `scripts/cost-calculation-engine.js`, recipe data, tests, and Cook Before It Spoils Step 1-12 docs.

## Existing Sources

Existing household-profile source of truth: Budget Rescue household fields in `state.planningModeInputs.budgetRescue.household`.

Existing serving-scaler source of truth: `evaluateServingFeasibility()` in the recipe eligibility engine, plus existing Pantry-first and Cost Engine serving-scale helpers.

Duplicate serving logic found: older Food Rescue card and Adjust Portions UI had a simpler single serving input. Step 13 now routes the visible workflow through Smart Portion Suggestions.

## Implementation

Files created:

- `docs/cook-before-it-spoils-smart-portion-suggestions.md`
- `docs/cook-before-it-spoils-step-13-report.md`
- `tests/cook-before-it-spoils-step-13-smart-portion-static.test.js`

Files changed:

- `app.js`
- `style.css`

Existing systems reused:

- existing household fields
- Food Rescue ranking
- Step 10 hard filters
- existing serving feasibility
- Pantry-first allocation
- Shopping List demand
- Cost Engine estimates
- Cook This Tonight state machine
- existing calendar and Meal Planner save path
- leftover metadata
- user and guest storage rules

Portion-suggestion version: `SMART_PORTION_SUGGESTION_VERSION = 1`.

Suggestion-configuration version: `SMART_PORTION_SUGGESTION_CONFIG.version = 1`.

Leftover-preference values: `none`, `one-additional-meal`, `two-additional-meals`, and `chef-nova-recommend`.

## Behavior

Household default behavior: adults plus children creates the starting People Eating value only. It does not create a calorie target or permanent profile update.

Adults-and-children behavior: adults and children are counted as people. Children are not treated as fractional servings.

Non-nutrition boundary: no calorie, BMI, age, sex, height, weight, or medical serving assumptions were added.

People-eating behavior: People Eating is a required positive whole number before a suggestion can be used.

People-versus-servings distinction: People Eating, servings for tonight, planned leftovers, desired yield, effective yield, and unallocated servings stay separate.

Starting-serving derivation: explicit override, then current workflow serving value, then household headcount.

Current-meal override behavior: user edits are preserved in the draft and recalculated.

No-leftovers behavior: no intentional planned leftovers are added.

One-additional-meal behavior: one future meal defaults to the current-meal serving count.

Two-additional-meal behavior: two future meals keep separate editable serving values.

Planned-versus-actual leftovers: planned leftovers do not create actual leftovers or Food Event History. Actual leftovers remain Step 12 completion behavior.

Chef Nova recommendation behavior: only no leftovers, one additional meal, and two additional meals are evaluated.

Continuous-scaling behavior: supported continuous yields are accepted only within recipe min/max/increment rules.

Fixed-yield behavior: fixed recipes keep the closest supported yield and show unallocated servings.

Batch behavior: batchable recipes use supported batch counts and do not assume simultaneous cooking.

Hard-filter behavior: every profile reruns current hard eligibility through Food Rescue ranking.

Selected-priority-food behavior: shortages reject the profile and are not added as groceries.

Leftover-safety behavior: planned leftovers require reviewed recipe guidance and valid future slots.

Future-meal-target behavior: optional future targets use open calendar slots inside the leftover window and do not overwrite meals.

Unallocated-serving formula: `effectiveRecipeYield - currentMealServings - plannedLeftoverServings`.

Determinism behavior: profiles are sorted by stable scoring and profile IDs, not randomness.

Use This Suggestion behavior: updates only the current draft/ranking preview. It creates no reservation, Pantry deduction, calendar entry, actual leftover, or food event.

Edit Servings behavior: exposes tonight, first future meal, and second future meal amounts.

Cook This Tonight integration: Step 12 consumes the Smart Portion result, then revalidates before confirmation.

## Required Results

- Second household profiles created: 0
- Second serving scalers created: 0
- Children automatically treated as fractional servings: 0
- Calorie assumptions introduced: 0
- People-eating changes automatically overwriting household profiles: 0
- Unsupported recipe yields presented as valid: 0
- Selected priority-food shortages filled through purchases: 0
- Unsafe leftover meals recommended: 0
- Unallocated servings hidden: 0
- Portion suggestions creating Pantry reservations: 0
- Portion suggestions deducting Pantry quantities: 0
- Portion suggestions creating actual leftovers: 0
- Portion suggestions creating Food Event History records: 0
- Cross-user household or serving values exposed: 0
- Guest serving suggestions persisted into registered-user storage: 0

## Validation

Commands run:

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- `node --check scripts/recipe-eligibility-ranking.js`
- parse `data/recipes.json`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- all JavaScript tests in `tests/*.js`

Build result: no package build command exists.

Lint result: no lint command exists.

Type-check result: no TypeScript command exists.

Browser, accessibility, and responsive results: static checks passed; manual browser, screen-reader, forced-colors, and physical viewport testing remain manual.

Pre-existing failures: none in available automated checks.

New defects found: one recursion risk was found during implementation and removed before validation.

Remaining issues: full manual accessibility and mobile certification remain outside the available automated test suite.

Step 13 completion status: complete for the available static app architecture and automated validation.
