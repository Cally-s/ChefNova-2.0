# Cook Before It Spoils Shopping List Integration

## Goal

Connect food-rescue Pantry availability to the existing Shopping List so Chef Nova can show what not to buy, what to buy only in a missing amount, and what to check before shopping.

## Existing Systems Reused

- Existing Shopping List view, storage, filters, item actions, and price review.
- Existing Pantry data, Pantry-first allocation, reservations, use-first dates, and quantity confidence.
- Existing Meal Planner demand and recipe ingredient records.
- Existing Price Catalogue, Cost Engine, Budget Status, Food Event History, Impact Ledger, and user-scoped storage.

## Shopping List Pantry-Allocation Resolver

The Shopping List now reads Pantry-first allocation rows through `getShoppingAllocationRowsByIngredient()`.

Those rows keep exact Pantry lot evidence:

- Pantry item ID.
- Original label.
- Ingredient ID.
- Form.
- Quantity and unit.
- Opened state.
- Use-soon status.
- Freshness date.
- Estimated remaining quantity.

The resolver does not create Pantry items, merge Pantry lots, or deduct Pantry quantity.

## Ingredient-Demand Resolver

`createShoppingListNeedResolution()` links current meal-plan demand to a canonical ingredient ID, required form, required quantity, source meals, Pantry supply, missing demand, and purchase resolution.

Demand is resolved from the current plan and existing cost-engine purchase groups. The Shopping List remains the purchase-facing surface.

Shopping List demand uses scaled recipe demand from the current portion plan. Checkout cost still uses full package purchases when a store package must be bought whole.

## Supply-Status Model

Shopping lines now include a shared `supplyStatus` value:

- `fully-covered-at-home`
- `partially-covered-at-home`
- `reserved-for-this-plan`
- `reserved-for-other-commitment`
- `purchase-required`
- `optional-purchase`
- `user-extra-purchase`
- `quantity-review-required`
- `date-review-required`
- `safety-review-required`
- `incompatible-at-home`

Unknown Pantry quantity becomes `quantity-review-required`. It is not treated as zero or sufficient.

## Line-Provenance Model

Shopping lines now include a shared `origin` value:

- `plan-required`
- `user-manual`
- `user-kept-extra`
- `optional-recipe-item`
- `substitution`
- `emergency-plan`
- `imported`

This keeps plan-required purchases separate from manual items and user-kept extras.

## Do Not Buy Derived Section

The Shopping List renders `Do Not Buy — Already Available` when Pantry fully covers current plan demand.

This section is advisory only:

- It is not a purchase line.
- It is not a zero-cost item.
- It is not checked off.
- It does not mutate Pantry.
- It does not post Food Event History.
- It does not post Impact Ledger credit.
- It does not change checkout cost.

## Buy Only Missing Amount

The Shopping List renders `Use What You Have — Buy Only the Missing Amount` when Pantry covers part of the plan demand.

The displayed missing quantity comes from the cost-engine purchase group and Pantry-first allocation. Checkout cost still uses full compatible package prices and shared packages are counted once.

## Check Before Buying

The Shopping List renders `Check Before Buying` when quantity confidence is unknown or needs review.

Chef Nova asks the user to check Pantry instead of assuming the item is sufficient or unavailable.

## Reserved Quantities

Reservation-aware rows keep Pantry quantities protected. Food already reserved for this plan can satisfy this plan. Food reserved for another commitment is not silently consumed by the current Shopping List.

## Duplicate-Purchase Advisory

Manual or user-added Shopping List lines receive a duplicate advisory when Chef Nova finds matching Pantry supply that already needs attention.

Wording:

> You already have baby spinach that needs attention. Adding another package may increase the chance of food remaining unused.

Actions:

- Keep New Package.
- Remove from Shopping List.
- Review Pantry Item.

The warning is non-blocking and respectful.

## Keep New Package

`keepDuplicateShoppingPackage()` marks the line as a user-kept extra. It preserves the user choice and recalculates the Shopping List without changing Pantry or impact data.

## Remove From Shopping List

`removeDuplicateShoppingPackage()` removes optional duplicate purchases. It does not change Pantry. Plan-required lines with remaining missing quantity stay protected.

## Review Pantry Item

`reviewShoppingPantryItem()` opens the Pantry page so the user can review the related Pantry item directly.

## Planning-Only Boundary

Shopping List planning actions must not create physical food events.

They do not create:

- Quantity Used.
- Consumed.
- Frozen.
- Thawed.
- Discarded.
- Donated.
- Possible Food Waste Avoided.
- Estimated Money Saved.
- Impact credit.
- Pantry deduction.

Confirmed Pantry events remain handled by Pantry workflows only.

## Cost Semantics

Pantry supply lowers the amount that needs to be bought. It does not become checkout money.

Checkout cost uses:

- Missing demand.
- Full package requirements.
- Shared weekly package counting.
- Existing Price Catalogue data.
- Existing Cost Engine calculations.

Missing prices are still review items, never free items.

## Safety and Eligibility

The resolver respects existing allergy, dietary, form, safety, date, and reservation logic from the Pantry-first planner and hard-filter systems.

## User Storage

Shopping List changes use existing user-scoped Shopping List storage and existing guest session behavior. No new storage system is created.

## No Duplicate Systems

Created duplicate systems:

- Second Shopping List: 0.
- Second Pantry: 0.
- Second Recipe Database: 0.
- Second Price Catalogue: 0.
- Second Cost Engine: 0.
- Separate Do Not Buy database: 0.

## Validation Approach

Validation covers syntax checks, JSON parsing, existing cost/Pantry tests, and a focused Step 38 static test.
