# Chef Nova Waste Diary Pattern Tests

## 1. Purpose

Step 62 validates Waste Diary pattern detection for repeated spinach discard entries. The tests confirm evidence, respectful wording, optional suggestions, scoped data, and no automatic food or settings changes.

## 2. Fixed Test Context

The automated tests use August 15, 2026 as the reference date, America/Toronto as the timezone, and the reviewed 60-day repeated-food policy. The window follows the repository contract: local-date, inclusive rolling windows.

## 3. Required Events

The baseline uses three confirmed, effective, non-duplicate fresh spinach discard events:

- June 18, 2026: Baby spinach, 180 g, spoiled before use, $2.40 CAD.
- July 9, 2026: Baby spinach, 180 g, bought too much, $2.50 CAD.
- August 6, 2026: Baby spinach, 180 g, forgot it was available, $2.90 CAD.

## 4. Qualifying-Event Rules

An event qualifies only when it is confirmed, effective, related to food discarded, inside the 60-day local window, same user scoped, non-duplicate, not voided, not superseded, and part of the reviewed compatible fresh-spinach pattern group.

Drafts, cancelled forms, duplicate retries, migration-review records, future events, and non-food analytics are excluded.

## 5. Pattern Threshold

Three qualifying related events trigger the Step 62 repeated spinach insight. One or two events remain neutral and cannot produce a strong repeated, frequent, habitual, or established-pattern claim.

## 6. One- and Two-Event Behaviour

One event may be described as a single recorded discard entry. Two events may be described as two recent entries.

Neither state may use words such as frequently, often, habit, recurring problem, pattern established, or always.

## 7. Pattern Groups

Chef Nova groups only reviewed compatible ingredient identities. Baby spinach, fresh spinach, and spinach leaves may group as fresh spinach when the catalogue maps them to the same pattern group and food form.

Fresh raw spinach remains separate from frozen spinach, cooked spinach, canned spinach, spinach dip, prepared spinach pasta, and leftover spinach soup unless a reviewed policy explicitly says otherwise.

## 8. Evidence

Evidence must show the current qualifying diary entries in stable chronological order: June 18, July 9, and August 6. Review Diary Entries opens the existing Waste Diary filtered by exact event IDs, not by display-name search.

Structured evidence keeps event ID, user scope, pattern group, local date, quantity representation, quantity confidence, price confidence, reason, event revision, correction status, and deduplication status.

## 9. Quantity Aggregation

The baseline quantity total is:

```text
180 g + 180 g + 180 g = 540 g
```

Unknown quantities are not displayed as 0. If one of three entries has unknown quantity, the displayed total is at least the known supported quantity, with coverage such as 2 of 3 entries.

## 10. Cost Aggregation

The baseline estimated value is:

```text
$2.40 + $2.50 + $2.90 = $7.80 CAD
```

The confidence is mixed because the fixture uses saved-store, user-entered, and Chef Nova estimate sources. Missing prices are not displayed as $0; coverage must show when only part of the evidence has price data.

## 11. Respectful Language

The expected factual wording is:

```text
You recorded spinach as discarded 3 times during the last 60 days.
```

Chef Nova must not blame, shame, diagnose, or criticize the user. Pattern text, accessible labels, notifications, print output, and exports stay factual.

## 12. Suggestions

The baseline suggestion IDs are:

- prefer-smaller-quantities
- remind-earlier
- create-freeze-half-routine
- show-rescue-recipes

Freeze-Half appears only when reviewed freezer guidance supports fresh spinach and the current source is eligible. Rescue recipes remain recommendation previews and must reapply safety, allergy, dietary, appliance, and time filters.

## 13. No Automatic Changes

Displaying the insight applies no package preference, reminder timing, freezing routine, rescue recipe, meal reservation, Calendar entry, Pantry quantity change, Shopping List change, Waste Diary event, Food Event History outcome, or Impact Ledger credit.

Every corrective action requires an explicit confirmation flow.

## 14. Corrections and Voiding

Voiding or correcting one of the three events recalculates the active evidence. The original event stays in audit history but no longer appears as active evidence for the spinach insight.

