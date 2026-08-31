# Chef Nova Budget Rescue Complete Test Plan

## 1. Purpose

Validate Budget Rescue Steps 1-22 as one integrated feature. The plan covers safe meal generation, Pantry-first allocation, cost calculation, Shopping List integration, Emergency Plan behavior, Save Plan, Replace Meal, data protection, accessibility, and mobile support.

## 2. Test Scope

Included:

- Existing Meal Planner, Pantry, Shopping List, Meal Calendar, Save Plan, and Replace Meal workflows.
- Ingredient Catalogue, Price Catalogue, Cost Engine, Price Confidence, Pantry-first planning, recipe eligibility, Budget Planning Algorithm, leftovers, substitutions, Budget Status, recipe-card cost information, Emergency Plan, respectful messages, plan-savings explanations, edge cases, and accessibility/mobile support.

Excluded:

- Live grocery prices, retailer scraping, online ordering, external APIs, backend services, and real store inventory.
- Accessibility certification and screen-reader pass claims without real assistive-technology testing.

## 3. Test Environments

- Runtime: local Node runtime at `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`.
- Browser automation framework: not available in the current repository.
- Unit/integration framework: Node scripts using built-in `assert`.
- Locale: `en-CA`.
- Currency: `CAD`.
- Timezone for deterministic fixtures: `America/Toronto`.
- Reference date/time: `2026-08-10T14:30:00-04:00`.
- Reference local date: `2026-08-10`.

## 4. Test Layers

- Unit: existing engine tests plus fixture checks for cost, Pantry, eligibility, price confidence, and data validation.
- Integration: `tests/budget-rescue-complete-qa.test.js` combines production Cost Engine, Pantry-first engine, eligibility engine, fixture prices, fixture Pantry, and static source contracts.
- End-to-end: no browser E2E framework is available. Manual scenarios are documented separately.
- Accessibility: static semantic and source-contract checks verify landmarks, labels, live regions, progressbar rules, reduced motion, forced colors, and action labels.
- Responsive: static CSS checks verify mobile overflow guards, stacked controls, touch-target sizing, and media queries.
- Manual: actual screen-reader, physical mobile, print preview, forced-colors, and zoom checks are listed in `docs/budget-rescue-manual-test-checklist.md`.

## 5. Test Fixtures

Fixture location:

```text
tests/fixtures/budget-rescue/fixtures.js
```

Fixture data includes:

- Ingredients: rice, pasta, canned tomatoes, onions, lentils, chicken breast, chickpeas, eggs, peanut butter, frozen vegetables, canned beans, bread, oil, and one unpriced ingredient.
- Recipes: safe budget recipes, peanut recipes, microwave recipes, oven-only recipes, no-cook recipes, scalable recipes, and a recipe with a missing-price ingredient.
- Prices: package prices, unit-rate price, active sale, expired sale, multi-buy promotion metadata, Chef Nova estimates, and missing-price coverage.
- Pantry: rice, pasta, canned tomatoes, and onions with known quantities.
- Users: Registered User A, Registered User B, and a guest session.

## 6. Determinism

Tests use:

```javascript
{
  referenceDateTime: "2026-08-10T14:30:00-04:00",
  referenceLocalDate: "2026-08-10",
  timezone: "America/Toronto",
  locale: "en-CA",
  currency: "CAD"
}
```

The Emergency request `I have $25 until Friday.` is expected to resolve to:

```javascript
{
  availableBudgetCents: 2500,
  startDate: "2026-08-11",
  endDate: "2026-08-14",
  numberOfDays: 4
}
```

Tests avoid live dates for cost calculations by passing `calculationDate: "2026-08-10"`.

## 7. Required Scenario 1

Standard weekly Budget Rescue plan:

- Budget: `$100.00`.
- Household fixture: 2 adults and 2 children as metadata expectation.
- Plan length: 7 days.
- Meal slots: breakfast, lunch, dinner.
- Pantry: rice, pasta, canned tomatoes, onions.
- Maximum time: 30 minutes.
- Expected: 21 filled slots, Pantry-first allocation, complete grocery total, Shopping List reconciliation, recipe-cost reconciliation, preview remains non-mutating.

## 8. Required Scenario 2

Emergency Plan:

