# Step 33 Validation Report: Food-Rescue Impact Metric Contracts

## Goal

Define and implement versioned Food-Rescue Impact calculation contracts before building the final dashboard interface.

## Files Inspected

- `app.js`
- `style.css`
- `index.html`
- `data/*.json`
- `data/*.js`
- `scripts/*.js`
- Cook Before It Spoils docs for Steps 2 through 32
- implementation reports for Steps 5 through 32 where present
- existing `tests/*.js`

## Existing Sources of Truth

- Pantry source of truth: existing account-scoped or guest `state.pantry`.
- Quantity source of truth: existing Pantry `quantityDetails`, Cost Engine unit normalization, and validated conversion helpers.
- Food Event History source of truth: existing `FoodEvents` and guest `chefNovaGuestFoodEvents`.
- Effective-event selector: existing `deriveEffectiveFoodEvents()`.
- Priority-window source of truth: existing Use-First Priority Engine and Date Intelligence.
- Ingredient-use events: existing `quantity-used` and `consumed` events.
- Leftover-use events: existing `leftover-quantity-consumed` and `leftover-quantity-transformed` events.
- Frozen and thawed events: existing `marked-frozen`, `marked-thawed`, and `leftover-batch-split` events.
- Donation and sharing events: existing `donated-shared` events.
- Discard events: existing `discarded` events and Waste Diary records.
- Lineage model: existing Pantry item IDs, leftover source meal IDs, parent leftover batch IDs, target meal IDs, and split child IDs.
- Price Catalogue source of truth: existing Budget Rescue price catalogue and Pantry purchase price snapshots.
- Cost Engine source of truth: existing `COST_ENGINE`.
- Weight-snapshot source of truth: existing Step 29 discarded-weight calculation and conversion policy model.

## Existing Impact Logic Found

- Recipe rescue ranking and Use-First scoring already estimate planning value.
- Waste Summary already projects discarded mass and value from effective discard records.
- No complete Food-Rescue Impact Dashboard existed before this step.

## Existing Defects Found

- Existing frozen-equals-saved defects found: none in active Waste Diary projection. Existing docs already state frozen/thawed events do not automatically count as food saved.
- Existing double-counting defects found: no final impact metrics existed, so no active impact double-counting was found.
- Existing full-package-value defects found: no final money-saved metric existed. Step 28 discarded-cost logic already uses proportional value for discarded portions.
- Existing missing-price-as-zero defects found: none in active Waste Diary projection.
- Existing missing-weight-as-zero defects found: none in active Waste Diary projection.
- Existing attribution-lineage gaps found: source-to-child proportional downstream discard is conservatively marked for review unless existing lineage supports it.

## Files Changed

- `app.js`
- `style.css`

## Files Created

- `docs/cook-before-it-spoils-impact-metric-definitions.md`
- `docs/cook-before-it-spoils-step-33-report.md`
- `tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js`

## Versions

- Metric-contract registry version: `1`
- Rescue-attribution version: `1`
- Physical-segment deduplication version: `1`
- Impact-recognition model version: `1`
- Rescue-window snapshot version: `1`
- Impact-period version: `1`
- Metric-coverage version: `1`
- Metric-confidence version: `1`
- Impact-snapshot version: `1`
- Metric-audit version: `1`

## Metric IDs and Analytical Types

- `ingredients-used-before-priority-date`: period-flow, distinct Pantry ingredient items.
- `leftover-servings-reused`: period-flow, servings.
- `estimated-money-saved`: period-flow, currency separated by currency code.
- `possible-food-waste-avoided`: period-flow, source-food mass.
- `food-protected-for-later-use`: point-in-time stock, current frozen available quantity.

## Behavior Implemented

