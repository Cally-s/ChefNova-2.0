const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-prevent-notification-fatigue.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-42-report.md"), "utf8");

[
  "FOOD_RESCUE_REMINDER_CADENCES",
  "DAILY: \"daily\"",
  "EVERY_TWO_DAYS: \"every-two-days\"",
  "TWICE_PER_WEEK: \"twice-per-week\"",
  "ATTENTION_ONLY: \"attention-only\"",
  "OFF: \"off\"",
  "FOOD_RESCUE_NOTIFICATION_PREFERENCE_VERSION = 2",
  "SOURCE_NOTIFICATION_STATE_VERSION = 1",
  "NOTIFICATION_DELIVERY_ELIGIBILITY_VERSION = 1",
  "NOTIFICATION_DEFERRAL_VERSION = 1",
  "REMINDER_DELIVERY_WINDOW_VERSION = 1",
  "NOTIFICATION_DELIVERY_LOG_VERSION = 2",
  "NOTIFICATION_FATIGUE_POLICY_VERSION = 1"
].forEach((token) => assert(app.includes(token), `${token} is required.`));

[
  "GLOBAL_REMINDERS_OFF: \"global-reminders-off\"",
  "PREFERRED_TIME_NOT_REACHED: \"preferred-time-not-reached\"",
  "ALREADY_DELIVERED_IN_WINDOW: \"already-delivered-in-window\"",
  "SOURCE_FULLY_RESERVED: \"source-fully-reserved\"",
  "SOURCE_CONFIRMED_FROZEN: \"source-confirmed-frozen\"",
  "SOURCE_QUANTITY_ZERO: \"source-quantity-zero\"",
  "SOURCE_SNOOZED: \"source-snoozed\"",
  "SOURCE_DISMISSED_UNTIL: \"source-dismissed-until\"",
  "BUNDLE_COVERED_BY_HIGHER_LEVEL: \"bundle-covered-by-higher-level\"",
  "CATEGORY_COOLDOWN: \"category-cooldown\"",
  "PATTERN_NO_LONGER_ACTIVE: \"pattern-no-longer-active\""
].forEach((token) => assert(app.includes(token), `${token} suppression reason is required.`));

[
  "function createDefaultFoodRescueNotificationPreferences",
  "function normalizeFoodRescueNotificationPreferences",
  "function getFoodRescueNotificationPreferences",
  "function writeStoredFoodRescueNotificationPreferences",
  "function renderFoodRescueReminderSettings",
  "function readFoodRescueReminderSettingsForm",
  "function validateFoodRescueReminderSettings",
  "function updateFoodRescueReminderSettingsUI",
  "function saveFoodRescueReminderSettings",
  "function createSourceNotificationState",
  "function getReminderDeliveryWindow",
  "function evaluateFoodRescueNotificationDeliveryEligibility",
  "function applyFoodRescueSuppressionAndFatiguePolicy",
  "function createNotificationDeferral",
  "function resolveFoodRescueDeferralDateTime",
  "function readNotificationDeferralChoice"
].forEach((token) => assert(app.includes(token), `${token} is required.`));

assert(app.includes("chefNovaGuestNotificationPreferences"), "Guest reminder preferences must use temporary session storage.");
assert(app.includes("NotificationPreferences: \"chefNovaNotificationPreferences\""), "Registered reminder preferences must use user-scoped storage.");
assert(app.includes("originalMigratedSettings"), "Legacy preference evidence must be preserved.");
assert(app.includes("Choose two different weekdays for twice-per-week reminders."), "Duplicate or missing twice-weekly days must be rejected.");
assert(app.includes("isLocalTimeInQuietHours"), "Preferred time must be checked against quiet hours.");
assert(app.includes("formatLocalTimeForReminderSummary"), "Preferred local time must be shown clearly.");
assert(app.includes("getNextFoodRescueReminderWindow"), "Current reminder schedule summary is required.");
assert(app.includes("At the next scheduled reminder"), "Deferral UI must support next scheduled reminder.");
assert(app.includes("notificationDeferralVersion"), "Deferrals must be versioned.");
assert(app.includes("cadenceWindowId"), "Delivery windows must have stable cadence IDs.");
assert(app.includes("sourceSetHash"), "Source-set deduplication is required.");
assert(app.includes("applyFoodRescueSuppressionAndFatiguePolicy(buildFoodRescueNotificationCandidates()"), "Sync must use the single fatigue policy layer.");
assert(app.includes("foodRescueNotification && inactiveStatuses.includes"), "Notification badge must avoid inactive food-rescue records.");
assert(html.includes("Reminder settings change timing only. They do not change food dates, storage timelines, or safety eligibility."), "Settings UI must explain timing-only scope.");

