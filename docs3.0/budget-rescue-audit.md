# Budget Rescue Meal Planner - Existing System Audit

## 1. Executive Summary

Chef Nova already has a strong meal-planning foundation. The current app supports a Meal Planner page, weekly day tabs, a monthly calendar, saved meal plans, recipe search, pantry matching, shopping-list creation from missing ingredients, allergy filtering, dietary filtering, servings, cooking-time preferences, personalized nutrition targets, meal replacement, guest mode, and registered-user storage.

Budget Rescue should be built as a new planning mode inside the existing Meal Planner, not as a separate app. The best reuse path is to extend the existing meal-plan generation and review flow in `app.js`, especially `buildMealPlanGenerationContext()`, `generatePersonalizedMealPlan()`, `scoreRecipeForPersonalizedMealPlan()`, `openSuggestedMealPlanReview()`, and the existing shopping-list helpers.

The main missing piece is price data. Recipes have structured ingredient objects with names, quantities, and units, but there is no price model, store profile, package size, cost confidence, budget state, leftover tracker, or ingredient substitution model. The project is ready for Budget Rescue architecture work, but not yet ready for accurate budget calculations until ingredient and price data are normalized further.

## 2. Project Architecture

Chef Nova is a static single-page app that works by opening `index.html` directly. It uses bundled data fallbacks in JavaScript for direct file support.

| Area | Existing Implementation | Files |
|---|---|---|
| Main HTML shell | Pages are sections with `data-page-section`, including `planner-page`, `pantry-page`, `recipes-page`, `shopping-list-page`, and `weeklyNutritionPage`. | `index.html` |
| App state | Central `state` object stores recipes, users, pantry, favorites, meal plans, active planner day, planner view, calendar month, filters, and current session data. | `app.js` |
| Recipes | `loadRecipes()` reads `data/recipes.json` when served over HTTP and falls back to `window.CHEF_NOVA_RECIPES` from `data/recipes.js` for direct file opening. | `app.js`, `data/recipes.json`, `data/recipes.js` |
| Meal Planner page | `#planner-page` contains the heading, Save Weekly Plan, Generate Suggested Meal Plan, Clear Meal Plan, preferences, and `#mealPlanner`. | `index.html`, `app.js`, `style.css` |
| Weekly planner | `displayMealPlanner()`, `renderDayTabs()`, `displayActiveMealDay()`, `mealSlot()`, `addMeal()`, and `deleteMeal()` render and save Monday-Sunday meals. | `app.js` |
| Monthly planner | `renderMonthlyMealPlanner()`, `renderCalendarDayCard()`, `openCalendarDayEditor()`, `saveCalendarDay()`, and sync helpers share data with the weekly planner. | `app.js` |
| Meal generation | `openMealPlanGenerationOptions()`, `generatePersonalizedMealPlan()`, `buildPersonalizedMealPlanDays()`, and scoring helpers choose compatible recipes. | `app.js` |
| Meal review and replacement | `openSuggestedMealPlanReview()`, `requestSuggestedMealPlanSave()`, `confirmSaveSuggestedMealPlan()`, `openMealReplacementDialog()`, and `applySelectedMealReplacement()` support review before save and replacement. | `app.js` |
| Pantry | `addPantryItem()`, `displayPantry()`, `removePantryItem()`, `suggestRecipes()`, `savePantryToStorage()`, and `loadPantryFromStorage()` manage pantry items. | `app.js`, `index.html` |
| Shopping list | `addMissingToShoppingList()`, `addGeneratedPlanMissingIngredientsToShoppingList()`, `getShoppingListItems()`, `saveShoppingListItems()`, and `displayShoppingList()` manage missing ingredients. | `app.js` |
| Nutrition | `calculateMealNutrition()`, `getWeeklyNutritionSummary()`, `calculateDailyNutrition()`, `buildWeeklyNutritionComparison()`, and target helpers estimate nutrition from saved recipe meals. | `app.js` |
| Styling | Shared card, form, planner, recipe, pantry, monthly calendar, and responsive rules are in one stylesheet. | `style.css` |

Important DOM IDs and sections:

- `#planner-page`
- `#mealPlanner`
- `#saveWeeklyPlanButton`
- `#generateMealPlanButton`
- `#clearMealPlanButton`
- `#recipeSearchButton`
- `#pantryForm`
- `#shoppingListContent`
- `#weeklyNutritionContent`

## 3. Existing Feature Inventory

