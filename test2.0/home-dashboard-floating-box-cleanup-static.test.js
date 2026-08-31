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

function extractCssRule(selector) {
  const start = css.indexOf(selector);
  assert(start >= 0, `${selector} CSS exists`);
  const end = css.indexOf("}", start);
  return css.slice(start, end + 1);
}

(function run() {
  const dashboardStats = extractFunction("updateDashboardStats");
  const homeMarkupStart = html.indexOf('id="home-page"');
  const homeMarkupEnd = html.indexOf('id="recipes-page"', homeMarkupStart);
  const homeMarkup = html.slice(homeMarkupStart, homeMarkupEnd);
  const guestBannerCss = extractCssRule(".guest-mode-banner");

  assert(homeMarkup.includes('id="dashboardStats"'), "home keeps a dashboard summary mount");
  assert(!homeMarkup.includes("Open Cook Before It Spoils"), "Cook Before It Spoils is not hard-coded into the home page");
  assert(!homeMarkup.includes("Review Freeze Today Items"), "Freeze Today action is not hard-coded into the home page");
  assert(!homeMarkup.includes("Measurements can be approximate."), "measurement guidance is not hard-coded into the home page");

  assert(dashboardStats.includes("const primaryCards = ["), "dashboard summary is assembled from a primary card row");
  assert(dashboardStats.includes("const secondaryCards = ["), "dashboard summary is assembled from a secondary card row");
  assert(dashboardStats.includes("const hasActiveKitchen = Boolean"), "dashboard specialty actions require an active user or guest kitchen");
  assert(dashboardStats.includes("if (hasActiveKitchen && attentionModel.highUseFirstCount > 0)"), "Cook Before It Spoils dashboard action requires actual high-priority pantry attention");
  assert(dashboardStats.includes("if (hasActiveKitchen && attentionModel.freezeTodayCount > 0)"), "Freeze Today dashboard action requires actual freeze-today reminders");
  assert(dashboardStats.includes("if (hasActiveKitchen && recentDiscardCount > 0)"), "Waste Diary dashboard action requires existing recent discard records");
  assert(!dashboardStats.includes("<small>Measurements can be approximate.</small>"), "measurement helper copy is not shown as a home dashboard card");

  assert(app.includes('<p>Recent discarded-food records. Measurements can be approximate.</p>'), "measurement guidance remains in the Waste Diary context");
  assert(!html.includes("languageSettingsPanel"), "language settings floating panel is not restored");
  assert(!html.includes("accessibilityRecoveryButton"), "floating accessibility recovery button is not restored");
  assert(html.includes('id="guestModeBanner"'), "single guest banner mount remains");
  assert(!guestBannerCss.includes("position: fixed") && !guestBannerCss.includes("position: sticky"), "guest banner remains inline and non-floating");

  console.log("Home dashboard floating-box cleanup static tests passed.");
})();
