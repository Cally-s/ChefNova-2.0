# Chef Nova Use These First Panel

## 1. Purpose

The Use These First panel turns Step 7 priority results into clear user actions. It shows which Pantry food needs attention, what needs review, and which eligible foods can drive recipe search.

## 2. Existing Systems Reused

The panel reuses the shared Cook Before It Spoils workflow, Pantry lots, planned-leftover metadata, Step 7 Use-First Priority Engine, Step 6 Food-Safety Guardrails, Step 3 Date Intelligence, Recipe Database, existing Recipe Finder, Pantry review tools, and leftover review surface.

No second Pantry, leftover inventory, priority engine, recipe database, recipe-recommendation engine, freeze-guidance system, Shopping List, or Meal Planner was created.

## 3. Panel Placement

The panel appears inside Cook Before It Spoils mode immediately after the permanent Step 6 food-safety notice. The notice remains above the panel and is not repeated inside every card.

## 4. Panel View Model

`deriveUseFirstPanelViewModel()` returns one authoritative model:

- `panelVersion`
- `heading`
- `activeFilter`
- `filters`
- `groups`
- `entries`
- `visibleEntries`
- `selection`
- `entryContext`
- `warnings`
- `signature`
- `currentUserScope`

The view model consumes Step 7 priority results. It does not calculate priority scores.

## 5. Panel Entry Model

Each entry uses a normalized rescue source ID:

- `pantry:<pantryItemId>`
- `leftover:<leftoverBatchId>`

Pantry entries include source IDs, display name, lot label, priority levels, date summary, package summary, unreserved quantity, safety result, recipe opportunity summary, freezing availability, selection state, actions, filter membership, and source revisions.

Prepared leftovers use the existing planner leftover source when available. The panel does not treat planned but unprepared leftovers as available food.

## 6. Display Groups

The panel keeps Step 7 groups separate:

- Use These First
- Review Before Planning
- Quality Review
- Already Planned
- Not Eligible for Automatic Planning

Only Use These First is a ranked eligible ordered list. Review-required and excluded food is not selectable for recipe search.

## 7. Filters

The panel supports one active filter at a time:

- All
- Today
- Next 3 Days
- Leftovers
- Can Be Frozen
- Date Needs Confirmation

Filters change visibility only. They do not change scores, safety decisions, quantities, reservations, meal plans, reminders, or Shopping List data.

## 8. Filter Date Semantics

Today means the relevant confirmed action date is the user's local calendar date.

Next 3 Days uses an inclusive three-calendar-day window: today, tomorrow, and the following day. In code this is `daysRemaining >= 0 && daysRemaining <= 2`.

Unknown date meanings do not enter Today or Next 3 Days just because the raw date matches. They belong in Date Needs Confirmation.

## 9. Filter Counts

Counts use unique normalized entries. Filter counts may overlap and are not expected to add up to the All count.

## 10. Ranked Item Cards

Eligible cards show the food name, lot distinction, priority level, precise Step 3 date wording, opened date when relevant, current unreserved quantity, planned quantity when relevant, recipe opportunity summary, Find Recipes, Freeze Options when reviewed guidance permits it, Edit, and Priority Details.

The card does not expose raw score as the main message.

## 11. Multiple Pantry Lots

Each Pantry lot remains separate. Lots with different dates, storage, package state, quantity, or source ID are not merged or averaged.

## 12. Prepared Leftovers

Prepared leftovers must come from the existing leftover source of truth. Step 8 does not create a new leftover inventory.

## 13. Selection Model

Selection is temporary interface state stored in `state.useFirstPanelDraft`:

- `selectionVersion`
- `selectedRescueSourceIds`
- `selectedAtBySourceId`
- `selectionSource`
- `userScope`

The selection stores normalized source IDs only.

## 14. Selection Eligibility

An entry is selectable only when the Food-Safety Guardrail allows automatic planning, rescue recipe priority is not `null`, available quantity is known and greater than zero, date confirmation is not required, and at least one meaningful recipe opportunity exists.

## 15. Selection Across Filters

Selections remain selected when a filter hides them. The panel reports hidden selected counts. Stale or ineligible selections are removed before recipe search.

## 16. Multi-Item Recipe Search

The main action opens the existing Recipe Finder with selected food names. Chef Nova looks for safe recipes that use as many selected ingredients as practical.

Opening recipe search does not schedule meals, reserve food, deduct Pantry, consume leftovers, freeze food, or change the Shopping List.

## 17. Find Recipes

Per-item Find Recipes uses the same recipe-search path as the multi-selection action and revalidates the selected source first.

## 18. Freeze Options

Freeze Options appears only when Step 6 reviewed guidance permits freezing and the item is not already frozen or hard-excluded.

The dialog says freezing preserves eligible food but does not make excluded food eligible again. It does not freeze food automatically.

## 19. Edit and Review Actions

Pantry items route to the existing Pantry review tools. Leftovers route to the existing leftover plan review surface. Date confirmation, storage review, and amount resolution use existing Pantry controls.

## 20. Entry Context

Entry context can focus Pantry, recipe, reminder, or leftover sources. Focus does not change priority order or safety. Eligible focused items may be preselected; review-required and excluded focused items are not preselected.

## 21. Update Triggers

The panel rebuilds from current state whenever Meal Planner renders. Pantry edits, date changes, storage reviews, plan saves, recipe catalogue changes, user changes, and local-date changes recalculate through the shared model.

## 22. Storage and User Isolation

Registered users use only current user-scoped Pantry, plan, reminder, and price data. Guest panel selection is temporary in memory and is not persisted into a registered account.

## 23. Accessibility

The panel uses a visible heading, ordered list for eligible entries, section headings, `aria-pressed` filter buttons, a fieldset and legend for selection, specific checkbox labels, specific action names, live-region announcements, visible focus, and text safety states.

## 24. Responsive Design

Filters wrap on mobile. Cards stack. Action rows become full-width controls. Long dates and quantity labels wrap. High-contrast and reduced-motion preferences are supported.

## 25. Testing

Validation includes syntax checks, JSON parse, ingredient validation, price validation, all plain Node tests, and `tests/cook-before-it-spoils-step-8-use-these-first-panel-static.test.js`.

## 26. Deferred Work

Automatic rescue-plan generation, automatic meal scheduling, Pantry reservations, Pantry deductions, automatic freezing, freezer optimization, leftover transformations, waste analytics, household-pattern learning, and environmental-impact reporting remain later steps.
