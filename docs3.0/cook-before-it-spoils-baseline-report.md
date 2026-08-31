# Cook Before It Spoils Baseline Report

## 1. Audit Date/Env

- Audit date: 2026-08-11
- Project path: `/Users/callysu/Downloads/Chef-Nova`
- App type: static HTML, CSS, JavaScript, JSON
- Backend/database/API: none found and none added
- Git status: not available; directory is not a Git repository
- Node runtime used for validation: `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`
- Node version: `v24.14.0`

## 2. Files/Dirs Inspected

Inspected core app files:

- `index.html`
- `app.js`
- `style.css`
- `rules.js`
- `languageGuidelines.js`

Inspected data files:

- `data/recipes.json`
- `data/recipes.js`
- `data/ingredients.json`
- `data/ingredients.js`
- `data/pantry.json`
- `data/mealPlans.json`
- `data/price-estimates-cad.json`
- `data/price-estimates-cad.js`
- `data/ingredient-substitutions.json`
- `data/ingredient-substitutions.js`
- `data/users.json`

Inspected shared logic:

- `scripts/ingredient-data-shared.js`
- `scripts/price-data-shared.js`
- `scripts/cost-calculation-engine.js`
- `scripts/pantry-first-planning.js`
- `scripts/recipe-eligibility-ranking.js`
- `scripts/ingredient-substitution-shared.js`
- `scripts/validate-ingredient-data.js`
- `scripts/validate-price-data.js`

Inspected tests:

- `tests/budget-accessibility-mobile-static.test.js`
- `tests/budget-data-protection-static.test.js`
- `tests/budget-edge-case-handling-static.test.js`
- `tests/budget-planning-algorithm-static.test.js`
- `tests/budget-rescue-complete-qa.test.js`
- `tests/budget-rescue-final-acceptance-static.test.js`
- `tests/budget-rescue-form-static.test.js`
- `tests/budget-rescue-roadmap-static.test.js`
- `tests/budget-rescue-save-plan-static.test.js`
- `tests/budget-status-panel-static.test.js`
- `tests/cheaper-substitution-static.test.js`
- `tests/cost-calculation-engine.test.js`
- `tests/emergency-plan-mode-static.test.js`
- `tests/ingredient-data.test.js`
- `tests/leftover-batch-cooking-static.test.js`
- `tests/pantry-first-planning.test.js`
- `tests/pantry-first-static.test.js`
- `tests/plan-savings-explanation-static.test.js`
- `tests/planning-mode-static.test.js`
- `tests/price-confidence-static.test.js`
- `tests/price-data.test.js`
- `tests/recipe-card-cost-information-static.test.js`
- `tests/recipe-eligibility-ranking.test.js`
- `tests/recipe-eligibility-static.test.js`
- `tests/respectful-budget-messages-static.test.js`
- `tests/shopping-list-budget-upgrade-static.test.js`

Inspected existing documentation and reports:

- `docs/budget-rescue-audit.md`
- `docs/budget-rescue-architecture.md`
- `docs/budget-rescue-data-model.md`
- `docs/pantry-first-planning.md`
- `docs/recipe-eligibility-and-ranking.md`
- `docs/cost-calculation-engine.md`
- `docs/price-catalogue.md`
- `docs/leftover-and-batch-cooking.md`
- `docs/shopping-list-budget-upgrade.md`
- `docs/budget-accessibility-and-mobile.md`
- `docs/budget-rescue-complete-test-report.md`
- `co-gpt/*.md` implementation reports relevant to Pantry, planner, storage, Budget Rescue, accessibility, guest mode, and nutrition.

## 3. Commands Run

Validation commands:

```bash
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --version
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/recipe-eligibility-ranking.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8')); console.log('data/recipes.json valid')"
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/validate-ingredient-data.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/validate-price-data.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/*.js
```

Audit discovery commands:

```bash
rg --files
find . -maxdepth 3 -type f \( -name '*.html' -o -name '*.js' -o -name '*.json' -o -name '*.css' -o -name '*.md' \) | sort
rg -n "function daysUntil|checkExpiration|addPantryItem|displayPantry|suggestRecipes|loadMealPlan|saveMealPlan|displayShoppingList|leftover|batch|freezer|waste|discard|nutrition|analytics" app.js index.html data scripts tests docs co-gpt
rg -n "function loadRecipes|fetch\\(|CHEF_NOVA_RECIPES|ingredients.js|price-estimates|pantry-first|cost-calculation|recipe-eligibility|app.js" index.html app.js
```

Environment commands:

```bash
git status --short
git rev-parse --short HEAD
ls package.json
python3 -m http.server 8766
lsof -nP -iTCP:8766 -sTCP:LISTEN
```

## 4. Runtime Workflows Inspected

Source-level runtime paths inspected:

