# Cook Before It Spoils Mode Audit

## 1. Executive Summary

Chef Nova already has a strong foundation for Cook Before It Spoils Mode. The existing Pantry stores ingredient names, numeric quantities, units, freshness dates, freshness date types, opened status, category, and location. The Budget Rescue foundation already includes reusable Pantry-first allocation, use-soon lot ordering, structured recipe ingredients, recipe eligibility, cost calculation, Shopping List generation, leftovers, batch cooking, user-specific storage, guest session storage, notifications, accessibility patterns, and mobile styling.

The mode should not be built as a second Pantry, second recipe database, second Shopping List, or separate rescue planner. The safest next step is a thin workflow layer that reuses the existing Pantry, recipe eligibility engine, Pantry-first planner, meal planner, Shopping List, leftover metadata, and Budget Rescue cost engine.

Main gaps are workflow-specific rather than foundational. Chef Nova does not yet have a dedicated Cook Before It Spoils page, a user-selected rescue date window, a freezer-placement workflow, a waste/discard event model, a food-rescue analytics view, or Pantry edit support. The current visible Pantry badge uses a fixed 3-day rule, while the deeper Pantry-first planning engine already supports richer use-soon logic for plan windows.

## 2. Repository Architecture

Chef Nova is a static website that works from `index.html` with no backend, database, or external API.

Primary app files:

| Area | Files | Notes |
|---|---|---|
| Main UI and sections | `index.html` | Contains Welcome, Home, Recipe Finder, Pantry, Meal Planner, Shopping List, Favorites, Cooking Rules, Instructions, Notifications, Nutrition, Profile, Budget Rescue, and related modals. |
| Main behavior | `app.js` | Contains app state, auth, Pantry, Recipe Finder, Meal Planner, Shopping List, Budget Rescue, notifications, nutrition, and routing. |
| Main styling | `style.css` | Contains responsive app styles, cards, forms, buttons, modals, Pantry, planner, shopping, Budget Rescue, and accessibility styles. |
| Recipe data | `data/recipes.json`, `data/recipes.js` | JSON source plus JS fallback for direct file opening. |
| Ingredient catalogue | `data/ingredients.json`, `data/ingredients.js` | Canonical ingredients, aliases, allergens, categories, and units. |
| Price catalogue | `data/price-estimates-cad.json`, `data/price-estimates-cad.js` | Built-in CAD price estimates for Budget Rescue. |
| Substitutions | `data/ingredient-substitutions.json`, `data/ingredient-substitutions.js` | Shared substitution catalogue. |
| Pantry-first planning | `scripts/pantry-first-planning.js` | Planning inventory, use-soon statuses, lot priority, and Pantry allocation. |
| Cost engine | `scripts/cost-calculation-engine.js` | Ingredient use cost, purchase grouping, Pantry offsets, and meal-plan grocery costs. |
| Price helpers | `scripts/price-data-shared.js` | Price profiles, price sources, sale handling, and price validation. |
| Ingredient helpers | `scripts/ingredient-data-shared.js` | Canonical ingredient resolution, structured ingredient validation, and units. |
| Eligibility/ranking | `scripts/recipe-eligibility-ranking.js` | Allergy, dietary, appliance, time, servings, ingredient availability, pantry usage, cost, and ranking support. |
| Tests | `tests/*.js` | Static and behavior tests for Budget Rescue, Pantry-first planning, recipe eligibility, prices, cost, shopping, leftovers, accessibility, and edge cases. |
| Existing docs | `docs/*.md`, `co-gpt/*.md` | Budget Rescue implementation history, reports, and test docs. |

## 3. Source-of-Truth Map

