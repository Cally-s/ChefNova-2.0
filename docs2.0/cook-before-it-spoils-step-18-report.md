# Cook Before It Spoils Step 18 Report

## Goal

Complete Original Leftover Timeline support for Chef Nova. The app now preserves the original cooked timeline across transformation, reheating, freezing, thawing, reminders, and food-safety decisions.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-original-leftover-timeline.md`
- `docs/cook-before-it-spoils-step-18-report.md`
- `tests/cook-before-it-spoils-step-18-original-leftover-timeline-static.test.js`

## Implementation Summary

Added a shared leftover timeline derivation model in `app.js`. The model derives `originalCookedAt`, `currentPreparedAt`, `lastTransformedAt`, `lastReheatedAt`, `reheatCount`, storage segments, effective deadline, status, reason codes, review flags, and source revisions.

The model uses the existing Food Event History and Step 6 Food-Safety Policy Catalogue. It does not create another timeline policy source and does not fetch external data.

## Timeline Preservation

`originalCookedAt` remains the safety anchor. Transformations and reheating update current dish evidence but do not reset the original timeline. Fresh ingredients do not extend the source leftover safety window.

## Reheat Handling

Transformation rules now declare method reheat effects. Heated transformation completion records a scoped `REHEATED` event with `physicalScope: transformed-portion-only`, so the untouched source remainder is not incorrectly marked reheated.

## Food-Safety Integration

Food-safety guardrails now attach `leftoverTimeline` snapshots and block expired timelines, reheat-limit cases, and review-required timelines from automatic planning. Freezing visibility uses the shared timeline and the existing guardrail.

## Pantry and Reminder Integration

Prepared leftover Pantry details now show an Original Leftover Timeline panel. Use These First prepared-leftover entries use the timeline for today, next-three-days, and freezing filters.

## Transformation Integration

Transformation source validation now uses timeline-derived reheat count and rejects target dates beyond the original safety deadline. Candidate cards and path cards show original cooked evidence and a no-reset warning.

## Styling

Added timeline card styles, responsive timeline grids, warning treatment, and forced-colors support in `style.css`.

## Tests Added

Added `tests/cook-before-it-spoils-step-18-original-leftover-timeline-static.test.js` to verify the shared timeline service, guardrail integration, Pantry display, transformation validation, scoped reheated events, documentation, and CSS hooks.

## Validation Performed

Run after implementation:

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parse `data/recipes.json`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- Step 18 static test
- full `tests/*.js` suite

## Notes and Risks

Timeline accuracy depends on the recorded Food Event History and Pantry storage data. If a user has incomplete storage history, Chef Nova requires review instead of making an automatic recommendation.

No Git commit was created.
