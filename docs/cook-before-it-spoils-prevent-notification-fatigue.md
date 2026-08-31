# Chef Nova Notification Fatigue Protection

## 1. Purpose

Chef Nova lets users control food-rescue reminder frequency without changing food-safety information, Pantry priority, reservations, freezer status, or Food Rescue visibility.

## 2. Existing Systems Reused

Step 42 reuses the existing Notification Centre, Step 41 candidate pipeline, bundling, notification store, Pantry, reservations, leftovers, freezer inventory, pattern checks, actionable insights, Food Event History, Impact Ledger, guest storage, and registered-user storage.

## 3. Cadence as a Maximum

Cadence is a maximum delivery rule. Chef Nova sends nothing when no qualifying source exists.

## 4. Cadence Values

Supported values are Daily, Every Two Days, Twice Per Week, Only When an Item Needs Attention, and Off.

## 5. Daily Behavior

Daily allows at most one unchanged routine proactive bundle per local day.

## 6. Every-Two-Days Behavior

Every Two Days uses local calendar-day windows, not fixed 48-hour UTC math.

## 7. Twice-Per-Week Behavior

Twice Per Week requires two distinct user-selected weekdays. Chef Nova does not assign hidden weekdays.

## 8. Attention-Only Behavior

Attention Only suppresses routine planning digests and keeps event-based attention, freezer, and possible-pattern reminders eligible under their own caps.

## 9. Off Behavior

Off stops proactive delivery. In-app Pantry priority, safety details, freezer state, reservations, patterns, and notification history remain visible.

## 10. Preferred Reminder Time

Preferred time is stored as local wall-clock text such as `17:00`, with timezone stored separately.

## 11. Quiet-Hours Conflicts

Preferred times inside quiet hours require review. Chef Nova does not bypass quiet hours or silently choose a new time.

## 12. Daylight-Saving Time

Non-existent local times use the nearest valid later time and repeated local times use one delivery-window key so duplicate delivery is avoided.

## 13. Notification Categories

Global cadence never increases category-specific maximums. Freezer and possible-pattern reminders keep their own cycles.

## 14. Source Notification State

Source state records source ID, revision, physical quantity, reserved quantity, unreserved quantity, unit, physical status, reminder scope, suppression reasons, and source revisions.

## 15. Suppression Reasons

Suppression reasons are controlled constants, including reminders off, category disabled, quiet hours, cadence not due, preferred time not reached, already delivered, fully reserved, frozen, used, consumed, discarded, donated or shared, zero quantity, missing source, stale source, snoozed, dismissed until, and category cooldown.

## 16. Full Reservations

Fully reserved current quantities suppress competing food-use reminders. A reservation is not treated as confirmed use.

## 17. Partial Reservations

Partially reserved food remains eligible only for the unreserved amount. Notification details show physical, reserved, unreserved, and reminder-scope quantities.

## 18. Frozen Sources

Confirmed frozen Pantry food leaves Pantry attention reminders. It may later qualify for freezer quality reminders.

## 19. Used and Consumed Sources

Confirmed full use or consumption suppresses current reminders. Partial outcomes recalculate the remaining quantity.

## 20. Zero Quantities

Zero quantities are suppressed. Unknown quantities are never treated as zero.

## 21. Discarded, Donated, and Shared Sources

Confirmed transferred or removed quantities stop receiving unchanged use reminders. Partial outcomes keep only the remaining quantity eligible.

## 22. Snooze and Dismiss Until

Source-level and bundle-level deferrals store selected timing and source revision. Deferrals change notification timing only.

## 23. Deferral Expiration

Deferred reminders are revalidated against current source, quantity, reservations, dates, safety, cadence, preferred time, and quiet hours before delivery.

## 24. Cross-Level Deduplication

The same unchanged source cannot appear in multiple proactive bundles in one cadence window. Attention has priority over planning.

## 25. Material Escalation

Material source changes can create a new attention cycle. Ordinary recalculation does not reset deduplication.

## 26. Bundling and Fatigue Guardrails

Chef Nova bundles related reminders and prevents empty notifications, repeated unchanged bundles, duplicate channel deliveries, and per-item spam when a bundle is available.

## 27. Freezer Frequency

Freezer reminders follow freezer quality cycles and do not become daily reminders because the global cadence is Daily.

## 28. Pattern Frequency

Possible-pattern reminders are low-frequency and tied to active pattern revisions. They are not surfaced daily.

## 29. Delivery Windows

Delivery windows are bounded local-time windows with cadence, timezone, preferred time, selected weekdays, source-set hash, and status.

## 30. Next Eligible Reminder

The next eligible reminder is a possible window, not a delivery promise. Chef Nova sends only when qualifying information exists.

## 31. Multi-Channel Delivery

In-app delivery remains the active channel. External channels require user policy and platform permission.

## 32. Settings Changes

Settings changes affect future evaluation only. They do not replay missed reminders.

## 33. Off-to-On Behavior

Turning reminders back on recalculates current sources and respects the new time, cadence, quiet hours, and current state.

## 34. Timezone Changes

Preferred time remains a local wall-clock preference. Future windows recalculate in the current timezone.

## 35. Notification Centre Badges

The badge counts unread current notification cards. It does not count withdrawn, expired, resolved, dismissed, or bundled source rows separately.

## 36. Analytics Boundary

Reminder interaction may support operational debugging. It must not infer forgetfulness, waste behavior, mental health, financial responsibility, or notification effectiveness.

## 37. Food Event History Boundary

Notification settings, delivery, snooze, dismissal, and opening do not create physical Food Event History events.

## 38. Impact Ledger Boundary

Notifications do not create impact credit, money saved, waste avoided, protected food, or environmental claims.

## 39. Stale and Multi-Tab Protection

Cadence decisions, deferrals, and delivery logs carry user scope, revisions, source-set hashes, and idempotency keys.

## 40. User Isolation

Registered users use account-scoped preference and notification storage. Guest reminder settings and deferrals remain temporary session data.

## 41. Accessibility

The settings use fieldsets, legends, visible labels, programmatic warnings, textual statuses, accessible action names, and live-region announcements.

## 42. Responsive Design

Frequency choices, time controls, weekday selectors, summaries, and deferral controls stack on narrow screens without a separate mobile system.

## 43. Testing

Validation uses JavaScript syntax checks, JSON parsing, and focused static tests for cadence values, settings UI, suppression reasons, delivery windows, deferrals, badge behavior, storage isolation, and documentation.

## 44. Deferred Work

Automatic physical outcomes, guaranteed unsupported background delivery, behavioral inference, environmental calculations, and notification-effectiveness claims remain outside Step 42.