| Data | Current Source of Truth | Storage | Reuse Decision |
|---|---|---|---|
| Pantry items | `state.pantry`, `loadPantryFromStorage()`, `savePantryToStorage()` | Registered: user-scoped localStorage. Guest: sessionStorage. | Reuse. Do not create another Pantry. |
| Pantry fixture | `data/pantry.json` | Static fixture only | Use for seed/audit only; do not treat as live Pantry. |
| Pantry freshness badge | `checkExpiration()` | Runtime calculation | Reuse for simple badges, but add mode-specific window logic through Pantry-first planner. |
| Pantry use-soon planning | `scripts/pantry-first-planning.js` | Derived planning inventory | Reuse. This is the strongest base for Cook Before It Spoils prioritization. |
| Recipes | `data/recipes.json`, `data/recipes.js`, `loadRecipes()` | Static JSON plus JS fallback | Reuse. Do not create a food-rescue recipe database. |
| Structured ingredients | `structuredIngredients` in recipes plus Ingredient Data helpers | Static recipe data | Reuse for eligibility, quantities, and Shopping List accuracy. |
| Ingredient catalogue | `data/ingredients.json`, `data/ingredients.js` | Static data plus JS fallback | Reuse for canonical IDs, aliases, units, allergens, and categories. |
| Recipe eligibility | `scripts/recipe-eligibility-ranking.js` | Derived at runtime | Reuse for allergy, dietary, time, servings, and unavailable ingredient rules. |
| Meal planner | `state.mealPlans`, `loadMealPlan()`, `saveMealPlan()` | Registered: user-scoped localStorage. Guest: sessionStorage. | Reuse. Do not create a rescue calendar. |
| Monthly calendar | Meal-plan calendar fields in `app.js` | Existing meal-plan object | Reuse for scheduled rescue meals. |
| Shopping List | `getShoppingListItems()`, `saveShoppingListItems()`, `deriveShoppingListViewModel()` | Registered: user-scoped localStorage. Guest: sessionStorage. | Reuse. Do not create another grocery list. |
| Leftovers/batch | Recipe `batchCooking` and `leftovers` metadata plus Budget Rescue logic | Recipe data and meal plan metadata | Reuse for optional rescue meal carryover. |
| Prices/costs | `data/price-estimates-cad.*`, Price Data, Cost Engine | Static estimates plus user price profiles | Reuse. Do not create a second price engine. |
| Notifications | `addNotification()`, `showToast()`, Notifications page | Registered: user-scoped localStorage. Guest: sessionStorage. | Reuse for warnings and reminders; add no duplicate reminder store. |
| Nutrition | Recipe nutrition and Weekly Nutrition helpers | Existing recipe and meal-plan data | Reuse only as context, not as food-safety logic. |
| User settings | account profile, nutrition profile, budget profile, meal preferences | User-scoped localStorage | Reuse allergy, dietary, household/serving, and preferences. |

## 4. Audit Status Definitions

| Status | Meaning |
|---|---|
| Already implemented | Existing code and data appear sufficient to reuse for this requirement without a new foundational system. |
| Partially implemented | A related system exists, but Cook Before It Spoils needs workflow-specific UI, validation, metadata, or integration. |
| Missing | No current implementation was found for the requirement. |
| Needs improvement | Existing implementation works but has quality, accuracy, accessibility, mobile, data, or maintainability risks for this mode. |
| Blocked | A requirement cannot be completed safely until another missing dependency exists. |
| Not applicable | The requirement does not apply to the static Chef Nova app or should intentionally not be added. |

## 5. Complete Requirement Audit Table

