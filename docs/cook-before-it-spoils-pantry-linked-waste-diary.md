# Chef Nova Pantry-Linked Waste Diary

## 1. Purpose

Pantry-linked discard records connect a discarded-food entry to the exact Pantry item or leftover batch. This improves quantity, cost, weight, reservation, and plan accuracy while preserving manual untracked entries.

## 2. Existing Systems Reused

Step 27 reuses the existing Pantry, ingredient lots, prepared leftovers, canonical quantities, reservations, Food Event History, discard command pipeline, Price Catalogue, Cost Engine, Waste Diary projection, and user-scoped storage. It does not create a second Pantry, diary, dashboard store, price system, or command pipeline.

## 3. Exact Item Identity

Linked records store a stable Pantry item ID, item kind, canonical ingredient ID when available, leftover-batch ID when available, inventory revision, reservation revision, storage, package data, price basis, and user scope. Chef Nova does not link a discard by display-name similarity alone.

## 4. Pantry Item Picker

The picker lists each Pantry record separately with visible quantity, package state, storage location, date label, container label, source meal for leftovers, and frozen or thawed status where applicable. Duplicate foods remain separate choices.

## 5. Current Versus Original Quantity

Current quantity is the default suggestion basis. Original package quantity is displayed for context and cost calculations, but it does not replace the known current Pantry quantity for quick suggestions.

## 6. Reservation Protection

Quick suggestions use current unreserved quantity: current recorded quantity minus active reservations. If the physical discard exceeds the unreserved amount, Chef Nova blocks silent reservation loss and asks the user to review the affected meal.

## 7. Quick Suggestions

The model generates one-quarter, one-half, and all-available choices from the current unreserved quantity. It also keeps Enter Another Amount and Amount Unknown paths.

## 8. Whole-Item Suggestions

Whole-count items never show fractional choices. For 3 apples, Chef Nova offers whole choices such as 1 apple, 2 apples, and all 3 apples, with duplicates removed.

## 9. Suggestion Model

Each suggestion records a model version, inventory item ID, quantity basis, basis quantity, unit, semantic amount mode, displayed quantity, confidence, ratio, and estimation configuration version. Suggestions are not stored as inventory data.

## 10. Quantity Confidence

Approximate suggestions keep qualitative-derived confidence. Exact numeric entries keep measured confidence only when the user enters a numeric amount. Unknown amounts remain unknown.

## 11. Weight Estimation

Weight is estimated only when the discarded quantity is already a supported mass unit or when a confirmed conversion exists in the inventory record. Valid sources include canonical mass, confirmed serving-to-mass conversion, confirmed package net weight with a compatible fraction, confirmed count-to-mass conversion, or an approved density conversion.

## 12. Unavailable Weight

Unsupported conversions remain unavailable. Chef Nova does not infer grams from volume, food category, product name, or model memory, and missing weight is never treated as zero.

## 13. Cost Estimation

Cost uses a documented price basis: exact lot price, user-entered package price, saved exact product price, saved store-profile estimate, Chef Nova estimate, or unavailable. Missing price remains unavailable.

## 14. Merged Price Lots

Merged or layered package costs require a supported weighted basis. If the inventory model cannot prove a compatible cost basis, the value estimate remains unavailable or needs review.

## 15. Final Review

The review shows original package, Pantry amount before discard, selected amount, estimated discarded amount, estimated remaining amount, estimated weight, estimated discarded value, price basis, reason, and the single-event effect.

## 16. Core Discard Transaction

Linked discards use the existing atomic Pantry command. The command validates user scope and inventory revision, updates canonical quantity, updates lifecycle when quantity reaches zero, reconciles active reservations on full discard, and appends one Discarded event.

## 17. Waste Diary Projection

The Waste Diary is a projection of effective discard events. A physical discard creates one event and one diary entry, not a second diary record.

## 18. Waste Dashboard Projection

The Waste Summary is derived from effective discard events for the rolling 30-day period. It shows discard count, linked versus manual entries, measured and estimated weight, unknown-weight count, estimated value, unknown-price count, coverage, source revision, and update time.

## 19. Dashboard Confidence

Dashboard labels distinguish measured, estimated, and unknown values. Totals with estimates use approximate wording.

## 20. Pattern Checker

Pattern checks are deterministic and versioned. They use structured fields only, apply minimum event and distinct-date thresholds, and surface neutral “possible planning pattern” language.

## 21. Pattern Types

Supported pattern types include repeated canonical food, prepared food, package/product, reason, cooked-too-much, bought-too-much, forgot-it-was-available, unclear date, and storage review.

## 22. Pattern Thresholds

Food patterns require at least 3 effective events across at least 2 dates in 60 days. Reason patterns require at least 4 effective events across at least 2 dates in 60 days. Threshold configuration is versioned.

## 23. No Automatic Intervention

Possible patterns never change shopping, package sizes, budgets, recipes, reminders, or meal plans automatically. The user remains in control.

## 24. Corrections and Reversals

Corrections are append-only and preserve the original record. Dashboard and pattern projections use effective events so corrected entries do not count twice.

## 25. Step 20 Integration

Step 20 leftover discards remain one canonical Discarded event. The Waste Diary, Waste Summary, and pattern checker consume that event without duplicating the physical discard.

## 26. Frozen and Thawed Foods

Frozen and thawed items stay linked to their exact inventory record. Their storage, thaw, preparation, reminder, and lineage data remain preserved in the Pantry record and event metadata.

## 27. Projection-Failure Handling

The physical discard commit is primary. Derived summary or pattern refresh issues must not repeat a discard, deduct quantity again, or create a second event.

## 28. Stale and Multi-Tab Protection

Drafts store item revision, quantity revision, reservation revision, package revision, price revision, plan revision, event-history revision, user scope, timezone, and model versions. Stale drafts are blocked before confirmation.

## 29. Migration

Legacy entries link to Pantry only when a stable inventory reference exists. Name-only legacy entries remain manual and do not deduct current Pantry.

## 30. User Isolation

Registered-user Pantry, Waste Diary, Waste Summary, and pattern data are user scoped. Guest discard records, summaries, and dismissals remain temporary in session storage.

## 31. Accessibility

The workflow uses visible headings, labelled fieldsets, accessible action names, text labels for estimate confidence, live-region announcements, focusable controls, and non-color-only status text.

## 32. Responsive Design

The Pantry picker, quick choices, review, Waste Summary, and pattern cards stack on small screens. The same workflow works on desktop, tablet, and mobile.

## 33. Print and Export

Printed views preserve exact Pantry context, current and original quantities, estimate confidence, value basis, reason, dashboard period, unknown coverage, and neutral possible-pattern wording.

## 34. Testing

Validation includes JavaScript syntax checks, JSON parsing, Step 26 regression checks, Step 27 static checks, and the repository’s available static test suite.

## 35. Deferred Work

Automatic shopping changes, predictive purchasing, personalized behavioural recommendations, environmental-impact calculations, household comparisons, public scoring, AI-based behavioural diagnosis, and carbon calculations remain outside Step 27.
