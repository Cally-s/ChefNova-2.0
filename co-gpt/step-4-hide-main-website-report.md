# Step 4 Implementation Report — Hide the Main Website at First

## Goal

Ensure Chef Nova shows only the Welcome Authentication page at startup unless a valid authenticated session already exists.

## Files Changed

- `index.html`
- `app.js`
- `style.css`

## Authentication Container

- The Welcome Authentication page remains the first top-level container:
  - `welcomeAuthPage`
- It is shown for logged-out users.
- It resets to the Log In tab whenever users return to authentication.

## Main Application Container

- The main Chef Nova application remains in:
  - `chefNovaApp`
- It now starts with:
  - `hidden`
  - `aria-hidden="true"`
  - existing `hidden` class
- This prevents the sidebar, navigation, dashboard, and app pages from appearing or receiving focus before authentication is checked.

## Startup Initialization Flow

Chef Nova now uses a single startup function:

```js
function initializeApp() {
    const currentUser = getCurrentUser();

    if (currentUser) {
        enterMainApp();
    } else {
        showAuthPage();
    }
}
```

The actual project version also handles errors, restores saved data for valid users, and returns invalid sessions to the Welcome page.

## Visibility Helper Functions

Added or updated:

- `initializeApp()`
- `showAuthPage()`
- `enterMainApp()`
- `hideMainApp()`
- `showNavigation()`
- `hideNavigation()`
- `showSidebar()`
- `hideSidebar()`
- `focusActivePageHeading()`

## Authenticated Session Handling

- A stored session must match a saved account before the app opens.
- Valid authenticated sessions skip the Welcome page.
- The main app opens to Home.
- Saved user data is restored.
- No automatic `Login successful.` toast appears during session restore.

## Guest Mode Handling

- Guest mode still enters the main app.
- Guest users open to Home.
- Navigation and sidebar appear after guest entry.
- Guest status remains visible.
- Guest save restrictions from previous steps are preserved.

## Logout Behavior

- Logout clears only the active authenticated session.
- Saved accounts remain intact.
- Main app is hidden.
- Navigation and sidebar are hidden.
- Welcome Authentication page returns with the Log In tab selected.

## Flash Prevention

- `chefNovaApp` is hidden directly in HTML before JavaScript runs.
- CSS also enforces hidden top-level containers:
  - `.welcome-auth-page[hidden]`
  - `.app-shell[hidden]`
- JavaScript switches visibility only after session state is checked.

## Accessibility Improvements

- Only one top-level container is visible at a time.
- Hidden containers use `hidden`, `aria-hidden`, and the existing hidden class.
- Navigation and sidebar are hidden while authentication is visible.
- Focus moves to the Welcome heading when returning to auth.
- Focus moves to the active page heading when entering the main app.

## User Guide Update

- Updated the existing Getting Started section to explain:
  - When Chef Nova opens, only the Welcome page is shown.
  - The main application becomes available after logging in, creating an account, or continuing as a guest.
  - Returning users with an active session skip the Welcome page automatically.

## Tests Run

- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8')); console.log('recipes.json valid')"`

## Required Note

When Chef Nova starts, only the Welcome Authentication page is shown unless a valid authenticated session already exists.

## Risks or Remaining Notes

- Browser automation could not inspect the local `file://` page because the in-app browser blocked automation access to that URL in the previous verification attempt. No workaround was attempted.
- Existing account storage, recipes, rules, and data files were not modified.
- Existing app features were preserved.
- No Git commit was created.
