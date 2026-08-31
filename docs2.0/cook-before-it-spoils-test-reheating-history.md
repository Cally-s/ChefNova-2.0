# Cook Before It Spoils Step 59: Reheating History Tests

## 1. Purpose

These tests verify that Chef Nova preserves leftover reheating history and blocks unsafe second-reheat recommendations. A leftover that has already been reheated once must not appear as an ordinary reheat option or as a heated transformation that requires another reheat.

## 2. Fixed Timeline

- Time zone: America/Toronto
- Original cooking date: Monday, August 10, 2026 at 6:00 PM
- Refrigeration date: Monday, August 10, 2026 at 7:00 PM
- First reheating date: Tuesday, August 11, 2026 at 12:15 PM
- Evaluation date: Wednesday, August 12, 2026 at noon

## 3. Source Meal and Leftover

The source meal fixture is `reheat-test-source-meal` for user `reheat-test-user`, dated `2026-08-10`, using recipe `reheat-test-source-recipe`, Vegetable Soup, with status `completed`.

The pre-reheat leftover fixture is `reheat-test-leftover-batch`. It has 2 servings remaining, `originalCookedAt` set to `2026-08-10T18:00:00-04:00`, `refrigeratedAt` set to `2026-08-10T19:00:00-04:00`, `reheatCount` set to 0, and no history events.

The post-reheat segment fixture is `reheat-test-leftover-segment-1`. It belongs to `reheat-test-leftover-batch`, has 2 servings, `lastReheatedAt` set to `2026-08-11T12:15:00-04:00`, `reheatCount` set to 1, event IDs containing `reheat-event-1`, and status `reheated-outcome-review-required`.

## 4. Reheat Events

The confirmed reheat event fixture is `reheat-event-1`.

- User: `reheat-test-user`
- Source ID: `reheat-test-leftover-batch`
- Source segment ID: `reheat-test-leftover-segment-1`
- Target meal ID: `reheat-test-tuesday-lunch`
- Event type: `reheat-completed`
- Occurred at: `2026-08-11T12:15:00-04:00`
- Method: microwave
- Quantity: 2 servings
- Measured temperature: 75 C
- Status: confirmed
- Request ID: `reheat-request-1`

## 5. Effective Reheat Count

Effective reheat count comes from confirmed Food Event History entries scoped to the same user, parent batch, physical segment, and request. The required confirmed reheat count is 1.

Missing event history must require review. It must not become a false zero.

## 6. Reheating Policy

The policy fixture is `leftovers-single-reheat-v1`, version 1.

- Maximum confirmed reheats: 1
- Blocked actions: `reheat`, `use-in-heated-recipe`, `heated-leftover-transformation`, `reserve-for-heated-meal`

## 7. Action-Specific Eligibility

After the first confirmed reheat, these results are required:

- Another ordinary reheat recommendation is absent.
- Heated transformation requiring another reheat is not selectable.
- Heated recipe use is blocked.
- Reserving the segment for a heated meal is blocked.
- No Reheat Anyway or accept-risk bypass is available.

Cold transformations that do not require reheating may continue only if all other food-safety and timeline checks pass.

## 8. History Display

The leftover history display must show:

- Original cooking date: Monday, August 10, 2026
- Refrigeration date: Monday, August 10, 2026 at 7:00 PM
- Last reheated date: Tuesday, August 11, 2026
- Method: microwave
- Reheat count: 1 confirmed reheat
- Policy result: reheat limit reached

## 9. Preview Versus Confirmation

Recommendation previews must not create reheat events. Scheduling a meal must not create reheat events. Opening Start Cooking must not create reheat events. Only explicit confirmation that reheating happened may create `reheat-completed`.

- Reheat events created during recommendation preview: 0
- Reheat events created during scheduling: 0
- Reheat events created when Start Cooking opens: 0

## 10. No Accidental Reset

Generic edits, quantity edits, date edits, storage edits, recipe transformations, meal cancellations, app reloads, migrations, and partial updates must not reset confirmed reheat history.

## 11. Explicit Correction

The only acceptable way to reduce an effective reheat count is an explicit correction or review action that marks the original event as corrected. The correction must preserve audit history.

## 12. Direct Routes and Commands

Direct links, stale buttons, hidden commands, and console-triggered command paths must call the same eligibility checks. Hidden command bypasses accepted: 0.

## 13. Partial Batches

Partial reheats apply only to the affected physical segment. A reheated child segment keeps count 1. An unreheated remainder keeps count 0.

## 14. Timeline Preservation

The original cooked date remains Monday, August 10, 2026. The first reheated date remains Tuesday, August 11, 2026. Reheating does not reset storage age or safety deadline.

## 15. Persistence and Migration

Reloads, JSON persistence, and migrations must preserve reheat events, segment IDs, source batch IDs, and cached display fields. Old clients must not overwrite confirmed history with zero.

## 16. Recipe and Transformation Filters

Recipe and transformation filters must exclude heated methods after the limit is reached. They must keep ingredient matching, allergies, dietary filters, cooking time, and priority scoring intact.

## 17. Shopping List and Budget

Blocked reheating attempts must not add shopping items, duplicate groceries, adjust budget estimates, or claim rescued food.

## 18. Priority and FEFO

Priority ordering may still display the leftover as a safety-review item, but it must not rank it as a cookable reheat recommendation.

## 19. Notifications

Blocked actions may show a warning or informational notification. Notifications must not offer bypass wording or create physical history events.

## 20. Food Event History

Blocked attempts create no physical Food Event History events. Confirmed first reheat creates exactly one event. Duplicate command retry creates zero duplicate events.

## 21. Impact Ledger

Blocked attempts create no Impact Ledger entries. Recommendation preview, scheduling, and Start Cooking also create no rescue-impact credit.

## 22. Idempotency and Multi-Tab Safety

The event request ID `reheat-request-1` must dedupe retries. Multi-tab attempts must not create a second confirmed reheat.

## 23. User Isolation

Reheat history is isolated by user, item, package, meal, and plan. Cross-user reheating histories exposed: 0.

## 24. Accessibility

Screen-reader text should include the original cooked date, last reheated date, reheat count, and blocked status. Controls must remain keyboard reachable.

## 25. Mobile and Visual Modes

Mobile, high-contrast, and reduced-motion views should preserve the same visible status, dates, and blocked actions.

## 26. Print and Export

Print and export output should include the preserved original cooking date, last reheated date, reheat count, and blocked reheating status.

## 27. Test Isolation

The test uses fixed IDs, fixed timestamps, and isolated user scopes. It must not rely on real localStorage, sessionStorage, the current date, backend services, or external APIs.

## 28. Commands

Run these checks:

```bash
node --check app.js
node --check rules.js
node --check tests/cook-before-it-spoils-step-59-reheating-history.test.js
node tests/cook-before-it-spoils-step-59-reheating-history.test.js
```
