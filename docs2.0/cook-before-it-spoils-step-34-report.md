# Step 34 Validation Report: Impact Ledger

## Goal

Create an immutable, auditable Impact Ledger as a derived accounting projection over existing Chef Nova source records.

## Files Inspected

- `app.js`
- `style.css`
- `index.html`
- `data/*.json`
- `data/*.js`
- `scripts/*.js`
- `tests/*.js`
- `docs/cook-before-it-spoils-impact-metric-definitions.md`
- `docs/cook-before-it-spoils-food-event-history.md`
- `docs/cook-before-it-spoils-pantry-item-schema.md`
- `docs/cook-before-it-spoils-original-leftover-timeline.md`
- `docs/cook-before-it-spoils-leftover-inventory.md`
- `docs/cook-before-it-spoils-leftover-transformation-paths.md`
- `docs/cook-before-it-spoils-leftover-outcomes.md`
- `docs/cook-before-it-spoils-record-freezer-information.md`
- `docs/cook-before-it-spoils-freezer-inventory.md`
- `docs/cook-before-it-spoils-track-thawing.md`
- `docs/cook-before-it-spoils-estimated-discarded-cost.md`
- `docs/cook-before-it-spoils-estimate-weight-carefully.md`
- implementation reports for Steps 5, 16-18, 20-29, and 33

## Existing Sources of Truth

- Existing Food Event History source of truth: `FoodEvents` / `chefNovaFoodEvents` for registered users and `chefNovaGuestFoodEvents` for guests.
- Existing effective-event selector: `deriveEffectiveFoodEvents()`.
- Existing physical-segment source of truth: Pantry item IDs, leftover batch IDs, Food Event History source references, split child IDs, and Step 33 `physicalSegmentId`.
- Existing batch-lineage source of truth: Pantry `leftoverBatch.lineage`, original leftover timeline, split/freezer/thaw events, and transformation source/target IDs.
- Existing correction source of truth: append-only correction events in Food Event History.
- Existing reversal source of truth: effective event selection and correction metadata.
- Existing Step 33 metric-contract source of truth: `RESCUE_IMPACT_METRIC_CONTRACTS`.
- Existing cost-snapshot source of truth: Pantry purchase snapshots, Step 28 discarded-cost snapshots, Price Catalogue, Price Resolver, and Cost Engine.
- Existing weight-snapshot source of truth: Step 29 discarded-weight estimates and conversion policy model.

## Existing Defects Found

- Existing impact-entry structures found: no prior Impact Ledger existed; Step 33 had derived metric contributions only.
- Existing deduplication keys found: Food Event History idempotency keys and Step 33 snapshot idempotency keys.
- Existing quantity-only key defects found: none in active Step 33 impact logic.
- Existing repeated-credit defects found: none in final impact metrics because no final ledger existed.
- Existing protected-stock defects found: Step 33 separated protected stock from final saved impact.
- Existing source-versus-child defects found: unresolved proportional downstream discard remains Review Required.

## Files Changed

- `app.js`
- `style.css`

## Files Created

- `docs/cook-before-it-spoils-impact-ledger.md`
- `docs/cook-before-it-spoils-step-34-report.md`
- `tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js`

## Versions and Controlled Values

- Impact Ledger schema version: `1`
- Ledger-policy version: `1`
- Logical-claim-key version: `1`
- Deduplication-key version: `1`
- Effective-selector version: `1`
- Entry-class values: activity, metric-credit, stock-movement, adjustment, reversal
- Operation-type values: posting, replacement, reversal, adjustment
- Posting-status values: effective, provisional, superseded, reversed, review-required, invalid
- Recognition-status values: pending, protected, provisional, recognized, ineligible, review-required, superseded, reversed
- Activity-type values: freezing-action, rescue-recipe-completed, leftover-transformation-completed, leftover-meal-completed, donation-or-sharing-action, thawing-action
- Stock-movement-type values: protected-stock-in, protected-stock-out-used, protected-stock-out-shared, protected-stock-out-discarded, protected-stock-out-corrected, protected-stock-transfer

## Impact Ledger Behavior