| Requirement | Status | Existing Implementation | Reuse Plan | Required Improvement | Relevant Files |
|---|---|---|---|---|---|
| Meal Planner | Already implemented | `#planner-page`, `displayMealPlanner()`, weekly tabs, monthly view, save/clear/generate buttons. | Extend existing planner with a Budget Rescue mode selector. | Add budget-specific controls inside existing planner UI. | `index.html`, `app.js`, `style.css` |
| Dietary restrictions | Already implemented | User `dietaryPreference`, recipe `dietaryTags`, `matchesDietaryPreferences()`, recipe filters. | Reuse as a hard compatibility filter. | Confirm budget generation always calls the same filter. | `app.js`, `data/recipes.json` |
| Allergy filtering | Already implemented | User `allergies`, recipe `allergies`, `recipeContainsUserAllergy()`, `isRecipeSafeForUser()`. | Reuse as a hard safety filter. | Do not allow Budget Rescue to trade safety for price. | `app.js`, `data/recipes.json` |
| Pantry tracking | Already implemented | Pantry form and `state.pantry`; name, quantity, expiration date, category. | Reuse pantry data for pantry-first budget planning. | Add unit support or normalized quantities later. | `index.html`, `app.js` |
| Pantry quantities | Partially implemented | Pantry quantity is numeric count only; no unit. | Reuse count for simple "have item" logic. | Add optional unit/package quantities for cost math. | `app.js` |
| Ingredient unit normalization | Needs improvement | Recipe ingredients have `quantity` and `unit`; `normalizeIngredientList()` preserves them. | Reuse as starting point. | Add normalized units, grams/ml conversions, and ingredient IDs. | `app.js`, `data/recipes.json` |
| Cooking-time preferences | Already implemented | `maximumCookingMinutes` in meal preferences, `calculateMealPlanCookingTimeScore()`, recipe max time filter. | Reuse in Budget Rescue ranking. | Budget mode should balance time and price. | `app.js`, `index.html` |
| Serving controls | Already implemented | Meal entries store `servings`; weekly/monthly editors allow serving amounts. | Reuse servings for cost per planned serving. | Ensure cost calculations multiply by selected servings. | `app.js`, `data/recipes.json` |
| Household-size controls | Missing | No household size or number of people in meal planning. | Add to existing planner preferences or profile. | Add adult/child count fields only when budget mode needs them. | `app.js`, `index.html` |
| Adult and child household fields | Missing | Age exists for account/nutrition profile, but no household member model. | Add later to Budget Rescue settings. | Need fields and storage schema. | `app.js`, `index.html` |
| Nutrition estimates | Already implemented | Recipe nutrition, daily targets, weekly totals, ratings, recommendations, tracker. | Reuse as a companion signal, not a budget calculator. | Budget mode should avoid misleading precision. | `app.js`, `data/recipes.json` |
| Recipe replacement | Already implemented | Review modal supports replacement candidates and scoring. | Extend candidate score with budget components. | Recalculate estimated cost after replacement. | `app.js` |
| Weekly calendar | Already implemented | `DAYS`, `MEALS`, `renderDayTabs()`, `mealSlot()`, weekly saved plan. | Reuse existing weekly structure. | Add budget summary to weekly planner. | `app.js` |
| Monthly calendar | Already implemented | `state.mealPlannerView`, `renderMonthlyMealPlanner()`, `calendar` data under meal plan. | Reuse for date-based budget planning. | Add month budget totals only after price model exists. | `app.js`, `style.css` |
| Save Plan | Already implemented | `saveMealPlan()`, `saveMealPlanEntry()`, `confirmSaveSuggestedMealPlan()`. | Reuse save flow and storage key. | Add optional budget metadata without breaking old plans. | `app.js` |
| Shopping-list generation | Already implemented | Missing recipe ingredients can be added from recipe cards and generated plans. | Extend existing shopping-list generator. | Add quantities, package sizes, and prices later. | `app.js` |
| Shared ingredient aggregation | Partially implemented | Duplicate shopping items are skipped by normalized name. | Reuse as starting point. | Add quantity aggregation by normalized unit. | `app.js` |
| Recipe cost | Missing | No recipe cost, price, or budget fields found. | Add cost calculation to normalized recipe/planner context later. | Need ingredient price catalogue. | `data/recipes.json`, `data/recipes.js`, `app.js` |
| Cost per serving | Missing | Recipe servings exist, but no price model. | Calculate from ingredient costs divided by recipe servings. | Need reliable ingredient cost data. | `data/recipes.json`, `app.js` |
| Grocery purchase cost | Missing | Shopping items have quantity/unit but no package price. | Extend shopping-list items. | Add package size, purchase quantity, and estimated total. | `app.js` |
| Weekly budget | Missing | No budget input or saved budget amount. | Add as Budget Rescue planner preference. | Add validation and storage. | `app.js`, `index.html` |
| Remaining budget | Missing | No spending/budget calculations. | Compute from generated grocery list costs. | Needs price model first. | `app.js` |
| Store price profiles | Missing | No store, price profile, or market settings. | Add optional local price profile. | Store in user-scoped localStorage/sessionStorage. | Future data file or `app.js` |
| User-entered prices | Missing | No UI or storage for ingredient prices. | Add to Budget Rescue settings or shopping list. | Validate prices and keep per-user data. | `app.js`, `index.html` |
| Price confidence or price coverage | Missing | No price coverage metric. | Add percentage of priced ingredients. | Important to avoid false precision. | `app.js` |
| Cheaper substitutions | Missing | No substitution groups. | Extend recipe data and replacement logic. | Add substitution model and respectful explanations. | `data/recipes.json`, `app.js` |
| Pantry-first planning | Partially implemented | Pantry match affects recipe scoring through `calculatePantryMatch()`. | Reuse and increase score weight for Budget Rescue. | Add pantry quantity depletion simulation. | `app.js` |
| Leftover planning | Missing | Monthly notes/meal prep flags exist, but no leftovers model. | Add later using calendar and batch recipes. | Need leftover servings and carryover storage. | `app.js` |
| Batch-cooking support | Partially implemented | `mealPrep` flag exists in monthly calendar. | Reuse as an anchor for batch-cooking hints. | Need batch yield and leftover portions. | `app.js` |
| Emergency budget mode | Missing | No emergency mode or natural-language parsing. | Add as planner mode after base budget scoring. | Must keep language supportive and nonjudgmental. | `app.js`, `style.css` |
| Natural-language request like "I have $25 until Friday" | Missing | No parser for budget/time requests. | Add small local parser, no external API. | Map amount/date into budget constraints. | `app.js` |
| Appliance filtering | Missing | Recipe data has no appliance field. | Add optional recipe tags later. | Need recipe schema update and filter UI. | `data/recipes.json`, `app.js` |
| Respectful over-budget messages | Needs improvement | Supportive language exists, but no budget messaging. | Reuse `languageGuidelines.js` tone. | Add budget-specific supportive messages. | `languageGuidelines.js`, `app.js` |
| User-scoped storage | Already implemented | `getUserStorageKey()` creates account-specific keys such as `chefNovaMealPlan_user-001`. | Reuse for Budget Rescue metadata. | Add schema versioning before storing new data. | `app.js` |
| Guest-mode storage | Already implemented | Guest mode uses `sessionStorage` keys such as `chefNovaGuestMealPlan`. | Reuse for temporary budget planning. | Avoid writing guest budget data to localStorage. | `app.js` |
| Data schema versioning | Partially implemented | Nutrition profile, nutrition target, meal preferences, weight progress have versions. Meal plan does not. | Add versioned budget metadata without changing old plan shape. | Add migration strategy for meal plan budget fields. | `app.js` |
| Accessibility support | Partially implemented | Tabs, modals, aria-live regions, combobox attributes, labels, and buttons exist. | Reuse existing modal and live status patterns. | Budget summaries need screen-reader status updates. | `index.html`, `app.js`, `style.css` |
| Mobile responsiveness | Already implemented | Planner, recipe, pantry, shopping, and monthly calendar CSS includes responsive rules. | Extend existing responsive planner classes. | Test budget controls on mobile. | `style.css` |
| Screen-reader status announcements | Partially implemented | `aria-live` exists for results, planner preview, pantry, shopping, weekly nutrition, and form messages. | Reuse for budget calculation status. | Add clear cost-update announcements. | `index.html`, `app.js` |
| Existing automated tests | Missing | No `package.json`, test files, or test scripts found. Syntax checks are the current baseline. | Add small validation scripts later. | Budget logic needs unit tests for cost math. | Project root |

