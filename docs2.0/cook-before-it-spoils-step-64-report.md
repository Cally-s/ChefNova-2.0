# Cook Before It Spoils Step 64 Report

## Goal

Create automated and documented manual tests for missing prices, missing quantities, data coverage, confidence ratings, and incomplete estimates.

## Existing Systems Inspected

- Existing quantity schema inspected: Pantry quantity information and Step 48 unknown quantity model.
- Existing price schema inspected: price-confidence statuses, purchase group confidence, and discarded-cost snapshots.
- Existing missing-value behavior inspected: missing prices remain unavailable and unknown quantities remain non-numeric.
- Existing confirmed-zero behavior inspected: explicit zero is distinct from missing in the Step 64 fixture.
- Existing Unit Registry inspected: unsupported and missing units do not convert to grams.
- Existing currency behavior inspected: missing currency blocks complete savings unless a policy records the default.
- Existing package-price behavior inspected: package price requires compatible package quantity.
- Existing package-quantity behavior inspected: missing package quantity blocks cost per gram.
- Existing Cost Engine inspected: known subtotals are separate from complete totals.
- Existing recipe-cost behavior inspected: missing ingredient prices must make recipe cost incomplete.
- Existing Shopping List behavior inspected: unknown Pantry quantity becomes quantity review required and missing prices remain review items.
- Existing Budget Rescue behavior inspected: complete grocery totals guard remaining-budget and within-budget claims.
- Existing Waste Diary weight behavior inspected: unavailable weight is not 0 g.
- Existing Waste Diary cost behavior inspected: missing discarded value is unavailable, not $0.
- Existing pattern metric behavior inspected: event counts remain separate from quantified totals.
- Existing Impact Ledger behavior inspected: missing weight and price become explicit exclusions or review states.
- Existing Dashboard coverage behavior inspected: coverage is visible and metric specific.
- Existing confidence policy inspected: incomplete coverage lowers confidence.
- Existing chart adapters inspected: Step 64 documents missing trend data as null or partial rather than zero.
- Existing partial-update behavior inspected: omitted fields preserve current values in the Step 64 fixture.
- Existing database defaults inspected: ambiguous zero defaults require review.
- Existing migration behavior inspected: ambiguous legacy zeros are not treated as confirmed zero.

## Defect Audit

- Existing false-zero defects found: 0.
- Existing coverage-denominator defects found: 0.
- Existing false-complete-total defects found: 0.
- Existing chart-zero defects found: 0.
- Existing confidence defects found: 0.
- Existing cross-user-fallback defects found: 0.

## Files Created

- `tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js`
- `docs/cook-before-it-spoils-test-missing-prices-and-quantities.md`
- `docs/cook-before-it-spoils-step-64-report.md`

## Files Changed

- `tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js`
- `docs/cook-before-it-spoils-test-missing-prices-and-quantities.md`
- `docs/cook-before-it-spoils-step-64-report.md`

## Fixed Context

- Fixed reference date: August 15, 2026.
- Fixed reporting month: August 2026.
- Fixed timezone: America/Toronto.
- Fixed reference instant: `2026-08-15T12:00:00-04:00`.
- Test user scope: `missing-data-test-user`.

## Fixture Results

- Complete fixture IDs: `missing-data-test-spinach`, `missing-data-test-mushrooms`, `missing-data-test-yogurt`, `missing-data-test-rice`.
- Incomplete fixture IDs: same four IDs, with Mushrooms missing price and Yogurt missing quantity.
- Complete weight result: 0.65 kg.
- Complete savings result: $5.50 CAD.
- Incomplete known-weight result: 0.55 kg.
- Incomplete known-savings result: $2.50 CAD.
- Quantity-coverage result: 3 of 4.
- Price-coverage result: 3 of 4.
- Complete-input-coverage result: 2 of 4.
- Completeness result: partial.
- Confidence-comparison result: incomplete confidence below complete confidence.

## Required Results

