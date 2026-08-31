# Cook Before It Spoils Step 21 Report

## Goal

Create a versioned Freezing Suitability Catalogue for Chef Nova's Freezer Assistant without duplicating the existing ingredient catalogue, food-safety catalogue, pantry inventory, freezer inventory, Freeze Options workflow, Food Event History, or user storage systems.

## Files Changed

- `data/freezer-guidance.json`
- `data/freezer-guidance.js`
- `data/ingredients.json`
- `data/ingredients.js`
- `index.html`
- `app.js`
- `docs/cook-before-it-spoils-freezing-suitability-catalogue.md`
- `docs/cook-before-it-spoils-step-21-report.md`
- `tests/cook-before-it-spoils-step-21-freezing-suitability-static.test.js`

## Catalogue Added

Created `data/freezer-guidance.json` as the source-controlled catalogue and `data/freezer-guidance.js` as the direct-file-opening fallback.

Catalogue version fields:

- `freezerGuidanceCatalogueVersion: 1`
- `policyResolutionVersion: 1`
- `reviewWorkflowVersion: 1`
- `reviewedAt: 2026-08-12`

Current policies:

- Approved-with-limitations prepared-leftover cooked-dish policy.
- Quarantined `draft-ai-generated` spinach policy that cannot produce consumer-facing guidance.

## Governance Added

Added controlled constants for:

- freezer catalogue schema versions
- subject types
- suitability statuses
- blanching requirements
- thawing methods
- cook-from-frozen statuses
- texture change levels
- quality-window statuses
- review statuses
- preparation action types
- lifecycle states
- source priority

Added validation for:

- duplicate policy IDs
- invalid schema versions
- uncontrolled subject, suitability, and review statuses
- AI-generated records escaping draft status
- AI drafts setting `canFreeze: true`
- approved policies missing evidence
- approval hash mismatch

## Resolution Logic

Added `resolveFreezerGuidance()` and related helpers.

Resolution order:

1. Existing Food-Safety Guardrail
2. Product-label override
3. Prepared-leftover category or form
4. Prepared food
5. Ingredient and form
6. Ingredient category
7. General fallback
8. Policy unavailable

Food that fails safety review, has unknown quantity, is already frozen, or lacks a confirmed freezer profile cannot receive an automatic freezing recommendation.

## Consumer UI Integration

Updated Use These First and Freeze Options so freezer actions use the new suitability result instead of relying only on the Food-Safety Guardrail's freezer metadata.

The Freeze Options modal now shows:

- preparation steps
- blanching status
- packaging guidance
- texture note
- best uses after freezing
- quality window
- thawing guidance
- cook-from-frozen status
- policy ID and review status
- source count
- View Sources button
- Report Concern button

The modal remains informational only. It does not update storage, dates, events, quantities, or Pantry records.

## Ingredient Catalogue Link

Added freezer-guidance references to the existing spinach ingredient record:

- `freezerGuidancePolicyIds`
- `freezerGuidanceSummary`

This is a reference only. The Ingredient Catalogue remains the source of truth for ingredient identity, and the Freezing Suitability Catalogue remains the source of truth for freezer guidance.

## Documentation

Created `docs/cook-before-it-spoils-freezing-suitability-catalogue.md` covering:

- catalogue purpose
- file ownership
- AI draft restrictions
- human review requirements
- subject types
- suitability statuses
- schema areas
- reused Chef Nova systems
- current catalogue entries
- consumer behavior
- admin review model
- legacy migration rules

## Validation Performed

Commands run:

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- `node --check data/freezer-guidance.js`
- JSON parse checks for `data/freezer-guidance.json`, `data/ingredients.json`, and `data/recipes.json`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- `node tests/cook-before-it-spoils-step-21-freezing-suitability-static.test.js`
- all local tests in `tests/*.js`

Results:

- JavaScript syntax checks passed.
- JSON parse checks passed.
- Ingredient data validation passed.
- Price catalogue validation passed.
- Step 21 freezer suitability static checks passed.
- Full local test suite passed.

## Source Control Note

`git status --short` could not run because `/Users/callysu/Downloads/Chef-Nova` is not a Git repository. No Git commit was created.

## Risks and Notes

- Current freezer guidance is intentionally conservative.
- The spinach policy is a draft-only example and is not consumer-facing.
- Quality windows are displayed as best-quality guidance only, not expiration dates or safety deadlines.
- Automatic freezing recommendations require a recorded freezer profile within guidance.
