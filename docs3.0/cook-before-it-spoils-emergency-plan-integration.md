# Chef Nova Emergency Plan and Cook Before It Spoils Integration

## 1. Purpose

Emergency Plan can prioritize safe food needing attention while keeping safety, storage, allergies, dietary rules, appliances, cooking time, and meal-date eligibility non-negotiable. The plan uses supportive wording and never pressures a user to use food they do not trust.

## 2. Existing Systems Reused

Step 40 reuses the existing Meal Planner, Emergency mode, Pantry, leftover inventory, Freezer Inventory view, Use-First Priority Engine, hard filters, Cost Engine, Shopping List, Meal Calendar, Step 39 reservations, Food Event History, and Impact Ledger boundary.

## 3. No Duplicate Emergency Planner

Emergency Plan remains one mode inside the existing Meal Planner. No separate Emergency Planner, Pantry, Shopping List, Cost Engine, Recipe Database, or reservation system is created.

## 4. Natural-Language Interpretation

Natural-language requests such as `I have $25 until Friday` are parsed locally into budget, currency, start date, inclusive end date, timezone, household, meals, appliances, cooking time, and source options. The user reviews the interpreted values before plan generation.

## 5. Safety Precedence

Hard filters run before urgency, rescue, budget, Pantry, leftover, frozen-food, or preference scoring. A hard-excluded candidate is not selectable and receives no emergency, rescue, or budget score.

## 6. Limited Budget and Safety

A limited budget never restores unsafe, true-expired, allergy-conflicting, dietary-conflicting, appliance-incompatible, over-time, stale, or unverified food.

## 7. User Control

Users may exclude any Pantry, leftover, or frozen item from the current Emergency planning run. Exclusion preserves the food record, quantity, dates, Food Event History, priority status, and saved plans.

## 8. Precise Date Labels

Best-before, true expiration, app-estimated freshness, leftover timeline, and unknown date labels stay distinct. Emergency Plan may prioritize eligible food needing attention but must not relabel freshness windows as expiration dates.

## 9. Emergency Planning Context

The context stores version, plan mode, user scope, structured interpretation, budget, period, Pantry snapshot, leftover snapshot, freezer snapshot, reservation snapshot, priority snapshot, hard requirements, and source revisions.

## 10. Eligible Inventory

Eligible inventory is built from exact Pantry items before recipe scoring. Sources can include Pantry lots, confirmed leftover batches, frozen ingredients, frozen ready meals, canned food, shelf-stable staples, and active-plan purchases.

## 11. Questionable Food

Questionable food is marked Review Required or Excluded. It is not shown as free food and is not ranked as an emergency priority until eligibility is verified.

## 12. Priority Ordering

Safe food needing attention, eligible leftovers, valid frozen food, compatible Pantry food, canned food, staples, low-cost groceries, proteins, batch opportunities, and low-new-purchase recipes are considered in that general order after hard eligibility.

## 13. Meal-Date Eligibility

Food is evaluated for the actual meal date. Food eligible on Tuesday is not automatically eligible for Friday.

## 14. Leftovers

Leftovers require exact batch identity, known original cooking date, known storage, quantity, eligible timeline, reheat compatibility, allergy and dietary compatibility, and no conflicting reservation.

## 15. Frozen Food

Frozen food can support an Emergency Plan only when it is available, still frozen, compatible with available appliances, within preparation time, and permitted by current guardrails. Scheduling does not thaw or consume it.

## 16. Pantry-First Planning

The existing Pantry-first planner allocates compatible Pantry quantities, leftovers, and frozen food in a temporary planning inventory. It calculates missing quantities without mutating real Pantry records.

## 17. Reservations

Emergency Plan respects Step 39 reservations. Other-plan reservations are protected, same-plan reservations can satisfy demand, and unknown or entire-item holds require review.

## 18. Shopping List

Emergency Plan reuses the existing Shopping List sections, including Do Not Buy, Buy Only the Missing Amount, Check Before Buying, Need to Buy, and user extras. Missing quantities and package costs use the shared purchase-group flow.

## 19. Pantry Value Versus Checkout Cost

Pantry value is historical or estimated value already at home. Checkout cost is new grocery spending and uses full packages. Pantry value is not subtracted from checkout cost and is not treated as money saved.

## 20. Price Confidence

Price confidence uses the existing Budget Rescue model. Missing required prices make the total incomplete and are never treated as zero.

## 21. Candidate Evaluation

