# Cheaper Substitution Validation Report

## Goal

Complete Budget Rescue Step 12 with one safe, recipe-aware, dynamically priced cheaper substitution system.

## Files Changed

- `index.html`
- `app.js`
- `style.css`
- `data/ingredient-substitutions.json`
- `data/ingredient-substitutions.js`
- `scripts/ingredient-substitution-shared.js`
- `tests/cheaper-substitution-static.test.js`
- `docs/cheaper-substitution-system.md`
- `docs/cheaper-substitution-report.md`
- `co-gpt/budget-rescue-step-12-cheaper-substitution-report.md`

## Rule Database Counts

- Substitution groups: 4
- Total rules: 5
- Active rules: 5
- Canonical ingredients referenced: 8
- Recipe types referenced: 12
- Recipe-specific rules: 1
- Ratio rules: 1
- Fixed rules: 1
- Per-serving rules: 0 top-level, 1 nested recipe-specific rule
- Lookup rules: 0
- Manual-required rules: 2
- Appliance-change rules: 4
- Additional-ingredient rules: 0

## Required Validation Results

- Invalid canonical ingredient references: 0
- Invalid recipe type references: 0
- Allergenic substitutions applied: 0
- Dietary-incompatible substitutions applied: 0
- Null ratios treated as numeric values: 0
- Unsafe unit conversions: 0
- Unsupported recipe types accepted: 0
- Hard-coded savings values used: 0
- Missing prices treated as zero: 0
- Canonical recipes mutated: 0
- Shared packages double-counted: 0
- Pantry quantities double-allocated: 0
- Leftover source batches charged twice: 0
- Stale recommendations applied without recalculation: 0
- Substitution cycles accepted: 0

## Scenarios Tested

- Rule database validation: 1 focused test file
- Allergy and dietary scenarios tested: existing eligibility tests plus Step 12 hard-requirement checks
- Quantity and unit scenarios tested: manual-required, fixed, ratio, recipe-specific, unsafe cup-to-gram rejection
- Dynamic savings scenarios tested: app-level before-and-after plan recalculation is statically checked
- Pantry and shared-package scenarios tested: existing cost and pantry-first test suites
- Multiple-meal scope scenarios tested: explicit one-meal and all-compatible-meals controls are implemented
- Leftover-source scenarios tested: existing leftover static suite plus source-only substitution guard in UI
- Apply and undo scenarios tested: static checks confirm apply, revert, undo, variant snapshot, and cost recalculation functions exist

## Tests Run

- `node --check app.js`
- `node --check scripts/ingredient-substitution-shared.js`
- `node --check data/ingredient-substitutions.js`
- `node --check rules.js`
- `node --check languageGuidelines.js`
- `node --check data/recipes.js`
- Parsed `data/ingredient-substitutions.json`
- Verified substitution JSON/JS sync
- `node tests/cheaper-substitution-static.test.js`
- `node tests/ingredient-data.test.js`
- `node tests/price-data.test.js`
- `node tests/cost-calculation-engine.test.js`
- `node tests/pantry-first-planning.test.js`
- `node tests/pantry-first-static.test.js`
- `node tests/recipe-eligibility-ranking.test.js`
- `node tests/recipe-eligibility-static.test.js`
- `node tests/price-confidence-static.test.js`
- `node tests/planning-mode-static.test.js`
- `node tests/budget-rescue-form-static.test.js`
- `node tests/budget-planning-algorithm-static.test.js`
- `node tests/leftover-batch-cooking-static.test.js`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`

## Results

All commands passed.

Known existing price-catalogue note: the built-in estimate catalogue contains 23 estimates for 100 canonical ingredients, so 77 ingredients still do not have built-in estimate prices.

## Notes

Chef Nova now has one substitution database, one shared substitution helper, one recipe-variant representation, and one app-level evaluator path. It reuses the existing Ingredient Catalogue, Unit Registry, Price Resolver, Cost Engine, Pantry allocation, Price Confidence, Recipe Eligibility engine, Budget Planning Algorithm, leftover system, Shopping List, Meal Calendar, Save Plan workflow, and Replace Meal workflow.

No backend, database, live grocery-price API, retailer scraping, medical nutrition claim, or uncontrolled AI substitution generation was added.
