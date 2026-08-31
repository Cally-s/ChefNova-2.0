# Budget Rescue Step 9 - Recipe Eligibility and Ranking Report

## Goal

Create one centralized recipe-selection pipeline with hard eligibility filtering before soft preference ranking.

## Files Inspected

- `docs/budget-rescue-audit.md`
- `index.html`
- `app.js`
- `style.css`
- `data/recipes.json`
- `data/recipes.js`
- `data/ingredients.json`
- `data/ingredients.js`
- `scripts/ingredient-data-shared.js`
- `scripts/cost-calculation-engine.js`
- `scripts/pantry-first-planning.js`
- Budget Rescue Step 6, Step 7, and Step 8 tests and reports

## Files Created

- `scripts/recipe-eligibility-ranking.js`
- `tests/recipe-eligibility-ranking.test.js`
- `tests/recipe-eligibility-static.test.js`
- `docs/recipe-eligibility-and-ranking.md`
- `docs/recipe-filter-report.md`
- `co-gpt/budget-rescue-step-9-recipe-filter-report.md`

## Files Changed

- `index.html`
- `app.js`
- `style.css`

## Existing Filter Systems Reused or Consolidated

- Existing Allergy Profile
- Existing Dietary Profile
- Existing Meal Planner preferences
- Existing Budget Rescue appliance inputs
- Existing Pantry state
- Existing Step 6 cost engine
- Existing Step 8 Pantry-first simulation
- Existing Replace Meal workflow
- Existing Save Plan workflow

The new shared module is the central hard-filter engine. App entry points call this wrapper instead of maintaining separate hard-filter logic.

## Eligibility Context Structure

The context includes:

- profile revision fingerprint
- saved allergy IDs
- required dietary restrictions
- available appliances
- maximum cooking time
- required servings
- ingredient availability
- selected optional ingredients
- planning mode
- plan date

The context is derived from current user-scoped state and is not stored in the recipe database.

## Eligibility Result Structure

Each evaluation returns:

- recipe ID
- status: `eligible`, `ineligible`, or `indeterminate`
- `canUseForAutomaticPlanning`
- selected preparation method ID
- effective servings
- batch count
- required substitutions
- hard-filter results
- exclusion reasons
- warnings

## Hard-Filter Evaluation Order

1. Recipe data validity
2. Allergy safety
3. Required dietary restrictions
4. Serving feasibility
5. Appliance feasibility
6. Cooking-time feasibility
7. Mandatory ingredient availability
8. Minimal explicit substitute feasibility

## Allergy Matching Behavior

Chef Nova checks saved allergies against recipe-level allergen metadata and canonical ingredient allergen metadata when available. Allergy matches are non-overridable.

## Incomplete Allergen-Data Behavior

If a user has saved allergies and a recipe has no allergen metadata, the recipe is `indeterminate` and cannot enter automatic planning.

## Dietary-Restriction Behavior

Dietary requirements are hard filters. A recipe must satisfy every selected dietary requirement through recipe dietary tags.

## Appliance and Preparation-Method Behavior

The engine supports explicit preparation methods and required appliances. When recipe method metadata exists, at least one method must be feasible. Current production recipe method metadata remains limited and is documented as a limitation.

## Cooking-Time Behavior

Maximum cooking time is hard when set. Chef Nova uses the upper available time value and includes sequential batch time.

## Serving-Feasibility Behavior

Recipes require valid serving data. Scalable recipes can scale within supported limits. Fixed-yield recipes must produce enough servings or explicitly support batches.

## Mandatory Ingredient Availability Behavior

Pantry absence is not unavailability. Missing price data is not unavailability. Only explicit user-controlled unavailability or unresolved mandatory ingredients block planning.

## Explicit Substitute-Feasibility Behavior

Step 9 supports only recipe-approved substitutes. Substitute groups alone are not considered proof. Substitutes must pass allergy, dietary, availability, and quantity-rule checks.

## Soft-Preference Feature Structure

Soft scoring includes:

- preferred ingredients
- cuisine preference
- variety
- minimal cleanup
- batch cooking
- Pantry usage
- cost per serving
- active sales
- cross-recipe reuse

Soft scoring returns `null` for hard failures.

## Weight Configuration

Soft weights are centralized in `SOFT_PREFERENCE_WEIGHTS` inside `scripts/recipe-eligibility-ranking.js`.

## Deterministic Tie-Breaking

Ties use Pantry coverage, use-soon Pantry use, fewer new grocery groups, lower complete cost per serving, and stable recipe ID.

## Integrations

- Standard Meal Plan: uses the central hard filter before candidate scoring.
- Budget Rescue: uses the central hard filter before Pantry and cost scoring.
- Emergency Plan: shares the same generation path and hard filter foundation.
- Replace Meal: uses the same hard filter with the current slot serving count.
- Save Plan: re-evaluates generated plans before saving.
- Current saved plans: meal slots show a text warning if a planned recipe no longer meets current hard requirements.

## No-Eligible-Recipe Behavior

The no-result message says Chef Nova could not find a recipe that meets current safety, cooking, appliance, and serving requirements. It also states that no allergy or dietary restrictions were changed.

## Accessibility and Responsive Work

Compatibility warnings use text, `role="status"`, wrapping, and the existing responsive meal-slot layout. No hard-filter status depends only on color or hover.

## Tests Added

- `tests/recipe-eligibility-ranking.test.js`
- `tests/recipe-eligibility-static.test.js`

## Scenario Counts

- Allergen scenarios tested: 4
- Dietary scenarios tested: 2
- Appliance and time scenarios tested: 4
- Serving scenarios tested: 2
- Ingredient-availability and substitute scenarios tested: 3
- Soft-ranking scenarios tested: 2
- Replacement integration scenarios tested: 1 static guard
- Saved-plan re-evaluation scenarios tested: 1 static guard

## Required Results

```text
Allergen matches allowed into eligible set: 0
Dietary violations allowed into eligible set: 0
Unavailable-appliance recipes allowed: 0
Over-time recipes allowed: 0
Unsupported-serving recipes allowed: 0
Unavailable mandatory ingredients ignored: 0
Soft preferences overriding hard failures: 0
Missing prices treated as ingredient unavailability: 0
Pantry absence treated as ingredient unavailability: 0
Separate replacement filter implementations: 0
```

## Deferred Work

- Full Budget Rescue optimization
- Leftover planning
- Complete cheaper-substitution recommendation engine
- Full Budget Status panel
- Complete shopping-list redesign
- Emergency Plan optimization
- Live grocery inventory
- Retailer scraping

## Confirmations

- Allergies are always hard exclusions.
- Budget, Pantry coverage, sale prices, and preferences cannot override a hard failure.
- Pantry absence and missing prices are not treated as ingredient unavailability.
- Incomplete costs are not treated as zero.
- All planning modes and Replace Meal use the same central eligibility engine.
- No duplicate Recipe Database, Ingredient Catalogue, Allergy Profile, Dietary Profile, eligibility engine, ranking engine, Pantry, Cost Engine, Price Confidence system, Shopping List, Meal Planner, Save Plan workflow, or Replace Meal workflow was created.
- No live grocery inventory, retailer scraping, full budget optimizer, or complete cheaper-substitution engine was introduced.
