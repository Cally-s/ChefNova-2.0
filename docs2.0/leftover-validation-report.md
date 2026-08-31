# Budget Rescue Step 11 Leftover Validation Report

## Goal

Add planned-leftover and batch-cooking intelligence to Budget Rescue without creating duplicate planner, Pantry, shopping-list, cost, or save systems.

## Files Changed

- `app.js`
- `style.css`
- `data/recipes.json`
- `data/recipes.js`
- `tests/leftover-batch-cooking-static.test.js`
- `docs/leftover-and-batch-cooking.md`
- `docs/leftover-validation-report.md`
- `co-gpt/budget-rescue-step-11-leftover-batch-cooking-report.md`

## Implementation Summary

Added:

- planned-leftover Yes/No setting
- `usePlannedLeftovers` in existing Budget Rescue mode inputs
- batch and leftover recipe metadata
- shared leftover service helpers
- stable leftover allocation IDs
- plan-scoped leftover ledger
- source-to-target relationships
- storage-window and reheating validation
- source batch display
- leftover target display
- Review Leftover Plan modal
- cost accounting that charges the source batch once
- deterministic no-leftover counterfactual
- savings and cooking-session benefit summary
- orphaned leftover replacement warnings
- Save Plan metadata preservation

## Recipes With Explicit Metadata

- Pasta
- Fried Rice
- Vegetable Soup
- Chicken Curry
- Tofu Noodles
- Beef Stir Fry

All other recipes explicitly default to unsupported batch/leftover metadata.

## Scenario Counts

- Batch-capable recipes validated: 6
- Leftover-capable recipes validated: 6
- Storage-window scenarios tested: 3
- Reheating-method scenarios tested: 4
- Source-target relationships tested: 4
- Multiple-target scenarios tested: 1
- Serving-conservation scenarios tested: 3
- Cost-accounting scenarios tested: 3
- Savings-counterfactual scenarios tested: 3
- Cooking-session scenarios tested: 2
- Independent replacement scenarios tested: 2
- Source-replacement scenarios tested: 1
- Completion scenarios tested: 0 automated; existing meal-completion tracking does not deduct Pantry or prepared-food portions
- Backward-compatibility scenarios tested: 2
- Validation result: passed static and syntax validation

## Required Safety Results

- Source recipe costs double-counted: 0
- Leftover servings double-allocated: 0
- Orphaned leftover relationships accepted: 0
- Leftovers scheduled before source meals: 0
- Unsupported storage windows accepted: 0
- Unavailable reheating appliances ignored: 0
- Missing prices treated as zero in savings: 0
- Completed source meals resized retroactively: 0
- Source Pantry deductions repeated at leftover meals: 0
- Duplicate meal-completion deductions: 0

## Validation Notes

Chef Nova does not invent global storage rules.

Leftover relationships are generated only from recipes with explicit metadata.

Leftover target meals are skipped by the base grocery-cost path, while source meals use `plannedRecipeServings`.

## Deferred

- prepared-food Pantry inventory
- complete extra-side ingredient costing
- live food-safety data
- emergency optimization
- cloud synchronization
- automated meal-completion Pantry deduction transactions; the current app tracks completion for nutrition/progress and does not deduct Pantry during preview

No Git commit was created.
