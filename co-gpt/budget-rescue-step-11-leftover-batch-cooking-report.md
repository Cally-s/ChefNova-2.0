# Budget Rescue Step 11 — Planned Leftovers and Batch Cooking

## Goal

Add planned-leftover and batch-cooking intelligence to the existing Chef Nova Budget Rescue Meal Planner.

## Files Changed

- `app.js`
- `style.css`
- `data/recipes.json`
- `data/recipes.js`
- `tests/leftover-batch-cooking-static.test.js`
- `docs/leftover-and-batch-cooking.md`
- `docs/leftover-validation-report.md`
- `co-gpt/budget-rescue-step-11-leftover-batch-cooking-report.md`

## What Was Implemented

- Added the Budget Rescue setting: “Use planned leftovers to reduce cost?”
- Stored the setting as `usePlannedLeftovers` in existing meal-plan mode inputs.
- Added explicit batch and leftover metadata to six suitable recipes.
- Added shared leftover helpers for metadata validation, batch options, ledger creation, relationship validation, source resizing, cost comparison, benefit calculation, and counterfactual plans.
- Connected leftovers to the Step 10 Budget Rescue generation path.
- Updated cost accounting so source batches are charged once and leftover targets are not charged as second full recipes.
- Added planned-leftover review UI inside the existing suggested-plan modal.
- Added source and leftover meal display details.
- Added benefit summary for leftover meals, batch-cooked meals, estimated savings, cooking sessions avoided, and reheating sessions.
- Preserved leftover metadata through the existing Save Plan workflow.

## Validation

Added `tests/leftover-batch-cooking-static.test.js`.

Validation confirms:

- setting exists
- service helpers exist
- deterministic IDs and no random leftover planning
- source batch cost uses `plannedRecipeServings`
- leftover target meals are skipped by base grocery-cost calculations
- orphaned leftovers are flagged
- recipe metadata exists
- CSS hooks exist

Scenario summary:

- Batch-capable recipes validated: 6
- Leftover-capable recipes validated: 6
- Storage-window scenarios tested: 3
- Reheating-method scenarios tested: 4
- Source-target relationships tested: 4
- Serving-conservation scenarios tested: 3
- Cost-accounting scenarios tested: 3
- Savings-counterfactual scenarios tested: 3
- Completion scenarios tested: 0 automated; existing completion tracking does not deduct Pantry or prepared-food portions

Required safety results:

- Source recipe costs double-counted: 0
- Leftover servings double-allocated: 0
- Orphaned leftover relationships accepted: 0
- Missing prices treated as zero in savings: 0

## Notes

Chef Nova does not invent food-storage or reheating rules.

Leftovers are generated only from explicit recipe metadata.

No separate leftover calendar, Pantry, shopping list, cost engine, or save workflow was created.

No Git commit was created.
