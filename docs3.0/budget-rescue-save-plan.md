# Chef Nova Budget Rescue Save Plan Integration

## 1. Purpose

Budget Rescue plans stay as previews until the existing Save Plan workflow is confirmed. This prevents a generated plan from overwriting the Meal Planner, Pantry, Shopping List, or calendar without user review.

## 2. Existing Save Plan Reuse

Budget Rescue uses the same reviewed Suggested Weekly Plan save entry point as the standard generator. The shared confirmation path builds one final plan object, validates it, and writes it through the current user-scoped MealPlan storage helper.

## 3. Preview Lifecycle

Budget Rescue metadata uses these lifecycle values:

- `preview`: generated and reviewable, not saved.
- `saving`: being prepared for storage.
- `saved`: committed through Save Plan.
- `dirty-saved-plan`: changed in review after a saved snapshot or generated preview.
- `save-failed`: failed verification or unsupported metadata.

## 4. Existing Calendar Integration

Saved meals continue to live in `mealPlans.calendar["YYYY-MM-DD"]`. Save Plan merges the reviewed week into that calendar and preserves unrelated calendar dates and notes.

## 5. Plan Metadata Schema

`savedPlanMetadata.schemaVersion` is `1`. Version 1 stores plan ID, planning mode, lifecycle status, signatures, date range, selected days and meals, integer-cent budget fields, price source ID, price confidence, Pantry savings, Shopping List coverage, leftover counts, substitution IDs, status snapshots, generated time, saved time, updated time, and cost calculation time.

## 6. Money Storage

Money values are stored as integer cents. Unavailable totals are stored as `null`, never `0`.

## 7. Historical Snapshots

Saved metadata is a historical snapshot. Current grocery totals can be recalculated later from current Pantry, prices, recipes, and requirements.

## 8. Atomic Save

The save path validates the preview, builds one complete object in memory, checks serializability, commits through the existing storage helper, and restores the previous plan if storage rejects the write.

## 9. Calendar Conflicts

Budget Rescue updates only the generated date range and meal slots. Other calendar dates remain unchanged.

## 10. Pantry and Shopping List Behavior

Saving a plan does not deduct Pantry items, mark meals cooked, mark groceries purchased, or clear the Shopping List.

## 11. User and Guest Scoping

Registered users save through account-specific localStorage keys. Guests continue to use temporary sessionStorage behavior.

## 12. Backward Compatibility

Older plans without Budget Rescue metadata still load as standard plans. Unsupported future metadata versions fail safely without clearing the saved plan store.

## 13. Saved Plan Recalculation

Saved Budget Rescue plans can be recalculated using current Pantry, price profile, Shopping List coverage, hard requirements, substitutions, leftovers, and recipe costs.

## 14. Replace Meal Impact Preview

Replacement cards recalculate the full proposed draft before selection. The preview compares current and proposed grocery totals when complete pricing is available.

## 15. Above-Budget Warning

If a replacement would move the plan above budget, Chef Nova shows that warning in the replacement impact preview. Budget preference warnings never override safety checks.

## 16. Incomplete Pricing

When a complete comparison is unavailable, Chef Nova shows priced subtotals and Price Confidence instead of claiming the replacement is within budget.

## 17. Hard-Requirement Protection

Replacement selection is disabled when the candidate fails allergy, dietary, appliance, cooking-time, serving, or mandatory-ingredient requirements.

## 18. Leftover and Substitution Integration

Replacement previews rebuild leftover relationships and remove target-specific substitution assumptions before recalculating cost.

## 19. Accessibility

Save Plan remains the single visible save action. Replacement impact previews use readable text, definition lists, disabled buttons for unsafe choices, and existing dialog focus behavior.

## 20. Responsive and Print Design

Replacement impact rows stack on smaller screens and remain printable without relying on background color.

## 21. Testing

Validation used bundled Node syntax checks, JSON parsing, and the Budget Rescue save/replacement static regression test.
