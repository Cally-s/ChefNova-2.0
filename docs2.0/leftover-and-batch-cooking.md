# Chef Nova Leftover and Batch-Cooking Intelligence

## 1. Purpose

Planned leftovers help Budget Rescue reduce grocery cost and cooking effort by preparing extra servings once and reserving them for a later meal.

## 2. User Setting

Budget Rescue includes the setting: **Use planned leftovers to reduce cost?**

The default is No. When No is selected, Chef Nova does not intentionally increase servings or create leftover relationships.

When Yes is selected, Chef Nova may batch-cook eligible recipes when the recipe has explicit leftover metadata.

## 3. Recipe Metadata

Recipes use explicit `batchCooking` and `leftovers` fields.

Batch metadata defines serving ranges, serving increments, maximum batch size, maximum batch count, and time scaling.

Leftover metadata defines storage method, storage window, supported target meals, minimum leftover servings, and reheating methods.

## 4. Source Meals

A source meal remains a normal meal-plan entry.

It may include:

- `plannedRecipeServings`
- `householdServings`
- `reservedLeftoverServings`
- `unallocatedSurplusServings`
- `leftoverAllocationIds`
- `leftoverTargets`

The source batch owns the base recipe grocery cost.

## 5. Leftover Meals

A leftover meal remains in the existing weekly planner.

It references:

- `leftoverFromMealId`
- `leftoverAllocationId`
- `recipeId`
- `servings`
- `reheatingMethodId`

The leftover meal is displayed as a planned leftover and is not treated as a second newly cooked recipe.

## 6. Leftover Ledger

The plan stores a plan-scoped leftover ledger.

Serving conservation is required:

```text
servingsCreated = servingsReserved + servingsRemainingUnreserved
```

Ledger IDs are stable and derived from source slot, target slot, and recipe.

## 7. Storage and Reheating Validation

Chef Nova uses only explicit recipe metadata.

It does not invent food-storage rules, reheating methods, or safety windows.

User-facing text says the leftover is scheduled within the recipe's supported storage window. It does not guarantee food safety.

## 8. Batch Option Generation

Chef Nova generates bounded batch options only when a future compatible meal slot exists.

Batch options respect serving limits, serving increments, batch count, appliances, and time limits.

## 9. Step 10 Integration

The Step 10 Budget Rescue algorithm constructs the first safe plan, then applies planned leftovers when enabled.

Leftover targets replace later full recipe meals only when the source recipe supports the target meal type and reheating requirements.

## 10. Cost Accounting

The source meal is charged once using `plannedRecipeServings`.

The leftover target meal is skipped by the base recipe grocery-cost calculation so its ingredients are not counted twice.

## 11. Additional Ingredients

Step 11 supports the data structure for additional leftover ingredients.

The current recipe metadata does not define extra ingredients, so generated leftover meals currently use zero additional grocery cost.

## 12. Savings Calculation

Chef Nova compares the actual leftover plan with a deterministic no-leftover counterfactual.

Savings are shown only when both plans have complete comparable grocery totals.

Missing prices are not treated as zero.

## 13. Cooking Sessions

A full cooking session is a scheduled preparation event for a complete recipe.

A reheated leftover meal does not count as another full cooking session, but reheating sessions are counted separately.

## 14. Calendar Display

Source meals show cook, serve, reserve, and surplus details.

Leftover meals show source meal, servings, reheating method, and additional grocery cost.

## 15. Independent Replacement

The existing Replace Meal workflow works for leftover targets.

When a target is replaced, Chef Nova releases the reservation and recalculates source servings, costs, price confidence, and benefits.

## 16. Source Meal Changes

If a source meal is replaced or removed, dependent leftover meals are flagged as needing replacement.

Chef Nova does not silently leave orphaned leftover meals as valid.

## 17. Meal Completion

Chef Nova reuses the existing meal-completion system where available.

Step 11 does not create a prepared-food Pantry or automatically move leftovers into Pantry.

## 18. Save Plan

The existing Save Plan workflow stores leftover relationships in the meal plan.

Older plans without leftover metadata remain valid.

## 19. Accessibility

The planned-leftover setting uses semantic radio inputs.

Cards identify source and leftover meals with text, not color or connecting lines alone.

## 20. Testing

Run:

```bash
node --check app.js
node --check data/recipes.js
node tests/leftover-batch-cooking-static.test.js
```

## 21. Deferred Work

Prepared-food inventory, broader leftover management, live food-safety data, complete extra-side costing, and emergency optimization remain deferred.
