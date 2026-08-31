# Cook Before It Spoils Step 56 Report

## Goal

Complete Step 56 by creating automated and documented manual tests for Food-Rescue Recipe Scoring.

## Files Changed

- `tests/cook-before-it-spoils-step-56-food-rescue-scoring.test.js`
- `docs/cook-before-it-spoils-step-56-food-rescue-scoring-tests.md`
- `docs/cook-before-it-spoils-step-56-report.md`

## Automated Coverage

Added a fixed-clock behavior test for the required baseline:

- Reference instant: `2026-08-15T12:00:00-04:00`
- Reference local date: `2026-08-15`
- Reference timezone: `America/Toronto`
- Selected foods: Spinach and Mushrooms
- Recipe A: 20 g spinach, 0 g mushrooms
- Recipe B: 160 g spinach, 200 g mushrooms

The automated test confirms:

- Recipe B ranks above Recipe A.
- Recipe B receives credit for both selected foods.
- Recipe A receives credit only for the 20 g spinach it uses.
- Mushroom mentions in Recipe A text do not create mushroom rescue credit.
- Quantities cap at actual eligible Pantry quantity.
- Reserved quantity is protected.
- Compatible units convert.
- Incompatible units do not invent coverage.
- Serving changes recalculate rescue quantities.
- Selected item scope is respected.
- No selected food avoids divide-by-zero and avoids false 100% coverage.
- Same inputs produce the same result.
- Source-array order does not determine ranking.
- Stable recipe ID resolves final ties.

## Hard Filters

The test verifies hard-filter precedence for:

- saved allergy conflicts
- required dietary conflicts
- unavailable appliances
- maximum cooking-time conflicts
- combined hard-filter conflicts
- food-safety excluded selected Pantry sources
- review-required selected Pantry sources

Hard-filtered recipes receive:

- no eligible rank
- `rescueScore: null`
- structured reason codes

## Static Production Guards

The test also checks the production Food-Rescue code in `app.js` for these requirements:

- structured ingredient IDs drive rescue matching
- recipe titles, descriptions, instructions, and tags do not drive rescue quantity credit
- quantity use is capped with `Math.min(remainingSource, remainingRequired)`
- eligibility runs before scoring
- deterministic comparison is present

## Manual Coverage

Documented manual tests for:

- browser setup of the Spinach and Mushrooms scenario
- visible card ordering
- DOM order
- keyboard traversal order
- screen-reader meaning
- hard-filtered card behavior
- no bypass actions
- no Pantry deduction
- no reservation
- no Meal Planner entry
- no Shopping List line
- no physical food event
- no Impact Ledger record

## Validation Performed

Validation commands:

```bash
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check scripts/recipe-eligibility-ranking.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-56-food-rescue-scoring.test.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/recipe-eligibility-ranking.test.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-9-recipe-rescue-ranking-static.test.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-10-hard-filters-static.test.js
/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-54-unsafe-ineligible-static.test.js
```

## Notes

- No product functionality was changed.
- No storage keys were added.
- No Pantry, Meal Planner, Shopping List, Food Event, or Impact Ledger write path was added.
- Browser UI checks are documented manually because the current Food-Rescue browser helpers are not exported as a standalone Node integration harness.
