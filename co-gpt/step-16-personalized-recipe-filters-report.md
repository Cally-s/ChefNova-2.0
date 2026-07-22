# Step 16 - Personalized Recipe Filters Implementation Report

## Files Changed

- `index.html`
- `app.js`
- `style.css`
- `data/recipes.json`
- `data/recipes.js`
- `co-gpt/step-16-personalized-recipe-filters-report.md`

## Personalized Filters Section

Added a new `Personalized Filters` fieldset to the AI Recipe Finder with optional checkbox chips:

- Fits my nutrition range
- Higher protein
- Balanced meal
- Workout-friendly
- Vegetable-rich
- Higher fibre
- Lower added sugar
- Quick meal

No personalized filters are selected by default.

## Canonical Filter Values

Added `PERSONALIZED_RECIPE_FILTERS` with these values:

- `fits-nutrition-range`
- `higher-protein`
- `balanced-meal`
- `workout-friendly`
- `vegetable-rich`
- `higher-fibre`
- `lower-added-sugar`
- `quick-meal`

## Filter State and Clear Behaviour

Added:

- `createEmptyPersonalizedRecipeFilterState()`
- `getSelectedPersonalizedRecipeFilters()`
- `clearPersonalizedRecipeFilters()`

`Clear personalized filters` clears only personalized filters. It does not clear the ingredient search, category, cuisine, difficulty, cooking-time filter, dietary filter, allergy checkbox, pantry, account data, Favorites, or Meal Planner.

## Safety-Priority Pipeline

The Recipe Finder now applies filtering in this order:

1. Allergy safety when allergy hiding or personalization is active
2. Dietary preference compatibility when personalization is active
3. Existing search and dropdown filters
4. Selected personalized filters
5. Pantry ingredient match ranking
6. Cooking-time ranking
7. Recipe variety ranking
8. Personalized planning score

## Allergy Integration

Added `isRecipeSafeForUser(recipe)` using the existing allergy-checking logic.

Personalized filtering does not override allergy conflicts.

## Dietary-Preference Integration

Added `matchesDietaryPreferences(recipe, userProfile)`.

Dietary preference is enforced only when personalization is active and a known user preference is available.

## Remaining Planned Nutrition Logic

Added:

- `getCurrentWeeklyNutritionData()`
- `calculateRemainingPlannedNutrition(plannedTotals, weeklyRange)`
- `buildPersonalizedRecipeContext()`

Remaining planned nutrients are calculated temporarily from Weekly Nutrition totals and the estimated weekly range. They are not permanently stored.

## Meal-Data Coverage Guard

The nutrition-range filter checks existing coverage logic:

- at least 70% nutrition-data coverage
- at least 3 meals with nutrition data

When planned meal data is missing or low coverage, Chef Nova displays the required limitation messages and uses broader planning logic instead of exact remaining-nutrient matching.

## Fits My Nutrition Range Scoring

Added:

- `calculateRecipeNutritionFitScore(recipe, context)`
- `doesRecipeFitNutritionRange(recipe, context)`

The minimum flexible planning score is `55`.

The score considers:

- protein contribution
- carbohydrate contribution
- fat balance
- calorie suitability
- vegetables and fibre
- goal support

The score is internal and is displayed only as neutral labels such as Strong planning match, Good planning match, or Possible planning match.

## Individual Filters

Added filter helpers:

- `isHigherProteinRecipe(recipe)` uses at least 25 g protein per serving.
- `isBalancedMealRecipe(recipe)` checks protein, carbohydrates, fat, and meaningful produce.
- `isWorkoutFriendlyRecipe(recipe, context)` uses training focus when Support my workouts is selected, otherwise general balanced options.
- `isVegetableRichRecipe(recipe)` uses at least 1.5 vegetable servings.
- `isHigherFibreRecipe(recipe)` uses at least 6 g fibre and requires fibre data.
- `isLowerAddedSugarRecipe(recipe)` uses added sugar at 5 g or less and requires added-sugar data.
- `isQuickMealRecipe(recipe)` uses 30 minutes or less from total recipe time.

## Data Updates

Added per-serving `fibre` and `addedSugar` fields to all 35 recipes in both:

