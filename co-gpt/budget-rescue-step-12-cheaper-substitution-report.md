# Budget Rescue Step 12 — Cheaper Substitution System

## Goal

Build a safe, recipe-aware, dynamically priced substitution system for Chef Nova Budget Rescue.

## Summary

Implemented one canonical substitution database and one shared substitution helper. The Meal Planner review can now show reviewed lower-cost ingredient options, apply substitutions to one meal or all compatible meals, preserve immutable recipe variants, undo changes, revert a meal to the original ingredient, and recalculate weekly cost, Pantry allocation, Price Confidence, Budget Rescue status, and leftovers through existing systems.

## Files Created

- `data/ingredient-substitutions.json`
- `data/ingredient-substitutions.js`
- `scripts/ingredient-substitution-shared.js`
- `tests/cheaper-substitution-static.test.js`
- `docs/cheaper-substitution-system.md`
- `docs/cheaper-substitution-report.md`
- `co-gpt/budget-rescue-step-12-cheaper-substitution-report.md`

## Files Changed

- `index.html`
- `app.js`
- `style.css`

## Existing Systems Reused

- Recipe database
- Ingredient Catalogue and alias system
- Unit Registry through the Cost Engine
- Price Catalogue and Price Resolver
- Cost Engine
- Price Confidence system
- Pantry allocation service
- Recipe Eligibility engine
- Budget Planning Algorithm
- Leftover and batch-cooking system
- Meal Plan review and Save Plan workflow
- Replace Meal workflow
- Shopping List cost/purchase group path

## Canonical Database

The substitution database is stored in `data/ingredient-substitutions.json` and mirrored in `data/ingredient-substitutions.js` for direct `index.html` support.

Counts:

- Substitution groups: 4
- Active rules: 5
- Canonical ingredients referenced: 8
- Recipe types referenced: 12
- Recipe-specific rules: 1
- Ratio rules: 1
- Fixed rules: 1
- Manual-required rules: 2
- Lookup rules: 0
- Additional-ingredient rules: 0
- Appliance-change rules: 4

## Safety Rules

- Aliases remain separate from substitutions.
- Null or missing ratios become manual-required.
- Unsafe unit conversions are rejected.
- Unsupported forms are rejected.
- Allergy protection cannot be overridden.
- Required dietary restrictions are checked on the full variant recipe.
- Canonical recipes are never modified.
- Savings are never hard-coded.
- Missing prices are never treated as zero.
- Different ingredients are never described as nutritionally identical.

## Variant and Cost Behavior

Applied substitutions create deterministic variant IDs and store variant snapshots on meal entries. Cost calculation uses the variant recipe for that meal only.

Applying or undoing a substitution recalculates:

- recipe ingredients
- recipe cost
- cost per serving
- Pantry allocation
- weekly grocery cost
- Price Confidence
- remaining budget
- leftover relationships

Source recipe ingredients are not charged again for linked leftover meals.

## Automatic Repair

Step 10 repair now attempts the shared substitution path before replacing whole recipes. Automatic repair only applies rules that are automatic-approved, complete, safe, non-stale, and lower the complete weekly cost.

## Tests

All validation commands passed, including syntax checks, JSON parsing, JSON/JS sync, existing Budget Rescue tests, cost tests, pantry-first tests, eligibility tests, leftover tests, ingredient validation, price validation, and the new Step 12 substitution static test.

Known note: the existing built-in price catalogue still covers 23 of 100 canonical ingredients.
