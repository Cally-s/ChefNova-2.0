# Chef Nova Cost Calculation Engine

## 1. Purpose

The cost engine separates recipe ingredient-use cost from grocery purchase cost.

Ingredient-use cost estimates the value consumed by a recipe. Grocery purchase cost estimates what may need to be paid at checkout.

## 2. Calculation Inputs

Inputs include planned meals, recipe servings, structured ingredients, Pantry items, selected price source, price profiles, Chef Nova estimates, and Budget Rescue budget settings.

## 3. Ingredient-Use Cost

Formula:

```text
ingredient-use cost = effective price cents * required quantity / priced quantity
```

This is calculated even when an ingredient is already in the Pantry.

## 4. Recipe Cost

Recipe cost is the sum of resolved ingredient-use costs. Cost per serving is calculated only when the recipe total is complete.

## 5. Pantry Application

Pantry quantities are applied in a read-only simulation. The real Pantry is never deducted during preview calculations.

## 6. Shared Ingredient Aggregation

Shared ingredient requirements are combined before purchase math. This prevents buying the same package multiple times for different recipes.

## 7. Package Purchase Cost

Package prices round up to full packages:

```text
packages required = ceil(missing quantity / package quantity)
purchase cost = packages required * package price
```

## 8. Unit-Rate Purchase Cost

Unit-rate prices calculate proportionally:

```text
purchase cost = effective price cents * missing quantity / priced quantity
```

## 9. Unit Compatibility

Safe conversions include kg to g, g to g, l to ml, ml to ml, tbsp to ml, and tsp to ml.

Chef Nova does not use universal cup-to-gram, count-to-weight, or can-to-gram conversions.

## 10. Ranges and Unquantified Ingredients

Range ingredients return minimum and maximum ingredient-use costs. Grocery purchase planning uses the upper quantity.

Unquantified ingredients return `missing-quantity` and do not count as free.

## 11. Weekly Grocery Cost

Weekly grocery cost is complete only when every required purchase group has a resolved purchase cost.

When incomplete, Chef Nova reports a known subtotal and explains that the final total may be higher.

## 12. Budget Variance

Budget variance uses the complete weekly grocery cost:

```text
remaining budget = max(0, weekly budget - grocery cost)
amount above budget = max(0, grocery cost - weekly budget)
```

Planning-target variance uses the budget after the selected cushion.

## 13. Price Coverage

Resolved coverage counts all usable prices. User-confirmed coverage counts user-entered and saved store-profile prices only.

Chef Nova estimates are resolved, but they are not user-confirmed.

## 14. Missing Prices

Missing prices are never zero. They return `missing-price` and make complete totals unavailable.

## 15. Calculation Statuses

Statuses include `resolved`, `estimated`, `incomplete`, `no-purchases-required`, `missing-price`, `missing-quantity`, `incompatible-unit`, `unknown-package-size`, `ambiguous-ingredient`, `unknown-pantry-quantity`, `form-mismatch`, and `excluded`.

## 16. Rounding

Money is stored and returned as integer cents. Quantities are rounded to six decimal places to avoid package-count drift.

## 17. Sale Prices

Active sale prices are used through the Step 5 price logic. Expired sale prices are ignored and regular price remains available.

## 18. Saved Plans

Costs are derived from current recipes, servings, Pantry, prices, and budget settings. Saved plans without cost data still load normally.

## 19. Testing

Run:

```bash
node tests/cost-calculation-engine.test.js
node --check scripts/cost-calculation-engine.js
node --check app.js
```

## 20. Deferred Work

Budget optimization, cheaper substitutions, package comparison, pantry-first recipe selection, full Budget Status panels, and live grocery prices are deferred to later steps.
