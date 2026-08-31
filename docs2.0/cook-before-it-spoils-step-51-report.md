# Cook Before It Spoils Step 51 Report

## Goal

Add safe handling for Pantry items that do not have a package date recorded.

Chef Nova now creates a separate Use-Soon Estimate for planning priority without inventing expiration or best-before dates.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-missing-package-date-estimates.md`
- `docs/cook-before-it-spoils-step-51-report.md`
- `tests/cook-before-it-spoils-step-51-missing-package-dates-static.test.js`

## Implementation Summary

Added controlled package-date statuses, estimate statuses, evidence types, support levels, and effect types.

Added a reviewed Use-Soon Estimate rule catalogue for common missing-date cases.

Added a derived read model that stores the estimate separately from official date fields.

Added Pantry card display for available estimates and package-date-not-recorded fallbacks.

Connected estimates to effective use-first evaluation, FEFO package evaluation, and the Priority Engine.

## Safety Results

Official expiration dates invented: 0

Best-before dates invented: 0

Package date fields overwritten by estimates: 0

Duplicate missing-date systems created: 0

Unknown quantities forced to zero priority: 0

## Serves Existing Systems

The update reuses:

- Pantry item schema
- Date Intelligence
- Food-Safety Guardrails
- Use First Priority Engine
- Multiple-package FEFO
- Partial-package quantity resolver
- Unknown-quantity handling
- Flexible recipe search
- Existing Pantry date forms

## User-Facing Copy

Added the required planning-only wording:

"No package date was entered. This is a planning estimate, not an official expiration date or a guarantee of food safety."

Added the required clarification:

"Chef Nova did not interpret this estimate as a best-before or expiration date."

## Priority Behavior

Items with missing package dates can receive date-based planning priority when a reviewed rule and required evidence exist.

When quantity is unknown, Chef Nova omits quantity-at-risk, exact rescue coverage, exact Pantry value, and exact remaining weight.

## FEFO Behavior

FEFO can use a supported use-soon planning window as an effective use-first date.

The official date type remains unknown when no package date is recorded.

## Validation Performed

Static coverage was added for constants, functions, safety boundaries, UI copy, FEFO integration, priority integration, CSS, documentation, and forbidden duplicate systems.

Syntax checks passed for `app.js`, `rules.js`, and `data/recipes.js` using the bundled Node runtime.

`data/recipes.json` parsed successfully.

## Tests Run

Completed after implementation:

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parse `data/recipes.json`
- `node tests/cook-before-it-spoils-step-51-missing-package-dates-static.test.js`
- `node tests/cook-before-it-spoils-step-50-partial-packages-static.test.js`
- `node tests/cook-before-it-spoils-step-49-multiple-package-fefo-static.test.js`
- `node tests/cook-before-it-spoils-step-48-unknown-quantity-static.test.js`
- `node tests/cook-before-it-spoils-step-7-use-first-priority-static.test.js`

## Risks and Notes

The initial rule catalogue is intentionally small and reviewed.

More categories should be added only as reviewed rules with clear evidence requirements.