| Requirement | Status | Current Evidence | Gap | Recommended Reuse |
|---|---|---|---|---|
| Dedicated Cook Before It Spoils page/mode | Missing | No page, route, or nav item for this mode was found. | Need new workflow entry point later. | Add a thin page that uses existing Pantry, Recipe Finder, planner, and Shopping List services. |
| Pantry item name | Already implemented | Pantry form stores `name`; records also preserve `originalLabel`. | None for baseline. | Reuse `state.pantry`. |
| Pantry quantity | Partially implemented | Form requires numeric integer quantity >= 1. Pantry-first planner supports unknown quantity internally. | No visible "unknown quantity" option. Seed fixture has string quantities. | Reuse Pantry model; add optional unknown state later using existing planner semantics. |
| Pantry unit | Already implemented | Pantry form includes units and storage defaults to `each`. | Fixture lacks units. | Reuse unit registry and Cost Engine normalization. |
| Expiration/freshness date | Already implemented | Form requires `expirationDate`; records also store `freshnessDate`. | No optional date workflow in visible Pantry form. | Reuse existing dates. |
| Freshness date type | Partially implemented | Form supports Expires on, Best before, Use this first, Unknown. Pantry-first planner understands these. | Visible Pantry still uses `checkExpiration()` against expiration date only. | Reuse Pantry-first `deriveUseSoonStatus()` for mode logic. |
| Opened/unopened status | Partially implemented | Form stores `opened` and `openedAt`; planner prioritizes opened lots. | No opened-specific shelf-life calculation. | Reuse opened flag; add warning copy later. |
| Storage location | Partially implemented | Form stores free-text `location`; planner keeps location in normalized lots. | No controlled choices, freezer workflow, or location analytics. | Reuse location field. |
| Pantry category | Already implemented | Form has Dairy, Meat, Vegetables, Fruit, Grains, Spices, Frozen, Other. | Categories differ from canonical ingredient categories. | Reuse display categories; use ingredient catalogue categories for logic. |
| Pantry edit | Missing | Pantry supports add/remove only. | Need edit/update for changing date, quantity, location, opened status. | Add edit through existing Pantry storage later. |
| Pantry remove | Already implemented | `removePantryItem()` removes item and saves. | Removal is not classified as used, discarded, frozen, or deleted. | Reuse remove only for deletion; add event model later. |
| Expired badge | Already implemented | `checkExpiration()` returns Expired. | No distinction between expires-on vs best-before. | Reuse badge with clearer safety rules later. |
| Expires today badge | Already implemented | `checkExpiration()` returns Expires today. | Same as above. | Reuse badge. |
| Expires soon badge | Already implemented | `checkExpiration()` returns Expires soon for <= 3 days. | Fixed threshold; not user configurable. | Reuse for simple default. |
| Fresh badge | Already implemented | `checkExpiration()` returns Fresh. | Same as above. | Reuse badge. |
| Use-soon planning window | Partially implemented | Pantry-first planner marks during-plan and use-first lots. | No visible rescue window control. | Reuse `deriveUseSoonStatus()`. |
| Sort recipes by soon-to-expire ingredients | Partially implemented | Pantry-first ranking counts use-soon lots; Recipe Finder sorts by ingredient match. | No dedicated sort for "expires soon first" in Recipe Finder. | Reuse pantry allocation and eligibility ranking. |
| Match Pantry to recipe ingredients | Already implemented | Pantry suggestions and Recipe Finder use ingredient matching; Pantry-first uses structured ingredients. | Basic Pantry suggestions use names only. | Use Pantry-first structured allocation for this mode. |
| Missing ingredients display | Already implemented | Recipe Finder, Pantry suggestions, and Recipe Details show missing ingredients. | Basic suggestions do not show quantities. | Reuse Shopping List model for quantities. |
| Allergy filtering | Already implemented | Recipe Finder can hide recipes with user allergies; eligibility engine treats allergen matches as non-overridable. | Main ingredient match has substring fallback that can overmatch. | Use eligibility engine for rescue recommendations. |
| Dietary filtering | Already implemented | Recipe filters and eligibility engine support dietary tags. | Data completeness should remain validated. | Reuse current filters. |
| Cooking time filtering | Already implemented | Recipe Finder and eligibility engine support max time. | None for baseline. | Reuse current filters. |
| Serving/household scaling | Partially implemented | Recipes have servings; eligibility supports required servings; Budget Rescue has household adults/children. | Cook Before It Spoils does not have its own household prompt or serving selection. | Reuse Budget Rescue serving context. |
| Add rescue recipe to meal plan | Partially implemented | Recipe Detail has "Add to Meal Planner"; planner has add/edit/delete/save. | No rescue-specific prefilled meal slot flow. | Reuse meal-plan entry save path. |
| Weekly planner integration | Already implemented | Existing weekly tabs and saved plan. | No rescue annotations. | Reuse planner. |
| Monthly calendar integration | Partially implemented | Existing monthly calendar and day entries. | No rescue badges or use-soon calendar overlay. | Reuse calendar entries. |
| Shopping List integration | Already implemented | Missing ingredients can be added from Recipe Details; planner-derived Shopping List exists. | Rescue-specific batch add from recommendation list is missing. | Reuse existing Shopping List. |
| Shopping List price/cost | Already implemented | Budget Rescue Shopping List has price coverage, purchase quantities, estimates, and warnings. | Price coverage is only 23 of 100 ingredients. | Reuse cost engine; disclose missing prices. |
| Leftover planning | Already implemented for Budget Rescue | Six recipes include batch/leftover support; tests cover source/target behavior. | No general leftover inventory. | Reuse planned-leftover relationships. |
| Prepared leftover inventory | Missing | Docs explicitly defer prepared-food Pantry. | Need model if leftovers become tracked items. | Do not create until required; reuse meal-plan leftover metadata. |
| Freezer support | Partially implemented | Pantry category can be Frozen; Emergency Plan has include frozen food; six recipes mention freezer/frozen. | No freezer action, freezer dates, or thaw reminders. | Reuse Pantry location/category and add workflow later. |
| Waste/disposal tracking | Missing | Remove only deletes Pantry item; no used/discarded/frozen event store. | Need event model and reason choices. | Add one shared event log later. |
| Usage tracking | Partially implemented | Pantry allocation can preview use; Shopping List can add remainder to Pantry. | Cooking a meal does not automatically deduct Pantry quantities. | Reuse allocation results, add confirmed-use event later. |
| Food waste analytics | Missing | No waste analytics found. | Blocked by missing event model. | Build from shared usage/waste events later. |
| Dashboard rescue stats | Missing | Dashboard has general app/Budget Rescue stats, but no spoilage-specific metrics. | Need rescue summary cards after events exist. | Reuse dashboard card pattern. |
| Notifications/reminders | Partially implemented | Toast/Notifications page exists; Pantry add can warn expires soon for registered users. | No scheduled reminder or daily scan. | Reuse Notifications infrastructure. |
| Browser notifications | Missing | No permission request or browser notification API found. | Not needed for static baseline. | Keep as optional later; do not require. |
| Direct `index.html` support | Already implemented | Script fallbacks load `.js` data files before `app.js`. | Keep JSON and JS files synchronized. | Reuse current loading approach. |
| User isolation | Already implemented | `getUserStorageKey()` creates per-user keys; guest uses sessionStorage. | Some legacy/shared keys still migrate. | Reuse storage helpers only. |
| Storage versioning | Partially implemented | Several features have schema versions; Pantry and meal plan core do not have top-level version fields. | Need versioned rescue metadata. | Add optional versioned metadata later. |
| Accessibility patterns | Partially implemented | Skip link, aria-live, semantic fieldsets, modal roles, button labels, focus-visible styles, tests. | New mode still needs screen-reader flows and keyboard QA. | Reuse existing patterns. |
| Mobile responsiveness | Partially implemented | CSS includes responsive grids and tests pass static mobile checks. | New mode must be verified visually. | Reuse card/grid patterns. |
| Tests | Already implemented for foundation | 26 current tests passed in audit. | No Cook Before It Spoils tests yet. | Add static and behavior tests when implementation begins. |

