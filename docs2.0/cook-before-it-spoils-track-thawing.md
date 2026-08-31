# Chef Nova Track Thawing

## 1. Purpose

Thawing is a factual inventory change. Chef Nova asks for confirmation because moving food from frozen to thawed changes storage, preservation, reminders, recipe eligibility, and planning review.

## 2. Verified Canadian Policy Basis

Chef Nova separates factual thawing records from approved safety guidance. The reviewed policy basis used by the wider Food-Safety and Freezer Assistant layers includes Health Canada safe food storage, safely defrosting foods, food safety and you, food-safety tips for leftovers, poultry safety, and safe food storage guidance reviewed for the Cook Before It Spoils policy catalogue. General no-refreezing guidance is conservative by default. Narrow exceptions require exact approved policy resolution.

## 3. Existing Systems Reused

Track Thawing reuses Freezer Inventory, Pantry, prepared-leftover batches, canonical quantities, storage, preservation, lifecycle, Original Timeline, Food Event History, quality reminders, reservations, Meal Planner, recipe eligibility, and Food-Safety Guardrails.

## 4. Recommendation Versus Factual Recording

Users may report refrigerator, microwave, cold-water, other, or unknown thawing. Recording a factual method does not mean the method was approved or that the food is safe, refreezable, or ready for automatic planning.

## 5. Thaw Methods

Supported values are refrigerator, microwave, cold water, cooked from frozen, other, and unknown. Cooked from frozen belongs to meal-completion flows and does not fabricate a separate `thawedAt` record.

## 6. Thawing Extent

Supported values are fully thawed, partly thawed with ice crystals, partly thawed with unknown ice state, and unknown. Chef Nova never infers ice crystals.

## 7. Post-Thaw Handling

Supported values are stored in refrigerator, cooking immediately, used immediately, moved to reviewed storage, storage review required, and unknown. Method and storage remain separate.

## 8. Thaw-Recording Context

The context records source workflow, inventory item ID, item kind, source meal, source quality reminder, and active user scope.

## 9. Thaw-Recording Draft

The draft stores current frozen quantity, reserved quantity, available quantity, frozen time, thawed amount, method, extent, time precision, post-thaw handling, policy snapshot, and source revisions. The draft is non-mutating.

## 10. Canonical Quantity

Mass, volume, count, and servings use the Pantry canonical quantity. Servings are used only when a confirmed conversion exists. Whole-count items reject invalid fractional amounts.

## 11. Full and Partial Thawing

Full thaw changes the current physical record to preservation `thawed`, lifecycle `available`, and the confirmed storage state. Partial thaw splits the item into a frozen source remainder and thawed child record.

## 12. Method-Specific Behavior

Refrigerator thawing may permit refrigerator storage only when current policy and safety review support it. Microwave thawing records immediate-cooking or immediate-use requirements. Cold-water thawing records factual method and requires package or handling review when policy is incomplete. Other and unknown methods remain factual reports.

## 13. Frozen and Thawed Times

Chef Nova records `thawedAt` separately from `frozenAt`. Date-only precision does not fabricate a clock time. Future factual thaw times are rejected.

## 14. Original Timeline

Thawing never resets original cooked, current prepared, transformed, reheated, frozen, lineage, or prior storage history.

## 15. Refreezing

Chef Nova does not automatically recommend refreezing thawed food. Any exception requires exact approved policy for food type, form, method, extent, temperature history, time history, package condition, prior cycles, and review version.

## 16. Food Event History

Opening Mark Thawed, editing draft fields, viewing guidance, or cancelling creates no physical event. Confirmed full thaw appends Marked Thawed. Confirmed partial thaw appends a split plus a thaw event for the child.

## 17. Quality Reminders

Full thaw resolves the exact freezer-quality reminder as thawed. Partial thaw keeps the reminder with the remaining frozen source and does not attach it to the thawed child.

## 18. Freezer Inventory and Pantry

Full-thawed food leaves Freezer Inventory and remains in Pantry. Partial thaw leaves the frozen source in Freezer Inventory and shows the thawed child in Pantry.

## 19. Accessibility and Responsive Design

The workflow uses visible headings, labels, fieldsets, legends, textual statuses, focused errors, restored modal focus, stacked mobile controls, and conservative no-refreeze text.

## 20. Testing

Validation uses syntax checks, JSON parsing, nearby Cook Before It Spoils static tests, and the Step 25 Track Thawing static test.

## 21. Deferred Work

Automatic thawing, proactive refreezing recommendations, refreezing execution, freezer analytics, waste analytics, household-pattern learning, and environmental-impact claims remain outside Step 25.

