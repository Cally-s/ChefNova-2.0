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
  "getNutritionTrackerSections",
  "updateNutritionTrackerRouteState",
  "buildNutritionTrackerHash",
  "nutritionTrackerRouteHref",
  "renderNutritionTrackerSectionNavigation",
  "renderNutritionTrackerSectionPage",
  "renderNutritionTrackerOverview",
  "renderNutritionTrackerMealsPage",
  "renderNutritionTrackerSummaryPage",
  "renderNutritionTrackerNutrientsPage",
  "renderNutritionTrackerGoalsPage",
  "renderNutritionTrackerTrendsPage",
  "renderNutritionTrackerUnknownRoute"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} should be implemented.`));

assert(html.includes('id="nutritionTrackerPageTitle"'), "Nutrition Tracker page heading should be focusable for routed views.");
assert(html.includes('id="nutritionTrackerPageDescription"'), "Nutrition Tracker page description should update with routed views.");
assert(app.includes('nutritionTrackerSection: "overview"'), "Nutrition Tracker should store the active subpage in state.");

const sections = bodyOf("getNutritionTrackerSections");
["overview", "meals", "summary", "nutrients", "goals", "trends"].forEach((route) => {
  assert(sections.includes(`id: "${route}"`), `${route} route should be available.`);
});
assert(!sections.includes("reports"), "Reports route should not be created while export/report features are unsupported.");

const navigateBody = bodyOf("navigate");
assert(navigateBody.includes("updateNutritionTrackerRouteState"), "Router should parse Nutrition Tracker subroutes.");
assert(navigateBody.includes("buildNutritionTrackerHash"), "Router should preserve Nutrition Tracker date query values.");
assert(navigateBody.includes("nutritionTrackerSubpage"), "Router should keep unknown Nutrition Tracker routes addressable.");
assert(navigateBody.includes("nutritionTrackerPageTitle"), "Routed Nutrition Tracker pages should focus the page heading.");

const routeStateBody = bodyOf("updateNutritionTrackerRouteState");
assert(routeStateBody.includes('params.get("date")'), "Nutrition Tracker route state should read the selected date from the URL.");
assert(routeStateBody.includes("!isFutureDate(requestedDate)"), "Nutrition Tracker route state should reject future dates.");

const hashBody = bodyOf("buildNutritionTrackerHash");
assert(hashBody.includes("new URLSearchParams({ date })"), "Nutrition Tracker hashes should include a date query.");
assert(hashBody.includes('normalizedSection === "overview"'), "Overview should use the clean base Nutrition Tracker route.");

const displayBody = bodyOf("displayNutritionTracker");
assert(displayBody.includes("renderNutritionTrackerSectionPage"), "Display renderer should dispatch to one routed Nutrition Tracker section.");
assert(!displayBody.includes("renderProgressBeyondWeightSection()") || displayBody.includes("renderNutritionTrackerSectionPage"), "Display renderer should not directly render every tracker detail section.");

const overviewBody = bodyOf("renderNutritionTrackerOverview");
assert(overviewBody.includes("Today at a Glance"), "Overview should present a concise dashboard.");
assert(overviewBody.includes("nutritionTrackerRouteHref(\"meals\")"), "Overview should link to detailed tracker sections.");
assert(!overviewBody.includes("renderWeightProgressSection"), "Overview should not render optional Weight Progress details.");
assert(!overviewBody.includes("renderProgressBeyondWeightSection"), "Overview should not render trend details.");

const trendsBody = bodyOf("renderNutritionTrackerTrendsPage");
assert(trendsBody.includes("renderProgressBeyondWeightSection"), "Trends page should keep existing Progress Beyond Weight calculations.");
assert(trendsBody.includes("renderWeightProgressSection"), "Trends page should keep existing optional Weight Progress tools.");

[
  ".nutrition-tracker-navigation",
  ".nutrition-tracker-navigation__grid",
  ".nutrition-tracker-section-card",
  ".tracker-overview-grid",
  ".tracker-overview-card",
  ".tracker-page-links",
  ".tracker-nutrient-columns"
].forEach((selector) => assert(css.includes(selector), `${selector} styles should exist.`));

assert(css.includes(".nutrition-tracker-section-card.active"), "Active Nutrition Tracker section should be visibly styled.");
assert(css.includes(".nutrition-tracker-navigation__grid,\n  .tracker-overview-grid"), "Nutrition Tracker route cards should collapse in responsive layouts.");
const navGridBlock = css.match(/\.nutrition-tracker-navigation__grid,[\s\S]*?\.tracker-overview-grid\s*\{[\s\S]*?\n\}/)?.[0] || "";
assert(navGridBlock && !navGridBlock.includes("overflow-x: auto"), "Nutrition Tracker navigation should not require horizontal scrolling.");

console.log("Nutrition Tracker multi-page static checks passed.");
