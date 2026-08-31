# Chef Nova Leftover Transformation Tests

## 1. Purpose

Step 58 validates leftover-batch creation, source lineage, Tuesday transformation planning, reservation behavior, Shopping List suppression, and confirmed-use boundaries.

## 2. Fixed Test Timeline

Tests use America/Toronto with Monday, August 10, 2026 and Tuesday, August 11, 2026. Monday cooking is fixed at 2026-08-10T18:00:00-04:00 and refrigeration starts at 2026-08-10T19:00:00-04:00.

## 3. Source Meal

The source meal is `leftover-test-monday-roast-chicken`. It belongs to `leftover-test-user`, uses `leftover-test-plan`, and references `leftover-test-roast-chicken-recipe`.

## 4. Actual Source Outcome

The confirmed Monday outcome is six servings prepared and four servings consumed. The remaining amount is two servings.

## 5. Batch Creation

A leftover batch is created only after the Monday meal outcome is confirmed. Planned servings alone do not create physical leftovers.

## 6. Batch Conservation

Serving conservation is explicit: six prepared equals four consumed plus two placed into Leftover Inventory. Negative or invented servings fail validation.

## 7. Source Lineage

The batch preserves source meal ID, original recipe ID, user scope, source package or purchase lineage where supported, and the physical outcome revision.

## 8. Original Cooking Date

`originalCookedAt` remains Monday, August 10, 2026. Recommendations, reservations, transformations, reheating, cancellation, completion, reload, print, and export must not reset it to Tuesday.

## 9. Tuesday Transformation

Chicken Wraps use the two-serving cooked roast-chicken leftover batch. The recommendation must identify the Monday source batch.

## 10. Raw Versus Cooked Chicken

Cooked roast chicken from a leftover batch is distinct from raw chicken. The Tuesday wrap fixture must not silently create a raw-chicken demand when the leftover fully covers the cooked-chicken requirement.

## 11. Shopping List

The Tuesday Shopping List adds no second chicken purchase when the two-serving leftover batch fully covers the cooked-chicken demand. Missing tortillas or optional ingredients may still appear.

No second chicken purchase should appear for the fully covered Tuesday wraps.

## 12. Cost Engine

Historical chicken ingredient value may remain attached to the source package. New Tuesday chicken checkout spending must be $0.00 when the leftover fully covers chicken.

## 13. Reservations

Scheduling Tuesday wraps reserves two servings without consuming them. Physical leftover servings remain two while the meal is only scheduled.

## 14. Cancellation

Confirmed cancellation releases the leftover reservation and leaves physical servings unchanged. Opening the dialog alone does not release or consume anything.

## 15. Tuesday Completion

Confirmed Tuesday use deducts the actual leftover amount. A full two-serving use leaves zero servings and marks the reservation consumed.

## 16. Actual Versus Planned Use

Actual use is authoritative. If one serving is used, one serving remains and the unused reservation difference is released.

## 17. Safety and Storage

Storage review and hard food-safety blocks run before recommendation, reservation, Shopping List suppression, and ranking.

## 18. Reheating

Reheating eligibility is action-specific. A blocked heated transformation does not reset `originalCookedAt` and does not universally block cold-safe options.

## 19. Allergy and Dietary Filters

Allergy and required dietary filters remain hard filters. Ineligible variants are excluded before scoring.

## 20. Multiple Batches

Separate chicken leftover batches stay separate by source meal, original cooking date, storage history, reheat history, price history, and quantity.

## 21. Source-Meal Corrections

Correcting Monday from two leftovers to one leftover revalidates Tuesday reservations and marks over-allocated plans for review.

## 22. Food Event History

Monday completion may create leftover-batch creation events. Tuesday recommendation creates no physical event. Tuesday reservation creates planning events only. Tuesday completion creates the physical transformed event.

## 23. Impact Ledger

Recommendation and reservation create no leftover-reuse Impact Ledger credit. Confirmed Tuesday consumption may create the qualifying reuse metric under the existing contract.

## 24. Idempotency and Multi-Tab Safety

Stable IDs and idempotency keys prevent duplicate batches, duplicate reservations, duplicate events, and duplicate impact entries.

## 25. Persistence Reload

Reload must preserve one batch, two servings, Monday source meal, original recipe, Monday original cooking date, and zero new chicken purchase.

## 26. Accessibility

Visible and screen-reader text must identify the batch, source meal, two servings, original cooking date, reservation state, and no-new-purchase status.

## 27. Mobile and Visual Modes

Mobile, high contrast, and reduced motion checks must preserve source, servings, dates, purchase status, focus visibility, and textual meaning.

## 28. Print and Export

Print and export must preserve Monday source meal, Tuesday transformation, two-serving allocation, and Monday `originalCookedAt`.

## 29. Test Isolation

Tests use `leftover-test-user`, unique IDs, fixed dates, isolated fixtures, and no production storage writes.

## 30. Commands

Run syntax checks for `app.js`, `rules.js`, and the Step 58 test. Run the Step 58 test plus related Step 16, 17, 18, 20, 33, 34, 37, 38, 39, 52, 53, 56, and 57 tests.
