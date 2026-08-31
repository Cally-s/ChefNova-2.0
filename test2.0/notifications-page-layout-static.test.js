const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function sectionMarkup(id) {
  const start = html.indexOf(`<section class="page" id="${id}"`);
  assert(start >= 0, `${id} should exist.`);
  const nextPage = html.indexOf('<section class="page"', start + 1);
  return html.slice(start, nextPage >= 0 ? nextPage : html.length);
}

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `Missing ${name}.`);
  const open = app.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") {
      depth -= 1;
      if (depth === 0) return app.slice(start, index + 1);
    }
  }
  throw new Error(`${name} body was not closed.`);
}

const notificationPage = sectionMarkup("notifications-page");

assert(notificationPage.includes("<h1>Notifications</h1>"), "Notifications page should begin with one clear page heading.");
assert(notificationPage.includes('class="notifications-page__layout"'), "Notifications page should use the main-and-aside layout wrapper.");
assert(notificationPage.includes('<main class="notifications-page__main"'), "Notification list content should be in a main region.");
assert(notificationPage.includes('<aside class="notifications-page__settings"'), "Notification settings should be in an aside.");
assert(notificationPage.indexOf('<main class="notifications-page__main"') < notificationPage.indexOf('<aside class="notifications-page__settings"'), "Notifications must appear before settings in DOM order.");
assert(notificationPage.indexOf('id="notificationFilters"') < notificationPage.indexOf('id="foodRescueReminderSettingsForm"'), "Keyboard users should reach notification filters before settings.");
assert(notificationPage.indexOf('id="notificationList"') < notificationPage.indexOf('id="foodRescueReminderSettingsForm"'), "Notification list should render before the settings form.");
assert(notificationPage.includes('id="notificationsUnreadCount"'), "Unread count remains in the notification content area.");
assert(notificationPage.includes('id="foodRescueReminderSettingsTitle">Notification Settings</h2>'), "Settings aside should have an accessible Notification Settings heading.");
assert((notificationPage.match(/id="foodRescueReminderSettingsTitle"/g) || []).length === 1, "Notification Settings heading should not be duplicated.");
assert((notificationPage.match(/id="foodRescueReminderSettingsForm"/g) || []).length === 1, "Notification Settings form should not be duplicated.");
assert(notificationPage.includes('class="notification-settings-panel-toggle"'), "Mobile settings disclosure should exist.");
assert(notificationPage.includes('aria-controls="foodRescueReminderSettingsForm"'), "Mobile disclosure should control the existing settings form.");
assert((notificationPage.match(/data-notification-settings-toggle=/g) || []).length === 3, "Settings should be organized into compact collapsible groups.");
assert((notificationPage.match(/aria-expanded="false"/g) || []).length >= 4, "Settings groups and mobile disclosure should be collapsed by default.");
assert((notificationPage.match(/class="notification-settings-group__panel"/g) || []).length === 3, "Each settings group should have one panel.");
assert((notificationPage.match(/role="region"/g) || []).length >= 3, "Accordion panels should expose accessible regions.");
assert((notificationPage.match(/hidden>/g) || []).length >= 3, "Collapsed group controls should be removed from keyboard navigation.");
assert(notificationPage.includes('data-notification-settings-summary="categories"'), "Group headers should include enabled-count summaries.");
assert(notificationPage.includes('name="foodRescueReminderCadence"'), "Frequency settings remain available.");
assert(notificationPage.includes('name="foodRescueReminderLevel"'), "Reminder category settings remain available.");
assert(notificationPage.includes('name="foodRescueExternalPreview"'), "Preview privacy settings remain available.");
assert(!notificationPage.includes("Back to Home") && !notificationPage.includes("Back to Profile"), "Notifications page should not add replacement back controls.");

assert(app.includes('notifications: { level: ROUTE_NAVIGATION_LEVELS.SUBPAGE, showReturnButton: false }'), "Notifications route should explicitly opt out of the shared Return button.");
assert(extractFunction("renderReturnButton").includes("currentRouteAllowsReturnButton()"), "Shared Return renderer should respect route-level opt-outs.");
assert(extractFunction("renderTopbarNotificationButton").includes('data-page="notifications"'), "Topbar notification bell should still open the Notifications page.");
assert(app.includes("notificationSettingsOpenGroup"), "Accordion open state should be tracked only in page-session state.");
assert(extractFunction("toggleNotificationSettingsGroup").includes('state.notificationSettingsOpenGroup === groupId ? "" : groupId'), "Opening an active group should close it.");
assert(extractFunction("updateNotificationSettingsAccordion").includes("panel.hidden = !isOpen"), "Only the active group panel should remain available to keyboard users.");
assert(extractFunction("updateNotificationSettingsSummaries").includes("enabled"), "Settings group summaries should show enabled counts.");
assert(extractFunction("saveFoodRescueReminderSettings").includes("writeStoredFoodRescueNotificationPreferences(preferences)"), "Existing settings persistence should remain unchanged.");

assert(css.includes(".notifications-page__layout"), "Notification layout styles should exist.");
assert(css.includes("grid-template-columns: minmax(0, 2fr) minmax(18rem, 0.8fr)"), "Desktop layout should give notifications the wider column.");
assert(css.includes(".notifications-page__settings") && css.includes("position: sticky"), "Desktop settings panel may stay visible without covering content.");
assert(css.includes("@media (max-width: 950px)") && css.includes(".notifications-page__layout") && css.includes("grid-template-columns: 1fr"), "Tablet and mobile layouts should stack content.");
assert(css.includes("@media (max-width: 640px)") && css.includes(".notifications-page__settings .reminder-cadence-options"), "Phone layout should keep settings controls readable.");
assert(css.includes(".notification-settings-group__trigger") && css.includes("aria-hidden"), "Accordion triggers and chevrons should be styled as full-width controls.");
assert(css.includes(".notification-settings-group__panel[hidden]") && css.includes("display: none"), "Collapsed panels should not be visually or keyboard reachable.");
assert(css.includes(".notification-settings-panel-toggle") && css.includes(".food-rescue-reminder-form.notification-settings-panel-open"), "Mobile settings should be collapsed until opened.");
assert(!/notifications-page__settings[\s\S]{0,260}(overflow-y:\s*auto|max-height:\s*70vh)/.test(css), "Settings panel should not use a nested scrollbar.");

console.log("Notifications page layout static checks passed.");
