# Chef Nova Pantry Item Schema

## 1. Purpose

Cook Before It Spoils extends the existing Pantry item. Chef Nova still uses one Pantry, one Ingredient Catalogue, one Date Intelligence service, one Shopping List, and one Meal Planner.

## 2. Pantry Lot Semantics

One Pantry record represents one household-owned lot, package, container, or separately tracked quantity. Two items with the same ingredient stay separate when dates, storage, package state, form, price, or container differ.

## 3. Complete Record Structure

Current Pantry records use `schemaVersion: 2` and keep compatibility fields such as `id`, `name`, `ingredientId`, `quantity`, `unit`, `category`, `dateRecords`, `createdAt`, and `updatedAt`.

Version 2 also stores:

- `revision`
- `displayName`
- `identityStatus`
- `identity`
- `form`
- `quantityDetails`
- `storage`
- `preservation`
- `purchase`
- `lifecycle`
- `reservations`
- `metadata`
- `schemaWarnings`

## 4. Ingredient Identity

Resolved items store canonical `ingredientId`. Custom or unresolved labels remain visible with `identityStatus: "unresolved"` and do not receive fabricated ingredient IDs.

## 5. Ingredient Form

`form` is separate from storage. Supported values are `fresh`, `frozen`, `canned`, `dry`, `cooked`, `prepared`, `liquid`, `powder`, `other`, and `unknown`.

## 6. Quantities

`quantityDetails.currentQuantity` is the current believed amount. `quantityDetails.originalQuantity` is historical and may be `null`. `purchase.packageQuantity` describes the purchased package and is separate from both current and original quantity.

Reserved quantity is derived from active reservations. Available quantity is:

```text
max(0, current quantity - active reserved quantity)
```

## 7. Unknown Quantities

Unknown amounts use `quantityDetails.status: "unknown"` and `currentQuantity: null`. Unknown quantity is not converted to zero and is not supplied automatically to planning.

## 8. Storage Locations

Stored locations are `pantry`, `refrigerator`, `freezer`, `counter`, `cellar-cool-storage`, `other`, and `unknown`. The `other` location can include `storage.locationNote`.

## 9. Containers and Package State

Container and package state are separate. Containers include original package, airtight container, freezer bag, produce bag, jar, can, loose, other, and unknown. Package state includes unopened, opened, resealed, not applicable, and unknown.

## 10. Date Records

Step 3 `dateRecords` remain canonical. Chef Nova does not replace them with a singular date field.

## 11. Preservation State

Frozen and thawed are preservation states, not lifecycle statuses. `preservation` stores `state`, `frozenAt`, `thawedAt`, and `freezeThawCycleCount`.

## 12. Purchase Information

Historical price paid is optional and stored as integer cents in `purchase.pricePaidCents`. Missing price remains `null`. Current price catalogue estimates are not copied into Pantry purchase history.

## 13. Lifecycle State

Lifecycle status describes active or terminal record state only: `available`, `used`, `discarded`, `donated-shared`, or `unknown`.

## 14. Reservations

Reservations are stored in `reservations`. Active reservation amounts are derived and do not change lifecycle status. Unknown quantities cannot be reserved automatically.

## 15. Derived Display Statuses

`derivePantryDisplayStatuses()` can show Available, Reserved for a meal, Use soon, Frozen, Thawed, Used, Discarded, Donated or shared, and Unknown at the same time when applicable.

## 16. Integration

Date Intelligence supplies attention labels. Recipe matching, Pantry-first planning, Shopping List, and Budget Rescue consume active Pantry lots through `getActivePantryItems()`, which excludes terminal records, unknown quantities, zero available quantities, and passed confirmed expiration dates.

Prepared leftovers remain in the existing Meal Planner leftover metadata. Step 4 does not copy leftovers into Pantry.

## 17. Migration

Legacy fields are migrated conservatively:

- `quantity` -> `quantityDetails.currentQuantity`
- invalid or missing quantity -> unknown with `currentQuantity: null`
- `unit` -> `quantityDetails.unit`
- `originalQuantity` -> `quantityDetails.originalQuantity`
- `storageLocation` or `location` -> `storage.location`
- `storageContainer: "opened-package"` -> original package plus opened package state
- `pricePaid` -> `purchase.pricePaidCents`
- `packageQuantity` and `packageUnit` -> `purchase`
- legacy use-soon, reserved, frozen, or thawed status -> review evidence or the correct non-lifecycle dimension

Migration is idempotent and preserves item IDs, quantities, labels, date records, and unknown fields.

## 18. User Isolation

Registered users keep Pantry data in existing user-scoped storage. Guests keep upgraded Pantry records in temporary session storage.

## 19. Accessibility

The form uses visible labels, fieldsets, legends, text status labels, and date fieldsets from Step 3. Unknown amounts are shown as “Amount unknown,” not zero.

## 20. Responsive Design

Pantry form sections and lot details collapse from multi-column layouts to one column on mobile. Date records and status labels wrap.

## 21. Testing

Validation uses syntax checks, the existing Node test suite, ingredient validation, price validation, recipe JSON parsing, and `tests/cook-before-it-spoils-step-4-pantry-schema-static.test.js`.

## 22. Deferred Work

Step 4 does not add freezer recommendations, freezer transfers, transformation recipes, waste events, discard analytics, automatic Pantry reservations, or automatic Pantry deductions during plan preview or Save Plan.