## 6. Pantry Data Model

Current live Pantry records are stored in `state.pantry`. The add form captures:

- `name`
- `quantity`
- `unit`
- `expirationDate`
- `freshnessDate`
- `freshnessDateType`
- `category`
- `opened`
- `openedAt`
- `location`
- `createdAt`
- `updatedAt`
- canonical `ingredientId` when the name resolves

The Pantry data model is usable for Cook Before It Spoils, but it needs two improvements before the mode can be dependable:

1. Add edit support for existing Pantry items.
2. Decide how visible Pantry should represent unknown quantities, because the planning engine already supports unknown quantities but the form currently requires quantity >= 1.

The fixture `data/pantry.json` is not aligned with the current live Pantry model. It has four starter items, no unit fields, no locations, no opened flags, and three string quantities that parse as unknown for planning.

## 7. Date and Expires Soon

The visible Pantry status uses `checkExpiration(date)`:

- past date: Expired
- today: Expires today
- within 3 days: Expires soon
- later: Fresh

This is simple and already works for Pantry cards. The deeper planning layer has richer use-soon logic in `scripts/pantry-first-planning.js`:

- explicit use-first
- during plan
- after plan
- no date
- review required
- excluded

Cook Before It Spoils should use the Pantry-first date model for ranking and planning. The visible 3-day badge can remain a simple summary.

