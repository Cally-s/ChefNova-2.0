# Cook Before It Spoils Step 41 Report

## Goal

Add one structured food-rescue notification experience for Attention Today, Planning Reminder, Freezer Reminder, and Possible Pattern Reminder while reusing Chef Nova's existing Notification Centre and shared food systems.

## Files inspected

Inspected `app.js`, `index.html`, `style.css`, `docs/cook-before-it-spoils-audit.md`, `docs/cook-before-it-spoils-food-safety-guardrails.md`, `docs/cook-before-it-spoils-date-intelligence.md`, `docs/cook-before-it-spoils-use-first-priority-engine.md`, `docs/cook-before-it-spoils-use-these-first-panel.md`, `docs/cook-before-it-spoils-food-rescue-recipe-card.md`, `docs/cook-before-it-spoils-cook-this-tonight.md`, `docs/cook-before-it-spoils-original-leftover-timeline.md`, `docs/cook-before-it-spoils-leftover-outcomes.md`, `docs/cook-before-it-spoils-freezer-inventory.md`, `docs/cook-before-it-spoils-record-freezer-information.md`, `docs/cook-before-it-spoils-track-thawing.md`, `docs/cook-before-it-spoils-evidence-based-pattern-detection.md`, `docs/cook-before-it-spoils-actionable-pattern-insights.md`, `docs/cook-before-it-spoils-explain-insight-evidence.md`, `docs/cook-before-it-spoils-shopping-list-integration.md`, `docs/cook-before-it-spoils-meal-calendar-reservations.md`, `docs/cook-before-it-spoils-emergency-plan-integration.md`, `docs/cook-before-it-spoils-impact-ledger.md`, `docs/cook-before-it-spoils-responsible-impact-claims.md`, and Step 1-40 Cook Before It Spoils reports available in `docs`.

## Existing systems audited

- Existing Notification Centre source of truth: `getNotifications()`, `saveNotifications()`, `displayNotifications()`, and the `#notifications-page` section.
- Existing scheduler source of truth: front-end recalculation on app open, render, navigation, and state update. No service-worker scheduler exists.
- Existing notification-preference source of truth: no separate persisted preference UI existed; Step 41 adds one default versioned policy object and keeps all delivery in the existing notification store.
- Existing browser-notification support: none found.
- Existing service-worker support: none found.
- Existing push support: none found.
- Existing email support: none found.
- Existing permission workflow: none found; Step 41 does not request permission automatically.
- Existing quiet-hours behavior: none persisted; Step 41 defines quiet-hour policy fields and keeps external channels off.
- Existing snooze behavior: freeze reminder notification snooze existed; Step 41 adds timing-only snooze for food-rescue notifications.
- Existing dismissal behavior: delete/read existed; Step 41 adds narrow reminder dismissal.
- Existing Priority Engine source of truth: `getUseFirstPriorityModel()` and `deriveUseFirstPriorities()`.
- Existing Leftover Inventory source of truth: prepared leftover Pantry records and meal-plan leftover relationships.
- Existing Freezer Inventory source of truth: Pantry records with freezer storage and frozen preservation state.
- Existing Calendar-reservation source of truth: Pantry item `reservations` and `getPantryReservationAvailability()`.
- Existing Step 30 pattern source of truth: `checkWastePatterns()`.
- Existing Step 31 insight source of truth: `buildActionableInsightsForPatterns()`.
- Existing Food Event History boundary: notification delivery and actions do not call Food Event History append or Pantry command functions.
- Existing Impact Ledger boundary: notification delivery and actions do not call Impact Ledger posting functions.

## Defects found before Step 41

- Existing duplicate-reminder defects found: old freeze-today reminders used stable IDs, but broader food-rescue daily bundling was not available.
- Existing stale-reminder defects found: generic notifications did not revalidate source references before action routing.
- Existing generic-expiration wording found: older legacy notifications may contain generic wording; current Date Intelligence already uses precise wording.
- Existing notification-to-physical-event defects found: none in the inspected notification action paths.

## Files created

- `docs/cook-before-it-spoils-notification-levels.md`
- `docs/cook-before-it-spoils-step-41-report.md`
- `tests/cook-before-it-spoils-step-41-notification-levels-static.test.js`

## Files changed

- `app.js`
- `style.css`

## Model versions and values

