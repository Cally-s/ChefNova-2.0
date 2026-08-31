# Cook Before It Spoils Food-Rescue Recipe Card

## Purpose

Step 11 extends the existing Chef Nova recipe card with a food-rescue planning layer. It does not create a separate recipe-card system.

## Data Flow

The card reads the recipe's existing `foodRescueRanking` result from Step 9 and the Step 10 eligibility status already attached to that ranking. It only renders the rescue section when the recipe is eligible.

The card does not recalculate ranking, eligibility, safety, expiry, or grocery business logic. It converts the existing ranking result into a presentation view model with:

- recipe id and name
- food-rescue value label
- selected-food coverage
- pantry coverage
- required grocery count
- estimated added grocery cost
- cost completeness state
- suggested household servings
- effective yield
- leftover fit
- projected source-food use
- projected remainder information
- explanation text
- unused-food risk text
- available action states

## Required Wording Rules

Food-rescue recipe cards use projected language:

- `Would use`
- `Would remain`
- `Planning estimate`
- `Pantry amounts update only after food use is confirmed`

The card does not say that food was rescued, used, saved, or removed from waste before the user confirms cooking.

## Actions

The card supports these actions without mutating pantry quantities directly:

- `Cook This Tonight`
- `Adjust Portions`
- `See Other Recipes`
- `Find a Second Use`
- `Review Freeze Options for the Remaining Portion`
- `View Rescue Details`

`Cook This Tonight` revalidates the current ranking before saving the meal plan entry. It adds the recipe to the meal plan for the current date and stores metadata linking the meal entry to the food-rescue candidate.

`Adjust Portions` previews projected use and cost impact for a different serving count. Applying the preview updates the current food-rescue ranking request and refreshes recipe display.

`Find a Second Use` starts a new food-rescue recipe search based on the projected remainder from the first recipe. The first recipe is excluded from the second-use ranking.

`Review Freeze Options for the Remaining Portion` opens guidance only. It does not update pantry quantities.

## Storage

The card follows existing storage rules:

- registered users use user-scoped storage
- guests use temporary session storage
- normal meal plan save helpers preserve the existing storage behavior
- pantry quantities are not changed by card rendering or previews

## Accessibility

The rescue summary uses semantic headings, lists, definition-list metrics, buttons, and modal dialogs already used by Chef Nova. Buttons include action-specific labels so the card remains understandable with assistive technology.
