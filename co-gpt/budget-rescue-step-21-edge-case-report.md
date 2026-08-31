# Budget Rescue Step 21 — Edge-Case Handling Report

## Goal

Add centralized, safe, and user-friendly handling for Budget Rescue and Emergency Plan edge cases.

## Files Changed

- `app.js`
- `style.css`
- `scripts/price-data-shared.js`
- `scripts/recipe-eligibility-ranking.js`
- `data/recipes.json`
- `data/recipes.js`
- `docs/budget-edge-case-handling.md`
- `docs/budget-edge-case-report.md`
- `tests/budget-edge-case-handling-static.test.js`
- `co-gpt/budget-rescue-step-21-edge-case-report.md`

## Existing Systems Reused

- Meal Planner
- Pantry Tracker
- Pantry-first allocation
- Price Catalogue
- Cost Engine
- Price Confidence
- Recipe Eligibility
- Budget Planning Algorithm
- Leftover and batch-cooking metadata
- Substitution system
- Shopping List
- Budget Status panel
- Recipe-card cost model
- Save Plan workflow
- Step 20 data-protection layer

## Implementation Summary

Added one centralized issue model:

- `EDGE_CASE_ISSUE_TYPES`
- `EDGE_CASE_SEVERITIES`
- `EDGE_CASE_SCOPES`
- `EDGE_CASE_PRIORITY_ORDER`
- `createEdgeCaseIssue()`
- `sortEdgeCaseIssues()`
- `buildEdgeCaseIssuesFromCostResult()`

Added shared budget validation:

`Enter an amount greater than $0 to create a budget plan.`

Budget Rescue and Emergency Plan now use the same validation message and issue model.

Added unknown Pantry quantity handling:

- `I have enough`
- `I have some`
- `Add item to the grocery list`

Plan-scoped Pantry confirmations are stored under `edgeCaseSnapshot` and do not alter real Pantry quantities.

Added missing-price protection:

- missing prices remain visible
- missing prices are never treated as zero
- complete budget claims remain blocked when required prices are missing

Added package-remainder handling:

- remainders are derived from plan purchase quantities
- remainders display as potential future Pantry inventory
- remainders are not added automatically
- adding to Pantry requires explicit user action
- duplicate additions are blocked

Added multi-buy promotion support:

- `promotionType`
- `purchasePackageCount`
- `bundlePriceCents`
- date validation
- checkout-cost evaluation
- no automatic extra-package purchases

Added explicit no-appliance preparation metadata for selected validated ready-to-assemble and serve-cold recipes.

## Validation

Validation performed:

- `node --check app.js`
- `node --check rules.js`
- `node --check scripts/price-data-shared.js`
- `node --check scripts/recipe-eligibility-ranking.js`
- `node --check data/recipes.js`
- `data/recipes.json` parse check
- all available `tests/*.test.js`

## Result

Step 21 edge-case handling is integrated with existing Chef Nova systems. No duplicate Pantry, Shopping List, Cost Engine, Price Confidence, planner, recipe-card, or Save Plan workflow was created.
