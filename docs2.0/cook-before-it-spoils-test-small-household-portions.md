# Cook Before It Spoils Step 61: Small-Household Portion Tests

## 1. Purpose

These tests verify that Chef Nova recommends practical one-serving plans for a one-person household when no leftovers are requested. Recipe yield, people eating, requested leftovers, planned batch size, package purchases, and prepared-food leftovers must stay separate.

## 2. Fixed Test Context

- Reference local date: August 15, 2026
- Reference timezone: America/Toronto
- Reference instant: `2026-08-15T12:00:00-04:00`
- Meal date: August 15, 2026
- Meal: Dinner

The test does not use real clock time or the CI server timezone.

## 3. Household Fixture

The household fixture uses user `portion-test-user`, household profile `portion-test-household`, one person eating, no requested leftovers, vegetarian dietary restriction, no allergies, stovetop available, and a 30-minute maximum cooking-time preference.

Portion size is based on people eating, recipe serving definitions, user corrections, and leftover preference. It is not based on calorie targets, sex, gender, weight, medical status, pregnancy, exercise, or weight-loss goals.

## 4. Baseline Recipe Fixture

The baseline recipe is `portion-test-lentil-pasta`, Vegetable Lentil Pasta.

- Original recipe yield: 6 servings
- Minimum batch: 1 serving
- Scaling mode: fully scalable
- Cooking time: 25 minutes
- Appliance: stovetop
- Dietary tag: vegetarian

Ingredients:

- Pasta: 600 g
- Cooked lentils: 480 g
- Tomato sauce: 600 mL
- Spinach: 300 g
- Cooking oil: 30 mL
- Seasoning: adjust to taste

## 5. Required Baseline Result

- Original recipe yield: 6 servings
- People eating: 1
- Requested leftovers: 0 servings
- Requested servings: 1
- Scale factor: 1 / 6
- Recommended batch: 1 serving
- Expected leftovers: 0 servings

The original six-serving yield remains recipe metadata. The user is not automatically assigned six servings or extra leftovers.

## 6. Scaled Ingredient Results

Expected one-serving quantities:

- Pasta: 100 g
- Cooked lentils: 80 g
- Tomato sauce: 100 mL
- Spinach: 50 g
- Cooking oil: 5 mL
- Seasoning: adjust to taste

Estimated and rounded quantities must be labelled. They must not appear as exact unmodified calculations.

## 7. Controlled Scaling Modes

The tests use controlled recipe modes: fully scalable, practically scalable, scalable with rounding, minimum batch, fixed batch, ratio sensitive, appliance limited, not scalable, and review required.

A single `scalable: true` value is not enough because different constraints require different behavior.

## 8. Ingredient Scaling Types

The tests use controlled ingredient types: linear, whole indivisible, divisible package, purchase package only, minimum quantity, maximum quantity, range, ratio sensitive, adjust to taste, optional, garnish, and review required.

## 9. Whole Ingredient Rounding

For an egg fixture:

- Default six-serving amount: 3 eggs
- One-serving raw calculation: 0.5 egg
- Practical decision: 1 whole egg

The UI and export must show both the calculated and adjusted quantities. Egg rounding decisions displayed: Pass.

## 10. Package Purchase Versus Recipe Use

For tomato sauce:

- Recipe use: 100 mL
- Store package: 650 mL jar
- Purchase: 1 jar
- Potential package remainder: 550 mL

Package remainder is not a prepared-food leftover. The 550 mL package remainder becomes Pantry inventory only after purchase is confirmed.

## 11. Ratio-Sensitive Recipe

Ratio-sensitive recipes are not silently reduced to one serving when rounding would materially change the recipe. The user sees:

- This recipe cannot be reliably reduced to one serving.
- Smallest reviewed batch: 3 servings.
- Choose a Smaller Recipe.
- Prepare Three and Freeze Two.
- Keep Three Servings.

No extra portions are added automatically under No Leftovers.

## 12. Minimum-Batch Recipe

For `portion-test-minimum-batch-stew`, the smallest reviewed batch is 4 servings. Chef Nova must not reduce it to 1 or silently select 4. The first action under No Leftovers is choosing a one-serving recipe.

## 13. Fixed-Batch Recipe

A fixed six-serving batch cannot be divided automatically. Allowed actions are Choose a Smaller Recipe, Prepare the Full Batch, and Review Freezing Options.

