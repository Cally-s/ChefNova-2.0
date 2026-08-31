# Budget Rescue Data Model

Budget Rescue data extends existing Chef Nova objects. It does not create duplicate storage systems.

## Money

All money values are integer cents.

```javascript
{
  weeklyBudgetCents: 10000,
  estimatedGroceryCostCents: 9275,
  missingCostCents: null
}
```

Missing or unavailable money values are `null`, never `0`.

## Planning Mode Inputs

Budget Rescue and Emergency Plan inputs live inside the existing planning-mode state and saved-plan metadata.

Key fields include:

- planning mode
- weekly budget cents
- currency, currently CAD
- price cushion percent
- adults
- children
- number of days
- selected meal types
- available appliance IDs
- maximum cooking time
- price source
- saved price profile ID
- Emergency request, dates, and interpretation state

## Ingredients

Recipe ingredients preserve display text and add calculation fields.

```javascript
{
  ingredientId: "whole-wheat-pasta",
  displayName: "Whole-wheat pasta",
  displayText: "300 g whole-wheat pasta",
  quantity: 300,
  unit: "g",
  optional: false,
  category: "grains",
  form: "dry"
}
```

Aliases are used for matching the same ingredient. Substitutions are separate reviewed rules.

## Ingredient Catalogue

Canonical ingredient records include:

- `id`
- `name`
- aliases
- base unit
- category
- pantry-staple metadata
- allergen metadata
- dietary metadata

The catalogue is validated by `scripts/validate-ingredient-data.js`.

## Price Catalogue

Price entries include:

- ingredient ID
- store profile ID
- price basis
- priced quantity and unit
- regular price cents
- optional sale price cents
- sale end date
- CAD currency
- source type
- update date

The resolver supports Chef Nova estimates, user-entered current-plan prices, saved store profiles, and estimate fallbacks.

## Cost Results

Recipe cost summaries include:

- ingredient-use cost
- known ingredient subtotal
- total recipe cost when complete
- cost per serving when complete
- missing-price status
- price source labels

Weekly purchase results include:

- purchase groups
- total required quantity
- Pantry quantity applied
- missing quantity
- package count
- checkout purchase cost
- estimated surplus
- known subtotal
- final weekly grocery cost when complete
- remaining budget or amount above budget when complete
- price coverage

## Pantry Simulation

Budget Rescue creates a temporary planning inventory from the existing Pantry.

The simulation stores:

- copied Pantry lots
- canonical ingredient IDs
- quantities and units
- forms
- opened/use-soon metadata
- allocation rows
- temporary remaining quantities

Preview planning never mutates real Pantry state.

## Saved Plans

Saved Budget Rescue plans use the existing `mealPlans.calendar["YYYY-MM-DD"]` calendar.

Metadata is versioned and stores:

- schema version
- lifecycle status
- plan ID
- planning mode
- selected dates and meals
- integer-cent budget fields
- cost snapshot
- pricing snapshot
- Pantry snapshot
- Shopping List coverage
- leftover count
- substitution IDs
- status snapshot
- generated, saved, updated, and calculated timestamps

## Storage Scope

Registered users use account-specific localStorage keys. Guests use sessionStorage.

Budget Rescue must not write guest progress into registered-user storage unless the existing guest-upgrade flow explicitly transfers allowed progress.

## Unsupported or Corrupted Data

Unsupported future versions are not overwritten. Corrupted budget subtrees fail safely without resetting Pantry, allergies, dietary settings, Shopping List, or old plans.
