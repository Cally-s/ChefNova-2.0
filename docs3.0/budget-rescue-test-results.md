# Budget Rescue Test Results

This file summarizes the current available validation results for Budget Rescue. The detailed complete QA report is `docs/budget-rescue-complete-test-report.md`.

## Current Test Architecture

- Build command: not available in the current repository.
- Lint command: not available in the current repository.
- Type-check command: not available in the current repository.
- Unit/integration/static tests: direct Node scripts in `tests/`.
- Browser E2E framework: not available.
- Accessibility scan framework: not available.
- Responsive/browser viewport framework: not available.
- Data validators: available for ingredients and prices.

## Latest Baseline

Date: 2026-08-11.

| Command | Result |
|---|---|
| `node --check app.js` | Passed |
| `node --check rules.js` | Passed |
| `node --check data/recipes.js` | Passed |
| `node --check scripts/recipe-eligibility-ranking.js` | Passed |
| Parse `data/recipes.json` | Passed |
| Run all `tests/*.js` | Passed |
| `node scripts/validate-ingredient-data.js` | Passed |
| `node scripts/validate-price-data.js` | Passed |

Pre-existing failures: none found in the latest baseline.

## Test Files

- `tests/planning-mode-static.test.js`
- `tests/budget-rescue-form-static.test.js`
- `tests/ingredient-data.test.js`
- `tests/price-data.test.js`
- `tests/cost-calculation-engine.test.js`
- `tests/price-confidence-static.test.js`
- `tests/pantry-first-planning.test.js`
- `tests/recipe-eligibility-ranking.test.js`
- `tests/budget-planning-algorithm-static.test.js`
- `tests/leftover-batch-cooking-static.test.js`
- `tests/cheaper-substitution-static.test.js`
- `tests/budget-status-panel-static.test.js`
- `tests/recipe-card-cost-information-static.test.js`
- `tests/shopping-list-budget-upgrade-static.test.js`
- `tests/emergency-plan-mode-static.test.js`
- `tests/respectful-budget-messages-static.test.js`
- `tests/plan-savings-explanation-static.test.js`
- `tests/budget-rescue-save-plan-static.test.js`
- `tests/budget-data-protection-static.test.js`
- `tests/budget-edge-case-handling-static.test.js`
- `tests/budget-accessibility-mobile-static.test.js`
- `tests/budget-rescue-complete-qa.test.js`
- `tests/budget-rescue-roadmap-static.test.js`

## Required Scenario Status

| Scenario | Status |
|---|---|
| Standard weekly Budget Rescue plan | Automated - Passed |
| Emergency Plan request | Automated - Passed |
| Allergy protection | Automated - Passed |
| Appliance restriction | Automated - Passed |
| Plan above budget | Automated - Passed |
| Shared grocery ingredient | Automated - Passed |
| Missing price | Automated - Passed |
| Replace Meal recalculation | Automated - Passed |

## Manual Testing

Manual checklist: `docs/budget-rescue-manual-test-checklist.md`.

Not run in this environment:

- Screen readers
- Physical mobile devices
- Browser zoom and 400% reflow
- OS forced-colors and increased contrast
- Print preview
- Touch interaction on hardware

These are intentionally not marked as passed.
