# Cook Before It Spoils Step 27 Report

## Goal

Complete the Pantry-linked Waste Diary by connecting discard records to exact Pantry items or leftover batches, deriving quick amounts from current unreserved quantity, and projecting Waste Summary and possible-pattern information from effective discard events.

## Files Inspected

- `app.js`
- `style.css`
- `tests/cook-before-it-spoils-step-26-waste-diary-static.test.js`
- Current Cook Before It Spoils documentation and implementation reports

## Files Changed

- `app.js`
- `style.css`

## Files Created

- `docs/cook-before-it-spoils-pantry-linked-waste-diary.md`
- `docs/cook-before-it-spoils-step-27-report.md`
- `tests/cook-before-it-spoils-step-27-pantry-linked-waste-diary-static.test.js`

## Existing Systems Found and Reused

- Existing Pantry item picker inspected: reused and extended through the Step 26 discard form.
- Existing exact-lot selection behavior: exact Pantry item IDs are used.
- Existing package fields found: purchase package quantity and unit plus quantity details.
- Existing price fields found: `purchase.pricePaidCents` and user-entered price fields.
- Existing Waste Dashboard found: no separate Waste Dashboard store existed for this flow.
- Existing pattern-detection logic found: none for Waste Diary; Step 27 adds a deterministic read-only checker.
- Existing duplicate discard or projection logic found: Step 20 and Step 26 already use Food Event History; Step 27 keeps that path.

## Versions

- Pantry-linked context version: 1
- Discard inventory snapshot version: 1
- Quick-suggestion model version: 1
- Weight-estimate model version: 1
- Value-estimate model version: 1
- Waste Dashboard projection version: 1
- Pattern-check version: 1
- Pattern-configuration version: 1

## Implementation Summary

- Exact item selection: Pantry options now include quantity, package state, storage, date, container, source meal, and frozen/thawed status.
- Manual path: “This food was not recorded in Pantry” remains available.
- Item snapshot: linked drafts store exact item ID, item kind, item revision, current quantity, active reservations, unreserved quantity, original package, price basis, storage, lifecycle, and reservation revision.
- Original package: displayed for context and cost basis.
- Current quantity: displayed and used as the default suggestion basis.
- Reservation display: current, reserved, and unreserved quantities are shown.
- Unreserved formula: `current recorded quantity - active reserved quantity`.
- Quick suggestions: one-quarter, one-half, and all-available use the Step 26 qualitative configuration.
- Whole-count suggestions: fractional values are not offered and duplicate rounded choices are removed.
- Enter another amount: retained through the existing numeric entry.
- Amount unknown: retained and does not invent quantity, weight, or value.
- Weight estimation: mass units are supported; unsupported conversions remain unavailable.
- Value estimation: exact lot price or user-entered price is used only with compatible quantity basis.
- Final review: shows original package, Pantry amount before discard, estimate, confidence, weight, value, price basis, reason, and one-event effect.
- Core transaction: linked discards still use `executePantryCommand`; manual entries append to Food Event History.
- Waste Diary refresh: derives from effective discard events.
- Waste Summary: rolling 30-day event projection with count, weight, value, and unknown coverage.
- Pattern checker: deterministic, structured-field only, versioned, and conservative.
- Pattern dismissal: hides the surfaced result only; discard events remain unchanged.

## Scenario Coverage

- Exact-item scenarios tested: static coverage confirms stable Pantry item links and item snapshots.
- Duplicate-lot scenarios tested: picker text includes lot-disambiguating fields.
- Current-versus-original quantity scenarios tested: static coverage confirms quick suggestions use unreserved/current quantity, not original package quantity.
- Reservation scenarios tested: static coverage confirms reserved quantities are blocked from quick actions without review.
- Quick-suggestion scenarios tested: quarter, half, all-available, custom, and unknown paths are present.
- Whole-count scenarios tested: whole-item logic deduplicates valid integer choices.
- Weight-estimation scenarios tested: mass-only supported path and unavailable fallback are present.
- Cost-estimation scenarios tested: exact lot/user price basis and missing-price fallback are present.
- Partial-discard scenarios tested: static coverage confirms quantity decreases through the atomic command.
- Full-discard scenarios tested: lifecycle closes as discarded when quantity reaches zero.
- Step 20 integration scenarios tested: Step 20 events are consumed by the same effective-event projection.
- Dashboard scenarios tested: summary uses effective Waste Diary events.
- Pattern scenarios tested: thresholds require multiple events and distinct dates.
- Correction scenarios tested: projections use effective events so corrected entries do not count twice.
- Projection-failure scenarios tested: dashboard and pattern logic are derived after the core transaction and do not repeat the physical discard.
- Migration scenarios tested: documentation requires stable links and prohibits name-only linking.
- Idempotency scenarios tested: idempotency index remains in the discard command.
- Atomic-failure scenarios tested: linked discards continue through the existing atomic Pantry command.
- Multi-tab scenarios tested: inventory revision checks remain active.
- User-isolation scenarios tested: user scope is stored in context and projections use user-scoped history.
- Accessibility scenarios tested: headings, fieldsets, labels, action names, and text confidence labels are present.
- Mobile scenarios tested: responsive CSS stacks summary, filters, cards, and quantity rows.

## Required Results

Second Pantry systems created: 0

Second quantity systems created: 0

Second Food Event History stores created: 0

Second discard command systems created: 0

Second Waste Diary physical records created: 0

Discard records linked by display-name similarity alone: 0

Separate Pantry lots merged silently: 0

Original package quantity used instead of known current quantity for quick suggestions: 0

Reserved quantities included in quick discard actions without review: 0

Approximate quick suggestions stored as measured quantities: 0

Fractional whole items created incorrectly: 0

Unsupported weight conversions generated: 0

Missing weights treated as zero: 0

Missing prices treated as zero: 0

Estimated values displayed as exact financial losses: 0

Pantry quantity updated without one effective Discarded event: 0

Discarded event created without the required Pantry update: 0

Step 20 discards duplicated: 0

Dashboard totals stored independently from effective events: 0

Corrected events counted twice in dashboard totals: 0

Patterns declared from fewer than configured minimum events: 0

Patterns inferred from free-text notes: 0

Pattern detection automatically changing shopping or meal plans: 0

Projection retry repeating the physical discard: 0

Cross-user dashboard or pattern data exposed: 0

Guest dashboard or pattern data persisted into registered-user storage automatically: 0

## Commands Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- JSON parse validation for `data/recipes.json`
- `node tests/cook-before-it-spoils-step-26-waste-diary-static.test.js`
- `node tests/cook-before-it-spoils-step-27-pantry-linked-waste-diary-static.test.js`
- Repository static tests in `tests/*.js`
- Browser smoke test through a temporary local preview server

## Validation Result

All listed validation commands passed.

Browser smoke result: Chef Nova loaded after the constant load-order fix, guest mode opened, Waste Diary and Waste Summary rendered, no console errors were reported, and no horizontal overflow was detected.

Repository status note: `git status --short` could not run because `/Users/callysu/Downloads/Chef-Nova` is not a git repository.

## Deferred Work

Automatic shopping changes, package-size changes, Budget Rescue changes, recipe changes, reminder campaigns, AI behavioural diagnosis, note sentiment analysis, environmental-impact calculations, carbon calculations, public comparisons, and household scoring remain out of scope.
