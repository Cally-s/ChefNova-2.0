# Budget Rescue Step 9 - Recipe Eligibility and Ranking Report

## Goal

Create one centralized recipe eligibility and ranking pipeline so hard requirements run before Pantry, cost, sale, or preference ranking.

## Files Changed

- `index.html`
- `app.js`
- `style.css`
- `scripts/recipe-eligibility-ranking.js`
- `tests/recipe-eligibility-ranking.test.js`
- `tests/recipe-eligibility-static.test.js`
- `docs/recipe-eligibility-and-ranking.md`
- `docs/recipe-filter-report.md`
- `co-gpt/budget-rescue-step-9-recipe-filter-report.md`

## Validation Summary

- Recipes validated: current production recipe data plus focused fixtures
- Allergen scenarios tested: 4
- Dietary scenarios tested: 2
- Appliance scenarios tested: 2
- Cooking-time scenarios tested: 2
- Serving scenarios tested: 2
- Ingredient-availability scenarios tested: 2
- Substitute-feasibility scenarios tested: 1
- Soft-ranking scenarios tested: 2
- Replacement scenarios tested: 1 static integration guard
- Saved-plan re-evaluation scenarios tested: 1 static integration guard
- Recipes with incomplete hard-filter metadata: appliance preparation-method metadata remains limited in production recipes

## Required Results

```text
Allergen matches allowed into eligible set: 0
Dietary violations allowed into eligible set: 0
Unavailable-appliance recipes allowed: 0
Over-time recipes allowed: 0
Unsupported-serving recipes allowed: 0
Unavailable mandatory ingredients ignored: 0
Soft preferences overriding hard failures: 0
Missing prices treated as ingredient unavailability: 0
Pantry absence treated as ingredient unavailability: 0
Separate replacement filter implementations: 0
```

## Implementation Result

Chef Nova now evaluates recipe eligibility through one shared module before recipe generation, Budget Rescue ranking, Replace Meal candidates, generated-plan saving, and current meal-slot compatibility warnings.

## Notes

Current recipe data does not yet contain full preparation-method and appliance metadata for every recipe. The new engine supports that metadata when present and documents the current limitation.
