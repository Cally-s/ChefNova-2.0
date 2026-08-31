# Cook Before It Spoils Step 52 Report

## Goal

Handle uncertain storage time, temperature, cooling, and room-temperature exposure conservatively before Chef Nova recommends food use.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-handle-uncertain-storage.md`
- `docs/cook-before-it-spoils-step-52-report.md`
- `tests/cook-before-it-spoils-step-52-uncertain-storage-static.test.js`

## Implementation Summary

- Added canonical storage exposure statuses, storage environment types, evidence confidence values, safety results, and reservation storage statuses.
- Added factual storage exposure records.
- Added derived storage safety decisions that keep policy evaluation separate from user-entered facts.
- Added a reviewed storage policy catalogue for normal room-temperature exposure, hot-condition exposure, and verified temperature control.
- Updated Pantry storage review fields to capture duration uncertainty, temperature uncertainty, environment type, timing confidence, and measured temperature.
- Added storage decision cards with review, discard, and continue-review actions.
- Connected storage safety decisions to the existing Food-Safety Guardrail.
- Blocked recipe planning, meal planning, leftover transformation, freezer recommendation, date-driven rescue ranking, and impact-sensitive workflows when storage safety is uncertain or over limit.
- Added reservation storage status metadata without changing existing reservation behavior.

## Storage Results Added

- `STORAGE INFORMATION NEEDS REVIEW`
- `STORAGE DURATION NEEDS CONFIRMATION`
- `NOT ELIGIBLE FOR RECIPE PLANNING`
- `STORAGE INFORMATION RECORDED`
- hot-condition review through `hot-outdoor-conditions` and `hot-vehicle`

## Safety Precedence

Storage safety now runs before:

- rescue priority
- FEFO package ranking
- Pantry coverage
- recipe ranking
- budget rescue logic
- emergency planning
- shopping suggestions
- leftover transformations
- freezing
- reservations
- impact calculations

## Important Safety Boundaries

- Smell, taste, and appearance are not used as proof of safety.
- Chef Nova does not ask users whether food is safe.
- Freezing and reheating do not recover food excluded by storage safety.
- Missing package-date estimates do not override storage review.
- Unknown quantity remains separate from storage safety.
- Package-specific reviews do not exclude unrelated packages.

## Validation Performed

- Added Step 52 static test coverage for constants, policy catalogue, form fields, UI copy, guardrail blocking, leftover transformation blocking, reservation statuses, docs, and report.
- Confirmed direct file-based code paths remain browser-compatible.
- Preserved existing localStorage/sessionStorage behavior.

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parsed `data/recipes.json`
- `node tests/cook-before-it-spoils-step-52-uncertain-storage-static.test.js`
- `node tests/cook-before-it-spoils-step-51-missing-package-dates-static.test.js`
- `node tests/cook-before-it-spoils-step-50-partial-packages-static.test.js`
- `node tests/cook-before-it-spoils-step-49-multiple-package-fefo-static.test.js`
- `node tests/cook-before-it-spoils-step-48-unknown-quantity-static.test.js`
- `node tests/cook-before-it-spoils-step-6-food-safety-static.test.js`

## Risks and Notes

- Step 52 adds conservative review states. Some perishable foods with newly entered uncertain exposure information will be blocked until reviewed.
- Legacy pantry records without a specific exposure event are not automatically hard-blocked by this new exposure layer; they continue through the existing storage and date checks.
- This update is not medical or professional food-safety advice. It keeps Chef Nova from recommending food use when required storage facts are uncertain or outside reviewed limits.

