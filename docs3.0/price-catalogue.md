# Chef Nova Local Price Catalogue

## 1. Purpose

Chef Nova starts with local editable prices so Budget Rescue can prepare for future grocery-cost planning without using a backend, database, API, or retailer scraping.

## 2. Supported Price Sources

- Chef Nova estimates: read-only starter prices from `data/price-estimates-cad.json`.
- User-entered approximate prices: temporary plan prices entered from the grocery list.
- Saved store profiles: registered-user local price profiles saved in user-scoped localStorage.

## 3. Price-Entry Schema

Each entry includes `id`, `ingredientId`, `storeProfileId`, `sourceType`, `priceBasis`, `pricedQuantity`, `pricedUnit`, `regularPriceCents`, `salePriceCents`, `currency`, and `updatedAt`.

Optional fields include `saleStartsOn`, `saleEndsOn`, `isPreferred`, `notes`, `createdAt`, and `updatedBy`.

## 4. Package and Unit-Rate Prices

Package prices describe one package, such as `$3.49 per 900 g package`.

Unit-rate prices describe a rate, such as `$14.99/kg`.

## 5. Money Storage

Money is stored as integer cents in CAD. Chef Nova converts form dollars to cents and formats cents back to two-decimal currency text.

## 6. Source Resolution

Budget Rescue uses the selected source first. Store profiles and user-entered prices fall back to Chef Nova estimates only when the fallback is clearly labelled.

Missing prices return `status: "missing"` and are never treated as zero.

## 7. User Store Profiles

Registered users can create and delete local store profiles. Profiles are saved under the existing user-scoped storage system and do not sync to other devices.

Deleting a price profile does not delete pantry items, meal plans, or shopping list items.

## 8. Guest Pricing

Guests can enter temporary prices for the current session. Guest price data uses session state and is cleared when the guest session ends.

## 9. Estimate Labelling

Built-in estimates display as Chef Nova Budget Store estimates with their stored reviewed date. Chef Nova does not claim prices are live, verified, or retailer-provided.

## 10. Missing Prices

Unknown prices display as `Price not available`. They remain in the grocery list and can be given an approximate price.

## 11. Sale Prices

Sale prices are optional. They must be greater than zero and cannot exceed the regular price. Expired sale prices are shown as expired and are not selected.

## 12. Storage and Schema Versioning

Price profiles use `schemaVersion: 1`. Invalid or future-version profile data fails safely instead of resetting unrelated app data.

## 13. Adding or Updating Built-In Estimates

Update `data/price-estimates-cad.json` and `data/price-estimates-cad.js` together. Change estimate dates only when the estimate data is actually reviewed or changed.

## 14. Testing

Run:

```bash
node scripts/validate-price-data.js
node tests/price-data.test.js
node --check app.js
```

## 15. Deferred Capabilities

Live grocery prices, budget totals, recipe-cost calculations, store syncing, cheaper substitutions, and plan optimization are deferred to later steps.
