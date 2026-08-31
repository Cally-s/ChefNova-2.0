# Cook Before It Spoils Step 6 Validation Report

## Summary

Step 6 adds a centralized Food-Safety Guardrail system for Chef Nova. Pantry items now pass through one shared policy and result model before they can be used by automatic planning, Recipe Finder context, Pantry-first suggestions, Shopping List context, or Cook Before It Spoils.

Chef Nova still does not guarantee that food is safe. The app now uses conservative guidance, permanent notices, and review states when dates, storage, temperature, or condition information is uncertain.

## Evidence Report

1. Files inspected: `app.js`, `style.css`, `scripts/recipe-eligibility-ranking.js`, `tests/recipe-eligibility-ranking.test.js`, Cook Before It Spoils Step 1-5 docs, Pantry-first planning script, Recipe Eligibility script, Ingredient Catalogue, Pantry code, Shopping List code, Meal Planner code, and Recipe Finder code.
2. External guidance reviewed: Health Canada safe food storage, Health Canada leftovers guidance, Public Health Agency of Canada general food-safety tips, and Government of Canada leftovers storage infographic.
3. Files changed: `app.js`, `style.css`, `scripts/recipe-eligibility-ranking.js`, and `tests/recipe-eligibility-ranking.test.js`.
4. Files created: `docs/cook-before-it-spoils-food-safety-guardrails.md`, `docs/cook-before-it-spoils-step-6-report.md`, and `tests/cook-before-it-spoils-step-6-food-safety-static.test.js`.
5. Central policy catalogue added: `FOOD_SAFETY_POLICY_CATALOGUE`.
6. Policy catalogue schema version: `FOOD_SAFETY_POLICY_SCHEMA_VERSION = 1`.
7. Guardrail result schema version: `FOOD_SAFETY_GUARDRAIL_VERSION = 1`.
8. Storage review schema version: `STORAGE_SAFETY_REVIEW_VERSION = 1`.
9. Storage environment schema version: `STORAGE_ENVIRONMENT_VERSION = 1`.
10. Official temperature constants added: refrigerator maximum 4 C, freezer maximum -18 C, danger zone 4 C to 60 C, and leftover reheating target 74 C.
11. Policy source fields added: `sourceUrl` and `sourceReviewedAt`.
12. Policy coverage added for fresh meat, ground meat, fresh poultry, fresh fish, shellfish, opened dairy, shell eggs, cooked leftovers, soups, and leaf lettuce.
13. Each policy stores storage location, date-anchor rule, refrigerator window, freezer-quality window where available, room-temperature guidance, and user-facing caution text.
14. Guardrail decisions added: eligible for planning, storage review required, not eligible for automatic planning, and quality review.
15. Hard exclusion reasons added for expired/use-by dates, temperature outside guidance, unconfirmed continuous storage, room-temperature exposure over the two-hour limit, and condition concerns.
16. Review reasons added for missing policy, missing date, unconfirmed storage details, unknown storage continuity, unknown room-temperature exposure, and missing temperature confirmation.
17. Quality-review handling added for quality windows such as best-before or freezer-quality dates when no hard exclusion applies.
18. Shared guardrail function added: `getFoodSafetyGuardrailForPantryItem()`.
19. Shared pantry guardrail selector added: `getFoodSafetyGuardrailsForPantry()`.
20. Shared excluded ingredient selector added: `getFoodSafetyExcludedIngredientIds()`.
21. Policy coverage selector added: `getFoodSafetyPolicyCoverage()`.
22. Permanent food-safety notice renderer added: `renderFoodSafetyNotice()`.
23. Pantry item food-safety panel renderer added: `renderFoodSafetyGuardrailForPantryItem()`.
24. Storage review form renderer added: `renderStorageSafetyReviewForm()`.
25. Storage review submit handler added: `handleStorageSafetyReviewSubmit()`.
26. Storage environment loading and saving added for user-scoped storage.
27. Guest storage environment key added: `chefNovaGuestStorageEnvironment`.
28. Guest storage environment remains temporary in session storage.
29. Registered-user storage environment follows existing user-specific storage helpers.
30. Existing Pantry item schema extended with `storageSafetyReview`.
31. Existing Pantry normalization now preserves storage safety reviews.
32. Storage review fields normalize unknown values conservatively.
33. Storage review form defaults to uncertainty, not approval.
34. Room-temperature exposure validation requires whole nonnegative minutes.
35. Refrigerator and freezer temperatures accept Celsius or Fahrenheit input and normalize to Celsius.
36. Storage-temperature facts save only after the related Pantry review command succeeds.
37. Storage reviews append events through the Step 5 command/event path.
38. New food event types added for storage-condition confirmation, temperature excursion, room-temperature exposure, reheating, leftover transformation, condition concern, and safety-review correction.
39. New food-safety event types classify as metadata or correction, not usage or outcome.
40. Event labels added for new food-safety event types.
41. Storage review event notes state that the review records facts only and does not confirm food safety.
42. Recipe eligibility ranking adds a non-overridable exclusion for food-safety guardrail ingredient IDs.
43. Recipe eligibility reasons added for food-safety guardrail exclusion and review-required context.
44. Pantry active-item selector now excludes items that cannot be used for automatic planning.
45. Pantry-first recipe suggestions now depend on guardrail-approved active Pantry items.
46. Recipe Finder context receives food-safety excluded ingredient IDs.
47. Meal Planner generation context receives food-safety excluded ingredient IDs through the shared recipe eligibility context.
48. Shopping List missing-ingredient context avoids treating excluded Pantry items as available.
49. Cook Before It Spoils now renders the permanent food-safety notice.
50. Cook Before It Spoils now groups Pantry items by guardrail decision.
51. Cook Before It Spoils shows coverage counts for matching reviewed guidance and review-required items.
52. Cook Before It Spoils keeps its planning-only behavior.
53. Pantry cards show decision labels, reasons, source links, and review prompts.
54. Food-safety text avoids the wording that appearance, smell, or taste can confirm safety.
55. No "Use Anyway" override was added.
56. No "Still good" override was added.
57. No second Pantry system was created.
58. No second Date Intelligence system was created.
59. No second Recipe Eligibility system was created.
60. No second Food Event History system was created.
61. No backend, database, or external API was added.
62. Direct `index.html` support remains intact.
63. Styling added for safety notice, decision panels, grouped Cook Before It Spoils cards, storage review details, status pills, and mobile stacking.
64. Static Step 6 test added for centralized constants, source URLs, permanent notice, forbidden overrides, planning integration, event integration, CSS selectors, and documentation.
65. Recipe eligibility test added for non-overridable food-safety exclusion.
66. Required docs added for guardrail model and implementation report.

## Validation Performed

Commands run with the bundled Node.js runtime:

- `node tests/cook-before-it-spoils-step-6-food-safety-static.test.js`
- `node tests/recipe-eligibility-ranking.test.js`
- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- `node --check scripts/recipe-eligibility-ranking.js`
- parse `data/recipes.json`
- run all `tests/*.js`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`

Results:

- Syntax checks passed for `app.js`, `rules.js`, `data/recipes.js`, and `scripts/recipe-eligibility-ranking.js`.
- `data/recipes.json` parsed successfully.
- All 31 project tests passed.
- Ingredient data validation passed.
- Price catalogue validation passed.

## Risks and Notes

The first policy catalogue is intentionally conservative and covers the most important common Pantry categories. Items without a matching reviewed policy require user review instead of being used automatically.

Food-safety guidance can change. The `sourceReviewedAt` field records when the source was reviewed so future updates can refresh the catalogue cleanly.
