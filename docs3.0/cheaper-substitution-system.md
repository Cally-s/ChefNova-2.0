# Chef Nova Cheaper Substitution System

## 1. Purpose

Chef Nova substitutions are reviewed ingredient changes for Budget Rescue planning. They must be safe, recipe-aware, and dynamically priced from the current Pantry, prices, packages, and weekly plan.

## 2. Aliases Versus Substitutions

Aliases identify the same ingredient concept, such as chickpeas and garbanzo beans. Substitutions are different ingredients and are stored only in `data/ingredient-substitutions.json`.

Chef Nova does not resolve lentils as chicken, oat milk as dairy milk, or another different food through alias matching.

## 3. Canonical Rule Schema

Each rule includes `ruleId`, `originalIngredientId`, `alternativeIngredientId`, `allowedRecipeTypes`, `allowedRecipeIds`, `excludedRecipeIds`, `quantityRule`, `active`, and `version`.

Rules may also include forms, preparation adjustments, cooking adjustments, additional ingredients, removed ingredients, automatic-planning flags, confirmation flags, impact summary, and notes.

## 4. Quantity Rules

Supported rule types are `ratio`, `fixed`, `per-serving`, `lookup`, `recipe-specific`, and `manual-required`.

Null or missing ratios are treated as `manual-required`. Chef Nova never treats a null ratio as zero, one, or a universal conversion.

## 5. Recipe Applicability

Rules apply only when the recipe contains the original ingredient occurrence and the rule allows the recipe ID or recipe type. Excluded recipe IDs always block the rule.

## 6. Ingredient Forms and Units

Rules may require forms such as cooked, dry, canned, or fresh. Unsupported forms are rejected.

Safe unit checks use the existing cost engine unit registry. Chef Nova rejects unsafe conversions such as cups to grams unless a reviewed rule supplies a fixed amount or recipe-specific quantity.

## 7. Supporting Ingredient Changes

Rules support explicit `additionalIngredients` and `removedIngredients` arrays. Chef Nova does not add or remove supporting ingredients unless the reviewed rule says so.

The current reviewed database has no active additional-ingredient rules.

## 8. Preparation and Appliance Changes

Rules store preparation text and cooking adjustments separately from recipe instructions. Additional cooking time and required appliances are checked through the existing eligibility path.

## 9. Allergy and Dietary Validation

The resulting recipe variant is checked by the existing Step 9 eligibility engine. Allergy conflicts cannot be overridden.

Chef Nova does not claim a recipe becomes Vegetarian or Vegan unless the complete resulting recipe passes the relevant requirement.

## 10. Recipe Variants

Applying a substitution creates an immutable recipe variant snapshot on the meal entry. The canonical recipe in `data/recipes.json` is not changed.

Variant metadata includes base recipe ID, variant ID, rule ID, rule version, original occurrence ID, original ingredient, replacement ingredient, and visible replacement ingredients.

## 11. Dynamic Savings

Savings use the complete before-and-after weekly plan:

`beforePlan.weeklyGroceryCostCents - afterPlan.weeklyGroceryCostCents`

Savings are never stored in the rule database.

## 12. Pantry and Shared Packages

Before-and-after calculations reuse the existing cost engine, Pantry allocation, and purchase groups. Pantry quantities are simulated during preview and are not permanently deducted.

Shared package effects are handled by recalculating the full plan rather than multiplying one meal's ingredient cost.

## 13. Price Confidence

When either comparison is incomplete, Chef Nova displays that the cost comparison is unavailable. Missing prices are not treated as zero.

Chef Nova estimate fallbacks remain labelled as estimates through the existing Price Confidence system.

## 14. Application Scope

The review UI supports explicit one-meal application and all-compatible-meals application. Chef Nova does not silently change every meal.

## 15. Step 10 Repair Integration

Budget repair calls the shared substitution path before replacing whole meals. Automatic repair uses only rules with `allowAutomaticPlanning: true`, `requiresUserConfirmation: false`, complete quantity conversion, passing hard requirements, complete pricing, and a strictly lower weekly cost.

## 16. Leftover Integration

Substitutions are applied to source meal entries, not independent leftover targets. The existing leftover rebuild runs after changes so source and target relationships are recalculated.

## 17. Apply, Undo, and Revert

Apply revalidates the option, writes a variant meal entry, rebuilds leftovers, and recalculates plan costs. Undo restores the previous draft plan and recalculates from source state.

Use Original Ingredient removes a meal's substitution metadata and restores the base recipe in the preview.

## 18. Save Plan

The existing Save Plan workflow stores substituted meal entries with rule IDs, versions, and variant snapshots. It does not save the full substitution database in each plan.

Older plans without substitution metadata continue to normalize normally.

## 19. Accessibility

Recommendation cards include visible original and alternative ingredient names, savings text, warnings, and keyboard-accessible buttons. The caution about flavour, texture, preparation, and nutrition is shown as readable text.

## 20. Testing

Focused Step 12 tests live in `tests/cheaper-substitution-static.test.js`.

Validation commands include syntax checks, JSON parsing, substitution JSON/JS sync, ingredient validation, price validation, cost engine tests, pantry-first tests, recipe eligibility tests, Budget Rescue static tests, and leftover static tests.

## 21. Deferred Work

Live grocery pricing, retailer inventory, AI-generated substitution rules, medical nutrition advice, and uncontrolled substitution chains are not included.

Choose-meals scope selection and automated browser accessibility testing remain future enhancements.
