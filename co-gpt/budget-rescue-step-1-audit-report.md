# Budget Rescue Meal Planner - Step 1 Audit Report

## Goal

Complete Step 1 of the Budget Rescue Meal Planner project by auditing the existing Chef Nova meal-planning system before adding budget features.

## Files Changed

- `docs/budget-rescue-audit.md`
- `co-gpt/budget-rescue-step-1-audit-report.md`

## Summary

The audit is complete.

No Budget Rescue interface was built.

No planner behavior, recipe data, storage keys, authentication logic, or UI functionality was changed.

Chef Nova already includes a strong meal-planning system that Budget Rescue can extend:

- weekly Meal Planner
- monthly calendar Meal Planner
- meal-plan preferences
- recipe search and filters
- pantry tracking
- pantry recipe matching
- allergy filtering
- dietary filtering
- serving controls
- cooking-time preferences
- saved meal plans
- suggested meal-plan generation
- review-before-save flow
- meal replacement
- shopping-list creation from missing ingredients
- weekly nutrition totals
- user-scoped localStorage
- guest sessionStorage
- responsive planner styling

The main missing system is budget/pricing support.

## Main Finding

Budget Rescue should be added as a new planning mode inside the existing Meal Planner.

It should not become a separate app, page, pantry system, shopping-list system, recipe filter, or storage model.

The best source-of-truth functions to extend are:

- `buildMealPlanGenerationContext()`
- `generatePersonalizedMealPlan()`
- `scoreRecipeForPersonalizedMealPlan()`
- `openSuggestedMealPlanReview()`
- `confirmSaveSuggestedMealPlan()`
- `openMealReplacementDialog()`
- `scoreMealReplacementCandidate()`
- `addGeneratedPlanMissingIngredientsToShoppingList()`
- `saveMealPlan()`
- `getUserStorageKey()`
- `persistGuestProgress()`

## Requirement Audit

The full requirement audit table is in:

`docs/budget-rescue-audit.md`

Key classifications:

- Meal Planner: Already implemented
- Dietary restrictions: Already implemented
- Allergy filtering: Already implemented
- Pantry tracking: Already implemented
- Pantry quantities: Partially implemented
- Ingredient unit normalization: Needs improvement
- Cooking-time preferences: Already implemented
- Serving controls: Already implemented
- Household-size controls: Missing
- Nutrition estimates: Already implemented
- Recipe replacement: Already implemented
- Weekly calendar: Already implemented
- Monthly calendar: Already implemented
- Save Plan: Already implemented
- Shopping-list generation: Already implemented
- Shared ingredient aggregation: Partially implemented
- Recipe cost: Missing
- Cost per serving: Missing
- Grocery purchase cost: Missing
- Weekly budget: Missing
- Remaining budget: Missing
- Store price profiles: Missing
- User-entered prices: Missing
- Price confidence or price coverage: Missing
- Cheaper substitutions: Missing
- Pantry-first planning: Partially implemented
- Leftover planning: Missing
- Batch-cooking support: Partially implemented
- Emergency budget mode: Missing
- Natural-language budget request: Missing
- Appliance filtering: Missing
- Respectful over-budget messages: Needs improvement
- User-scoped storage: Already implemented
- Guest-mode storage: Already implemented
- Data schema versioning: Partially implemented
- Accessibility support: Partially implemented
- Mobile responsiveness: Already implemented
- Screen-reader status announcements: Partially implemented
- Existing automated tests: Missing

## Recipe Data Assessment

The recipe database currently has:

- 35 recipes
- 35 unique recipe IDs
- structured ingredient objects
- ingredient `name`, `quantity`, and `unit`
- optional ingredients
- servings
- nutrition estimates
- allergy tags
- dietary tags
- categories and subcategories

The recipe database does not currently have:

- ingredient IDs
- normalized base units
- package sizes
- price fields
- cost per serving
- store price profiles
- substitution groups
- price confidence fields

## Storage Assessment

Registered users use account-specific localStorage keys such as:

- `chefNovaPantry_${userId}`
- `chefNovaMealPlan_${userId}`
- `chefNovaShoppingList_${userId}`
- `chefNovaFavorites_${userId}`
- `chefNovaMealPlanPreferences_${userId}`
- `chefNovaMealPlannerView_${userId}`

Guests use sessionStorage keys such as:

- `chefNovaGuestPantry`
- `chefNovaGuestMealPlan`
- `chefNovaGuestShoppingList`
- `chefNovaGuestMealPlanPreferences`

Budget Rescue should reuse this storage separation.

## Duplication Risks

The audit identified these duplication risks:

- creating a second Meal Planner
- creating a second Pantry model
- creating a second Shopping List generator
- creating a second dietary-preference system
- creating a separate recipe filter system for Budget Rescue
- writing budget data to shared or legacy localStorage keys
- creating a separate recipe source instead of keeping `recipes.json` and `recipes.js` synchronized

Recommendation:

Extend the existing Meal Planner and storage helpers.

Do not duplicate systems.

## Validation Performed

Passed:

```bash
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check languageGuidelines.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8'))"
```

No `package.json`, build command, lint command, or automated test files were found.

## Result

Step 1 is complete.

The Budget Rescue architecture audit has been created, existing reusable systems are documented, missing budget systems are identified, and no duplicate Budget Rescue feature was introduced.

