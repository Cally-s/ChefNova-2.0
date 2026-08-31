const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-notification-levels.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-41-report.md"), "utf8");

[
  "FOOD_RESCUE_NOTIFICATION_POLICY_VERSION",
  "FOOD_RESCUE_NOTIFICATION_CANDIDATE_VERSION",
  "FOOD_RESCUE_NOTIFICATION_BUNDLE_VERSION",
  "FOOD_RESCUE_NOTIFICATION_PREFERENCE_VERSION",
  "FOOD_RESCUE_NOTIFICATION_LEVELS",
  "FOOD_RESCUE_NOTIFICATION_STATUSES",
  "FOOD_RESCUE_NOTIFICATION_SOURCE_TYPES",
  "NOTIFICATION_DELIVERY_URGENCY",
  "NOTIFICATION_PRIVACY_PREVIEW_LEVELS",
  "FOOD_RESCUE_NOTIFICATION_ACTION_TYPES"
].forEach((token) => assert(app.includes(token), `${token} is required.`));

[
  "ATTENTION_TODAY: \"attention-today\"",
  "PLANNING_REMINDER: \"planning-reminder\"",
  "FREEZER_REMINDER: \"freezer-reminder\"",
  "POSSIBLE_PATTERN_REMINDER: \"possible-pattern-reminder\"",
  "PANTRY_ITEM: \"pantry-item\"",
  "LEFTOVER_BATCH: \"leftover-batch\"",
  "FROZEN_ITEM: \"frozen-item\"",
  "CALENDAR_RESERVATION: \"calendar-reservation\"",
  "POSSIBLE_PATTERN: \"possible-pattern\"",
  "ACTIONABLE_INSIGHT: \"actionable-insight\""
].forEach((token) => assert(app.includes(token), `${token} controlled value is required.`));

[
  "function getFoodRescueNotificationPreferences",
  "function createFoodRescueNotificationCandidate",
  "function buildFoodRescueNotificationCandidates",
  "function bundleFoodRescueNotificationCandidates",
  "function createFoodRescueNotificationFromBundle",
  "function syncFoodRescueNotifications",
  "function revalidateFoodRescueNotification",
  "function snoozeFoodRescueNotification",
  "function dismissFoodRescueNotification",
  "function openFoodRescueNotificationAction"
].forEach((token) => assert(app.includes(token), `${token} is required.`));

assert(app.includes("getUseFirstPriorityModel()"), "Attention and Planning reminders must reuse the Use-First Priority Engine.");
assert(app.includes("getPantryReservationAvailability"), "Notification eligibility must understand Pantry reservations.");
assert(app.includes("getFreezerInventoryModel().items"), "Freezer reminders must reuse the Freezer Inventory model.");
assert(app.includes("checkWastePatterns().results"), "Pattern reminders must reuse Step 30 pattern results.");
assert(app.includes("buildActionableInsightsForPatterns(patterns)"), "Pattern reminders must require Step 31 actionable insights.");
assert(app.includes("getFoodSafetyGuardrailForPantryItem"), "Safety guardrails must be part of notification source models.");

