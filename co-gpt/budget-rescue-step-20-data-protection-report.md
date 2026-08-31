# Budget Rescue Step 20 — Data Protection Report

## Goal

Add Budget Rescue data protection with schema versioning, safe migrations, account isolation, and recovery for older saved plans.

## Files Changed

- `app.js`
- `style.css`
- `docs/budget-data-protection.md`
- `docs/budget-data-protection-report.md`
- `tests/budget-data-protection-static.test.js`
- `co-gpt/budget-rescue-step-20-data-protection-report.md`

## Changes Made

Added Budget Profile schema versioning:

- `BUDGET_PROFILE_SCHEMA_VERSION`
- `BUDGET_PLAN_SNAPSHOT_SCHEMA_VERSION`

Added migration statuses:

- `current`
- `migrated`
- `not-needed`
- `invalid`
- `future-version`
- `failed`

Added user-specific Budget Profile storage:

- Registered accounts use `chefNovaBudgetProfile_<userId>`.
- Guests use `chefNovaGuestBudgetProfile` in `sessionStorage`.

Added Budget Profile helpers:

- `migrateBudgetProfileDocument()`
- `validateBudgetProfileDocument()`
- `loadBudgetProfileForCurrentUser()`
- `saveBudgetProfileFromCurrentInputs()`

Added safe money migration:

- Legacy `weeklyBudget: 100` becomes `weeklyBudgetCents: 10000`.
- Legacy `estimatedGroceryCost: 92.75` becomes `estimatedGroceryCostCents: 9275`.
- Missing money becomes `null`.
- Existing cent values are not multiplied again.

Added versioned saved-plan snapshots inside Step 19 metadata:

- `budgetSnapshot`
- `costSnapshot`
- `pricingSnapshot`
- `pantrySnapshot`

Added older saved-plan recovery:

- Shows `Cost estimate unavailable for this older saved plan.`
- Provides `Calculate Current Estimate`.
- Displays current estimates separately from historical saved data.
- Provides `Save Current Estimate` only as an explicit user action.
- Shows incomplete estimate details with `Add Missing Prices`.
- Shows `Set a Budget` when no weekly budget exists.
- Warns on current allergy or preference conflicts.

## Data Protection Rules Preserved

The update does not overwrite protected user data:

- Pantry
- Shopping List
- Favorites
- meal calendar
- old plans
- price profiles
- allergies
- dietary preferences
- preferred and disliked foods
- authentication metadata

Malformed Budget data is isolated and not automatically overwritten.

Future schema versions are not downgraded.

Unknown Budget fields are preserved during migration.

## Validation

Validation performed:

- `node --check app.js`
- `node --check rules.js`
- `data/recipes.json` parse check
- all available tests in `tests/`

## Result

Budget Rescue data now has versioned storage, safer migration behavior, account-specific isolation, guest-session separation, and recovery tools for older saved plans without breaking existing Chef Nova features.