If the August 6 spinach entry is corrected to kale, spinach drops to two qualifying events and kale receives one current qualifying event.

## 15. Deduplication

Duplicate retries are counted once by request or deduplication key. Same-day events count only when they are truly separate confirmed events from distinct packages or requests.

The tests assert that a duplicate record does not add count, quantity, value, suggestions, cards, or notifications.

## 16. Time Windows

The 60-day window is evaluated with local dates in America/Toronto. Events exactly on the documented inclusive boundary qualify; events immediately outside the boundary do not.

Future-dated events are excluded and may require review. They are not silently moved into the current window.

## 17. Notifications

Pattern notifications are bundled. They are not sent once per evidence event or once per suggestion.

In-app text may name the pattern. External preview text stays privacy safe and does not expose costs, quantities, household behaviour, or diary details by default.

## 18. Food Event History

Pattern detection is analytics. It does not create Food Discarded, Quantity Used, Frozen, Consumed, Donated, Shared, Purchased, or Meal Completed events.

The three discard events already exist; the pattern engine must not recreate them.

## 19. Impact Ledger

Pattern detection creates no Ingredient Rescued, Food Waste Avoided, Money Saved, Food Protected for Later Use, Leftover Reused, Cooking Session Avoided, or environmental-impact entries.

Displaying $7.80 is historical discarded-value context, not future savings.

## 20. Stale and Policy-Version Protection

Insights carry source revisions, policy version, pattern-group version, local date, timezone, and evidence revision. Corrections, policy changes, and stale previews force recalculation before display or action confirmation.

Old-client aggregate counts are not authoritative.

## 21. User Isolation

Registered users have isolated Waste Diary events, insights, costs, notifications, and settings. Guest pattern state remains temporary and is not automatically merged into a registered account.

Account switching clears active insight, evidence, and setting drafts.

## 22. Accessibility

Manual review should verify:

- Spinach Pattern is a visible heading.
- The event count and 60-day window are visible.
- Evidence uses a semantic list.
- Review Diary Entries and Why am I seeing this are keyboard accessible.
- Suggestion controls have specific accessible names.
- Live-region messages announce threshold changes once.

## 23. Mobile and Visual Modes

Manual responsive checks cover 320 CSS pixels, 390 CSS pixels, and 768 CSS pixels. Metrics, dates, reasons, and action buttons must wrap without horizontal body overflow.

High-contrast mode must preserve textual status and visible focus. Reduced-motion mode must avoid pulsing, shaking, dramatic card animation, and continuous counter animation.

## 24. Print and Export

Print output preserves the pattern heading, 60-day window, count, 540 g estimate, $7.80 estimated value, all three evidence dates, and respectful suggestions.

Authorized structured export preserves status, claim strength, window, evidence IDs, quantity confidence, value confidence, suggestions, and `automaticChangesApplied: false`.

## 25. Test Isolation

The Step 62 tests use isolated user, guest, event, request, package, and insight IDs. They do not read real user storage, write fixture data to production storage, send external notifications, or clear global storage.

## 26. Commands

Run these validations for Step 62:

```text
node --check app.js
node --check rules.js
node --check tests/cook-before-it-spoils-step-62-waste-diary-patterns.test.js
node tests/cook-before-it-spoils-step-62-waste-diary-patterns.test.js
node tests/cook-before-it-spoils-step-26-waste-diary-static.test.js
node tests/cook-before-it-spoils-step-27-pantry-linked-waste-diary-static.test.js
node tests/cook-before-it-spoils-step-28-estimated-discarded-cost-static.test.js
node tests/cook-before-it-spoils-step-30-conservative-pattern-detection-static.test.js
node tests/cook-before-it-spoils-step-31-actionable-pattern-insights-static.test.js
node tests/cook-before-it-spoils-step-32-explain-insight-evidence-static.test.js
node tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js
node tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js
node tests/cook-before-it-spoils-step-41-notification-levels-static.test.js
node tests/cook-before-it-spoils-step-42-notification-fatigue-static.test.js
node tests/cook-before-it-spoils-step-43-respectful-language-static.test.js
node tests/cook-before-it-spoils-step-60-freezer-actions.test.js
```
