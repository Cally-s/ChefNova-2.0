# Chef Nova Use-First Priority Engine

## Goal

The Use-First Priority Engine gives Chef Nova one shared, explainable way to decide which pantry items need attention first and which safe recipes can help use them.

Pantry attention and rescue-recipe priority are separate. An item can need attention even when Chef Nova should not suggest recipes for it.

## Shared Engine

The engine is implemented in `app.js` with these public helpers:

- `deriveUseFirstPriorities()`
- `deriveUseFirstPriorityForPantryItem()`
- `getUseFirstPriorityModel()`

All Cook Before It Spoils surfaces read from this shared model:

- Pantry item badges
- Dashboard Cook Before It Spoils summary
- Cook Before It Spoils workflow groups
- Recipe rescue entry point
- Reminder priority metadata

## Safety First

Food-Safety Guardrails run before recipe rescue scoring.

Scoring statuses:

- `scored`: safe enough for automatic recipe rescue ranking
- `not-available`: no usable quantity remains
- `review-required`: user review is required before planning
- `excluded`: hard safety exclusion blocks automatic recipe use
- `invalid`: item data could not be scored safely

Items marked `review-required`, `excluded`, or `invalid` may still appear as attention items, but their rescue-recipe score is `null`.

## Two Scores

### Attention Priority

Attention priority answers:

Which pantry items should the user review first?

It may consider:

- Expiration urgency
- Opened-package status
- Storage attention
- Quantity at risk
- Estimated value at risk
- Planned-use coverage
- Frozen or preserved status

### Rescue-Recipe Priority

Rescue-recipe priority answers:

Which safe pantry items should drive recipe search first?

It uses the same evidence, then adds recipe opportunity strength. The score stays `null` when safety, review, or availability rules block automatic recipe suggestions.

## Score Configuration

The score configuration is centralized and versioned:

- Engine version: `USE_FIRST_PRIORITY_ENGINE_VERSION`
- Score configuration version: `USE_FIRST_SCORE_CONFIGURATION_VERSION`

Maximum positive score parts:

- Urgency: 40
- Opened package: 8
- Category: 6
- Storage attention: 8
- Quantity at risk: 12
- Estimated value: 8
- Recipe availability: 12
- Rescue actionability: 6

Maximum penalties:

- Already planned: 22
- Already frozen: 18

Priority levels:

- Very High: 80+
- High: 60+
- Medium: 40+
- Low: 20+
- Monitor: below 20

## Deterministic Ordering

Results sort by:

1. Highest attention priority
2. Highest rescue-recipe priority when available
3. Earliest usable date
4. Pantry item name
5. Stable pantry item ID

No random ordering is used by the priority engine.

## Display Groups

The Cook Before It Spoils workflow groups items into:

- Use These First
- Review Before Planning
- Quality Review
- Already Planned
- Monitor
- Not Eligible for Automatic Planning

These groups keep urgent, review-required, planned, and blocked items separated so the interface stays explainable.

## Evidence and Explanations

Each priority result includes:

- Score components
- Reason codes
- Human-readable explanation reasons
- Date confidence
- Quantity summary
- Estimated value summary
- Recipe opportunity summary
- Planned-use summary
- Reminder priority metadata
- Source revision metadata

When opened-package evidence overlaps with date urgency, the result records the overlap as `opened-state-date-window`. This makes double-counting visible instead of hidden.

## Recipe Compatibility

Recipe opportunities reuse Chef Nova's existing recipe eligibility checks through `evaluateRecipeForCurrentRequirements()`.

The engine does not create a second recipe eligibility system. It only scores safe compatible recipe opportunities for the pantry item being reviewed.

## Missing Information

Missing quantity, date, or price data is treated as unavailable or lower confidence. Missing price is not treated as zero-value food.

## Reminder Integration

Reminder priority is metadata, not a separate food score. High-priority items may override snoozed reminders only when priority has escalated.