## 14. No-Leftovers Rule

No Leftovers means Chef Nova prefers valid planned batches equal to people eating. It must not add freezer servings, lunch servings, batch-cooking servings, or future leftover meals without explicit user action.

## 15. Leftover Preference Override

Changing the same household to one additional meal produces:

- People eating: 1
- Requested leftovers: 1 serving
- Requested total: 2 servings

Changing back to No Leftovers restores the one-serving result and one-sixth ingredient quantities.

## 16. Cooking Time and Temperature

Cooking time is not divided by six. Food-safety temperatures, cooling requirements, oven temperatures, stovetop requirements, and reheating targets are not divided by the serving ratio.

## 17. Pantry Allocation

Pantry allocation uses scaled demand. For pasta:

- Scaled demand: 100 g
- Pantry available: 350 g
- Preview allocation: 100 g
- Pantry quantity after preview: 350 g
- Reservation after Save Plan: 100 g
- Physical deduction after cooking confirmation: 100 g

The original 600 g demand is not reserved or deducted.

## 18. Shopping List and Cost

Shopping List demand uses scaled recipe demand while checkout cost uses full packages that must be purchased. Recipe-use cost and new grocery spending remain separate.

## 19. Meal Calendar

Saving the baseline meal stores:

- Meal: Vegetable Lentil Pasta
- Planned servings: 1
- People eating: 1
- Planned leftover servings: 0
- Original recipe yield: 6

It does not store six planned servings or create a future leftover meal.

## 20. Leftover Batch Boundary

No leftover batch is created by recommendation, scaling, preview, Save Plan, or Start Cooking. A leftover batch is created only from an actual confirmed meal outcome with a confirmed remainder.

## 21. Freezer Boundary

No Leftovers does not automatically freeze extra servings. Freezing is only offered as an explicit option for larger minimum batches and creates no freezer record before physical freezing confirmation.

## 22. Physical Mutation Boundary

Portion calculation and recipe scaling create no Pantry deduction, Quantity Used event, leftover batch, freezer segment, purchase confirmation, meal completion, discard event, or Impact Ledger entry.

Recipe scaling creates no Food Event History physical event.

## 23. Filters

Allergies, dietary restrictions, appliance restrictions, and maximum cooking time remain enforced before and after scaling. Small ingredient quantities do not make allergens acceptable.

## 24. Determinism and Idempotency

The same household, recipe, leftover preference, policy versions, clock, and timezone produce the same requested servings, scale factor, ingredient quantities, rounding decisions, leftovers, Shopping List demand, and accessible wording.

Repeated Save Plan requests do not duplicate meals, reservations, Shopping List demand, or leftover plans.

## 25. Persistence and Old Clients

Reloaded state preserves original recipe yield 6, planned servings 1, people eating 1, planned leftovers 0, and scaled reservations. Unrelated updates and old-client partial payloads must not reset the meal to six servings.

## 26. Accessibility

Portion Preview, People Eating, Original Recipe Yield, Recommended Batch, Expected Leftovers, ingredient adjustments, and minimum-batch warnings must use visible text. Actions need specific accessible names.

## 27. Mobile, High Contrast, Reduced Motion, Print, and Export

Mobile layouts must stack cleanly without horizontal overflow. High-contrast modes must preserve textual meaning. Reduced motion must avoid dramatic serving-card animations. Print and export must preserve the one-serving plan and scaled ingredients.

## 28. Test Failure Quality

Failures should identify user scope, household profile, recipe ID, original servings, people eating, leftover preference, requested servings, planned servings, expected leftovers, scale factor, ingredient ID, original quantity, calculated quantity, adjusted quantity, scaling mode, minimum batch, fixed local date, and timezone.

## 29. Snapshot Boundary

Snapshots may supplement tests, but direct assertions must cover servings, ingredients, rounding, minimum-batch results, package-use versus package-purchase quantities, reservation quantities, Shopping List demand, physical-state boundary, DOM wording, accessible wording, print semantics, and export semantics.

## 30. Commands

Run these checks:

```bash
node --check app.js
node --check rules.js
node --check scripts/cost-calculation-engine.js
node --check tests/cook-before-it-spoils-step-61-small-household-portions.test.js
node tests/cook-before-it-spoils-step-61-small-household-portions.test.js
```
