# Cook Before It Spoils Step 37 Report

## Goal

Integrate Cook Before It Spoils rescue information with the existing Budget Rescue Meal Planner without creating duplicate systems.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-budget-rescue-integration.md`
- `docs/cook-before-it-spoils-step-37-report.md`
- `tests/cook-before-it-spoils-step-37-budget-rescue-integration-static.test.js`

## Implementation Summary

Step 37 adds a shared integration read-model for Budget Rescue, Cook Before It Spoils, and Emergency planning.

The integration:

- reuses the existing Meal Planner modes
- reuses the central recipe eligibility engine
- reuses pantry-first allocation
- reuses recipe-card cost information
- reuses Cook Before It Spoils priority data
- stores only integrated metadata beside existing meal-plan metadata
- keeps pre-cooking rescue language planned-only

## Shared Functions Added

- `createIntegratedPlanningContext()`
- `buildTemporaryPlanningInventory()`
- `evaluateIntegratedHardEligibility()`
- `evaluateIntegratedPantryAllocation()`
- `evaluateIntegratedRescueBenefit()`
- `evaluateIntegratedBudgetBenefit()`
- `evaluateIntegratedPracticality()`
- `evaluateIntegratedRecipeCandidate()`
- `buildRecipeBenefitSummary()`
- `renderIntegratedRecipeBenefitSummary()`
- `buildIntegratedPlanSummaries()`
- `renderIntegratedPlanningSummary()`
- `createIntegratedPlanMetadataSnapshot()`

## Hard Filter Integration

The integration calls `evaluateRecipeForCurrentRequirements()` before pantry, rescue, budget, practicality, or final scoring.

Hard-excluded recipe candidates return:

- `finalScore: null`
- `selectable: false`
- controlled exclusion codes

Budget value and rescue priority cannot override safety, allergy, dietary, inventory, form, appliance, time, serving, substitution, or leftover eligibility checks.

## Budget Rescue Reads Rescue Context

Budget Rescue can read planned rescue context from:

- priority Pantry items
- rescue-window information
- priority dates
- date and storage context
- opened-package indicators
- quantity and reservation context
- recipe rescue coverage

The wording remains planned-only until a cooking outcome is confirmed.

## Cook Before It Spoils Reads Budget Context

Cook Before It Spoils can read:

- estimated Pantry value used
- known Pantry value when price data is partial
- estimated new grocery allocation
- known purchase subtotal when price data is incomplete
- price confidence
- weekly package-counting rules
- budget fit status when a budget mode is active

## UI Changes

The weekly Meal Planner now shows an integrated summary when Budget Rescue, Cook Before It Spoils, or Emergency mode is active.

Existing recipe cards are extended with:

- Planned food-rescue benefit
- Budget benefit
- Practical benefit
- Why chosen

No separate planner card or duplicate planner page was added.

## Saved Metadata

Integrated metadata is saved as `integratedPlanningMetadata` on the existing meal-plan object.

It is not a new storage key and not a separate calendar.

Saved-plan metadata does not create impact credits, deduct Pantry quantities, or create Food Events.

## Validation Performed

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- `node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8')); console.log('recipes.json valid')"`
- `node tests/cook-before-it-spoils-step-37-budget-rescue-integration-static.test.js`
- `node tests/cook-before-it-spoils-step-10-hard-filters-static.test.js`
- `node tests/pantry-first-planning.test.js`
- `node tests/cost-calculation-engine.test.js`
- `node scripts/validate-price-data.js`
- `node scripts/validate-ingredient-data.js`

## Required Zero Confirmations

- Separate hybrid planners created: 0
- Second Pantry created: 0
- Second Recipe Database created: 0
- Second Shopping List created: 0
- Second Price Catalogue created: 0
- Second Cost Engine created: 0
- Second rescue-priority engine created: 0
- Second hard-filter pipeline created: 0
- Second leftover system created: 0
- Second Impact Ledger created: 0
- Second user-storage model created: 0
- Budget before safety: 0
- Rescue before safety: 0
- Hard-excluded restored by low cost/rescue priority: 0
- Allergy/diet relaxed: 0
- Food scheduled after eligible date: 0
- Best-before as expiration: 0
- Lots merged incorrectly: 0
- Reserved allocated silently: 0
- Physical qty allocated twice: 0
- Pantry ingredient-use value as checkout cost: 0
- Full package as partial pantry value: 0
- Unpriced pantry as $0: 0
- Unpriced purchase as free: 0
- Shared packages charged more than once: 0
- Card allocated costs > weekly total: 0
- Planned leftovers charged as full recipes twice: 0
- Planned priority use represented as confirmed rescue: 0
- Saved plans create impact credits: 0
- Saved plans deduct pantry automatically: 0
- Saved plans auto freeze: 0
- Cross-user data exposed: 0
- Guest data persisted automatically: 0

## Risks And Notes

The integration is a derived preview model. Confirmed food-rescue impact still depends on existing outcome-confirmation workflows.

Meal-card cost notes remain context-sensitive. The weekly summary remains the source for plan-level grocery totals.
