# Chef Nova Impact Ledger

## 1. Purpose

The Impact Ledger is an immutable accounting projection for Food-Rescue Impact. It prevents the same physical food, weight, serving, or monetary value from being counted more than once.

## 2. Existing Systems Reused

The ledger reuses Pantry, Food Event History, effective events, physical lineage, Step 33 metric contracts, prices, weights, meals, leftovers, freezer state, corrections, reversals, guest storage, and account-scoped user storage.

## 3. Ledger Versus Source Events

The ledger is not a second Food Event History. Canonical Pantry and Food Event History records describe what happened; the ledger derives auditable accounting entries from those records.

## 4. Physical Food Segments

A physical segment identifies one exact food quantity for one outcome path. When a source splits, each child segment must preserve source identity, source quantity, lineage, weight basis, and cost basis.

## 5. Quantity Conservation

Child segment quantities must not exceed parent quantities. Unknown, negative, unsupported, or conflicting quantities become exclusions or review records instead of zero-value credits.

## 6. Cost-Basis Conservation

Historical value is allocated proportionally. A child segment receives only its share of the parent cost basis, and every currency remains separate.

## 7. Entry Classes

Entry classes are Activity, Metric Credit, Stock Movement, Adjustment, and Reversal. Activities count actions; metric credits count Step 33 impact; stock movements reconstruct protected food.

## 8. Operation Types

Operation types are Posting, Replacement, Reversal, and Adjustment. Replacements and reversals append new entries and preserve the older row for audit.

## 9. Posting Statuses

Posting statuses are Effective, Provisional, Superseded, Reversed, Review Required, and Invalid. Public totals use current effective recognized entries, not superseded or reversed entries.

## 10. Logical Claim Keys

Logical claim keys identify the conceptual claim across corrections. They use stable metric, activity, physical-segment, source-item, serving-segment, currency, or event identity, not mutable quantity text.

## 11. Deduplication Keys

Deduplication keys identify one posting revision. They include logical claim key, source event identity, source revision, operation type, and ledger policy version.

## 12. Activities

Freezing, rescue recipe completion, leftover transformation, leftover meal completion, donation or sharing, and thawing are activities. Activity counts never become weight, serving, or money totals.

## 13. Ingredients Used Before Priority

This metric posts one count claim per source Pantry item. Several qualifying uses from the same lot keep one item-count claim while quantity summaries may aggregate.

## 14. Leftover Servings Reused

Leftover serving credits require confirmed later consumption or transformation. Planned meals, reservations, and technical records do not create serving credits.

## 15. Estimated Money Saved

Money saved posts one credit per physical segment and currency. It uses historical cost snapshots, proportional quantity, and price confidence; missing prices remain unavailable.

## 16. Possible Food Waste Avoided

Possible food waste avoided posts one mass credit per physical segment. It uses source-food weight, not the finished recipe weight, and unknown weight is never treated as 0 g.

## 17. Food Protected for Later Use

Protected food uses stock movements. Freezing creates a protected-stock inflow; later use, sharing, or discard creates an outflow. As-of balances are reconstructed from movements.

## 18. Freeze-Recipe-Consumption Example

For 160 g spinach frozen, added to soup, and consumed, the ledger may count one freezing action, one completed rescue recipe, 160 g possible food waste avoided, and the applicable proportional historical value once. Protected stock ends at 0 g.

## 19. Provisional Recognition

Provisional entries preserve audit history while downstream outcome is unresolved. They are not summed with final recognized entries.

## 20. Downstream Discard

If a credited segment is later discarded, the ledger posts a replacement or reversal. Activity history remains, but positive waste-avoided and household money-saved credits are removed or reduced.

## 21. Transformations

Recipe and leftover transformations preserve source segment identity, source quantity, source weight, source value, prepared-batch ID, recipe ID, and target meal ID.

## 22. Leftover Lineage

A source ingredient may receive mass and value credit once. A later leftover serving may separately count as a serving metric without re-crediting the source ingredient mass or value.

## 23. Donation and Sharing

Donation and sharing may count as possible waste avoided when Step 33 qualifies the physical segment. They never count as household estimated money saved.

## 24. Corrections

Corrections append replacement entries. The original row remains in claim history, and the effective selector chooses the corrected current amount.

## 25. Reversals

Reversal entries cancel previous effective claims without deleting the original posting. Retrying the same reversal remains idempotent.

## 26. Effective Ledger Selector

The selector groups entries by logical claim key, validates user scope, follows replacement and reversal records, excludes invalid and stale entries, preserves review-required rows, and returns one current result per claim.

## 27. Metric Balances

Metric balances are calculated through shared ledger APIs. UI components do not independently add weight, servings, money, or item counts.

## 28. Protected Stock

Protected stock is a point-in-time balance. A 160 g frozen segment held for ten days remains 160 g, not 1,600 g.

## 29. Activity Counts

Activity counts are period-flow counts. One freezing action and one rescue recipe can be shown beside one final physical food credit without double counting.

## 30. Audit Views

Audit views show entry class, metric or activity, occurrence date, effective status, quantity or count, confidence, outcome, replacement or reversal status, current effective claim, protected stock, segment history, and claim history.

## 31. Historical Price Snapshots

Ledger entries preserve historical price basis, currency, confidence, source, Cost Engine version, and calculation date. Current catalogue changes do not rewrite ledger values.

## 32. Historical Weight Snapshots

Ledger entries preserve weight confidence, min/point/max mass, conversion basis, Unit Registry version, and calculation date. Current conversion changes do not rewrite history.

## 33. Period and Recognition Dates

Period-flow entries belong to the period containing the recognized physical outcome date. Corrections keep the original occurrence date for the corrected effective amount.

## 34. Idempotency

Ledger build and posting keys include user scope, source revision, operation type, and ledger policy version. Reprocessing cannot duplicate entries or balances.

## 35. Multi-Tab Protection

Ledger builds include source revisions and user scope. Stale results are rebuilt instead of publishing conflicting balances.

## 36. User Isolation

Registered users see only their own derived ledger and source records. Guest ledger projections derive from temporary guest records and are not merged into accounts automatically.

## 37. Accessibility

The audit view uses visible headings, labelled statuses, semantic history lists, keyboard-accessible details, text statuses, wrapping claim text, forced-color support, and concise live-region updates.

## 38. Print and Export

Print output distinguishes current effective values from historical, superseded, reversed, and review-required rows. It does not print unknown weight as 0 g or missing price as $0.

## 39. Testing

Validation includes JavaScript syntax checks, JSON parsing, data validators, focused Step 34 static checks, Step 33 metric-contract checks, and the available repository test suite.

## 40. Deferred Work

Final charts, gamification, public comparisons, environmental-impact calculations, carbon calculations, water-footprint calculations, public leaderboards, and combined impact scoring remain outside Step 34.
