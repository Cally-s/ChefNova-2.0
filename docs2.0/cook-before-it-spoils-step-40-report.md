# Step 40 Implementation Report

## Goal

Integrate safe Cook Before It Spoils priorities into the existing Emergency Plan mode without creating duplicate systems or relaxing safety requirements.

## Files Inspected

- `app.js`
- `style.css`
- `docs/budget-rescue-audit.md`
- `docs/budget-rescue-save-plan.md`
- `docs/cook-before-it-spoils-food-safety-guardrails.md`
- `docs/cook-before-it-spoils-use-first-priority-engine.md`
- `docs/cook-before-it-spoils-pantry-item-schema.md`
- `docs/cook-before-it-spoils-leftover-inventory.md`
- `docs/cook-before-it-spoils-freezer-inventory.md`
- `docs/cook-before-it-spoils-shopping-list-integration.md`
- `docs/cook-before-it-spoils-meal-calendar-reservations.md`
- `docs/cook-before-it-spoils-impact-ledger.md`
- `docs/cook-before-it-spoils-responsible-impact-claims.md`

## Existing Sources of Truth

- Meal Planner: existing `state.mealPlans`, weekly planner, monthly Calendar, and suggested-plan review flow.
- Emergency Plan: existing `PLANNING_MODES.EMERGENCY` inside the Meal Planner.
- Natural-language interpreter: existing `parseEmergencyPlanRequest()`.
- Date resolver: existing `getEmergencyLocalDateString()`, `resolveEmergencyWeekdayDate()`, and `parseEmergencyDatePhrase()`.
- Household profile: existing Budget Rescue household fields.
- Pantry: existing `state.pantry` and Pantry storage helpers.
- Leftovers: existing prepared-leftover Pantry records.
- Freezer Inventory: existing freezer view over Pantry.
- Reservations: existing Pantry item `reservations` arrays and Step 39 helpers.
- Hard filters: existing `evaluateRecipeForCurrentRequirements()`.
- Food-Safety Guardrails: existing `getFoodSafetyGuardrailForPantryItem()`.
- Priority Engine: existing Use-First Priority Engine.
- Shopping List: existing Shopping List and Step 38 purchase-group integration.
- Price Catalogue and Cost Engine: existing Budget Rescue price and cost modules.
- Calendar: existing Meal Calendar and Step 39 reservation save path.
- Food Event History: existing planning and physical event history.
- Impact Ledger boundary: existing ledger recognizes confirmed physical outcomes only.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-emergency-plan-integration.md`
- `docs/cook-before-it-spoils-step-40-report.md`
- `tests/cook-before-it-spoils-step-40-emergency-plan-integration-static.test.js`

## What Changed

Step 40 added versioned Emergency interpretation, planning context, inventory-candidate, candidate-evaluation, score-configuration, and plan-metadata structures. Emergency generation now builds a safe inventory set before recipe scoring, carries context and safe-food summary metadata into the result, and displays Safe Food Available with eligible, review-required, and excluded groups.

## Defects Found and Fixed

- Existing urgency-before-safety defects found: none in the core recipe path; hard filters already ran before candidate scoring.
- Existing limited-budget safety defects found: none in the core recipe path; Budget Rescue generation rejects hard-ineligible recipes before cost scoring.
- Existing questionable-food pressure wording found: none in generated Emergency status text.
- Existing generic-expiration wording found: Calendar reminder still has a compact `Expires Soon` badge outside Emergency Plan; Emergency inventory uses Date Intelligence labels.
- Existing preview-mutation defects found: none in Emergency preview generation; Save Plan remains the commit boundary.

## Versions

- Emergency interpretation version: 1
- Emergency context version: 1
- Emergency inventory-candidate version: 1
- Emergency candidate-evaluation version: 1
- Emergency score-configuration version: 1
- Emergency-plan metadata version: 1

## Emergency Plan Status Values

Step 40 supports complete-within-budget, complete-estimate-incomplete, safe-partial-plan, above-budget, safety-review-required, price-review-required, quantity-review-required, no-safe-candidates, stale, and error, while preserving legacy UI statuses for compatibility.

## Behavior Confirmed

- Natural-language budget behavior: structured budget and date parsing remains local.
- Relative-date behavior: weekdays resolve through the Emergency local timezone.
- Exact-date interpretation behavior: preview displays exact date ranges.
- Inclusive-end-date behavior: interpretation states the end date is inclusive.
- Interpretation-confirmation behavior: generation requires confirmation.
- Ambiguous-request behavior: missing budget, missing end date, ambiguous slash date, invalid date, and zero budget require review.
- Safety-precedence behavior: hard filters run before emergency, rescue, budget, Pantry, and preference scoring.
- Limited-budget safety behavior: low budget cannot restore hard-excluded food.
- User-exclusion behavior: candidate model supports user-excluded items without mutating Pantry or Waste Diary.
- Questionable-food behavior: review-required food is not listed as safe food.
- Precise-date-label behavior: Date Intelligence labels are preserved.
- Reservation protection: Step 39 availability is read from exact Pantry item reservations.
- Pantry-first behavior: planning uses temporary Pantry-first inventory.
- Shopping List integration: existing purchase-group and Shopping List flow is reused.
- Full-package-cost behavior: Budget Rescue cost engine remains the checkout-cost source.
- Pantry-value behavior: Pantry value remains separate from checkout cost.
- Missing-price behavior: missing required prices make totals incomplete, never free.
- Deterministic behavior: candidate ordering uses stable sorting and versioned scoring.
- Guest behavior: Emergency Plan uses existing guest/session behavior.
- Impact boundary: no Emergency preview or saved plan creates rescue impact credit.

## Required Results

Second Emergency Planners created: 0
Second Pantry systems created: 0
Second leftover inventories created: 0
Second Freezer Inventories created: 0
Second Shopping Lists created: 0
Second Price Catalogues created: 0
Second Cost Engines created: 0
Urgency evaluated before safety filters: 0
Budget score restoring hard-excluded food: 0
Rescue score restoring hard-excluded food: 0
True-expired food selected because of budget pressure: 0
Unsafe leftovers selected because of budget pressure: 0
Unverified storage treated as safe: 0
Questionable food recommended without review: 0
Users pressured to use excluded food: 0
Allergies relaxed because the budget was limited: 0
Dietary restrictions relaxed because the budget was limited: 0
Food scheduled after its eligible meal date: 0
Best-before dates represented as expiration dates: 0
App-estimated freshness represented as expiration: 0
Unknown quantities represented as zero: 0
Other-plan reservations treated as freely available: 0
Same physical Pantry quantity allocated twice: 0
Missing purchase prices represented as free: 0
Proportional ingredient-use value represented as checkout cost: 0
Shared packages purchased more than once: 0
Frozen food marked thawed during planning: 0
Frozen food counted as impact during planning: 0
Planned leftovers counted as consumed: 0
Preview plans deducting Pantry: 0
Saved plans creating rescue-impact credit: 0
Partial plans hidden as complete plans: 0
Unsafe food used to fill an unplanned meal slot: 0
Automatic calorie assumptions made for children: 0
Cross-user Pantry, budget, leftover, freezer, or plan data exposed: 0
Guest emergency plans persisted into registered-user storage automatically: 0

## Commands Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- Parsed `data/recipes.json`
- `tests/cook-before-it-spoils-step-40-emergency-plan-integration-static.test.js`
- `tests/cook-before-it-spoils-step-39-meal-calendar-reservations-static.test.js`
- `tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js`
- `tests/cook-before-it-spoils-step-37-budget-rescue-integration-static.test.js`
- `tests/cook-before-it-spoils-step-10-hard-filters-static.test.js`
- `tests/cook-before-it-spoils-step-6-food-safety-static.test.js`
- `tests/budget-rescue-complete-qa.test.js`
- `tests/cost-calculation-engine.test.js`
- `tests/recipe-eligibility-ranking.test.js`
- `tests/pantry-first-planning.test.js`
- `scripts/validate-price-data.js`
- `scripts/validate-ingredient-data.js`

## Validation Result

All commands listed above passed. No build, lint, type-check, browser, accessibility, responsive, or print command exists in this static project beyond the available Node/static validation scripts.

## Deferred Work

Automatic Pantry deduction, automatic meal completion, automatic freezing, automatic thawing, environmental calculations, nutrition diagnosis, safety-rule relaxation, and full browser/manual accessibility testing remain outside Step 40.

## Recommended Starting Point for Step 41

Add an interactive Emergency Plan item-exclusion review panel that lets users exclude, review, or re-include eligible inventory candidates before generating the final preview.
