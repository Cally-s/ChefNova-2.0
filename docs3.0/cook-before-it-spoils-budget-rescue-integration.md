# Cook Before It Spoils + Budget Rescue Integration

## Goal

Step 37 connects Cook Before It Spoils rescue information with the existing Budget Rescue Meal Planner.

The integration reuses Chef Nova's existing planner, pantry, recipe, shopping, price, cost, eligibility, leftover, impact, and user-storage systems.

## No Duplicate Systems

This work does not create a second planner, Pantry, Recipe Database, Shopping List, Price Catalogue, Cost Engine, rescue-priority engine, hard-filter pipeline, leftover system, Impact Ledger, or user-storage model.

The existing Meal Planner modes remain the source of truth:

- `standard`
- `budget-rescue`
- `cook-before-it-spoils`
- `emergency`

## Hard Filter Precedence

Budget and rescue value never run before safety and eligibility.

The shared candidate model uses this order:

1. User and inventory ownership
2. Physical inventory
3. Food safety
4. True expiration or storage timeline
5. Allergies
6. Dietary needs
7. Ingredient form
8. Appliances
9. Time
10. Servings
11. Mandatory ingredients or substitutions
12. Leftover eligibility
13. Budget and rescue scoring

If a recipe fails a hard filter, it receives:

- `finalScore: null`
- `selectable: false`
- controlled hard-exclusion codes

Low cost, pantry value, or rescue priority cannot restore a hard-excluded recipe.

## Shared Candidate Evaluation

Chef Nova adds one derived evaluation layer:

- `createIntegratedPlanningContext()`
- `buildTemporaryPlanningInventory()`
- `evaluateIntegratedHardEligibility()`
- `evaluateIntegratedPantryAllocation()`
- `evaluateIntegratedRescueBenefit()`
- `evaluateIntegratedBudgetBenefit()`
- `evaluateIntegratedPracticality()`
- `evaluateIntegratedRecipeCandidate()`

This layer reads from existing data and returns a planner preview model. It does not own data.

## Temporary Pantry Allocation

Plan previews use temporary pantry allocation.

Previewing a plan does not:

- deduct Pantry quantities
- create Food Events
- create Impact Ledger credits
- auto-freeze food
- silently reserve unavailable food

Saving a plan uses the existing meal-plan save path and reservation workflow only.

## Rescue Information Used by Budget Rescue

Budget Rescue can read current Cook Before It Spoils priority data, including:

- priority items
- date type
- rescue-window status
- priority date
- opened-package status
- storage information
- quantity and reservation context
- meal-date eligibility
- safe form information
- recipe rescue coverage

This information is used as planned benefit context, not confirmed impact.

## Budget Information Used by Cook Before It Spoils

Cook Before It Spoils can read Budget Rescue information, including:

- estimated Pantry value used
- estimated new grocery allocation
- package effects
- newly needed grocery groups
- shared package handling
- price confidence
- budget fit when a budget mode is active

## Cost Semantics

Pantry value is not checkout cost.

Chef Nova keeps these meanings separate:

- Pantry ingredient-use value estimates the value of food already owned.
- New grocery cost estimates the package-level purchase amount needed for the plan.
- Missing pantry prices are unavailable, not `$0`.
- Missing purchase prices are incomplete, not free.
- Shared packages are counted once in weekly totals.
- Meal-card cost allocations are context notes, not values to add together.

## Recipe Card Display

Existing recipe cards are extended with a compact benefit block.

Each integrated card can show:

- Planned food-rescue benefit
- Budget benefit
- Practical benefit
- Why the recipe was chosen

Pre-cooking wording uses:

- "Planned food-rescue benefit"
- "planned to use"

It does not say "food rescued" before the user confirms what happened.

## Plan-Level Summary

The weekly planner shows one shared summary above the plan when an integrated mode is active.

The summary includes:

- planned priority Pantry use
- known Pantry value used
- estimated new grocery total or known priced subtotal
- price confidence
- preview-only and impact-credit notices

## Saved Metadata

Integrated metadata is stored beside existing meal-plan metadata as `integratedPlanningMetadata`.

It is a snapshot of the plan context, not a separate calendar or separate storage key.

The snapshot includes:

- integration version
- planning mode
- source revisions
- planned food-rescue summary
- budget summary
- planned-only credit policy

## Impact Credit Boundary

Saved plans do not create impact credits.

Impact claims require confirmed cooking, freezing, discard, or leftover outcomes through the existing Food Events and Impact Ledger workflow.

## User And Guest Isolation

The integration reads through existing user-scoped storage helpers.

Guest previews remain guest previews. Guest data is not copied into registered-user storage unless the existing account-upgrade flow explicitly does so.

## Validation

Step 37 includes a focused static test:

`tests/cook-before-it-spoils-step-37-budget-rescue-integration-static.test.js`

The test verifies:

- integration constants
- shared candidate functions
- hard filter precedence
- planned-only rescue wording
- cost semantics
- metadata preservation
- no duplicate systems
- CSS coverage
- documentation/report confirmations
