# Chef Nova Food-Rescue Notification Levels

## 1. Purpose

Chef Nova provides timely planning reminders from recorded Pantry, Calendar, Freezer, leftover, and pattern data. A reminder is not a food-safety guarantee and never changes food state by itself.

## 2. Existing Systems Reused

Step 41 reuses the existing Notification Centre, saved notification store, Pantry, Use-First Priority Engine, Date Intelligence, Food-Safety Guardrails, prepared leftovers, Freezer Inventory, Meal Calendar reservations, Waste Diary, evidence-based pattern checker, actionable insights, Food Event History, Impact Ledger, and user-scoped storage.

## 3. Notification Versus Physical Outcome

Delivery, opening, reading, snoozing, and dismissal are notification interactions only. They do not mark food used, frozen, thawed, discarded, shared, protected, rescued, planned, consumed, or saved.

## 4. Notification Levels

Attention Today covers eligible food needing review today. Planning Reminder covers eligible food in the next three local days. Freezer Reminder covers due freezer quality prompts. Possible Pattern Reminder covers active Step 30 possible patterns with current Step 31 actionable insights.

## 5. Safety Precedence

Chef Nova evaluates Food-Safety Guardrails and Date Intelligence before creating notification candidates. Hard-excluded food is not recommended for consumption or automatic planning.

## 6. Precise Date Language

Best-before dates stay quality wording. Recorded expiration dates stay true-expiration wording. App-estimated freshness stays labelled estimated. Leftovers preserve original timeline language. Unknown date types require review.

## 7. Notification Candidate Model

Each candidate stores schema version, candidate ID, user scope, level, delivery urgency, status, source references, trigger window, presentation, actions, bundling data, frequency key, source revisions, and calculation time.

## 8. Notification Statuses

Statuses are candidate, eligible, scheduled, delivered, read, snoozed, dismissed, resolved, withdrawn, expired, needs-review, and failed. Dismissal hides the reminder revision only.

## 9. Attention Today

Attention Today uses Use-First results where current quantity remains available, safety does not hard-exclude the item, and the item is due today or needs same-day review. Multiple items are bundled and sorted by the shared priority model.

## 10. Planning Reminders

Planning reminders use tomorrow through the next three local calendar days. Items already in Attention Today are excluded. Fully planned quantities are suppressed; unplanned portions remain visible.

## 11. Freezer Reminders

Freezer reminders use current Freezer Inventory records and due quality reminders. They remain quality and planning prompts, not expiration notices or safety guarantees.

## 12. Possible Pattern Reminders

Pattern reminders require an active Step 30 possible pattern and at least one current Step 31 actionable insight. Wording stays cautious and routes to evidence review before any setting change.

## 13. Bundling

Chef Nova bundles compatible reminders by user, level, trigger period, and action. Source references are preserved exactly in the bundle.

## 14. Deduplication

Deduplication keys use user scope, local date or window, source-set hash, and notification policy version. Repeated evaluation with unchanged sources does not create repeated active reminders.

## 15. Reservations

Reservations affect reminder eligibility. Fully reserved current quantities are suppressed. Partial reservations show only unplanned quantity. Overdue reservations require outcome review elsewhere and are not released automatically.

## 16. Stale Notifications

Notifications are revalidated against current sources before display and action routing. Stale reminders become withdrawn and open current records instead of old actions.

## 17. Snooze

Snooze changes notification timing only. It does not change dates, priorities, reservations, freezer state, safety state, Pantry quantity, or patterns.

## 18. Dismissal

Dismissal hides the current reminder. It does not dismiss Pantry items, patterns, Waste Diary records, freezer records, or user behavior evidence.

## 19. User Preferences

Step 41 defines one versioned preference object with level, channel, privacy, quiet-hour, planning-window, and freezer-frequency fields. The default keeps in-app reminders on and external channels off.

## 20. Permissions

Browser notifications remain optional and are not requested on page load. External permission must follow a user action and explain supported categories.

## 21. Privacy

In-app reminders can show detailed source summaries. External previews default to generic wording and do not expose allergy, budget, household, pattern, Waste Diary, or private-note details.

## 22. Delivery Capability

Chef Nova is front-end only. In-app reminders are authoritative when the app is open. Browser reminders depend on browser permission and platform support.

## 23. Notification Centre

The existing Notifications page displays active reminders, status text, source summaries, timestamps, primary actions, snooze, dismissal, read, delete, and history states.

## 24. Pattern Boundary

Notification delivery, opening, snoozing, and dismissal are not Step 30 pattern evidence. Only existing physical and planning incident records qualify.

## 25. Impact Ledger Boundary

Notifications create no Impact Ledger entries. Impact recognition still requires confirmed physical outcomes through existing workflows.

## 26. Deterministic Templates

Reminder eligibility and text are built from structured templates. No AI model decides safety, urgency, date labels, pattern existence, or action eligibility.

## 27. Stale and Multi-Tab Protection

Candidate and bundle records include source revisions and stable deduplication keys. Storage events and repeated renders recalculate current state without duplicating unchanged reminders.

## 28. User Isolation

Registered reminders use user-scoped notification storage. Guest reminders stay in session storage and are not merged into accounts automatically.

## 29. Accessibility

Notification levels and statuses are visible text. Bundled source items use lists. Action labels name their destination. Snooze and dismiss controls say that Pantry records are not changed.

## 30. Responsive Design

Notification cards stack on narrow screens. Source summaries wrap, actions become full-width, and no separate mobile notification system is created.

## 31. Testing

Validation uses JavaScript syntax checks, JSON parsing, and focused Step 41 static checks covering models, boundaries, routing, deduplication, safety wording, accessibility hooks, and documentation.

## 32. Deferred Work

Automatic food outcomes, automatic freezing, automatic Pantry deduction, guaranteed closed-browser delivery, external push or email, automatic pattern changes, environmental calculations, and behavioral diagnosis remain outside Step 41.
