# Cook Before It Spoils Step 12 Report

## Goal

Add a complete Cook This Tonight workflow that converts an eligible Food-Rescue recipe card into a confirmed tonight plan while preserving Pantry accuracy.

## Existing Systems Inspected

- Meal Planner save path and calendar entries
- Weekly and monthly Meal Planner sync
- Food-Rescue recipe-card actions
- Recipe ranking and hard-filter revalidation
- Pantry lot schema and active reservations
- Food Event History command pipeline
- Existing Shopping List derivation
- Meal completion Pantry deduction guard
- Leftover and batch metadata
- Registered-user and guest storage
- Modal, live-region, accessibility, and responsive patterns

## Workflow State Version

- `COOK_TONIGHT_WORKFLOW_VERSION = 1`
- `COOK_TONIGHT_PLAN_METADATA_VERSION = 1`
- `COOK_TONIGHT_COMPLETION_VERSION = 1`

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-cook-this-tonight.md`
- `docs/cook-before-it-spoils-step-12-report.md`
- `tests/cook-before-it-spoils-step-11-food-rescue-card-static.test.js`
- `tests/cook-before-it-spoils-step-12-cook-this-tonight-static.test.js`

## Scenarios Covered

- Tonight-plan draft creation
- Pantry quantity confirmation
- People eating and serving validation
- Planned leftover selection
- Recipe re-scaling through current ranking logic
- Reservation preview
- Missing grocery preview
- Calendar conflict warning
- Confirmed plan commit
- Active Pantry reservation creation
- Existing calendar save and weekly sync
- Existing Shopping List refresh
- Start Cooking without Pantry deduction
- Finish Cooking outcome question
- Yes, as planned completion
- Changed-quantity completion
- Not Yet behavior
- Chose Something Else cancellation path
- Reservation release
- Planned versus actual metadata preservation
- Guest/user scope protection
- Accessibility and mobile static selectors

## Required Results

- Second Meal Planner workflows created: 0
- Second meal calendars created: 0
- Second Shopping Lists created: 0
- Second Pantry reservation systems created: 0
- Second meal-completion systems created: 0
- Pantry quantities deducted when opening the workflow: 0
- Pantry quantities deducted when confirming the plan: 0
- Pantry quantities deducted by Start Cooking: 0
- Pantry quantities deducted because the meal time passed: 0
- Prepared leftovers created before cooking confirmation: 0
- Quantity Used events created before completion confirmation: 0
- Selected rescue-food shortages added to the Shopping List: 0
- Duplicate meal-completion deductions: 0
- Duplicate leftover batches: 0
- Orphaned active reservations: 0 in implemented confirmation and cancellation paths
- Calendar meals committed without matching reservation updates: 0 in implemented confirmation path
- Reservation updates committed without matching calendar changes: guarded with reservation release fallback
- Cross-user plans or reservations exposed: 0
- Guest plans persisted into registered-user storage automatically: 0

## Commands Run

Validation completed after implementation:

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- `node --check scripts/recipe-eligibility-ranking.js`
- parsed `data/recipes.json`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- all tests in `tests/*.js`

## Validation Result

All available static checks, data validation, and plain Node tests passed.

## Notes

No backend, database, external API, dependency, or Git commit was added. This folder is not a Git repository.
