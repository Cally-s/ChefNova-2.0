# Step 21 - Meal Replacement Implementation Report

## Files Changed

- `app.js`
- `style.css`
- `co-gpt/step-21-meal-replacement-report.md`

## Replace Meal Button Placement

Each eligible generated meal in Suggested Weekly Plan must include Replace Meal.

Replace Meal appears for generated recipe meals and previously replaced suggested meals.

Protected manual/custom meals show `Existing meal preserved` and do not show Replace Meal.

## Replacement Dialog

Added an accessible replacement panel titled `Replace [Day] [Meal Type]`.

The panel shows the current meal and replacement choices.

Each choice includes:

- Choice number
- Recipe name
- Meal category
- Cooking time
- Servings used for comparison
- Calories
- Protein
- Carbohydrates
- Fat
- Vegetable servings
- Up to three tags
- Up to three neutral reasons
- Estimated daily effects
- Select Replacement button

## Replacement Request State

Extended temporary review state with:

- `selectedReplacementSlot`
- `replacementChoices`

This information stays in memory only and is cleared when the replacement panel closes, replacement succeeds, the review closes, account changes, or Guest Mode exits.

## Same-Category Filtering

Replacement recipes must match the same meal category and must pass allergy, dietary-preference, and foods-to-avoid checks before scoring.

Breakfast replacements must be breakfast-compatible, lunch replacements must be lunch-compatible, and dinner replacements must be dinner-compatible.

## Allergy Filtering

Allergy conflicts are excluded before scoring.

No score can restore an allergy-conflicting recipe.

## Dietary-Preference Filtering

Dietary preferences remain hard requirements before scoring.

## Foods-to-Avoid Filtering

Recipes containing foods the user chose to avoid are excluded before scoring.

## Daily Totals Without Current Meal

Added `cloneDayPlanWithoutMeal()` and `buildMealReplacementContext()`.

Replacement candidates must be compared against the day after removing the current meal so that nutrition is not counted twice.

## Replacement Scoring Weights

Added `MEAL_REPLACEMENT_SCORE_WEIGHTS`:

- Category Match: 15
- Nutrition Range Fit: 35
- Recipe Variety: 20
- Pantry Match: 10
- Cooking-Time Match: 10
- Goal Match: 10

Allergy and dietary safety are pass-or-fail requirements, not points.

## Category Scoring

Added `calculateReplacementCategoryScore()`.

Exact category matches receive the strongest category score, while compatible meal-type matches remain eligible.

## Nutrition-Range Scoring

Added `calculateReplacementNutritionFitScore()` and `calculateProjectedFullDayRangeScore()`.

Replacement ranking uses flexible daily nutrition fit and does not require exact target matching.

## Recipe-Variety Scoring

Added `calculateReplacementVarietyScore()`.

It discourages unnecessary recipe repetition, adjacent-day repetition, overused protein groups, and overused carbohydrate groups.

## Pantry Scoring

Added `calculateReplacementPantryScore()`.

Pantry match can improve ranking but cannot override safety or category requirements.

## Cooking-Time Scoring

Added `calculateReplacementCookingTimeScore()`.

Unknown cooking time is not treated as zero minutes.

## Goal Scoring

Added `calculateReplacementGoalScore()` by reusing Step 19 goal logic and scaling it to the replacement score.

Goal logic never overrides allergy, dietary, avoided-food, or category rules.

## Top-Three Choice Selection

Added `MEAL_REPLACEMENT_CHOICE_LIMIT = 3`.

Chef Nova must show exactly three replacement choices when at least three compatible alternatives are available.

When fewer than three safe and compatible alternatives exist, Chef Nova must show only the available choices and must not include unsafe recipes to reach three.

## Tie-Breaker Logic

Added tie breakers that prefer:

- Fewer recipe uses
- Better nutrition-data completeness
- Better Pantry match
- Shorter cooking time
- Alphabetical recipe name

Lowest calories are not used as a tie breaker.

## Replacement Reasons

