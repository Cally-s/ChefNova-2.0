# Chef Nova Plan Savings Explanation

## 1. Purpose

Chef Nova explains why a generated Budget Rescue or Emergency plan may control grocery spending. The explanation is evidence-backed and avoids guaranteed-savings or optimality claims.

## 2. Explanation View Model

`derivePlanSavingsExplanation()` returns one model with version, status, heading, summary, reasons, additional reasons, comparison, practical benefits, warnings, actions, plan signatures, price context, and calculation time.

## 3. Explanation Statuses

Statuses cover complete high-confidence reduction, complete estimated reduction, no difference, higher cost, incomplete comparison, no baseline, partial plan, plan review, and unavailable explanation.

## 4. Comparison Baseline

The preferred baseline is the first complete safe plan before Budget Rescue repair passes. It is stored as a lightweight snapshot with signatures, cost summary, price confidence, purchase groups, Pantry summary, and price context.

## 5. Comparable Plan Requirements

A numeric comparison requires equivalent requested meal slots, complete final plan coverage, complete pricing, complete Shopping List coverage, the same currency, and a comparable price context.

## 6. Cost Difference

The estimated difference uses integer cents:

`baselineGroceryCostCents - finalGroceryCostCents`

Positive values are reductions. Zero values are no estimated difference. Negative values are shown as additional estimated cost.

## 7. Pantry Reasons

Pantry-use reasons count unique compatible ingredient groups with positive Pantry allocation. Checkout-impact claims appear only when a complete counterfactual supports a positive purchase-cost difference.

## 8. Shared Ingredient and Package Reasons

Shared reasons use Cost Engine purchase groups and Shopping List contribution data. Package wording appears only when package metadata and package counts are available.

## 9. Leftover and Batch Reasons

Leftover reasons count meal slots, not servings. Cost savings require a complete no-leftover comparison. Cooking-session reductions are practical benefits.

## 10. Substitution Reasons

Substitution reasons use active applied substitution records. Numeric substitution savings are not claimed when pricing is incomplete.

## 11. Use-Soon and Opened Pantry Reasons

Use-soon and opened-item reasons use Pantry-first allocation metadata. They do not make food-safety guarantees.

## 12. Single-Use Purchase Avoidance

Single-use purchase avoidance compares baseline and final purchase groups. Required removed groceries and Shopping List shortfalls are never counted as savings.

## 13. Double-Counting Protection

Chef Nova displays one authoritative overall estimated difference. Individual reasons may overlap and are not added together as separate savings amounts.

## 14. Optional Comparison Interface

The comparison is shown inside a semantic disclosure with labels for original estimate, current plan estimate, estimated difference, price confidence, and comparison context.

## 15. Partial and Incomplete Plans

Partial plans, incomplete prices, and Shopping List shortfalls suppress numeric savings claims.

## 16. Recalculation

The live explanation recalculates from the current plan, Pantry, prices, substitutions, leftovers, Shopping List coverage, and hard requirements.

## 17. Save Plan and Historical Comparisons

Saved plans may store a small explanation snapshot. Current explanations are recalculated when source data is available, and historical snapshots are not treated as current prices.

## 18. Accessibility

The interface uses a visible heading, semantic reason list, keyboard-accessible disclosure, polite live region, and visible warnings.

## 19. Responsive and Print Design

Comparison rows stack on smaller screens. Print keeps the explanation and comparison text while avoiding interactive-only behavior.

## 20. Testing

Run syntax checks plus Budget Rescue, price confidence, Pantry-first, leftover, substitution, Shopping List, Emergency Plan, respectful-message, and plan-savings explanation tests.