const syncBlock = app.match(/function syncFoodRescueNotifications[\s\S]*?function readNotificationDeferralChoice/);
assert(syncBlock, "Food-rescue sync and deferral block is missing.");
assert(!/setInterval|setTimeout\([^)]*pantry|dailyFoodTimer|perItemNotificationTimer|notificationFatigueScheduler|foodRescueFrequencyScheduler|suppressedFoodDatabase|notificationPantryState/.test(syncBlock[0]), "Step 42 must not create a second scheduler, per-item timer, or duplicate suppression database.");
assert(!/appendFoodEventsToHistory|commitPantrySnapshotAndFoodEvents|executePantryCommand|buildImpactLedger\(|postImpact|applyInsightAction\(/.test(syncBlock[0]), "Notification sync and deferrals must not create physical events, Pantry mutations, impact credit, or pattern evidence.");

[
  "FOOD-RESCUE REMINDERS",
  "How often should Chef Nova send proactive food-rescue reminders?",
  "value=\"daily\"",
  "value=\"every-two-days\"",
  "value=\"twice-per-week\"",
  "value=\"attention-only\"",
  "value=\"off\"",
  "Preferred time",
  "Quiet hours",
  "Reminder categories",
  "External notification preview",
  "Save Reminder Settings",
  "foodRescueTwiceWeeklyControls",
  "foodRescueReminderSummary"
].forEach((token) => assert(html.includes(token), `${token} must appear in the settings UI.`));

[
  ".food-rescue-reminder-settings",
  ".reminder-cadence-options",
  ".reminder-time-grid",
  ".twice-weekly-controls",
  ".reminder-schedule-summary",
  ".notification-deferral-controls"
].forEach((selector) => assert(css.includes(selector), `${selector} styling is required.`));
assert(/@media[\s\S]*\.notification-deferral-controls[\s\S]*grid-template-columns:\s*1fr/.test(css), "Reminder and deferral controls must stack on mobile.");

[
  "# Chef Nova Notification Fatigue Protection",
  "## 3. Cadence as a Maximum",
  "## 7. Twice-Per-Week Behavior",
  "## 14. Source Notification State",
  "## 22. Snooze and Dismiss Until",
  "## 35. Notification Centre Badges",
  "## 37. Food Event History Boundary",
  "## 38. Impact Ledger Boundary",
  "## 44. Deferred Work"
].forEach((token) => assert(doc.includes(token), `Documentation must include ${token}.`));

[
  "Second notification schedulers created: 0",
  "One timer created per Pantry item: 0",
  "Empty reminders sent on scheduled cadence days: 0",
  "Twice-per-week cadence using hidden unconfirmed weekdays: 0",
  "Duplicate weekdays accepted: 0",
  "Preferred time ignored: 0",
  "Quiet hours bypassed: 0",
  "Fully reserved quantities receiving competing food-use reminders: 0",
  "Partially reserved items suppressed completely: 0",
  "Zero-quantity food continuing reminders: 0",
  "Unknown quantity treated as zero: 0",
  "Notification interaction creating physical Food Event History events: 0",
  "Notification interaction creating Impact Ledger credit: 0",
  "Guest reminder settings persisted into registered-user storage automatically: 0"
].forEach((token) => assert(report.includes(token), `Report must include ${token}.`));

console.log("Step 42 notification fatigue static checks passed.");