Added `buildReplacementReasons()` with neutral planning language.

No raw scores are displayed.

## Estimated Daily Effects

Added `buildReplacementDailyEffect()` and neutral projected-day effect messages.

The app does not show exact nutrient deficits as requirements.

## Missing-Nutrition Handling

Missing nutrition data is displayed as unavailable.

Missing nutrition data must not be treated as zero and must not create unsupported nutrition claims.

## Serving Preservation

Replacement preserves the current meal’s valid serving amount when possible.

## Replacement Revalidation

Before applying a replacement, Chef Nova rechecks:

- Recipe existence
- Meal category
- Allergy safety
- Dietary compatibility
- Foods to avoid
- Current active review state

Allergy safety, dietary preferences, foods to avoid, and age-based protections must be revalidated before applying a replacement.

## Draft-Only Updates

Replacing a meal must update only the temporary Suggested Weekly Plan draft and must not save the active Meal Planner.

No replacement handler writes to localStorage or sessionStorage.

## Daily and Weekly Recalculation

Daily and weekly nutrition summaries must be recalculated after a replacement.

The review recalculates day totals, nutrition coverage, weekly summary, recipe variety, and generation notes.

## Keep Current Meal Behaviour

Keep Current Meal closes the replacement panel, clears temporary choices, makes no draft changes, and returns focus to the original Replace Meal button.

## Cancel and Escape Behaviour

Cancel and Escape close only the replacement panel, clear replacement choices, make no changes, and return to the Suggested Weekly Plan review.

## Minor Protections

Replacement scoring uses the existing Step 19 age-protected goal logic.

Chef Nova does not use lower-calorie ranking, deficit language, portion-reduction advice, or exercise-compensation language for minors.

## Guest Mode Behaviour

Guest users may replace meals in the temporary review.

Before Save, replacement changes are not written to sessionStorage.

After confirmed Save, only the final reviewed plan is saved.

## Account Isolation

Replacement choices use only the active user’s allergies, dietary preferences, Pantry, goal, meal-plan preferences, and current review draft.

Account-change cleanup clears replacement choices and the full review state.

## Privacy Result

Replacement scores, rejected candidate lists, projected nutrient effects, replacement state, and temporary reasons are not permanently stored.

No private allergy, profile, Pantry, nutrition-target, or candidate-score information is logged.

## Accessibility Result

Replace Meal buttons include day and meal type in their accessible names.

Select Replacement buttons include recipe names and slot information.

The modal retains the existing focus trap and Escape handling.

## Responsive Result

Replacement cards show three columns on wide screens, two columns on tablet, and one column on mobile.

Nutrition values and reasons wrap inside cards to prevent horizontal overflow.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- Parsed `data/recipes.json` successfully
- Searched for prohibited replacement behavior
- Searched for prohibited wording
- Searched replacement functions for storage/save calls

## Exact Rules Confirmed

Each eligible generated meal in Suggested Weekly Plan must include Replace Meal.

Replacement recipes must match the same meal category and must pass allergy, dietary-preference, and foods-to-avoid checks before scoring.

Replacement candidates must be compared against the day after removing the current meal so that nutrition is not counted twice.

Replacement ranking must consider flexible daily nutrition fit, recipe variety, Pantry ingredients, cooking time, and goal type without automatically preferring the lowest-calorie recipe.

Chef Nova must show exactly three replacement choices when at least three compatible alternatives are available.

When fewer than three safe and compatible alternatives exist, Chef Nova must show only the available choices and must not include unsafe recipes to reach three.

Replacing a meal must update only the temporary Suggested Weekly Plan draft and must not save the active Meal Planner.

Daily and weekly nutrition summaries must be recalculated after a replacement.

Missing nutrition data must not be treated as zero and must not create unsupported nutrition claims.

Allergy safety, dietary preferences, foods to avoid, and age-based protections must be revalidated before applying a replacement.

Chef Nova must not guarantee weight change, muscle gain, athletic performance, recovery, or medical outcomes.

