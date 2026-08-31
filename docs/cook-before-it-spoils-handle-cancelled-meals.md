# Chef Nova Cancelled Meal Handling

## 1. Purpose

Meal cancellation releases planning reservations without changing physical Pantry quantities. Reserved food was never removed from Pantry, so cancellation makes it available for planning again rather than adding it back.

## 2. Existing Systems Reused

Step 53 reuses the existing Meal Planner, Meal Calendar, Pantry reservation arrays, Pantry package records, leftovers, freezer records, Shopping List, Budget Rescue, Emergency Plan, notifications, Food Event History, Impact Ledger, user-scoped storage, and guest storage. It does not create another Calendar, Pantry, reservation engine, Shopping List, Priority Engine, FEFO system, event store, impact ledger, or user-storage convention.

## 3. Cancellation Commit

Opening or closing the cancellation dialog does not release reservations. Reservations are released only after the user confirms cancellation and the cancellation command commits.

## 4. Immediate Reservation Release

Immediate release means the meal status update and active reservation release occur in the same canonical state transition. Chef Nova does not wait for `reservedUntil`, the original meal time, the next app load, or manual release of each ingredient.

## 5. Meal States

Draft meals can be removed when no persistent reservation exists. Scheduled and Reserved meals can be cancelled and release active reservations. Started meals route to outcome review. Prepared and Completed meals require correction or outcome review. Skipped or Needs Outcome Review meals can release reservations only after the user confirms the meal was not prepared. Cancelled meals are idempotent.

## 6. Cancel Versus Skip, Reschedule, and Replace

Cancel means the meal will not occur and active reservations are released. Skip asks whether the meal should be cancelled, rescheduled, or retained. Reschedule keeps valid reservations where possible and revalidates date and safety. Replace uses the existing replacement workflow and creates new reservations only after the replacement is saved.

## 7. Cancellation Reasons

Cancellation reasons are optional controlled values: plans changed, chose different meal, ingredient unavailable, storage or safety review, household schedule changed, meal moved, duplicate meal, user requested, other, or not recorded. A reason is not waste evidence.

## 8. Reservation Release Reasons

Release reasons preserve provenance: meal cancelled, meal replaced, meal rescheduled and reservation invalid, dependent leftover source cancelled, user released, reservation corrected, plan deleted, and safety recalculation. Normal Step 53 cancellation uses `meal-cancelled`.

## 9. Cancellation Record

The cancellation record stores version, cancellation ID, user scope, meal ID, plan ID, calendar date, meal type, previous and current status, optional reason, timestamp, reservation release summary, dependent meal summary, result, source revisions, and request ID.

## 10. Reservation Release Record

Each released reservation stores version, release ID, reservation ID, user scope, meal ID, Pantry item ID, previous and current reservation status, released quantity representation, release reason, timestamp, cancellation ID, and source revisions.

## 11. Physical Versus Reserved Quantity

Physical Pantry quantity remains unchanged. Active reserved quantity decreases. Available planning quantity is recalculated from physical quantity minus remaining active reservations.

## 12. Exact Quantities

Exact package reservations release their exact hold. The released amount is described as available for planning again, not added back to Pantry.

## 13. Partial Reservations

Reservations belonging to other meals remain active. If 300 g exists, 160 g is released, and 100 g remains reserved, the available amount is 200 g.

## 14. Multiple Packages

Each package reservation is released separately with its package ID, dates, opening state, price data, and FEFO lineage preserved. Chef Nova does not merge package records.

## 15. Partial Packages

Partial packages keep their current remaining quantity and confidence. Cancellation does not reset a package to its original full size.

## 16. Unknown Quantities

Whole-item reservations release exclusivity while quantity remains unknown. Qualitative capacity remains qualitative and is not converted to grams.

## 17. Leftover Reservations

Existing leftover-serving reservations are released through the same reservation model. The leftover batch’s physical servings and original cooked timeline remain unchanged.

## 18. Batch-Cooked and Dependent Meals

When a source meal is cancelled before preparation, dependent leftover meals are marked as needing replacement. Chef Nova does not create nonexistent leftover batches.

## 19. Atomic Transaction

