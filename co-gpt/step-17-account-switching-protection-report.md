# Step 17 — Account Switching Protection Implementation Report

## Goal

Prevent one Chef Nova user’s personal information from briefly appearing when logging out, logging in as another user, switching between guest and registered modes, or restoring a different session.

## Files Changed

- `app.js`
- `style.css`
- `co-gpt/step-17-account-switching-protection-report.md`

## Required Function

```js
function clearCurrentPageData() {
  // Clear displayed user-specific content
}
```

## `clearCurrentPageData()`

Added `clearCurrentPageData()` as the central UI and memory reset function.

It clears displayed personal content before Chef Nova loads another user’s storage keys.

Chef Nova clears displayed personal content before loading another user’s storage keys, preventing the previous account’s information from briefly appearing.

## Rendered Favorites Clearing

Added `clearRenderedFavorites()` to clear:

- Favorites page results
- Recipe Finder favorites area

It does not delete saved favorite recipe IDs from localStorage.

## Rendered Pantry Clearing

Added `clearRenderedPantry()` to clear:

- Pantry summary
- Pantry item list
- Pantry recipe suggestions
- Pantry form values

It does not write an empty pantry to storage.

## Meal Planner Clearing

Added `clearRenderedMealPlanner()` to clear:

- Visible meal planner content
- Active meal day state back to Monday

It does not overwrite the saved meal plan.

## Shopping List Clearing

Added `clearRenderedShoppingList()` to clear the visible Shopping List content.

It does not delete registered or guest shopping-list storage.

## Weekly Nutrition Clearing

Added `clearRenderedWeeklyNutrition()` to clear weekly nutrition totals, ratings, recommendations, daily breakdown, and saved-history display from the screen before another mode loads.

## Nutrition History Clearing

Added `clearRenderedNutritionHistory()` to clear rendered saved weekly summary cards from the current screen.

Stored nutrition history remains saved.

## Cooking History Clearing

Added `clearRenderedCookingHistory()` as a safe clear hook for cooking-history UI if the page/section is present.

Saved cooking history is not deleted.

## Profile Clearing

Added `clearRenderedProfile()` to clear:

- Profile panel content
- Profile edit form values
- Password change form values
- Profile editing state
- Password editing state

Blank profile values are not saved during clearing.

## Dashboard Reset

Added dashboard clearing for:

- Dashboard stats
- Account topbar area
- Navigation account-status text
- Mobile sidebar open state
- Previous welcome name
- Guest dashboard message
- Guest dashboard actions

## In-Memory Reset

`clearCurrentPageData()` resets in-memory personal state:

- `state.currentUser`
- `state.profileMenuOpen`
- `state.favorites`
- `state.pantry`
- `state.mealPlans`
- temporary guest in-memory data

It does not delete localStorage or sessionStorage keys.

## Account-Switch Order

Updated the app entry flow so switching now follows this order:

1. Begin account switch.
2. Close dialogs.
3. Clear current displayed personal content.
4. Set the active mode or user in memory.
5. Load the correct registered or guest data.
6. Render the new mode.
7. Update navigation and dashboard welcome.
8. End account switch.

Startup rendering was also changed so Chef Nova no longer renders personal sections before session resolution finishes.

## User-Specific Reload

Registered data still reloads through the existing user-specific storage helpers after the active `chefNovaCurrentUser` session is set.

No cached user-specific storage key was introduced.

## Guest-to-User Protection

When a guest logs in or creates an account:

- Guest page content is cleared first.
- Guest mode is removed.
- The registered session is set.
- Registered-user storage is loaded.
- Guest data is not merged into the account.

## User-to-Guest Protection

When a registered user logs out and then continues as guest:

- Registered content is cleared first.
- `chefNovaCurrentUser` is removed.
- Guest mode is started.
- Guest sessionStorage data is loaded.
- The previous registered user’s Pantry, Favorites, Profile, and Meal Planner do not remain visible.

## Autosave Protection

Added `isSwitchingAccount`.

While account switching is active:

- `saveUserData()` returns without writing.
- `persistGuestProgress()` returns without writing.

This prevents form clearing or temporary empty in-memory state from overwriting saved progress.

## Asynchronous Protection

No additional asynchronous user-specific fetch flow was added.

Chef Nova’s user-specific data loads synchronously from localStorage/sessionStorage. The account-switching guard prevents writes during protected rendering.

## Accessibility

Added account-switching busy state:

- `.main-content` receives `aria-busy="true"` during switching.
- The busy state is removed after the new mode renders.
- Open dialogs are closed before content is cleared.
- Mobile navigation is closed while switching.
- Focus still moves to the dashboard heading after app entry or the Log In email field after logout/guest exit.

## Responsive Behavior

Added a lightweight `body.user-data-loading` state.

The mobile sidebar is closed during clearing, preventing old account names or content from remaining behind the drawer.

## User Guide Update

Updated the existing Account guide section with “Account switching protection.”

It explains that Chef Nova clears visible:

- Favorites
- Pantry
- Meal Planner
- Shopping List
- Weekly Nutrition
- Nutrition History
- Cooking History
- Profile
- dashboard counts

It also explains that saved progress is not deleted and the new account is loaded with that account’s user-specific storage keys.

## Tests Run

Passed:

```bash
node --check app.js
node --check rules.js
node --check data/recipes.js
node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8'))"
```

Additional static checks confirmed:

- `clearCurrentPageData()` exists with the required comment.
- All rendered clear helpers exist.
- `beginAccountSwitch()` and `endAccountSwitch()` exist.
- `isSwitchingAccount` prevents storage writes during switching.
- The User Guide includes account switching protection.

## Risks or Remaining Notes

- Browser automation was not used because local `file://` app automation was previously blocked by the in-app browser security policy.
- The protection clears displayed UI and in-memory state only; it intentionally does not delete registered localStorage progress or guest sessionStorage unless a calling flow explicitly removes those session keys.
- No Git commit was created.
