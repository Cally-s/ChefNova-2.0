# Budget Rescue Architecture

Budget Rescue is a planning mode inside the existing Chef Nova single-page app. It does not create a separate planner, Pantry, Shopping List, calendar, or save workflow.

## Existing Systems Reused

- Meal Planner: weekly and monthly views in `app.js` and `index.html`.
- Calendar: `mealPlans.calendar["YYYY-MM-DD"]`.
- Pantry: `state.pantry`, user-scoped localStorage, and guest sessionStorage.
- Shopping List: existing Shopping List render, filters, price editor, and purchased-item behavior.
- Save Plan: existing suggested-plan review and confirmation flow.
- Replace Meal: existing replacement modal and review state.
- Recipe Cards: shared cost summary and breakdown UI.
- User profile: allergies, dietary preference, foods to avoid, preferred foods, account state, guest mode.
- Data: `data/recipes.json`, `data/recipes.js`, `data/ingredients.json`, `data/price-estimates-cad.json`, and JS fallbacks for direct `index.html` use.

## Core Services

| Service | Source | Responsibility |
|---|---|---|
| Ingredient data | `scripts/ingredient-data-shared.js` | Canonical ingredient IDs, aliases, validation support. |
| Price data | `scripts/price-data-shared.js` | Price entry validation, source selection, sale handling, resolver. |
| Cost Engine | `scripts/cost-calculation-engine.js` | Ingredient-use cost, recipe value, package purchase cost, shared purchase groups, weekly summaries. |
| Pantry-first planning | `scripts/pantry-first-planning.js` | Temporary Pantry inventory, allocation, use-soon ordering, non-mutating simulation. |
| Eligibility engine | `scripts/recipe-eligibility-ranking.js` | Hard filters for allergies, dietary restrictions, appliances, time, servings, and unavailable ingredients. |
| Substitution data | `scripts/ingredient-substitution-shared.js` | Canonical substitution rules and variant snapshots. |
| App orchestration | `app.js` | Planner mode UI, generation, review, save, replace, shopping integration, status display. |

## Flow

1. User selects Standard, Budget Rescue, or Emergency Plan in the existing Meal Planner.
2. Budget Rescue captures budget settings and reuses profile, Pantry, preferences, and price source settings.
3. Hard eligibility filters run before cost scoring.
4. Pantry-first simulation copies Pantry state and allocates quantities without mutating real Pantry data.
5. Cost Engine calculates recipe ingredient-use values and weekly purchase groups.
6. Budget Planning Algorithm builds a deterministic preview.
7. Budget Status, Recipe Cards, Shopping List, and explanations render shared service results.
8. The preview remains unsaved until the existing Save Plan flow is confirmed.
9. Save Plan writes meals to the existing calendar and stores versioned metadata.

## Safety Boundaries

- Allergies and required dietary restrictions are never relaxed.
- Missing prices block complete budget claims.
- Unknown Pantry quantities block Pantry coverage assumptions.
- Unavailable appliances and unverified appliance metadata block automatic use when appliance restrictions are active.
- Budget warnings may be overridden only for safe choices; hard filters cannot be overridden.

## Direct File Support

Chef Nova still works by opening `index.html` directly. Data files have JS fallbacks loaded before `app.js`.
