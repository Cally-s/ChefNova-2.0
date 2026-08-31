# Step 29 Validation Report: Careful Discarded-Weight Estimation

## Goal

Estimate discarded-food weight carefully with existing Chef Nova measurement, inventory, event, Waste Diary, and Dashboard systems.

## Files Inspected

- `app.js`
- `style.css`
- `scripts/cost-calculation-engine.js`
- `scripts/ingredient-data-shared.js`
- `data/ingredients.json`
- `data/ingredients.js`
- `docs/cook-before-it-spoils-respectful-waste-diary.md`
- `docs/cook-before-it-spoils-pantry-linked-waste-diary.md`
- `docs/cook-before-it-spoils-estimated-discarded-cost.md`
- `docs/cook-before-it-spoils-pantry-item-schema.md`
- `docs/cook-before-it-spoils-leftover-inventory.md`
- `docs/cook-before-it-spoils-leftover-transformation-paths.md`
- `docs/cook-before-it-spoils-food-event-history.md`
- `docs/cost-calculation-engine.md`

## Existing Sources of Truth

- Existing Unit Registry source of truth: `scripts/cost-calculation-engine.js` `UNIT_FACTORS`.
- Existing quantity-dimension model: Cost Engine dimensions `mass`, `volume`, and count-specific dimensions, plus Chef Nova serving units.
- Existing Ingredient Catalogue source of truth: `data/ingredients.json` and `data/ingredients.js`.
- Existing prepared-food taxonomy: Pantry `prepared-leftover` records and transformation prepared-food metadata in `app.js`.
- Existing package-weight fields: Pantry `purchase.packageQuantity`, `purchase.packageUnit`, and discard inventory snapshots.
- Existing drained-weight fields: no global drained-weight catalogue found.
- Existing serving-conversion fields: leftover batch serving conversion fields and `getConfirmedServingConversion()`.
- Existing density records: none found.
- Existing average-weight records: none found.
- Existing prepared-batch weight fields: prepared leftover `quantityDetails` and serving conversion metadata.
- Existing discarded-weight logic found: previous `buildDiscardedWeightEstimate()` handled mass-only hard-coded conversions.

## Defects Audited

- Existing universal mL-to-g defects found: 0 in discarded-weight code.
- Existing unknown-as-zero defects found: 0 in discarded-weight code.
- Existing historical-recalculation defects found: 0; stored event snapshots remain effective.

## Files Created

- `docs/cook-before-it-spoils-estimate-weight-carefully.md`
- `docs/cook-before-it-spoils-step-29-report.md`
- `tests/cook-before-it-spoils-step-29-careful-discarded-weight-static.test.js`

## Files Changed

- `app.js`
- `style.css`

## Versions

- Weight-estimation request version: `DISCARDED_WEIGHT_REQUEST_VERSION = 1`
- Weight-estimation result version: `DISCARDED_WEIGHT_ESTIMATE_VERSION = 1`
- Conversion-policy schema version: `MEASUREMENT_CONVERSION_POLICY_SCHEMA_VERSION = 1`
- Conversion-resolution version: `MEASUREMENT_CONVERSION_RESOLUTION_VERSION = 1`
- Weight-calculation version: `DISCARDED_WEIGHT_CALCULATION_VERSION = 1`
- Weight-confidence model version: `WEIGHT_CONFIDENCE_MODEL_VERSION = 1`

## Controlled Values

- Quantity dimensions: mass, volume, count, servings.
- Conversion types: exact-unit, package-net-weight, package-drained-weight, serving-weight, average-unit-weight, density, prepared-batch-weight, user-reported-weight.
- Conversion review statuses: draft, draft-ai-generated, pending-review, approved, approved-with-limitations, suspended, retired, rejected.
- Weight confidence values: measured, exact-unit-conversion, validated-package-estimate, validated-serving-estimate, validated-average-weight-estimate, validated-density-estimate, user-estimate, low-confidence, unavailable.

## Behavior Implemented

