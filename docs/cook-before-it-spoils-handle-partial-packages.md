# Chef Nova Partial Package Handling

## 1. Purpose
Original package size and current remaining quantity describe different facts. Chef Nova keeps the acquisition amount stable while recipe planning uses the amount physically remaining now.

## 2. Existing Systems Reused
Step 50 reuses Pantry records, quantity information, FEFO, Shopping List, Cost Engine, reservations, Waste Diary, Freezer workflows, Food Event History, Impact Ledger, user-scoped storage, and guest session storage.

## 3. No Duplicate Quantity System
Partial packages are derived from the existing Pantry item and quantity records. No second Pantry, package database, or quantity engine is introduced.

## 4. Original Package Quantity
Original package quantity is the amount acquired, such as `900 g`. It changes only through an explicit package-size correction and is not reduced when food is used.

## 5. Current Remaining Quantity
Current remaining quantity is the amount physically present in the package now, such as approximately `350 g`. It is the planning source of truth.

## 6. Available Quantity
Available quantity equals current remaining quantity minus active reservations for the same package and compatible unit.

## 7. Package Fill States
Fill states are Full, Partial, Depleted, Quantity Unknown, Over Capacity Review, and Conflicting. Fill state is derived from remaining quantity versus original package size.

## 8. Opening States
Opening states are opened, unopened, opening unknown, and not applicable. Opening state is separate from fill state.

## 9. Quantity Confidence
Confidence can be measured, user-confirmed, user-estimated, event-derived, fraction-estimate, validated conversion, legacy unconfirmed, unknown, conflicting, or invalid.

## 10. Partial Package Schema
The derived model stores original package quantity, remaining quantity, fill state, opening state, active reserved quantity, available quantity, warnings, source revisions, resolver version, and policy version.

## 11. Exact Quantities
Exact remaining quantities can support exact allocation and conservation checks. They still do not change physical Pantry during previews.

## 12. Estimated Quantities
Estimated quantities remain labelled as approximate. Estimated coverage and expected remainders stay conditional until confirmed.

## 13. Estimated Ranges
Ranges preserve minimum and maximum values. Conservative planning uses the minimum rather than treating the maximum as guaranteed.

## 14. Unknown Remaining Quantities
Unknown remaining quantities stay unknown and route to Step 48 quantity confirmation. Unknown is never treated as zero or full.

## 15. Fraction-of-Package Estimates
Fraction entries can derive approximate remaining quantity when original package size is known. The original fraction choice remains estimate evidence.

## 16. Package Size Corrections
Package-size corrections preserve current remaining quantity unless the user explicitly edits both values. Correction history uses the shared event/history pattern.

## 17. Remaining-Quantity Corrections
Remaining-quantity corrections preserve original package size and trigger recalculation of coverage, Shopping List, reservations, budget, priority, and notifications.

## 18. Over-Capacity Review
When remaining quantity exceeds original package size, Chef Nova asks whether the package size, remaining amount, refill, or package combination should be reviewed. It does not clamp the value.

## 19. No Inferred Historical Use
Original package size minus remaining quantity is not automatically food used. Confirmed Food Event History is required to classify use, discard, donation, freezing, or transfer.

## 20. Safety and Date Timelines
Quantity changes do not reset best-before, expiration, opened, purchased, packaged, frozen, thawed, or cooked dates. Safety is applied before allocation.

## 21. FEFO
FEFO evaluates each physical package. A safe opened partial package with an earlier use-first date is allocated before a later full package.

## 22. Recipe Planning
Recipe planning uses current available quantity, not original package size. A 900 g package with about 350 g remaining contributes about 350 g.

Chef Nova is using the recorded remaining quantity, not the original package size, when previewing partial-package actions such as Freeze Half.

## 23. Shared Meal Demand
Shared demand allocation tracks temporary package use across demands so the same 350 g cannot cover multiple meals beyond availability.

## 24. Serving Changes
Serving changes recalculate demand, package allocation, missing quantity, expected remainder, Shopping List quantity, and reservation needs.

