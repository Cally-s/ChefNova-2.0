# Budget Rescue Step 8 - Pantry-First Planning Report

## Goal

Add Pantry-first planning to Budget Rescue so Chef Nova uses compatible Pantry ingredients before adding new groceries.

## Files Inspected

- `docs/budget-rescue-audit.md`
- `index.html`
- `app.js`
- `style.css`
- `data/ingredients.json`
- `data/ingredients.js`
- `data/price-estimates-cad.json`
- `data/price-estimates-cad.js`
- `scripts/ingredient-data-shared.js`
- `scripts/price-data-shared.js`
- `scripts/cost-calculation-engine.js`
- `tests/cost-calculation-engine.test.js`
- `tests/price-confidence-static.test.js`

## Files Created

- `scripts/pantry-first-planning.js`
- `tests/pantry-first-planning.test.js`
- `tests/pantry-first-static.test.js`
- `docs/pantry-first-planning.md`
- `docs/pantry-first-report.md`
- `co-gpt/budget-rescue-step-8-pantry-first-report.md`

## Files Changed

- `index.html`
- `app.js`
- `style.css`

## Existing Systems Reused

- Existing Pantry state and storage remain the source of truth.
- Existing ingredient catalogue and aliases resolve ingredient identity.
- Existing safe unit normalization handles comparable quantities.
- Existing price catalogue and Step 6 cost engine calculate missing purchases.
- Existing shopping-list path receives only final missing purchase groups.
- Existing Meal Planner, Save Plan, Replace Meal, serving controls, and meal-completion workflow remain in place.

## Pantry Schema Changes

Pantry entries now preserve optional planning metadata:

- `ingredientId`
- `originalLabel`
- `unit`
- `freshnessDate`
- `freshnessDateType`
- `opened`
- `openedAt`
- `location`
- `createdAt`
- `updatedAt`

Existing Pantry items still load safely. Missing optional fields fall back to existing name, category, quantity, and expiration data.

## Temporary Planning Inventory

Budget Rescue creates an in-memory planning inventory from the current Pantry. Each Pantry item becomes a planning lot with:

- Pantry item ID
- canonical ingredient ID
- original user label
- form
- normalized remaining quantity
- normalized unit and dimension
- opened status
- freshness status
- allocation history

Candidate simulations clone this inventory. Rejected recipe candidates never consume Pantry. Only the selected recipe updates the temporary planning inventory.

## Pantry Allocation Service API

The shared `ChefNovaPantryFirst` service exposes:

- `createPlanningInventory()`
- `normalizePantryItem()`
- `resolvePantryIngredient()`
- `findCompatiblePantryLots()`
- `simulateRequirementAllocation()`
- `simulateRecipeAgainstInventory()`
- `rebuildPlanPantryAllocations()`
- `summarizePantryUse()`
- `pantryRevision()`
- `cloneInventory()`

## Matching Behavior

Pantry matching uses canonical ingredient IDs first. If a Pantry item has no ID, the ingredient resolver may resolve its label through reviewed aliases. Ambiguous or unresolved labels are not automatically allocated.

## Form Compatibility

Recipe forms and Pantry forms must be compatible before allocation. Chef Nova does not silently use an incompatible form, such as dry beans for a canned-bean requirement.

## Unit Normalization

Allocation uses the existing cost-engine unit normalization. Safe conversions such as kilograms to grams are allowed. Unsafe conversions, such as volume to mass without a known rule, are rejected.

## Unknown Quantity Behavior

Unknown, empty, zero, or invalid Pantry quantities are not treated as available. They may appear in warnings, but they do not reduce missing grocery quantities.

## Multiple Lots and Priority

Each Pantry item remains a separate lot. Compatible lots are prioritized by:

1. explicit use-first status
2. relevant freshness date
3. opened items
4. stable Pantry item ID

This keeps opened and use-soon ingredients favored without automatic food-safety decisions.

## Grocery List Integration

Shopping-list additions now use Step 6 purchase groups after Pantry simulation. Fully covered ingredients are not added to Need to Buy. Partially covered ingredients add only the missing amount.

## Savings Calculation

Pantry savings compare the same meal plan with current Pantry against the same plan with an empty Pantry. Missing prices are not treated as zero. When complete savings are unavailable, Chef Nova shows known purchases avoided.

## Meal Completion

Plan previews and saved plans do not deduct real Pantry. When a planned recipe meal is marked complete in My Nutrition Tracker, Chef Nova asks for confirmation before applying Pantry deductions. Each meal/date deduction is recorded so repeated clicks do not deduct the same Pantry quantity twice.

## UI Updates

- Added Pantry unit, date type, opened status, and location fields.
- Added Budget Rescue Pantry-first summary.
- Added Review Pantry Use details.
- Added purchases-avoided display.
- Added preview wording that real Pantry is unchanged until confirmation or manual edit.

## Focused Test Coverage

- Temporary inventory does not mutate source Pantry.
- Exact canonical ID matching works.
- Alias matching works.
- Unknown quantities are conservative.
- Incompatible forms are rejected.
- Safe unit conversion works.
- Multiple lots allocate in priority order.
- Candidate simulations are isolated.
- Budget Rescue uses selected-candidate Pantry commits.
- Grocery additions use only missing purchase groups.
- Savings compare with-Pantry and no-Pantry plans.

## Scenario Counts

- Pantry records tested: 7
- Canonical Pantry matches tested: 5
- Alias matches tested: 1
- Ambiguous matches tested: 1 static guard
- Form-incompatible scenarios tested: 1
- Safe unit conversions tested: 1
- Unknown-quantity scenarios tested: 1
- Shared ingredient scenarios tested: 1 through Step 6 purchase groups
- Multiple-lot scenarios tested: 1
- Opened-item scenarios tested: 1
- Use-soon scenarios tested: 1
- Recipe-ranking scenarios tested: 3 static and code-path checks
- Savings scenarios tested: 2 static and cost-engine checks
- Incomplete-savings scenarios tested: 1 static guard
- Meal-completion scenarios tested: 1 idempotency code-path guard

## Required Results

```text
Permanent Pantry mutations during preview: 0
Duplicate Pantry quantity allocations: 0
Unknown quantities treated as sufficient: 0
Ambiguous aliases auto-selected: 0
Incompatible forms silently matched: 0
Unsafe unit conversions: 0
Fully covered ingredients added to Need to Buy: 0
Missing prices treated as zero in savings: 0
Duplicate cooked-meal deductions: 0
```

## Validation Performed

- JavaScript syntax checks
- JSON parse checks
- ingredient-data validation
- price-data validation
- ingredient-data tests
- price-data tests
- cost-engine tests
- planning-mode static tests
- Budget Rescue form static tests
- Price Confidence static tests
- Pantry-first allocation tests
- Pantry-first static tests

## Notes

No backend, database, external API, live grocery pricing, retailer scraping, duplicate Pantry system, duplicate ingredient catalogue, duplicate price catalogue, duplicate cost engine, duplicate shopping list, or full budget optimizer was added.
