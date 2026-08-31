# Cook Before It Spoils Step 38 Report

## Goal

Integrate food-rescue Pantry allocations into the existing Chef Nova Shopping List so users can see what is already available, what only needs a missing amount, and what should be checked before buying.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-shopping-list-integration.md`
- `docs/cook-before-it-spoils-step-38-report.md`
- `tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js`

## Implementation Summary

The Shopping List now resolves plan demand against Pantry-first allocation rows before rendering purchase guidance.

Added:

- Shopping List Pantry-allocation resolver.
- Ingredient-demand resolver.
- Supply-status model.
- Line-provenance model.
- Derived Do Not Buy section.
- Buy Only Missing Amount section.
- Check Before Buying section.
- Reserved Pantry quantity section.
- Duplicate-purchase advisory.
- Keep New Package action.
- Remove from Shopping List action.
- Review Pantry Item action.
- Focused static validation.

## Shopping List Integration

The implementation reuses the existing Shopping List, Pantry, Meal Planner, Pantry-first allocation, Cost Engine, Price Catalogue, Budget Status, Food Event History, Impact Ledger, and user storage.

No duplicate shopping, rescue, cost, Pantry, or recipe systems were created.

## Data Model Additions

Added versioned Shopping List planning metadata:

- `shoppingListNeedResolutionVersion`
- `shoppingListSupplyStatusVersion`
- `lineProvenanceVersion`
- `duplicatePurchaseAdvisoryVersion`

Each resolved Shopping List line can now include:

- `origin`
- `supplyStatus`
- `needResolution`
- `pantrySupply`
- `missingDemand`
- `purchaseResolution`
- `sourceRevisions`
- `duplicatePurchaseAdvisory`

## Supply Statuses

Supported statuses:

- Fully covered at home.
- Partially covered at home.
- Reserved for this plan.
- Reserved for another commitment.
- Purchase required.
- Optional purchase.
- User-requested extra.
- Check quantity before buying.
- Check date before buying.
- Safety review required.
- Incompatible at-home item.

## Line Provenance

Supported origins:

- Plan required.
- User manual.
- User-kept extra.
- Optional recipe item.
- Substitution.
- Emergency plan.
- Imported.

## Derived Do Not Buy Section

The section `Do Not Buy — Already Available` is derived from Pantry-first allocation evidence.

It is advisory only and does not add purchase lines, zero-cost lines, checkoff lines, Pantry mutations, Food Event History entries, or Impact Ledger entries.

## Buy Missing Amount

The section `Use What You Have — Buy Only the Missing Amount` shows partial Pantry coverage and the remaining quantity needed.

Checkout cost still uses full compatible package prices and existing shared-package weekly counting.

## Check Before Buying

The section `Check Before Buying` appears when Pantry quantity confidence requires review.

Unknown Pantry quantity is not treated as zero and is not treated as sufficient.

## Duplicate-Purchase Advisory

Manual Shopping List items can now show:

`You already have baby spinach that needs attention. Adding another package may increase the chance of food remaining unused.`

Available actions:

- Keep New Package.
- Remove from Shopping List.
- Review Pantry Item.

The advisory is non-blocking and preserves user choice.

## Planning-Only Boundary

Shopping List planning actions do not create physical food events.

Protected from Shopping List planning actions:

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

## Validation Performed

Completed validation:

- `node --check app.js`: passed.
- `node --check rules.js`: passed.
- `node --check data/recipes.js`: passed.
- `data/recipes.json` parse check: passed.
- `tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js`: passed.
- `tests/shopping-list-budget-upgrade-static.test.js`: passed.
- `tests/cook-before-it-spoils-step-37-budget-rescue-integration-static.test.js`: passed.
- `tests/pantry-first-planning.test.js`: passed.
- `tests/cost-calculation-engine.test.js`: passed.
- `tests/price-data.test.js`: passed.
- `tests/ingredient-data.test.js`: passed.
- `tests/budget-rescue-complete-qa.test.js`: passed.
- `scripts/validate-price-data.js`: passed.
- `scripts/validate-ingredient-data.js`: passed.
- `node --check scripts/pantry-first-planning.js`: passed.
- `node --check scripts/cost-calculation-engine.js`: passed.

## Zero-Regressions Confirmed

- Second Shopping List created: 0
- Second Pantry created: 0
- Second Recipe Database created: 0
- Second Price Catalogue created: 0
- Second Cost Engine created: 0
- Separate Do Not Buy database created: 0
- Rescue grocery list created: 0
- Do Not Buy lines added as purchase items: 0
- Zero-cost purchase lines added: 0
- Advisory lines checked off automatically: 0
- Planning actions posted Food Event History entries: 0
- Planning actions posted Impact Ledger entries: 0
- Planning actions deducted Pantry quantity: 0
- Planning actions created Quantity Used events: 0
- Planning actions created Consumed events: 0
- Planning actions created Frozen events: 0
- Planning actions created Thawed events: 0
- Planning actions created Discarded events: 0
- Planning actions created Donated events: 0
- Planning actions created Possible Food Waste Avoided credits: 0
- Planning actions created Estimated Money Saved credits: 0
- Unknown Pantry quantities treated as sufficient: 0
- Unknown Pantry quantities treated as zero: 0
- Duplicate warnings blocking user choice: 0
- User-kept extras merged into plan-required purchases: 0
- Manual Shopping List lines removed automatically: 0
- Same-plan reservation ignored: 0
- Other-plan reservation consumed silently: 0
- Shared packages charged more than once: 0
- Pantry value counted as checkout cost: 0
- Missing prices treated as free: 0
- Allergy filters bypassed: 0
- Dietary filters bypassed: 0
- Safety filters bypassed: 0
- Direct `index.html` support removed: 0

## Risks and Notes

The new sections are derived from current Pantry-first allocation evidence. If existing allocation rows do not expose a specific reserved conflict, the Shopping List preserves the existing allocator behavior and does not invent reservation data.

No Git commit was created.