## 8. Reminder/Notifications

Chef Nova has a reusable notification system with four types: success, error, warning, and info. Notifications are saved for registered users and temporary for guests. Pantry add can save a warning when a registered user's item expires soon.

Missing pieces:

- no scheduled reminder scan
- no daily use-soon digest
- no item-level "remind me" setting
- no browser notification permission

Recommended approach: reuse `addNotification()` and the Notifications page. Add future reminders as derived notifications from Pantry freshness state, not as a separate reminder database.

## 9. Recipe Matching/Eligibility

Chef Nova has three recipe-selection layers:

1. Recipe Finder matching from comma-separated user ingredients.
2. Pantry suggestion matching from Pantry item names.
3. Structured Pantry-first recipe allocation using canonical ingredient IDs, quantities, units, forms, and use-soon lot priority.

Cook Before It Spoils should use the third layer as the primary matching source. Basic name matching is fine for simple search, but food-rescue recommendations need the structured allocation path because it handles quantities, units, unknown amounts, and forms.

Known risk: `ingredientsMatch()` includes fallback substring matching. That is friendly for search, but rescue recommendations should prefer canonical ingredient IDs to avoid overmatching similar names.

## 10. Ranking

The existing eligibility/ranking engine already supports:

- hard exclusions for allergies
- dietary requirements
- appliance availability
- cooking-time limits
- serving feasibility
- unavailable mandatory ingredients
- soft scoring for Pantry usage
- cost per serving
- active sales
- cross-recipe reuse
- batch cooking

Cook Before It Spoils still needs a dedicated ranking formula that weights:

- expiring today and expired items requiring review
- use-first items
- opened items
- soonest freshness date
- number of soon-to-expire Pantry lots used
- amount of food rescued
- missing-ingredient burden
- safety and allergy rules

This should extend the existing ranking engine rather than replace it.

## 11. Household/Serving

Chef Nova already has recipe servings, selected servings, serving feasibility, and Budget Rescue household fields. This is partially sufficient.

Missing for Cook Before It Spoils:

- no dedicated rescue serving target
- no household-size selector in the mode
- no "cook for today vs batch for later" control in the mode

Recommended approach: reuse Budget Rescue serving fields and the existing meal-plan selected-servings entry shape.

## 12. Meal Planner/Calendar

The weekly and monthly planner already exist. Meal entries can store recipe IDs, recipe names, servings, nutrition availability, plan dates, and Budget Rescue metadata.

Cook Before It Spoils should add meals through the existing `saveMealPlanEntry()` path. It should not create a rescue-specific calendar or a second meal-plan storage key.

Missing:

- rescue labels on meal-plan entries
- one-click scheduling from a rescue recommendation
- calendar badges showing meals that use expiring items

## 13. Shopping List

The Shopping List is ready to reuse. It already supports:

- manual items
- missing ingredients from recipes
- planner-derived purchase groups
- at-home quantities
- missing quantities
- suggested purchases
- price status
- purchase quantity overrides
- remove/restore
- mark bought/needed
- estimated surplus with "Add to Pantry"

Cook Before It Spoils should send missing rescue ingredients into this existing list and preserve the current Budget Rescue cost model.

## 14. Leftovers/Batch

Chef Nova already has planned-leftover support for Budget Rescue. Six recipes include `batchCooking` and `leftovers` metadata. Existing tests cover source batches, leftover targets, cost double-counting protection, and replacement behavior.

Missing:

