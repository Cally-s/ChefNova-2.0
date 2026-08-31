# Cook Before It Spoils: Prevent Excessive Cooking

## Goal

Step 15 adds a Portion Preview before Chef Nova commits a Cook This Tonight plan. The preview prevents unplanned extra prepared food from being hidden inside the reservation, Shopping List, meal calendar, or completion flow.

## Where It Runs

The preview is part of the existing Cook This Tonight workflow:

1. The user reviews Pantry quantities and Smart Portion suggestions.
2. Chef Nova builds a Portion Preview from the current recipe, people eating, planned leftovers, freezer plan, sharing plan, Pantry allocation, and grocery impact.
3. If all servings have a planned use, the user can review the plan.
4. If any prepared servings are unallocated, Chef Nova requires a choice before review and confirmation.
5. Pantry reservations, Shopping List demand, calendar updates, and food-event history still occur only after the existing confirmation steps.

## Portion Preview Data

The preview records:

- people eating
- servings tonight
- planned refrigerated leftovers
- planned frozen servings
- planned shared servings
- effective recipe yield
- unallocated servings
- priority foods projected to be used
- projected selected-food quantities
- additional grocery groups and estimated added checkout cost when available
- minimum-batch reason codes
- available user actions

The serving allocation follows this relationship:

```text
effectiveRecipeYield =
  servingsTonight
  + plannedRefrigeratedLeftoverServings
  + plannedFrozenServings
  + plannedSharedServings
  + unallocatedServings
```

## Required Decision for Extra Servings

Positive unallocated servings require a user decision before the final plan can be confirmed.

Supported options:

- **Cook and Freeze**: moves the unallocated servings into the planned frozen-servings field. This is shown only when the recipe has reviewed leftover/freezer guidance.
- **Find a Smaller Recipe**: returns the user to the ranked Food Rescue recipe list.
- **Plan to Share**: moves the unallocated servings into the planned shared-servings field.
- **Keep Full Yield**: records explicit acceptance that the extra servings are unallocated and will be reviewed after cooking.

Planning an option does not mark food frozen, shared, rescued, used, wasted, or left over. Actual outcomes are recorded only after the user confirms meal completion.

## Language Guardrail

The preview uses projected language only. The visible label is:

```text
Priority foods projected to be used
```

Chef Nova does not use the old label “Ingredients rescued” in this flow because food has not been prepared or completed yet.

## Minimum-Batch Notice

When the recipe produces more servings than the current allocation, Chef Nova displays a minimum-batch notice with the reason when available. Reasons include fixed yield, baking-sensitive recipes, whole-item requirements, minimum liquid, and method batch requirements.

## Completion Behavior

After cooking, the outcome review can record what actually happened to planned refrigerated leftovers, planned frozen servings, planned shared servings, and unallocated servings.

Food-event history entries for frozen or shared servings are created only after completion confirmation. Preview actions and plan confirmation do not create those events.

## Preserved Boundaries

This step does not rewrite:

- Smart Portion suggestions
- Practical ingredient scaling
- Food Rescue ranking
- hard recipe filters
- Pantry reservation logic
- Shopping List demand logic
- meal calendar saving
- account or guest storage

The new layer only makes serving allocation explicit before the existing commit flow runs.