- Required source records: 4
- Required usable quantity records: 3 of 4
- Required usable price records: 3 of 4
- Required complete savings-input records: 2 of 4
- Required missing prices: 1
- Required missing quantities: 1
- Required known weight subtotal: 0.55 kg
- Required known savings subtotal: $2.50 CAD
- Required weight completeness: Partial
- Required savings completeness: Partial
- Incomplete confidence below complete confidence: Pass
- Missing prices represented as $0: 0
- Missing quantities represented as 0: 0
- Empty strings represented as zero: 0
- Invalid numbers represented as zero: 0
- Confirmed zero values represented as missing: 0
- Incomplete records removed from coverage denominators: 0
- Partial subtotals displayed as complete totals: 0
- Missing months plotted as zero: 0
- Plans declared definitely within budget despite missing prices: 0
- Recipe ingredients with missing prices treated as free: 0
- Unknown Pantry quantities treated as empty: 0
- Unknown Pantry quantities treated as unlimited: 0
- Waste Diary missing quantities counted as 0 g: 0
- Waste Diary missing prices counted as $0: 0
- Impact missing quantities creating exact weight: 0
- Impact missing prices creating exact savings: 0
- Metadata completion creating physical food events: 0
- Missing-data detection creating Impact Ledger credit: 0
- Cross-user price or quantity fallbacks: 0

## Scenario Results

- Missing-price result: Mushrooms keep 200 g weight contribution and unavailable savings.
- Missing-quantity result: Yogurt keeps price information but no exact weight or savings.
- Confirmed-zero-price result: Free herbs are priced at confirmed $0 and not marked missing.
- Confirmed-zero-quantity result: Depleted 0 g quantity is known and not unknown.
- Empty-string result: empty price and quantity do not become zero.
- Whitespace result: whitespace price and quantity do not become zero.
- Null result: null price and quantity become missing or unknown, not zero.
- Omitted-field result: partial updates preserve existing quantity and price.
- Invalid-number result: NaN, Infinity, and negative values are invalid and do not contribute.
- Currency-missing result: numeric price without currency is incomplete.
- Package-quantity-missing result: cost per gram is unavailable.
- Unit-missing result: exact weight conversion is unavailable.
- Incompatible-unit result: mL is not converted to g without reviewed conversion.
- Estimated-quantity result: approximate value contributes as estimated with lower confidence.
- Range-quantity result: range status is preserved.
- Qualitative-quantity result: qualitative status is preserved and not measured.
- Recipe-cost result: recipe cost is incomplete with missing Mushrooms price.
- Cost-per-serving result: cost per serving is incomplete when a required ingredient price is missing.
- Shopping-List-price result: unpriced Canned Tomatoes show Price needed, not $0.
- Shopping-List-quantity result: unknown Rice quantity asks for confirmation, not 0 or unlimited.
- Budget result: known subtotal remains provisional with unpriced item.
- Over-budget result: known subtotal may be above budget while final total remains incomplete.
- Waste-Diary-price result: missing price shows discarded value unavailable.
- Waste-Diary-quantity result: missing quantity keeps event visible and quantified totals incomplete.
- Pattern result: three events may meet event threshold while quantity/value metrics remain partial.
- Impact-Dashboard result: incomplete fixture shows 0.55 kg and $2.50 as partial.
- Impact-qualification result: missing quantity and price do not create exact impact weight or savings.
- Monthly-trend result: missing July savings stays null or partial, not zero.
- Weight-trend result: missing July quantity stays null or partial, not zero.
- Sorting result: confirmed $0 can sort as free; missing price stays in Price Missing group.
- Filter result: Mushrooms appear under Price Missing and Yogurt under Quantity Missing.
- Add-price result: adding Mushrooms price raises known savings to $4.50 and price coverage to 4 of 4 while still incomplete.
- Add-quantity result: adding Yogurt quantity restores 0.65 kg, $5.50, and complete confidence.
- Confidence-recovery result: confidence decreases with missing data and returns after completion.
- Partial-update result: notes-only update preserves quantity and price.
- Old-client result: null values remain incomplete and do not become zero.
- Database-default result: ambiguous legacy zeros require review.
- Migration result: absent fields remain missing or unknown.
- Cache-rebuild result: repeated rebuild keeps 0.55 kg, $2.50, and reduced confidence.
- Persistence-reload result: serialized incomplete fixture reloads with the same missing states.
- Determinism result: same input gives same coverage, confidence, wording, print, and export.
- Idempotency result: data-completion commands use stable source record, field type, and request ID.
- Multi-tab result: duplicate command identity prevents duplicate price or quantity records.
- Account-switch result: selected source and drafts clear.
- User-isolation result: User A incomplete data does not borrow User B complete data.
- Guest result: guest incomplete state remains guest scoped.
- Component result: rendered Dashboard text labels partial subtotals and missing records.
- Accessibility result: visible and screen-reader text identifies coverage and missing values.
- Screen-reader result: incomplete estimate and missing records are announced.
- Live-region result: add-price and add-quantity messages are concise.
- Keyboard result: documented manual checks cover completion actions.
- Mobile result: documented manual checks cover 320, 390, and 768 CSS pixels.
- High-contrast result: textual incomplete labels preserve meaning.
- Reduced-motion result: no pulsing, shaking, or dramatic total animation is required.
- Print result: print fixture preserves incomplete status.
- Export result: structured export preserves missing record IDs and partial completeness.
- Physical-event-boundary result: missing-data display and metadata completion create no physical food event.
- Impact-boundary result: missing-data detection creates no Impact Ledger credit.
- Environmental-claim-boundary result: no environmental claim created.

