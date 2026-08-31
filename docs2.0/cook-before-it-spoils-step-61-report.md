# Cook Before It Spoils Step 61 Report

## Goal

Complete Step 61 by adding automated and documented manual tests for small-household portion recommendations and practical recipe scaling.

## Files Created

- `tests/cook-before-it-spoils-step-61-small-household-portions.test.js`
- `docs/cook-before-it-spoils-test-small-household-portions.md`
- `docs/cook-before-it-spoils-step-61-report.md`

## Files Changed

- No product functionality was changed.

## Existing Behavior Inspected

- Smart Portion keeps people eating, servings for tonight, planned leftovers, effective recipe yield, and unallocated servings separate.
- Practical scaling keeps raw math, practical recipe-use quantity, grocery purchase quantity, and package surplus separate.
- Portion Preview is planning-only and blocks unplanned extra servings before confirmation.
- Food Rescue cards use projected wording and do not mutate Pantry from preview.
- Meal Calendar reservations are created only after save/confirmation paths.
- Freezer action tests already protect freezer records from being created before explicit physical freezing.

## Fixed Test Context

- User scope: `portion-test-user`
- Household profile: `portion-test-household`
- Household size: 1
- People eating: 1
- Leftover preference: none
- Requested leftover servings: 0
- Required diet: vegetarian
- Available appliance: stovetop
- Maximum cooking time: 30 minutes
- Local date: August 15, 2026
- Timezone: America/Toronto
- Reference instant: `2026-08-15T12:00:00-04:00`
- Meal: Dinner

## Baseline Recipe

- Recipe ID: `portion-test-lentil-pasta`
- Recipe name: Vegetable Lentil Pasta
- Original recipe yield preserved: 6
- Scaling mode: fully scalable
- Minimum batch: 1 serving
- Cooking time: 25 minutes

## Required Results

- Recommended planned serving result: 1
- Original recipe yield preserved: 6
- Automatic six-serving assignment: 0
- Automatic leftover servings assigned: 0
- Expected prepared-food leftovers: 0
- Scale factor: 1 / 6
- Pasta scaled quantity: 100 g
- Cooked lentils scaled quantity: 80 g
- Tomato sauce scaled quantity: 100 mL
- Spinach scaled quantity: 50 g
- Cooking oil scaled quantity: 5 mL
- Seasoning result: adjust to taste
- Egg rounding decisions displayed: Pass
- Estimated or rounded quantities presented as exact unmodified calculations: 0
- Package remainders described as cooked leftovers: 0
- Full jar forced into one-serving recipe: 0
- Minimum-batch recipes silently reduced to one serving: 0
- Minimum-batch recipes silently selected as four servings: 0
- Fixed-batch recipes silently selected as six servings: 0
- Extra servings generated under No Leftovers: 0
- Allergies bypassed after scaling: 0
- Required dietary restrictions bypassed after scaling: 0
- Appliance restrictions bypassed after scaling: 0
- Maximum cooking-time restrictions bypassed after scaling: 0
- Cooking time divided by six: 0
- Cooking temperature divided by six: 0
- Preview Pantry deductions: 0
- Preview leftover batches: 0
- Preview reservations: 0
- Preview Food Event History physical events: 0
- Preview Impact Ledger entries: 0
- Preview freezer records: 0
- Repeated Save Plan duplicate meals: 0
- Repeated Save Plan duplicate reservations: 0
- Cross-user portion state exposed: 0

## Automated Coverage Added

The Step 61 focused test validates:

- One-person/no-leftovers serving math.
- Original recipe yield remains six servings.
- One-serving practical ingredient scaling.
- Adjust-to-taste display.
- Whole-egg rounding with calculated and adjusted quantities.
- Ratio-sensitive, minimum-batch, and fixed-batch warning paths.
- Leftover preference change to one additional meal and back to No Leftovers.
- Package purchase quantity versus recipe-use quantity.
- Package remainder not counted as prepared-food leftover.
- Pantry allocation and Shopping List demand use scaled quantities.
- Preview creates no Pantry, reservation, event, leftover, freezer, purchase, or impact mutation.
- Save Plan stores one planned serving and scaled reservations.
- Actual meal outcome is the only route to a leftover batch.
- Allergy, dietary, appliance, and time filters remain enforced.
- Cooking time and temperature are not divided by six.
- Determinism, idempotency, reload, partial updates, and old-client preservation.
- Export semantics preserve original yield and one-serving plan.

## Documented Manual Coverage

Manual coverage remains documented for:

- Browser Portion Preview UI.
- Ingredient adjustment wording.
- Minimum-batch warning UI.
- Screen-reader reading order.
- Live-region announcements.
- Keyboard access.
- Mobile widths at 320, 390, and 768 CSS pixels.
- High-contrast and forced-color modes.
- Reduced-motion behavior.
- Print output.
- Authorized structured export.

## Commands Run

Commands run during validation:

```bash
node --check app.js
node --check rules.js
node --check scripts/cost-calculation-engine.js
node --check tests/cook-before-it-spoils-step-61-small-household-portions.test.js
node tests/cook-before-it-spoils-step-61-small-household-portions.test.js
node tests/cook-before-it-spoils-step-13-smart-portion-static.test.js
node tests/cook-before-it-spoils-step-14-practical-scaling.test.js
node tests/cook-before-it-spoils-step-15-portion-preview-static.test.js
node tests/cook-before-it-spoils-step-11-food-rescue-card-static.test.js
node tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js
node tests/cook-before-it-spoils-step-39-meal-calendar-reservations-static.test.js
node tests/cook-before-it-spoils-step-54-unsafe-ineligible-static.test.js
node tests/cook-before-it-spoils-step-57-pantry-reservations.test.js
node tests/cook-before-it-spoils-step-60-freezer-actions.test.js
```

## Validation Summary

- Syntax check result: Pass.
- Step 61 focused portion test result: Pass.
- Smart Portion regression result: Pass.
- Practical scaling regression result: Pass.
- Portion Preview regression result: Pass.
- Food Rescue card regression result: Pass.
- Shopping List regression result: Pass.
- Meal Calendar reservation regression result: Pass.
- Unsafe/ineligible regression result: Pass.
- Pantry reservation regression result: Pass.
- Freezer action regression result: Pass.
- Browser-only accessibility and visual checks: documented manual coverage.

## Notes

- No backend, database, or external API was added.
- No localStorage or sessionStorage keys were changed.
- No duplicate household, scaling, Pantry, Shopping List, or reservation system was created.
- No Git commit was created.

Step 61 completion status: Complete.
