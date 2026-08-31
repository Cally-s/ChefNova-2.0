# Step 23 - Optional Weight Progress Implementation Report

## Files Changed

- `app.js`
- `style.css`
- `co-gpt/step-23-optional-weight-progress-report.md`

## Optional Weight Progress Section

Added a dedicated optional `Weight Progress` section inside `My Nutrition Tracker`.

The section appears after the daily and last-7-days habit summaries so body weight remains secondary to completed meals, vegetables, protein-containing meals, workout support, cooking habits, and hydration reminders.

The section includes:

- visible safety message
- Add Weight Entry button
- View Weight Progress button
- kg/lb display toggle
- optional add/edit form
- summary cards
- simple long-term chart
- entry history
- hide/show control
- delete-all-data privacy control

## Storage Structure

Weight entries are stored separately from the daily habit tracker in this canonical structure:

- `entries`
- `settings`
- `version`

Each entry contains:

- `id`
- `date`
- `weightKg`
- `note`
- `createdAt`
- `updatedAt`

Malformed entries are ignored by `migrateWeightProgressData()`.

## Per-User Storage

Registered users store Weight Progress under:

`chefNovaWeightProgress_[userId]`

This keeps weight entries isolated by active account.

## Guest Mode Storage

Guests store optional weight progress in sessionStorage only:

`chefNovaGuestWeightProgress`

Guest weight entries are cleared when Guest Mode exits and are not transferred automatically into a registered account.

## Canonical Kilogram Storage

Weight values are stored as `weightKg`.

The app does not store duplicate kilogram and pound values.

## Unit Conversion

Users can enter and view weight in kg or lb.

The display unit updates:

- form label
- chart labels
- summary cards
- history rows

Conversion happens only for entry and display.

## Entry Validation

Added `validateWeightEntryInput(input, unit)`.

Validation checks:

- date is present and not in the future
- weight is finite, positive, and within broad technical input limits
- optional note is 200 characters or fewer

Validation wording stays neutral:

- `Choose today or an earlier date.`
- `Enter a valid weight.`
- `Use 200 characters or fewer.`

## Same-Date Handling

Only one active entry is allowed per date.

When a matching date exists, Chef Nova asks before replacing the existing entry and preserves the entry ID while updating the value, note, and `updatedAt`.

## Add-Entry Flow

`addWeightProgressEntry(formValues)` validates the form, converts the weight to kilograms, saves the entry, sorts entries by date, refreshes the UI, and shows:

`Weight entry saved.`

## Edit-Entry Flow

Each history row includes an Edit button.

Editing reloads the selected entry into the form, reuses the same validation, updates the chart and summary, and shows:

`Weight entry updated.`

## Delete-Entry Flow

Each history row includes a Delete button with confirmation:

`Delete Weight Entry?`

After confirmation, Chef Nova removes only that weight entry, refreshes the chart and summary, and shows:

`Weight entry deleted.`

## Delete-All-Data Flow

Added `Delete All Weight Data`.

After confirmation, Chef Nova removes only Weight Progress entries for the current account or Guest Mode session.

It does not delete Nutrition Tracker habits, Meal Planner, Nutrition Profile, Pantry, Favorites, Shopping List, or account information.

## Hidden-Feature Behaviour

Added `Stop Showing Weight Progress`.

This hides the chart and entry form without deleting entries.

Users can select `Show Weight Progress Again` to restore the section.

## Chart Implementation

Added a lightweight responsive SVG line chart.

The chart uses:

- chronological dates
- current display unit
- one point per valid entry
- accessible chart summary

No external chart service or dependency was added.

## Chart Data Building

Added `buildWeightChartData(entries, unit)`.

The builder sorts entries by date and converts from stored kilograms to the active display unit only for chart display.

## Chart Scaling

Added `calculateWeightChartDomain(chartData)`.

The chart adds reasonable padding around the recorded minimum and maximum to avoid exaggerating small changes.

No zero-baseline forcing, target lines, or ideal-weight zones were added.

## Chart Accessibility

Added `buildAccessibleWeightChartSummary(entries, trend, unit)`.

The chart has a concise accessible summary and the same data remains available in the `Weight Entry History` list.

The chart is not the only way to access the data.

## First Recorded Weight

The first recorded weight uses the earliest valid dated entry.

It is labelled:

`First Recorded Weight`

## Most Recent Weight

The most recent weight uses the latest valid dated entry.

It is labelled:

`Most Recent Weight`

## General Trend Calculation

Added:

- `calculateGeneralWeightTrend(entries)`
- `calculateSmoothedWeightTrend(sortedEntries)`
- `weightTrendText(trend)`

