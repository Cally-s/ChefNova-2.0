# Cook Before It Spoils Step 14 Report

## Goal

Add practical ingredient scaling for Food Rescue, Smart Portion, Pantry allocation, Shopping List demand, Cost Engine estimates, and Cook This Tonight without creating duplicate systems.

## Files Inspected

Inspected `app.js`, `style.css`, `scripts/cost-calculation-engine.js`, `scripts/pantry-first-planning.js`, `scripts/recipe-eligibility-ranking.js`, `data/recipes.json`, `data/recipes.js`, previous Cook Before It Spoils docs, and existing tests.

## Files Created

- `docs/cook-before-it-spoils-practical-ingredient-scaling.md`
- `docs/cook-before-it-spoils-step-14-report.md`
- `tests/cook-before-it-spoils-step-14-practical-scaling.test.js`

## Files Changed

- `scripts/cost-calculation-engine.js`
- `scripts/pantry-first-planning.js`
- `app.js`
- `style.css`

## Existing Systems Reused

Recipe Database reused: yes. Ingredient Catalogue reused: yes. Unit Registry reused: yes. Pantry allocator reused: yes. Shopping List reused: yes. Cost Engine reused and extended: yes. Smart Portion service reused: yes. Cook This Tonight workflow reused: yes.

## Existing Duplicate Scaling Logic Found

The raw serving calculation appeared in the Cost Engine, Pantry-first allocator, and Food Rescue requirement builder. Step 14 keeps raw math in the Cost Engine and routes practical recipe-use scaling through that shared engine.

## Versions

Scaling-policy version: `1`. Recipe-scale-profile version: `1`. Ingredient-scale-result version: `1`. Recipe-scale-result version: `1`.

## Scaling Rule Precedence

Ingredient occurrence policy, recipe profile occurrence override, recipe profile default, reviewed registry policy, measured-unit default, then conservative legacy review-required fallback.

## Scaling Modes

Linear, whole-item, measured-partial, allowed-fractions, fixed, range, to-taste, linear-with-minimum, linear-with-cap, fixed-plus-variable, ratio-based, review-required, and unsupported.

## Result Structures

Ingredient results include version, recipe id, occurrence id, ingredient id, display name, unit, policy id, policy version, policy source, mode, raw mathematical quantity, practical recipe-use quantity, grocery purchase quantity, package surplus, status, warnings, and explanation.

Recipe results include version, recipe id, policy version, recipe-scale-profile version, scaling class, requested servings, effective servings, base servings, scale factor, status, cycle flag, ingredient results, material adjustments, warnings, and a scaled recipe preview.

## Quantity Behavior

Raw mathematical quantities are preserved. Practical recipe-use quantities are used for Food Rescue coverage, Pantry allocation, selected priority-food sufficiency, Shopping List demand, recipe-use cost, and Cook This Tonight reservations. Grocery purchase quantities remain separate and use the existing package-purchase logic.

## Exact Arithmetic and Display Rounding

Internal calculations use numeric quantities and existing `roundQuantity()` precision. Display formatting still happens at the UI layer with existing formatting helpers.

## Ingredient Behaviors

Linear mass and volume scaling work by reviewed measured-unit default. Whole eggs require explicit policy metadata and support nearest or up rounding. Partial eggs, yolks, whites, egg wash, cans, packages, fixed complete-can rules, leavening, sauces, cooking liquids, appliance capacity, slow-cooker minimums, blender minimums, pan sizes, minimums, maximums, and fixed quantities require explicit policies or recipe profiles. Missing count metadata becomes review-required instead of an invented adjustment.

## Validation Behavior

Unsupported results are blocked from Food Rescue ranking. Review-required results remain visible with explanatory text. Dependency cycles return unsupported. Optional unselected ingredients are excluded from practical scaling.

## Integration Evidence

Food Rescue now creates a practical scale preview before scoring, re-runs hard filters on the scaled recipe, and uses practical quantities for selected-food use, Pantry coverage, purchase metrics, cost, portions, leftovers, and reasons. Smart Portion uses the same path because it recalculates Food Rescue rankings per yield. Cook This Tonight stores the practical scaling result in the serving plan and remains preview-only until confirmation.

## UI, Accessibility, and Responsive Work

Food Rescue cards show a compact ingredient-scaling summary only when needed. The existing modal shows detailed adjusted quantities, review-required quantities, purchase preview, surplus preview, and explanations. Text labels do not rely on color. Mobile layout stacks the summary controls. Forced-colors and print styles include scaling summaries.

## User Isolation and Stale Results

Scaling previews are derived from the active user or guest Pantry, price settings, recipe data, and selected servings at runtime. They do not mutate Pantry, reservations, calendar, Shopping List, Food Event History, Recipe Database, profile, or guest data.

## Tests Added

Added a focused Step 14 test covering explicit whole-egg rounding, measured mass scaling, legacy count review-required behavior, explicit can policy behavior, dependency-cycle rejection, versioned models, and no universal egg-unit rule.

## Validation Performed

- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/cost-calculation-engine.js` - passed
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/pantry-first-planning.js` - passed
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js` - passed
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js` - passed
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js` - passed
- Parsed `data/recipes.json` - passed
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/validate-ingredient-data.js` - passed
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/validate-price-data.js` - passed with known 23% built-in estimate coverage
- `tests/cook-before-it-spoils-step-14-practical-scaling.test.js` - passed
- Full `tests/*.js` suite - passed

## Browser Validation

The in-app browser automation policy blocked direct navigation to `file:///Users/callysu/Downloads/Chef-Nova/index.html`, so no automated browser-console pass was completed. No workaround was attempted. The app remains designed for direct `index.html` opening, and static syntax/data/tests passed.

## Notes and Risks

Current recipe data mostly lacks explicit practical scaling metadata, so legacy count ingredients are conservatively flagged for review instead of automatically rounded. More recipe occurrence policies can be added later without changing the scaler architecture.

Recommended starting point for Step 15: add reviewed recipe occurrence policies to recipes that need practical scaling, starting with eggs, fixed packages, cans, cooking liquids, and baking-sensitive recipes.
