# Chef Nova Price-Confidence Protection

## 1. Purpose

Price-confidence protection stops Budget Rescue from making budget-compliance claims when grocery prices are incomplete. Missing or unusable prices are never treated as zero.

## 2. Coverage Denominator

Weekly grocery confidence counts unique Step 6 purchase groups, not raw recipe ingredient lines. Shared ingredients such as onions count once after recipe needs are aggregated and Pantry quantities are applied.

## 3. Usable Prices

A grocery item has a usable price only when the Step 6 cost engine can calculate a valid purchase cost. The price must match the ingredient, form, quantity, unit, package size, active price, and CAD currency rules.

## 4. Source Classification

- User-entered: a price entered for the current plan or guest session.
- Saved profile: a price from a user-owned local store profile.
- Chef Nova estimate: a built-in Budget Store estimate selected directly.
- Estimate fallback: a Chef Nova estimate used because the selected source lacked a usable price.
- Unresolved: no usable price, quantity, unit, package size, form, or source could be verified.

## 5. Confidence Statuses

- High confidence: all required grocery items have user-entered or saved prices.
- Estimated: all required grocery items have usable prices, but at least one uses a Chef Nova estimate or fallback.
- Incomplete estimate: one or more required grocery items cannot be costed reliably.

## 6. Coverage Calculation

Coverage is usable purchase groups divided by required purchase groups. Incomplete coverage never displays as 100%, even if ordinary rounding would reach 100%.

## 7. Incomplete Totals

Incomplete results show a known priced subtotal only. They do not show a complete weekly grocery total, remaining budget, or final amount above budget.

## 8. Budget-Message Guards

Within-budget, remaining-budget, and above-budget messages require a complete grocery total. If any purchase group is unresolved, Chef Nova says it cannot yet determine whether the full plan fits the selected budget.

## 9. Add Missing Prices

The Add Missing Prices action reuses the existing Shopping List and Step 5 grocery price editor. It focuses grocery items that need price review and recalculates confidence after prices are saved.

## 10. No-Purchases-Required State

When Pantry quantities cover all planned recipe grocery needs, the denominator is zero. Chef Nova displays a no-purchases-required message instead of 0% or 100% pricing coverage.

## 11. Recipe Versus Purchase Coverage

Recipe ingredient-use cost coverage remains separate from weekly grocery purchase confidence. Pantry-covered ingredients can affect recipe-use cost while not affecting the grocery purchase denominator.

## 12. Accessibility

The panel uses visible status text, exact item counts, progress semantics when a percentage applies, and a polite live region. Missing-price actions are keyboard-accessible and focus the existing price editor workflow.

## 13. Testing

Validation includes syntax checks, ingredient validation, price validation, price tests, cost-engine tests, planning-mode tests, Budget Rescue form tests, and Step 7 static guardrail checks.

## 14. Deferred Work

Budget optimization, cheaper substitutions, emergency plan optimization, live grocery prices, retailer scraping, automatic price verification, and the full future Budget Status panel remain deferred.
