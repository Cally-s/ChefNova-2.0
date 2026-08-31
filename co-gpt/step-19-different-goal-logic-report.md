# Step 19 - Different Goal Logic Implementation Report

## Files Changed

- `app.js`
- `index.html`
- `style.css`
- `co-gpt/step-19-different-goal-logic-report.md`

## Canonical Goal Strategy Object

Added `MEAL_PLAN_GOAL_STRATEGIES` with the canonical stored goal values:

- `maintain-current-weight`
- `support-workouts`
- `build-muscle`
- `gradual-weight-change`
- `improve-eating-habits`
- `prefer-not-to-choose`

Null or unknown goals fall back to `prefer-not-to-choose`.

## Goal-Scoring Router

Updated `calculateMealPlanGoalScore(recipe, slotContext, generationState, context)` so each goal has separate scoring logic.

Goal Match remains capped at 15 points and stays one part of the full 100-point meal-plan score.

## Maintain Current Weight Logic

Added `scoreMaintainWeightRecipe()`.

Maintain current weight must prioritize balanced meals, estimated energy consistency, food variety, and user preferences.

## Estimated Energy Consistency Logic

Added `supportsConsistentDailyEnergy()`.

It uses flexible estimated progress ranges and does not require identical daily totals.

## Support Workouts Logic

Added `scoreWorkoutSupportRecipe()`.

Support workouts must prioritize protein sources across the day, carbohydrate sources around activity when timing is known, hydration reminders, and recovery-style meals without guaranteeing athletic results.

## Protein-Across-the-Day Logic

Added `contributesProteinAcrossDay()`.

This is a general planning signal only, not an exact requirement.

## Activity Carbohydrate Timing

Added `supportsActivityCarbohydrates()` and `normalizeWorkoutTiming()`.

Known timing can gently prioritize carbohydrate-containing meals around activity. Unknown timing uses general active-day planning and does not invent a workout time.

## Hydration Reminder

The generated preview now shows one hydration reminder for Support workouts:

`Remember to drink regularly, especially around activity.`

No exact water prescription was added.

## Recovery-Style Meal Handling

Added `isRecoveryStyleMeal()` and `isLikelyPostActivitySlot()`.

The app uses neutral phrases like `Post-activity option`.

## Build Muscle Logic

Added `scoreBuildMuscleRecipe()`.

Build muscle must prioritize regular meals, protein-containing foods, sufficient estimated energy, and carbohydrate sources for training without promising muscle gain or prescribing supplements.

## Protein Distribution

Added `evaluateProteinDistribution()` and goal-specific daily checks that can identify limited protein distribution using neutral internal issue codes.

## Estimated Energy Support

Added `supportsAdequateEstimatedEnergy()`.

It uses existing flexible target ranges when available and does not add aggressive surplus logic.

## No-Muscle-Gain Guarantee

The preview states that Chef Nova does not guarantee muscle gain.

## Adult Gradual-Weight-Change Logic

Added `scoreAdultGradualWeightChangeRecipe()` and `scoreGradualWeightChangeRecipe()`.

For adults selecting Gradually change weight, Chef Nova must use only the existing mild adjustment in the Daily Nutrition Target and must not apply a second reduction.

## No-Double-Adjustment Protection

No logic was added that subtracts calories again, changes servings automatically, removes meals, or penalizes carbohydrate or fat foods.

## Safe Macro Balance

Added `supportsSafeMacroBalance()` and `isBalancedNutritionPattern()`.

Adult gradual-weight-change scoring uses flexible macro ranges instead of restriction rules.

## Extreme-Restriction Guard

Added `validateGeneratedDayAgainstRestriction()`.

Internal guard codes can help replacement logic improve generated days without displaying numeric thresholds to users.

## Maintenance-Style Option

Added `Use Maintenance-Style Plan Instead` to Meal Plan Preferences.

