# Budget Rescue Planning Algorithm

## Goal

Budget Rescue creates a safe weekly meal-plan preview that balances budget, Pantry use, shared ingredients, cooking practicality, variety, and price confidence.

The algorithm is deterministic. The same recipes, Pantry, prices, preferences, and plan date should produce the same result.

## Inputs

Chef Nova builds a normalized Budget Rescue request from the existing planner state:

- weekly budget and planning target
- household adults, children, and suggested servings
- selected days and meal types
- saved allergies and dietary preference
- available appliances and cooking-time preference
- preferred and avoided foods
- selected price source
- current Pantry

No Budget Rescue data is stored in a separate profile.

## Statuses

Budget Rescue returns one of these statuses:

- `within-planning-target`
- `within-weekly-budget`
- `above-weekly-budget`
- `incomplete-price-estimate`
- `partial-safe-plan`
- `no-safe-plan`

The status is based on filled slots, hard safety checks, grocery price completeness, the planning target, and the weekly budget.

## Four Passes

### Pass 1: Build eligible recipe candidates

For each requested slot, Chef Nova applies the centralized Step 9 eligibility engine before cost or Pantry scoring.

Recipes are rejected if they violate allergies, dietary restrictions, appliance availability, cooking time, servings, or mandatory ingredient rules.

### Pass 2: Construct the first complete plan

Chef Nova fills slots in stable order:

1. date ascending
2. breakfast
3. lunch
4. dinner

Each candidate is scored using:

- marginal grocery purchase cost
- cost per serving
- Pantry coverage
- use-soon Pantry lots
- opened Pantry lots
- shared ingredients
- recipe and cuisine variety
- cooking practicality
- price confidence

The highest deterministic candidate fills each open slot.

### Pass 3: Repair over-budget plans

If the complete plan is above budget, Chef Nova attempts bounded repairs. Step 10 implements compatible lower-cost recipe replacement and records the full required repair order for future steps.

Repair ordering:

1. validated lower-cost substitute
2. lower-cost compatible recipe
3. planned leftover lunch
4. Pantry-based meal
5. Pantry-based snack
6. remove optional ingredients
7. reuse required ingredients
8. reduce unique grocery items

No repair may relax allergies or required dietary restrictions.

### Pass 4: Return the best safe result

Chef Nova recalculates final cost and price confidence through the Step 6 cost engine and Step 7 price confidence helpers.

The generated plan continues through the existing review, replacement, and Save Plan workflow.

## Scope Notes

Step 10 does not add the full leftover interface, live grocery pricing, store inventory, or the complete substitution recommendation engine.

Snack slots are not forced into the weekly planner because the current weekly UI supports Breakfast, Lunch, and Dinner.
