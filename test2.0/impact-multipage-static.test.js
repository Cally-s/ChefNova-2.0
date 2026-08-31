const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function bodyOf(functionName) {
  const start = app.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} must exist`);
  const next = app.indexOf("\n  function ", start + 12);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "getMonthlyImpactSections",
  "buildMonthlyImpactHash",
  "renderMonthlyImpactOverview",
  "renderMonthlyImpactFoodRescuePage",
  "renderMonthlyImpactWasteDiaryPage",
  "renderMonthlyImpactSavingsPage",
  "renderMonthlyImpactFoodProtectedPage",
  "renderMonthlyImpactTrendsPage",
  "renderMonthlyImpactUnknownRoute",
  "renderMonthlyImpactSectionNavigation"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} should be implemented.`));

assert(html.includes('id="monthlyImpactPageTitle"'), "Impact page heading should be focusable for routed views.");

const sections = bodyOf("getMonthlyImpactSections");
[
  "food-rescue",
  "waste-diary",
  "savings",
  "food-protected",
  "trends"
].forEach((route) => assert(sections.includes(route), `${route} route should be available.`));
assert(!sections.includes("environment"), "Environmental Impact route should not be created while environmental calculations are unsupported.");

const navigateBody = bodyOf("navigate");
assert(navigateBody.includes("const queryIndex = rawPage.indexOf(\"?\")"), "Router should split route query once so Impact subpages keep their month query.");
assert(navigateBody.includes("state.monthlyImpactSection"), "Router should store the active Impact section.");
assert(navigateBody.includes("buildMonthlyImpactHash"), "Router should preserve month in Impact route hashes.");
assert(navigateBody.includes('aria-current="page"') || app.includes('aria-current="page"'), "Current Impact navigation should expose aria-current.");

const enterMainAppBody = bodyOf("enterMainApp");
assert(enterMainAppBody.includes("navigate(currentRoute, false)"), "Restored sessions should preserve direct route hashes.");

const dashboardBody = bodyOf("renderMonthlyImpactDashboard");
assert(dashboardBody.includes('sectionId === "food-rescue"'), "Dashboard renderer should dispatch to Food Rescue.");
assert(dashboardBody.includes('sectionId === "waste-diary"'), "Dashboard renderer should dispatch to Waste Diary.");
assert(dashboardBody.includes('sectionId === "savings"'), "Dashboard renderer should dispatch to Money Saved.");
assert(dashboardBody.includes('sectionId === "food-protected"'), "Dashboard renderer should dispatch to Food Protected.");
assert(dashboardBody.includes('sectionId === "trends"'), "Dashboard renderer should dispatch to Trends.");
assert(!dashboardBody.includes("renderMonthlyImpactContextSections(model)") && !dashboardBody.includes("renderMonthlyImpactDisclosures(model)"), "Overview renderer should not automatically render every detail section.");

const overviewBody = bodyOf("renderMonthlyImpactOverview");
assert(overviewBody.includes("renderImpactSectionCards"), "Overview should use Impact section navigation cards.");
assert(!overviewBody.includes("renderMonthlyImpactContextSections(model)"), "Overview should not render all context tables.");
assert(!overviewBody.includes("renderMonthlyImpactSavingsTrend(model)"), "Overview should not render trend tables.");
assert(!overviewBody.includes("renderMonthlyImpactDisclosures(model)"), "Overview should not render full disclosures.");

const sectionCardsBody = bodyOf("renderImpactSectionCards");
assert(sectionCardsBody.includes("Explore Your Impact"), "Overview navigation cards should have a clear heading.");

const wasteBody = bodyOf("renderMonthlyImpactWasteDiaryPage");
assert(wasteBody.includes("data-record-discarded-food"), "Waste Diary page should use the existing discard workflow action.");
assert(wasteBody.includes("waste-summary-grid"), "Waste Diary page should use a readable summary grid.");

[
  ".impact-section-grid",
  ".impact-section-card",
  ".impact-page-tabs",
  ".impact-page-tab",
  ".impact-breadcrumb",
  ".waste-summary-grid"
].forEach((selector) => assert(css.includes(selector), `${selector} styles should exist.`));

assert(css.includes("repeat(auto-fit, minmax(min(100%, 18rem), 1fr))"), "Impact cards should use responsive auto-fit columns.");
assert(css.includes("repeat(auto-fit, minmax(min(100%, 14rem), 1fr))"), "Waste summary cards should use responsive auto-fit columns.");
const impactSectionGridBlock = css.match(/\.impact-section-grid\s*\{[\s\S]*?\n\}/)?.[0] || "";
assert(impactSectionGridBlock && !impactSectionGridBlock.includes("overflow-x: auto"), "Impact section navigation should not require horizontal scrolling.");

console.log("Impact multi-page static checks passed.");
