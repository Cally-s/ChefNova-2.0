# Chef Nova Leftover Outcome Confirmation

## 1. Purpose

Scheduled leftover meals never prove that food was eaten, transformed, frozen, discarded, or shared. Step 20 adds an explicit confirmation step before Chef Nova changes leftover quantity or reservation state.

## 2. Existing Systems Reused

The workflow reuses the Step 16 prepared-leftover Pantry batch, Pantry reservations, meal-completion tracking, Food Event History, original leftover timeline, Food-Safety Guardrails, the calendar Meal Planner, Shopping List recalculation, Use These First, guest storage, and user-scoped localStorage.

## 3. Outcome Context

Each review stores source batch ID, target meal ID, transformation path IDs, reservation IDs, use type, planned allocation, pre-outcome batch snapshot, and current user scope. The context version is `LEFTOVER_OUTCOME_CONTEXT_VERSION`.

## 4. Outcome Scope

Scopes are `PLANNED_ALLOCATION`, `ENTIRE_BATCH`, and `USER_SELECTED_QUANTITY`. A scheduled transformation uses planned allocation. A direct Pantry action uses the unreserved quantity when reservations exist.

## 5. Outcome Types

Supported outcomes are All Used, Some Used, Frozen, Still Refrigerated, Discarded, Mixed, and Unknown. No outcome is selected by default.

## 6. Outcome Review Model

The review stores schema version, review ID, state-machine status, source, context, planned quantity, before-outcome snapshot, selected outcome, actual use, remaining batch, mixed allocations, meal resolution, confirmation metadata, source revisions, and serving conversion metadata.

## 7. Planned and Actual Quantities

Chef Nova preserves the planned amount and separately stores actual quantity used, actual remaining quantity, disposition, and confirmation time. This protects historical plan accuracy.

## 8. Canonical Quantity Basis

The Pantry batch remains the current quantity source. Mass, volume, count, and servings use the existing quantity model. Servings are offered only when confirmed serving conversion metadata exists.

## 9. All Used

All Used means the visible planned amount for the current meal. If 180 g was planned from a 430 g batch, only 180 g is deducted and 250 g remains.

## 10. Some Used

Some Used asks how much remains in the batch. Chef Nova derives actual use from `before - remaining` and stores confidence as user-estimated or serving-count estimate.

## 11. Mixed Outcomes

Mixed outcomes collect used, refrigerated, frozen, discarded, and shared amounts. The total must equal the batch amount before the meal.

## 12. Frozen

Frozen records a factual freezing outcome. It does not count as consumption, does not complete a transformation meal, and does not reset the original cooked timeline.

## 13. Still Refrigerated

Still Refrigerated does not decrease quantity and does not mark the planned meal completed. The meal remains review-required, rescheduled, replaced, cancelled, or kept for later.

## 14. Discarded

Discard requires final confirmation. Partial discard decreases the batch once and keeps the remaining source batch visible.

## 15. Shared

Shared is a distinct factual outcome. It decreases quantity once with a `DONATED_SHARED` event and is not classified as waste.

## 16. Unknown Amount

Unknown leaves the batch visible with amount review required. Unknown is never converted to zero.

## 17. Direct Consumption Versus Transformation

Direct leftover meals append `LEFTOVER_QUANTITY_CONSUMED`. Transformation meals append `LEFTOVER_QUANTITY_TRANSFORMED`. The same physical quantity never receives both events.

## 18. Reservation Reconciliation

The workflow compares planned reservation quantity with actual used quantity. Used quantity consumes the reservation; unused quantity is released or cancelled.

## 19. Downstream Path Reconciliation

After every confirmed quantity change, downstream transformation steps recalculate. Steps that require more than the remaining source amount move to Needs Review.

## 20. Original Timeline

Outcome confirmation never changes original cooked time. Freezing, storage confirmation, discard, sharing, consumption, and transformation preserve the historical timeline.

## 21. Food-Safety Guardrails

Factual storage or freezing is not safety approval. Guardrails recalculate eligibility after Pantry state changes.

## 22. Pantry and Use These First

The Pantry card, leftovers filter, available quantity, reservations, lifecycle status, Use These First priorities, and transformation cards recalculate from the confirmed outcome.

## 23. Shopping List and Calendar

Calendar meals store planned and actual source quantities. Shopping List demand is recalculated by the existing cost and meal-plan systems without changing purchased custom items.

## 24. Atomicity and Idempotency

The Pantry snapshot and Food Event History commit together through the existing command pipeline. Stable outcome idempotency keys prevent duplicate deduction.

## 25. Multi-Tab Protection

The review stores source revisions and user scope. A stale tab must reopen the review instead of committing over newer Pantry state.

## 26. User Isolation

Registered users use their own Pantry, reservations, meals, paths, calendar, and Food Event History. Guest outcomes use the existing temporary guest storage convention.

## 27. Accessibility

The modal uses a visible heading, labelled quantities, fieldsets, legends, labelled inputs, textual errors, keyboard-focus support, and concise live-region announcements.

## 28. Responsive Design

Context cards, outcome choices, mixed-outcome fields, and actions stack on narrow screens. The same workflow is used on desktop, tablet, and mobile.

## 29. Testing

Validation uses JavaScript syntax checks, JSON parsing, ingredient and price validators, the existing test suite, and a Step 20 static test.

## 30. Deferred Work

Waste analytics, household-pattern learning, environmental-impact reporting, advanced rescheduling dialogs, and richer child-batch split editing remain outside Step 20.
