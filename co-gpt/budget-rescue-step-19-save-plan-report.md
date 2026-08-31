# Budget Rescue Step 19 - Save Plan and Replace Meal Integration

## Goal

Connect Budget Rescue to Chef Nova's existing Save Plan and Replace Meal workflows. Budget Rescue plans remain previews until the user confirms the shared Save Plan flow.

## Files Changed

- `app.js`
- `style.css`
- `docs/budget-rescue-save-plan.md`
- `docs/budget-rescue-save-plan-report.md`
- `tests/budget-rescue-save-plan-static.test.js`
- `co-gpt/budget-rescue-step-19-save-plan-report.md`

## Implementation Summary

- Added versioned saved-plan metadata with schema version 1.
- Added lifecycle statuses: preview, saving, saved, dirty saved plan, and save failed.
- Preserved the canonical `planningMode` field.
- Kept Budget Rescue generation as a temporary preview.
- Reused the existing Save Plan confirmation workflow.
- Built the final saved object in memory before committing through the current MealPlan storage helper.
- Restored the previous meal plan if storage rejects a registered-user save.
- Merged generated meals into existing `mealPlans.calendar["YYYY-MM-DD"]` without creating another calendar.
- Preserved unrelated calendar dates and notes.
- Stored money values as integer cents or `null`.
- Saved historical cost, price confidence, Pantry, Shopping List, leftover, substitution, and explanation snapshots.
- Added replacement impact previews that recalculate the full proposed draft.
- Disabled unsafe replacement choices when hard requirements fail.
- Kept Pantry and Shopping List unchanged during Save Plan.

## Validation

- `node --check app.js`: passed
- `node --check rules.js`: passed
- `data/recipes.json` parse: passed
- `tests/budget-rescue-save-plan-static.test.js`: passed

## Required Safety Results

- Unsaved previews committed automatically: 0
- Separate Budget Rescue calendars created: 0
- Duplicate plans from repeated Save clicks: 0
- Unrelated calendar meals overwritten: 0
- Partial calendar and metadata saves accepted: 0
- Missing monetary values stored as zero: 0
- Pantry deductions performed during save: 0
- Shopping List items marked purchased during save: 0
- Unsafe replacements accepted: 0
- Budget override used to bypass hard requirements: 0
- Stale replacement previews applied: 0
- Historical and current costs compared without disclosure: 0
- Cross-user saved plans exposed: 0

## Notes

Validation used the bundled Codex Node runtime because the shell session did not have `node` on PATH.
