# Step 17 - Personalized Nutrition Meal Planner Implementation Report

## Files Changed

- `index.html`
- `app.js`
- `style.css`
- `co-gpt/step-17-personalized-meal-planner-report.md`

## Generate Suggested Meal Plan Button

Added `Generate Suggested Meal Plan` beside the existing Meal Planner controls.

The generator does not run automatically. The user must select the button.

## Fill Empty Slots Behaviour

`Fill Empty Slots` preserves all existing planned meals and generates suggestions only for empty Breakfast, Lunch, and Dinner slots.

Existing meals are included in the working plan context.

## Replace Entire Plan Behaviour

`Replace Entire Plan` creates a full new Monday-to-Sunday suggested plan.

The saved Meal Planner is not changed until the user selects `Apply Suggested Plan`.

## Preview and Apply Workflow

Generation opens a confirmation modal first:

- Fill Empty Slots
- Replace Entire Plan
- Cancel

Generated results appear as `Suggested Meal Plan Preview`.

Preview actions:

- Apply Suggested Plan
- Regenerate Suggestions
- Cancel

The preview displays each day and meal type with recipe names, cooking time, key tags, pantry match, and suggestion reasons.

## Meal Plan Preferences

Added an optional `Meal Plan Preferences` section with:

- preferred meal styles
- maximum cooking time
- preferred meals or foods
- foods to avoid

Foods to avoid are treated as preferences, not allergy claims.

## Preference Storage

Registered users store preferences in:

`chefNovaMealPlanPreferences_[userId]`

Guest users store preferences in:

`chefNovaGuestMealPlanPreferences`

Guest preferences are cleared when Guest Mode exits.

## Safety-Priority Pipeline

The generator applies:

1. Allergy safety
2. Dietary preference compatibility
3. Foods to avoid
4. Meal-slot compatibility
5. Nutrition planning balance
6. Recipe variety
7. Preferred foods and meal styles
8. Pantry ingredient match
9. Cooking time
10. Goal support

## Allergy Integration

The generator uses the existing allergy logic through `isRecipeSafeForUser(recipe)`.

Allergy conflicts are excluded before scoring.

## Dietary-Preference Integration

The generator uses `matchesDietaryPreferences(recipe, userProfile)` before scoring.

## Daily Nutrition Target Integration

Added `buildMealPlanGenerationContext()` and `buildDailyPlanningRanges(dailyTarget)`.

When a valid Daily Nutrition Target exists, it is used as a flexible planning reference.

When no target exists, Chef Nova can still create a general balanced plan and displays:

`Personalized nutrition-range matching is unavailable. This plan uses general meal variety and your saved preferences.`

## Meal-Distribution Logic

The generator fills Dinners, Lunches, then Breakfasts using the existing Meal Planner slots.

It does not add Snack slots because the current Meal Planner does not support them.

## Nutrition Scoring

Added `calculateMealPlanNutritionScore(recipe, slotContext, generationState, context)`.

Nutrition is a planning signal only. Missing nutrition receives lower priority and is not treated as zero.

## Recipe-Variety Scoring

Added `calculateMealPlanVarietyScore(recipe, generationState, slotContext)`.

The generator avoids unnecessary repeated recipes and repeated dinner protein groups when alternatives exist.

## Protein-Source Variety

Added `getRecipePrimaryProteinGroup(recipe)` with recipe-ingredient-based groups such as poultry, fish, eggs, dairy, beans and lentils, tofu and soy foods, nuts and seeds, beef, pork, and other plant proteins.

## Vegetable and Fruit Variety

The generator rewards recipes with meaningful produce using existing vegetable serving data and normalized ingredient names.

## Carbohydrate-Source Variety

Carbohydrate-containing meals remain eligible and can receive goal or workout support. Carbohydrate-rich meals are not removed for gradual weight change.

## Unsaturated-Fat Source Handling

Added `hasUnsaturatedFatSource(recipe)` using ingredient names such as nuts, seeds, avocado, olive oil, canola oil, salmon, and tahini.

Total fat grams alone are not used to claim unsaturated-fat content.

