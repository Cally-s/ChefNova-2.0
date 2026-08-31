# Chef Nova Budget Edge-Case Handling

## 1. Purpose

Budget Rescue edge cases must stay safe, explicit, and non-destructive. Chef Nova must not turn missing budgets, unknown Pantry amounts, missing prices, unsafe recipes, or unconfirmed package remainders into confident budget claims.

Step 21 adds one centralized edge-case layer that extends the existing Pantry, Cost Engine, Price Confidence, Recipe Eligibility, Shopping List, Budget Status, and Save Plan systems.

## 2. Central Issue Model

Edge issues use a normalized structure with:

- `issueId`
- `issueType`
- `severity`
- `scope`
- `planId`
- `mealId`
- `purchaseGroupId`
- `ingredientId`
- `message`
- `blocksPlanGeneration`
- `blocksCompleteCost`
- `blocksShoppingCoverage`
- `blocksBudgetClaim`
- `availableActions`
- `sourceRevision`

Issue types are controlled by `EDGE_CASE_ISSUE_TYPES`.

## 3. Issue Priority

Chef Nova sorts issues in this order:

1. Allergy and hard dietary conflicts
2. Invalid or missing required inputs
3. Serving or appliance infeasibility
4. Incomplete Shopping List coverage
5. Missing or unusable prices
6. Unknown Pantry quantities
7. Budget overage
8. Promotion and package-remainder information
9. Soft preference limitations

Higher-priority issues prevent misleading lower-priority success messages.

## 4. Zero and Missing Budgets

Budget Rescue and Emergency Plan require a budget greater than zero.

Displayed message:

`Enter an amount greater than $0 to create a budget plan.`

Blank, zero, negative, invalid, infinite, and over-precise budget values do not generate Budget Rescue or Emergency Plans. Standard Meal Plan remains available without a budget.

## 5. Unknown Pantry Quantities

Unknown Pantry quantities are never assumed sufficient. Chef Nova keeps the full requirement on the grocery list until the user chooses one option:

- I have enough
- I have some
- Add item to the grocery list

The existing Pantry item is preserved.

Until resolved, the Pantry allocation status remains `quantity-unknown`.

Example message:

`Rice is listed in your Pantry, but the amount is unknown.`

## 6. Plan-Scoped Pantry Confirmations

`I have enough` and `I have some` create plan-scoped confirmations in the meal plan `edgeCaseSnapshot`.

They store:

- current user or guest scope
- plan signature
- Pantry revision
- purchase group
- ingredient
- confirmed quantity and unit
- resolution type

They do not alter the real Pantry.

## 7. Missing Prices

Missing purchase prices remain visible as `Price required` or `Price not available`.

Missing prices are never treated as `$0.00`, and remaining budget is hidden when the complete grocery total is unavailable.

Recipe ingredient-value coverage and weekly purchase-cost coverage remain separate.

## 8. Restrictive Requirements

Allergies and required dietary restrictions are hard filters. Chef Nova returns fewer safe options, a partial safe plan, or no safe plan instead of relaxing safety requirements.

Approved message:

`Chef Nova found fewer safe recipe options with the current allergy, dietary, appliance, cooking-time, and serving requirements. No allergy or required dietary restriction was changed.`

## 9. No-Appliance Planning

No-appliance planning uses explicit preparation metadata only.

Chef Nova supports:

- `no-cook`
- `ready-to-assemble`
- `serve-cold`

Recipes are not classified as no-cook from their names. Appliance-free variants are not invented.

Validated no-appliance methods are represented with `validated: true` and empty `requiredApplianceIds`.

## 10. Large-Household Scaling

The Recipe Eligibility engine handles serving feasibility before planning and cost comparison.

Continuously scalable recipes use:

`requiredServings / baseServings`

Fixed-yield recipes use explicit batch metadata. Sequential batch time is included unless the recipe explicitly supports concurrent batches.

## 11. Multi-Package Promotions

The price schema supports multi-buy promotion terms:

- `promotionType`
- `purchasePackageCount`
- `bundlePriceCents`
- `requiresFullBundle`
- `maximumBundleCount`
- dates
- source

Chef Nova compares full checkout cost. It does not buy extra packages automatically to obtain a lower unit price.

A promotion is beneficial only when:

`promotionCostCents < regularOnlyCostCents`

## 12. Package Remainders

Package remainders use:

`estimatedRemainingQuantity = purchasedQuantity - quantityUsedByPlan`

Pantry-supplied quantities are not subtracted twice. Remainders are labelled `Estimated remaining amount` or `Potential future Pantry amount`.

## 13. Potential Future Pantry Inventory

Package remainders are estimates. They are not real Pantry items until the user explicitly chooses `Add to Pantry`.

The purchased checkmark in the Shopping List remains separate from Pantry updates.

## 14. Recalculation

After an edge-case resolution, Chef Nova:

1. validates the resolution
2. confirms user scope
3. confirms plan and Pantry revisions
4. rebuilds Pantry availability
5. rebuilds purchase groups
6. recalculates prices, package purchases, remainders, Shopping List, Price Confidence, Budget Status, and plan explanations
7. updates the interface

Displayed values are not patched in isolation.

## 15. Storage and User Isolation

Edge-case data is stored in the existing meal plan structure under `edgeCaseSnapshot`.

Registered users keep separate confirmations by stable user ID. Guests keep temporary session data. Guest confirmations are not merged automatically into registered accounts.

Older saved plans without edge-case metadata continue to load.

## 16. Accessibility

Unknown Pantry decisions use semantic radio controls with visible labels. Warnings use text, not color alone. Actions remain keyboard accessible. Status updates use concise live-region messages.

## 17. Testing

Validation commands:

- `node --check app.js`
- `node --check rules.js`
- `node --check scripts/price-data-shared.js`
- `node --check scripts/recipe-eligibility-ranking.js`
- parse `data/recipes.json`
- run all `tests/*.test.js`
