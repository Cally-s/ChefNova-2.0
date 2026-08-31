# Chef Nova Budget Status Panel

## Purpose

The Budget Status panel gives a clear weekly Budget Rescue summary above the weekly Meal Planner.

It uses the existing Cost Engine, Price Confidence system, Pantry-first planning, recipe requirement checks, leftover metadata, and substitution evaluation. It does not create a second budget calculator or a new storage system.

## Source of Truth

- Weekly grocery cost comes from `calculateMealPlanCostsForPlan()`.
- Price confidence comes from `derivePriceConfidence()`.
- Pantry usage comes from `buildPantryAllocationForPlan()`.
- Hard requirement review comes from `evaluateRecipeForCurrentRequirements()`.
- Lower-cost action counts come from existing substitution rules and `evaluateSubstitutionForMeal()`.
- Saved plans may store an optional `budgetStatusSnapshot`, but the visible panel recalculates from current state.

## Status Priority

The panel protects budget claims in this order:

1. No safe Budget Rescue result.
2. Hard allergy, dietary, serving, appliance, or preference conflict.
3. Partial weekly plan.
4. Incomplete grocery estimate.
5. No grocery purchases required.
6. Within cushion-adjusted planning target.
7. Within weekly budget.
8. Above weekly budget.
9. Unavailable.

This prevents Chef Nova from saying a plan is within budget when prices are missing, the plan is partial, or a meal needs safety review.

## Display Rules

Complete grocery totals show:

- Weekly budget
- Planning target
- Price cushion
- Estimated grocery cost
- Remaining budget or amount above budget
- Price confidence
- Pantry items used
- Meals planned
- Average ingredient cost per serving
- Budget-used progress bar

Incomplete estimates show known priced subtotal instead of a final grocery total. They do not show remaining budget or final progress.

Partial plans show meal progress and do not claim weekly budget success.

## Average Cost Per Serving

Average cost per serving uses recipe ingredient-use costs, not checkout purchase cost. Planned leftover meals do not double-count the source batch. Only additional leftover costs are included when present.

## Actions

Actions are derived from current plan conditions:

- Add Missing Prices
- Review Cost Issues
- Review Meal Plan
- Review Lower-Cost Changes
- Edit Pantry
- Review Shopping List

The action count comes from actual available actions. It is not hard-coded.

## Accessibility

The panel includes visible labels, a polite live region, keyboard-accessible buttons, and a semantic progressbar only when the total is complete and safe to compare. The progressbar caps `aria-valuenow` at 100 for over-budget states while `aria-valuetext` keeps the actual context.

## Responsive and Print Behavior

The panel is sticky on larger screens, static on tablet and mobile, and static without action buttons in print output.