## Recipe Repetition Limits

Added:

`DEFAULT_MAX_RECIPE_USES_PER_WEEK = 2`

Added `canUseRecipeAgain(recipe, generationState)`.

When eligible options are limited, the preview can explain that some recipes repeat.

## Pantry Integration

Pantry match improves ranking through `calculatePantryMatch(recipe, context.pantryItems)`.

Pantry match does not override allergies.

## Preferred-Food Integration

Preferred foods improve ranking only. They do not override allergies, dietary preferences, foods to avoid, or meal-slot compatibility.

## Cooking-Time Integration

Maximum cooking-time preference influences scoring.

If a suggested plan includes recipes beyond the preferred time because compatible options were limited, the preview explains that.

## Goal-Type Integration

The generator uses the existing goal score helper, including maintain-current-weight, build-muscle, improve-eating-habits, support-workouts, gradual-weight-change, prefer-not-to-choose, and null/general cases.

Goals adjust ranking gently.

## Workout-Goal Integration

Workout-friendly scoring uses the existing workout profile context and remains general.

No performance guarantees or supplement suggestions were added.

## Missing-Nutrition Behaviour

Recipes with missing nutrition are not treated as zero.

The preview reduces nutrition-data coverage and may show:

`Some nutrition information is unavailable`

## Minor Protections

For users under 18, the preview displays:

`For users under 18, suggested meal plans focus on regular balanced meals, food variety, and activity support rather than calorie restriction.`

The generator does not create restriction-based plans.

## Shopping List Integration

Generating a plan does not add Shopping List items.

After a suggested plan is applied, Chef Nova shows:

`Add Missing Ingredients to Shopping List`

The action compares recipe ingredients with Pantry and existing Shopping List items, avoids duplicates, and respects allergy/avoidance checks.

## Account Isolation

Preference storage is user-specific for registered users.

Pending generated previews are cleared during account or guest transitions.

## Guest Mode Behaviour

Guest users can generate and apply suggested plans using session data.

Applied guest plans and guest preferences remain temporary in sessionStorage and are cleared when Guest Mode exits.

## Privacy Result

Chef Nova does not store:

- recipe scores
- rejected recipe lists
- remaining nutrient calculations
- private profile calculation details
- allergy evaluation traces

No backend, database, or external API was added.

## Accessibility Result

Added:

- visible Generate Suggested Meal Plan button
- accessible modal heading
- Escape close support
- click-outside close support
- focus return to the original control
- basic focus trapping inside the modal
- clear day and meal headings in preview
- one polite live region for preview creation

## Responsive Result

The preference panel, preview cards, nutrition summary, and modal actions stack on mobile and avoid horizontal overflow.

## Required Rules

Generate Suggested Meal Plan must remain optional and must show a preview before changing the saved Meal Planner.

Allergy safety and dietary preference compatibility must be applied before nutrition scoring, Pantry matching, cooking-time preferences, or goal-based ranking.

The suggested plan must consider estimated daily nutrition ranges, Pantry ingredients, preferred meals, cooking time, recipe variety, and goal type.

The meal-plan generator must not simply choose the lowest-calorie recipes.

Each generated day should aim for food variety, protein sources, vegetables and fruit, carbohydrate sources, and sources of unsaturated fats.

The generated week should avoid unnecessary recipe repetition and should use multiple protein and carbohydrate sources when compatible recipes are available.

Generated meal plans must remain editable and must not be saved until the user selects Apply Suggested Plan.

Missing nutrition data must not be treated as zero, and Chef Nova must not invent nutrition values.

Chef Nova must not guarantee weight loss, muscle gain, improved athletic performance, or medical outcomes.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- Parsed `data/recipes.json` successfully.
- Confirmed 35 recipes have usable meal-plan data.
- Confirmed generator functions, modal hooks, preview hooks, preference UI, and applied-plan shopping action are present.
- Ran a prohibited wording scan across `app.js`, `index.html`, `style.css`, `data/recipes.json`, and `data/recipes.js`.

## Notes

This implementation keeps the app front-end only and preserves direct `index.html` opening support.
