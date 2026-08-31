# Chef Nova Cook This Tonight Workflow

## 1. Purpose

Cook This Tonight turns an eligible Food-Rescue recipe recommendation into a confirmed dinner plan. It keeps recommendation, planning, reservation, cooking, completion, Pantry use, and leftovers separate.

## 2. Existing Systems Reused

The workflow reuses the existing Recipe Finder, Food-Rescue ranking, hard-filter eligibility, Meal Planner calendar, Pantry lot reservations, Shopping List derivation, Food Event History command pipeline, leftover metadata, guest storage, and registered-user storage.

No second Meal Planner, calendar, Shopping List, Pantry reservation system, meal-completion system, or recipe scaler was created.

## 3. Lifecycle Distinctions

- A recipe recommendation is not a plan.
- A tonight-plan draft is not saved.
- A confirmed plan creates a calendar meal and active Pantry reservations.
- A Pantry reservation is not a Pantry deduction.
- Start Cooking does not complete the meal.
- Pantry quantity is deducted only after the user confirms the actual meal outcome.
- Expected leftovers are not actual leftover batches.

## 4. Workflow State Machine

Statuses use `COOK_TONIGHT_WORKFLOW_STATUSES`:

- `draft`
- `awaiting-confirmation`
- `committing`
- `planned`
- `cooking`
- `completion-review`
- `completed`
- `cancelled`
- `replaced`
- `needs-review`

Supported transitions:

- Draft to Awaiting Confirmation
- Awaiting Confirmation to Planned or Cancelled
- Planned to Cooking, Cancelled, Replaced, or Needs Review
- Cooking to Completion Review
- Completion Review to Completed, Planned, Cancelled, or Replaced

Draft cannot move directly to Completed. Cooking cannot deduct Pantry without completion confirmation.

## 5. Tonight-Plan Draft

Drafts use `workflowVersion: 1` and remain in app state until confirmation.

Fields include workflow id, candidate id, recipe id, target date, meal slot, people eating, requested meal servings, planned leftover servings, effective yield, Pantry allocation preview, missing purchase groups, leftover plan, eligibility snapshot, cost snapshot, source revisions, and user scope.

Complete Pantry records are not copied into the draft.

## 6. Pantry Quantity Confirmation

The first workflow screen shows planned use, current recorded quantity, existing active reservations, available quantity, and lot labels. Unknown or insufficient selected priority-food quantities block plan confirmation.

Reserved quantities are not displayed as available.

## 7. People and Servings

People eating and servings for tonight are explicit positive whole-number inputs. Chef Nova does not overwrite the household profile and does not make child-portion assumptions.

## 8. Planned Leftovers

The user chooses whether to plan leftovers. Planned leftovers affect required recipe yield but do not create actual leftover inventory.

## 9. Recipe Scaling

Changing people, servings, or planned leftovers rebuilds the draft and reruns the existing Food-Rescue ranking and hard-filter path.

## 10. Pantry Allocation Preview

Pantry allocation is preview-only until `Confirm Tonight's Plan`. The preview calculates current amount, active reserved amount, planned reservation, and remaining unreserved amount.

## 11. Shopping List Preview

Still-needed groceries come from the Food-Rescue purchase groups after Pantry allocation. Selected rescue-food shortages are blocked rather than added as purchases.

## 12. Final Plan Review

The review shows the recipe, exact date, meal slot, people eating, servings, planned leftovers, total yield, Pantry reservations, still-needed groceries, cooking time, and leftover guidance. It remains non-mutating.

## 13. Atomic Plan Commit

`Confirm Tonight's Plan` revalidates the draft, creates active Pantry reservations, saves the meal to the existing calendar, syncs the weekly view, and refreshes existing Shopping List demand.

If calendar save fails after reservation creation, the workflow releases the new reservations.

## 14. Pantry Reservations

Reservations live on existing Pantry lots with stable IDs, meal IDs, plan IDs, quantities, units, active status, and idempotency keys. They do not reduce on-hand quantity.

## 15. Tonight's Plan Summary

After commit, Chef Nova shows Tonight's Food-Rescue Plan with Start Cooking, Change Servings, Review Shopping List, and Cancel Reservation.

## 16. Storage and Leftover Guidance

Leftover guidance reuses recipe leftover or batch metadata when available. Chef Nova does not invent a universal storage window.

## 17. Start Cooking

Start Cooking marks the existing calendar meal as cooking and opens recipe instructions. Pantry quantities remain reserved and are not deducted.

## 18. Completion Question

Finish Cooking opens one radio group:

- Yes, as planned
- Yes, but I changed the quantities
- Not yet
- I chose something else

No outcome is selected by default.

## 19. Yes, As Planned

The user sees the planned Pantry quantities and must confirm before deduction. The user also confirms what happened to planned leftovers.

## 20. Changed Quantities

The changed-quantity form records actual meal use. Pantry record corrections stay separate.

## 21. Not Yet

The meal remains planned, reservations stay active, and Pantry quantities are unchanged.

## 22. Chose Something Else

The cancellation path releases reservations and removes the calendar meal. Pantry on-hand quantity is not deducted.

## 23. Actual Leftovers

Actual leftover events are created only after completion confirmation and only when leftover servings are recorded as saved.

## 24. Food Event History

Plan confirmation appends `reserved-for-recipe` events. Meal completion appends `quantity-used`, reservation consumed/cancelled events, and leftover-batch linkage when applicable.

## 25. Idempotency and Atomicity

Stable reservation and completion idempotency keys prevent duplicate reservation and duplicate Pantry deduction. Saved meals keep planned and actual outcomes separately.

## 26. Stale and Multi-Tab Protection

The workflow stores user scope, source revisions, and current dates. Confirmation rebuilds the draft before committing so stale Pantry quantities block the plan.

## 27. User Isolation

Registered users use existing user-scoped Pantry, meal plan, Shopping List, and event storage. Guests use existing temporary guest storage.

## 28. Accessibility

Workflow steps use visible headings, semantic lists, definition lists, fieldsets, legends, specific button labels, validation messages, modal focus management, and live-region announcements.

## 29. Responsive Design

Workflow cards, quantity rows, metrics, actual-use fields, and actions stack on small screens. Forced-color and print styles are included.

## 30. Testing

Validation uses syntax checks, JSON parse, data validators, existing tests, and the Step 12 static test.

## 31. Deferred Work

Waste analytics, household-pattern learning, environmental-impact reporting, automatic freezing, automatic discard, automatic meal substitution, and full manual browser accessibility certification remain outside Step 12.
