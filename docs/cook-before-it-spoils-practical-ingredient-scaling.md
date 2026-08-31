# Chef Nova Practical Ingredient Scaling

## Purpose

Step 14 upgrades serving scaling so Chef Nova separates exact math from practical cooking amounts and grocery purchase quantities.

## Systems Reused

Chef Nova still uses one Recipe Database, one Ingredient Catalogue, one Unit Registry, one Pantry allocator, one Shopping List, one Cost Engine, one Smart Portion service, and one Cook This Tonight workflow.

## Source of Truth

The Cost Engine is the serving-scaling source of truth. `scaleIngredientQuantity()` remains the raw mathematical helper. `scaleIngredientQuantityWithPracticalRules()` and `scaleRecipeWithPracticalRules()` add versioned practical rules on top of that helper.

## Versions

- Ingredient scaling policy version: `1`
- Recipe scaling profile version: `1`
- Ingredient scale result version: `1`
- Recipe scale result version: `1`

## Scaling Rule Precedence

Chef Nova resolves scaling rules in this order:

1. Ingredient occurrence policy on the recipe ingredient.
2. Recipe scaling profile override for that occurrence.
3. Recipe scaling profile default policy.
4. Reviewed central ingredient policy registry.
5. Conservative measured-unit default for mass and volume.
6. Review-required legacy count fallback.

## Scaling Modes

Supported modes are linear, whole-item, measured-partial, allowed-fractions, fixed, range, to-taste, linear-with-minimum, linear-with-cap, fixed-plus-variable, ratio-based, review-required, and unsupported.

## Quantity Model

Each ingredient result keeps three quantities separate:

- Raw mathematical quantity: exact scaled amount before practical policy.
- Practical recipe-use quantity: amount used for Pantry allocation, Food Rescue coverage, selected-food sufficiency, recipe-use cost, and reservations.
- Grocery purchase quantity: full package or unit-rate amount estimated by the existing purchase engine.

## Whole Items

Whole-item adjustments require explicit metadata such as `scalingPolicyId: "whole-egg-round-up"`. Chef Nova does not round an ingredient only because a unit or name looks like an egg, can, jar, or package.

## Eggs

Whole eggs, yolks, whites, and egg wash remain distinct because policies attach to recipe occurrences or explicit reviewed policy IDs. Partial eggs require a measured-partial policy. Without metadata, legacy count quantities are flagged review-required instead of rounded.

## Cans and Packages

Can and package rules require explicit policy metadata. Recipe-use amounts stay separate from checkout purchase amounts. Package surplus is calculated as a preview and is not automatically added to Pantry.

## Baking and Appliance Limits

Recipe scaling profiles can mark recipes as general, baking-sensitive, fixed-yield, or appliance-limited. Unsupported profiles return unsupported instead of inventing baking, leavening, pan-size, slow-cooker, blender, or appliance-capacity assumptions.

## Pantry, Shopping, and Cost Integration

The Pantry-first allocator now calls the practical scaler when available. Food Rescue rankings scale the recipe first, re-run hard filters, then calculate selected-food use, Pantry coverage, missing grocery groups, cost, leftovers, and score from the practical recipe preview.

## Smart Portion and Cook This Tonight

Smart Portion already reruns Food Rescue ranking for each candidate yield. Because Food Rescue now uses practical scaling, unsupported practical profiles are not recommended. Cook This Tonight stores the practical scaling result in the draft serving plan and still waits for confirmation before creating reservations or Pantry deductions.

## Accessibility and Display

Food Rescue cards show a concise ingredient-scaling summary when adjustments or review-required quantities exist. The existing modal displays calculated quantity, practical recipe use, grocery purchase preview, surplus preview, and explanations. Text is used in addition to color.

## Guest and User Isolation

Scaling previews are derived at runtime. They do not write Pantry, Shopping List, reservations, calendar, Food Event History, recipe data, or account data. Registered users and guests keep their existing storage boundaries.

## Legacy Migration

Legacy measured mass and volume ingredients continue to scale linearly. Legacy count units keep the raw mathematical quantity and receive review-required status unless explicit policy metadata exists.
