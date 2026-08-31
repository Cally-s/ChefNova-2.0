# Step 19 — Account Upgrade for Guests Implementation Report

## Goal

Allow guests who sign up to choose whether their temporary guest Pantry, Meal Plan, and Shopping List should be saved into the newly created registered account.

## Files Changed

- `index.html`
- `app.js`
- `style.css`
- `co-gpt/step-19-account-upgrade-for-guests-report.md`

## Guest Upgrade Prompt

After a guest successfully creates an account, Chef Nova now asks:

```text
Would you like to save your temporary guest pantry, meal plan, and shopping list to your new account?
```

Buttons:

- `Save My Guest Progress`
- `Start Fresh`

## Save My Guest Progress

When selected, Chef Nova:

1. Reads guest Pantry from `chefNovaGuestPantry`.
2. Reads guest Meal Plan from `chefNovaGuestMealPlan`.
3. Reads guest Shopping List from `chefNovaGuestShoppingList`.
4. Copies those values into the new user's localStorage keys:
   - `chefNovaPantry_[new-user-id]`
   - `chefNovaMealPlan_[new-user-id]`
   - `chefNovaShoppingList_[new-user-id]`
5. Removes guest session data through the existing session cleanup.
6. Opens the dashboard as the registered user.

## Start Fresh

When selected, Chef Nova:

1. Does not copy guest progress.
2. Removes guest session data through the existing session cleanup.
3. Opens the dashboard as the registered user with fresh account progress.

## New Helpers

Added:

- `hasGuestUpgradeSession()`
- `getUserStorageKeyForUser(feature, user)`
- `copyGuestProgressToUser(user)`
- `showGuestUpgradeModal(user)`
- `hideGuestUpgradeModal()`
- `handleGuestUpgradeModalKeydown(event)`
- `completeGuestAccountUpgrade(saveProgress)`

## Storage Safety

The guest upgrade flow only copies:

- Pantry
- Meal Plan
- Shopping List

It does not merge guest data automatically and does not affect any existing registered-user account.

## Validation

Passed:

```bash
node --check app.js
node --check rules.js
node --check data/recipes.js
node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8'))"
```

## Notes

- The guest upgrade choice appears only when guest session data or guest mode is present during account creation.
- No backend, database, or external API was added.
- No Git commit was created.