- Request: `I have $25 until Friday.`
- Expected: `$25.00 CAD`, Tuesday August 11 through Friday August 14, 2026, 4 days, confirmation before generation, Emergency priority source contracts, ambiguous input protection.

## 9. Required Scenario 3

Allergy protection:

- Saved allergy: peanuts.
- Expected: recipe-level peanut metadata, ingredient-level peanut metadata, and incomplete allergen metadata block automatic planning. Budget scoring must not revive unsafe recipes.

## 10. Required Scenario 4

Appliance restriction:

- Available appliance: microwave only.
- Maximum cooking time: 30 minutes.
- Expected: oven-only recipes excluded, explicit microwave method accepted, no-cook method accepted, missing appliance metadata indeterminate.

## 11. Required Scenario 5

Above-budget behavior:

- Budget: `$40.00`.
- Expected: respectful wording, no judgmental text, three real action labels: Use More Pantry Ingredients, Apply Lower-Cost Substitutions, Create a Four-Day Plan.

## 12. Required Scenario 6

Shared onion aggregation:

- Recipes require 2, 3, and 3 onions.
- Price: 10 onions for `$3.00`.
- Expected: one purchase group, 8 onions required, one package charged once, 2 onions remaining, ingredient-use values 60/90/90 cents, partial Pantry applied once.

## 13. Required Scenario 7

Missing-price protection:

- 24 required purchase groups.
- 23 priced groups.
- 1 missing price.
- Known subtotal: `$78.40`.
- Expected: final weekly grocery total, remaining budget, and above-budget amounts are `null`; missing price is not zero; coverage is below 100%; price editor action exists.

## 14. Required Scenario 8

Replace Meal recalculation:

- Before total: `$92.75`.
- After total: `$101.30`.
- Budget: `$100.00`.
- Expected: non-mutating preview, full plan recalculation source contracts, before/after warning, $1.30 overage, Choose a Different Meal, Use Replacement Anyway, and hard-filter protection.

## 15. Save and Data Protection

Tests and static checks verify:

- Generated plans remain previews until Save Plan.
- Save Plan merges into `mealPlans.calendar`.
- Money values use integer cents.
- Missing cost values remain `null`.
- Saving does not deduct Pantry or mark groceries purchased.
- Older plans, guest data, and registered-user scopes remain protected.

## 16. Edge Cases

Covered:

- Zero and missing budget validation.
- Unknown Pantry quantity options.
- No appliance metadata regression.
- Large-household scaling through serving and batch tests.
- Multi-package promotion source contract.
- Package remainder is not added to Pantry automatically.

## 17. Accessibility

Automated static checks cover:

- One main landmark.
- Skip link.
- Central live regions.
- Field labels and invalid-field helpers.
- Budget progressbar semantics.
- Shopping List filter selected state.
- Item-specific action labels.
- Unknown Pantry fieldset and legend.
- Reduced motion and forced-colors CSS.

Manual screen-reader testing remains documented as not run.

## 18. Mobile and Reflow

Static checks cover:

- Mobile media query.
- Horizontal overflow guard.
- Stacked Shopping List and Budget Status controls.
- Touch target sizing.
- Dialog and print support markers.

Manual 200% zoom, 400% reflow, and physical mobile testing remain not run.

## 19. Reconciliation

Automated checks verify:

- Sum of active Shopping List purchase group costs equals weekly grocery total when complete.
- Sum of ingredient line costs equals recipe total for complete recipe cards.
- Known subtotal excludes missing prices.
- Recipe ingredient-use value and grocery checkout purchase cost remain distinct.

## 20. Manual Verification

Manual checklist:

```text
docs/budget-rescue-manual-test-checklist.md
```

Manual scenarios are labelled `Not Run` until actually performed.

## 21. Pass and Failure Criteria

Required pass criteria:

- No allergen violation selected.
- No missing price treated as zero.
- No unknown Pantry quantity treated as sufficient.
- No unavailable appliance selected.
- Shared packages and Pantry quantities counted once.
- Previews remain unsaved until confirmation.
- Budget messages are visible, respectful, and non-color-only.

## 22. Reporting

Actual results are recorded in:

```text
docs/budget-rescue-complete-test-report.md
```
