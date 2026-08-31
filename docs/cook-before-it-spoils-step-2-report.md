# Cook Before It Spoils Step 2 Implementation Report

## Summary

Step 2 adds `Cook Before It Spoils` as one mode inside the existing Meal Planner. Pantry, Meal Planner, Home dashboard, expiry reminders, recipe cards, and leftover summaries all open the same shared workflow through `openCookBeforeItSpoils()`.

## Inspection Results

1. Files inspected: `app.js`, `index.html`, `style.css`, `docs/cook-before-it-spoils-audit.md`, `docs/cook-before-it-spoils-baseline-report.md`, existing tests, Pantry, planner, dashboard, notification, recipe-card, and leftover render paths.
2. Step 1 audit findings verified: Meal Planner modes, Pantry attention badges, dashboard cards, notification actions, recipe-card actions, planned-leftover summaries, user storage, guest storage, and live-region helpers still match the audit.
3. Files created: `docs/cook-before-it-spoils-mode-entry-points.md`, `docs/cook-before-it-spoils-step-2-report.md`, `tests/cook-before-it-spoils-step-2-static.test.js`.
4. Files changed: `app.js`, `style.css`.
5. Existing planning-mode source reused: `PLANNING_MODES`, `PLANNING_MODE_LABELS`, `normalizePlanningMode()`, and the current Planning Mode radio group.
6. Canonical mode value: `cook-before-it-spoils`.
7. Planning-mode selector changes: order is Standard Meal Plan, Budget Rescue, Cook Before It Spoils, Emergency Plan.
8. Shared workflow component: `renderCookBeforeItSpoilsWorkflow()`.
9. Shared workflow-opener API: `openCookBeforeItSpoils(context)`.
10. Entry-context structure: `source`, `focusIngredientIds`, `focusPantryItemIds`, `focusRecipeId`, `focusLeftoverIds`, `focusReminderId`, `returnTarget`, `sourceRevisions`, and `staleMessages`.
11. Attention-selector source: `selectPantryItemsNeedingAttention()`.
12. Attention-count semantics: Pantry item records using existing `Expired`, `Expires today`, and `Expires soon` status logic.
13. Singular wording: `1 Pantry ingredient needs attention.`
14. Plural wording: `N Pantry ingredients need attention.`
15. Zero-count wording: `No Pantry ingredients currently need attention.`

## Entry Points

16. Pantry entry point: added summary action in the existing Pantry summary area.
17. Meal Planner entry point: selecting the planning mode opens the shared workflow with `source: "meal-planner"`.
18. Dashboard entry point: added a Home dashboard summary card using the same attention selector.
19. Expiry-reminder entry point: new expiring-soon notifications use `Cook Before It Spoils` and pass Pantry item context.
20. Recipe-card entry point: recipe cards and recipe details include `Use Food That Needs Attention`.
21. Leftover-reminder entry point: planned-leftover summaries include a Cook Before It Spoils action when a stable leftover ID exists.
22. Shared-workflow confirmation: every entry point calls `openCookBeforeItSpoils()` or a thin wrapper that calls it.
23. Contextual-focus behavior: workflow heading receives focus; focused Pantry, recipe, or leftover context is displayed when valid.
24. Return-navigation behavior: `returnTarget` returns users to Pantry, Home, Notifications, Recipe Details, or Planner when available.

## Safety and State

25. Stale-Pantry behavior: invalid Pantry IDs are removed and a stale message is shown.
26. Stale-reminder behavior: stale reminder context falls back to current attention items.
27. Stale-recipe behavior: missing recipe context is ignored with a stale message.
28. Stale-leftover behavior: unavailable leftover context shows a fallback message and current attention list.
29. Data-mutation protection: opening the mode does not edit Pantry, notifications, leftovers, calendar, plans, or Shopping List.
30. Hard-filter protection: recipe context uses canonical IDs only and does not approve, schedule, or bypass allergy/dietary checks.
31. Draft-preservation behavior: Budget Rescue and Emergency draft data remain in `planningModeInputs`; Cook Before It Spoils uses temporary navigation context.
32. Registered-user isolation: existing user-scoped storage is reused.
33. Guest behavior: existing guest session storage is reused; no persistent guest food-rescue profile was added.
34. Storage changes: no new permanent storage key.
35. Schema-version changes: none.

## Accessibility and Layout