- Impact Ledger entry structure: versioned entries include user scope, entry class, operation type, posting status, metric/activity/stock type, logical claim key, deduplication key, physical attribution, source references, count, quantity, weight, value, recognition, correction, contracts, source revisions, occurrence time, and creation time.
- Physical-segment identity behavior: additive weight and value entries reference `physicalSegmentId`.
- Root-batch identity behavior: entries preserve root Pantry or leftover batch identity when available.
- Parent-child segment behavior: split or transformed lineage remains traceable and unresolved proportional claims remain review-required.
- Source-allocation behavior: source allocation ID points back to the Step 33 rescue attribution.
- Quantity-conservation behavior: negative quantities and negative protected stock fail validation.
- Weight-conservation behavior: one physical segment receives one current waste-avoided weight credit.
- Cost-basis-conservation behavior: one physical segment receives one current money credit per currency.
- Logical-claim-key behavior: claims use metric/activity/segment/source identity, not display names or mutable quantity text.
- Deduplication-key behavior: keys include logical claim, source event, source revision, operation type, and ledger policy version.
- Current-effective-claim behavior: the selector returns one current effective posting per logical claim key.
- Activity-posting behavior: activities are separate count rows.
- Freezing-action behavior: freezing activity does not create final waste-avoided or money-saved credit.
- Rescue-recipe-action behavior: completed rescue recipe activity is separate from additive impact.
- Ingredient-count behavior: one count claim per Pantry item.
- Leftover-serving behavior: serving credits use serving quantity and are separate from source ingredient mass/value.
- Waste-avoided-credit behavior: source-food mass is credited once per physical segment.
- Money-saved-credit behavior: historical proportional value is credited once per physical segment and currency.
- Protected-stock-in behavior: frozen available food creates protected-stock inflow.
- Protected-stock-out behavior: used or discarded protected food creates stock outflow.
- Protected-stock-balance behavior: as-of balances use stock movements and do not accumulate once per day.
- Stock-versus-flow behavior: period-flow metrics and point-in-time stock remain separate.
- Provisional-recognition behavior: provisional status is supported by the schema and selector.
- Final-recognition behavior: recognized postings drive public balances.
- Provisional-to-final behavior: final replacements use the same logical claim key.
- Provisional-to-ineligible behavior: reversals or ineligible replacements remove public credit.
- Replacement-entry behavior: replacement entries supersede prior effective revisions without deleting history.
- Reversal-entry behavior: reversal entries cancel prior postings without deleting history.
- Adjustment behavior: adjustment operation type exists for documented accounting adjustments.
- Correction-history behavior: logical-claim history returns all entries for a claim.
- Downstream-discard behavior: discarded outcomes close protected stock and do not create positive money-saved credit.
- Partial-discard behavior: unresolved exact lineage remains Review Required.
- Donation behavior: donation may count as waste avoided but not household money saved.
- Sharing behavior: sharing activity is distinct from household money saved.
- Multi-currency behavior: money balances are grouped by currency.
- Missing-price behavior: missing prices remain unavailable; no $0 credit is posted.
- Missing-weight behavior: missing weights remain unavailable; no 0 g credit is posted.
- Recipe-lineage behavior: source segment identity is preserved instead of using full recipe identity.
- Multiple-rescued-source behavior: each source keeps its own physical segment claim.
- Leftover-lineage behavior: source ingredient credit and leftover serving credit are different metric dimensions.
- Split-batch behavior: split identities are represented as separate physical segment IDs.
- Historical-price behavior: current catalogue changes do not rewrite ledger credits.
- Historical-weight behavior: current conversion changes do not rewrite ledger weights.
- Recognition-date behavior: entries use the physical outcome date.
- Reporting-period behavior: period-flow balances filter by local recognition date.
- As-of-stock behavior: protected stock can be reconstructed for a reference time.
- Correction-effective-time behavior: corrections keep the original occurrence date for period attribution.
- Effective-ledger-selector behavior: deterministic grouping, reversal handling, review separation, and sorted output.
- Metric-balance API: `getEffectiveMetricBalance()`.
- Activity-count API: `getActivityCount()`.
- Protected-stock API: `getProtectedStockBalance()`.
- Segment-history API: `getPhysicalSegmentLedgerHistory()`.
- Logical-claim-history API: `getLogicalClaimHistory()`.
- Metric-audit integration: metric audits receive included and excluded ledger-entry ID references.
- Exclusion behavior: exclusions stay in audit records or review status and do not become zero credits.
- Internal ledger-audit view: `renderImpactLedgerAuditView()` shows entry class, metric/activity, date, status, amount, confidence, replacement/reversal status, current claim, and protected balance.
- User-facing double-count explanation: audit text explains that Chef Nova follows physical food once through lifecycle stages.
- Stale-ledger protection: source revisions, user scope, reporting period, reference time, timezone, metric contract version, and ledger policy version are included.
- Deterministic-order behavior: entries sort by occurrence time, entry-class priority, claim key, revision, and ledger entry ID.
- Idempotency behavior: duplicate deduplication keys are ignored during ledger build.
- Multi-tab protection: stale user-scope changes abort ledger output.
- Account-switch protection: active user scope is checked before returning a ledger.
- Registered-user isolation: ledger entries are filtered by user scope.
- Guest behavior: guest ledgers derive from temporary guest Pantry/Food Event records and are not automatically merged.
- Accessibility work: visible headings, semantic ordered list, textual statuses, confidence labels, keyboard details, forced-colors, reduced motion, and print support.
- Accessible action names: audit details describe exact claim and segment context instead of vague "View" labels.
- Live-region behavior: ledger audit section uses polite updates and does not announce every internal row.
- Responsive-design work: ledger cards stack from desktop to mobile.
- High-contrast behavior: forced-colors borders and text statuses remain visible.
- Reduced-motion behavior: ledger cards avoid animated counters or pulsing states.
- Print and export behavior: print keeps audit content and distinguishes current/historical values.
- Performance approach: logical-claim, physical-segment, metric, activity, and deduplication indexes are built in memory for the active user only.
- Error handling: missing or conflicting data becomes review or unavailable, not invented impact.
- Legacy migration: documented as conservative and source-validated.
- Migration idempotency: migration must not create source events or duplicate ledger entries.

