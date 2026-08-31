# Chef Nova Evidence-Based Pattern Detection

## 1. Purpose

Chef Nova waits for several related effective incidents before surfacing a possible planning pattern. The goal is to show useful planning observations without turning one mistake, one correction, or one projection into a user-facing conclusion.

## 2. Existing Systems Reused

Pattern detection reuses Food Event History, the Waste Diary projection, Waste Summary, Pantry records, meal and leftover records, freezer records, reminders, and correction handling. It does not create a second event store, Pantry, Waste Diary, Waste Dashboard, or pattern engine.

## 3. Respectful Language

Cards use “Possible Planning Pattern” and explain evidence counts. Chef Nova does not say the user wastes food, misunderstands dates, never uses frozen food, or has a bad habit.

## 4. Incidents Versus Events

One physical discard counts once. Command retries, correction events, enrichment events, reservation releases, dashboard projections, and UI views do not become separate pattern incidents.

## 5. Time Windows

Chef Nova uses inclusive rolling windows. Repeated ingredient discard, cooked-too-much, refrigerator visibility, and planned-leftover patterns use 60 days. Package, one-recipe, freezer, duplicate Pantry, and date-type patterns use 90 days.

## 6. Minimum Evidence

The baseline is at least three related effective incidents. Categories also require distinct local dates, source meals, purchase cycles, frozen batches, or Pantry addition events. Manual names require four exact-label incidents.

## 7. Pattern Statuses

Statuses are insufficient data, monitoring, possible pattern, review required, dismissed, withdrawn, expired, and needs recalculation. “Confirmed pattern” is not used.

## 8. Pattern Types

Controlled categories are repeated ingredient discard, repeated cooked too much, refrigerator visibility, back of refrigerator, large package unfinished, one recipe ingredient, planned leftover not used, frozen without meal plan, duplicate Pantry purchase, and date-type uncertainty.

## 9. Confidence

Confidence is low or moderate only. Cost, weight, private text, and user personality never increase confidence.

## 10. Threshold Configuration

Thresholds are centralized in version `1`. Defaults require three related incidents, two distinct dates, three surfaced cards at most, four incidents for manual identities, and five related records shown first.

## 11. Incident Normalization

The checker normalizes effective discard, Pantry addition, and date-correction evidence into versioned pattern incidents. Unsupported or incomplete sources stay available for other projections but do not qualify a category.

## 12. Repeated Ingredient Discard

Canonical ingredient or prepared-food identity and compatible form are preferred. Raw, cooked, frozen, canned, and prepared forms are not merged unless structured metadata supports it.

## 13. Repeated Cooked Too Much

Cooked-too-much patterns require separate meal incidents. Intentional batch cooking, shared food, frozen food, or leftovers later used must not qualify the category.

## 14. Refrigerator Visibility

Refrigerator visibility requires structured refrigerator storage plus the user-reported “forgot it was available” reason. It does not label the user forgetful.

## 15. Back-of-Refrigerator Evidence

Back-of-refrigerator wording requires exact sublocation evidence. General refrigerator evidence stays labelled as refrigerator visibility.

## 16. Large Packages

Package-size patterns require package quantity, package unit, distinct purchase cycles, and explicit package-related evidence such as “bought too much.” Chef Nova does not infer causation from a partial discard alone.

## 17. One-Recipe Ingredients

One-recipe patterns require distinct acquisition cycles, confirmed recipe links, and later remainder discards. When usage tracking is incomplete, the details view says some Pantry uses may not be recorded.

## 18. Planned Leftovers

Planned-leftover patterns require distinct source meals or batches and confirmed discard evidence. Rescheduled, consumed, transformed, frozen, or shared leftovers do not count as unused waste.

## 19. Frozen Food Without Plans

Freezer-planning patterns require distinct frozen batches and review evidence. The wording never says “never,” and newly frozen items or already planned items are excluded.

## 20. Duplicate Pantry Purchases

Duplicate Pantry patterns require compatible canonical identity, compatible form, overlapping available inventory, and distinct Pantry addition events. Intentional stock-up feedback excludes relevant incidents without deleting source records.

## 21. Date-Type Uncertainty

Date-label patterns use “Date was unclear” discard reasons or user-confirmed date-type corrections. Chef Nova explains date-label differences without accusing the user of misunderstanding expiration dates.

## 22. Data Coverage

Coverage tracks identity, quantity, weight, price, and reason availability. Missing quantity, cost, or weight appears as a limitation but does not block repeated-food evidence when required identity and date fields are present.

## 23. Pattern Result Model

Results store schema version, pattern ID, user scope, status, type, key, window, thresholds, evidence counts, incident IDs, root event IDs, confidence, data coverage, reason codes, presentation text, actions, revisions, and calculation time.

## 24. Overlap Control

Only active possible patterns are surfaced, with a maximum of three cards. If the same incidents support several categories, deterministic priority and overlap checks reduce duplicate cards.

## 25. Related Records

Related records show compact food name, date, type, amount, reason, and storage. Optional private notes remain available only in the normal Waste Diary details view.

## 26. User Feedback

Feedback supports intentionality, unrelated incident annotations, dismissal, and restoration. Feedback is stored as a derived annotation and does not rewrite discard, Pantry, freezer, meal, or date events.

## 27. Corrections and Reversals

Effective event selection excludes corrected evidence. If correction, reversal, relevance feedback, or identity changes drop evidence below threshold, the possible pattern is withdrawn or no longer active.

## 28. Expiration

Patterns expire when evidence ages outside the rolling window. Expiration means the current threshold is no longer met; it is not a user judgment.

## 29. No Automatic Intervention

Step 30 never changes Shopping List items, package sizes, serving defaults, Budget Rescue, reminders, freezer actions, recipes, or meal plans.

## 30. Cost and Weight Boundaries

Cost and weight may appear in Waste Diary records, but they do not prove behavior, increase confidence, rank patterns, or trigger warnings.

## 31. Waste Dashboard

The Waste Summary can show Possible Planning Patterns below core summary metrics. Counts include active surfaced patterns only, not monitoring, dismissed, withdrawn, expired, or overlapping hidden evaluations.

## 32. Deterministic Evaluation

Evaluation uses stable keys, sorted incidents, fixed thresholds, stable pattern IDs, and no random or AI-generated qualification.

## 33. Stale and Multi-Tab Protection

Results include user scope, source-event revision, feedback revision, configuration version, reference local date, and calculation time. Feedback is idempotent and tied to the active user scope.

## 34. User Isolation

Registered users use their own Food Event History, Pantry, meal, freezer, and feedback storage. Guest pattern feedback stays in session storage and is not merged into accounts automatically.

## 35. Accessibility

Cards use visible headings, labelled evidence metrics, contextual action labels, semantic related-record lists, live-region announcements, keyboard buttons, textual status, and focus-friendly modals.

## 36. Responsive Design

Pattern cards, metrics, related records, and feedback actions stack on small screens. No separate mobile engine exists.

## 37. Print and Export

Print output keeps neutral wording, evidence counts, thresholds, confidence, limitations, and related summaries. Notes are not printed by default.

## 38. Testing

Validation includes JavaScript syntax checks, JSON parsing, ingredient and price validators, focused Step 26-30 tests, and the full Node test sweep.

## 39. Deferred Work

Automatic recommendations, predictive shopping changes, package-size changes, serving changes, behavioral diagnosis, environmental-impact calculations, public comparisons, and external notifications remain outside Step 30.
