# Chef Nova Accessible Priority Status

## 1. Purpose

Chef Nova communicates food priority with visible text, semantic markup, and clear announcements. Priority is never communicated by color, motion, icon, or hidden labels alone.

## 2. Existing Systems Reused

Step 44 reuses the Use-First Priority Engine, Food-Safety Guardrails, Pantry schema, reservations, Date Intelligence, Unit Registry-style formatting helpers, localization path, and central live-region helpers already in `app.js`.

## 3. Priority Versus Safety

Priority answers when an item needs planning attention. Safety decides whether the item can be used for a proposed action.

## 4. Priority Versus Planning State

Planning state is separate from priority level. Supported states are Unplanned, Fully Planned, Partially Planned, Review Required, Safety Excluded, and Resolved.

## 5. Priority Levels

Accessible priority levels are Very High, High, Medium, Low, and None. Existing `monitor` results map to None.

## 6. Priority Timeframes

Default timeframes are today, within 2 days, within 3 to 5 days, and no immediate action. Item-specific Priority Engine timeframes can override the default label.

## 7. Visible Text Requirement

Every priority status includes visible text such as “Very high priority — action recommended today.” Color and borders only support the text.

## 8. ARIA Label Guidance

Chef Nova does not place the only complete priority meaning inside `aria-label` on a generic span. Full meaning appears in visible semantic content, with screen-reader text only as a supplement.

## 9. Semantic Status Markup

Priority cards use headings, paragraphs, ordered or unordered lists, real buttons, and disclosure controls. Static status text is not added to the keyboard tab order.

## 10. Priority Presentation Model

The model includes version, ID, user scope, source, item, priority level, timeframe, planning state, safety state, quantity, date information, action summary, visible text, accessible text, localization metadata, source revisions, and timestamp.

## 11. Shared Priority Status Component

`renderPriorityStatusComponent()` renders the same presentation model in compact and expanded contexts. Pantry, Use These First, print, and exports use the same contract.

## 12. Quantity Confidence

Measured quantities are spoken directly. Estimated quantities include “approximately.” Unknown quantities remain unknown and are not represented as zero.

## 13. Unit Formatting

Visible text may use abbreviations such as `80 g`. Accessible text uses spoken units such as “eighty grams.”

## 14. Precise Date Language

Best-before, expiration, app-estimated freshness, leftover timelines, and unknown date types keep their precise labels.

## 15. Reservations

Fully planned items show Already Planned. Partially planned items show reserved quantity and unreserved quantity separately.

## 16. Review Required

Review Required appears when Chef Nova needs quantity, date type, storage, reservation, or outcome information before recommending an action.

## 17. Safety Exclusions

Safety-excluded food uses direct wording such as “Not eligible for recipe planning” and “The recorded expiration date has passed.”

## 18. Use These First Semantics

The Use These First panel keeps semantic headings and ordered lists for eligible priority items.

## 19. Filters

Priority filters are buttons with visible counts and `aria-pressed` selected state.

## 20. Visual and DOM Order

The panel renders from the sorted priority model, so visual order and DOM reading order match.

## 21. Focus Preservation

Static statuses do not take focus. Disclosure buttons preserve focus when opened or closed.

## 22. Live Regions

Priority announcements use one central polite announcement path through the existing live-region helper.

## 23. Announcement Batching

User-initiated Pantry updates produce one concise announcement with item, quantity, and material priority changes.

## 24. Announcement Deduplication

Announcements use stable keys based on source ID, source revision, and change type.

## 25. Initial Page Load

Initial rendering exposes semantic status content in reading order. It does not announce every priority item automatically.

## 26. Icons and Tooltips

Icons and tooltips may be supplemental only. Essential priority meaning stays in text.

## 27. High Contrast and Forced Colors

Forced-color rules preserve text, borders, selected filters, focus, Review Required, and Safety Excluded states.

## 28. Large Text and Zoom

Priority labels, timeframes, quantities, and buttons wrap. Text is not clipped or replaced by color-only badges.

## 29. Mobile Layout

Mobile cards stack food name, priority status, planning state, quantity, date information, action summary, and buttons.

## 30. Reduced Motion

Priority status does not pulse, shake, animate urgency, or animate live-region text. Reduced-motion rules remove transitions.

## 31. Notification Integration

Food-rescue notifications keep the same priority wording. Notification settings change delivery, not in-app priority semantics.

## 32. Shopping List Integration

Shopping List priority references must include visible labels, available quantity, and planning state.

## 33. Calendar Integration

Calendar and reservation views must distinguish reserved and unreserved quantities.

## 34. Recipe Card Integration

Recipe cards may describe planned food-rescue use, but planned use is not confirmed use.

## 35. Print and Export

Printed views include textual priority labels. Structured exports include priority level, label, timeframe, quantity confidence, planning state, date type, and safety status.

## 36. Localization

Priority localization preserves level, timeframe, reserved, remaining, available, approximate, review, and safety-excluded meaning.

## 37. Stale and Multi-Tab Protection

Presentation IDs and announcements include source revisions so stale actions can be reviewed before use.

## 38. User Isolation

Presentation state uses the active user scope. Guest priority presentation remains temporary.

## 39. Testing

Validation uses syntax checks, static Step 44 checks, existing priority panel tests, food-safety tests, notification tests, and responsive CSS inspections.

## 40. Deferred Work

Automatic recipe selection, automatic focus movement to priority items, automatic freezing, automatic notification delivery, and automatic impact recognition remain outside Step 44.