- `data/recipes.json`
- `data/recipes.js`

Both files remain synchronized.

## Pantry-Match Scoring

Added `calculatePantryMatch(recipe, pantryItems)`.

Pantry match improves ranking but does not exclude recipes for missing pantry ingredients.

## Cooking-Time Scoring

Added `getRecipeTotalMinutes(recipe)` and `calculateRecipeTimeScore(recipe)`.

Unknown time is not treated as zero minutes.

## User-Goal Scoring

Added `calculateRecipeGoalScore(recipe, context)`.

Goals gently influence ranking without creating restrictive rules.

## Personalized Ranking Weights

Added `calculatePersonalizedRecipeScore(recipe, context)` using:

- Nutrition planning fit: 35%
- Pantry match: 25%
- Cooking time: 15%
- User goal: 15%
- Recipe variety: 10%

## No-Results Behaviour

When personalized filters produce no results, Chef Nova shows:

`No recipes match all selected filters. Try removing one personalized filter, increasing cooking time, adding more pantry ingredients, reviewing dietary preferences, or clearing personalized filters.`

It does not suggest removing an allergy and does not automatically clear filters.

## Recipe Card Explanations

Recipe cards can show:

- up to 3 neutral tags
- a planning-match label
- up to 3 reasons under `Why it matches`

Reasons are recalculated in memory and are not saved.

## Recipe Detail Integration

Recipe Details continue to show:

`How This Recipe Fits Your Plan`

Added `Why this recipe appeared` when useful.

## Meal Planner Refresh Behaviour

Meal-plan saves now refresh the Recipe Finder context so remaining planned nutrient information updates the next time recipes are rendered.

## Favorites Behaviour

Favorites are not removed or overwritten when personalization changes.

Personalized match scores are not stored in Favorites.

## Minor Protections

For users under 18, Chef Nova displays:

`For users under 18, personalized filters support regular balanced meals and activity rather than calorie restriction.`

The filters do not prioritize calorie restriction.

## Account Isolation

Personalized filter state is in memory and clears during account/guest transitions.

Ranking context uses only the active user or guest session.

## Guest Mode Behaviour

Guests can use personalized filters with available session Pantry, Meal Planner, Nutrition Profile, and Daily Nutrition Target data.

Guest data remains in sessionStorage.

## Privacy Result

Chef Nova does not store:

- remaining nutrient values
- personalized match reasons
- personalized recipe scores
- selected personalized filters in permanent storage

No external services are used.

## Accessibility Result

Added:

- `fieldset`
- visible `legend`
- visible labels
- keyboard-accessible checkboxes
- disabled-state styling
- readable availability message
- one polite live region for result-count updates

## Responsive Result

Personalized filter chips wrap on desktop and stack cleanly on mobile without horizontal page overflow.

## Required Rules

Personalized recipe filters must remain optional and must not prevent users from browsing recipes without personalization.

Allergy safety and dietary preference compatibility must be checked before personalized filtering or ranking.

The Fits my nutrition range filter must consider estimated nutrition ranges and remaining planned nutrients while clearly explaining that Meal Planner data may be incomplete.

Remaining planned nutrient calculations must not be presented as exact amounts the user is required to eat.

Personalized recipe selection may consider user goals, pantry ingredients, cooking time, meal-plan data, and recipe nutrition, but it must not override allergy safety.

Missing nutrition data must not be treated as zero, and recipes must not receive unsupported Higher fibre or Lower added sugar labels.

Chef Nova must not use personalized filters to make medical claims or guarantee weight loss, muscle gain, or athletic performance.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- Parsed `data/recipes.json` successfully.
- Confirmed `data/recipes.json` and `data/recipes.js` contain matching `fibre` and `addedSugar` values.
- Confirmed all 35 recipes have valid nonnegative `fibre` and `addedSugar` numbers.
- Confirmed the recipe data supports matches for Higher protein, Vegetable-rich, Higher fibre, Lower added sugar, and Quick meal.
- Ran a prohibited wording scan across app code, HTML, CSS, and recipe data.

## Notes

The in-app browser previously blocked direct `file://` navigation for automated browser checks, so validation was completed through local syntax, JSON, data, and static implementation checks.
