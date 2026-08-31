# Cook Before It Spoils Food-Safety Guardrails

## 1. Purpose

Chef Nova now uses one shared Food-Safety Guardrail layer before Pantry items can influence automatic planning. The guardrail never declares food safe. It decides whether a Pantry item can be used automatically, needs review, or must be excluded from planning.

## 2. Source Guidance

The policy catalogue uses public Canadian food-safety guidance reviewed on 2026-08-11:

- Health Canada safe food storage: https://www.canada.ca/en/health-canada/services/general-food-safety-tips/safe-food-storage.html
- Health Canada food-safety tips for leftovers: https://www.canada.ca/en/health-canada/services/general-food-safety-tips/food-safety-tips-leftovers.html
- Public Health Agency of Canada general food-safety tips: https://www.canada.ca/en/public-health/services/food-safety/general-food-safety-tips.html
- Government of Canada leftover storage infographic: https://www.canada.ca/en/services/health/publications/food-nutrition/infographic-leftovers.html

Chef Nova records these sources in each policy entry so guidance can be reviewed later.

## 3. Shared Policy Catalogue

`FOOD_SAFETY_POLICY_CATALOGUE` lives in `app.js` and uses schema version `1`.

Each policy includes:

- `policyId`
- `schemaVersion`
- `sourceName`
- `sourceUrl`
- `sourceReviewedAt`
- `foodCategories`
- `storageLocation`
- refrigerator guidance
- freezer quality guidance
- date-anchor rules
- room-temperature guidance
- reheating guidance when applicable
- user-facing caution text

The first policy set covers common Pantry and leftover categories: fresh meat, ground meat, poultry, fish, shellfish, opened dairy, shell eggs, cooked leftovers, soups, and leaf lettuce.

## 4. Safety Result Model

Every Pantry item can receive a normalized result from `getFoodSafetyGuardrailForPantryItem()`.

The result includes:

- `schemaVersion`
- `policyId`
- `policySource`
- `policyReviewedAt`
- `decision`
- `decisionLabel`
- `primaryReasonCode`
- `reasons`
- `hardExclusion`
- `requiresUserReview`
- `qualityConcernOnly`
- `canUseForAutomaticPlanning`
- `canAppearInSuggestions`
- `canAppearInShoppingContext`
- `canAppearInCookBeforeItSpoils`
- `userMessage`
- `plannerMessage`
- `reviewQuestions`
- `temperatureRequirements`

Planning code consumes this result instead of repeating safety logic.

## 5. Decision Values

Food-Safety Guardrail decisions are:

- `eligible-for-planning`
- `storage-review-required`
- `not-eligible-for-automatic-planning`
- `quality-review`

Hard exclusions cannot be overridden by recipe ranking, Pantry-first matching, Shopping List logic, or Cook Before It Spoils sorting.

## 6. Main Rules

Chef Nova excludes a Pantry item from automatic planning when:

- the expiration/use-by date has passed
- refrigerator or freezer temperature is outside guidance
- continuous storage is not confirmed
- room-temperature exposure is over the two-hour limit
- the item has a recorded condition concern

Chef Nova requires user review when:

- no matching policy exists
- key storage dates are missing
- storage continuity is unknown
- temperature confirmation is missing
- room-temperature exposure is unknown

Chef Nova may show a quality review when:

- a best-before date or freezer-quality window has passed without a separate hard exclusion

## 7. Permanent Notice

Food-safety surfaces display a permanent notice:

Chef Nova provides food-safety guidance, not a guarantee. When storage, dates, temperature, or condition are uncertain, discard the food or ask a qualified food-safety professional.

The notice also warns that appearance, smell, and taste cannot confirm food safety.

## 8. Storage Review

Pantry cards now include a storage review form for items needing more information.

The form asks users to record facts only:

- continuous refrigerated/frozen storage
- room-temperature exposure
- refrigerator/freezer temperature
- condition concerns

The form does not ask users to confirm that food is safe.

## 9. Event History Integration

Storage reviews append food events through the existing Step 5 food-event history system.

New event types are:

- `storage-conditions-confirmed`
- `temperature-excursion-recorded`
- `room-temperature-exposure-recorded`
- `reheated` / `REHEATED`
- `leftover-transformed`
- `food-condition-concern-recorded`
- `safety-review-corrected`

These events are metadata or correction records. They do not count as consumption, waste, saved food, or nutrition.

## 10. Planning Integration

The guardrail feeds the shared recipe eligibility context.

Excluded ingredient IDs are added to:

- explicit unavailability
- Recipe Finder matching context
- Meal Planner generation context
- Pantry-first planning context
- Shopping List missing-ingredient context

This keeps one safety decision path across planning features.

## 11. Cook Before It Spoils Integration

Cook Before It Spoils now groups items as:

- Eligible for Planning
- Storage Review Required
- Not Eligible for Automatic Planning
- Quality Review

The mode is still a planning workspace. It does not edit Pantry items, save meals, dismiss reminders, or change the Shopping List.

## 12. Guest and User Storage

Registered users store storage-environment facts with user-scoped storage. Guests store temporary storage-environment facts in session storage.

Guest storage key:

- `chefNovaGuestStorageEnvironment`

User storage feature:

- `StorageEnvironment`

No normal user Pantry, Meal Plan, Shopping List, or Favorites keys are used for temporary guest data.

## 13. Accessibility and Mobile

The guardrail UI uses visible headings, text status labels, fieldsets, radio labels, form help text, live-region updates, and responsive stacking on small screens.

## 14. Deferred Work

Later steps can add richer UI for discard, donation, freezing, thawing, reheating, and correction flows. Those actions should keep using the same food-event and guardrail models.
