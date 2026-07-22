# Step 18 - Meal-Plan Selection Logic Implementation Report

## Files Changed

- `app.js`
- `co-gpt/step-18-meal-plan-selection-logic-report.md`

## generatePersonalizedMealPlan Implementation

Added `generatePersonalizedMealPlan(context, options = {})` as the main personalized meal-plan preview generator.

The existing `generateSuggestedMealPlan()` now delegates to the new function so older Meal Planner controls continue to work.

generatePersonalizedMealPlan must return a temporary preview and must not save or mutate the active Meal Planner.

## Validation Pipeline

The generator now follows this pipeline:

- validate the generation context
- load active recipe data into a lookup map
- remove allergy-conflicting recipes
- remove dietary-incompatible recipes
- remove user avoided foods
- validate meal-plan recipe metadata
- group recipes by meal type
- clone or create a working plan
- fill meal slots
- calculate daily estimated totals
- evaluate balance and variety
- run a limited replacement pass
- run final safety validation
- build daily and weekly preview summaries
- return the preview without saving

## Allergy Exclusion

Recipes containing known user allergens must be excluded before scoring and cannot be restored by a high personalization score.

Allergy safety is pass-or-fail and is not part of the 100-point score.

## Dietary Preference Filtering

Dietary compatibility must be checked before Pantry, nutrition, goal, variety, or cooking-time scoring.

The generator uses the existing `matchesDietaryPreferences()` check before ranking.

## Meal-Type Grouping

Added `groupRecipesByMealType(recipes)` with groups for:

- breakfast
- lunch
- dinner
- snack

Recipes may appear in more than one compatible group. Brunch recipes can support breakfast and lunch.

## Score Weights

Added:

`MEAL_PLAN_RECIPE_SCORE_WEIGHTS = { dietMatch: 25, nutritionFit: 25, pantryMatch: 20, goalMatch: 15, recipeVariety: 10, cookingTimeMatch: 5 }`

The meal-plan score must use Diet Match up to 25 points, Nutrition Fit up to 25 points, Pantry Match up to 20 points, Goal Match up to 15 points, Recipe Variety up to 10 points, and Cooking-Time Match up to 5 points.

## Diet Match Scoring

Added `calculateMealPlanDietMatchScore()`.

Users with no dietary preference receive a neutral full score. Explicit matching dietary tags can improve compatibility scoring when preferences exist.

## Nutrition Fit Scoring

Added `calculateMealPlanNutritionFitScore()`, `calculateProjectedDailyRangeFit()`, `buildExpectedProgressRanges()`, and `scoreValueAgainstFlexibleRange()`.

Nutrition scoring uses flexible estimated daily ranges when a Daily Nutrition Target exists. If no target exists, Chef Nova uses general balanced-meal scoring.

Missing nutrition data must not be treated as zero, and Chef Nova must not invent nutrition values.

## Pantry Match Scoring

Added `calculateMealPlanPantryScore()`.

Pantry match can improve ranking up to 20 points but does not exclude recipes by itself.

## Goal Match Scoring

Added `calculateMealPlanGoalScore()`.

The function maps existing goal scoring into a 0-15 point range and supports maintain-current-weight, build-muscle, improve-eating-habits, support-workouts, gradual-weight-change, and prefer-not-to-choose.

## Recipe Variety Scoring

Added the new 0-10 `calculateMealPlanVarietyScore()` implementation.

It discourages repeated recipes, consecutive-day duplicates, overused protein groups, and overused carbohydrate groups.

## Cooking-Time Match Scoring

Added `calculateMealPlanCookingTimeScore()`.

Unknown time is not treated as zero minutes. Recipes at or under the saved maximum cooking time receive the strongest time score.

## Generation-State Tracking

Enhanced `createMealPlanGenerationState()` with:

- recipe use counts
- primary protein counts
- carbohydrate group counts
- produce group counts
- daily totals
- selected recipe IDs by day
- generation notes

## Daily Total Calculations

Added `calculateGeneratedDayTotals()`, `createEmptyNutritionTotals()`, `addRecipeNutritionToTotals()`, and `addKnownNutritionToTotals()`.

The generator calculates estimated planned totals for each day and tracks nutrition-data coverage separately.

## Flexible Balance Evaluation

Added `evaluateGeneratedDayBalance()`, `evaluateGeneralFoodVariety()`, `evaluateNutrientRange()`, and `classifyFlexibleDailyRange()`.

Small differences from estimated ranges are handled with flexible tolerance and neutral planning language.

