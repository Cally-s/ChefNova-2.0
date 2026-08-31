# Budget Data Protection

Chef Nova protects Budget Rescue data with schema versions, user-specific storage, and non-destructive migrations.

## Storage Scope

Registered users store Budget Profile data under `chefNovaBudgetProfile_<userId>`. The stable account ID is the only account separator; display name and email are not used for storage keys.

Guests use `chefNovaGuestBudgetProfile` in `sessionStorage`. Guest budget data is temporary and is not copied into registered account storage automatically.

## Schema Versions

Budget Profile uses `BUDGET_PROFILE_SCHEMA_VERSION`.

Saved plan cost data uses `BUDGET_PLAN_SNAPSHOT_SCHEMA_VERSION`.

Saved plans keep the Step 19 `savedPlanMetadata` object as the source of truth. Step 20 adds versioned nested snapshots inside that metadata:

- `budgetSnapshot`
- `costSnapshot`
- `pricingSnapshot`
- `pantrySnapshot`

The older flat fields remain for compatibility.

## Budget Profile Format

Budget Profile documents use this shape:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "budgetProfile": {
    "weeklyBudgetCents": 10000,
    "currency": "CAD",
    "defaultPriceCushionPercent": 10,
    "preferredPriceSource": "chef-nova-estimate",
    "preferredPriceProfileId": null,
    "preferredStores": [],
    "usePlannedLeftovers": true,
    "updatedAt": "2026-08-10T00:00:00.000Z"
  }
}
```

Money is stored as integer cents or `null`. Missing money stays `null`; an empty string is not converted to zero.

Legacy examples:

- `weeklyBudget: 100` migrates to `weeklyBudgetCents: 10000`.
- `estimatedGroceryCost: 92.75` migrates to `estimatedGroceryCostCents: 9275`.
- Existing cent fields are not multiplied again.

## Migration Statuses

Budget migrations report one status:

- `current`
- `migrated`
- `not-needed`
- `invalid`
- `future-version`
- `failed`

Unversioned Budget data is treated as legacy version zero.

## Non-Destructive Rules

Migrations read the latest stored object, build a migrated copy, validate it, serialize it, and commit once. If validation or saving fails, Chef Nova keeps the previous stored data unchanged.

Protected data is not overwritten during Budget Profile migration:

- Pantry items
- Shopping List items, including purchased states and custom items
- Favorites
- allergies
- dietary preferences
- preferred and disliked foods
- household, appliances, cooking, and serving preferences
- meal calendar
- old plans
- price profiles
- authentication metadata
- unknown fields inside Budget documents

Unsupported future versions are not downgraded or overwritten.

A malformed Budget subtree is isolated. Chef Nova uses a safe empty profile in memory and does not overwrite the invalid raw data automatically.

## Older Saved Plans

Old standard plans without Budget Rescue data load as standard plans.

Older Budget Rescue or Emergency plans without saved cost data show:

`Cost estimate unavailable for this older saved plan.`

Users can select `Calculate Current Estimate`. Chef Nova then uses the current Cost Engine, Pantry allocation, Price Confidence, Budget Status, and Shopping List model without changing the saved historical plan or Pantry.

Current estimates are displayed separately. They are saved only when the user chooses `Save Current Estimate`.

If prices are missing, Chef Nova shows the known subtotal, the unpriced item count, and `Add Missing Prices`.

If no budget exists for the older plan, Chef Nova shows the estimate and offers `Set a Budget`.

If a saved recipe no longer has structured data, Chef Nova leaves the historical view intact and asks the user to choose a replacement.

If current allergies or preferences conflict with an older saved plan, Chef Nova warns the user and does not offer a "Use Anyway" action.
