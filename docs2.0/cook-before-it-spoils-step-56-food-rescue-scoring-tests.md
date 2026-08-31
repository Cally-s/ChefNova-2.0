# Cook Before It Spoils Step 56: Food-Rescue Recipe Scoring Tests

## Purpose

These tests verify Food-Rescue Recipe Scoring for selected priority Pantry foods.

The baseline scenario must rank recipes by actual structured Pantry quantity rescued, after hard filters run.

## Fixed Clock

Use this fixed test clock:

- Reference local date: August 15, 2026
- Reference timezone: America/Toronto
- Reference instant: 2026-08-15T12:00:00-04:00

Do not use the current real clock for this scenario.

## Required Scenario

Selected priority Pantry foods:

- Spinach: 180 g available, best before August 16, 2026
- Mushrooms: 250 g available, Use-Soon Estimate ending August 17, 2026

Recipe A:

- 20 g spinach
- 0 g mushrooms

Recipe B:

- 160 g spinach
- 200 g mushrooms

Expected result:

1. Recipe B ranks above Recipe A.
2. Recipe B receives credit for spinach and mushrooms.
3. Recipe A receives credit only for 20 g spinach.
4. Recipe A receives no mushroom credit from title, description, tags, or instructions.
5. Recipe quantities are capped by eligible Pantry quantity.

## Expected Calculations

Total selected quantity:

- 180 g spinach + 250 g mushrooms = 430 g

Recipe A:

- Selected quantity rescued: 20 g
- Selected priority ingredients used: 1
- Aggregate selected-food coverage: 20 / 430 = 4.65%

Recipe B:

- Selected quantity rescued: 360 g
- Selected priority ingredients used: 2
- Aggregate selected-food coverage: 360 / 430 = 83.72%

Recipe B must rank first.

## Automated Test

Run:

```bash
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-56-food-rescue-scoring.test.js
```

The automated test covers:

- selected-priority-ingredient counting
- per-item rescue quantity
- aggregate rescue coverage
- Recipe B versus Recipe A ranking
- source-order independence
- deterministic repeat results
- stable tie-breaking
- title-and-text nonmatch
- quantity capping
- reserved quantity protection
- compatible unit conversion
- incompatible unit rejection
- serving scaling
- selected-item scope
- no-selection divide-by-zero protection
- allergy hard filter before scoring
- dietary hard filter before scoring
- appliance hard filter before scoring
- maximum cooking-time hard filter before scoring
- combined hard-filter reason preservation
- unsafe and review-required Pantry source blocking

## Manual Browser Test

Open `/Users/callysu/Downloads/Chef-Nova/index.html` directly.

Use a registered account or guest mode. If using guest mode, the test Pantry data is temporary.

Create the Pantry setup:

- Spinach, 180 g, refrigerated, opened, best before August 16, 2026
- Mushrooms, 250 g, refrigerated, opened, no package date, supported Use-Soon Estimate ending August 17, 2026

Open Cook Before It Spoils and select both priority items.

Verify the food-rescue recipe list:

- Recipe B appears before Recipe A.
- Recipe B shows rescued use equivalent to 160 g spinach and 200 g mushrooms.
- Recipe B shows approximately 84% selected-food coverage, or the current approved rounding.
- Recipe A shows rescued use equivalent to 20 g spinach.
- Recipe A shows approximately 5% selected-food coverage, or the current approved rounding.
- Recipe A does not show mushroom rescue credit if mushrooms only appear in text.

## Hard-Filter Manual Checks

For each variant, verify Recipe B has no eligible rank and no Plan or Cook This Tonight action:

- Allergy variant: contains peanut, profile has peanut allergy.
- Dietary variant: violates vegetarian requirement.
- Appliance variant: requires oven while only stovetop is available.
- Time variant: takes 45 minutes with a 30-minute maximum.
- Combined variant: contains all four hard-filter conflicts.
- Food-safety variant: selected Pantry food is Confirmed Over Limit.
- Storage-review variant: selected Pantry food has Storage Information Needs Review.
- True-expiration variant: selected package has a passed true expiration date.

Recipe A should rank first among remaining eligible recipes when Recipe B is hard filtered.

## No-Side-Effect Checks

Before and after running recommendations, verify there is:

- No Pantry deduction
- No Pantry reservation
- No Meal Planner entry
- No Shopping List line
- No physical food event
- No Impact Ledger record

Scoring is a read-model operation. It must not create food-use outcomes.

## DOM and Accessibility Checks

Verify:

- DOM order matches visible ranking.
- Recipe B appears before Recipe A in semantic list order.
- Keyboard traversal reaches Recipe B before Recipe A.
- Screen-reader reading order matches the visible order.
- Rescued quantities are text, not color-only.
- Hard-filter reasons are visible and accessible.
- Filtered recipes are not selectable.
- No bypass action appears.
- Initial rendering does not announce every recipe through a live region.

Expected screen-reader meaning:

- Recipe B. Rank 1. Rescues 160 grams of spinach and 200 grams of mushrooms. Uses approximately 84 percent of selected food.
- Recipe A. Rank 2. Rescues 20 grams of spinach. Uses approximately 5 percent of selected food.

## Manual Notes

Use exact fixture values when possible. If the current UI cannot create a fixture directly, record the limitation and keep the automated test as the repeatable regression check.
