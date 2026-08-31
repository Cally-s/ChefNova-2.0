# Step 35 Implementation Report

## Goal

Build the Monthly Food-Rescue Impact Dashboard as a transparent reporting page for confirmed monthly rescue outcomes.

## Files changed

- `index.html`
- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-monthly-impact-dashboard.md`
- `docs/cook-before-it-spoils-step-35-report.md`
- `tests/cook-before-it-spoils-step-35-monthly-impact-dashboard-static.test.js`

## Implementation summary

- Added an Impact navigation item and `#impact` page.
- Added a month selector with previous, current, next, and month-pick controls.
- Added monthly metric cards backed by Step 34 effective ledger balances.
- Added separate context tables for rescued ingredients, discarded ingredients, leftover transformations, protected food, monthly savings trend, and discard reasons.
- Added metric definitions, disclosures, source ledger counts, and a print/export summary.
- Kept Waste Diary context separate from impact totals.

## Servings and leftovers

The leftovers card reports:

- confirmed leftover servings reused
- later meals receiving those servings
- source leftover batches

These values stay separate so a later meal does not become a duplicate serving credit.

## Stock and flow handling

Monthly flow cards count records inside the selected month.

Protected stock is point-in-time:

- current month uses now
- completed months use the final moment of the month

## Data sources

The dashboard reads:

- Step 34 effective Impact Ledger
- Step 33 metric audit coverage exposed through the ledger
- effective Waste Diary entries for context tables

Forbidden duplicate stores created: 0

## Validation performed

- Verified the page uses effective ledger balance functions.
- Verified month controls are routed through app state and URL hash state.
- Verified discard context is not added to impact totals.
- Verified no forbidden duplicate dashboard stores were introduced.
- Verified print and responsive CSS are present.

## Tests run

Passed:

- `node --check app.js`
- `node --check rules.js`
- `node tests/cook-before-it-spoils-step-35-monthly-impact-dashboard-static.test.js`

## Risks or notes

- Historical protected-stock views depend on the effective ledger entries available from current source records.
- Context sections show user-recorded evidence only. Missing weights or prices remain unavailable rather than being counted as zero.

## Step 35 completion status

Implemented and validated.