- direct `index.html` script order
- data fallback loading for `data/recipes.json`, `data/ingredients.json`, `data/price-estimates-cad.json`, and `data/ingredient-substitutions.json`
- Pantry add, display, remove, save, load, expiration status, and recipe suggestion flows
- Recipe Finder matching, filtering, allergy hiding, details modal, favorite button, and Shopping List missing-ingredient action
- Meal Planner load/save, planner display, weekly/monthly planner state, meal entry saving, deletion, generated suggestions, and Budget Rescue planning paths
- Shopping List display, filters, price summary, missing price handling, unknown Pantry quantity handling, add remainder to Pantry, remove/restore, and mark bought/needed
- Notifications add, save, filter, mark read, delete, clear, and badge update flows
- user-specific and guest-specific storage paths

Interactive browser inspection limitation:

- A local static server was requested and started, but HTTP checks from the sandbox could not connect back to the listener.
- Browser automation import was not usable from the current REPL because the Playwright import failed with: `The requested module './index.js' does not provide an export named 'default'`.
- A Node VM script-order load confirmed the app scripts can be read in sequence, but full initialization in that shim stopped on a missing shimmed browser method, `window.addEventListener`. This was a test-harness limitation, not a browser error from Chef Nova.
- Because this step is audit-only, no real user records were created or modified for runtime testing.

## 5. Current Failures

Validation failures: none in syntax, JSON parse, ingredient validation, price validation, or existing tests.

Environment limitations:

- Plain `node` was not on PATH. The bundled Node runtime was used instead.
- `package.json` is not present.
- The project folder is not a Git repository.
- Full in-app interactive browser testing was not completed during this audit because the available browser automation path failed before interaction.

Functional gaps found for Cook Before It Spoils:

- no dedicated Cook Before It Spoils page
- no dedicated rescue recommendation cards
- no rescue date-window selector
- no Pantry item edit workflow
- no visible unknown-quantity Pantry option
- no freezer action or freezer reminder
- no waste/discard/used/frozen event model
- no rescue analytics dashboard
- no scheduled expiration reminder scan

## 6. Data Quality Findings

Recipe data:

- 35 recipes are present.
- 35 recipes include structured ingredients.
- 6 recipes include batch-cooking metadata.
- 6 recipes include leftover metadata.
- 6 recipes include freezer/frozen-related text or metadata.
- Recipe categories currently include Breakfast, Brunch, Desserts, Dinner, Drinks, and Lunch.
- Recipe difficulties currently include Easy and Medium.

Ingredient data:

- 100 canonical ingredients are present.
- Ingredient validation passed.
- The Ingredient Catalogue supports aliases, categories, allergens, dietary tags, units, and structured ingredient resolution.

Price data:

- 1 price profile exists.
- 23 price entries exist.
- 23 canonical ingredients have price coverage.
- Estimate coverage is 23%.
- No active sale entries were found.
- Price validation passed.

Pantry fixture data:

- 4 starter Pantry records exist in `data/pantry.json`.
- 0 records include explicit units.
- 0 records include locations.
- 0 records include freshness date types.
- 0 records include opened status.
- 3 records have quantities that are not valid numeric values for structured planning.

Storage data:

- Registered users use user-scoped localStorage keys.
- Guests use sessionStorage.
- Cook Before It Spoils should use the existing storage helpers and avoid new shared keys.

## 7. Accessibility Findings

Existing strengths:

- skip link exists
- modal roles and labels exist
- dynamic result regions use `aria-live`
- Shopping List filters use button labels and pressed states
- Pantry and recipe suggestions have live regions
- notification cards use list semantics
- buttons have descriptive labels in many action-heavy areas
- CSS includes visible focus handling and reduced-motion support
- existing static accessibility/mobile tests passed

Needs future Cook Before It Spoils QA:

- keyboard path through rescue filters, recommendation cards, add-to-planner actions, and add-to-shopping actions
- screen-reader announcements when rescue recommendations refresh
- text labels for freshness and safety status
- modal focus return if rescue details use a modal
- no color-only communication for urgency

## 8. Mobile Findings

Existing strengths:

- app uses responsive grids and card layouts
- Pantry, Recipe Finder, Shopping List, Meal Planner, Notifications, and Budget Rescue already have mobile-oriented styles
- existing static mobile/accessibility test passed

Needs future Cook Before It Spoils QA:

- recommendation cards should stack on phones
- filters should wrap or stack without horizontal scrolling
- rescue action buttons should remain easy to tap
- missing ingredient and expiring item tags should wrap cleanly
- date-window controls should remain readable on small screens

## 9. Audit Completion Result

Audit-only result: complete.

Files created:

- `docs/cook-before-it-spoils-audit.md`
- `docs/cook-before-it-spoils-baseline-report.md`

Production files changed: none.

No backend, database, external API, new production storage key, new production data field, new page behavior, new ranking behavior, freezer workflow, waste tracking, or analytics behavior was added.

Recommended implementation direction:

Cook Before It Spoils should be implemented as a focused workflow that reuses the existing Pantry, Pantry-first planner, recipe eligibility/ranking engine, Meal Planner, Shopping List, Budget Rescue cost engine, notifications, and user/guest storage helpers.

