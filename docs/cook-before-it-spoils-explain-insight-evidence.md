# Chef Nova Insight Evidence Explanations

## 1. Purpose

Every possible planning pattern and suggested action must show the evidence behind it. Users should be able to review why Chef Nova surfaced a pattern before choosing any action.

## 2. Existing Systems Reused

Step 32 reuses Food Event History, effective events, Step 30 patterns, Step 31 actions, Waste Diary, meals, leftovers, freezer records, corrections, and settings. It does not create another event store, diary, pattern checker, or settings system.

## 3. Pattern Evidence Versus Action Evidence

Pattern evidence explains why a possible pattern exists. Action evidence explains why a specific next step is eligible. A repeated discard pattern does not automatically prove a purchase, reminder, freezer, or serving action.

## 4. Evidence Source of Truth

Evidence is derived from exact Step 30 incident references, root event IDs, pattern revisions, and source-event revisions. Chef Nova does not rebuild evidence with food-name searches.

## 5. Effective Evidence

Active evidence uses current effective records only. Corrected or superseded events are replaced by their effective values. Reversed events, duplicate retries, technical events, and cancelled drafts are not active evidence.

## 6. Evidence Bundle Model

The pattern evidence bundle stores version, pattern ID, pattern revision, pattern type, status, subject, rolling window, threshold, identity-match explanation, evidence items, excluded summary, limitations, confidence, source-event revision, and calculation time.

## 7. Action Evidence Bundle

The action evidence bundle stores version, action ID, action type, pattern ID, pattern revision, action rule version, eligibility, evidence requirements, qualifying incident IDs, evidence items, limitations, scope, effects, non-effects, and source revisions.

## 8. Evidence Item Model

Evidence items show date, food, amount, reason, storage, package context, source meal context, match basis, status, and available review actions. Optional private notes are not copied into compact evidence.

## 9. Why Am I Seeing This

Each active pattern card includes a native disclosure labelled “Why am I seeing this?” It shows threshold, current evidence, time window, confidence, identity basis, limitations, and a chronological evidence list.

## 10. Why Is This Action Suggested

Each active Step 31 action card includes a native disclosure labelled “Why is this action suggested?” It shows action requirements, action-specific current evidence, scope, non-effects, and limitations.

## 11. Threshold Explanations

Threshold wording changes by category. Chef Nova can explain incidents, distinct dates, source meals, purchase cycles, frozen batches, Pantry additions, and rolling windows.

## 12. Identity-Match Explanation

Identity explanations use structured canonical ingredient, prepared food, recipe, package, Pantry compatibility, or exact manual-label matching. Internal IDs are not shown as primary user content.

## 13. Data Limitations

Limitations include unknown quantity, missing price, missing weight, manual entries, incomplete usage tracking, freezer quality boundaries, and date-label uncertainty. Missing data is not invented.

## 14. Discard Evidence

Discard evidence shows occurrence date, food, discarded status, amount, amount confidence, reason, storage, package context, and source meal context when available.

## 15. Meal Evidence

Portion and cooked-too-much evidence uses confirmed meal outcome information when available. Meal-plan quantity alone is not treated as proof of unused food.

## 16. Leftover Evidence

Leftover evidence distinguishes planned leftovers from confirmed outcomes. Unknown outcomes are not called unused.

## 17. Freezer Evidence

Freezer evidence keeps quality reminders separate from expiration or safety deadlines.

## 18. Duplicate-Pantry Evidence

Duplicate Pantry evidence uses exact Pantry additions and compatible existing inventory. Intentional stock-up feedback excludes relevant incidents without deleting records.

## 19. Date-Type Evidence

Date-type evidence uses structured date uncertainty or correction records. It does not accuse the user of misunderstanding expiration dates.

## 20. Review Diary Entries

For discard-backed evidence, Review Diary Entries opens the existing Waste Diary and filters by exact supporting root event IDs.

## 21. Review Related Records

For non-diary evidence, Review Related Records keeps the user in the existing pattern details view with the exact supporting record references.

## 22. Correct Entry

Correct Entry opens the existing append-only correction workflow. The evidence bundle is never edited directly.

## 23. Reverse Accidental Entry

Reversal remains an explicit confirmed source-event workflow. Step 32 does not create a new reversal system.

## 24. This Record Is Not Related

This feedback preserves the Waste Diary event and Pantry history while excluding that incident from the current pattern evidence.

## 25. This Was Intentional

Intentionality feedback preserves the physical event and removes it from pattern categories where intentionality invalidates the evidence.

## 26. Recalculation

After corrections or feedback, Step 30 patterns, Step 31 actions, metrics, and Step 32 evidence are recalculated from source data.

## 27. Pattern Withdrawal

If current evidence falls below threshold, active pattern cards and unconfirmed suggestions are withdrawn. Applied settings are not reversed automatically.

## 28. Action Withdrawal

One action can become unavailable while a broader pattern remains active.

## 29. Applied Settings

Settings applied from an older insight stay active until the user reviews, edits, keeps, or undoes them.

## 30. Stale Previews

Action previews compare current source-event revision before confirmation. Stale previews cannot be confirmed.

## 31. Privacy

Compact evidence excludes optional notes, medical information, household-member names, internal user IDs, and full correction payloads.

## 32. Deterministic Wording

Evidence wording comes from structured templates. AI does not fabricate dates, reasons, quantities, package data, eligibility, or causal explanations.

## 33. Stale and Multi-Tab Protection

Bundles reference user scope, pattern revision, incident normalization, source-event revision, action rule version, settings revision, reference date, and timezone.

## 34. Accessibility

Evidence uses native disclosures, visible headings, semantic lists, contextual action labels, text status, keyboard support, and the existing live-region system.

## 35. Responsive Design

Evidence panels stack on small screens. Dates, amounts, reasons, limitations, and record actions wrap without a separate mobile evidence system.

## 36. Print and Export

Print output keeps pattern category, threshold, evidence count, window, confidence, identity basis, evidence summaries, limitations, and cautious wording.

## 37. Testing

Validation uses JavaScript syntax checks, JSON parsing, focused Step 26-32 tests, and the available static test suite.

## 38. Deferred Work

Causal inference, automatic setting reversal, public evidence sharing, behavioural diagnosis, environmental-impact calculations, AI-generated evidence, and a new record history UI remain outside Step 32.
