const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `Missing ${name}`);
  const open = app.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") {
      depth -= 1;
      if (depth === 0) return app.slice(start, index + 1);
    }
  }
  throw new Error(`Could not extract ${name}`);
}

function extractCssRule(selector) {
  const start = css.indexOf(selector);
  assert(start >= 0, `Missing CSS selector: ${selector}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(start, index + 1);
    }
  }
  throw new Error(`Could not extract CSS rule for ${selector}`);
}

assert(html.includes('<div class="account-area" id="accountArea" aria-label="Account and profile"></div>'), "Topbar account area remains the single header action container");
assert(html.includes('data-page-section="notifications"'), "Existing Notifications page route remains present");
assert(html.includes('id="notificationsUnreadCount"'), "Notifications page keeps the unread count display");

const renderAccount = extractFunction("renderAccount");
assert(renderAccount.includes("renderTopbarNotificationButton()"), "Registered account header renders the notification button beside the profile menu");
assert(renderAccount.includes('state.guestMode ? "" : `<button class="top-login-button"'), "Guest header does not receive a broken account-only bell");
assert(renderAccount.indexOf("if (!state.currentUser)") < renderAccount.indexOf("renderTopbarNotificationButton()"), "Bell is rendered only after a registered user exists");

const renderTopbarButton = extractFunction("renderTopbarNotificationButton");
assert(renderTopbarButton.includes("getUnreadNotificationCount()"), "Bell badge uses the real unread-notification count");
assert(renderTopbarButton.includes('data-page="notifications"'), "Bell opens the existing Notifications route");
assert(renderTopbarButton.includes('aria-label="${escapeHtml(label)}"'), "Bell exposes an accessible name");
assert(renderTopbarButton.includes('t("openNotifications"'), "Accessible label uses app-language translations");
assert(renderTopbarButton.includes("notification-button__badge") && renderTopbarButton.includes('count > 0 ? "" : "hidden"'), "Unread badge appears only for nonzero real counts");
assert(renderTopbarButton.includes("<svg") && renderTopbarButton.includes("aria-hidden=\"true\""), "Bell uses an SVG icon hidden from assistive technology");
assert(!renderTopbarButton.includes("Notifications</button>"), "Topbar control does not use the word Notifications as visible text");

const badgeUpdater = extractFunction("updateNotificationBadge");
assert(badgeUpdater.includes('$("#notificationBadge")'), "Existing sidebar badge remains supported");
assert(badgeUpdater.includes('$("#topbarNotificationBadge")'), "Topbar badge stays synchronized");
assert(badgeUpdater.includes('$(".notification-button")'), "Topbar button accessible label and active state are refreshed");
assert(badgeUpdater.includes("getInternalRoutePath(getCurrentInternalRoute()) === \"notifications\""), "Bell active state reflects the current Notifications route");
assert(badgeUpdater.includes("count > 99 ? \"99+\""), "Large unread counts are capped without fabrication");

const navigate = extractFunction("navigate");
assert(navigate.includes("updateNotificationBadge();") && navigate.indexOf("updateNotificationBadge();") > navigate.indexOf('if (page === "notifications") displayNotifications();'), "Navigation refreshes topbar bell state after route changes");

assert(app.includes('notifications: { level: ROUTE_NAVIGATION_LEVELS.SUBPAGE, showReturnButton: false }'), "Notifications route keeps history metadata while opting out of the shared Return button");
const returnRenderer = extractFunction("renderReturnButton");
assert(returnRenderer.includes("currentRouteAllowsReturnButton()"), "Shared Return renderer respects the Notifications opt-out");
assert(app.includes("readUserStorage(KEYS.notifications, [])"), "Registered notifications are read from user-specific storage");
assert(app.includes("writeUserStorage(KEYS.notifications"), "Registered notifications are saved to user-specific storage");
assert(app.includes("guestSessionData.notifications"), "Guest notifications remain session-scoped when used by existing flows");

["openNotifications: \"Open notifications\"", "openNotifications: \"Ouvrir les notifications\"", "openNotifications: \"打开通知\"", "openNotifications: \"فتح الإشعارات\""].forEach((text) => {
  assert(app.includes(text), `${text} translation is available`);
});

const accountAreaRule = extractCssRule(".account-area");
assert(accountAreaRule.includes("display: flex") && accountAreaRule.includes("align-items: center"), "Header actions use normal inline layout");
assert(accountAreaRule.includes("margin-inline-start: auto"), "Header actions sit at the logical end of the topbar");

const buttonRule = extractCssRule(".notification-button");
assert(buttonRule.includes("width: 44px") && buttonRule.includes("height: 44px"), "Bell has a compact accessible touch target");
assert(buttonRule.includes("border-radius: 50%"), "Bell button is circular");
assert(buttonRule.includes("position: relative"), "Badge is attached to the bell button");
assert(!buttonRule.includes("position: absolute") && !buttonRule.includes("z-index"), "Bell is not floating over page content");

const iconRule = extractCssRule(".notification-button__icon");
assert(iconRule.includes("width: 22px") && iconRule.includes("height: 22px"), "Bell icon is smaller than the touch target");
assert(iconRule.includes("stroke: currentColor"), "Bell icon inherits accessible color");

const badgeRule = extractCssRule(".notification-button__badge");
assert(badgeRule.includes("inset-block-start") && badgeRule.includes("inset-inline-end"), "Badge uses logical positioning for RTL");
assert(badgeRule.includes("min-width: 20px") && badgeRule.includes("height: 20px"), "Badge stays small and attached to the icon");

assert(css.includes(".notification-button:focus-visible"), "Bell has a visible keyboard focus style");
assert(css.includes(".large-buttons-mode .notification-button") && !extractCssRule(".large-buttons-mode .notification-button").includes("60px"), "Large-button mode does not make the bell enormous");
assert(css.includes("@media (forced-colors: active)") && css.includes(".notification-button__badge"), "Forced-colors mode keeps the bell and badge visible");
assert(css.includes("@media (max-width: 820px)") && css.includes(".notification-button__icon"), "Mobile header adjusts bell sizing");

console.log("Topbar notification button static checks passed.");