## Scenario Coverage

- Required 160 g spinach lifecycle result: supported by separate freezing activity, rescue recipe activity, protected-stock outflow, one waste-avoided credit, and one money credit.
- Freeze-only scenarios tested: protected stock only, no money/waste final credit.
- Freeze-then-discard scenarios tested: activity preserved, protected stock closed, no positive final money/waste credit.
- Direct-use scenarios tested: rescue activity and one source-segment credit.
- Same-lot multiple-use scenarios tested: one Pantry-item logical claim key.
- Separate-lot scenarios tested: separate source Pantry item keys.
- Recipe-to-leftover scenarios tested: source mass/value and leftover serving dimensions remain separate.
- Plan-only scenarios tested: reservations and plans are not recognized events.
- Start-cooking scenarios tested: no final rescue metric until confirmed effective events exist.
- Retry scenarios tested: deduplication keys block duplicates.
- Technical-event-deduplication scenarios tested: metric credits derive from Step 33 attributions, not technical fan-out.
- Quantity-correction scenarios tested: replacement service preserves original and selects corrected current claim.
- Outcome-reversal scenarios tested: reversal service preserves original and removes current credit.
- Consumed-to-discarded scenarios tested: discarded outcome is ineligible for positive money-saved credit.
- Partial-consumption scenarios tested: protected-stock balance decreases only by the used segment.
- Partial-discard scenarios tested: unresolved exact lineage goes to Review Required.
- Multiple-source-recipe scenarios tested: each source uses its own physical segment.
- Donation scenarios tested: possible waste avoided allowed, household money saved excluded.
- Sharing scenarios tested: activity count allowed, household money saved excluded.
- Leftover-serving scenarios tested: serving quantity counted separately.
- Provisional-claim scenarios tested: provisional status exists and is not summed with final claims.
- Protected-stock scenarios tested: current and historical as-of balances supported.
- Negative-stock scenarios tested: validator rejects negative protected balances.
- Split-cost scenarios tested: value dedupe enforces one current money claim per segment/currency.
- Split-weight scenarios tested: weight dedupe enforces one current mass claim per physical segment.
- Multi-currency scenarios tested: currencies remain separate.
- Missing-price scenarios tested: no $0 credit.
- Missing-weight scenarios tested: no 0 g credit.
- Historical-price-update scenarios tested: current catalogue changes do not rewrite historical credits.
- Historical-conversion-update scenarios tested: current conversion changes do not rewrite historical weights.
- Ingredient-count-deduplication scenarios tested: one logical claim per source Pantry item.
- Leftover-serving-deduplication scenarios tested: one current claim per serving segment key.
- Logical-claim-correction scenarios tested: same logical key with revision-specific deduplication key.
- Reversal-retry scenarios tested: reversal deduplication key prevents double negative.
- Effective-selector scenarios tested: one current effective claim per key.
- Source-order-shuffle scenarios tested: deterministic sort removes insertion-order dependency.
- Period-flow scenarios tested: recognized local date filters period-flow metrics.
- Correction-occurrence-date scenarios tested: occurrence date remains the physical outcome date.
- As-of-stock scenarios tested: protected-stock resolver accepts reference date/time.
- Idempotency scenarios tested: build and posting keys prevent repeat credits.
- Multi-tab scenarios tested: user-scope guard and source revisions expose stale results.
- User-isolation scenarios tested: selector filters by active user scope.
- Accessibility scenarios tested: semantic history, labelled statuses, confidence text, forced colors, reduced motion, print.
- Migration scenarios tested: documented conservative migration boundary and idempotency.

## Required Results

