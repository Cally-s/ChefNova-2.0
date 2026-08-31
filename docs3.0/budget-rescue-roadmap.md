# Chef Nova Budget Rescue Roadmap

This roadmap tracks the phased Budget Rescue Meal Planner work. Budget Rescue is implemented inside the existing Chef Nova Meal Planner and reuses the existing Pantry, Shopping List, Meal Calendar, Save Plan workflow, Replace Meal workflow, Recipe Cards, account storage, allergy profile, dietary profile, Price Editor, Cost Engine, Price Confidence system, and local JSON data.

Focused documents:

- Step 1 audit: `docs/budget-rescue-audit.md`
- Planning modes and form: `docs/budget-planning-report.md`
- Ingredient data: `docs/ingredient-data-schema.md`
- Price catalogue: `docs/price-catalogue.md`
- Cost engine: `docs/cost-calculation-engine.md`
- Price confidence: `docs/price-confidence-protection.md`
- Pantry-first planning: `docs/pantry-first-planning.md`
- Budget planning algorithm: `docs/budget-planning-algorithm.md`
- Leftovers and batch cooking: `docs/leftover-and-batch-cooking.md`
- Cheaper substitutions: `docs/cheaper-substitution-system.md`
- Budget Status: `docs/budget-status-panel.md`
- Recipe-card costs: `docs/recipe-card-cost-information.md`
- Shopping List budget upgrade: `docs/shopping-list-budget-upgrade.md`
- Emergency Plan: `docs/emergency-plan-mode.md`
- Save Plan integration: `docs/budget-rescue-save-plan.md`
- Data protection: `docs/budget-data-protection.md`
- Edge cases: `docs/budget-edge-case-handling.md`
- Accessibility and mobile: `docs/budget-accessibility-and-mobile.md`
- Complete QA plan: `docs/budget-rescue-complete-test-plan.md`
- Complete QA report: `docs/budget-rescue-complete-test-report.md`

## Non-Negotiable Rules

- No duplicate Meal Planner, Pantry, Shopping List, Meal Calendar, Save Plan workflow, Replace Meal workflow, Cost Engine, Price Confidence system, or recipe database.
- Allergies and required dietary restrictions are hard exclusions.
- Budget, Pantry coverage, leftovers, sales, substitutions, and preference scores never override hard requirements.
- Money is stored as integer cents.
- Missing money values use `null`, not `0`.
- Missing prices are never treated as free.
- Unknown Pantry quantities are never assumed sufficient.
- Pantry is not permanently deducted during preview.
- Shopping List items are not marked purchased when a plan is generated or saved.
- Package remainders are not added to Pantry automatically.
- Generated plans remain previews until the existing Save Plan action is used.
- Sorting and tie-breaking are deterministic.
- Accessibility, labels, and responsive behavior are maintained throughout every phase.

## Phase 1: Core Budget MVP

Goal: create a usable, safe Budget Rescue workflow.

Status: complete.

Implemented:

- Architecture audit.
- Budget Rescue mode in the existing planner.
- Budget input form with CAD, price cushion, household, days, meals, appliances, cooking time, and price source.
- Structured ingredient data and canonical Ingredient Catalogue.
- Local Price Catalogue and price resolver.
- Recipe ingredient-use costs, known subtotals, total recipe cost, and cost per serving.
- Pantry-first missing quantity simulation.
- Hard recipe filters for allergens, dietary restrictions, appliances, cooking time, servings, and mandatory ingredient availability.
- Budget Status panel.
- Shopping List budget quantities and price status.
- Respectful over-budget language.
- Recipe-card cost summaries and cost breakdowns.

Completion gate: met.

## Phase 2: Better Planning

Goal: authoritative package-aware and shared-plan calculations.

Status: complete.

Implemented:

- Fixed-package, count, unit-rate, surplus, unknown package, and incompatible-unit calculations.
- Shared ingredient aggregation before purchase calculation.
- Planned leftovers and batch metadata.
- Price Confidence states and coverage.
- User-scoped store price profiles and guest temporary prices.
- Deterministic Budget Planning Algorithm and repair ordering.
- Budget Status and Shopping List reconciliation with the Cost Engine.

Completion gate: met.

## Phase 3: Emergency and Substitutions

Goal: Emergency Plan and dynamic substitution system.

Status: complete.

Implemented:

- Emergency Plan as a mode inside the existing Meal Planner.
- Deterministic natural-language budget/date extraction for examples such as `I have $25 until Friday.`
- Interpretation preview before generation.
- Ambiguous input protection.
- Emergency priority ordering.
- Canonical substitution database.
- Dynamic before/after savings.
- One-click substitution application with recalculation and undo.

Completion gate: met.

## Phase 4: Final Integration and Polish

Goal: persistence, editing, summaries, explanations, migration, accessibility, mobile support, and complete testing.

Status: repository-level automated QA complete; manual screen-reader, physical-device, zoom, forced-color, and print-preview checks remain documented as not run.

Implemented:

- Existing Save Plan and `mealPlans.calendar["YYYY-MM-DD"]` integration.
- Replace Meal recalculation and over-budget warnings.
- Weekly Budget Status reuse.
- Plan-savings explanation.
- Non-destructive data migration and protection.
- Centralized edge-case handling.
- Accessibility and mobile support.
- Complete automated QA suite using the available repository tooling.

Completion gate: met for available repository tooling. Manual assistive-technology/device checks are deferred until the required environments are available.