## 4. Recipe and Ingredient Data Assessment

Current recipe data is more structured than early Chef Nova versions. `data/recipes.json` and `data/recipes.js` contain 35 recipes. All 35 recipes have:

- unique IDs
- structured `ingredients` arrays
- `optionalIngredients`
- `servings`
- core nutrition fields
- allergy data
- category, subcategory, cuisine, keywords, and dietary tags

Ingredient example:

```json
{
  "name": "pasta",
  "quantity": 2,
  "unit": "cups"
}
```

This is enough for display, pantry matching, missing-ingredient lists, and basic shopping-list creation. It is not yet enough for reliable budget calculations because ingredients do not have stable IDs, normalized units, package sizes, purchase units, store prices, price dates, price confidence, or substitution groups.

Current support assessment:

| Data Need | Current Support | Notes |
|---|---|---|
| Plain ingredient display | Supported | `ingredientTag()` displays quantity, unit, and name. |
| Structured ingredient quantity/unit | Supported | All recipes currently use objects with `name`, `quantity`, and `unit`. |
| Ingredient IDs | Missing | Needed for price joins and unit conversion. |
| Optional ingredients | Supported | Present in all recipes and normalized by `normalizeRecipe()`. |
| Substitute groups | Missing | Required for cheaper swaps. |
| Allergen tags | Supported | `allergies` arrays exist and are checked against user allergies. |
| Dietary tags | Supported | `dietaryTags` arrays exist and are used by filters and planner generation. |
| Recipe cost | Missing | No `cost`, `price`, or `estimatedCost` fields found. |
| Cost per serving | Missing | Can be calculated later from cost and `servings`. |
| Pantry quantity matching | Partially supported | Pantry matching checks item names only; it does not subtract quantities. |
| Missing ingredient quantities | Partially supported | Shopping additions preserve recipe ingredient quantity/unit. |
| Grocery package calculations | Missing | No package-size or store-price model. |
| Shared ingredient calculations | Partially supported | Duplicate shopping items are skipped, but quantities are not combined. |
| Leftover planning | Missing | No leftover serving carryover model. |

