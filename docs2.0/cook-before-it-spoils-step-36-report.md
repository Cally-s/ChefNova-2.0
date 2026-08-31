# Step 36 Validation Report: Responsible Impact Claims

## Goal

Add strict impact-claims governance so Chef Nova does not overstate environmental benefits, measurement precision, financial value, or causal impact.

## Files inspected

- `app.js`
- `index.html`
- `style.css`
- `docs/cook-before-it-spoils-impact-metric-definitions.md`
- `docs/cook-before-it-spoils-impact-ledger.md`
- `docs/cook-before-it-spoils-monthly-impact-dashboard.md`
- `docs/cook-before-it-spoils-estimated-discarded-cost.md`
- `docs/cook-before-it-spoils-estimate-weight-carefully.md`
- `docs/cook-before-it-spoils-food-event-history.md`
- `docs/cook-before-it-spoils-pantry-item-schema.md`
- `docs/cook-before-it-spoils-original-leftover-timeline.md`
- Step 28, 33, 34, and 35 reports

## Existing sources of truth

- Step 33 metric-contract source of truth: `RESCUE_IMPACT_METRIC_CONTRACTS`
- Step 34 Impact Ledger source of truth: `buildImpactLedger()` and effective ledger selectors
- Step 35 Monthly Dashboard source of truth: `buildMonthlyImpactDashboard()`
- Confidence models: quantity confidence, weight confidence, price confidence, impact confidence
- Coverage models: metric audit coverage and effective ledger entry coverage
- Price-confidence source: existing Price Catalogue, Price Resolver, Cost Engine, and stored price snapshots
- Weight-confidence source: existing weight-conversion and weight-snapshot system
- Date-confidence source: existing Date Intelligence, priority windows, and Food Event History date records

## Existing scan findings

- Existing environmental calculations found: 0 active dashboard calculations
- Existing carbon factors found: 0 active production factors
- Existing water factors found: 0 active production factors
- Existing causal-overstatement found: Step 35 used cautious labels but needed one shared governance resolver
- Existing missing-estimate labels found: Step 35 cards had local wording instead of centralized policy-driven wording
- Existing tooltip-only uncertainty found: 0 in Step 35
- Existing accessibility qualifier defects found: Step 35 cards did not yet have policy-generated screen-reader labels
- Existing print qualifier defects found: Step 35 print used visible content but did not yet carry claim-policy export fields
- Existing export qualifier defects found: Step 35 export summary lacked claim class, precision, causality, and environmental readiness
- Existing localization qualifier defects found: no localization files found for impact claims

## Files changed

- `app.js`
- `style.css`

## Files created

- `docs/cook-before-it-spoils-responsible-impact-claims.md`
- `docs/cook-before-it-spoils-step-36-report.md`
- `tests/cook-before-it-spoils-step-36-impact-claims-static.test.js`

## Versions

- Claim-policy registry version: `1`
- Claim-presentation version: `1`
- Claim-audit version: `1`
- Claim-class version: `1`
- Precision-status version: `1`
- Causality-status version: `1`
- Environmental-readiness version: `1`
- Uncertainty-reason version: `1`

## Controlled values

- Claim classes: confirmed activity, confirmed count, estimated quantity, estimated value, possible counterfactual, current stock, contextual statistic, environmental claim, unavailable
- Claim precision: confirmed, measured, derived exactly, estimated, approximate, mixed, partial coverage, review required, unavailable
- Claim causality: observed, derived, possible counterfactual, causal not established, unavailable
- Environmental readiness: not supported, methodology missing, dataset missing, review required, approved for limited scope, approved
- Uncertainty reasons: approximate quantity, qualitative quantity, average item weight, estimated serving weight, density conversion, package fraction, user-estimated weight, user-entered price estimate, saved store price estimate, Chef Nova price estimate, user-entered date, estimated priority date, app-estimated freshness, incomplete Pantry record, partial quantity coverage, partial weight coverage, partial price coverage, partial serving coverage, proportional lineage, incomplete lineage, counterfactual not proven, mixed confidence

## Implementation summary

- Added one shared claim-policy registry.
- Added one shared qualifier resolver: `resolveImpactClaimQualifiers()`.
- Added one claim-presentation model and one claim-audit model.
- Added a prohibited impact-claim phrase scanner.
- Updated Monthly Impact cards to consume claim presentations.
- Added visible range, confidence, coverage, caution, claim audit, and environmental-readiness text to cards.
- Added an environmental unavailable notice to the methodology area.
- Updated export summaries to preserve claim class, precision, causality, confidence, coverage, range, qualifiers, uncertainty reasons, currency handling, and environmental readiness.
- Updated trend wording to `Estimated Monthly Food Value Saved Trend`.

## Required zero-result confirmations

- Carbon-emissions calculations implemented: 0
- Water-footprint calculations implemented: 0
- Landfill-impact calculations implemented: 0
- Generic environmental conversion factors introduced: 0
- Environmental claims displayed without approved methodology: 0
- Possible food waste avoided labelled as definitely prevented: 0
- Estimated food value labelled as exact savings: 0
- Frozen-only food labelled as food waste avoided: 0
- Frozen-only food labelled as money saved: 0
- Approximate quantities displayed without estimate qualifiers: 0
- Average-weight estimates displayed as measured: 0
- Estimated prices displayed as confirmed prices: 0
- User-entered date dependencies hidden: 0
- App-estimated dates represented as official expiration dates: 0
- Partial coverage represented as complete coverage: 0
- Incomplete totals displayed as complete totals: 0
- Missing prices represented as $0: 0
- Missing weights represented as 0 g: 0
- Unavailable values represented as valid zero: 0
- Estimate ranges discarded: 0
- Qualifiers hidden only in tooltips: 0
- Qualifiers omitted from screen-reader labels: 0
- Qualifiers omitted from print output: 0
- Qualifiers omitted from exports: 0
- Different currencies combined: 0
- Causal impact claimed without evidence: 0
- Prohibited environmental phrases in active production strings: 0
- Cross-user claim-audit data exposed: 0
- Guest claim data persisted into registered-user storage automatically: 0

## Scenario coverage

Measured-weight, average-weight, approximate-quantity, mixed-confidence, partial-weight-coverage, confirmed-price, saved-store-estimate, partial-price-coverage, multi-currency, user-entered-date, confirmed-date, app-estimated-date, exact-leftover-serving, estimated-serving, partial-serving-coverage, frozen-only, true-zero, unavailable-value, environmental-request, legacy-environmental-claim, tooltip-only-label, screen-reader-label, print-label, export-label, range, correction-confidence, correction-coverage, price-correction, date-correction, stale-claim, source-order, idempotency, multi-tab, user-isolation, guest, keyboard, mobile, high-contrast, reduced-motion, prohibited-phrase, localization, and migration scenarios are covered by the shared policy model, static assertions, and documentation.

## Commands run

Passed:

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parse `data/recipes.json`
- `node scripts/validate-price-data.js`
- `node tests/cook-before-it-spoils-step-35-monthly-impact-dashboard-static.test.js`
- `node tests/cook-before-it-spoils-step-36-impact-claims-static.test.js`
- all `tests/*.js`

## Validation result

Passed. No new test failures remain.

## Deferred work

Step 37 should add deeper browser and visual regression coverage for the Impact dashboard at 320, 360, 390, 768, and 1024 CSS pixels. Environmental methodology, carbon estimates, water footprints, landfill estimates, environmental scores, public comparisons, gamification, leaderboards, and causal-effect evaluation remain outside Step 36.
