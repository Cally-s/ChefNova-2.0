const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `${name} exists`);
  const next = app.indexOf("\n  function ", start + 1);
  return app.slice(start, next === -1 ? app.length : next);
}

(function run() {
  const profileSections = extractFunction("getProfileSections");
  const accountRenderer = extractFunction("renderAccountPage");
  const overviewRenderer = extractFunction("renderProfileOverview");
  const loadingRenderer = extractFunction("renderProfileLoadingState");
  const errorRenderer = extractFunction("renderProfileErrorState");
  const routeNormalizer = extractFunction("normalizeInternalRoute");
  const clickHandler = app.slice(app.indexOf("const profileRetry = event.target.closest"), app.indexOf("const bodyReferenceToggle", app.indexOf("const profileRetry")));

  assert(app.includes("function getAccessibilityPreferences"), "Missing accessibility helper is restored");
  assert(profileSections.includes("const accessibility = getAccessibilityPreferences()"), "Profile section summaries use the restored helper");
  assert(profileSections.includes("const safeUser = user || {}"), "Profile section summaries tolerate partial user data");
  assert(profileSections.includes("safeUser.id ? getNutritionProfile(safeUser.id) : null"), "Missing user IDs do not crash nutrition summary");
  assert(profileSections.includes("accessibility.display || {}"), "Accessibility summary reads the normalized display domain safely");

  assert(overviewRenderer.includes("const safeUser = user || {}"), "Profile overview tolerates missing optional user fields");
  assert(overviewRenderer.includes("Chef Nova User"), "Missing display name uses a safe fallback");
  assert(overviewRenderer.includes("Profile saved on this device."), "Missing email uses a safe fallback");
  assert(overviewRenderer.includes("renderUserAvatar(safeUser"), "Missing profile picture uses the existing default avatar renderer");
  assert(overviewRenderer.includes("profile-section-grid"), "Profile Overview renders section cards");

  assert(accountRenderer.includes("getProfileAccountState()"), "Profile renderer uses explicit account states");
  assert(accountRenderer.includes("renderProfileLoadingState()"), "Loading state never renders blank");
  assert(accountRenderer.includes("renderProfileErrorState()"), "Error state never renders blank");
  assert(accountRenderer.includes("try {"), "Profile rendering is guarded by an error boundary");
  assert(accountRenderer.includes("console.error(\"Unable to render Profile page:\""), "Profile render errors are not swallowed silently");
  assert(!accountRenderer.includes("if (!state.currentUser) return;"), "Registered renderer no longer returns blank for unresolved states");

  assert(loadingRenderer.includes("Loading your profile..."), "Loading state has visible text");
  assert(errorRenderer.includes("Profile could not be loaded"), "Error state has a clear heading");
  assert(errorRenderer.includes("Your Chef Nova data has not been changed."), "Error state reassures data is unchanged");
  assert(errorRenderer.includes("data-profile-retry"), "Error state exposes Try Again");
  assert(errorRenderer.includes("data-return-button"), "Error state uses existing history-based Return behavior");
  assert(!errorRenderer.includes("Error:"), "No blank Error label is introduced");

  assert(routeNormalizer.includes("normalized === \"profile\""), "Direct #profile route maps to the Profile page");
  assert(routeNormalizer.includes("profile/"), "Direct #profile subroutes map to Profile subpages");
  assert(clickHandler.includes("renderAccountPage()"), "Try Again rerenders the Profile page");

  assert(css.includes(".profile-state-card"), "Visible loading/error Profile state card is styled");
  assert(css.includes(".profile-state-card--error"), "Error Profile state has distinct styling");
  assert(css.includes(".profile-section-grid") && css.includes("repeat(3, minmax(0, 1fr))"), "Profile card grid remains responsive");

  console.log("Profile Overview empty-page regression checks passed.");
})();