Required future data changes:

1. Add stable `ingredientId` values to recipe ingredients and pantry/shopping items.
2. Add normalized measurement fields, such as base quantity and base unit.
3. Add a local price catalogue or user-entered price profile.
4. Add package size and purchase unit fields.
5. Add optional substitution groups for cheaper alternatives.
6. Add price coverage/confidence metadata.

Do not convert the recipe database during this audit. The current schema should remain unchanged until Budget Rescue Step 2 defines a migration path.

## 5. Storage and User Data Assessment

Chef Nova separates registered-user data, guest data, and legacy shared keys.

| Storage Area | Key or Pattern | Storage | Current Behavior |
|---|---|---|---|
| Registered users | `chefNovaUsers` | localStorage | Stores local demo accounts. |
| Current session | `chefNovaCurrentUser` | localStorage | Stores active registered user ID. |
| Registered favorites | `chefNovaFavorites_${userId}` | localStorage | Account-specific favorites. |
| Registered pantry | `chefNovaPantry_${userId}` | localStorage | Account-specific pantry. |
| Registered meal plan | `chefNovaMealPlan_${userId}` | localStorage | Account-specific weekly/monthly meal plan. |
| Registered shopping list | `chefNovaShoppingList_${userId}` | localStorage | Account-specific shopping list. |
| Registered notifications | `chefNovaNotifications_${userId}` | localStorage | Account-specific notifications. |
| Registered nutrition history | `chefNovaNutritionHistory_${userId}` | localStorage | Account-specific weekly nutrition history. |
| Meal plan preferences | `chefNovaMealPlanPreferences_${userId}` | localStorage | Stores preferred styles, max cooking time, preferred foods, foods to avoid, maintenance-style flag. |
| Planner view | `chefNovaMealPlannerView_${userId}` | localStorage | Stores weekly/monthly view preference. |
| Guest mode | `chefNovaGuestMode`, `chefNovaSessionMode`, `chefNovaGuestSession` | sessionStorage | Stores active temporary guest session. |
| Guest pantry | `chefNovaGuestPantry` | sessionStorage | Temporary guest pantry. |
| Guest meal plan | `chefNovaGuestMealPlan` | sessionStorage | Temporary guest meal plan. |
| Guest shopping list | `chefNovaGuestShoppingList` | sessionStorage | Temporary guest shopping list. |
| Guest meal preferences | `chefNovaGuestMealPlanPreferences` | sessionStorage | Temporary guest planner preferences. |
| Guest notifications | `chefNovaGuestNotifications` | sessionStorage | Temporary guest notifications. |

Source-of-truth helpers:

