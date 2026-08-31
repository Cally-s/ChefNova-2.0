# Budget Rescue Accessibility and Mobile Support

Chef Nova Budget Rescue uses the existing Budget Rescue, Emergency Plan, Shopping List, and price editor interfaces with shared accessibility and mobile support. No separate accessible or mobile-only components were added.

## Shared Accessibility Primitives

- `announcePolite(message, options)` writes non-urgent updates to `#chef-nova-polite-status`.
- `announceAssertive(message, options)` writes urgent errors and warnings to `#chef-nova-urgent-status`.
- `announceStatus(message, type, options)` routes success and information messages politely, and warnings or errors assertively.
- `focusFirstInvalidField(root)` moves focus to the first invalid control inside a form or dialog.
- `getAccessibleCurrencyText`, `getAccessibleQuantityText`, `getAccessibleActionName`, and `getAccessiblePlanStatusText` provide reusable text helpers for future Budget Rescue updates.

Announcements are de-duplicated briefly so repeated recalculations or filter changes do not create noisy live-region output.

## Landmarks and Navigation

- A skip link moves keyboard users to `#main-content`.
- The main application has one `main` landmark with `id="main-content"` and a focus target.
- The primary navigation keeps an `aria-label`.
- Budget and shopping sections use headings, cards, fieldsets, legends, lists, and definition lists where the content needs structure.

## Budget Status

Budget status progress is exposed only when Chef Nova has a complete final grocery total. The progress bar uses:

- `role="progressbar"`
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- `aria-valuenow` capped at 100
- `aria-valuetext` that states the percentage used and whether the plan is over budget or has money remaining

Incomplete totals continue to show visible review messages instead of a final progress bar.

## Shopping List

Shopping List filters keep `aria-pressed`, item counts, and a concise live announcement after a filter changes. Item actions name the grocery item, such as “Remove milk” or “Update price for rice,” so repeated buttons are clear.

Purchase quantity fields name the ingredient and connect warnings with `aria-describedby` when a review message exists.

## Unknown Pantry Amounts

Unknown Pantry controls are fieldsets with radio choices. No choice is selected by default. The “I have some” quantity and unit fields are hidden until that radio option is selected, keeping inactive inputs out of the layout and tab order.

## Price Editor

The price editor dialog title names the ingredient being edited. Validation errors are visible, assertively announced, and focus moves to the invalid field. Closing the editor restores focus to the button that opened it.

## Mobile Support

Budget Rescue and Shopping List controls are responsive at common mobile and tablet widths. Action rows wrap or stack, touch targets are at least about 44px high, long item-specific labels wrap, and the page guards against horizontal overflow on small screens.

## User Preferences

- Reduced-motion mode shortens transitions and animations.
- Forced-colors mode preserves visible borders and active states.
- Print styles keep Budget Rescue cards readable and hide interactive controls that do not apply on paper.