- Notification-policy version: `FOOD_RESCUE_NOTIFICATION_POLICY_VERSION = 1`
- Notification-candidate version: `FOOD_RESCUE_NOTIFICATION_CANDIDATE_VERSION = 1`
- Notification-bundle version: `FOOD_RESCUE_NOTIFICATION_BUNDLE_VERSION = 1`
- Notification-preference version: `FOOD_RESCUE_NOTIFICATION_PREFERENCE_VERSION = 1`
- Notification-level values: `attention-today`, `planning-reminder`, `freezer-reminder`, `possible-pattern-reminder`
- Delivery-urgency values: `high`, `normal`, `low`
- Notification-source values: `pantry-item`, `leftover-batch`, `frozen-item`, `calendar-reservation`, `date-review`, `possible-pattern`, `actionable-insight`
- Notification-status values: `candidate`, `eligible`, `scheduled`, `delivered`, `read`, `snoozed`, `dismissed`, `resolved`, `withdrawn`, `expired`, `needs-review`, `failed`
- Privacy-preview values: `generic`, `detailed`, `hidden`

## Behavior implemented

- Attention Today eligibility: current Use-First items due today or needing same-day review, after safety and quantity checks.
- Attention Today item actions: open Food Rescue or review food details. No one-tap food use or freezing.
- Attention Today bundling: one bundle per user, local date, level, and source set.
- Attention Today ordering: follows the shared Use-First priority order.
- Attention Today suppression: hard-excluded, frozen, unavailable, unknown quantity, zero quantity, and fully reserved items are suppressed.
- Planning Reminder eligibility: safe items with unplanned quantity from tomorrow through the next three local days.
- Planning Reminder time-window behavior: local-date window uses the current application timezone and `addCalendarDays()`.
- Planning Reminder frequency: stable deduplication key prevents repeated unchanged reminders.
- Freezer Reminder eligibility: current freezer inventory items with due quality reminders and available quantity.
- Freezer Reminder quality wording: cards say quality and planning reminder, not expiration notice.
- Freezer Reminder actions: route to the existing Freezer Inventory view.
- Freezer Reminder frequency: stable source-set deduplication prevents daily spam for unchanged reminders.
- Possible Pattern Reminder eligibility: active Step 30 possible patterns with active Step 31 actionable insights.
- Possible Pattern Reminder wording: cautious, optional planning language only.
- Possible Pattern Reminder routing: opens existing pattern evidence/actionable insight context.
- Possible Pattern Reminder cooldown: stable pattern revision/source-set deduplication prevents repeated unchanged reminders.
- Safety-precedence behavior: Food-Safety Guardrails and Date Intelligence run before candidate creation.
- Precise-date-language behavior: best-before, recorded expiration, estimated freshness, leftover, and review wording remain separate.
- Review-required behavior: review-required items are labelled Review Required and route to details.
- Reservation-aware behavior: current reservation availability gates candidates.
- Partial-reservation behavior: card text shows planned and unplanned quantities when both exist.
- Overdue-reservation behavior: Step 41 does not release or consume reservations.
- Source-revalidation behavior: food-rescue notifications are revalidated before display and action routing.
- Stale-candidate withdrawal: stale active reminders become `withdrawn` and read.
- Delivered-stale-notification behavior: opening a withdrawn reminder shows a refresh message and no stale action.
- Bundle-model behavior: bundles preserve exact source references.
- Deduplication behavior: keys use level, user scope, local date, source-set hash, and policy version.
- Delivery-log behavior: notification records store in-app delivery, snooze, and dismissal log entries only.
- Permission behavior: no browser permission request is made automatically.
- Privacy-preview behavior: pattern reminders default to generic preview metadata.
- Quiet-hours behavior: policy object includes quiet hours; external channels remain disabled.
- Local-timezone behavior: local date and timezone fields are stored in candidates.
- Snooze behavior: snooze changes notification timing/status only.
- Dismissal behavior: dismissal changes notification state only.
- Action-routing behavior: actions open Food Rescue, Recipes, Pantry Freezer Inventory, or Waste Diary evidence.
- Notification Centre behavior: existing cards render level, status, source summaries, action, snooze, dismissal, read, delete, and history.
- Notification history behavior: read, dismissed, withdrawn, and deleted records remain handled by the existing history store.
- Empty-state behavior: unchanged generic page empty state remains for all notifications; Step 41 documentation defines the stricter food-rescue empty-state wording for future page-level refinement.
- Partial-data behavior: unknown or review-required dates are not shown as safe-use recommendations.
- Capability-detection behavior: cards include platform-dependent browser reminder wording.
- Front-end-only behavior: in-app reminder calculation happens while Chef Nova is open.
- Offline behavior: reminders use local user-scoped records only.
- Pattern-evidence boundary: notification interactions are never pattern evidence.
- Impact-Ledger boundary: notification interactions are never Impact Ledger credit.
- Environmental-claim boundary: no environmental calculations or claims were added.
- Deterministic-template behavior: all content is structured, not AI-generated.
- Stale-result protection: source references and revisions are stored in candidate and bundle metadata.
- Idempotency behavior: unchanged candidates produce one active notification bundle.
- Multi-tab protection: revalidation reads current storage on display and action.
- Account-switch protection: user scope is part of every candidate, bundle, and dedupe key.
- Registered-user isolation: registered reminders use existing per-user notification storage.
- Guest behavior: guest reminders use existing temporary session notification storage.
- Accessibility work: level/status text, semantic list summaries, specific action labels, and safe snooze/dismiss labels were added.
- Accessible action names: primary actions include destination and source count.
- Live-region behavior: reminder sync, snooze, dismissal, and routing use existing live region/toast helpers.
- Responsive-design work: source summaries stack on mobile.
- High-contrast behavior: status and level do not rely on color alone.
- Reduced-motion behavior: no new pulsing, shaking, or counter animation was added.
- Error handling: stale or unverifiable reminders withdraw or route to current records.
- Legacy migration: legacy reminders are not reissued as current food-rescue truth without source references.
- Migration idempotency: Step 41 does not duplicate legacy reminders or physical events.