- `getUserStorageKey(feature)`
- `getUserStorageKeyForUser(feature, userOrId)`
- `loadUserData(feature)`
- `saveUserData(feature, value)`
- `getStorageConfig(feature)`
- `loadGuestProgress()`
- `persistGuestProgress()`
- `copyGuestProgressToUser(user)`

Budget Rescue should add new data through these helpers. It should not create shared global budget keys that mix users.

Schema versioning currently exists for meal-plan preferences, nutrition profile, daily nutrition target, and weight progress. Meal plans are normalized by `normalizeMealPlan()` but do not have a top-level version field. Budget metadata should be optional and versioned so older saved meal plans keep working.

## 6. Reuse Map

| Future Budget Rescue Feature | Existing Feature to Extend | Extension Needed |
|---|---|---|
| Planning mode selector | `#planner-page`, `displayMealPlanner()`, `renderMealPlannerViewSwitcher()` | Add Standard, Budget Rescue, and Emergency modes without replacing weekly/monthly view controls. |
| Budget amount and deadline | Meal Plan Preferences section and `getMealPlanningPreferences()` | Add optional budget fields with validation and user-scoped/session storage. |
| Dietary filters | `matchesDietaryPreferences()`, user `dietaryPreference`, recipe `dietaryTags` | Reuse as compatibility filter in budget generation. |
| Allergy filters | `recipeContainsUserAllergy()`, `isRecipeSafeForUser()` | Keep as non-negotiable safety filter. |
| Pantry-first planning | `state.pantry`, `calculatePantryMatch()`, `calculateMealPlanPantryScore()` | Increase pantry weight and simulate available quantities. |
| Cooking-time limits | `maximumCookingMinutes`, `calculateMealPlanCookingTimeScore()` | Keep existing preference as a ranking component. |
| Serving-aware cost | `servings`, `normalizeMealPlanEntry()`, `createRecipeMealEntry()` | Calculate planned cost from selected servings. |
| Weekly budget plan | `state.mealPlans`, `saveMealPlan()`, `confirmSaveSuggestedMealPlan()` | Add optional budget summary metadata after review. |
| Monthly budget plan | `state.mealPlans.calendar`, `renderMonthlyMealPlanner()`, `saveCalendarDay()` | Add optional month totals when price model exists. |
| Meal replacement | `openMealReplacementDialog()`, `scoreMealReplacementCandidate()` | Add cost score and cost-difference messages. |
| Grocery totals | `addGeneratedPlanMissingIngredientsToShoppingList()`, `displayShoppingList()` | Aggregate quantities and calculate estimated purchase cost. |
| Shared ingredient calculations | Shopping-list duplicate prevention by normalized name | Replace skip-only behavior with quantity aggregation by ingredient ID and unit. |
| Cheaper substitutions | Recipe replacement flow and recipe ingredient model | Add substitution groups and substitution explanations. |
| Leftover planning | Monthly calendar `mealPrep`, daily notes, `calendar` entries | Add leftover servings and carryover recommendations. |
| Guest budget planning | `GUEST_KEYS`, `persistGuestProgress()` | Store temporary budget settings in sessionStorage only. |
| Registered budget storage | `getUserStorageKey()` and `saveUserData()` | Store budget metadata under account-specific keys. |
| Status announcements | Existing `aria-live` regions and toast/notification helpers | Add budget status updates and price coverage warnings. |
| Visual design | Existing planner cards, modals, tabs, responsive CSS | Add Budget Rescue styles within current Chef Nova theme. |

## 7. Duplication Risks

