# Chef Nova Pantry-First Planning

## 1. Purpose

Pantry-first planning uses compatible Pantry ingredients before adding groceries. This helps Budget Rescue reduce unnecessary purchases without changing the real Pantry during preview.

## 2. Pantry Source of Truth

The existing Pantry remains the permanent source of truth. Budget Rescue creates a temporary planning inventory from current Pantry records and discards it after preview calculations.

## 3. Temporary Planning Inventory

The planning inventory stores copied Pantry lots with remaining quantities, canonical ingredient IDs, forms, opened status, freshness metadata, and allocation records. It does not share mutable objects with the real Pantry.

## 4. Ingredient Matching

Matching uses canonical ingredient IDs first. Reviewed aliases may resolve labels such as “Garbanzo beans” to `chickpeas`. Ambiguous or unresolved Pantry labels are not allocated automatically.

## 5. Unit Compatibility

Chef Nova uses the existing safe unit conversion rules. Mass-to-mass and volume-to-volume conversions are allowed when supported. Unsafe conversions such as cups to grams or cans to grams are not assumed.

## 6. Multiple Pantry Lots

Each Pantry record remains a separate lot. Allocation keeps the Pantry item ID, original label, opened status, freshness date, and temporary remaining quantity.

## 7. Opened and Use-Soon Prioritization

Compatible lots are allocated in this order: Use first, earliest relevant date, opened items, unopened items, no date, then stable Pantry ID. Dates guide planning only and are not food-safety guarantees.

## 8. Recipe Candidate Simulation

Budget Rescue simulates each candidate recipe against the same inventory snapshot. Rejected candidates do not consume Pantry. Only the selected recipe updates the temporary inventory.

## 9. Pantry Coverage

Coverage is calculated per measurable requirement, then averaged. Chef Nova also shows exact fully covered and partially covered counts.

## 10. Grocery-List Integration

Shopping-list additions use Step 6 purchase groups after Pantry quantities are applied. Fully covered ingredients do not appear under Need to Buy.

## 11. Shared Ingredients

Shared requirements are aggregated by the cost engine before final grocery quantities are shown. The same Pantry quantity is not applied separately to every meal.

## 12. Pantry Savings

Estimated purchases avoided compare the same plan with the current Pantry against the same plan with an empty Pantry. This respects package rounding and selected price settings.

## 13. Incomplete Savings

If either cost calculation is incomplete, Chef Nova shows known purchases avoided and explains that the complete estimate is unavailable. Missing prices are not treated as zero.

## 14. Meal Replacement and Serving Changes

Serving edits and meal replacements rebuild Pantry allocations for the whole plan. This prevents stale allocations and allows Pantry quantities to be redistributed.

## 15. Pantry Confirmation

Plan previews never change the real Pantry. Saving a meal plan does not deduct Pantry quantities.

## 16. Meal Completion

When a user marks a planned recipe meal completed in My Nutrition Tracker, Chef Nova can ask whether to update Pantry. The update is recorded per meal so repeated clicks do not deduct the same quantities twice.

## 17. Storage

Saved plans may carry Pantry allocation snapshots for display, but current Pantry data is recalculated when available. The Pantry revision fingerprint helps detect stale previews.

## 18. Accessibility

The Pantry-first summary uses visible text labels, keyboard-accessible details, and readable Required, Used from Pantry, and Need to Buy values.

## 19. Testing

Validation includes syntax checks, ingredient validation, price validation, cost-engine tests, price-confidence tests, Pantry-first unit tests, and Pantry-first static checks.

## 20. Deferred Work

Full budget optimization, leftovers, substitutions, store comparison, live grocery prices, and a full grocery-list redesign remain later steps.
