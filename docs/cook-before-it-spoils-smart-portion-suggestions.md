# Chef Nova Smart Portion Suggestions

## 1. Purpose

Smart Portion Suggestions use household headcount as an editable starting point for a single meal. The suggestion keeps people eating, servings for tonight, planned leftovers, desired yield, effective recipe yield, and unallocated servings separate.

## 2. Non-Nutrition Boundary

This is a meal-planning and portion-management feature. It does not calculate calorie needs, diagnose health, assign child serving multipliers, or create medical nutrition advice.

## 3. Existing Systems Reused

Step 13 reuses the existing Budget Rescue household fields, recipe serving scaler, hard-filter eligibility engine, Food Rescue ranking, Pantry allocator, Shopping List demand, Cost Engine, Meal Planner calendar, Cook This Tonight draft, leftover guidance, registered-user storage, and guest session rules.

## 4. Serving Concepts

People Eating is the headcount for tonight. Current-meal servings are the editable serving amount for tonight. Planned leftovers are intended future servings, not actual leftovers. Desired yield is current-meal servings plus planned leftovers. Effective yield is the supported recipe yield after scaling or batching. Unallocated servings are supported yield minus planned servings.

## 5. Leftover Preferences

Controlled values are `none`, `one-additional-meal`, `two-additional-meals`, and `chef-nova-recommend`. Visible labels are No leftovers, One additional meal, Two additional meals, and Let Chef Nova recommend.

## 6. Suggestion Input Model

The input model stores version, recipe candidate ID, recipe ID, household context, People Eating, optional serving override, leftover preference, optional future meal targets, selected rescue source references, current plan context, constraints, reference time, timezone, and user scope.

## 7. Suggestion Result Model

The result model stores version, status, recipe candidate ID, People Eating, current-meal serving suggestion and selection, leftover plan, recipe yield, projected metrics, recommendation explanation, alternatives, warnings, source revisions, and the selected ranking preview.

## 8. Household Profile Defaults

Chef Nova starts with adults plus children from the existing household fields when available. This is only a headcount suggestion and can be changed for tonight.

## 9. People Eating and Servings

People Eating and servings are separate. A user may plan 3 people eating and 4 servings for tonight without changing their saved household profile.

## 10. One Additional Meal

One additional meal plans future servings equal to the current-meal serving count unless an edited target value is supplied.

## 11. Two Additional Meals

Two additional meals keep separate future-meal serving values. Each value remains editable before the plan is confirmed.

## 12. Chef Nova Recommendation

Let Chef Nova recommend evaluates only no leftovers, one additional meal, and two additional meals. It does not evaluate unlimited extra meals.

## 13. Supported Serving Profiles

The shared service enumerates continuous scaling, fixed-yield fallback, and batchable profiles. It does not present unsupported yields as valid.

## 14. Hard Filters

Every profile reruns the existing eligibility path for allergies, dietary needs, food-safety guardrails, appliances, cooking time, selected Pantry source sufficiency, serving feasibility, leftover requirements, substitutions, and mandatory ingredients.

## 15. Priority-Food Quantity

Selected rescue-food shortages block that portion profile. Chef Nova does not buy extra selected priority food to make the profile pass.

## 16. Leftover Safety

Planned leftovers require reviewed recipe leftover or batch guidance plus an open future slot inside the storage window.

## 17. Unallocated Servings

Unallocated servings use `effective recipe yield - current meal servings - planned leftover servings`. Chef Nova displays this as unassigned, not guaranteed waste.

## 18. Recommendation Configuration

`SMART_PORTION_SUGGESTION_CONFIG` version 1 centralizes scoring weights and penalties.

## 19. Deterministic Selection

Eligible profiles sort by explicit preference fit, unallocated servings, coverage, grocery count, cost, cooking time, batch count, yield, and stable profile ID.

## 20. User Interface

The interface shows People eating tonight, a leftover preference fieldset, Chef Nova's suggestion, Use This Suggestion, Edit Servings, and Return to Chef Nova Suggestion when relevant.

## 21. Cook This Tonight Integration

Use This Suggestion updates the current Cook This Tonight draft only. The Step 12 confirmation flow still revalidates before creating reservations or saving a calendar meal.

## 22. Food-Rescue Ranking Integration

Serving changes recalculate Food Rescue ranking, selected-food coverage, Pantry coverage, missing groceries, cost, time, and explanation text.

## 23. Pantry, Shopping List, and Cost

Suggestion activity is preview-only. Pantry allocation, Shopping List demand, and full-package cost are recalculated without mutating Pantry, Shopping List, calendar, reservations, or Food Event History.

## 24. User Overrides

Manual serving edits are preserved in the current draft and labelled as user-adjusted in the result. They do not update household data.

## 25. Storage and User Isolation

Registered users use existing user-scoped state. Guest suggestions remain temporary in the active session. No permanent Smart Portion storage key was added.

## 26. Accessibility

The panel uses visible labels, a fieldset and legend, associated errors, specific action names, text warnings, and the existing live-region system.

## 27. Responsive Design

Inputs, radio choices, metrics, future meal rows, explanations, and actions stack on narrow screens.

## 28. Print and Export

Print styles preserve suggestion details as a suggested portion plan. Unconfirmed suggestions are not printed as committed plans.

## 29. Testing

Validation uses syntax checks, recipe JSON parsing, ingredient validation, price validation, the existing test suite, and the Step 13 static checks.

## 30. Deferred Work

Nutrition prescriptions, waste analytics, household pattern learning, environmental-impact reporting, automatic future meal scheduling, and automatic leftovers remain outside Step 13.
