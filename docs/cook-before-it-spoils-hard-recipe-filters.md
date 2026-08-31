# Chef Nova Cook Before It Spoils Hard Recipe Filters

## 1. Purpose

Hard requirements run before rescue ranking so food rescue never overrides allergies, dietary restrictions, appliances, cooking-time limits, food-safety guardrails, source quantity, leftovers, substitutions, or mandatory ingredient validity.

## 2. Existing Eligibility Engine

The central source of truth remains `scripts/recipe-eligibility-ranking.js`. Cook Before It Spoils uses a thin app adapter in `evaluateRecipeForCurrentRequirements()` to prepare current user, Pantry, leftover, substitution, appliance, cooking-time, serving, allergy, dietary, and food-safety context.

## 3. Execution Pipeline

The deterministic hard-filter order is:

1. Candidate and variant structural validity
2. Saved allergen and cross-contact protection
3. Required dietary restrictions
4. Selected Pantry-source existence and food-safety eligibility
5. Prepared-leftover existence and food-safety eligibility
6. Preparation-method and appliance compatibility
7. Serving-scale and fixed-yield feasibility
8. Effective scaled or batched cooking time
9. Priority-food form, unit, and quantity sufficiency
10. Prepared-leftover quantity and lineage
11. Applied substitution validity
12. Mandatory ingredient availability and metadata
13. Final complete hard-eligibility verification

## 4. Result Model

Every eligibility result includes version, status, `hardEligible`, `reviewRequired`, candidate identity, method, serving profile, primary reason code, all reason codes, ordered stages, review actions, validated context, source validation, Pantry validation, leftover validation, substitution validation, source revisions, legacy exclusion reasons, and warnings.

## 5. Status Values

- `eligible`: every hard requirement passes.
- `excluded`: a confirmed hard violation exists.
- `review-required`: required information is missing or uncertain.
- `invalid-candidate`: recipe, variant, quantity, method, substitution, or lineage data is invalid.

Legacy aliases remain for compatibility: `ineligible` maps to excluded and `indeterminate` maps to review-required.

## 6. Reason Codes

`RECIPE_HARD_FILTER_REASON_CODES` stores controlled codes for allergens, dietary rules, appliances, time, Pantry source safety, selected-source quantity, servings, mandatory ingredients, leftovers, substitutions, and invalid recipe data. User-facing messages remain separate from reason codes.

## 7. Final Ingredient Graph

The final graph starts with mandatory structured ingredients, adds selected optional ingredients, expands composite components when present, and evaluates applied substitutions as variant data. Unselected optional ingredients do not create allergy, dietary, cost, or rescue coverage.

## 8. Allergy Protection

Saved allergens are non-overridable hard exclusions. Direct ingredient allergens, recipe-level allergens, composite ingredients, selected optional ingredients, and applied substitutions are evaluated before scoring. Missing allergen metadata becomes review-required.

## 9. Dietary Restrictions

Required dietary restrictions are hard filters. Chef Nova uses recipe and ingredient metadata, not recipe titles, to evaluate compatibility.

## 10. Appliances and Methods

Methods are evaluated separately. Unavailable appliances exclude that method. Chef Nova does not invent a new method to satisfy an appliance profile.

## 11. Cooking Time

Cooking time uses the existing Chef Nova time semantics. Sequential batches multiply method time unless the method explicitly supports concurrent batches. Over-time candidates are excluded before scoring.

## 12. Pantry Food-Safety Integration

Specific selected Pantry sources and leftovers must pass Food-Safety Guardrails. Unsafe selected sources block rescue candidates. Unsafe generic Pantry lots are skipped and may become grocery needs only when generic purchases are allowed.

## 13. Selected Priority Quantity

For selected rescue foods, Chef Nova compares scaled required quantity with eligible, compatible, unreserved quantity. It may aggregate compatible eligible lots, but it never buys more of the selected rescue food to make a rescue recipe eligible.

## 14. Amount Adjustments

Structured quantity ranges may be evaluated only when the recipe explicitly supports them. Required quantities are never silently reduced in display or scoring.

## 15. Forms and Units

Ingredient forms must match unless a reviewed conversion exists. Unit comparison uses supported conversions such as kg/g and l/ml. Unsupported count-to-weight conversions require review.

## 16. Serving Scaling

Serving feasibility uses the existing serving scaler: continuous scaling, valid fixed yields, valid batch counts, and representable extra servings. Extra valid servings remain a scoring issue, not an automatic hard failure.

## 17. Mandatory Ingredients

Mandatory ingredients need a valid supply path: eligible Pantry, selected rescue source, prepared leftover, grocery purchase, or validated substitution. Missing mandatory ingredient metadata produces review-required or invalid status.

## 18. Prepared Leftovers

Prepared leftovers must still exist, belong to the active scope, have available quantity, pass safety, preserve lineage, and not be consumed, discarded, donated, reheated-and-nonreusable, or unsupported for transformation.

## 19. Substitutions

Applied substitutions must reference a canonical rule, have valid quantity conversion, and re-run allergen, dietary, appliance, time, safety, serving, quantity, and mandatory ingredient checks.

## 20. Missing Information

Missing safety, allergen, dietary, method, quantity, unit, leftover, or substitution information is never treated as safe, compatible, available, or zero. It returns review-required or invalid-candidate.

## 21. Primary Reason Priority

All reason codes are preserved. The primary reason prioritizes allergen conflicts first, then dietary conflicts, food-safety exclusions, leftover issues, selected-source quantity, appliances, time, serving, substitutions, mandatory ingredients, missing metadata, and invalid candidate structure.

## 22. Step 9 Integration

Step 9 calls the central eligibility engine before selected-source allocation, Pantry coverage, purchase metrics, cost, leftovers, rescue scoring, or sorting. Only `eligible` candidates receive rescue scores.

## 23. Other Planner Integration

Standard Meal Plan, Budget Rescue, Emergency Plan, Replace Meal, Add to Plan, recipe cards, substitutions, and leftover planning continue to call `evaluateRecipeForCurrentRequirements()` or its eligibility wrapper.

## 24. Stale-Result Protection

Eligibility results carry user scope, recipe revision, ingredient revision, Pantry revision, leftover revision, profile revision, policy version, and reference date. Add-to-plan and replacement flows revalidate before applying changes.

## 25. User Isolation

Registered users use user-scoped Pantry, profile, plan, price, substitution, and leftover context. Guests use temporary guest state and do not persist eligibility results into registered-user storage.

## 26. Accessibility

Excluded and review-required states use visible text, specific reason messages, keyboard-accessible disclosures, review-action labels, and existing live-region announcements. Add-to-plan and replacement actions are not shown for hard failures.

## 27. Responsive Design

Reason text wraps, action rows stack, modals fit the viewport, and status meaning is textual so mobile, large text, high contrast, and reduced motion remain supported by existing patterns.

## 28. Testing

Validation uses syntax checks, JSON parse, ingredient and price validators, all existing plain Node tests, recipe-eligibility tests, and the Step 10 static test.

## 29. Deferred Work

Automatic restriction relaxation, automatic scheduling, automatic substitutions, automatic leftover transformation, automatic freezing, Pantry reservation, Pantry deduction, analytics, and separate rescue shopping are outside Step 10.