- Direct mass behavior: mass quantities normalize to grams through the existing Unit Registry.
- Mass-unit-conversion behavior: 1 kg becomes 1,000 g; source confidence is preserved.
- Volume-only behavior: volume remains recorded and weight remains unavailable without approved density.
- Density-conversion behavior: supported only through approved matching conversion policy records.
- Density applicability behavior: food identity, form, and size applicability must match.
- Count-only behavior: count remains valid without mass.
- Average-unit-weight behavior: supported only through approved matching average-weight policies.
- Size-class behavior: required policy size class must match.
- Mixed-size behavior: conflicting or multiple records are review-required rather than averaged.
- Whole-item behavior: existing whole-count quick choices avoid invented fractional whole items.
- Serving-to-mass behavior: uses confirmed serving-weight inventory metadata only.
- Package-fraction behavior: uses current mass quantity first; package count can use confirmed package net food weight.
- Current-quantity precedence: current Pantry quantity remains the quick-suggestion basis.
- Net-weight behavior: net package quantity can support package-count estimates.
- Gross-weight behavior: gross package weight is not used.
- Drained-weight behavior: no drained ratio is inferred from can volume.
- Prepared-food behavior: prepared-food mass is not inferred from raw ingredient sums.
- Leftover behavior: current leftover quantity and serving conversion are used.
- Transformed-leftover behavior: parent leftover mass is not reused unless current batch metadata is compatible.
- Frozen-child behavior: mass children preserve mass; serving-only children remain unavailable without serving mass.
- Thawed-child behavior: compatible quantity metadata is preserved without invented grams.
- Point/minimum/maximum behavior: available estimates store all three values.
- Range propagation formula: min = min quantity × min factor; point = point quantity × point factor; max = max quantity × max factor.
- Display rounding behavior: grams are rounded with existing Chef Nova quantity rounding and approximate wording.
- Unknown-quantity behavior: unavailable, not zero.
- Unknown-weight behavior: unavailable, not zero.
- Add Weight Information behavior: event-specific measured or approximate mass can be appended.
- User-measured-weight behavior: labelled Measured weight.
- User-estimated-weight behavior: labelled User estimate.
- Historical-snapshot structure: weight estimates store source quantity, unit, dimension, conversion type, version, calculation version, Unit Registry version, timestamp, and snapshot hash.
- Conversion-version behavior: historical snapshots are stored and not rewritten.
- Conversion-content-governance behavior: only approved or approved-with-limitations policies can drive estimates.
- AI-draft behavior: draft-ai-generated policies cannot drive consumer estimates.
- Conversion-conflict behavior: equally applicable multiple policies return needs review/unavailable.
- Waste Diary display: cards show estimated weight, range, confidence, details, and Add Weight Information.
- Weight-details display: details show recorded quantity, unit, dimension, confidence, mass, range, basis, form, size, package, drained, serving, density, version, and correction history.
- Waste Dashboard integration: dashboard separates measured, exact-converted, validated-estimated, user-estimated, unknown, and non-mass entries.
- Correction behavior: weight enrichment is append-only and effective projections use corrected events once.
- Reversal behavior: effective-event projection boundary remains unchanged.
- Cost-estimation boundary: cost still works without requiring mass.
- Pattern-check boundary: pattern checker still uses count, food identity, reason, and dates only.
- Stale-conversion protection: snapshots store source revisions and user scope; add-weight operations resolve against the effective event.
- Idempotency behavior: append-only enrichment uses correction idempotency keys and effective projections.
- Multi-tab protection: stale events become corrected by effective projection; no Pantry command is run.
- Account-switch protection: user scope is stored in the request and event history remains user scoped.
- Registered-user isolation: existing user storage convention is reused.
- Guest behavior: guest event history remains session scoped.
- Accessibility work: visible headings, fieldsets, labels, contextual action names, associated errors, and live announcements.
- Responsive-design work: existing Waste Diary responsive grid and stacked action rows are reused.
- High-contrast behavior: textual confidence and unavailable state remain visible.
- Reduced-motion behavior: no animated counters or pulsing warnings were added.
- Print and export behavior: print keeps diary cards and hides actions.
- Performance approach: estimates use event snapshots and Unit Registry lookups; no runtime network fetches.
- Error handling: unsupported unit, unknown quantity, unavailable density, missing average, unapproved policy, and invalid user mass fail safely.
- Legacy migration: legacy evidence remains conservative; no unsupported current conversion is promoted.

## Required Results

- Second Unit Registries created: 0
- Second Ingredient Catalogues created: 0
- Unknown quantities treated as zero: 0
- Unknown weights treated as zero: 0
- Volume quantities treated as equal mass without density records: 0
- Five hundred millilitres automatically converted to 500 grams: 0
- Count quantities converted to mass without approved average-weight records: 0
- Serving quantities converted to mass without confirmed serving records: 0
- Raw-food conversions applied automatically to cooked food: 0
- Food-form mismatches accepted: 0
- Size-class requirements ignored: 0
- Gross package weight treated as net food weight: 0
- Can volume treated as drained-food weight: 0
- Raw ingredient sums treated as exact prepared-food weight: 0
- Approximate weights displayed as measured: 0
- Estimate ranges discarded: 0
- Fractional whole items invented incorrectly: 0
- Historical Waste Diary estimates changing after conversion updates: 0
- Draft or AI-generated conversions appearing in consumer estimates: 0
- Corrected events counted twice in Dashboard weight: 0
- Dashboard volume or count records added to mass without conversions: 0
- Cross-user measured weights exposed: 0
- Guest measurements persisted into registered-user storage automatically: 0

