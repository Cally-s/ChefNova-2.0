# Step 25 - Nutrition Safety Checks Implementation Report

## Files Changed

- `index.html`
- `app.js`
- `style.css`
- `co-gpt/step-25-nutrition-safety-checks-report.md`

## Nutrition Safety Module

Implemented the centralized Nutrition Safety System inside `app.js` to keep direct `index.html` opening unchanged.

Primary entry:

- `evaluateNutritionSafety(context)`

Related helpers:

- `createNutritionSafetyResult()`
- `addNutritionSafetyNotice()`
- `desiredWeightNeedsReview(profile)`
- `validateEstimatedEnergyTarget(energyEstimate)`

## Central Evaluation Logic

`evaluateNutritionSafety()` returns:

- `canGeneratePersonalizedNutrition`
- `canGenerateWeightChangePlans`
- `useMaintenancePlanning`
- `disableMacroRecommendations`
- `disableEnergyRecommendations`
- `disableGoalAdjustments`
- `requiresProfessionalGuidance`
- `detectedReasons`
- `notices`

Every nutrition-facing feature can reference this safety result.

## Under-18 Handling

Users under 18 trigger:

- maintenance-style planning
- disabled weight-change plan generation
- disabled goal adjustments

Recipes, meal planning, cooking tracker, habit tracking, and Weight Progress remain available.

## Desired-Weight Review

Added broad technical desired-weight review through `desiredWeightNeedsReview(profile)`.

When review is needed, Chef Nova uses maintenance-style planning and shows:

`Your desired weight may need to be reviewed. Chef Nova will use general maintenance-style planning instead.`

The app does not label a goal as unhealthy.

## Rapid-Goal Handling

Future rapid pace values are normalized back to gradual planning.

The UI currently does not offer a rapid pace option.

## Incomplete-Information Handling

When age, height, current weight, or activity level are missing for personalization, Chef Nova disables personalized energy and macro estimates and uses balanced meal planning.

Displayed message:

`There is not enough information to estimate personalized nutrition targets. Chef Nova will recommend balanced meal planning instead.`

## Low-Energy Protection

Added `validateEstimatedEnergyTarget()`.

If a generated estimate is outside the internal safety bounds, Chef Nova does not display it and uses general meal planning.

Displayed message:

`Chef Nova could not safely generate a personalized energy estimate. General meal planning will be used instead.`

Numeric thresholds are not shown to users.

## Pregnancy Preference Handling

Added an optional Nutrition Profile question:

`Are you pregnant or is there another reason that you would prefer not to receive personalized nutrition estimates?`

Options:

- `No`
- `Yes`

No details are requested.

When selected, Chef Nova disables personalized estimates and shows the required professional-guidance message.

## Medical-Preference Handling

Added an optional Nutrition Profile question:

`Would you like Chef Nova to avoid creating personalized nutrition recommendations?`

Options:

- `No`
- `Yes — I would prefer general meal planning only`

Only general preference booleans are stored:

- `avoidPersonalizedNutrition`
- `preferGeneralNutritionOnly`

No diagnoses, medication, history, or details are stored.

## Maintenance Planning

Meal-plan generation now receives the central safety result.

When safety mode is active, Chef Nova continues generating balanced meal plans and disables weight-change scoring adjustments.

## Weekly Nutrition Behavior

Weekly Nutrition still shows recipe nutrition totals.

When personalized recommendations are unavailable, the Estimated Weekly Range area is replaced with:

`Personalized nutrition estimates are currently unavailable. Chef Nova will continue providing recipe nutrition information and meal-planning tools.`

## Meal Planner Behavior

The Meal Plan Generator shows safety notices before generation when applicable.

General meal planning still respects:

- allergies
- dietary preferences
- Pantry
- cooking time
- foods to avoid

## Recipe Personalization Behavior

Recipe personalization now uses the safety result.

When personalized nutrition is unavailable:

- target-based filtering is disabled
- `Fits your nutrition target` style filtering is hidden/disabled
- ordinary recipe descriptions still work, such as higher protein, vegetable-rich, balanced meal, pantry-friendly, and quick meal

## Nutrition Tracker Behavior

Nutrition Tracker remains available.

Safety notices can appear above the tracker, but water, vegetables, cooking streak, workout tracking, notes, and optional weight tracking are not disabled.

## Weight Progress Behavior

Weight Progress continues showing only recorded history.

The professional-guidance notice appears there when the user selected the safety preference.

Weight Progress does not show goal progress, target remaining, or estimated completion.

## User Guide Updates

Added `Nutrition Safety` content to the Instructions modal.

The guide explains that Chef Nova may use general meal planning when:

- information is incomplete
- the user is under 18
- maintenance-style planning is appropriate
- the user prefers not to receive personalized estimates

The guide also states that Chef Nova does not ask for diagnoses or medical details.

## Accessibility

Safety notices are visible text blocks, not tooltips.

The new form controls use labels and standard select fields.

The notices do not rely on color alone.

## Responsive Behavior

Added styling for compact safety panels and the Nutrition Safety Preferences block.

The safety questions and notices wrap within the existing responsive Nutrition Profile form.

## Tests Performed

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parsed `data/recipes.json`
- searched implementation files for safety-system helper names and required notice text
- searched implementation files for prohibited safety wording and reviewed intentional guide/safety matches

## Exact Rules Confirmed

Chef Nova must not generate restrictive nutrition recommendations for users under 18.

Chef Nova must switch to maintenance-style planning when personalized nutrition recommendations cannot be generated safely.

Chef Nova must not ask users to enter diagnoses, medical conditions, medications, or eating-disorder information.

Chef Nova must always display this message when appropriate:

"Chef Nova cannot create specialized plans for pregnancy, medical conditions, eating disorders, or clinical weight treatment. Please speak with a qualified healthcare professional."

General meal planning, recipes, Pantry, cooking, and habit tracking must continue working even when personalized nutrition recommendations are unavailable.

Chef Nova must not guarantee weight change, muscle gain, athletic performance, recovery, pregnancy nutrition, or medical outcomes.

## Notes

No Git commit was created.
