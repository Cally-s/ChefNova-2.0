# Chef Nova Food-Rescue Impact Metric Definitions

## 1. Purpose

Step 33 defines the Food-Rescue Impact metrics before dashboard design. The goal is to prevent overcounting, unsupported savings claims, and frozen-equals-saved mistakes.

## 2. Existing Systems Reused

Chef Nova reuses the existing Pantry, Food Event History, Use-First priorities, meal completions, leftovers, freezer records, thaw records, sharing, donations, Waste Diary, cost snapshots, weight snapshots, corrections, reversals, and account-scoped storage. No second impact-event database is created.

## 3. Metric Types

Period-flow metrics are recognized during a selected local-date period: ingredients used before priority date, leftover servings reused, estimated money saved, and possible food waste avoided.

Point-in-time stock metrics are evaluated at a reference time: food protected for later use. Protected stock is not summed once per day.

## 4. Physical Quantity Attribution

The same physical quantity is represented as one derived attribution segment. Lineage may move through Pantry, recipe use, prepared meals, leftovers, frozen storage, thawing, and consumption, but additive weight and value credit can be applied only once per physical segment.

## 5. Rescue Windows

A rescue-window snapshot stores the window start, priority date, date type, priority source, priority confidence, storage state, opened status, policy version, and timezone. Chef Nova does not invent one universal window.

## 6. Confirmed Outcomes

Confirmed outcomes include Pantry quantity used in a completed meal, direct consumption, leftover consumption in a later meal, confirmed transformation use, donated food, shared food, and downstream discard. Plans, reservations, recipe views, reminders, freeze drafts, thawing alone, and unknown outcomes are not rescue impact.

## 7. Quantity Confidence

Measured, user-estimated, qualitative-derived, serving-derived, package-derived, and whole-count quantities may qualify when valid. Unknown, malformed, incompatible, stale, or unsupported quantities do not qualify and are not converted to zero.

## 8. Metric Contract Registry

The registry version is `1`. It defines canonical metric IDs, analytical type, unit type, recognition event types, rescue-window requirements, quantity requirements, price and weight requirements, correction behavior, and stock-versus-flow behavior.

## 9. Ingredients Used Before Priority Date

This metric counts distinct source Pantry ingredient items confirmed used after entering the rescue window and on or before the recorded priority date. It also reports unique ingredient identities and quantity summaries by unit.

## 10. Leftover Servings Reused

This metric counts confirmed leftover servings consumed in a meal after the original source meal. The target meal must differ from the source meal, and a valid serving basis is required.

## 11. Estimated Money Saved

This metric uses proportional historical value. If 120 g is rescued from a 300 g package that cost 450 cents, the recognized value is 120 / 300 of the historical package value, or 180 cents.

## 12. Possible Food Waste Avoided

This metric uses the source food mass, not the final recipe mass. A 160 g at-risk spinach allocation in an 800 g pasta dish contributes at most 160 g before downstream-discard adjustment.

## 13. Food Protected for Later Use

Food Protected for Later Use is current frozen available stock after a qualifying rescue action. It is separate because freezing does not prove that food was eventually used.

## 14. Frozen-to-Used Transition

Frozen-only food starts as protected stock. When later confirmed used, shared, or donated, the used amount leaves protected stock and may enter possible waste avoided. Household money saved applies only to household use with a valid historical value.

## 15. Downstream Discard

When a prepared or transformed batch is later discarded, Chef Nova adjusts prior impact if reliable lineage exists. If proportional lineage is ambiguous, the affected amount is marked Review Required.

## 16. Transformation Lineage

Recipe and leftover transformations preserve source quantity, source weight, source value, source batch, child batch, and source-to-child relationships. The finished recipe weight is never assigned wholly to one rescued source.

## 17. Leftover Lineage

Leftover-serving reuse can count a later serving without re-crediting the source ingredient’s mass or value. Cross-metric overlap is allowed only when metrics describe different dimensions.

## 18. Historical Price Snapshots

Estimated money saved uses the historical cost basis stored with the food or event. Current catalogue changes do not rewrite historical value.

## 19. Historical Weight Snapshots

Possible waste avoided uses valid historical Step 29 weight snapshots and approved conversions. Current conversion-policy changes do not rewrite historical weight.

## 20. Coverage

Coverage is metric specific. Quantity, serving, price, and weight gaps are counted and shown instead of being hidden or treated as zero.

## 21. Confidence

Confidence values are High, Moderate, Low, Mixed, and Unavailable. Mixed or estimated totals are never described as exact.

## 22. Corrections and Reversals

Impact snapshots are recalculated from effective events. Corrected or reversed source events do not remain in active totals.

## 23. Impact Snapshot

The derived snapshot stores user scope, period, metric contract version, attribution version, metrics, coverage, confidence, audits, source revisions, calculation time, and idempotency key.

## 24. Metric Audit

Every metric has included contributions, excluded contributions, double-count checks, and source revision metadata. Exclusions use structured reason codes.

## 25. User-Facing Definitions

Ingredients Used Before Priority Date counts distinct Pantry ingredient items confirmed used in time. Leftover Servings Reused counts confirmed later leftover servings. Estimated Money Saved is historical food value, not cash. Possible Food Waste Avoided is measured or estimated source-food mass. Food Protected for Later Use is current frozen available food.

## 26. No Causal Claims

Chef Nova uses cautious wording such as “Possible food waste avoided” and “Estimated historical food value.” It does not claim certain prevention, guaranteed savings, carbon savings, or public impact.

## 27. Stock Versus Flow Reporting

Protected frozen stock is evaluated as of the reference time. Confirmed-use, leftover, money, and waste-avoided metrics are period flows recognized on confirmed outcome dates.

## 28. Stale and Multi-Tab Protection

Snapshots include user scope, Pantry signature, Food Event History revision, priority policy version, rescue-window version, price revision, weight version, metric contract version, reporting period, reference time, and timezone.

## 29. User Isolation

Registered users use account-scoped Pantry and Food Event History. Guests use temporary session-backed records. Guest impact snapshots are not merged into accounts automatically.

## 30. Accessibility

Metric names are headings, definitions are visible text, coverage is visible, ranges remain associated with point estimates, currencies are explicit, exclusions use lists, and protected food is separated from rescued impact.

## 31. Print and Export

The snapshot supports later print/export of definitions, period, reference time, counts, quantities, ranges, currencies, confidence, coverage, exclusions, contract version, and calculation date. It does not export unknowns as zero.

## 32. Testing

Validation includes JavaScript syntax checks, JSON parsing, focused Step 33 static checks, prior Cook Before It Spoils static checks, and the full available static test sweep.

## 33. Deferred Work

Final dashboard layout, charts, gamification, public comparisons, environmental-impact calculations, carbon calculations, water-footprint calculations, public reporting, and richer export controls remain outside Step 33.
