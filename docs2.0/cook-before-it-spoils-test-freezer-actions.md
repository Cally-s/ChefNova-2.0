# Cook Before It Spoils Step 60: Freezer Action Tests

## 1. Purpose

These tests verify that Freeze Half is a quantity-preserving storage split. Freezing protects food for later use, but it is not permanent rescue, waste avoided, or money saved until later confirmed use qualifies under the impact contract.

## 2. Fixed Clock

- Reference date: August 15, 2026
- Time zone: America/Toronto
- Before freezing: `2026-08-15T17:00:00-04:00`
- Confirmed freezing time: `2026-08-15T18:00:00-04:00`
- Best-before date: August 16, 2026
- Opened date: August 13, 2026 at 6:00 PM

Tests must not depend on real time, CI timezone, implicit browser timezone conversion, or UTC parsing that shifts the local date.

## 3. Source Pantry Fixture

The source fixture is `freezer-test-spinach-package-1` for user `freezer-test-user`.

- Ingredient: `baby-spinach`
- Display name: Baby spinach
- Original package quantity: 300 g
- Current remaining quantity: 200 g
- Unit: g
- Storage: refrigerator
- Container: opened package
- Package state: opened
- Package fill state: partial
- Date type: best-before
- Date: `2026-08-16`
- Date confidence: confirmed
- Purchased at: `2026-08-12T15:00:00-04:00`
- Opened at: `2026-08-13T18:00:00-04:00`
- Active reserved quantity: 0
- Price paid: 4.50

Freeze Half must use the current remaining quantity: `200 g / 2 = 100 g`. It must not use the original 300 g package size.

## 4. Freezing Suitability

The test uses an approved guidance fixture for `baby-spinach`.

- Can freeze: true
- Preparation: Approved test guidance
- Texture change expected: true
- Recommended uses: soup, pasta, curry, smoothie
- Requires blanching: false
- Can cook from frozen: true
- Reviewed: true
- Review status: approved
- Guidance version: 1

The test also checks that production documentation requires reviewed guidance and does not create a test-only approval bypass.

## 5. Freeze Command

The command fixture is equivalent to `freeze-pantry-quantity` with request ID `freezer-test-request-1`, source item `freezer-test-spinach-package-1`, selection mode `half-of-current-remaining`, and frozen time `2026-08-15T18:00:00-04:00`.

The canonical mutation must re-read current quantity and revalidate the half amount. The client previewed 100 g is not trusted by itself.

## 6. State 1 - Initial Refrigerator Record

- Physical refrigerator quantity: 200 g
- Physical freezer quantity: 0 g
- Total physical quantity: 200 g
- Freezing events: 0
- Food permanently rescued: 0 g
- Food protected for later use: 0 g or unavailable

## 7. State 2 - Freeze Dialog Open

- Physical refrigerator quantity: 200 g
- Physical freezer quantity: 0 g
- Freezing events: 0
- Canonical state changes: 0

## 8. State 3 - Freeze-Half Preview

- Planned freezer transfer: 100 g
- Expected refrigerator remainder: 100 g
- Physical refrigerator quantity: 200 g
- Physical freezer quantity: 0 g
- Freezing events: 0

Freeze Half preview creates no freezing event. The displayed 100 g and 100 g values are preview only.

## 9. State 4 - Freeze Dialog Cancelled

- Physical refrigerator quantity: 200 g
- Physical freezer quantity: 0 g
- Freezing events: 0
- Reservations created: 0
- Protected-for-later-use entries: 0

## 10. State 5 - Freeze-Half Confirmed

- Refrigerator spinach: 100 g
- Freezer spinach: 100 g
- Total physical spinach: 200 g
- Confirmed freezing events: 1
- Food permanently rescued: 0 g
- Food waste avoided: 0 g
- Estimated money saved: $0.00 or no confirmed savings entry
- Food Protected for Later Use: 100 g only when the existing metric contract supports it

Required conservation equation: `200 g = 100 g + 100 g`.

## 11. State 6 - Application Reload

- Refrigerator spinach: 100 g
- Freezer spinach: 100 g
- Total physical spinach: 200 g
- Confirmed freezing events: 1
- Original refrigerator date information: preserved

## 12. State 7 - Frozen Spinach Later Consumed

When the freezer segment is later thawed, used, and confirmed consumed:

- Freezer quantity: 0 g
- Permanent qualifying rescued quantity: at most 100 g
- Food waste avoided: at most 100 g
- Deduplication: pass

