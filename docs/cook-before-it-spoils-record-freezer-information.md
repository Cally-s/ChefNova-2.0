# Chef Nova Record Freezer Information

## 1. Purpose

Record Freezer Information captures a factual physical freezing action only after the user confirms it. Opening Freeze Options or the recorder does not change Pantry state.

## 2. Existing Systems Reused

The workflow reuses Pantry, prepared leftover batches, storage, preservation, lifecycle, reservations, Food Event History, Original Timeline, Freeze Options, Freeze Today reminders, and the existing Notifications reminder store.

## 3. Recommendation Versus Factual Recording

Chef Nova can recommend freezing from reviewed freezer guidance, or the user can record a factual freeze directly. A factual record does not imply Chef Nova approved the food as safe.

## 4. Lifecycle, Storage, and Preservation

Frozen is represented through storage and preservation. A usable frozen item remains lifecycle `available`, storage `freezer`, and preservation `frozen`.

## 5. Canonical Quantity

The Pantry quantity remains the source of truth. The frozen amount uses the canonical Pantry unit. Servings are offered only when a confirmed conversion exists.

## 6. Full Versus Partial Freezing

A full freeze moves the existing record to freezer storage. A partial freeze reduces the source record and creates a separately addressable frozen child batch.

## 7. Freezer Recording Context

The context stores source workflow, inventory item ID, item kind, source reminder ID, source meal or plan, proposed quantity, and user scope.

## 8. Freezer Recording Draft

The draft includes source details, inventory snapshot, frozen amount, frozen time, timestamp precision, container label, quality reminder preference, policy snapshot, and source revisions. It is non-mutating.

## 9. Frozen Amount

The amount must be known, finite, positive, supported by the canonical unit, no greater than current available quantity, and meaningful.

## 10. Reservations

Active reserved quantity is displayed and excluded from the default maximum. Chef Nova does not silently freeze another meal's reserved food.

## 11. Frozen Date and Time

Immediate recording defaults to the current local date and time, shown before confirmation. Backdated date-only records keep date-only precision.

## 12. Timestamp Confidence

Supported precision values are exact date-time, date-only, and approximate. Date-only records do not fabricate a clock time.

## 13. Container Labels

Container labels are physical metadata. They do not replace inventory IDs, recipe IDs, prepared-food identity, or source meal identity.

## 14. Quality Reminder Options

Users may choose no reminder, 1 month, 2 months, 3 months, or a custom date. No reminder is selected by default.

## 15. Calendar-Month Arithmetic

Reminder dates use local calendar-month addition with month-end clamping, such as January 31 to the final valid day of February.

## 16. Reminder Basis

User-selected intervals are planning reminders. They are separate from approved best-quality guidance.

## 17. Quality Reminder Schema

Quality reminders store schema version, stable reminder ID, type, user scope, inventory item, scheduled local date, timezone, basis, interval, frozen snapshot, policy snapshot, status, state, source revisions, and timestamps.

## 18. Quality Reminder Wording

Quality reminders say they are quality and meal-planning reminders, not expiration dates or safety deadlines.

## 19. Frozen Duration

Frozen duration is derived from `frozenAt` and the current local date. It is not persisted as a changing field.

## 20. Full-Freeze Command

The existing freeze command updates storage, preservation, container label, frozen timestamp, event history, and optional reminder linkage after final confirmation.

## 21. Partial-Freeze Command

Partial freezing creates a frozen child, reduces the source, preserves identity and lineage, and records split/freeze history.

## 22. Original Timeline

Freezing adds `frozenAt`; it does not replace `originalCookedAt`, transformation history, reheating history, lineage, or earlier storage records.

## 23. Policy Snapshot

The freeze record keeps a compact policy snapshot with freezer policy ID, version, review status, approval hash, and quality guidance label where available.

## 24. Reminder Scheduling Failure

The factual freezer record remains the priority. Optional reminder failure must not erase a valid physical freeze record.

## 25. Idempotency

Stable keys prevent repeated confirmation from creating duplicate state updates, child batches, events, or reminders.

## 26. Pantry and Leftovers

Frozen items stay in the canonical Pantry and prepared-leftover systems. No second freezer inventory is created.

## 27. Freezer Assistant

The Freezer Assistant reads frozen records from Pantry state and reminder records from the existing reminder store.

## 28. Transformation Paths and Recipes

After freezing, recipe and path views recalculate from current Pantry state.

## 29. Quality Window Passed

Quality windows are best-quality guidance only. Passing one is not an automatic unsafe or discard decision.

## 30. Temperature Events

Temperature excursions remain Food-Safety Guardrail concerns, separate from quality reminders.

## 31. Editing Labels and Reminders

Label and reminder edits do not change frozenAt, quantity, safety status, storage, or original timeline.

## 32. Legacy Migration

Legacy frozen fields should migrate conservatively into storage and preservation without duplicate editable frozen quantity.

## 33. User Isolation

Policies are shared read-only data. Frozen quantities, labels, reminders, and timelines remain scoped to the active user or temporary guest session.

## 34. Accessibility

The recording modal uses visible labels, fieldsets, focused errors, contextual action names, and live-region completion messages.

## 35. Responsive Design

Quantity summaries, date/time fields, reminder choices, and actions stack on narrow screens.

## 36. Print and Export

Printed freezer details should include quantity, frozen time, label, reminder date, original timeline, and the quality-versus-safety notice.

## 37. Testing

Step 23 validation includes syntax checks, JSON parsing, data validation, focused static checks, and the existing JavaScript test suite.

## 38. Deferred Work

Automatic thawing, refreezing, freezer analytics, waste analytics, household-pattern learning, and environmental-impact claims remain outside Step 23.