## 25. Recipe Replacement
Recipe replacement releases old temporary allocation and recalculates the new demand without reducing physical Pantry.

## 26. Shopping List
Shopping List coverage uses the remaining quantity first. Fully covered, estimated-covered, and partially covered states remain distinct.

## 27. Full-Package Purchase Cost
When a purchase is required, checkout cost uses whole compatible packages: `ceil(missingQuantity / purchasePackageQuantity) * packagePrice`.

## 28. Purchase Confirmation
A confirmed purchase creates a new package record with its own original quantity, current quantity, dates, price, opening state, and lineage.

## 29. Cost Engine
Current Pantry value and ingredient-use value use package-specific cost per unit from the original package quantity and historical package price.

## 30. Package Size Missing
A known remaining quantity can still support planning when package size is unknown. Percentage remaining and package-based value stay unavailable.

## 31. Reservations
Reservations reference exact package IDs and current remaining quantities. Estimated reservations preserve estimate confidence.

## 32. Start Cooking
Meals relying on estimated packages require a final amount check with options to confirm enough, edit the amount, add backup food, or adjust servings.

## 33. Actual Use
Actual use is recorded against the exact package. Users may enter used amount or directly enter the new remaining amount.

## 34. Estimate Arithmetic
Estimate minus estimate remains estimated. Range subtraction preserves a range and asks for confirmation when uncertainty is material.

## 35. Package Depletion
Depletion requires confirmed zero, all remaining used, discarded, donated, shared, frozen, transferred, or corrected. History is preserved.

## 36. Budget Rescue
Budget Rescue uses the current remainder and marks estimated coverage as conditional.

## 37. Emergency Plan
Emergency Plan uses the partial amount and does not overstate Pantry coverage due to budget pressure.

## 38. Multiple Packages
Step 49 package-level FEFO applies independently to every package. Partial packages are not treated as full.

## 39. Package Refill and Combination
Refill and combination require explicit lineage-preserving workflows. New purchases are not merged into old partial packages automatically.

## 40. Freezer Splits
Freezer splits conserve quantity across refrigerated and frozen child segments while preserving source package dates, price, confidence, and lineage.

## 41. Waste Diary
Discard workflows use current remainder, not original package size. Discarded cost uses the discarded portion only.

## 42. Priority Engine
Priority uses current quantity at risk, confidence, opening state, dates, storage, reservations, and rescue options.

## 43. Notifications
Notifications mention current remaining quantity and respect fatigue controls. They do not announce original package size as current amount.

## 44. Food Event History
Physical changes reference package ID, before and after quantity, representation, unit, confidence, source, timestamp, user scope, and idempotency key.

## 45. Impact Ledger
Impact uses actual or qualifying estimated confirmed use, not original package size or preview allocations.

## 46. Migration
Legacy package size and remaining quantity are preserved. Ambiguous legacy values require review and retain raw data.

## 47. Data Protection
Package quantity, confidence, ID, ingredient ID, dates, opening state, price, notes, reservations, history, lineage, and unknown custom fields are preserved.

## 48. Stale and Multi-Tab Protection
Decisions carry user scope, item revision, quantity revisions, reservation revision, date revision, policy versions, local date, and timezone.

## 49. User Isolation
Registered-user package data stays user-scoped. Guest package data remains temporary and is not merged automatically.

## 50. Accessibility
Package cards visibly label original size, remaining quantity, confidence, opening state, reservations, planned use, expected remainder, missing purchase quantity, and cost confidence.

## 51. Responsive Design
Mobile package cards stack labels and actions. No drag-and-drop is required.

## 52. Print and Export
Print and export preserve separate original and remaining fields, confidence, and planned-versus-physical wording.

## 53. Testing
Validation includes syntax checks, static Step 50 checks, recent Cook Before It Spoils static checks, and JSON parsing.

## 54. Deferred Work
Automatic visual measurement, AI remainder guessing, automatic package combination, automatic Pantry deduction, automatic purchase confirmation, automatic impact recognition, and environmental calculations remain outside Step 50.
