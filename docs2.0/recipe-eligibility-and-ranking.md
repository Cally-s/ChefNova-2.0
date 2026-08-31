# Chef Nova Recipe Eligibility and Ranking

## 1. Purpose

Recipe selection now has two stages: hard eligibility first, then soft ranking. Hard filters decide whether a recipe can be used. Soft preferences only rank recipes that already passed.

## 2. Central Eligibility Context

Chef Nova builds one context from the current user profile, dietary preference, Budget Rescue appliances, maximum cooking time, required servings, Pantry, and ingredient availability. The context is derived at runtime and is not saved into the recipe database.

## 3. Eligibility Statuses

Recipes return `eligible`, `ineligible`, or `indeterminate`. Only `eligible` recipes can enter automatic meal planning or Replace Meal candidates.

## 4. Allergy Protection

Saved allergies are hard exclusions. Chef Nova checks recipe allergen metadata and canonical ingredient allergen metadata when available. Allergy conflicts cannot be overridden by low cost, Pantry coverage, sale prices, or preferences.

## 5. Required Dietary Restrictions

Required dietary restrictions are hard filters. A recipe must satisfy every selected restriction. Dietary matching uses existing recipe dietary tags and supported normalized names.

## 6. Appliance Feasibility

Preparation methods may list required appliances. A recipe is eligible when at least one explicit method can be made with available appliances. Current production recipes mostly do not include detailed appliance methods, so Chef Nova uses the existing default recipe method until richer metadata is added.

## 7. Cooking-Time Feasibility

Maximum cooking time uses the existing Meal Planner maximum time preference. Chef Nova uses `totalTime`, then upper time fields, then `cookingTime`. When batch count is greater than one, sequential batch time is included unless recipe metadata says batches run concurrently.

## 8. Serving Feasibility

Serving checks use the selected or required serving amount. Scalable recipes may scale within supported limits. Fixed-yield recipes must either produce enough servings or explicitly support batching.

## 9. Mandatory Ingredient Availability

Not being in the Pantry is not the same as unavailable. Missing prices are not treated as unavailable. Chef Nova only blocks a mandatory ingredient when current user-controlled data marks it unavailable or the ingredient cannot be resolved.

## 10. Substitute Feasibility

Step 9 supports only minimal recipe-approved substitutes. Substitute groups alone are not proof of interchangeability. A substitute must be explicitly approved and must pass allergies, dietary rules, quantity rules, and availability checks.

## 11. Hard-Filter Pipeline

The central evaluator checks recipe validity, allergies, dietary restrictions, serving feasibility, appliance feasibility, cooking time, mandatory ingredients, and substitutes before any Pantry, cost, sale, or preference score runs.

## 12. Soft Preferences

Soft scoring can consider preferred ingredients, cuisine, variety, minimal cleanup, batch cooking, Pantry usage, cost per serving, active sales, and cross-recipe reuse. These signals never make an ineligible recipe eligible.

## 13. Cost and Pantry Integration

Step 6 cost calculations and Step 8 Pantry simulations run only after hard eligibility. Missing cost is not treated as zero, and Pantry absence is not treated as ingredient unavailability.

## 14. Deterministic Ranking

Ranking uses score first, then Pantry coverage, use-soon Pantry use, fewer new grocery groups, complete cost per serving, and stable recipe ID.

## 15. Replacement and Saved Plans

Replace Meal uses the same central eligibility engine. Current saved meal slots are re-evaluated when displayed and show a text warning if current requirements no longer match.

## 16. Missing Metadata

Missing safety or feasibility metadata can return `indeterminate`. Production recipe appliance metadata is still limited, so richer method metadata remains future work.

## 17. Accessibility

Compatibility warnings use readable text and `role="status"`. No allergy or hard-filter reason depends on color alone or hover-only UI.

## 18. Testing

Validation includes syntax checks, JSON parsing, ingredient and price validation, cost-engine tests, Price Confidence tests, Pantry-first tests, recipe-eligibility tests, and static integration checks.

## 19. Deferred Work

Full Budget Rescue optimization, leftover planning, complete cheaper substitution recommendations, store inventory, live grocery prices, and retailer scraping remain later steps.