36. Accessibility work: reused the existing accessible Planning Mode fieldset and radio controls.
37. Live-region behavior: `announcePolite()` announces the workflow opening once.
38. Focus-management behavior: the workflow heading receives focus after navigation.
39. Responsive-design work: workflow cards use desktop, tablet, and mobile grids.

## Testing

40. Tests added: `tests/cook-before-it-spoils-step-2-static.test.js`.
41. Planning-mode tests: static test validates canonical value and selector order.
42. Pantry-entry tests: static test validates Pantry entry wiring and shared selector.
43. Dashboard-entry tests: static test validates dashboard entry wiring.
44. Reminder-entry tests: static test validates notification action path opens before marking read.
45. Recipe-card-entry tests: static test validates recipe action wiring and canonical ingredient matching.
46. Leftover-entry tests: static test validates leftover action wiring.
47. Stale-context tests: static test validates stale-message and normalization hooks.
48. User-isolation tests: static guard confirms no new cross-user storage key.
49. Accessibility tests: static source checks plus reused fieldset/live-region/focus patterns.
50. Mobile tests: static CSS checks for responsive workflow styles.

## Commands Run

51. Commands run: syntax checks, all `tests/*.js`, ingredient validation, price validation, and JSON parsing.
52. Build result: no build command or `package.json` exists in this static app.
53. Lint result: no lint command or `package.json` exists.
54. Type-check result: no type-check command or TypeScript project exists.
55. Unit-test result: all existing plain Node tests passed.
56. Integration-test result: existing integration-style Node tests passed.
57. Browser-test result: not run; no browser test framework is available in the repository.
58. Accessibility-test result: static accessibility source checks passed; screen-reader/manual testing not run.
59. Responsive-test result: static responsive CSS checks passed; physical viewport testing not run.
60. Data-validation result: `data/recipes.json` parsed successfully; ingredient and price validators passed.
61. Pre-existing failures: none in available automated checks.
62. New defects found: none in automated validation.
63. Defects fixed: none after validation.
64. Remaining issues: manual browser, screen-reader, forced-colors, and physical mobile checks remain manual.
65. Functionality intentionally deferred: rescue ranking, new date intelligence, freezer transfer, waste recording, analytics, portion optimization, and new Shopping List calculations.
66. Step 2 completion status: complete for the requested shared mode and entry architecture.

## Required Guardrail Results

67. All six entry points open the same shared workflow: confirmed.
68. Attention counts are dynamically derived: confirmed.
69. Opening the mode does not modify Pantry, reminders, leftovers, calendar, saved plans, or Shopping List: confirmed by implementation path and static guard.
70. Recipe-card entry does not bypass allergies or required dietary restrictions: confirmed; it only passes context.
71. Registered-user data remains isolated: confirmed through existing user-scoped storage.
72. Guest context remains temporary: confirmed through in-memory context and existing guest session behavior.
73. Second Pantry created: 0.
74. Second Recipe Database created: 0.
75. Separate food-rescue Shopping List created: 0.
76. Separate meal calendar created: 0.
77. Duplicate household profile created: 0.
78. Duplicate Price Catalogue, Cost Engine, or leftover system created: 0.
79. Date-intelligence changes, rescue ranking, freezer workflow, waste diary, or analytics dashboard introduced in Step 2: 0.
80. Recommended starting point for Step 3: build the food-rescue recipe recommendation logic on top of `openCookBeforeItSpoils()` and `selectPantryItemsNeedingAttention()` without adding new entry workflows.

## Required Numeric Results

- Separate Cook Before It Spoils workflows created: 0
- Hard-coded attention counts used: 0
- Pantry records modified by opening the mode: 0
- Reminders dismissed merely by opening the mode: 0
- Leftovers consumed merely by opening the mode: 0
- Recipes scheduled merely by opening the mode: 0
- Cross-user context records displayed: 0
- Hidden mode controls left in the tab order: 0
- Entry points bypassing the shared workflow opener: 0

## Validation Evidence

- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js` passed.
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js` passed.
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js` passed.
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/ingredient-data-shared.js` passed.
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/price-data-shared.js` passed.
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/cost-calculation-engine.js` passed.
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/pantry-first-planning.js` passed.
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/recipe-eligibility-ranking.js` passed.
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/ingredient-substitution-shared.js` passed.
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check tests/cook-before-it-spoils-step-2-static.test.js` passed.
- Running all `tests/*.js` passed.
- `scripts/validate-ingredient-data.js` passed.
- `scripts/validate-price-data.js` passed.
- `data/recipes.json` parsed successfully.