- no prepared leftover inventory
- no cooked-date tracking for leftovers outside the meal plan
- no automatic Pantry transfer after cooking

Recommended approach: keep using meal-plan leftover relationships. Do not add prepared-food inventory until a later step requires it.

## 15. Storage Location/Freezer

Current support is partial:

- Pantry category includes Frozen.
- Pantry item location is free text.
- Emergency Plan has include-frozen-food logic.
- Some recipe metadata mentions freezer/frozen.

Missing:

- no "move to freezer" action
- no freezer date
- no thaw/reminder workflow
- no freezer-specific safety text
- no controlled storage-location options

Recommended approach: reuse Pantry `location` and category fields. Add freezer workflow later as Pantry updates plus notifications, not as a new freezer inventory.

## 16. Budget Rescue Price/Cost Reuse

Budget Rescue should be reused directly. Current reusable pieces:

- Ingredient Catalogue
- Price Catalogue
- Price Data helpers
- Cost Engine
- Pantry-first allocation
- Shopping List cost model
- Budget Status panel
- price confidence messaging

Current price coverage is limited: 23 price entries cover 23 of 100 canonical ingredients. This is acceptable for estimates with clear incomplete-price messaging, but not enough for precise cost claims.

## 17. Usage/Waste/Event

This is the largest missing foundation for Cook Before It Spoils.

Current app can remove Pantry items, preview Pantry allocation, add estimated shopping remainders to Pantry, and show Pantry savings. It does not record why Pantry changed.

Missing event types:

- used in meal
- discarded
- frozen
- donated/shared
- quantity adjusted
- expired before use

Recommendation: add one shared Pantry event log later. It should be user-scoped, versioned, and reusable by analytics, dashboard, waste reduction, and future undo/history features.

## 18. Analytics/Dashboard

Chef Nova has dashboards and summary cards for other features. It does not have Cook Before It Spoils analytics.

Blocked by missing event data:

- food rescued
- items used before expiry
- items discarded
- potential waste avoided
- rescue meal count
- freezer move count

Recommendation: build analytics only after shared event logging exists. Avoid estimating waste from removed items without knowing whether the user used or discarded them.

## 19. Storage/Versioning/User Isolation

User isolation is already implemented:

- registered data uses user-specific localStorage keys
- guest data uses sessionStorage
- legacy keys are migrated through storage helpers

Cook Before It Spoils should reuse existing storage helpers. It should not introduce unscoped localStorage keys.

Needed later:

- versioned rescue preferences
- versioned Pantry event log
- optional rescue metadata on meal-plan entries

## 20. Accessibility

Existing accessibility strengths:

- skip link
- semantic buttons and fieldsets
- modal `role="dialog"` and `aria-modal`
- `aria-live` regions for dynamic results
- notification list roles
- focus-visible styles
- reduced-motion handling
- static accessibility/mobile test coverage

New Cook Before It Spoils work should preserve:

- keyboard operation for recommendation cards and filters
- screen-reader announcements for new recommendations and saved actions
- text labels for freshness status, not color alone
- modal close with Escape and outside click when modals are used

## 21. Mobile

Existing CSS includes responsive layouts and card grids for Pantry, recipes, planner, Shopping List, and Budget Rescue. Static mobile tests passed.

New Cook Before It Spoils UI should use:

- one-column mobile cards
- wrapped filter controls
- full-width buttons on small screens
- compact recommendation summaries
- no horizontally scrolling tables

## 22. Future Workflow Data Flow

Recommended future data flow:

1. Read current Pantry through `state.pantry`.
2. Normalize Pantry into a planning inventory with `ChefNovaPantryFirst.createPlanningInventory()`.
3. Select a rescue date window.
4. Evaluate recipes through the recipe eligibility engine.
5. Allocate Pantry lots to candidate recipes.
6. Rank candidates by safety, use-soon impact, Pantry coverage, missing ingredients, cost, servings, and cooking time.
7. Display recommendations with matched expiring items and missing items.
8. Allow the user to add a recipe to the existing Meal Planner.
9. Allow missing ingredients to go to the existing Shopping List.
10. On confirmed cooking or Pantry update, write one shared Pantry event.
11. Derive rescue analytics from that event log.

