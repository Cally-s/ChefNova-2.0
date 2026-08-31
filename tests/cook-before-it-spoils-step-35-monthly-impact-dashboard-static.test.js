const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-monthly-impact-dashboard.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-35-report.md"), "utf8");

function bodyOf(functionName) {
  const start = app.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} must exist`);
  const next = app.indexOf("\n  function ", start + 12);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "MONTHLY_IMPACT_DASHBOARD_VERSION",
  "MONTHLY_IMPACT_PERIOD_VERSION",
  "MONTHLY_IMPACT_METRIC_CARD_VERSION",
  "MONTHLY_IMPACT_COVERAGE_DISPLAY_VERSION",
  "MONTHLY_IMPACT_DASHBOARD_STATUSES"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} must be defined`));

[
  "buildMonthlyImpactDashboard",
  "displayMonthlyImpactDashboard",
  "renderMonthlyImpactDashboard",
  "createMonthlyImpactPeriod",
  "setMonthlyImpactMonth",
  "changeMonthlyImpactMonth",
  "buildMonthlyRescuedIngredients",
  "buildMonthlyDiscardedIngredients",
  "buildMonthlyLeftoverTransformations",
  "buildMonthlyProtectedItems",
  "buildMonthlySavingsTrend",
  "buildMonthlyDiscardReasonSummary"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} must be implemented`));

const modelBody = bodyOf("buildMonthlyImpactDashboard");
[
  "buildImpactLedger",
  "getEffectiveMetricBalance",
  "getActivityCount",
  "getProtectedStockBalance",
  "INGREDIENTS_USED_BEFORE_PRIORITY_DATE",
  "LEFTOVER_SERVINGS_REUSED",
  "ESTIMATED_MONEY_SAVED",
  "POSSIBLE_FOOD_WASTE_AVOIDED",
  "FOOD_PROTECTED_FOR_LATER_USE",
  "FREEZING_ACTION",
  "RESCUE_RECIPE_COMPLETED"
].forEach((phrase) => assert(modelBody.includes(phrase), `Dashboard model must use ${phrase}`));

assert(modelBody.includes("laterMeals") && modelBody.includes("sourceLeftovers"), "Leftover card must separate servings, later meals, and source batches");
assert(modelBody.includes("currentMonthlyImpactDashboard"), "Only the current derived dashboard model may be cached in state");
assert(!modelBody.includes("selectWasteDiaryEntries().reduce"), "Waste Diary entries must stay contextual, not become impact totals");

const periodBody = bodyOf("createMonthlyImpactPeriod");
assert(periodBody.includes("month-to-date") && periodBody.includes("complete-month"), "Monthly period must distinguish current and completed months");
assert(periodBody.includes("getCurrentIsoString") && periodBody.includes("T23:59:59.999"), "Stock reference must use now for current month and final month instant for completed months");

const renderBody = bodyOf("renderMonthlyImpactDashboard");
[
  "Monthly Context",
  "Data Coverage",
  "Estimated Monthly Food Value Saved Trend",
  "Definitions and Disclosures"
].forEach((phrase) => assert(renderBody.includes(phrase) || app.includes(phrase), `Rendered dashboard must include ${phrase}`));

[
  "monthlyImpactPage",
  "monthlyImpactContent",
  "data-page-section=\"impact\"",
  "data-nav-item=\"impact\""
].forEach((phrase) => assert(html.includes(phrase), `HTML must include ${phrase}`));

assert(app.includes("if (page === \"impact\") displayMonthlyImpactDashboard();"), "Router must render the impact page");
assert(app.includes("data-impact-month") && app.includes("data-impact-month-input"), "Month controls must be wired");

[
  ".monthly-impact-card-grid",
  ".monthly-impact-controls",
  ".monthly-impact-table",
  ".monthly-impact-context-grid",
  ".monthly-impact-bar",
  "@media print"
].forEach((phrase) => assert(css.includes(phrase), `CSS must include ${phrase}`));

[
  "monthlyImpactTotals",
  "impactDashboardEvents",
  "monthlySavedFoodStore",
  "monthlyWasteAvoidedStore",
  "monthlyFreezerImpactInventory",
  "impactDashboardLedger"
].forEach((forbidden) => {
  assert(!app.includes(`const ${forbidden}`) && !app.includes(`let ${forbidden}`) && !app.includes(`var ${forbidden}`), `${forbidden} must not be created`);
});

[
  "# Chef Nova Monthly Food-Rescue Impact Dashboard",
  "Read Model Boundary",
  "Stock Versus Flow",
  "Leftover Reporting",
  "Discard Context",
  "Accessibility"
].forEach((phrase) => assert(doc.includes(phrase), `Monthly dashboard doc must include ${phrase}`));

[
  "Goal",
  "Files changed",
  "Validation performed",
  "Forbidden duplicate stores created: 0",
  "Step 35 completion status"
].forEach((phrase) => assert(report.includes(phrase), `Step 35 report must include ${phrase}`));

console.log("Step 35 monthly impact dashboard static checks passed.");