| Risk | Current Finding | Source of Truth Recommendation |
|---|---|---|
| More than one pantry representation | Pantry exists in `state.pantry`, guest session data, user-scoped localStorage, and legacy key normalization. | Use `state.pantry` plus `loadPantryFromStorage()` and `savePantryToStorage()` only. |
| More than one shopping-list generator | Missing ingredients can be added from recipe cards and generated plans. | Extend `addGeneratedPlanMissingIngredientsToShoppingList()` and `saveShoppingListItems()` rather than creating a new list. |
| More than one dietary-preference form | Account profile stores dietary preference; meal preferences store preferred/avoided foods. | Use profile `dietaryPreference` for dietary rules and meal preferences for ranking hints. |
| More than one recipe filter | Recipe Finder filters and personalized recipe filters coexist. | Budget generation should use planner context filters, not duplicate Recipe Finder controls. |
| More than one saved-plan data structure | Weekly days plus `calendar` object share `state.mealPlans`. | Add optional metadata inside this structure or adjacent user-scoped key with migration notes. |
| Duplicate recipe sources | `data/recipes.json` and `data/recipes.js` are intentionally synchronized for direct file opening. | Keep both synchronized if future schema changes are made. |
| Separate mobile and desktop logic | CSS has responsive layout; JavaScript uses one rendering path. | Keep one behavior path and only adjust CSS for responsiveness. |
| Old or unused meal-planning functions | Some compatibility aliases exist, such as `generateSuggestedMealPlan()` and `replacePlannedMeal()`. | Treat `generatePersonalizedMealPlan()` and review/replacement flow as source of truth. |
| Conflicting localStorage keys | Legacy shared keys still exist for migration; user-specific keys are current. | Do not write Budget Rescue data to legacy/shared keys. |
| Multiple user-profile formats | Account profile and Nutrition Profile are separate. | Keep account/diet/allergy data separate from optional body/nutrition data. |
| Budget as separate app | No Budget Rescue exists yet. | Build it as a mode inside the existing Meal Planner. |

## 8. Accessibility and Mobile Assessment

Current strengths:

- Planner day buttons use `role="tab"` and `aria-selected`.
- Monthly calendar uses `role="grid"` and gridcell buttons.
- Meal inputs use combobox roles, suggestion listboxes, keyboard handling, and `aria-expanded`.
- Several sections use `aria-live`, including recipe results, pantry, shopping list, weekly nutrition, and planner preview areas.
- Modals include dialog roles and Escape handling in the meal-plan generation modal.
- CSS includes responsive rules for planner cards, monthly calendar, pantry, recipe grid, and shopping list.

Current gaps for Budget Rescue:

- Future cost updates need their own screen-reader status announcement.
- Price confidence and over-budget messages should not rely on color alone.
- Budget settings must remain usable on mobile with full-width controls.
- If future charts are added, they need text summaries.

## 9. Testing and Baseline Health

No `package.json`, test files, lint command, build command, or framework configuration were found. The project is a static app with no automated test suite currently present.

Commands run:

| Command | Result |
|---|---|
| `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js` | Passed |
| `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js` | Passed |
| `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check languageGuidelines.js` | Passed |
| `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js` | Passed |
| `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8'))"` | Passed |

Recipe data baseline:

- 35 recipes found.
- 35 unique recipe IDs found.
- 35 recipes use structured ingredient objects.
- 35 recipes include valid servings.
- 35 recipes include core nutrition fields.
- 0 recipe cost fields found.
- Categories found: Breakfast, Brunch, Desserts, Dinner, Drinks, Lunch.
- Difficulties found: Easy, Medium.

Most important future tests:

1. Cost calculation by recipe, serving, week, and month.
2. Shopping-list quantity aggregation across recipes.
3. Pantry quantity matching and simulated depletion.
4. Allergy safety in budget generation and replacement.
5. Guest vs registered storage separation for budget metadata.
6. Direct `index.html` opening with `data/recipes.js` fallback.
7. Mobile layout for Budget Rescue controls and review summaries.

## 10. Recommended Implementation Sequence

1. Define the Budget Rescue data schema and storage plan.
2. Add ingredient IDs and normalized unit metadata without removing existing `name`, `quantity`, or `unit`.
3. Add a local price catalogue or user-entered price profile.
4. Add price coverage and confidence calculations.
5. Extend shopping-list aggregation to combine shared ingredients.
6. Add Budget Rescue as a mode inside the existing Meal Planner controls.
7. Extend `buildMealPlanGenerationContext()` with budget settings.
8. Extend recipe scoring with cost, pantry-first, cooking time, nutrition, dietary, and allergy rules.
9. Extend the existing review modal with cost summaries before saving.
10. Extend meal replacement to show cheaper compatible options.
11. Add Emergency Budget mode and natural-language parsing only after the base budget flow works.
12. Add accessibility announcements and focused validation tests.

## 11. Files Likely to Change in Step 2

Likely files:

- `app.js`
- `index.html`
- `style.css`
- `data/recipes.json`
- `data/recipes.js`
- `languageGuidelines.js`
- `docs/budget-rescue-audit.md`

Possible new files:

- `data/ingredientPrices.json`
- `data/ingredientPrices.js`
- `docs/budget-rescue-schema.md`

Do not add the new data files until the schema is defined. Keep `data/recipes.json` and `data/recipes.js` synchronized if recipe schema fields are added.

