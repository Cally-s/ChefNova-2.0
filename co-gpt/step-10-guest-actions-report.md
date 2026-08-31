# Step 10 Implementation Report — Handle Guest Actions

## Goal

Add an Account Required popup when guests attempt actions that require a registered account for permanent saving, while still allowing guests to continue exploring Chef Nova.

## Files Changed

- `index.html`
- `app.js`
- `style.css`

## Account Required Modal

Added one reusable Account Required modal with:

- accessible dialog markup
- `aria-modal="true"`
- `aria-labelledby="accountRequiredTitle"`
- `aria-describedby="accountRequiredMessage"`
- close button
- Sign Up button
- Log In button
- Continue as Guest button

The exact popup title is:

`Create an account to save your progress.`

## requireAccount() Helper

Implemented the required reusable helper:

```js
function requireAccount(actionName) {
  if (!getCurrentUser()) {
    showAccountRequiredModal(actionName);
    return false;
  }

  return true;
}
```

Registered users pass this helper immediately and do not see the popup.

## showAccountRequiredModal()

Added `showAccountRequiredModal(actionName)` to:

- customize the popup message by action
- open the modal
- set `aria-hidden="false"`
- prevent background scrolling
- disable supported background interaction with `inert`
- focus the Sign Up button by default

Example message behavior:

- `requireAccount("save your favorites")`
- `requireAccount("save your meal plan")`
- `requireAccount("save nutrition history")`

## hideAccountRequiredModal()

Added `hideAccountRequiredModal()` to:

- close the modal
- restore `aria-hidden`
- restore page scrolling
- re-enable background interaction
- restore focus to the control that opened the popup

## Protected Actions

The following permanent-save actions now use `requireAccount()`:

- Favorites
- Pantry save
- Pantry remove
- Meal Planner save
- Meal Planner clear
- Meal Planner delete
- Shopping List save from missing recipe ingredients
- Nutrition History `Save This Week`
- Profile edit
- Password/profile save actions

## Guest Workflow

When a guest clicks a protected save action:

1. Chef Nova opens the Account Required popup.
2. The blocked save does not run.
3. No localStorage save occurs.
4. The guest can choose Sign Up, Log In, or Continue as Guest.

## Sign Up Flow

When the guest clicks `Sign Up`:

- the popup closes
- the main app is hidden
- the Welcome Authentication page opens
- the Sign Up tab is selected
- the first Sign Up field is focused

## Log In Flow

When the guest clicks `Log In`:

- the popup closes
- the main app is hidden
- the Welcome Authentication page opens
- the Log In tab is selected
- the email field is focused

## Continue as Guest Flow

When the guest clicks `Continue as Guest`:

- the popup closes
- the guest remains on the current page
- the blocked save does not run
- existing temporary guest data is not cleared

## Accessibility Updates

- The popup uses dialog semantics.
- Focus moves to Sign Up when opened.
- Tab cycles through:
  - Sign Up
  - Log In
  - Continue as Guest
- Escape closes the popup.
- Focus returns to the triggering control when the popup closes.
- The popup message is connected with `aria-describedby`.

## Responsive Design

- The modal uses the existing Chef Nova rounded card style.
- The modal fits mobile widths.
- Buttons stack on small screens.
- No horizontal scrolling is introduced.

## User Guide Update

Updated the existing Guest Mode section to explain:

- guests see an Account Required popup when attempting permanent saves
- popup buttons are Sign Up, Log In, and Continue as Guest
- Continue as Guest closes the popup and lets guests keep exploring without saving permanently

## Tests Run

- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8')); console.log('recipes.json valid')"`

## Risks or Remaining Notes

- Browser automation was not used because prior local `file://` browser inspection from the in-app browser was blocked.
- The popup is intentionally only for permanent-save actions. Guests can still search, filter, read recipes, read rules, view instructions, and view weekly nutrition.
- No Git commit was created.
