# Chef Nova Monthly Food-Rescue Impact Dashboard

## Goal

The Monthly Impact Dashboard shows confirmed food-rescue outcomes for one selected month.

It is a reporting view. It reads the effective Impact Ledger from Step 34 and supporting effective Waste Diary records. It does not create a second history, ledger, pantry, waste, freezer, or savings store.

## Read Model Boundary

Primary metric cards use Step 34 effective ledger balances:

- Ingredients Used Before Priority Date: effective metric-credit claims for `ingredients-used-before-priority-date`
- Leftovers Reused: effective metric-credit claims for `leftover-servings-reused`
- Estimated Money Saved: effective metric-credit claims for `estimated-money-saved`
- Possible Food Waste Avoided: effective metric-credit claims for `possible-food-waste-avoided`
- Food Protected for Later Use: protected-stock balance as of the selected reference time
- Freezing Actions: activity entries for `freezing-action`
- Completed Rescue Recipes: activity entries for `rescue-recipe-completed`

The dashboard may cache the current derived screen model in memory only. The source records remain Pantry, Food Event History, Waste Diary, and the effective Impact Ledger projection.

## Stock Versus Flow

Most cards are monthly flow metrics. They count confirmed outcomes whose reporting date falls inside the selected month.

Food Protected for Later Use is different. It is point-in-time stock:

- Current month: shows protected stock as of now.
- Completed month: shows protected stock as of the final moment of that month.

Protected food is not counted as used, saved money, or avoided waste until a final outcome is recorded.

## Leftover Reporting

Leftover reuse stays separate from later meal counts:

- Confirmed servings report how much leftover food was reused.
- Later meals report how many later meal records received those servings.
- Source leftover batches report how many original leftover batches contributed.

This prevents one transformed leftover from being presented as multiple full rescue outcomes.

## Discard Context

Discarded ingredients and discard reasons are context sections only. They read effective Waste Diary entries for the selected month.

They are not added to:

- Possible Food Waste Avoided
- Estimated Money Saved
- Ingredients Used Before Priority Date
- Leftovers Reused

This keeps rescue metrics positive-outcome based and avoids turning discard records into impact credits.

## Data Coverage

Each card shows coverage from metric audits or effective ledger entry counts. Coverage tells the user which source records were eligible and included.

Unknown weight, unknown price, and records needing review are not silently treated as zero. They appear as unavailable, partial, or review-required states.

## Month Selection

The dashboard supports:

- Previous month
- Current month
- Next month, blocked for future months
- A month picker limited to the current month or earlier

The selected month is kept in the `#impact?month=YYYY-MM` URL state.

## Accessibility

The dashboard uses headings, cards, details disclosures, native buttons, native month input, and tables with header cells.

The savings trend includes a visual bar and a readable table value. Print styles keep the report sections readable.

## Explicit Non-Goals

The dashboard does not add:

- Public comparisons
- Rankings against other users
- Badges, points, streak pressure, or shame language
- Carbon, water, or environmental conversions
- A combined impact score
- AI-generated impact values
- A new persistence key for dashboard metrics