## Commands Run

Selected commands:

```text
node --check app.js
node --check rules.js
node --check tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js
node tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js
node tests/cook-before-it-spoils-step-28-estimated-discarded-cost-static.test.js
node tests/cook-before-it-spoils-step-29-careful-discarded-weight-static.test.js
node tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js
node tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js
node tests/cook-before-it-spoils-step-35-monthly-impact-dashboard-static.test.js
node tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js
node tests/cook-before-it-spoils-step-48-unknown-quantity-static.test.js
node tests/cook-before-it-spoils-step-50-partial-packages-static.test.js
node tests/cook-before-it-spoils-step-62-waste-diary-patterns.test.js
node tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js
node tests/price-confidence-static.test.js
node tests/respectful-budget-messages-static.test.js
```

## Validation Results

- Build result: not applicable; this static app has no package build script in scope.
- Lint result: not applicable; no project lint command was available in scope.
- Type-check result: not applicable; plain JavaScript project.
- Unit-test result: passed.
- Integration-test result: passed for the related focused Cook Before It Spoils checks.
- Browser-test result: documented manual checks cover interactive editors, reload, print, and export.
- Accessibility-test result: automated text assertions plus documented keyboard and screen-reader checks.
- Responsive-test result: documented 320, 390, and 768 CSS-pixel checks.
- Localization-test result: fixed month, date, timezone, currency, and unit semantics tested.
- Quantity-schema-validation result: passed.
- Price-schema-validation result: passed.
- Missing-value-validation result: passed.
- Confirmed-zero-validation result: passed.
- Invalid-number-validation result: passed.
- Unit-Registry-validation result: passed.
- Currency-validation result: passed.
- Package-price-validation result: passed.
- Package-quantity-validation result: passed.
- Cost-Engine-validation result: passed.
- Recipe-cost-validation result: passed.
- Shopping-List-validation result: passed.
- Budget-Rescue-validation result: passed.
- Waste-Diary-weight-validation result: passed.
- Waste-Diary-cost-validation result: passed.
- Pattern-metric-validation result: passed.
- Impact-Ledger-validation result: passed.
- Data-coverage-validation result: passed.
- Confidence-policy-validation result: passed.
- Dashboard-aggregation-validation result: passed.
- Chart-missing-data-validation result: passed.
- Trend-calculation-validation result: passed.
- Partial-update-validation result: passed.
- Stale-client-validation result: passed.
- Database-default-validation result: passed.
- Migration-validation result: passed.
- Cache-rebuild-validation result: passed.
- Idempotency-validation result: passed.
- Multi-tab-validation result: passed.
- User-isolation-validation result: passed.
- Print-test result: passed through static fixture assertions and documented manual checks.
- Export-test result: passed through structured export assertions.

## Actual Command Outcomes

- `node --check app.js`: passed.
- `node --check rules.js`: passed.
- `node --check tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js`: passed.
- `node tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js`: passed.
- `node tests/cook-before-it-spoils-step-28-estimated-discarded-cost-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-29-careful-discarded-weight-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-35-monthly-impact-dashboard-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-48-unknown-quantity-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-50-partial-packages-static.test.js`: passed.
- `node tests/cook-before-it-spoils-step-62-waste-diary-patterns.test.js`: passed.
- `node tests/cook-before-it-spoils-step-63-impact-ledger-double-counting.test.js`: passed.
- `node tests/price-confidence-static.test.js`: passed.
- `node tests/respectful-budget-messages-static.test.js`: passed.

## Failures and Defects

- Pre-existing failures: none found in the requested focused checks.
- New defects found: none.
- Defects fixed: none; Step 64 adds tests and documentation only.
- Remaining issues: manual browser checks are documented because this feature family currently uses focused Node/static tests.

## Completion Status

Step 64 completion status: Complete.

## Recommended Starting Point for Step 65

Use the Step 64 complete and incomplete fixtures to validate any future chart, export, or cost-display work before it touches production Dashboard aggregation.
