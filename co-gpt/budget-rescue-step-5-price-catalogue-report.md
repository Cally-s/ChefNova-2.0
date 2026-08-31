# Budget Rescue Step 5 - Local Grocery Price Catalogue Report

## Goal

Add an editable local grocery-price catalogue for Budget Rescue without adding a backend, database, external API, scraper, recipe-cost engine, or budget totals.

## Files Inspected

- `app.js`
- `index.html`
- `style.css`
- `data/ingredients.json`
- `data/ingredients.js`
- `scripts/ingredient-data-shared.js`
- Existing `co-gpt` Budget Rescue reports

## Files Created

- `data/price-estimates-cad.json`
- `data/price-estimates-cad.js`
- `scripts/price-data-shared.js`
- `scripts/validate-price-data.js`
- `tests/price-data.test.js`
- `docs/price-catalogue.md`
- `docs/price-catalogue-report.md`
- `co-gpt/budget-rescue-step-5-price-catalogue-report.md`

## Files Changed

- `index.html`
- `app.js`
- `style.css`

## Existing Systems Reused

- Existing canonical ingredient catalogue
- Existing shopping list
- Existing Budget Rescue form
- Existing user-scoped localStorage abstraction
- Existing guest sessionStorage pattern
- Existing toast and modal patterns

## Price-Entry Schema

Each price entry uses:

- `id`
- `ingredientId`
- `storeProfileId`
- `sourceType`
- `priceBasis`
- `pricedQuantity`
- `pricedUnit`
- `regularPriceCents`
- `salePriceCents`
- `currency`
- `updatedAt`

Optional fields:

- `saleStartsOn`
- `saleEndsOn`
- `isPreferred`
- `notes`
- `createdAt`
- `updatedBy`

## Price-Profile Schema

Registered-user profile data uses:

```json
{
  "schemaVersion": 1,
  "profiles": []
}
```

Profiles are saved through existing account-scoped keys, so users do not share profile data.

## Money Storage

All prices are stored as integer cents in CAD. Form values convert from dollars to cents and format back with two decimal places.

## Package Versus Unit-Rate Behavior

Package prices display like:

```text
$3.49 per 900 g package
```

Unit-rate prices display like:

```text
$14.99/kg
```

## Built-In Estimate Catalogue Details

Chef Nova has one read-only built-in profile:

- ID: `generic-budget-store`
- Name: `Chef Nova Budget Store`
- Currency: `CAD`
- Reviewed date: `2026-08-10`

Built-in estimate labels state that prices are estimates and actual store prices may vary.

## Estimate Counts

- Built-in estimate entries: 23
- Canonical ingredients: 100
- Estimate coverage: 23%
- Missing estimate prices: 77
- Package-price entries: 15
- Unit-rate entries: 8
- Active sale entries: 0

## Source Resolution and Fallback Rules

The shared resolver checks the selected source first:

- Chef Nova estimates use the built-in profile.
- User-entered prices use current plan/session overrides.
- Store profiles use the selected registered-user profile.

If a selected user-entered or profile price is missing, Chef Nova may use a clearly labelled Chef Nova estimate fallback. Missing prices return `status: "missing"` and are never treated as zero.

## Grocery-List Price Editor

Shopping-list cards now show price status and an Update Price action. The editor supports:

- Regular price
- Optional sale price
- Package or unit-rate basis
- Priced quantity
- Unit
- Store profile selection
- Use for This Plan
- Save to Store Profile

Items without a canonical ingredient ID can use temporary prices but cannot be saved permanently to a profile.

## User-Entered Session Prices

Use for This Plan saves a user-entered override into the current Budget Rescue plan state. Guest overrides are stored temporarily in sessionStorage through existing guest state.

## Registered-User Profile Behavior

Registered users can create local profiles and save prices to them. Profile data is saved only in this browser for the current account.

## Guest Temporary-Price Behavior

Guests can use temporary prices during the current session. Guest prices are not written to registered-user localStorage keys.

## User-Scope Isolation

Price profiles use the existing `getUserStorageKey` user ID scoping. Logging out or switching accounts reloads the correct scope.

## Sale-Price Behavior

Sale prices are optional, must be greater than zero, and cannot exceed regular price. Expired sale prices are shown as expired and are not used as active prices.

## Missing-Price Behavior

Missing prices display as:

```text
Price not available
```

Chef Nova does not display `$0.00`, hide the item, or claim a plan is within budget.

## Accessibility Work

- Visible labels for editor fields
- Semantic radio group for package/unit-rate
- Text source labels
- Field-level error area
- Keyboard-close support with Escape
- Outside-click modal close
- Focus returns to the Update Price button

## Responsive Design Work

- Price profiles stack on small screens.
- Price editor fits the viewport and scrolls when needed.
- Editor buttons wrap cleanly.
- Shopping price summaries fit inside existing item cards.

## Storage Migration and Backward Compatibility

- Old Budget Rescue source values are normalized to the new constants.
- Missing profile IDs safely fall back to Chef Nova estimates.
- Invalid profile records are rejected without resetting unrelated app data.
- No existing Pantry, Meal Planner, Favorites, Notifications, or Shopping List keys were renamed.

## Tests Added

- `scripts/validate-price-data.js`
- `tests/price-data.test.js`

## Validation Results

Passed:

- `node scripts/validate-price-data.js`
- `node tests/price-data.test.js`
- `node --check app.js`
- `node --check scripts/price-data-shared.js`
- `node --check data/price-estimates-cad.js`
- JSON parse for `data/price-estimates-cad.json`

Also fixed one validation issue during implementation:

- `estimate-carrot-kg` referenced `carrot`; canonical ID is `carrots`.

Browser note:

- In-app browser smoke testing of `file:///Users/callysu/Downloads/Chef-Nova/index.html` was blocked by the browser URL policy. Direct-file support was checked through script order, syntax checks, and local data validation instead.

## Deferred

Deferred to later steps:

- Recipe-cost engine
- Weekly budget totals
- Budget optimization
- Cheaper substitutions
- Live grocery prices
- Retailer scraping or syncing

## Duplicate-System Check

No duplicate Ingredient Catalogue, Grocery List, Pantry, Meal Calendar, Save Plan workflow, Replace Meal workflow, user-storage system, price resolver, or price formatter was created.

## External-System Check

No backend, database, live grocery-price API, external API, retailer scraping, or unsupported price-accuracy claim was introduced.
