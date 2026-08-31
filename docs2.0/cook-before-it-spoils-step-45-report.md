# Cook Before It Spoils Step 45 Report

## Goal

Step 45 simplifies Pantry and food-rescue item actions for mobile users. Eligible item cards now expose a small primary action set and move secondary workflows into a More panel.

## Files Changed

- `app.js`
- `style.css`
- `tests/cook-before-it-spoils-step-45-mobile-item-actions-static.test.js`
- `docs/cook-before-it-spoils-step-45-report.md`

## Implementation Summary

- Added controlled food-item action IDs for Plan, View Meal, Freeze, Review Details, Review, Edit Quantity, Change Date, Mark Used, Record Discarded Food, Move to Another Storage Location, Dismiss This Reminder, and More.
- Added controlled action availability states for available, hidden, review-required, blocked-by-safety, blocked-by-reservation, blocked-by-quantity, not-applicable, and stale.
- Added a shared derived action presentation model through `resolveFoodItemActionPresentation()`.
- Updated Use These First ranked cards and panel cards to render actions from the shared model.
- Visible primary actions are capped at three.
- Default eligible items resolve to Plan, Freeze, and More when those actions are valid.
- Review-required and safety-excluded items replace planning actions with review actions.
- Fully reserved items replace Plan with View Meal.
- Frozen items hide Freeze and continue to use the same shared eligibility model.

## More Panel

- More panel uses the existing modal shell.
- The More button is a semantic button with dialog attributes.
- The panel is headed with the item name.
- Secondary actions are grouped into Item Details, Item Outcome, and Reminder.
- Record Discarded Food remains separated from general item-detail actions.
- Close is visible.
- Escape and backdrop close behavior remain handled by the existing modal listener.
- Focus returns to the More button when the panel closes without changing the item.

## Workflow Boundaries

- Plan, Freeze, and More do not create physical outcomes by opening.
- More does not edit Pantry records, create reservations, create food events, or create impact records.
- Freeze opens the existing Freeze Options workflow.
- Record Discarded Food opens the existing Waste Diary workflow.
- Edit Quantity, Change Date, and Move Storage route to existing Pantry review tools.
- Mark Used routes to the existing leftover outcome review when the source is a prepared leftover, or to the daily tracker review path for pantry ingredients.
- Dismiss This Reminder changes notification state only when an active reminder exists.
- No separate mobile action system was created.

## Accessibility

- Every essential action is a visible keyboard-accessible button.
- Primary action groups include an accessible item-specific group label.
- Card-visible labels stay short while accessible names include item context.
- Buttons keep at least a 44 CSS pixel touch target.
- The More panel avoids menu roles and uses ordinary dialog buttons.
- No drag, swipe, hover, long-press, or unlabeled gesture is required.

## Responsive Behavior

- Desktop action rows use up to three equal columns.
- Mobile action rows wrap into two columns, with the final odd action spanning the row.
- The More modal behaves as a full-width bottom sheet on narrow screens.
- Safe-area padding is respected on mobile.
- Buttons do not shrink below the target size.

## Validation Performed

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- `node tests/cook-before-it-spoils-step-45-mobile-item-actions-static.test.js`
- Related Cook Before It Spoils static checks were rerun.

## Risks and Notes

- Base Pantry management cards still show their existing Pantry management controls. Step 45 was applied to the Cook Before It Spoils Use These First item cards and panel entries where mobile action crowding existed.
- The shared model is derived from existing safety, priority, freezer, reservation, Pantry, notification, and leftover selectors. It does not make independent safety or impact decisions.
