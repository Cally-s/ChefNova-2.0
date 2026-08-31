# Chef Nova Food Event History

## 1. Purpose

Important Pantry activity is now recorded as append-only food events. The Pantry item remains the current-state snapshot, while the event history explains how that state changed.

## 2. Hybrid Current-State and Event Architecture

Chef Nova is not fully event sourced. `state.pantry` is still the active Pantry projection used by Recipe Finder, Meal Planner, Shopping List, Date Intelligence, Budget Rescue, and Nutrition Tracker. The food-event history records important changes beside that projection.

## 3. Event Store

The food-event store uses schema version `1`. Registered users store history through the existing user-scoped storage convention under `FoodEvents` / `chefNovaFoodEvents`; guests store temporary history in `chefNovaGuestFoodEvents`.

The store contains:

- `schemaVersion`
- `revision`
- `eventsById`
- `eventOrder`
- `idempotencyIndex`
- `createdAt`
- `updatedAt`

## 4. Event Record Structure

Each event stores:

- `schemaVersion`
- `eventId`
- `sequenceNumber`
- `pantryItemId`
- `eventType`
- `eventCategory`
- `occurredAt`
- `recordedAt`
- `actor`
- `source`
- `quantityChange`
- `stateChanges`
- `idempotencyKey`
- `pantryItemRevisionBefore`
- `pantryItemRevisionAfter`
- `correction`
- `note`

Null values are preserved when a field is unknown. Unknown future versions are not overwritten by the version-1 normalizer.

## 5. Event Categories

Categories are acquisition, usage, reservation, preservation, leftover, outcome, correction, metadata, and migration.

## 6. Event Types

Canonical event types are:

- `history-baseline-created`
- `item-added`
- `item-opened`
- `quantity-added`
- `quantity-used`
- `reserved-for-recipe`
- `reservation-cancelled`
- `reservation-consumed`
- `marked-frozen`
- `marked-thawed`
- `added-to-leftover-batch`
- `consumed`
- `discarded`
- `donated-shared`
- `quantity-corrected`
- `date-added`
- `date-corrected`
- `date-removed`
- `storage-location-changed`
- `storage-container-changed`
- `package-state-changed`
- `event-record-corrected`

## 7. Quantity Effects

Quantity effects are explicit. A quantity event states whether it affects on-hand quantity, reserved quantity, both, or neither. The direction is increase, decrease, correct, or none.

Reservations are planning activity. They are not consumption.

## 8. Timestamps

`occurredAt` records when the food activity happened. `recordedAt` records when Chef Nova saved the event.

## 9. Event Sources

Sources can reference Pantry, date editing, Shopping List, Meal Planner, meal completion, reservation, leftover workflow, storage workflow, migration, or system reconciliation. Source records can include meal, plan, reservation, leftover batch, recipe, and shopping item IDs without copying full recipes or meals.

## 10. Idempotency

Every command event includes an `idempotencyKey`. Repeated completion and repeated add flows are checked against `idempotencyIndex` so a repeated action does not create duplicate Pantry effects.

## 11. Atomic Commands

`executePantryCommand()` routes important Pantry changes through one command path. `commitPantrySnapshotAndFoodEvents()` saves the Pantry snapshot and event history together, after validating serialization.

## 12. Pantry Add and Open Events

Pantry adds create `item-added` events. Package-opened event support is present in the schema and classification, but a dedicated opened-action UI remains future work.

## 13. Quantity Use and Consumption

Meal completion creates `quantity-used` events and deducts Pantry once. Prepared-leftover consumption is kept separate from source ingredient use so source ingredients are not deducted twice.

## 14. Reservations

Reservation event types exist for planned future reservation workflows. Save Plan currently does not create physical usage events.

## 15. Frozen and Thawed Events

Frozen and thawed events are preservation records. They do not automatically count as food saved.

## 16. Leftover Events

Leftover event types link source meals and batches without replacing the existing leftover source of truth.

## 17. Discarded and Donated Events

Discarded and donated/shared event types are distinct. Date passing alone does not create either event.

## 18. Corrections

Corrections append new events. Existing events remain stored and visible, with effective summaries excluding corrected records.

## 19. Quantity Reconciliation

`reconcilePantryQuantityHistory()` compares current Pantry quantity with effective item events. Mismatches show a review warning and do not overwrite Pantry automatically.

## 20. History Interface

Pantry cards show a compact Food History timeline with event labels, source text, quantities, timestamps, corrected status, and baseline notes.

## 21. Meal Completion

The existing meal-completion workflow is reused. Completion checks `pantryDeductionsApplied` and records `quantity-used` events through the shared Pantry command commit.

## 22. Save Plan and Replace Meal

Save Plan remains a planning action and does not deduct Pantry. Replace Meal reservation history remains future work unless a saved reservation source is added later.

## 23. Future Analytics Readiness

`summarizeConfirmedFoodEvents()` classifies effective events for later analytics. It excludes baselines, corrections, and reservations from consumption totals.

## 24. Legacy Migration

Existing Pantry items receive one `history-baseline-created` event when they have no history. Chef Nova does not fabricate past additions, use, discard, donation, or freezing.

## 25. User Isolation

Registered histories use the current user-scoped storage. Guest histories use session storage and remain temporary.

## 26. Accessibility

The history interface uses a visible heading, semantic ordered list, text labels, readable dates, text warnings, wrapping source labels, and keyboard-safe passive display.

## 27. Responsive Design

History rows use a compact grid on desktop and stack on mobile. The display avoids horizontal overflow and does not create a separate mobile history system.

## 28. Testing

Validation commands:

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parse `data/recipes.json`
- run all `tests/*.js`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`

## 29. Deferred Work

Dashboards, monetary waste calculations, environmental impact, household pattern learning, full correction dialogs, freezer/discard/donation action screens, reservation creation/cancellation UI, and prepared-leftover event UI remain later steps.
