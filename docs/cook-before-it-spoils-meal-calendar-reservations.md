# Chef Nova Meal Calendar Pantry Reservations

## 1. Purpose

Chef Nova connects saved Meal Calendar meals to exact Pantry-item reservations. A saved recipe can hold Pantry quantities for that meal without reducing the physical Pantry amount.

## 2. Existing Systems Reused

The implementation reuses the existing Meal Calendar, Pantry item records, Pantry reservation arrays, Shopping List, Food Event History, user-scoped storage, guest session storage, leftover metadata, and budget purchase-group flow.

## 3. Systems Not Created

No duplicate reservation or calendar store was added. Chef Nova does not create `rescueCalendar`, `reservedPantryInventory`, `mealReservationCalendar`, `calendarPantryCopy`, `foodRescueReservationStore`, or `scheduledIngredientInventory`.

## 4. Reservation Source of Truth

The source of truth remains each Pantry item. Exact reservations are stored in the Pantry item's `reservations` array with `pantryItemId`, `reservationId`, `reservationGroupId`, `mealId`, `ingredientDemandId`, quantity, unit, status, windows, snapshots, and source revisions.

## 5. Physical Quantity Rule

Scheduling a meal does not deduct Pantry quantity. Available quantity is calculated as physical quantity minus active reserved quantity.

## 6. Preview Rule

Recipe and planning previews can simulate ingredient coverage. Persistent reservations are created only when the user saves a Meal Calendar day or saves a weekly meal that syncs to the calendar.

## 7. Atomic Save Rule

Calendar meal save, exact Pantry reservations, Shopping List demand, and planned outcome metadata are handled as one scheduling operation. If reservation creation fails, Chef Nova keeps the previous Calendar and Pantry state.

## 8. Exact Lot Allocation

Each reservation keeps the exact `pantryItemId`. If one ingredient is covered by multiple Pantry lots, Chef Nova creates separate reservation records linked to the same reservation group.

## 9. Reservation Groups

Reservation groups connect all exact lot reservations for one ingredient demand. Groups track required quantity, reserved quantity, missing quantity, reservation IDs, status, and source revisions.

## 10. Active Hold Statuses

The active hold statuses are `active`, `needs-outcome-review`, `needs-quantity-review`, `needs-safety-review`, and `partially-fulfilled`.

## 11. Status Model

Chef Nova supports Draft, Active, Needs Outcome Review, Needs Quantity Review, Needs Safety Review, Partially Fulfilled, Fulfilled, Released, Cancelled, Superseded, Invalid, and legacy Consumed reservation states.

## 12. Released Is Not Fulfilled

Released, Cancelled, and Superseded reservations free the Pantry hold. They do not mean food was cooked, used, discarded, frozen, donated, or consumed.

## 13. No Double Reservation

Before creating a reservation, Chef Nova checks active reservations for the exact Pantry item. A new hold cannot exceed unreserved physical quantity.

## 14. No Negative Availability

Available quantity is clamped at zero. Chef Nova never displays or uses negative availability for planning.

## 15. Unknown Quantity Rule

Unknown Pantry quantities are not converted to zero or guessed numeric amounts. Unknown quantities require review before numeric reservation.

## 16. Entire Item Holds

The reservation schema supports entire-item exclusive holds. Entire-item holds make the item unavailable for other unresolved meals.

## 17. Meal Window

Each saved reservation stores a meal window for the scheduled date and meal slot. The window is date-based and uses Chef Nova's current application timezone.

## 18. Reservation Window

`reservedUntil` is a review horizon. It does not automatically release a reservation.

## 19. Food Safety Snapshot

Each reservation stores a safety and date-intelligence snapshot from the Pantry item at schedule time. Live Pantry data remains authoritative for later review.

## 20. Food Safety Revalidation

Chef Nova can revalidate reservations when meal date, recipe, servings, Pantry quantity, food date, storage state, opened state, frozen state, thawed state, safety policy, allergy profile, or dietary profile changes.

## 21. Quantity Review

If a reserved quantity becomes larger than the current Pantry amount, the reservation is marked for quantity review instead of being silently released.

## 22. Outcome Review

After the meal window, unresolved reservations should move into outcome review. Actual completion must use confirmed actual quantities before Pantry deduction.

## 23. Completion Boundary

Scheduling does not consume food. Fulfillment must happen through a confirmed cooking or outcome flow that records actual quantities used.

## 24. Cancellation Rule

Cancelling or replacing a scheduled meal releases active reservations. It creates non-physical planning events only.

## 25. No Impact Credit on Release

Reservation release does not create waste-prevention impact, financial savings, freezer impact, donation impact, or disposal impact.

## 26. Planning Events

Reservation and release events are recorded in Food Event History as planning events. They set `affectsOnHandQuantity` to false.

## 27. Pantry Availability

Chef Nova derives availability from exact Pantry items by subtracting active reserved quantity from physical quantity.

## 28. Shopping List Demand

Ingredients that are not covered by Pantry reservations are passed to the existing Shopping List purchase-group flow.

## 29. Missing Purchases

Each saved recipe meal stores missing purchase references in meal metadata so the Calendar card can show what still needs to be bought.

## 30. Planned Leftovers

Meal entries preserve planned leftover metadata when present. Reservation scheduling does not create or consume leftovers.

## 31. Calendar Display

Calendar day cards show a reserved badge when meals have active Pantry reservation IDs.

## 32. Meal Editor Display

The active meal editor shows Pantry Reserved, exact lot rows, missing purchases, review warnings, and a reminder that Pantry quantities have not been reduced.

## 33. Change Servings

Changing servings focuses the servings field. The new reservation calculation happens only after the user saves the day.

## 34. Replace Meal

Replacing a meal focuses the meal field. Saving releases old reservations and creates new reservations for the replacement recipe.

## 35. Cancel Meal

Cancelling a meal clears the meal field. Saving the day releases reservations without deducting Pantry quantities.

## 36. Weekly Planner Sync

Weekly meal saves that sync into the current-week Calendar use the same reservation scheduler.

## 37. Guest Mode

Guest reservations use guest Pantry and guest Food Event History storage. They do not write into registered-user localStorage keys.

## 38. User-Scoped Storage

Registered-user reservations are written through the existing user-scoped Pantry, Meal Plan, Shopping List, and Food Event History storage helpers.

## 39. Reconciliation

Chef Nova separates planned reservations from actual outcomes. Actual used, leftover, discarded, frozen, or donated quantities require a later confirmed reconciliation flow.

## 40. Data Integrity

Reservation IDs are deterministic for meal, Pantry lot, and ingredient demand. This prevents duplicate active reservations when the same saved meal is reprocessed.

## 41. Step 39 Result

Chef Nova now connects exact Pantry-item reservations to saved Meal Calendar meals while preserving Pantry quantity, preventing double reservation, recording planning events, and adding genuinely missing ingredients to the existing Shopping List flow.
