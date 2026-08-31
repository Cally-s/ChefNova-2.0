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
  const navigate = extractFunction("navigate");
  const accountRenderer = extractFunction("renderAccountPage");
  const registeredRenderer = extractFunction("renderRegisteredProfileSection");
  const overviewRenderer = extractFunction("renderProfileOverview");
  const subnavRenderer = extractFunction("renderProfileSubnav");
  const privacyRenderer = extractFunction("renderPrivacyProfilePage");
  const dataRenderer = extractFunction("renderDataAccountProfilePage");
  const personalRenderer = extractFunction("renderPersonalProfilePage");
  const foodRenderer = extractFunction("renderFoodPreferencesProfilePage");
  const securityRenderer = extractFunction("renderSecurityProfilePage");
  const notFoundRenderer = extractFunction("renderProfileNotFoundPage");

  assert(app.includes("profileSection: \"overview\""), "Profile route state is tracked");
  assert(app.includes("const PROFILE_SECTION_IDS"), "Profile sections use one source of truth");
  assert(app.includes("function buildProfileHash"), "Profile subroutes have hash builder");
  assert(navigate.includes("state.profileSection = normalizeProfileSection(profileSubpage)"), "navigate resolves account subroutes");
  assert(navigate.includes("buildProfileHash"), "navigate writes account subroute hashes");
  assert(navigate.includes("$(\"#profilePageTitle\")?.focus"), "Profile pages receive focus after navigation");
  assert(navigate.includes("captureProfileEditDraft()"), "Profile edit drafts are captured before route changes");

  assert(accountRenderer.includes("renderRegisteredProfileSection(user, state.profileSection"), "registered users render the route-aware Profile view");
  assert(!accountRenderer.includes("${renderLocalizationPreferencesSection()}"), "registered Profile no longer renders every settings section at once");
  assert(overviewRenderer.includes("profile-section-grid"), "overview renders navigation cards");
  assert(overviewRenderer.includes("data-page=\"account/"), "overview cards link to Profile subpages");
  assert(subnavRenderer.includes("aria-current=\"page\""), "subpage navigation marks the current Profile page");

  [
    "Personal Profile",
    "Language & Region",
    "Accessibility",
    "Food Preferences & Safety",
    "Privacy & Voice",
    "Account Security",
    "Notifications",
    "Data & Account"
  ].forEach((label) => assert(app.includes(label), `${label} Profile section exists`));

  assert(registeredRenderer.includes("renderLocalizationPreferencesSection()"), "Language & Region keeps existing controls");
  assert(registeredRenderer.includes("renderAccessibilityRecoverySettingsSection()"), "Accessibility keeps existing controls");
  assert(privacyRenderer.includes("renderOfflineSettingsSection()"), "Privacy page keeps offline settings");
  assert(dataRenderer.includes("renderContentReviewDashboardSection()"), "Data & Account keeps content review tools");
  assert(securityRenderer.includes("renderPasswordChangeForm()"), "Security keeps password change");
  assert(personalRenderer.includes("renderProfileEditForm(user)") && foodRenderer.includes("renderProfileEditForm(user)"), "Personal and food settings keep existing profile editing");
  assert(notFoundRenderer.includes("This Profile section could not be found."), "unknown Profile routes show a friendly not-found message");
  assert(app.includes("profileEditDraft: null"), "Profile edit draft state exists");
  assert(app.includes("function captureProfileEditDraft"), "Profile edit drafts can be preserved during navigation");

  assert(css.includes(".profile-section-grid") && css.includes("repeat(3, minmax(0, 1fr))"), "Profile overview cards use 3-column desktop grid");
  assert(css.includes(".profile-subnav"), "Profile subpage navigation is styled");
  assert(css.includes(".profile-section-card:hover") && css.includes("transform: translateY(-3px)"), "Profile cards retain modern hover feedback");
  assert(css.includes("@media (max-width: 980px)") && css.includes(".profile-section-grid"), "Profile cards have tablet responsive rules");
  assert(css.includes("@media (max-width: 640px)") && css.includes(".profile-status-grid"), "Profile cards have mobile responsive rules");

  console.log("Registered Profile subpage static checks passed.");
})();
