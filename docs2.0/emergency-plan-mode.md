# Chef Nova Emergency Plan Mode

## 1. Purpose

Emergency Plan creates a short meal plan around a confirmed budget, exact end date, existing Pantry items, and current Chef Nova safety settings.

## 2. Existing System Reuse

Emergency Plan is a mode inside the existing Meal Planner. It reuses the Recipe Database, Ingredient Catalogue, Unit Registry, Price Catalogue, Price Resolver, Cost Engine, Price Confidence system, Pantry, Pantry allocation, eligibility engine, Budget Planning Algorithm, planned leftover system, substitution system, Shopping List, Budget Status panel, recipe cards, Meal Calendar, Save Plan workflow, and Replace Meal workflow.

## 3. Emergency Form

The form includes a natural-language request, available budget, inclusive end date, Use My Pantry control, and include options for leftovers, frozen food, canned food, and low-cost staples.

## 4. Emergency State

Emergency draft state stores the raw request, budget in integer cents, CAD currency, start date, end date, number of days, Pantry choice, include options, parse result, confirmation state, parsed timestamp, reference local date, timezone, and manual-adjustment flag.

## 5. Start-Date Policy

The default start date is the next local calendar day. If the request says today, the plan starts today. If it says tomorrow, the plan starts tomorrow. Dates are stored as local ISO calendar dates.

## 6. Natural-Language Parsing

The local parser supports examples such as `I have $25 until Friday`, `I can spend $25 until Friday`, `My budget is $25 through Friday`, `25 dollars until Friday`, `CAD 25 until Friday`, and `I have $25 for 4 days`.

## 7. Relative Weekday Resolution

Weekdays resolve in the app timezone, `America/Toronto`. `Until Friday` means the first Friday on or after the derived start date. `Next Friday` means the Friday after the upcoming Friday.

## 8. Interpreted Preview

Chef Nova always shows the interpreted budget, exact date range, number of days, household, Pantry choice, and include priorities before generation. The user must confirm the interpretation before creating a plan.

## 9. Hard Requirements

Emergency urgency does not override allergies, dietary restrictions, unavailable appliances, cooking-time limits, required servings, or central eligibility rules.

## 10. Emergency Planning Profile

The centralized profile prioritizes Pantry ingredients, use-soon food, existing leftovers, frozen food, canned food, low-cost staples, ingredient reuse, compatible protein sources, batch cooking, and fewer new purchases.

## 11. Pantry, Use-Soon Food, and Existing Leftovers

The mode uses the existing Pantry and Pantry-first simulation. Preview planning does not deduct real Pantry quantities. Existing leftovers are handled through the current leftover and batch-cooking systems.

## 12. Frozen, Canned, and Staple Priorities

Frozen, canned, and staple settings are planning priorities, not allergy or dietary settings. Low-cost staples require usable current price data and are never treated as free.

## 13. Protein-Source Prioritization

Compatible protein-source priority uses reviewed ingredient metadata and usable prices. It does not claim foods are nutritionally identical.

## 14. Batch Cooking and New Purchases

Batch cooking and planned leftovers reuse Step 11 logic. New purchases and package surplus reuse Step 6 and Step 15 data.

## 15. Result Statuses

Emergency result statuses include within budget, within budget estimated, above budget, incomplete price estimate, partial within budget, partial above budget, no safe plan, and plan requires review.

## 16. Budget and Price Confidence

Remaining budget appears only when complete pricing is available. Missing prices are shown as incomplete, never as zero.

## 17. Result Metrics

Meals planned count filled meal slots. Pantry ingredients count unique allocated Pantry groups. New grocery items count active purchase groups with missing quantity. Leftover meals count leftover meal slots.

## 18. Save and Replace Integration

The existing Save Plan workflow stores Emergency metadata with the plan. Existing Replace Meal remains the replacement path.

## 19. Accessibility

The form uses visible labels, fieldsets, legends, exact date text, non-color-only warnings, keyboard buttons, and polite live regions.

## 20. Responsive and Print Design

Budget and date fields stack on mobile. Include options wrap. Print output preserves budget, dates, summary, warnings, and result details while hiding interactive-only controls.

## 21. Testing

Run `node --check app.js`, the Emergency Plan static test, and the existing Budget Rescue, cost, confidence, pantry, substitution, shopping-list, recipe-card, and data validation tests.

## 22. Deferred Work

Live grocery prices, retailer inventory, online ordering, payment processing, broader AI parsing, and medical nutrition guidance are not included.

