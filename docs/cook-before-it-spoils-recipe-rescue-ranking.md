# Cook Before It Spoils: Recipe Rescue Ranking

Step 9 adds a temporary food-rescue ranking profile to the existing Recipe Finder. It runs only when a user starts recipe search from the Use These First panel.

## Ranking Profile

- Profile id: `food-rescue`
- Version: `FOOD_RESCUE_RECIPE_RANKING_VERSION`
- Score configuration: `FOOD_RESCUE_RECIPE_SCORE_CONFIG`
- Storage: temporary in app state only

The ranking request is created from selected Use These First sources. It does not write to localStorage or sessionStorage.

## Source Revalidation

Before ranking recipes, Chef Nova revalidates each selected source against current Pantry data and Step 7 safety logic.

A source is accepted only when:

- it still exists
- it has safe automatic-planning status
- it has a measurable available quantity
- it has a rescue recipe priority score
- its ingredient is linked to structured recipe ingredient data

Prepared leftover transformation is blocked until a validated leftover transformation rule exists.

## Recipe Eligibility

Recipes must pass the existing eligibility engine before ranking. Allergy, dietary, unavailable ingredient, serving, cooking constraint, and food-safety guardrail exclusions are preserved.

## Structured Matching

Recipes are matched by structured ingredient ids and compatible units/forms. Recipe titles, category labels, and free-text descriptions do not count as rescue-source usage.

## Scoring

The ranking score ranges from 0 to 100.

Positive factors:

- priority food breadth
- weighted rescue-source coverage
- current Pantry coverage
- serving suitability
- cross-meal ingredient reuse
- cooking practicality
- useful leftovers

Penalties:

- new grocery purchases
- excess leftovers
- future unused-food risk
- incomplete price data

Meaningful use requires at least 15% projected use of a selected source, unless the recipe uses all available quantity.

## Display

Recipe cards show:

- rescue score
- rescue match label
- primary reasons
- projected selected-food use
- rescue details modal

Favorites, allergy warnings, recipe filters, ingredient matching, and recipe details keep their existing behavior.