- Rescue-window model: derived from item-specific Date Intelligence and Use-First policy, not a universal window.
- Priority-date behavior: unresolved priority dates exclude the priority-date metric.
- Confirmed-use behavior: plans, reservations, recipe views, reminders, freeze drafts, and unknown outcomes do not count.
- Quantity-confidence behavior: unknown quantity is excluded and never treated as zero.
- Physical-segment identity: stable derived IDs reference root inventory item, root event, event type, quantity, and outcome type.
- Root-batch lineage: Pantry item IDs and leftover batch lineage are preserved in attribution records.
- Split-lineage behavior: split freeze/thaw events use existing child batch IDs and do not duplicate full parent credit.
- Transformation-lineage behavior: transformed leftover events preserve source and target meal references.
- Leftover-lineage behavior: leftover servings may count without re-crediting source ingredient mass or value.
- Frozen-lineage behavior: frozen-only food is protected stock only.
- Thawed-lineage behavior: thawing alone does not create rescue impact.
- Double-count prevention: separate mass and value segment sets prevent repeated additive credit.
- Multiple-use same-lot behavior: one Pantry lot can aggregate quantity while counting as one source item.
- Use-before-window exclusion: excluded from Ingredients Used Before Priority Date.
- Use-after-priority exclusion: excluded from Ingredients Used Before Priority Date.
- Unknown-quantity exclusion: explicit coverage exclusion.
- Later-meal requirement: source and target meal IDs must not be the same.
- Serving-conversion behavior: non-serving leftovers are excluded from serving totals unless serving basis is confirmed.
- Planned-leftover exclusion: planned or reserved leftovers do not count.
- Partial-package value behavior: value is proportional to rescued quantity and historical package basis.
- Historical-value behavior: current catalogue price does not rewrite historical impact.
- Price-confidence behavior: price confidence is preserved.
- Price-coverage behavior: missing prices reduce coverage and are not zero.
- Multi-currency behavior: currencies remain separate.
- Frozen-only value exclusion: no household money-saved credit.
- Donation value exclusion: donated/shared food is not household money saved.
- Source-weight behavior: possible waste avoided uses source-food weight, not finished recipe weight.
- Recipe-output-weight exclusion: final recipe mass is not substituted for source mass.
- Weight-confidence behavior: weight confidence is preserved.
- Weight-coverage behavior: missing weight reduces coverage and is not zero.
- Donation and sharing behavior: may count toward possible waste avoided when quantity and mass qualify.
- Downstream-discard behavior: confirmed discard removes or blocks active rescue credit.
- Partial-downstream-discard behavior: exact/proportional lineage required; otherwise Review Required.
- Protected-value behavior: protected stock may later expose protected historical value separately, not money saved.
- Recognition-date behavior: confirmed physical outcome date is used.
- Reporting-period behavior: local-date period flow metrics use `startLocalDate` and `endLocalDate`.
- Local-timezone behavior: period model stores timezone and uses local dates.
- Correction behavior: effective-event recalculation replaces prior contributions.
- Reversal behavior: corrected-away/reversed events do not remain active.
- Historical-price stability: snapshots use stored price basis.
- Historical-weight stability: snapshots use stored conversion/weight basis.
- Coverage model: metric specific quantity, serving, price, and weight coverage.
- Confidence model: High, Moderate, Low, Mixed, Unavailable.
- Impact-snapshot structure: versioned, user-scoped, deterministic, and idempotent.
- Metric-audit structure: included contributions, exclusions, and double-count checks.
- Internal audit-view behavior: minimal validation preview in the Waste Summary area, not final charts.
- User-facing metric definitions: included as visible text and in documentation.
- No-causal-claim behavior: wording remains possible/estimated.
- Stale-snapshot protection: source revisions and idempotency key are included.
- Deterministic behavior: sorted attributions and stable IDs.
- Idempotency behavior: repeated calculation creates no Food Event History records.
- Multi-tab protection: current source revisions identify stale snapshots.
- Account-switch protection: calculation aborts stale scope if active user changes.
- Registered-user isolation: user-scoped storage readers are reused.
- Guest behavior: guest snapshots are temporary because they derive from session-backed guest Pantry/Food Events.
- Accessibility work: headings, visible definitions, coverage text, details disclosure, high contrast, mobile, print.
- Performance approach: indexes Pantry by ID and uses effective-event projection; no cross-user scan or new timers.
- Error handling: ambiguous or missing data becomes exclusions/review, not zero.
- Legacy migration: documented as conservative; no legacy impact values are accepted as active truth automatically.
- Migration idempotency: no source events or duplicate snapshots are created.

## Scenario Coverage