Freezing and later consumption must not produce 200 g of rescue credit.

## 13. Refrigerator Result

The refrigerator record or child segment must keep:

- Quantity: 100 g
- Storage: refrigerator
- Date type: best-before
- Date: August 16, 2026
- Date confidence: confirmed
- Opened date: August 13, 2026 at 6:00 PM
- Original package quantity: 300 g
- Package quantity: 300 g
- Package unit: g
- Source package identity and history

No new date is invented. No storage timeline is restarted.

## 14. Freezer Result

The freezer segment must contain:

- ID: `freezer-test-spinach-segment-1`
- Quantity: 100 g
- Storage: freezer
- Physical status: frozen
- Frozen at: `2026-08-15T18:00:00-04:00`
- Source package or lot reference
- Source best-before date lineage
- Source opened date lineage
- Freezer guidance version: 1

The freezer segment must not claim a new official expiration date. Freezer quality reminder is not an expiration date.

## 15. Split Implementation Boundary

Either implementation is acceptable:

- Update the original refrigerator record to 100 g and create one 100 g freezer child.
- Retire the 200 g parent and create one 100 g refrigerator child plus one 100 g freezer child.

Behavioral invariants are required: no overlap, no duplicate quantity, no lost quantity, and original date history remains accessible.

## 16. Physical Event Boundary

These actions create no freezing event:

- Opening Freeze dialog
- Selecting Freeze Half
- Previewing the amount
- Editing optional reminder
- Opening freezer guidance
- Closing or cancelling the dialog
- Rendering Pantry or Freezer Inventory
- Recalculating priority, budget, or Shopping List

Only explicit confirmed physical freezing creates the current freezer event.

## 17. Atomic Transaction

The confirmed operation must re-read source revision, current quantity, reservations, safety eligibility, freezer guidance, storage state, and transferable amount before committing.

If any part cannot commit, refrigerator remains 200 g, freezer remains 0 g, and no event or provisional impact is created.

## 18. Idempotency

Retrying request `freezer-test-request-1` must keep:

- Refrigerator: 100 g
- Freezer: 100 g
- Confirmed freezing events: 1

No duplicate freezer quantity, event, or impact entry is allowed.

## 19. Multi-Tab

If two tabs freeze from the same 200 g source, one transaction succeeds and the stale tab detects the old source revision. It must not freeze another 100 g from the old preview.

## 20. Freeze Versus Use Conflict

If one tab freezes 100 g and another stale tab tries to use 150 g, the stale use is blocked or recalculated. The same physical quantity cannot be both frozen and used.

## 21. Active Reservations

With 200 g spinach and 120 g reserved, freely available quantity is 80 g. Freeze Half requesting 100 g is blocked or moved to review. No reservation is released automatically.

## 22. Same-Meal Reservation

If food was released from a cancelled meal, freezing must revalidate current quantity, safety, and guidance. The old reservation is not reused as a freezer allocation.

## 23. Partial Package

Original package size is 300 g. Current remaining is 200 g. Freeze Half uses 100 g, not 150 g. The refrigerator record must not reset to 300 g.

## 24. Multiple Packages

If Package 1 has 200 g and Package 2 has 150 g, freezing half of Package 1 changes only Package 1. Package 2 remains 150 g.

## 25. Unknown, Estimated, and Range Quantities

Unknown quantity cannot produce an exact half. Estimated quantities remain estimated. Range quantities split into ranges and do not collapse to exact values unless the user confirms a measured amount.

## 26. Safety and Ineligible Variants

Freeze Half is unavailable for true-expired food, uncertain storage, hard exclusions, or missing approved freezer guidance. Direct commands are rejected, no freezer segment is created, no event is created, and no Freeze Anyway action exists.

## 27. Impact Ledger Boundary

Immediately after freezing:

- Ingredient Rescued: 0 g
- Possible Food Waste Avoided: 0 g
- Estimated Money Saved: $0.00 or no confirmed entry
- Leftover Reused: 0 servings

Food Protected for Later Use may show 100 g only as a separate provisional protection metric under the existing contract.

Portion planning and No Leftovers choices must not create Food Protected for Later Use before physical freezing confirmation.

## 28. Commands

Run these checks:

```bash
node --check app.js
node --check rules.js
node --check tests/cook-before-it-spoils-step-60-freezer-actions.test.js
node tests/cook-before-it-spoils-step-60-freezer-actions.test.js
```