Emergency candidates include recipe ID, meal slot, hard eligibility, source allocations, rescue evaluation, budget evaluation, practicality evaluation, score fields, and source revisions.

## 22. Emergency Score

The score configuration is versioned. It is a planning preference layer only; safety is enforced before scoring.

## 23. Hierarchical Plan Building

The sequence is interpretation, safe inventory, eligible candidates, first safe plan, safe repair, then the best safe result.

## 24. Meal Coverage

Emergency Plan shows requested, planned, and unplanned meals. Unsafe food is not inserted just to fill a slot.

## 25. Household and Servings

Household size is an editable serving starting point. Chef Nova does not make rigid calorie assumptions about adults or children.

## 26. Practicality

Planning considers appliances, maximum cooking time, cleanup, preparation timing, batch size, thawing needs, storage needs, and leftover feasibility.

## 27. No-Appliance Planning

When no appliance is available, Emergency Plan can use only no-cook, ready-to-assemble, or compatible ready-to-eat options that still pass safety requirements.

## 28. Planned Leftovers

Planned leftovers are allowed only when later use is valid, storage is available, and the plan does not create excessive unresolved leftovers.

## 29. Shared Ingredients

Shared packages are purchased once and reused across planned meals. Meal-level allocation is separate from the authoritative checkout total.

## 30. Package Remainders

Large one-use package remainders are penalized when they create likely waste risk and no later safe use exists.

## 31. Repetition

Emergency Plan may repeat meals when it meaningfully reduces cost and remains safe, practical, and clear to the user.

## 32. Respectful Messaging

Messages avoid judgment and pressure. Chef Nova says what was safely planned, what needs review, and which options remain.

## 33. Over-Budget Repair

Repairs try optional removals, safe substitutions, Pantry-based recipes, shared packages, eligible leftovers, eligible frozen meals, valid planned leftovers, fewer unique packages, and shorter plans only after safe practical alternatives are exhausted.

## 34. Partial Plans

Partial plans clearly show planned and unplanned meals. No safety or dietary requirement is removed.

## 35. Priority-Food Summary

Emergency results show included items, unscheduled items, review-required items, and exclusion reasons.

## 36. Recipe Cards

Recipe cards can show planned emergency benefit, Pantry contribution, new grocery allocation, practicality, and replacement actions. Planned quantities are not called consumed.

## 37. Save Plan

Save Plan uses the existing Calendar and Step 39 reservations. It does not deduct Pantry, mark food used, thaw frozen food, or create impact credit.

## 38. Replace Meal

Replacement revalidates hard filters, meal dates, Pantry allocations, leftovers, frozen food, Shopping List packages, checkout cost, budget, priority food, and planned leftovers.

## 39. Meal Completion

Actual completion uses confirmed quantities. Planned amounts become actual Pantry deduction or impact only after a user-confirmed outcome.

## 40. Impact Ledger Boundary

Emergency planning, previews, saved plans, reservations, and planned leftovers create no Impact Ledger rescue credit.

## 41. Stale and Multi-Tab Protection

Source revisions cover Pantry, leftovers, freezer, reservations, dates, prices, allergies, dietary settings, appliances, recipes, Shopping List, Calendar, timezone, and scoring version. Stale data requires review.

## 42. User Isolation

Registered users stay scoped to their own Pantry, leftovers, frozen food, reservations, budgets, prices, Shopping Lists, and plans. Guest Emergency data remains temporary.

## 43. Accessibility

Emergency Plan uses visible headings, labelled budget and dates, visible household and meal counts, textual statuses, contextual action names, live-region summaries, focus-managed dialogs, and wrapped labels.

## 44. Responsive Design

Interpretation, food summaries, budget totals, meal cards, Shopping List details, and action buttons stack on mobile without a separate mobile planner.

## 45. Print and Export

Printed output must preserve original request, budget, dates, household, requested and planned meals, planned allocations, review-required food, missing groceries, checkout cost, price coverage, and planned-versus-confirmed wording.

## 46. Testing

Validation includes syntax checks, JSON parsing, Step 40 static checks, Emergency/Budget Rescue planning checks, Pantry schema checks, Food Event checks, Shopping List checks, cost checks, price validation, and ingredient validation.

## 47. Deferred Work

Automatic Pantry deduction, automatic meal completion, automatic freezing, automatic thawing, environmental calculations, nutrition diagnosis, and safety-rule relaxation remain outside Step 40.