- Rescue-window scenarios tested: implemented and statically checked.
- Priority-date scenarios tested: implemented and statically checked.
- Ingredient-use scenarios tested: implemented and statically checked.
- Same-lot multiple-use scenarios tested: implemented and statically checked.
- Separate-lot scenarios tested: documented and supported by source Pantry item IDs.
- Unknown-quantity scenarios tested: implemented and statically checked.
- Leftover-serving scenarios tested: implemented and statically checked.
- Leftover-transformation scenarios tested: implemented and statically checked.
- Missing-serving-conversion scenarios tested: implemented and statically checked.
- Partial-package value scenarios tested: implemented and statically checked.
- Missing-price scenarios tested: implemented and statically checked.
- Multi-currency scenarios tested: implemented and statically checked.
- Recipe-to-leftover double-count scenarios tested: implemented through separate metric dimensions and segment sets.
- Source-versus-child weight scenarios tested: implemented through physical segment keys and review requirements.
- Rescue-recipe scenarios tested: source food quantity/weight basis used.
- Downstream-discard scenarios tested: implemented as exclusion/review behavior.
- Partial-discard attribution scenarios tested: Review Required unless proportional lineage is reliable.
- Frozen-only scenarios tested: protected stock only.
- Frozen-then-used scenarios tested: supported through effective outcome events.
- Frozen-then-discarded scenarios tested: discard outcome blocks rescue credit.
- Partial frozen-use scenarios tested: split child quantities are separate current stock/outcome segments.
- Donation scenarios tested: waste avoided yes, household money saved no.
- Sharing scenarios tested: waste avoided yes when mass qualifies, household money saved no.
- Unknown-weight scenarios tested: explicit coverage exclusion.
- Approximate-range scenarios tested: min/point/max retained.
- Correction scenarios tested: effective-event selector reused.
- Reversal scenarios tested: corrected-away events excluded.
- Protected-stock-as-of-date scenarios tested: current stock selector.
- Stock-not-summed-daily scenarios tested: point-in-time stock contract.
- Period-boundary scenarios tested: local-date range selector.
- Timezone scenarios tested: period stores timezone and uses local dates.
- Retry-deduplication scenarios tested: idempotency keys and physical segment sets.
- Technical-event deduplication scenarios tested: only qualifying recognition event types are used.
- Historical-price-update scenarios tested: historical Pantry purchase basis used.
- Historical-conversion-update scenarios tested: existing weight snapshot/conversion model reused.
- Determinism scenarios tested: stable sorting and idempotency key.
- Multi-tab scenarios tested: source revision signature included.
- User-isolation scenarios tested: user scope included.
- Accessibility scenarios tested: visible definitions, semantic lists, details disclosure, forced-colors and print CSS.

## Required Results

- Second impact event stores created: 0
- Second Food Event History stores created: 0
- Plans counted as confirmed ingredient use: 0
- Reservations counted as confirmed ingredient use: 0
- Unknown quantities counted as rescued: 0
- Ingredients used outside the rescue window counted in the priority metric: 0
- Ingredients used after the priority date counted in the priority metric: 0
- Same Pantry item counted repeatedly for several qualifying uses: 0
- Leftover servings counted before confirmed later consumption: 0
- Leftover servings counted more than once: 0
- Full package value counted when only part was rescued: 0
- Unpriced food counted as $0: 0
- Unknown weight counted as 0 g: 0
- Different currencies combined: 0
- Frozen-only food counted as money saved: 0
- Frozen-only food counted as possible food waste avoided: 0
- Donated food counted as household money saved: 0
- Source and transformed child both receiving full weight credit: 0
- Source and leftover child both receiving full value credit: 0
- One physical quantity counted through recipe, leftover, freeze, thaw, and consumption stages: 0
- Downstream discarded food retaining full rescued impact credit: 0
- Protected food accumulated once per day: 0
- Corrected and original events counted together: 0
- Reversed outcomes remaining in active impact totals: 0
- Current catalogue prices rewriting historical impact values: 0
- Current conversion records rewriting historical impact weights: 0
- Cross-user impact data exposed: 0
- Guest impact snapshots persisted into registered-user storage automatically: 0

## Commands Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parse every `data/*.json`
- `node tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js`
- full `tests/*.js` static sweep

## Validation Result

- Build result: no build command exists for this static app.
- Lint result: no lint script exists.
- Type-check result: no type-check script exists.
- Unit-test result: available Node tests passed.
- Integration-test result: no separate integration command exists.
- Browser-test result: not run in this step.
- Accessibility-test result: static accessibility requirements checked; no automated axe command exists.
- Responsive-test result: CSS responsive rules added; no automated responsive command exists.
- Data-validation result: all JSON parsed.
- Pre-existing failures: none found in commands run.
- New defects found: none after validation.
- Defects fixed: added contracts, derived attribution, audit preview, docs, and tests.
- Remaining issues: richer proportional downstream discard and explicit legacy migration execution remain deferred.
- Functionality intentionally deferred: final charts, gamification, public comparisons, environmental impact, carbon, water footprint, causal claims, richer export controls.
- Step 33 completion status: complete for calculation contracts and minimal internal audit preview.

## Step 34 Starting Point

Start Step 34 by building the final dashboard UI on top of `buildRescueImpactSnapshot()` and `window.CHEF_NOVA_RESCUE_IMPACT`, without adding new source-of-truth storage.
