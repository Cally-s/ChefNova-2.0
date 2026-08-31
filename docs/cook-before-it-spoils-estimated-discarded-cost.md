# Chef Nova Estimated Discarded Cost

Step 28 adds an estimated cost snapshot to Respectful Waste Diary entries.

## Goal

Chef Nova estimates the value of discarded food using the existing Budget Rescue price data and Cost Engine.

Missing prices stay unavailable. Chef Nova never treats an unknown price as $0.

## Calculation

For package-based prices:

```text
costPerCanonicalUnit = packagePrice / normalizedPackageQuantity
estimatedDiscardedCost = discardedCanonicalQuantity * costPerCanonicalUnit
```

Example:

```text
packagePrice = $4.50
normalizedPackageQuantity = 300 g
discardedCanonicalQuantity = 120 g
estimatedDiscardedCost = $1.80
```

Cost is rounded only after the final multiplication.

## Shared Systems

The feature reuses:

- Budget Rescue Price Catalogue
- Price Resolver
- Cost Calculation Engine
- Pantry-linked discard snapshots
- Food Event History
- Waste Diary projection
- Waste Dashboard projection

No new price catalogue, cost engine, pantry, or waste value store was created.

## Confidence Labels

Visible price confidence labels are:

- Confirmed price
- User-entered estimate
- Saved store estimate
- Chef Nova estimate
- Price unavailable

Each estimate also stores quantity confidence from the discarded amount workflow.

## Range Estimates

Approximate amounts store minimum, point, and maximum cost estimates when quantity ranges are available.

Example:

```text
54-66 g, point 60 g
$4.50 per 300 g
range: $0.81-$0.99
point: $0.90
```

## Missing Price

When Chef Nova cannot resolve a price, the diary shows:

```text
Cost estimate unavailable
```

The entry still records amount, reason, source, and date. The dashboard counts the entry as unpriced.

## Add Approximate Price

Users can enrich an existing Waste Diary entry with:

- Price paid for full package
- Approximate current package price
- Estimated discarded portion value
- Package quantity and unit
- Optional store
- Optional price date

This creates a correction/enrichment event. It does not change Pantry and does not create a new discarded-food event.

## Historical Snapshots

Each discard record stores the resolved cost estimate and source snapshot. Future catalogue changes do not rewrite historical Waste Diary entries.
