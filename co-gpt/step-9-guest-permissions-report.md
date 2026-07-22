# Step 9 Implementation Report — Decide What Guests Can Use

## Goal

Define clear Guest Mode permissions so guests can explore Chef Nova and test temporary features without permanently saving progress.

## Files Changed

- `app.js`
- `style.css`

## Guest Permission Rules

Guest mode is active only when:

```js
sessionStorage.getItem("chefNovaGuestMode") === "true"
```

Registered users are still identified through `chefNovaCurrentUser`.

Added centralized guest permission helpers and rules in `app.js`, including:

- `GUEST_PERMISSIONS`
- `isAuthenticatedUser()`
- `canUseFeature(featureName)`
- `canSavePermanently()`
- `getActiveStorage()`
- `getStorageForCurrentMode()`
- `getGuestStorageKey(featureName)`
- `showGuestSaveRestriction()`
- `requireAuthenticatedSave()`

## Allowed Guest Features

Guests can use:

- Search recipes
- View recipe details
- Use filters
- Read cooking rules
- View instructions
- Try the pantry page
- Try the meal planner
- View the nutrition page

## Restricted Permanent Saves

Guests cannot permanently save:

- Favorites
- Pantry items
- Meal plans
- Shopping lists
- Nutrition history
- Cooking history
- Profile information

Guest users may test temporary features during the current browser session, but permanent progress saving is reserved for registered users.

## Temporary sessionStorage Keys

Temporary guest data uses guest-specific `sessionStorage` keys:

- `chefNovaGuestFavorites`
- `chefNovaGuestPantry`
- `chefNovaGuestMealPlan`
- `chefNovaGuestShoppingList`
- `chefNovaGuestNotifications`
- `chefNovaGuestNutritionHistory`
- `chefNovaGuestCookingHistory`

Guest data is not written to authenticated localStorage keys such as user-scoped favorites, pantry, meal plans, shopping lists, or nutrition history.

## Pantry Guest Behaviour

- Guests can open Pantry.
- Guests can add and remove pantry items temporarily.
- Guest pantry data is stored in `chefNovaGuestPantry`.
- The Pantry page displays: `Temporary Guest Pantry`.
- Guest pantry actions show session-specific toast messages.

## Meal Planner Guest Behaviour

- Guests can open Meal Planner.
- Guests can assign meals, choose recipes, type custom meals, enter servings, and remove meals.
- Guest meal plans are stored in `chefNovaGuestMealPlan`.
- The Meal Planner page displays: `Temporary Guest Meal Plan`.
- The main save button is relabelled to `Save for This Session` for guests.
- Meal save/remove actions use session-specific toast messages.

## Weekly Nutrition Guest Behaviour

- Guests can open Weekly Nutrition.
- Weekly totals, ratings, recommendations, daily breakdowns, and progress bars calculate from the guest session meal plan.
- The page displays a temporary guest nutrition notice.
- The nutrition empty state remains usable and directs guests to add meals to the Meal Planner.

## Favorites Behaviour

- Temporary guest favorites are supported.
- Guest favorites are stored in `chefNovaGuestFavorites`.
- The Favorites page displays `Guest Favorites`.
- Guest favorite actions show:
  - `Favorite saved for this guest session.`
  - `Favorite removed from this guest session.`
- Guest favorites are not written to registered-user localStorage keys.

## Shopping List Behaviour

- Guests may temporarily add missing recipe ingredients to a session shopping list.
- Guest shopping list data is stored in `chefNovaGuestShoppingList`.
- Guest shopping-list updates show `Shopping list updated for this guest session.`
- Guest shopping list data is not written to authenticated localStorage keys.

## Nutrition History Restriction

- Guests cannot permanently save nutrition history.
- Clicking the weekly nutrition save-history action is blocked by the authenticated-save guard.
- The required message appears:
  `Create an account or log in to save your progress.`
- The saved Nutrition History list is replaced with a guest explanation.

## Cooking History Restriction

- Guest cooking history is not permanently saved.
- `chefNovaGuestCookingHistory` is included in the guest cleanup list for future temporary cooking-history support.
- No registered cooking-history record is created for guests.

## Profile Restriction

- Guest Account/Profile shows a Guest Mode panel.
- It includes:
  - No registered account
  - Progress is temporary
  - Create Account
  - Log In
  - Exit Guest Mode
- Guest profile editing and password editing are guarded.
- If a guest attempts profile saving, Chef Nova shows:
  `Create an account or log in to save profile information.`
- No guest profile record is created in `chefNovaUsers`.

## Registered-User Saving

Registered users still save permanently using the existing authenticated storage system:

- Favorites
- Pantry items
- Meal plans
- Shopping lists
- Nutrition history
- Notifications
- Profile information

Authenticated-user data is not routed into guest `sessionStorage`.

## Guest-to-Account Transition

- Create Account from Guest Mode opens the Sign Up tab.
- Log In from Guest Mode opens the Log In tab.
- After successful registration or login, `chefNovaGuestMode` is removed.
- Guest data remains isolated and is not copied automatically into the registered account.
- The registered user's saved progress is loaded.

## Exit Guest Mode

Exit Guest Mode clears:

- `chefNovaGuestMode`
- `chefNovaGuestFavorites`
- `chefNovaGuestPantry`
- `chefNovaGuestMealPlan`
- `chefNovaGuestShoppingList`
- `chefNovaGuestNotifications`
- `chefNovaGuestNutritionHistory`
- `chefNovaGuestCookingHistory`

Then Chef Nova hides the main app, hides the guest banner, and returns to the Welcome page.

## Accessibility

- Guest banners and page notices use readable text and status semantics.
- Guest profile actions have clear accessible names.
- Blocked permanent saves use toast notifications instead of alerts.
- Guest controls remain keyboard accessible.
- Temporary labels do not rely on color alone.

## Responsive Design

- Guest page notices wrap on mobile.
- Guest banner buttons wrap on smaller screens.
- Guest profile actions remain accessible on mobile.
- No horizontal scrolling is introduced by guest notices.

## User Guide Update

Updated the existing Guest Mode section inside the Account instruction modal.

The guide now explains:

- temporary guest data uses `sessionStorage`
- temporary data may remain after refreshing the same tab
- closing the tab or browser session removes guest progress
- creating an account or logging in is required for permanent saving
- what guests can use
- what guests cannot permanently save

No duplicate instruction card was created.

## Tests Run

- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8')); console.log('recipes.json valid')"`

## Risks or Remaining Notes

- Browser automation was not used because prior local `file://` browser inspection from the in-app browser was blocked.
- Pantry editing is limited to the app's existing pantry behavior; this update did not redesign pantry item editing.
- No Git commit was created.
