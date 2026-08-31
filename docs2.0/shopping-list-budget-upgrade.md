# Shopping List Budget Upgrade

## Goal

Step 15 upgrades the existing Chef Nova Shopping List so it reflects Budget Rescue purchase groups, Pantry coverage, package quantities, price confidence, and preferred store information in one list.

## Source of Truth

The Shopping List still uses the existing `chefNovaShoppingList` storage key for registered users and the existing guest shopping list session data for guests. Budget Rescue purchase groups are used to build the visible list model, while saved Shopping List entries store user overrides such as checked state, removed required items, and custom purchase quantities.

No second grocery list, Budget Shopping List, Pantry, price editor, or cost engine was added.

## Item Model

Each upgraded item can show:

- Required weekly quantity
- Quantity already covered by Pantry
- Quantity still needed
- Suggested package or unit-rate purchase
- Estimated price when available
- Active price source
- Preferred store or price profile
- Purchase shortfall and missing-price warnings
- Optional ingredient status
- Purchased or checked state

Missing prices remain visible as `Price needed`; they are not treated as zero-cost items.

## Sections

Items are grouped into:

- Produce
- Grains
- Protein
- Dairy or alternatives
- Frozen food
- Canned goods
- Pantry staples
- Other

## Filters

The list supports:

- All Items
- Need to Buy
- Already at Home
- Price Missing
- Optional

Filters only change what is visible. They do not change Shopping List totals or saved meal-plan requirements.

## Recalculation

The Shopping List recalculates after:

- Removing or restoring a required item
- Editing purchase quantity
- Updating price through the existing price editor
- Marking an item as already at home
- Changing price settings or store profiles

Dependent views are refreshed so Pantry allocation, grocery totals, Budget Status, recipe-card costs, and weekly nutrition stay aligned with the current plan.

