# Chef Nova Unknown Quantity Handling

## 1. Goal
Handle Pantry items whose amount is unknown, approximate, ranged, qualitative, or only estimated as meal capacity.

## 2. Reused Systems
This work reuses the existing Pantry, Unit Registry, quantity formatter, recipe demand model, Shopping List, Cost Engine, reservations, Food Event History, Impact Ledger, user storage, and guest session storage.

## 3. No Second Pantry
No second Pantry, quantity store, reservation model, Shopping List, cost model, or impact model was created.

## 4. Quantity Information Object
Each Pantry item can carry `quantityInformation` beside existing `quantityDetails`. It records representation, exact amount, approximate amount, range, meal-serving capacity, whole-item state, confidence, review status, and policy version.

## 5. Supported Representations
Supported representations are exact numeric, estimated numeric, numeric range, meal-serving capacity, whole item, and unknown.

## 6. Unknown Is Not Zero
Unknown quantities remain `null` for exact calculations. They are never treated as zero stock, sufficient stock, or exact available quantity.

## 7. Unknown Is Not Sufficient
Unknown Pantry amounts do not produce automatic full coverage, Do Not Buy decisions, exact reservations, precise savings, or precise impact credit.

## 8. Qualitative Capacity
Meal-serving capacity means the user thinks the item may support one or more flexible meal portions. It is not a nutrition serving.

## 9. No Automatic Gram Conversion
Meal-serving capacity is not converted to grams unless a compatible reviewed conversion exists or the user later records an amount.

## 10. Approximate Numeric Amounts
Approximate grams remain estimated. They can support flexible suggestions but stay marked approximate.

## 11. Numeric Ranges
Ranges use the conservative minimum as the guaranteed amount. The maximum is never treated as guaranteed coverage.

## 12. Whole-Item Reservations
Whole-item and non-numeric reservation paths remain represented as review-required holds, not exact quantity deductions.

## 13. Demand-Specific Confirmation
When a user confirms enough for one recipe, that confirmation applies only to that recipe demand. It does not create a new exact Pantry amount.

## 14. Pantry Card Prompt
Unknown and qualitative Pantry cards show `QUANTITY NEEDS CONFIRMATION` with choices for one meal serving, two meal servings, approximate grams, or not sure.

## 15. Required Explanation
The prompt explains that one meal serving is a flexible portion estimate and will not be converted to exact weight without reviewed support or later confirmation.

## 16. Save Quantity Estimate
`Save Quantity Estimate` updates the existing Pantry item only. It preserves identity, dates, storage, lifecycle, reservations, and user-specific scope.

## 17. Review Later
`Review Later` leaves the quantity unresolved. Exact recipe, Shopping List, budget, reservation, and impact calculations remain unavailable.

## 18. Pantry Display for Meal Capacity
Meal-capacity items show `Quantity: Estimated to support 2 meal servings`, `Exact amount: Not recorded`, and the precision warning.

## 19. Pantry Display for Unknown Amount
Unknown items show `Quantity: Not recorded` and explain that exact recipe, Shopping List, budget, reservation, and impact calculations require confirmation.

## 20. Flexible Recipe Search
`Find Flexible Recipes` sends the Pantry item name to the existing Recipe Finder. Results are conditional when exact quantity is unavailable.

## 21. Recipe Warning
Recipe cards show `QUANTITY CONFIRMATION NEEDED` when a matched Pantry item has unknown, qualitative, approximate, or range quantity data.

## 22. Spinach Demand Example
The recipe warning can state: `This recipe uses approximately 80 g of spinach per serving.`

## 23. Recorded Pantry Amount
The warning shows the current Pantry record, such as `Enough for approximately 1 meal serving`.

## 24. Save Boundary
Before saving a meal, users are asked to confirm whether the available amount covers the selected recipe quantity.

## 25. Shopping List Boundary
Unknown quantities may lead to conditional ideas but cannot suppress Shopping List needs as exact at-home coverage.

## 26. Cost Boundary
Precise cost, savings, and remaining-value calculations require exact or explicitly supported numeric quantities.

## 27. Impact Boundary
Food-rescue weight and impact credit require confirmed outcome events. Unknown or qualitative quantity states do not create impact credit.

## 28. Food Event History Boundary
Saving a quantity estimate does not create a physical food-use, discard, freeze, or rescue event.

## 29. Existing Reservations
Existing reservations remain attached to the Pantry item. Unknown quantity states do not create exact new reservations.

## 30. Stale Data
Quantity confirmations store source revision metadata for demand-specific decisions so stale multi-tab decisions can be reviewed.

## 31. Idempotency
No duplicate Pantry item or duplicate quantity system is created when the same item is normalized repeatedly.

## 32. Registered User Isolation
Registered users continue to use user-scoped localStorage through the existing Pantry storage helpers.

## 33. Guest Isolation
Guest Pantry updates continue to use session-only guest storage and do not write to registered user localStorage keys.

## 34. Accessibility
Quantity prompts use headings, labels, radio controls, aria-live validation, focusable buttons, and readable warning text.

## 35. Mobile
Quantity option cards stack on small screens. Buttons become full width.

## 36. High Contrast
Forced-colors styles use visible borders on review cards, controls, and badges.

## 37. Reduced Motion
Hover transitions are disabled when reduced motion is requested.

## 38. Print and Export
Print styles keep quantity warnings visible and remove action buttons.

## 39. Respectful Language
Messages avoid blame. They state what Chef Nova can and cannot calculate.

## 40. Validation
Validation checks syntax, required UI copy, quantity representations, storage reuse, recipe warnings, safety boundaries, documentation, and report evidence.
