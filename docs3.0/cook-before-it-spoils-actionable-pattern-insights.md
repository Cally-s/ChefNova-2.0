# Cook Before It Spoils: Actionable Pattern Insights

## Purpose

Step 31 turns qualified Step 30 possible planning patterns into optional next steps. It keeps four concepts separate:

- Pattern: repeated effective discard incidents.
- Insight: what the evidence may mean for planning.
- Suggested action: an optional next step.
- Applied action: a confirmed user setting change.

## Architecture

The feature extends the Step 30 pattern system:

1. `checkWastePatterns()` returns current possible patterns.
2. `buildActionableInsight(pattern)` evaluates action-specific evidence.
3. `buildInsightActionCandidates()` creates deterministic action candidates.
4. The UI renders visible eligible actions.
5. Persistent actions require `openInsightActionPreview()`.
6. `applyInsightAction()` revalidates current data before saving.

No second pattern engine was added.

## Controlled Models

The implementation uses versioned models:

- Pattern summary model version 1.
- Metric coverage model version 1.
- Action candidate model version 1.
- Insight result version 1.
- Action preview version 1.

## User Control

Viewing an insight does not change Pantry, recipes, reminders, meal plans, shopping lists, allergies, or Food Event History.

Persistent changes require:

- Current-data revalidation.
- Exact preview.
- Scope explanation.
- Explanation of what will not change.
- Explicit confirmation.
- Reversible settings where available.

## Metrics

Weight summaries use stored Step 29 discard weight snapshots. Unknown weights stay unknown and are not treated as zero.

Value summaries use stored Step 28 discard cost snapshots. Currencies are grouped separately and mixed-currency coverage is labelled.

## Actions

Actions are deterministic and evaluated independently. Unsupported actions are not shown as active buttons.

Available action types include purchase review, earlier reminders, freezer-planning routines, rescue recipes, serving review, leftover routines, duplicate Pantry checks, and date-type confirmation.

## Storage

Registered users use account-scoped localStorage keys:

- `chefNovaActionableInsightActionStates`
- `chefNovaActionableInsightSettings`
- `chefNovaActionableInsightAudit`

Guests use sessionStorage keys:

- `chefNovaGuestActionableInsightActionStates`
- `chefNovaGuestActionableInsightSettings`
- `chefNovaGuestActionableInsightAudit`

## Boundaries

Action previews and insight views do not append Food Event History records. Applying an action saves only preference-style insight settings and audit records.

Recipe actions reuse the existing Recipe Finder and allergy safety checks. They do not add meals to the calendar.

Freezer actions save prompts only. They do not freeze food, split food, or create food events.

Reminder actions affect timing preferences only. They do not change safety dates.
