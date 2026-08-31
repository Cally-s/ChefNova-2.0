# Chef Nova Cook Before It Spoils Mode and Entry Points

## 1. Purpose

Cook Before It Spoils is a Meal Planner mode. Pantry, dashboard, reminder, recipe, and leftover entry points all open one shared workflow so later food-rescue work can reuse one path.

## 2. Existing Systems Reused

The mode reuses the existing Meal Planner, Pantry state, dashboard cards, notification actions, recipe cards, planned-leftover summaries, router, account-scoped storage, guest session storage, Recipe Database, Shopping List, Price Catalogue, and leftover planning data.

## 3. Canonical Planning-Mode Value

Stored value: `cook-before-it-spoils`.

Display label: `Cook Before It Spoils`.

## 4. Shared Workflow Opener

`openCookBeforeItSpoils(context)` normalizes entry context, sets the current planner mode, navigates to the existing Meal Planner, renders the shared workflow, announces the change once, and focuses the workflow heading.

## 5. Entry-Context Model

The temporary context includes `source`, `focusIngredientIds`, `focusPantryItemIds`, `focusRecipeId`, `focusLeftoverIds`, `focusReminderId`, `returnTarget`, `sourceRevisions`, and `staleMessages`.

Allowed sources are `meal-planner`, `pantry`, `dashboard`, `expiry-reminder`, `recipe-card`, and `leftover-reminder`.

## 6. Shared Workflow Shell

Step 2 renders a shell only. It shows attention counts, focused Pantry items, recipe context, leftover context, stale-entry messages, and return actions.

Deferred work includes food-rescue ranking, date-intelligence upgrades, portion optimization, freezing, waste recording, and analytics.

## 7. Attention Count

The shared selector is `selectPantryItemsNeedingAttention()`. It uses the current Pantry expiration statuses: `Expired`, `Expires today`, and `Expires soon`.

The count is Pantry item records, displayed as Pantry ingredients because the current Pantry form prevents duplicate ingredient names.

## 8. Pantry Entry

The existing Pantry summary includes a Cook Before It Spoils entry. The button opens the shared workflow with `source: "pantry"` and current attention item IDs.

## 9. Meal Planner Entry

The existing Planning Mode selector includes Cook Before It Spoils in this order: Standard Meal Plan, Budget Rescue, Cook Before It Spoils, Emergency Plan.

## 10. Dashboard Entry

The Home dashboard now shows a Cook Before It Spoils summary card. It uses the same selector and opens the same workflow with `source: "dashboard"`.

## 11. Expiry-Reminder Entry

New expiry warning notifications use the action label `Cook Before It Spoils`. Opening the action passes the Pantry item ID and reminder ID without marking the notification as read.

## 12. Recipe-Card Entry

Recipe cards and recipe details include `Use Food That Needs Attention`. The action passes the recipe ID and any matching current attention Pantry IDs found through canonical ingredient IDs.

Recipe context does not schedule the recipe or approve it for allergy, dietary, appliance, time, or serving requirements.

## 13. Leftover-Reminder Entry

Planned leftover summaries include a Cook Before It Spoils button when a stable leftover allocation or source ID exists. Opening it focuses the current leftover context when it still exists.

Planned leftovers are not consumed, reserved, or treated as prepared inventory by opening the mode.

## 14. Navigation and Focus

All entry points use `openCookBeforeItSpoils()`. Return navigation uses the stored `returnTarget` and falls back safely to the Meal Planner.

The workflow heading receives focus after opening. A single polite live-region announcement confirms the transition.

## 15. Storage and User Isolation

Entry context stays in memory as navigation state. No new localStorage key was added.

Registered users continue to read Pantry, reminders, plans, and profile data through existing user-scoped storage. Guests continue to use session-only guest state.

## 16. Accessibility

The existing accessible planning-mode radio group is reused. Buttons have visible text, counts are text-based, hidden Budget Rescue and Emergency controls remain hidden, and stale context is shown inside the workflow.

## 17. Responsive Design

The workflow uses responsive grids. Attention cards use three columns on desktop, two columns on tablet, and one column on mobile.

## 18. Deferred Work

Step 2 does not add new date thresholds, rescue scoring, freezing, discard tracking, donation tools, price changes, Shopping List calculations, new recipe metadata, or analytics.