const syncBlock = app.match(/function syncFoodRescueNotifications[\s\S]*?function snoozeFoodRescueNotification/);
assert(syncBlock, "syncFoodRescueNotifications block is missing.");
assert(syncBlock[0].includes("deduplicationKey"), "Food-rescue notifications must use stable deduplication keys.");
assert(syncBlock[0].includes("revalidateFoodRescueNotification"), "Food-rescue notifications must revalidate before display/delivery.");
assert(!/appendFoodEventsToHistory|commitPantrySnapshotAndFoodEvents|executePantryCommand|buildImpactLedger\(|postImpact|applyInsightAction\(/.test(syncBlock[0]), "Notification sync must not create food events, Pantry mutations, impact credit, or pattern changes.");

const actionBlock = app.match(/function openFoodRescueNotificationAction[\s\S]*?function openClearNotificationsConfirm/);
assert(actionBlock, "openFoodRescueNotificationAction block is missing.");
assert(actionBlock[0].includes("openCookBeforeItSpoils"), "Attention action must route into existing Food Rescue.");
assert(actionBlock[0].includes("searchRecipes"), "Planning action must route into existing recipe search.");
assert(actionBlock[0].includes("FREEZER_STATUS_FILTERS.QUALITY_REMINDER_DUE"), "Freezer action must route into the existing Freezer Inventory view.");
assert(actionBlock[0].includes("filterWasteDiaryByPattern"), "Pattern action must route into existing evidence review.");
assert(!/executePantryCommand|commitPantrySnapshotAndFoodEvents|appendFoodEventsToHistory|applyInsightAction|resolveFreezerQualityReminderForItem|releaseMealReservations|recordImpact|buildImpactLedger/.test(actionBlock[0]), "Notification actions must not create physical outcomes, release reservations, apply patterns, or create impact credit.");

assert(app.includes("Best before today"), "Best-before wording must stay precise.");
assert(app.includes("Recorded expiration date today"), "True expiration wording must stay precise.");
assert(app.includes("Use soon — estimated freshness window"), "Estimated freshness must not be called expiration.");
assert(app.includes("Leftover — use or freeze today"), "Leftover timeline wording must remain distinct.");
assert(app.includes("Date needs confirmation"), "Date-review wording must be preserved.");
assert(app.includes("This is a quality and planning reminder, not an expiration notice."), "Freezer reminders must not be expiration notices.");
assert(app.includes("This is a possible planning pattern, not a confirmed habit."), "Pattern reminders must remain cautious.");
assert(!app.includes("You frequently waste"), "Judgmental waste wording must not be introduced.");
assert(!app.includes("You keep buying too much"), "Judgmental purchasing wording must not be introduced.");

["foodRescueNotification: true", "notificationStatus", "sourceReferences", "sourceRevisions", "deliveryLog", "privacyPreviewLevel", "capabilityNote"].forEach((token) => assert(app.includes(token), `${token} metadata is required on saved notifications.`));
assert(app.includes("Browser reminders depend on browser permission and platform support."), "Browser delivery must be represented honestly.");
assert(!app.includes("Notification.requestPermission()"), "Step 41 must not request browser permission on load.");

[".notification-level-label", ".food-rescue-notification-items", ".food-rescue-notification-stale"].forEach((selector) => assert(css.includes(selector), `${selector} styling is required.`));
assert(/@media[\s\S]*\.food-rescue-notification-items li[\s\S]*grid-template-columns:\s*1fr/.test(css), "Food-rescue notification source rows must stack on mobile.");

[
  "# Chef Nova Food-Rescue Notification Levels",
  "## 4. Notification Levels",
  "## 5. Safety Precedence",
  "## 12. Possible Pattern Reminders",
  "## 24. Pattern Boundary",
  "## 25. Impact Ledger Boundary",
  "## 32. Deferred Work"
].forEach((token) => assert(doc.includes(token), `Documentation must include ${token}.`));

[
  "Second Notification Centres created: 0",
  "Second notification schedulers created: 0",
  "Notification delivery creating Food Event History physical events: 0",
  "Notification opening creating Pantry deductions: 0",
  "Notification dismissal marking food used or discarded: 0",
  "Notification actions marking food frozen automatically: 0",
  "Notification interactions creating Impact Ledger credit: 0",
  "Attention reminders recommending hard-excluded food: 0",
  "True-expired food recommended for consumption: 0",
  "Best-before dates represented as expiration dates: 0",
  "App-estimated freshness represented as expiration: 0",
  "Pattern reminders surfaced after one or two incidents: 0",
  "Pattern reminders using judgmental wording: 0",
  "Browser permission requested automatically on first load: 0",
  "Unsupported background delivery described as guaranteed: 0",
  "Guest notification data persisted into registered-user storage automatically: 0"
].forEach((token) => assert(report.includes(token), `Report must include ${token}.`));

console.log("Step 41 food-rescue notification static checks passed.");