The preference is stored inside meal-plan preferences as `useMaintenanceStylePlan` and does not modify the saved Nutrition Profile goal.

## Minor Gradual-Weight-Change Protection

For users under 18 selecting Gradually change weight, Chef Nova must not create a calorie-deficit plan and must use balanced maintenance-style planning with a professional-guidance notice.

## Unknown-Age Behaviour

When age is unknown, Gradually change weight must use maintenance-style planning and must not create a deficit.

## Professional-Guidance Notice

The exact minor notice appears in Meal Plan Preferences and in the generated preview.

## Improve Eating Habits Logic

Added `scoreImproveEatingHabitsRecipe()`.

This prioritizes vegetables and fruit, fibre-containing options when data exists, balanced meals, variety, and user preferences.

## Prefer Not to Choose Fallback

Added `scoreGeneralBalancedRecipe()`.

This uses balanced meals, produce, variety, preferences, Pantry, and practical cooking time without assuming a weight or performance goal.

## Goal-Specific Daily Evaluation

Added `evaluateGoalSpecificDayPattern()` with goal-specific daily helpers for workout support, build muscle, gradual weight change, eating habits, and general balanced planning.

## Goal-Specific Replacement Logic

The replacement pass can now respond to neutral goal-specific issue codes, while still replacing only generated meals and never protected manual meals in Fill Empty Slots mode.

## Preview Goal Explanations

Added `buildMealPlanGoalExplanation()` and `renderMealPlanGoalExplanation()`.

The preview now includes `How this plan supports your goal` with safe goal-specific wording.

## Allergy Priority

Goal logic must adjust recipe ranking gently and must never override allergy safety, dietary preferences, foods to avoid, or age-based protections.

Allergy checks still run before scoring.

## Dietary Preference Priority

Dietary checks still run before Goal Match, Pantry Match, nutrition scoring, recipe variety, or cooking-time scoring.

## Guest Mode Behaviour

Goal logic uses the active generation context. Guest meal-plan preferences remain in guest session storage.

## Account Isolation

Goal logic uses the current active profile, active meal-plan preferences, active Pantry, and active Meal Planner context only.

## Privacy Result

No external APIs were added.

The strategy object stores public goal labels and priorities only. It does not store private profile data.

## Accessibility Result

The maintenance-style option has a visible label. Goal explanations use headings. Notices are visible text, not tooltips.

## Responsive Result

The maintenance-style option uses the existing Meal Plan Preferences grid and can wrap on small screens.

## Required Rule Confirmation

Goal logic must adjust recipe ranking gently and must never override allergy safety, dietary preferences, foods to avoid, or age-based protections.

Maintain current weight must prioritize balanced meals, estimated energy consistency, food variety, and user preferences.

Support workouts must prioritize protein sources across the day, carbohydrate sources around activity when timing is known, hydration reminders, and recovery-style meals without guaranteeing athletic results.

Build muscle must prioritize regular meals, protein-containing foods, sufficient estimated energy, and carbohydrate sources for training without promising muscle gain or prescribing supplements.

For adults selecting Gradually change weight, Chef Nova must use only the existing mild adjustment in the Daily Nutrition Target and must not apply a second reduction.

Adult gradual-weight-change plans must keep regular meals, remain inside flexible safe macronutrient ranges, avoid extreme restriction, and allow maintenance-style planning.

For users under 18 selecting Gradually change weight, Chef Nova must not create a calorie-deficit plan and must use balanced maintenance-style planning with a professional-guidance notice.

When age is unknown, Gradually change weight must use maintenance-style planning and must not create a deficit.

The meal-plan generator must not rank the lowest-calorie recipes as automatically better.

Chef Nova must not guarantee weight change, muscle gain, athletic performance, recovery, or medical outcomes.

Do not create a Git commit unless requested.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parsed `data/recipes.json` successfully
- confirmed new goal functions exist in `app.js`
- scanned app files for prohibited promise, restriction, and unsupported goal wording