Trend labels are neutral:

- `Not enough long-term data yet`
- `Relatively stable over the recorded period`
- `Gradual upward pattern over the recorded period`
- `Gradual downward pattern over the recorded period`
- `Mixed pattern over the recorded period`

## Minimum Trend-Data Requirements

Chef Nova requires at least:

- 3 valid entries
- 14 days between earliest and latest entry

before showing an upward or downward general trend.

## Trend Smoothing

Trend smoothing compares early-entry averages with recent-entry averages instead of reacting to a single daily change.

The threshold is used only for neutral display smoothing and is not presented as a health threshold.

## Mixed-Pattern Handling

If the smoothed values are similar but entries move in multiple directions, Chef Nova may show:

`Mixed pattern over the recorded period`

## Daily-Fluctuation Safeguards

Chef Nova always shows:

`Weight can naturally change from day to day. Look at longer-term patterns rather than one entry.`

The app does not show daily-change alerts, rapid-change celebrations, or criticism based on movement between entries.

## Step 22 Integration

The Optional Body Weight field in the daily tracker still works.

When a user records optional body weight and no Weight Progress entry exists for that date, Chef Nova asks whether to add it to Weight Progress.

If the user cancels, the value remains only in the daily tracker and no Weight Progress entry is created.

Daily tracker summaries now show:

- `Optional weight recorded`
- `Not recorded`

They do not show daily change messaging.

## Minor Protections

For users under 18, Chef Nova displays:

`Weight tracking is optional. Because your body may still be growing, focus on regular meals, food variety, activity, sleep, and how you feel rather than frequent weigh-ins.`

No daily prompt, countdown, deficit message, or frequent-weigh-in encouragement was added.

## Unknown-Age Behaviour

When age is unavailable, Chef Nova uses the general safety message and does not assume adult weight-change coaching.

## Privacy Protections

Weight entries remain local.

The app does not:

- log weight values
- include weight values in notifications
- show weight values on recipe cards
- use chart movement in Meal Planner explanations
- send entries to external services
- use Weight Progress to change recipe ranking or meal-plan generation

## Account Isolation

Weight Progress reloads from the active account key after account changes.

Temporary form state is cleared during account switching, logout, and Guest Mode exit.

## Accessibility Result

Added:

- clear section heading
- visible labels
- keyboard-accessible buttons
- accessible SVG summary
- entry-specific Edit and Delete button names
- readable history list

Browser confirmation dialogs are used for destructive actions.

## Responsive Result

Desktop uses grid summary cards and a full-width chart.

Tablet uses two-column wrapping.

Mobile stacks the form, summary, history, and controls into one column with full-width action buttons.

## User Guide Update

Updated the `My Nutrition Tracker` guide modal with an `Optional Weight Progress` section covering:

- optional tracking
- date, weight, and optional note
- kg/lb display with canonical kilograms
- chart and summary cards
- trend requirements
- daily fluctuation safeguards
- edit and delete controls
- guest storage
- minor protections

## Tests Run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parsed `data/recipes.json`
- searched app/style/index files for prohibited celebratory, diagnostic, and unsupported Weight Progress wording
- confirmed required Weight Progress helper functions are present
- confirmed no separate `nutritionTracker.js` file exists

## Exact Rules Confirmed

Weight tracking must always remain optional and must never be required to use My Nutrition Tracker or any other Chef Nova feature.

Users must be able to record a date, weight, and optional note when they choose to use Weight Progress.

Weight values must be stored canonically in kilograms and converted only for entry and display.

The chart must show a simple chronological pattern without ideal-weight lines, target zones, judgment colours, or exaggerated daily-change messaging.

Weight Progress must show the first recorded weight, most recent weight, a neutral general trend, and the number of valid entries.

Chef Nova must require enough entries across enough time before describing an upward or downward general trend.

Chef Nova must not celebrate rapid weight loss, criticize weight gain, diagnose changes, or label an entry as good or bad.

Chef Nova must always display: “Weight can naturally change from day to day. Look at longer-term patterns rather than one entry.”

Weight trends must not automatically change meal plans, nutrition targets, serving sizes, or recipe recommendations.

For users under 18, Chef Nova must not encourage frequent weigh-ins, calorie deficits, target-weight countdowns, or weight-loss streaks.

Weight entries must remain locally stored, account-isolated, and session-only in Guest Mode.

Chef Nova must not guarantee weight change, muscle gain, athletic performance, recovery, or medical outcomes.

## Notes

No Git commit was created.
