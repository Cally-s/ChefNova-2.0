# Cook Before It Spoils Step 57 Report

## Goal

Complete Step 57 by adding automated and documented manual tests for Pantry reservation behavior.

## Scenario Covered

The required scenario uses 180 g spinach in the Pantry and one scheduled recipe that reserves 160 g spinach.

The tests confirm that other recipes see only the unreserved amount while the scheduled meal is active, and that the physical Pantry quantity remains 180 g until a cooked outcome is confirmed.

## Files Changed

- `tests/cook-before-it-spoils-step-57-pantry-reservations.test.js`
- `docs/cook-before-it-spoils-step-57-pantry-reservation-tests.md`
- `docs/cook-before-it-spoils-step-57-report.md`

## Automated Tests Added

The new Step 57 test validates:

- Available quantity is physical quantity minus active reservations.
- Reservation creation leaves physical Pantry quantity unchanged.
- Other recipes see only 20 g as available after a 160 g reservation.
- Opening the cancellation dialog does not release the reservation.
- Confirmed cancellation releases the reservation immediately.
- Confirmed cancellation does not change the 180 g physical Pantry quantity.
- Opening the cooking workflow does not deduct spinach.
- Confirmed cooking with 160 g reduces physical Pantry quantity from 180 g to 20 g.
- Actual quantities replace planned quantities when they differ.
- Reservation creation, release, and consumption are idempotent.
- No rescue-impact credit is created by reservation behavior.
- Reservation state remains isolated to the correct user, item, package, meal, and plan.

## Manual Tests Documented

Manual browser steps were added for the same state transitions, including cancellation dialog behavior, confirmed cancellation, cooking workflow startup, cooked completion, idempotency, and rescue-impact checks.

## Product Code

No product functionality was changed.

The implementation adds coverage around existing Pantry reservation behavior only.

## Validation

Validation should include:

```bash
node --check app.js
node --check rules.js
node --check tests/cook-before-it-spoils-step-57-pantry-reservations.test.js
node tests/cook-before-it-spoils-step-57-pantry-reservations.test.js
```

## Notes

Pantry reservations are planning holds. They reduce available quantity for other meals, but they do not change physical Pantry quantity until the user confirms the meal was cooked.
