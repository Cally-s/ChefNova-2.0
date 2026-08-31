# Cook Before It Spoils Step 55: Priority Ordering and Date-Type Presentation Tests

## Purpose

These tests verify that Cook Before It Spoils ranks priority recommendations in the correct order and shows the correct date type for each item.

The key rule is that Chef Nova must not present a Use-Soon Estimate as a best-before date or expiration date.

## Required Scenario

- Spinach — best before tomorrow
- Mushrooms — estimated 2 days remaining
- Yogurt — best before in 3 days

Expected order:

1. Spinach
2. Mushrooms
3. Yogurt

Expected date labels:

- Spinach: Best before tomorrow
- Mushrooms: Use soon — approximately 2 days remaining
- Yogurt: Best before in 3 days

## Automated Static Regression

Run:

```bash
node tests/cook-before-it-spoils-step-55-priority-date-ordering-static.test.js
```

The automated test checks:

- The priority engine keeps official package date type and Use-Soon Estimate type separate.
- Use-Soon Estimates use `use-soon-planning-estimate` confidence.
- Priority sorting remains deterministic.
- The required Spinach, Mushrooms, Yogurt scenario sorts in the expected order.
- Date labels distinguish best-before wording from estimated freshness wording.

## Manual Browser Test

Open `/Users/callysu/Downloads/Chef-Nova/index.html` directly in a browser.

Use an account or guest mode. If using guest mode, remember that test Pantry data is temporary.

## Manual Setup

Create or update three Pantry items:

1. Spinach
   - Date type: Best before
   - Date value: tomorrow
   - Quantity: any positive amount
   - Storage: Refrigerator
   - Status: Available

2. Mushrooms
   - Do not enter a package date
   - Use fresh mushrooms
   - Storage: Refrigerator
   - Quantity: any positive amount
   - Add enough reviewed storage or purchase/opened evidence for Chef Nova to show a Use-Soon Estimate with about 2 days remaining

3. Yogurt
   - Date type: Best before
   - Date value: 3 days from today
   - Quantity: any positive amount
   - Storage: Refrigerator
   - Status: Available

## Manual Verification

Open the Cook Before It Spoils or Use These First view.

Verify:

- Only eligible items appear in the Use These First group.
- Spinach appears before Mushrooms.
- Mushrooms appears before Yogurt.
- Spinach shows `Best before tomorrow`.
- Mushrooms shows `Use soon — approximately 2 days remaining`.
- Yogurt shows `Best before in 3 days`.
- Mushrooms does not show `Best before`.
- Mushrooms does not show `Recorded expiration date`.
- Spinach and Yogurt do not show `Use soon — approximately`.
- No item is marked `The recorded expiration date has passed`.
- Date type review is not required for the supported Use-Soon Estimate.

## Pass Criteria

The scenario passes when the visible recommendation order is:

1. Spinach — Best before tomorrow
2. Mushrooms — Use soon — approximately 2 days remaining
3. Yogurt — Best before in 3 days

The scenario fails if:

- Mushrooms is labeled as a best-before date.
- Mushrooms is labeled as an expiration date.
- Yogurt appears before Mushrooms when the same scoring group and comparable scores apply.
- Any item is blocked by date-type confirmation when its date type is already known or its Use-Soon Estimate is supported.

## Notes

The exact calendar dates change based on the day the test runs. Use relative dates from the current local date.

If the UI cannot create a 2-day mushroom estimate from normal form input, use this manual test as a documented exploratory case and keep the automated static regression as the required repeatable check.
