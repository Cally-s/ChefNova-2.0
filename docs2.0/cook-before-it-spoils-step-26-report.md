# Cook Before It Spoils Step 26 Report

## Goal

Add a respectful, approximate-friendly Waste Diary that reuses Food Event History and canonical Pantry quantity.

## Files Changed

- `app.js`
- `style.css`

## Files Created

- `docs/cook-before-it-spoils-respectful-waste-diary.md`
- `docs/cook-before-it-spoils-step-26-report.md`
- `tests/cook-before-it-spoils-step-26-waste-diary-static.test.js`

## Existing Systems Inspected

Inspected Pantry state, prepared-leftover actions, Step 20 leftover outcome discard events, Food Event History, canonical quantity helpers, reservations, guest storage, user-scoped storage, price parsing, dashboard stats, Pantry rendering, freezer/thaw rendering, and existing docs/reports.

## Architecture

Waste Diary is a projection of effective `FOOD_EVENT_TYPES.DISCARDED` events and discard metadata correction events. No second Pantry, quantity system, discard command system, Price Catalogue, Cost Engine, reservation system, or user-storage convention was created.

## Schema Versions

- Discard-recording context: `DISCARD_RECORDING_CONTEXT_VERSION = 1`
- Discard-recording draft: `DISCARD_RECORDING_DRAFT_VERSION = 1`
- Discard event metadata: `DISCARD_RECORD_SCHEMA_VERSION = 1`
- Amount-mode version: `DISCARD_AMOUNT_MODE_VERSION = 1`
- Reason taxonomy: `DISCARD_REASON_TAXONOMY_VERSION = 1`
- Qualitative-estimation config: `QUALITATIVE_DISCARD_ESTIMATE_CONFIG.version = 1`

## Controlled Values

Food types: ingredient, leftover meal, prepared food, packaged food.

Amount modes: numeric, small amount, about one-quarter, about half, most, all, unknown.

Quantity confidence: measured, user-estimated, qualitative-derived, serving-derived, unknown.

Estimate bases: current recorded quantity, original package quantity, user-entered package quantity, confirmed serving conversion, whole item count, no numeric basis.

Reason codes: spoiled before use, forgot it was available, bought too much, cooked too much, did not like it, plans changed, stored incorrectly, date unclear, unsafe temperature or storage, recipe did not work, other, unknown, prefer not to say.

## Behavior Implemented

Dashboard and Pantry show `Record Discarded Food`. Pantry cards show `Record This Item as Discarded`. All entry points open the same workflow.

Opening, editing, reviewing, filtering, searching, or viewing details does not mutate Pantry quantity.

Final confirmation revalidates user scope, item revision, quantity, reservations, timestamp, unit, and optional price. Linked entries use `executePantryCommand()` for atomic Pantry plus event updates. Manual entries append a discard event without creating a Pantry item.

Step 20 discarded leftovers appear in the Waste Diary because the diary queries existing discard events. They are not duplicated.

## Respectful Design

The UI uses neutral wording: "Approximate information is okay", "Discard recorded", "Estimated value unavailable", and "Reason not recorded." It does not include shame, guilt, public comparison, financial alarm, or environmental-impact language.

## Required Results

- Second Pantry systems created: 0
- Second canonical quantity systems created: 0
- Second Food Event History stores created: 0
- Second discard command systems created: 0
- Step 20 discards duplicated in Waste Diary: 0
- Inventory updated without a Discarded event: 0
- Diary entry created without the required linked inventory update: 0
- Approximate quantities displayed as exact: 0
- Qualitative answers overwritten without preserving the original answer: 0
- Unknown quantities converted to zero: 0
- Fractional whole items created incorrectly: 0
- Missing prices treated as zero: 0
- Estimated values displayed as exact losses: 0
- User-reported reasons represented as safety determinations: 0
- Reasons or notes required unnecessarily: 0
- Reserved quantities discarded without review: 0
- Discard events deducting the same quantity twice: 0
- Full discard deleting historical inventory records: 0
- Corrections overwriting original events: 0
- Judgmental or shaming completion messages: 0
- Viewing the Waste Diary mutating inventory: 0
- Cross-user discard records exposed: 0
- Guest discard records persisted into registered-user storage automatically: 0

## Tests and Validation

Commands run:

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- JSON parse for `data/recipes.json` and `data/freezer-guidance.json`
- `node tests/cook-before-it-spoils-step-26-waste-diary-static.test.js`
- Existing focused Cook Before It Spoils tests
- Full `tests/*.js` static sweep

## Deferred Work

Full quantity-changing correction compensation, reversal workflow, custom-date filter UI, legacy discard migration execution, browser automation, household-pattern analysis, financial summary dashboards, environmental-impact calculations, automatic safety conclusions, and automatic repurchase recommendations remain outside Step 26.

## Status

Step 26 is implemented as a respectful Waste Diary projection over confirmed discard events.
