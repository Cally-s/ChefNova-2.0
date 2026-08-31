# Step 31 Implementation Report: Actionable Pattern Insights

## Goal

Turn qualified Step 30 pattern results into specific, relevant, reversible, user-controlled actions.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-actionable-pattern-insights.md`
- `docs/cook-before-it-spoils-step-31-report.md`
- `tests/cook-before-it-spoils-step-31-actionable-pattern-insights-static.test.js`

## Implementation

- Added controlled Step 31 constants for insight statuses, action eligibility, action types, action states, metric coverage, and rule configuration.
- Added action-state, settings, and audit storage for registered users and guests.
- Added `buildActionableInsight()` and related helpers that derive insights from current Step 30 patterns.
- Added weight coverage from stored Step 29 snapshots.
- Added value coverage from stored Step 28 snapshots with currency grouping.
- Added action cards under possible pattern cards.
- Added insight details to the existing pattern-details modal.
- Added preview, confirm, keep-current, dismiss, undo, and recipe-view actions.

## Safeguards

- No automatic changes occur when insights are generated or viewed.
- Persistent changes require preview and confirmation.
- `applyInsightAction()` revalidates the current Food Event History revision before saving.
- Insight actions save only preference-style settings and audit entries.
- Food Event History is not appended by insight viewing, previewing, dismissing, keeping, or applying settings.
- Guest data uses sessionStorage.
- Registered data uses account-scoped localStorage.
- Allergy checks are reused for recipe suggestions.
- Freezer actions create prompts only.
- Reminder actions change timing preferences only, not food-safety dates.

## Validation Performed

- JavaScript syntax check for `app.js`.
- JavaScript syntax checks for `rules.js` and `data/recipes.js`.
- Parsed every JSON file in `data/`.
- Static tests for Step 31 constants, functions, safeguards, storage boundaries, UI hooks, documentation, and action wording.
- Existing Step 30 static validation remained compatible.
- Full `tests/*.js` static test sweep passed.

## Notes

Action settings are intentionally soft preferences. Existing Pantry quantities, saved meal plans, allergies, dietary preferences, shopping lists, and Food Event History remain unchanged unless a user separately uses those existing workflows.
