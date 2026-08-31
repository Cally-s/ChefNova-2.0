# Cook Before It Spoils: Freeze Today Reminders

## Goal

Freeze Today reminders identify Pantry food or prepared leftovers that still have meaningful unplanned quantity when their shared Use-First timeline reaches a freezing action point.

The reminder is advisory. It never marks food as frozen, changes inventory, edits reservations, or records a food event by itself.

## Shared Systems Used

- Pantry item schema and current quantity records
- Prepared leftover batches and original leftover timelines
- Pantry reservations from saved meal planning
- Date Intelligence and Use-First Priority
- Food-Safety Guardrails
- Step 21 Freezing Suitability Catalogue
- Existing Freeze Options and leftover transformation flows
- Existing Chef Nova Notifications store

## Reminder Eligibility

A reminder can appear only when all of these are true:

- The item exists in the current user or guest scope.
- The lifecycle status is available.
- Current quantity is known and greater than zero.
- The food is not already recorded as frozen.
- Food-Safety Guardrails do not block use or require review.
- The relevant storage/date record does not need confirmation.
- Approved Step 21 freezer guidance exists for the exact food form.
- The freezer profile is accepted by the existing freezer guidance system.
- A meaningful amount remains after valid timely meal allocations.

Prepared leftovers also keep the original timeline. Reheating or transforming a leftover does not reset its safety clock.

## Plan Coverage Formula

The reminder uses these quantities:

- `currentQuantity = inventoryItem.currentQuantity`
- `timelyPlannedQuantity = sum(valid confirmed allocations scheduled on/before priorityActionDate)`
- `lateReservedQuantity = sum(active reservations after priorityActionDate)`
- `allActiveReservedQuantity = sum(all active reservations)`
- `unreservedQuantity = currentQuantity - allActiveReservedQuantity`
- `quantityWithoutTimelyPlan = currentQuantity - timelyPlannedQuantity`
- `actionableFreezeQuantity = Math.min(quantityWithoutTimelyPlan, unreservedQuantity)`

Only exact reservation links count. Name matches, drafts, unsaved suggestions, stale reservations, cancelled meals, completed meals, or plans after the action date do not count as timely coverage.

## Reminder Labels

- `FREEZE TODAY` appears when the local date is the action date or the last reviewed action opportunity has passed.
- `Consider freezing soon` is used for future action dates.
- `Freezing date needs review` is used when the date cannot be trusted.

## Reminder Actions

Reminder buttons open existing workflows:

- Open Freeze Options
- Review Half
- Choose Amount
- Plan Recipe Instead
- Find Transformation
- Review Later Meal
- Snooze
- Dismiss

Inventory mutation is intentionally excluded. Actual freezing must still happen through an existing final confirmation flow that records exact quantity, preparation, storage, packaging, time, user, and revision.

## Notification Behavior

Active Freeze Today reminders create warning notifications with stable IDs:

`notification::freeze-today::<scope>::<item-id>::<action-date>::<policy-id>::v<policy-version>`

The notification routes back to Cook Before It Spoils with the matching Pantry item or leftover focused.

