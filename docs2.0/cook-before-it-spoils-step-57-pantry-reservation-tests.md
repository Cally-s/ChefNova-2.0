# Cook Before It Spoils Step 57: Pantry Reservation Behavior Tests

## Goal

Validate that Pantry reservations reduce available quantity for planning without changing physical Pantry quantity until a cooked outcome is confirmed.

## Required Scenario

The Pantry contains 180 g spinach.

One scheduled recipe reserves 160 g spinach.

## Required State Transitions

### STATE 1 - Before the meal is saved

Physical spinach: 180 g

Active reservations: 0 g

Available for new meals: 180 g

### STATE 2 - After the meal is saved and reserves spinach

Physical spinach: 180 g

Active reservations: 160 g

Available for new meals: 20 g

Other recipes see only 20 g as unreserved and available.

### STATE 3 - Cancellation dialog opened

Opening a cancellation dialog does not release the reservation.

Physical spinach remains 180 g.

Active reservations remain 160 g until the user confirms cancellation.

Available for new meals remains 20 g.

### STATE 4 - Meal cancellation confirmed

Confirming the meal cancellation releases the 160 g reservation immediately.

Physical spinach remains 180 g.

Active reservations become 0 g.

Available for new meals returns to 180 g unless another reservation or exclusion applies.

### STATE 5 - Cooking workflow opened or started

Starting or opening the cooking workflow does not deduct the spinach.

Physical spinach remains 180 g.

Active reservations remain 160 g.

Available for new meals remains 20 g.

### STATE 6 - Cooked outcome confirmed

Confirming that the meal was cooked using 160 g reduces the physical Pantry quantity from 180 g to 20 g.

Active reservations become 0 g after the reservation is consumed.

Available for new meals is 20 g.

### STATE 7 - Actual quantity differs from planned quantity

Actual quantities replace planned quantities when they differ.

If the planned reservation was 160 g but the confirmed actual use is 150 g, the physical spinach quantity changes from 180 g to 30 g.

## Automated Coverage

Run:

```bash
node tests/cook-before-it-spoils-step-57-pantry-reservations.test.js
```

The automated test validates:

- Reservation creation uses unreserved availability.
- Physical Pantry quantity stays unchanged while a meal is only scheduled or reserved.
- Cancellation dialogs do not release reservations.
- Confirmed cancellations release reservations without adding quantity back.
- Cooking workflow startup does not deduct quantity.
- Confirmed cooking deducts actual used quantity.
- Repeating reservation, cancellation, and cooking actions remains deterministic and idempotent.
- No rescue-impact credit is created by reservation tests.
- Reservation state stays isolated to the correct user, item, package, meal, and plan.

## Manual Browser Check

1. Create or use a test user.
2. Add one Pantry item: Spinach, 180 g.
3. Schedule one recipe that reserves 160 g spinach.
4. Confirm that other recipe suggestions see only 20 g available.
5. Open the meal cancellation dialog, then close it without confirming.
6. Confirm that 160 g remains reserved and physical Pantry quantity remains 180 g.
7. Open the cancellation dialog again and confirm cancellation.
8. Confirm that available spinach returns to 180 g and physical Pantry quantity remains 180 g.
9. Schedule the recipe again.
10. Open the cooking workflow without confirming completion.
11. Confirm that physical Pantry quantity remains 180 g.
12. Confirm the meal was cooked using 160 g spinach.
13. Confirm that physical Pantry quantity becomes 20 g.
14. Repeat the completion action if the UI permits it and confirm no second deduction occurs.
15. Confirm no rescue-impact credit appears for reservation creation, release, or test-only transitions.

## Notes

These tests focus on reservation behavior only. They do not award rescue-impact credit because reserving, releasing, or testing a reservation does not prove food was rescued from waste.
