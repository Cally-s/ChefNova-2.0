# Step 28 Implementation Report: Estimated Discarded Cost

## Goal

Add estimated discarded cost to Respectful Waste Diary records using existing Chef Nova Budget Rescue price and cost systems.

## Files Changed

- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-estimated-discarded-cost.md`
- `docs/cook-before-it-spoils-step-28-report.md`
- `tests/cook-before-it-spoils-step-28-estimated-discarded-cost-static.test.js`

## What Changed

- Added discard price resolution request and cost estimate versions.
- Added price confidence labels: Confirmed price, User-entered estimate, Saved store estimate, Chef Nova estimate, and Price unavailable.
- Replaced exact unit-name matching with Cost Engine normalized quantities.
- Added package-cost calculation using `packagePrice / normalizedPackageQuantity`.
- Added point, minimum, and maximum cost estimates for approximate quantity ranges.
- Preserved legacy `price` fields while adding a `costEstimate` snapshot.
- Added Waste Diary cost details.
- Added Add Approximate Price enrichment for existing diary entries.
- Updated Waste Dashboard value summaries with confidence buckets and price coverage.

## Required Example

Chef Nova supports:

```text
$4.50 / 300 g = $0.015 per g
120 g * $0.015 = $1.80
```

## Price Sources

Supported source handling:

- Exact lot purchase price
- User-confirmed package price
- User-entered approximate price
- Saved store profile price
- Chef Nova estimate
- User-entered discarded portion value
- Price unavailable

## Data Protection

- Historical discard records store cost snapshots.
- Later price catalogue changes do not rewrite older Waste Diary entries.
- Missing prices are unavailable, not zero.
- Add Approximate Price creates a correction/enrichment event only.
- Pantry is not changed by price enrichment.

## Validation Performed

- JavaScript syntax checks.
- Existing price and cost engine tests.
- Step 26 and Step 27 Waste Diary regressions.
- Step 28 static coverage.
- Full static test suite.

## Risks or Notes

- Cost estimates depend on compatible units in the existing Cost Engine.
- Unsupported conversions stay unavailable.
- Chef Nova reports estimates without shame or financial-loss language.
