const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `${name} exists`);
  const next = app.indexOf("\n  function ", start + 1);
  return app.slice(start, next === -1 ? app.length : next);
}

function extractConst(name) {
  const match = app.match(new RegExp(`const ${name} = \\[[^\\]]*\\];`));
  assert(match, `${name} exists`);
  return match[0];
}

function extractCssRule(selector) {
  const start = css.indexOf(selector);
  assert(start >= 0, `${selector} CSS exists`);
  const end = css.indexOf("}", start);
  return css.slice(start, end + 1);
}

(function run() {
  const banner = extractFunction("renderGuestModeBanner");
  const showBanner = extractFunction("showGuestBanner");
  const hideBanner = extractFunction("hideGuestBanner");
  const accountHeader = extractFunction("renderAccount");
  const guestPanel = extractFunction("renderGuestAccountPanel");
  const dashboardWelcome = extractFunction("updateDashboardWelcome");
  const guestNotice = extractFunction("guestNotice");
  const guestNavItems = extractConst("GUEST_NAV_ITEMS");
  const bannerCss = extractCssRule(".guest-mode-banner");

  assert(html.includes("id=\"guestModeBanner\""), "single guest banner mount exists");
  assert(html.includes("role=\"region\"") && html.includes("aria-labelledby=\"guestModeBannerTitle\""), "banner is an informational region with a clear heading");
  assert(!html.includes("You are using Chef Nova as a guest. Create an account to save your progress."), "old duplicated guest message is removed from HTML");
  assert(!html.includes("data-nav-item=\"signup\""), "sidebar Sign Up guest action is removed");
  assert(!html.includes("data-nav-item=\"login\""), "sidebar Log In guest action is removed");
  assert(!html.includes("data-nav-item=\"exitGuest\""), "sidebar Exit Guest Mode action is removed");
  assert(!html.includes("guestDashboardActions"), "dashboard guest action row is removed");

  assert(showBanner.includes("renderGuestModeBanner()"), "guest banner renders from one reusable component");
  assert(hideBanner.includes("banner.innerHTML = \"\""), "hidden banner removes controls from the accessibility tree");
  assert(!showBanner.includes(".focus"), "guest banner is not focused automatically");

  assert(banner.includes("Guest Mode"), "banner includes Guest Mode heading");
  assert(banner.includes("Your progress is temporary and will not be saved after this session."), "banner includes compact temporary-progress message");
  assert.strictEqual((banner.match(/data-guest-auth="register"/g) || []).length, 1, "banner has one Create Account action");
  assert.strictEqual((banner.match(/data-guest-auth="login"/g) || []).length, 1, "banner has one Log In action");
  assert.strictEqual((banner.match(/data-exit-guest/g) || []).length, 1, "banner has one Exit Guest Mode action");

  assert(!accountHeader.includes("guest-status"), "top account area no longer renders guest status");
  assert(!accountHeader.includes("data-exit-guest"), "top account area no longer renders guest exit button");
  assert(!guestPanel.includes("data-guest-auth"), "guest account panel no longer duplicates auth actions");
  assert(!guestPanel.includes("data-exit-guest"), "guest account panel no longer duplicates exit action");
  assert(!guestPanel.includes("Guest progress is temporary. Create an account or log in to save it."), "old guest profile card copy is removed");

  assert(!guestNavItems.includes("signup") && !guestNavItems.includes("login") && !guestNavItems.includes("exitGuest"), "guest sidebar no longer exposes duplicate guest actions");
  assert(dashboardWelcome.includes("hideHomeCreateAccountSection();"), "guest dashboard hides the extra Create Account hero button");
  assert(!dashboardWelcome.includes("guestActions"), "guest dashboard action row logic is removed");
  assert(guestNotice.includes("return \"\""), "page-level guest notices are disabled so the banner is the single notice");

  assert(!bannerCss.includes("position: sticky") && !bannerCss.includes("position: fixed"), "banner is not sticky or fixed");
  assert(css.includes(".guest-mode-copy h2"), "banner has visible text heading styling");
  assert(css.includes(".guest-banner-actions .button"), "banner buttons remain responsive on mobile");
  assert(!css.includes(".guest-status"), "obsolete guest status CSS is removed");
  assert(!css.includes(".guest-profile-actions"), "obsolete guest profile action CSS is removed");
  assert(!css.includes(".guest-page-notice"), "obsolete duplicate page notice CSS is removed");

  console.log("Guest Mode single banner static tests passed.");
})();