The cancellation command re-reads the meal, checks state, creates the cancellation record, releases active reservations for that meal only, marks dependent meals, commits Pantry reservation changes and the cancelled meal state, then recalculates dependent displays. If the core commit fails, previous meal and reservation state is preserved.

## 20. Plan Completeness

A cancelled meal no longer counts as active meal coverage. The plan may become incomplete until the user chooses a replacement or accepts fewer meals.

## 21. Find Another Recipe

Find Another Recipe opens an existing recipe preview using the released item when practical. It does not save a recipe, create a reservation, deduct Pantry, or create impact.

## 22. Freeze Options

Review Freezing Options appears only when existing freezer guidance and current safety checks permit it. Opening the workflow does not mark food frozen.

## 23. Keep in Pantry

Keep in Pantry takes no further physical action. It does not change quantity, date, storage, safety, priority, or reminder state.

## 24. Shopping List

After cancellation, Chef Nova recalculates Shopping List demand. Plan-generated demand owned by the cancelled meal can be removed or reduced, while shared demand, manual items, user-kept extras, checked items, stores, and prices remain preserved.

## 25. Purchased Items

Cancellation does not reverse purchases or delete purchase records. Purchased packages remain in Pantry and can be planned later.

## 26. Budget Rescue

Budget totals are recalculated with current meal count. Chef Nova must disclose reduced meal coverage when a cancellation makes the plan smaller.

## 27. Emergency Plan

Emergency plans release reservations immediately, recalculate remaining meals and budget, and offer safe replacement options. Safety still has priority.

## 28. Priority and FEFO

Released food is reprioritized immediately. FEFO package order is recalculated per package without automatically allocating the released food elsewhere.

## 29. Missing Dates and Storage Review

Missing-date estimates and storage-review decisions remain active after release. True-expired and storage-ineligible food remains excluded from recipes and freezing actions.

## 30. Notifications

Cancellation can create one useful current notification candidate. Chef Nova avoids duplicate meal-cancelled, ingredient-reminder, and reservation-released notifications for the same unchanged state.

## 31. Food Event History

Cancellation is a planning event. It does not create Quantity Used, Consumed, Frozen, Discarded, Purchased, Meal Prepared, or Meal Completed outcomes.

## 32. Impact Ledger

Reservation release creates no rescue impact. Impact can be recognized only after a later confirmed physical outcome.

## 33. Undo Cancellation

Undo is deferred to a fully revalidated workflow. It must not silently take food from newer reservations.

## 34. Offline and Cloud Sync

Guest and local storage use the existing local canonical write behavior. Any future cloud retry must preserve request IDs and prevent duplicate releases.

## 35. Stale and Multi-Tab Protection

The command stores source revisions and idempotency keys. Stale or conflicting states require review instead of silent release.

## 36. Legacy Migration

Legacy cancelled meals with active reservations can be repaired only when evidence proves the meal was cancelled and not prepared. Ambiguous orphaned reservations require review.

## 37. Data Protection

New fields are optional and backward-compatible. Existing Pantry records, quantities, package IDs, dates, storage history, prices, recipes, favorites, saved meals, manual Shopping List items, event history, and impact history are preserved.

## 38. User Isolation

Registered-user cancellations stay user-scoped. Guest cancellations remain temporary and are not merged into registered-user storage automatically.

## 39. Accessibility

The confirmation names the meal, date, reserved foods, quantities, dependent meals, what changes, and what does not change. Result messages use visible text, semantic buttons, and live-region announcements.

## 40. Responsive Design

Cancellation and release cards stack on mobile. Buttons meet the 44 CSS pixel touch-target baseline and do not require drag or swipe.

## 41. Print and Export

Print and export may show cancelled status, cancellation time, release records, package IDs, and release provenance. They must not show released amounts as Pantry quantity added.

## 42. Testing

Validation includes syntax checks, recipe data parsing, Step 53 static checks, and adjacent Step 39, Step 48, Step 49, Step 50, Step 51, and Step 52 regression checks.

## 43. Deferred Work

Automatic replacement meals, automatic freezing, automatic physical outcomes, automatic impact recognition, environmental calculations, full cloud sync, and full undo restoration remain outside Step 53.

