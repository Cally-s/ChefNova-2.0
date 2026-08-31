# Chef Nova Respectful Waste Diary

## 1. Purpose

The Waste Diary records factual discarded-food events without judgment. Exact measurements, prices, reasons, and notes are optional.

## 2. Existing Systems Reused

Step 26 reuses the existing Pantry, prepared-leftover batches, canonical quantity fields, Food Event History, discard events, reservations, Meal Planner recalculation, Price Catalogue, Cost Engine helpers, user-scoped storage, and guest session storage.

## 3. Respectful Design Principles

The workflow uses neutral wording such as "Discard recorded" and "Approximate information is okay." It does not create shame scores, public comparisons, financial-loss alarms, environmental claims, or blame-based messages.

## 4. Waste Diary Architecture

The diary is a projection of effective `discarded` Food Event History records. It does not own an editable inventory quantity and does not create a second discard store.

## 5. Inventory-Linked Versus Manual Entries

Inventory-linked entries select an exact Pantry item ID and update the canonical Pantry quantity only after final confirmation. Manual untracked entries create a discard event without creating or mutating a Pantry item.

## 6. Food Types

Controlled values are `ingredient`, `leftover-meal`, `prepared-food`, and `packaged-food`. Linked items derive type from structured Pantry metadata. Manual entries ask the user.

## 7. Reason Codes

Controlled reason codes include spoiled before use, forgot it was available, bought too much, cooked too much, did not like it, plans changed, stored incorrectly, date unclear, unsafe temperature or storage, recipe did not work, other, unknown, and prefer not to say. Reasons are stored as user-reported.

## 8. Quantity Modes

Supported modes are numeric, small amount, about one-quarter, about half, most, all, and unknown. The original qualitative answer is preserved.

## 9. Estimate Basis

Estimate bases are current recorded quantity, original package quantity, user-entered package quantity, confirmed serving conversion, whole item count, and no numeric basis. Linked qualitative estimates prefer current recorded quantity.

## 10. Qualitative Conversion Configuration

Qualitative ratios are centralized in `QUALITATIVE_DISCARD_ESTIMATE_CONFIG` version 1. They are product-estimate conventions, not scientific measurements, nutrition rules, or food-safety rules.

## 11. Quantity Confidence

The workflow records measured, user-estimated, qualitative-derived, serving-derived, or unknown confidence. Estimated values are displayed as approximate.

## 12. Whole-Item Handling

Whole-count units are not silently recorded as fractional qualitative amounts. If a qualitative estimate would produce a fraction, Chef Nova asks for a whole numeric amount or unknown amount.

## 13. Unknown Quantities

Unknown manual entries remain non-numeric. Linked unknown entries can close the item when the user says none remains, or mark the remaining quantity as needing review.

## 14. Price Information

Price is optional. Chef Nova stores full purchase price and discarded-portion value separately. Missing price remains unavailable, not zero.

## 15. Discard Event

The discard event stores food, amount mode, canonical amount when available, estimate range, estimate basis, confidence, user-reported reason, optional price, optional note, timestamp precision, source workflow, source revisions, and idempotency key.

## 16. Partial Discard

Partial linked discard decreases the same Pantry item once and keeps lifecycle `available`. Unknown partial quantities mark the quantity as needing review.

## 17. Full Discard

Full discard sets quantity to zero and lifecycle `discarded`. The Pantry item history is retained.

## 18. Reservations and Plans

Reserved quantity is displayed and protected. If a requested discard exceeds the unreserved amount, Chef Nova blocks the silent deduction and asks for review.

## 19. Step 20 Integration

Step 20 already appends `discarded` events for confirmed leftover outcomes. Those events appear in the Waste Diary projection once without requiring a second Step 26 record.

## 20. Waste Diary View

The Pantry page shows recent discard records with type, amount, reason, optional value, details, correction, filters, and search.

## 21. Entry Corrections

Corrections are append-only metadata correction events. The original event is preserved. Quantity-changing corrections remain a later review workflow.

## 22. Dashboard and Pantry Entry Points

Dashboard and Pantry both use the same shared `openRecordDiscardedFoodWorkflow()` path. Item cards preselect the exact item.

## 23. Frozen and Thawed Items

Frozen and thawed item actions preserve Pantry ID, frozen time, thawed time, original cooked time, storage, preservation, and lineage metadata already present on the item.

## 24. Shopping List Boundary

Recording a discard does not automatically add a replacement item, remove a grocery item, or change Budget Rescue shopping preferences.

## 25. Future Analytics Boundary

Step 26 records structured data only. Pattern summaries, household comparisons, environmental-impact calculations, and automatic shopping recommendations remain outside this step.

## 26. Atomicity and Idempotency

Inventory-linked discard uses `executePantryCommand()` so Pantry update and event append commit together. Idempotency keys prevent duplicate confirmation from deducting twice.

## 27. Migration

Legacy discard records should map conservatively to controlled fields and must not deduct Pantry unless reliable evidence proves the quantity has not already been deducted.

## 28. User Isolation

Registered users use the existing account-scoped storage. Guests use session-only guest storage. Guest diary records are not merged automatically into registered-user storage.

## 29. Accessibility

The form uses visible headings, labels, fieldsets, legends, textual estimate status, accessible action names, focusable errors, and the existing modal focus management.

## 30. Responsive Design

Filters, form controls, estimate summaries, action rows, and diary cards stack on small screens without a separate mobile workflow.

## 31. Print and Export

Print styles preserve diary cards and estimate confidence while hiding filters and action buttons.

## 32. Testing

Validation includes JavaScript syntax checks, JSON parse checks, existing Cook Before It Spoils static tests, and the Step 26 static test.

## 33. Deferred Work

Household-pattern analysis, financial summaries, environmental-impact calculations, predictive shopping changes, public comparisons, full quantity-correction compensation, and legacy migration execution remain outside Step 26.