## Replacement-Pass Logic

Added `improveGeneratedMealPlan()`, `findBestMealReplacement()`, and `applyMealReplacement()`.

The generator must calculate estimated planned totals for each day and may replace generated recipes when doing so improves flexible nutrition balance or food variety.

Replacement passes are limited to three.

## Repetition Limits

Added:

`DEFAULT_RECIPE_USE_LIMITS = { breakfast: 3, lunch: 2, dinner: 2, snack: 3 }`

The generator must avoid excessive recipe repetition and should use multiple protein, carbohydrate, and produce sources when compatible recipes are available.

## Protein-Source Variety

The generator tracks primary protein groups using existing recipe ingredients and `getRecipePrimaryProteinGroup()`.

## Carbohydrate-Source Variety

Added `getRecipeCarbohydrateGroup()` to track rice, oats, pasta/noodles, bread/wraps, potatoes, quinoa, corn, legumes, fruit, and other grains.

## Produce Variety

Added `getRecipeProduceGroups()` and daily food-group evaluation for leafy greens, cruciferous vegetables, red/orange vegetables, legumes, berries, citrus, other fruit, and mixed vegetables.

## Fill Empty Slots Protection

Fill Empty Slots preserves existing recipes, custom meals, and servings.

Preserved meals are included in repetition and daily-total context and are not replaced during the improvement pass.

## Replace Entire Plan Behaviour

Replace Entire Plan starts from an empty working plan and generates a separate preview.

The saved plan remains unchanged until confirmation.

## Final Safety Validation

Added `validateGeneratedMealPlanSafety(plan, context)`.

If a generated plan contains an allergy conflict, dietary conflict, avoided food, or missing recipe reference, the preview is rejected.

## Preview-Only Behaviour

Generated previews do not call `saveMealPlan()`, `localStorage.setItem()`, `sessionStorage.setItem()`, weekly history updates, or Shopping List actions.

Generated plans must be saved only after the user confirms by selecting Apply Suggested Plan.

## Confirmation Save Behaviour

Added `applyGeneratedMealPlan(generatedResult)`.

Only the Apply Suggested Plan action normalizes and saves the generated plan, refreshes the Meal Planner, and updates Weekly Nutrition.

## No-Target Behaviour

When no valid Daily Nutrition Target exists, the generator still works using general balanced-meal rules, pantry match, goal match, variety, dietary compatibility, and cooking-time preferences.

## Minor Protections

The existing minor preview message remains in place.

Chef Nova keeps suggested plans focused on regular meals, variety, and activity support.

## Guest Mode Behaviour

Guest previews are not saved automatically.

When a guest applies a suggested plan, the existing guest Meal Planner save path stores it in sessionStorage only.

## Account Isolation

The generator uses only the active account or active guest context passed into `buildMealPlanGenerationContext()`.

Pending generated plans are cleared by existing account-switching, logout, and guest-exit cleanup paths.

## Privacy Result

No external APIs were added.

The generator does not log allergies, body information, nutrition targets, Pantry contents, recipe scores, rejected recipes, or remaining-nutrient calculations.

## Accessibility Result

The existing keyboard-accessible preview modal remains in use.

Preview status messages use the existing polite live region.

Apply, Regenerate, and Cancel keep visible button labels.

## Responsive Result

No new layout containers were added outside the existing Meal Planner preview components, so the current responsive preview grid and controls continue to apply.

## User Guide Update

Updated the Meal Planner instruction details to explain:

- temporary preview generation
- allergy and dietary checks before ranking
- meal-type grouping
- 100-point scoring components
- daily total recalculation
- replacement logic
- repetition protection
- confirmation-only saving
- missing nutrition handling
- general planning limitations

## Required Rule Confirmation

The generator must not simply select the lowest-calorie meals.

Generated plans must be saved only after the user confirms by selecting Apply Suggested Plan.

Missing nutrition data must not be treated as zero, and Chef Nova must not invent nutrition values.

Do not create a Git commit unless requested.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parsed `data/recipes.json` successfully
- confirmed required function names exist in `app.js`
- confirmed `generatePersonalizedMealPlan()` body does not call direct save/storage/history/shopping actions
- scanned app files for prohibited generation wording and unsupported logic terms

## Notes

The Meal Planner currently supports Breakfast, Lunch, and Dinner as visible slots. Snack grouping is implemented for future-compatible recipe grouping, but no Snack UI slot was added.

The project folder is not a Git repository, so no Git commit was created.
