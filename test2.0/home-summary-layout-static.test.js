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

function extractCssRule(selector) {
  const start = css.indexOf(selector);
  assert(start >= 0, `${selector} CSS exists`);
  const end = css.indexOf("}", start);
  return css.slice(start, end + 1);
}

function extractStandaloneCssRule(selector) {
  const start = css.lastIndexOf(`${selector} {`);
  assert(start >= 0, `${selector} standalone CSS exists`);
  const end = css.indexOf("}", start);
  return css.slice(start, end + 1);
}

function extractArrayDeclaration(functionBody, name) {
  const start = functionBody.indexOf(`const ${name} = [`);
  assert(start >= 0, `${name} declaration exists`);
  const end = functionBody.indexOf("];", start);
  return functionBody.slice(start, end + 2);
}

(function run() {
  const dashboardStats = extractFunction("updateDashboardStats");
  const primaryCards = extractArrayDeclaration(dashboardStats, "primaryCards");
  const secondaryCards = extractArrayDeclaration(dashboardStats, "secondaryCards");
  const cardFactory = extractFunction("createHomeSummaryCard");
  const dashboardRule = extractCssRule(".dashboard-stats");
  const primaryRule = extractCssRule(".home-summary__primary");
  const secondaryRule = extractCssRule(".home-summary__secondary");
  const cardRule = extractCssRule(".home-summary-card");
  const labelRule = extractCssRule(".home-summary-card .summary-card__label");
  const valueRule = extractCssRule(".home-summary-card .summary-card__value");
  const supportRule = extractCssRule(".home-summary-card .summary-card__supporting-text");

  assert(dashboardStats.includes("primaryCards = ["), "home summary creates a primary card row");
  assert(dashboardStats.includes("secondaryCards = ["), "home summary creates a secondary card row");
  assert(dashboardStats.includes("home-summary__primary"), "home summary renders the primary row");
  assert(dashboardStats.includes("home-summary__secondary"), "home summary renders the secondary row");
  assert(primaryCards.indexOf("Favorite Recipes") < primaryCards.indexOf("Pantry Items"), "favorite card appears before pantry card");
  assert(primaryCards.indexOf("Pantry Items") < primaryCards.indexOf("Meals Planned"), "pantry card appears before meals card");
  assert(secondaryCards.indexOf("Freezer Inventory") < secondaryCards.indexOf("Mode"), "freezer card appears before mode card");

  assert(cardFactory.includes("summary-card__label"), "cards use a separate label element");
  assert(cardFactory.includes("summary-card__value"), "cards use a separate value element");
  assert(cardFactory.includes("summary-card__supporting-text"), "freezer due text uses supporting text");

  assert(dashboardRule.includes("display: grid"), "dashboard summary container remains a grid");
  assert(primaryRule.includes("display: grid") && secondaryRule.includes("display: grid"), "summary rows use CSS grid");
  assert(css.includes(".home-summary__primary {\n  grid-template-columns: repeat(3, minmax(0, 1fr));"), "primary row uses three equal desktop columns");
  assert(css.includes(".home-summary__secondary {\n  grid-template-columns: repeat(2, minmax(0, 1fr));"), "secondary row uses two equal desktop columns");
  assert(cardRule.includes("min-height") && cardRule.includes("padding: 20px"), "home cards use consistent height and padding");
  assert(labelRule.includes("line-height") && valueRule.includes("line-height"), "label and value text have stable spacing");
  assert(supportRule.includes("line-height"), "supporting text remains readable");
  assert(css.includes("@media (max-width: 980px)") && css.includes("grid-template-columns: repeat(2, minmax(0, 1fr))"), "tablet layout supports two columns");
  assert(css.includes("@media (max-width: 720px)") && css.includes("grid-template-columns: 1fr"), "mobile layout supports one column");

  console.log("Home summary layout static tests passed.");
})();