## Scenarios Tested

- Gram-to-kilogram and kilogram-to-gram exact conversions.
- Approximate kilogram input retaining approximate confidence.
- Volume without density staying unavailable.
- Approved density, density form mismatch, and unapproved density behavior by resolver policy rules.
- Required two-apple fixture behavior through approved average-weight policy support.
- Count without average-weight record staying unavailable.
- Size-class mismatch rejection.
- Whole-item quick choices avoiding 1.5 apples.
- Serving with confirmed mass and serving without mass.
- Package fraction through current mass quantity and package net weight.
- Current quantity precedence over original package quantity.
- Net weight, drained-weight absence, prepared food, leftovers, transformations, frozen/thawed child boundaries.
- Range propagation, unknown quantity, add weight, historical snapshot, conversion update boundary, conversion conflict, dashboard categories, dashboard non-mass coverage, correction, cost boundary, idempotency, user isolation, accessibility, mobile layout, high contrast, reduced motion, and print boundaries.

## Commands Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- `node --check scripts/cost-calculation-engine.js`
- `node --check scripts/price-data-shared.js`
- `node -e "JSON.parse(... data/recipes.json ...)"`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- `node tests/cost-calculation-engine.test.js`
- `node tests/price-data.test.js`
- `node tests/cook-before-it-spoils-step-26-waste-diary-static.test.js`
- `node tests/cook-before-it-spoils-step-27-pantry-linked-waste-diary-static.test.js`
- `node tests/cook-before-it-spoils-step-28-estimated-discarded-cost-static.test.js`
- `node tests/cook-before-it-spoils-step-29-careful-discarded-weight-static.test.js`
- Full `tests/*.js` suite

## Results

- Build result: not applicable; static app has no build command.
- Lint result: no lint command found.
- Type-check result: no type-check command found.
- Unit-test result: passed.
- Integration-test result: static integration checks passed.
- Browser-test result: local browser smoke tested after implementation.
- Accessibility-test result: static accessibility expectations passed.
- Responsive-test result: CSS/static responsive checks passed.
- Data-validation result: recipes JSON, ingredient data, and price data passed.
- Pre-existing failures: none observed in executed commands.
- New defects found: none remaining.
- Defects fixed: replaced hard-coded discarded-weight conversion with Unit Registry based resolver and added unavailable/weight-enrichment handling.
- Remaining issues: no approved global density or average-weight catalogue exists, so those estimates remain unavailable unless supplied by approved policy data later.
- Functionality intentionally deferred: photo-based weight estimation, runtime AI guessing, nutrition-based conversion, environmental-impact calculation, carbon calculation, behavioral diagnosis, and public comparison.
- Step 29 completion status: complete for the existing static Chef Nova app.

## Confirmations

- Exact same-dimension conversions use the existing Unit Registry.
- 1,000 g converts exactly to 1 kg display and 1 kg converts to 1,000 g canonical mass.
- 500 mL is never automatically represented as 500 g or 0.5 kg without approved density.
- Count-based items receive mass only with a validated matching average-weight record.
- The two-apple example produces approximate 360 g only when an approved 180 g-per-item record applies.
- Serving quantities convert to mass only with confirmed serving-weight information.
- Food form, preparation state, and size class are validated before cross-dimension conversion.
- Gross package weight is never treated as net food weight.
- Drained-food weight is never inferred from can volume.
- Prepared-food weight is never claimed from unvalidated raw ingredient sums.
- Approximate inputs and ranges remain approximate with min, point, and max values.
- Unknown quantities and unknown weights are never represented as zero.
- AI-generated or unapproved conversion records never drive consumer-facing weight estimates.
- Historical Waste Diary weight snapshots do not change automatically after conversion-policy updates.
- Measured, exact-converted, validated-estimated, user-estimated, and unavailable weights remain distinguishable.
- Waste Dashboard totals never add volume, count, or serving quantities to mass without valid conversion.
- Adding or correcting weight information never changes Pantry quantity or creates another physical discard event.
- Cost calculations may remain count-, volume-, or serving-based without forcing mass.
- Repeated weight calculations cannot add the same value to Waste Dashboard totals twice because effective event projection is used.
- Registered-user measurements and summaries remain isolated.
- Guest measurements and summaries remain temporary.
- No duplicate Unit Registry, Ingredient Catalogue, prepared-food taxonomy, Pantry, quantity system, Food Event History, Waste Diary source, Waste Dashboard source, or user-storage convention was created.
- No photo-based weight inference, runtime AI weight guessing, nutrition-based conversion, environmental-impact calculation, carbon calculation, behavioral diagnosis, or public comparison was introduced.

## Recommended Starting Point for Step 30

Add authorized review tooling for conversion policies, beginning with package net/drained-weight metadata and serving-weight records before any global density or average-unit-weight catalogue.
