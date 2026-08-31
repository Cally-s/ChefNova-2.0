# Budget Rescue Step 6 - Cost Calculation Engine Report

## Goal

Build one shared cost engine that separates recipe ingredient-use cost from grocery purchase cost.

## Files Inspected

- `docs/budget-rescue-audit.md`
- `scripts/ingredient-data-shared.js`
- `scripts/price-data-shared.js`
- `data/ingredients.json`
- `data/price-estimates-cad.json`
- `data/recipes.json`
- `app.js`
- `index.html`
- `style.css`
- Existing Budget Rescue reports in `co-gpt`

## Files Created

- `scripts/cost-calculation-engine.js`
- `tests/cost-calculation-engine.test.js`
- `docs/cost-calculation-engine.md`
- `docs/cost-engine-report.md`
- `co-gpt/budget-rescue-step-6-cost-engine-report.md`

## Files Changed

- `index.html`
- `app.js`
- `style.css`

## Existing Systems Reused

- Canonical Ingredient Catalogue
- Step 4 unit and ingredient resolver
- Step 5 Price Catalogue
- Step 5 price resolver and active-sale logic
- Existing Pantry state
- Existing Shopping List
- Existing Meal Planner
- Existing Save Plan and Replace Meal workflows
- Existing user-scoped and guest storage patterns

## Cost-Engine API

Primary API:

```javascript
calculateMealPlanCosts({
  meals,
  recipes,
  pantry,
  pricingContext,
  budgetContext,
  ingredientResolver,
  calculationDate
});
```

Supporting functions include:

- `calculateIngredientUseCost`
- `calculateRecipeCostSummary`
- `aggregateIngredientRequirements`
- `calculateWeeklyPurchaseSummary`
- `calculateBudgetVariance`
- `normalizeComparableQuantity`
- `scaleIngredientQuantity`

## Recipe Ingredient-Use Cost Formula

```text
ingredient-use cost = effective price cents * required quantity / priced quantity
```

Ingredient-use cost is based on the amount consumed by the recipe, even when the ingredient is already in the Pantry.

## Grocery Purchase Cost Formula

Package:

```text
packages required = ceil(missing quantity / package quantity)
purchase cost = packages required * package price
```

Unit rate:

```text
purchase cost = effective price cents * missing quantity / priced quantity
```

## Serving Scaling

Recipe quantities scale by:

```text
selected servings / base recipe servings
```

Original recipe data is not modified.

## Unit Normalization

Safe conversions are supported for mass, volume, and same-unit counts:

- kg to g
- g to g
- l to ml
- ml to ml
- tbsp to ml
- tsp to ml
- same count unit to same count unit

Unsafe conversions are rejected.

## Package-Price Behavior

Package purchases round up to whole packages. Package surplus is calculated but not added to Pantry.

## Unit-Rate Behavior

Unit-rate purchases calculate proportionally and do not round to a full kilogram unless a future price entry defines a minimum purchase quantity.

## Pantry Simulation

The engine creates a read-only Pantry simulation and never permanently deducts Pantry quantities.

Unknown Pantry quantities are not subtracted.

## Shared Ingredient Aggregation

Shared ingredients are grouped by ingredient ID, form, and measurement dimension before purchase calculations.

This prevents duplicate checkout costs for the same shared ingredient.

## Package Surplus

For package prices:

```text
surplus = purchased quantity - missing quantity
```

Surplus is never negative and is not written to Pantry.

## Recipe Cost and Cost Per Serving

Recipe cost sums ingredient-use costs. Cost per serving is calculated only when recipe cost is complete.

Incomplete recipe totals show a known subtotal instead of a complete total.

## Weekly Grocery Cost

Weekly grocery cost sums purchase-group costs after shared ingredient aggregation and Pantry subtraction.

Incomplete purchase groups make the weekly total incomplete.

## Budget and Planning Target

Complete weekly totals calculate:

- remaining weekly budget
- amount above weekly budget
- remaining planning target
- amount above planning target

Budget variance is not shown when totals are incomplete.

## Missing Price and Incomplete Totals

Missing prices and missing quantities return explicit statuses. They are never treated as zero.

Known subtotals are labelled as partial values, not complete totals.

## Price Coverage

The engine calculates:

- resolved price coverage
- user-confirmed price coverage
- estimate-based price coverage
- recipe-cost coverage
- purchase-cost coverage

Chef Nova estimates are not counted as user-confirmed.

## Sale Prices

Active sale prices are used through the Step 5 sale logic. Expired sale prices are ignored.

## Test Counts

- Recipes tested: 13 synthetic fixtures plus existing recipe data checks
- Ingredient calculations tested: 22
- Shared-purchase scenarios tested: 2
- Package scenarios tested: 8
- Unit-rate scenarios tested: 1

## Tests Added

- `tests/cost-calculation-engine.test.js`

## Validation Results

Passed:

- `node --check app.js`
- `node --check scripts/cost-calculation-engine.js`
- `node tests/cost-calculation-engine.test.js`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- `node tests/price-data.test.js`

## Deferred

Deferred to later steps:

- Pantry-first recipe selection
- Budget optimization
- Cheaper substitutions
- Leftover planning
- Emergency Plan optimization
- Full Budget Status visual panel
- Complete recipe-card cost redesign
- Store price comparison
- Package optimizer
- Live grocery-price API
- Retailer scraping
- Automatic Pantry deductions

## Confirmations

- No duplicate Ingredient Catalogue, Unit Registry, Price Catalogue, Pantry, Shopping List, Meal Planner, Save Plan workflow, or Replace Meal workflow was created.
- Missing prices and quantities are never treated as zero.
- No incomplete subtotal is presented as a complete grocery total.
- Pantry data is not permanently modified during cost preview.
- Shared ingredients are purchased only once in the weekly calculation.