## 23. Duplicate/Fragmented Logic

Existing duplicate risks:

- simple name-based ingredient matching exists beside structured canonical matching
- visible Pantry freshness badges exist beside richer Pantry-first use-soon statuses
- Shopping List can include both manual and planner-derived item paths
- legacy storage keys coexist with user-scoped keys

These are manageable if Cook Before It Spoils uses the deeper shared systems:

- canonical ingredient IDs over substring matching
- Pantry-first use-soon status over separate rescue date logic
- existing Shopping List model over a separate grocery list
- user-scoped storage helpers over new direct localStorage calls

## 24. Baseline Test Results

Baseline commands passed:

- `node --check data/recipes.js`
- `node --check app.js`
- `node --check rules.js`
- `node --check scripts/recipe-eligibility-ranking.js`
- JSON parse for `data/recipes.json`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- all 26 existing `tests/*.js`

Notable validation findings:

- 35 recipes exist.
- 35 recipes include structured ingredients.
- 6 recipes include batch-cooking metadata.
- 6 recipes include leftover metadata.
- 100 canonical ingredients exist.
- 23 price entries exist.
- Price estimate coverage is 23%.
- `data/pantry.json` has four starter records and is not aligned with the current live Pantry model.
- The directory is not a Git repository, so no commit hash was available.

## 25. Recommended Next-Step Architecture

Implement Cook Before It Spoils as a mode, not a parallel app.

Recommended modules and responsibilities:

| Layer | Responsibility |
|---|---|
| UI page | Rescue date window, filters, recommendation cards, and actions. |
| Pantry adapter | Read existing Pantry and normalize through Pantry-first planner. |
| Candidate builder | Evaluate recipes with eligibility, Pantry allocation, missing ingredients, servings, and cost. |
| Rescue ranker | Score expiring/use-first/opened Pantry usage, missing burden, cost, time, and safety. |
| Planner integration | Save selected rescue meals into the existing Meal Planner. |
| Shopping integration | Add missing rescue ingredients to the existing Shopping List. |
| Event log | Later: record used/discarded/frozen/adjusted Pantry events. |
| Analytics | Later: derive rescue stats from the shared event log. |

## 26. Implementation Dependencies

Must happen before or during implementation:

1. Define the rescue recommendation data shape as derived data.
2. Add no new persisted fields until required.
3. Add Pantry edit support if the mode needs correction of dates, quantities, or locations.
4. Add a user-selected rescue window.
5. Reuse Pantry-first date and allocation logic.
6. Reuse recipe eligibility and allergy filtering.
7. Reuse existing Shopping List and Meal Planner write paths.
8. Add tests for recommendation ranking, missing ingredients, allergy exclusion, guest storage, user storage, keyboard behavior, and mobile layout.

Blocked until later:

- waste analytics, because no event log exists
- freezer reminders, because no freezer workflow exists
- prepared leftover inventory, because the app currently only tracks planned leftovers

## 27. Explicit Non-Duplication Decisions

Do not create:

- a second Pantry system
- a separate freezer inventory
- a second Recipe Database
- a food-rescue recipe database
- a separate food-rescue Shopping List
- a separate food-rescue calendar
- duplicate household profiles
- duplicate allergy profiles
- duplicate dietary profiles
- a second price catalogue
- a second cost engine
- a second serving scaler
- a second leftover system
- a second analytics event store
- a new unscoped storage convention

Reuse:

- `state.pantry`
- `savePantryToStorage()`
- `loadPantryFromStorage()`
- `ChefNovaPantryFirst`
- `ChefNovaRecipeEligibility`
- `ChefNovaCostEngine`
- `ChefNovaPriceData`
- `data/recipes.json`
- `data/recipes.js`
- `data/ingredients.json`
- `data/ingredients.js`
- existing Meal Planner
- existing Shopping List
- existing Notifications page
- existing guest and registered storage helpers