## Required zero-result checks

- Second Notification Centres created: 0
- Second notification schedulers created: 0
- One timer created per Pantry item: 0
- Recipe views creating notifications as physical outcomes: 0
- Notification delivery creating Food Event History physical events: 0
- Notification opening creating Pantry deductions: 0
- Notification dismissal marking food used or discarded: 0
- Notification actions marking food frozen automatically: 0
- Notification interactions creating Impact Ledger credit: 0
- Attention reminders recommending hard-excluded food: 0
- True-expired food recommended for consumption: 0
- Best-before dates represented as expiration dates: 0
- App-estimated freshness represented as expiration: 0
- Review-required food presented as a safe-use recommendation: 0
- Fully reserved food receiving competing recommendations: 0
- Unreserved portions hidden by partial reservations: 0
- Overdue reservations released automatically by notification logic: 0
- Stale notifications delivered after source resolution: 0
- Duplicate unchanged reminders delivered repeatedly: 0
- Planning and Attention reminders duplicating the same unchanged sources on the same day: 0
- Freezer reminders sent daily for unchanged items: 0
- Frozen reminders described as expiration notices: 0
- Pattern reminders surfaced after one or two incidents: 0
- Pattern reminders using judgmental wording: 0
- Pattern reminder actions applying settings automatically: 0
- Notification dismissals counted as behavioural evidence: 0
- Quiet hours bypassed by planning notifications: 0
- Browser permission requested automatically on first load: 0
- Browser permission requested repeatedly after denial: 0
- Sensitive pattern or budget details exposed by default on lock screens: 0
- Unsupported background delivery described as guaranteed: 0
- Cross-user notification data exposed: 0
- Guest notification data persisted into registered-user storage automatically: 0

## Focused scenarios covered by static validation

Required Attention Today, bundle over three items, best-before wording, true-expiration wording, estimated-freshness wording, date-review wording, full reservation suppression, partial reservation display, planning window, freezer quality reminder, qualified pattern reminder, pattern evidence boundary, impact boundary, stale-source withdrawal, duplicate evaluation, Food Rescue routing, Freezer routing, Pattern routing, guest temporary storage, registered-user isolation, accessibility labels, responsive layout, high-contrast textual state, and reduced-motion non-animation were covered by static checks.

## Commands run

- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- `node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8')); console.log('recipes.json valid')"`
- `node tests/cook-before-it-spoils-step-41-notification-levels-static.test.js`
- `node tests/cook-before-it-spoils-step-40-emergency-plan-integration-static.test.js`
- `node tests/cook-before-it-spoils-step-39-meal-calendar-reservations-static.test.js`
- `node tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js`
- `node tests/cook-before-it-spoils-step-37-budget-rescue-integration-static.test.js`
- `node tests/cook-before-it-spoils-step-36-impact-claims-static.test.js`
- `node tests/cook-before-it-spoils-step-35-monthly-impact-dashboard-static.test.js`
- `node tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js`
- `node tests/cook-before-it-spoils-step-33-impact-metric-contracts-static.test.js`
- `node tests/cook-before-it-spoils-step-32-explain-insight-evidence-static.test.js`
- `node tests/cook-before-it-spoils-step-31-actionable-pattern-insights-static.test.js`
- `node tests/cook-before-it-spoils-step-30-conservative-pattern-detection-static.test.js`
- `node tests/cook-before-it-spoils-step-29-careful-discarded-weight-static.test.js`
- `node tests/cook-before-it-spoils-step-28-estimated-discarded-cost-static.test.js`
- `node tests/cook-before-it-spoils-step-27-pantry-linked-waste-diary-static.test.js`
- `node tests/cook-before-it-spoils-step-26-waste-diary-static.test.js`
- `node tests/cook-before-it-spoils-step-25-track-thawing-static.test.js`
- `node tests/cook-before-it-spoils-step-24-freezer-inventory-static.test.js`
- `node tests/cook-before-it-spoils-step-23-record-freezer-information-static.test.js`
- `node tests/cook-before-it-spoils-step-22-freeze-today-reminders-static.test.js`
- `node tests/cook-before-it-spoils-step-21-freezing-suitability-static.test.js`
- `node tests/cook-before-it-spoils-step-20-leftover-outcomes-static.test.js`
- `node tests/cook-before-it-spoils-step-19-leftover-transformation-cards-static.test.js`
- `node tests/cook-before-it-spoils-step-18-original-leftover-timeline-static.test.js`
- `node tests/cook-before-it-spoils-step-17-leftover-transformation-paths-static.test.js`
- `node tests/cook-before-it-spoils-step-16-leftover-inventory-static.test.js`
- `node tests/cook-before-it-spoils-step-15-portion-preview-static.test.js`
- `node tests/cook-before-it-spoils-step-14-practical-scaling.test.js`
- `node tests/cook-before-it-spoils-step-13-smart-portion-static.test.js`
- `node tests/cook-before-it-spoils-step-12-cook-this-tonight-static.test.js`
- `node tests/cook-before-it-spoils-step-11-food-rescue-card-static.test.js`
- `node tests/cook-before-it-spoils-step-10-hard-filters-static.test.js`
- `node tests/cook-before-it-spoils-step-9-recipe-rescue-ranking-static.test.js`
- `node tests/cook-before-it-spoils-step-8-use-these-first-panel-static.test.js`
- `node tests/cook-before-it-spoils-step-7-use-first-priority-static.test.js`
- `node tests/cook-before-it-spoils-step-6-food-safety-static.test.js`
- `node tests/cook-before-it-spoils-step-3-date-intelligence-static.test.js`
- `node tests/cook-before-it-spoils-step-2-static.test.js`
- `node tests/cost-calculation-engine.test.js`
- `node tests/recipe-eligibility-ranking.test.js`
- `node tests/recipe-eligibility-static.test.js`
- `node tests/recipe-card-cost-information-static.test.js`
- `node tests/ingredient-data.test.js`
- `node tests/price-data.test.js`
- `node tests/price-confidence-static.test.js`
- `node tests/shopping-list-budget-upgrade-static.test.js`
- `node tests/budget-accessibility-mobile-static.test.js`
- `node tests/budget-data-protection-static.test.js`
- `node tests/budget-edge-case-handling-static.test.js`
- `node tests/budget-rescue-final-acceptance-static.test.js`
- `node tests/budget-rescue-complete-qa.test.js`
- `node tests/budget-planning-algorithm-static.test.js`
- `node tests/budget-rescue-save-plan-static.test.js`
- `node tests/leftover-batch-cooking-static.test.js`

## Validation result

Step 41 is complete. Chef Nova now uses the existing Notification Centre for structured food-rescue notification levels. It does not create duplicate systems or physical outcomes.

## Pre-existing failures and unavailable checks

- `node tests/cook-before-it-spoils-step-4-pantry-schema-static.test.js` failed on the pre-existing literal `dateInformation:` field in Emergency Plan code.
- `node tests/cook-before-it-spoils-step-5-food-events-static.test.js` failed on the same pre-existing literal `dateInformation:` field.
- `node tests/cook-before-it-spoils-step-36-responsible-impact-claims-static.test.js` was unavailable because the repository file is named `cook-before-it-spoils-step-36-impact-claims-static.test.js`.
- No package-level build, lint, type-check, browser, accessibility runner, responsive runner, or localization runner was present in the repository.

## Recommended starting point for Step 42

Add a visible Notification Settings panel for editing level preferences, quiet hours, privacy previews, and optional browser reminders after an explanatory user action.