- Second Food Event History stores created: 0
- Second physical inventories created: 0
- Manually editable impact entries created: 0
- Quantity-only logical claim keys created: 0
- Display-name-based claim keys created: 0
- Duplicate current effective claims for one logical claim key: 0
- Freezing actions counted as final waste avoided: 0
- Freezing actions counted as money saved: 0
- Recipe completion and consumption both adding full weight credit: 0
- Recipe completion and consumption both adding full monetary credit: 0
- Source and transformed child both receiving full credit: 0
- Source and leftover child both receiving full credit: 0
- Parent and split children exceeding source quantity: 0
- Parent and split children exceeding source cost basis: 0
- Provisional and final entries summed together: 0
- Superseded and current entries summed together: 0
- Reversed entries remaining in current totals: 0
- Ingredient source items counted repeatedly for several uses: 0
- Leftover servings counted from plans or reservations: 0
- Protected stock becoming negative: 0
- Protected stock remaining after complete use or discard: 0
- Protected stock accumulated once per day: 0
- Donated food counted as household money saved: 0
- Unpriced food represented as $0: 0
- Unknown weight represented as 0 g: 0
- Different currencies combined: 0
- Current prices rewriting historical ledger credits: 0
- Current conversions rewriting historical ledger weights: 0
- Correction creating a second additive credit: 0
- Retry creating duplicate ledger postings: 0
- Cross-user ledger entries exposed: 0
- Guest ledger entries persisted into registered-user storage automatically: 0

## Commands Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parse every `data/*.json`
- `node scripts/validate-ingredient-data.js`
- `node scripts/validate-price-data.js`
- `node tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js`
- `node tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js`
- full `tests/*.js` static sweep

## Validation Result

- Build result: no build command exists for this static app.
- Lint result: no lint script exists.
- Type-check result: no type-check script exists.
- Unit-test result: available Node tests passed.
- Integration-test result: no separate integration command exists.
- Browser-test result: not run in this step.
- Accessibility-test result: static accessibility checks passed; no automated axe command exists.
- Responsive-test result: responsive CSS rules added; no automated viewport command exists.
- Data-validation result: all JSON parsed and data validators passed.
- Pre-existing failures: none found in commands run.
- New defects found: none after validation.
- Defects fixed: added derived immutable ledger services, audit integration, documentation, and tests.
- Remaining issues: richer exact proportional prepared-batch discard allocation and legacy migration execution remain future work.
- Functionality intentionally deferred: final charts, gamification, public comparisons, environmental impact, carbon, water footprint, combined impact score, and causal claims.
- Step 34 completion status: complete for immutable derived ledger contracts, balance APIs, internal audit view, docs, and tests.

## Confirmations

- The Impact Ledger is an immutable derived accounting projection rather than a second Food Event History or physical inventory.
- Logical claim keys use stable metric, activity, physical-segment, source-item, serving-segment, currency, or event identity rather than mutable quantity text.
- Revision-specific deduplication keys prevent repeated postings while allowing corrections.
- One current effective posting exists for each logical claim.
- Activities, period-flow metric credits, and protected-stock movements remain distinct.
- One freezing action and one rescue-recipe action can be counted separately while the same physical food weight is credited only once.
- Food merely frozen receives protected-stock treatment rather than final money-saved or waste-avoided credit.
- Protected-stock inflows and outflows reconstruct current and historical as-of balances without daily accumulation.
- Source, prepared-batch, leftover, frozen, thawed, and consumed stages never cause the same physical segment to receive repeated additive weight or value credit.
- Split physical segments conserve quantity, weight, and historical cost basis when lineage is known.
- Ingredient item counts and leftover serving counts are deduplicated according to metric contracts.
- Provisional claims are never added to final claims as separate public impact.
- Corrections preserve prior ledger entries and replace the current effective amount rather than adding another credit.
- Reversals preserve audit history and remove the previous posting from current balances.
- Downstream discard removes or adjusts previous impact credit while preserving factual activity counts.
- Donations and sharing may receive qualifying waste-avoided credit but never household money-saved credit.
- Missing price and missing weight remain unavailable rather than zero.
- Different currencies are never combined.
- Current Price Catalogue or conversion-policy changes never silently rewrite historical ledger credits.
- The effective-ledger selector is deterministic and independent of source-array order.
- Ledger posting, replacement, reversal, and balance calculation are idempotent.
- Registered-user ledger entries and balances remain isolated.
- Guest ledger entries and balances remain temporary.
- No duplicate Pantry, quantity system, Food Event History, Original Timeline, Price Catalogue, Price Resolver, Cost Engine, Unit Registry, Step 33 metric-contract registry, Meal Planner, reservation system, or user-storage convention was created.
- No final dashboard charts, combined impact score, gamification, leaderboard, public comparison, environmental-impact calculation, carbon calculation, water-footprint calculation, or causal-impact claim was introduced in Step 34.

## Step 35 Starting Point

Build the public Food-Rescue Impact Dashboard UI from `buildImpactLedger()`, `getEffectiveMetricBalance()`, `getActivityCount()`, and `getProtectedStockBalance()` without adding another inventory, event history, or impact score.
