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

function extractFirstStandaloneCssRule(selector) {
  const start = css.indexOf(`${selector} {`);
  assert(start >= 0, `${selector} standalone CSS exists`);
  const end = css.indexOf("}", start);
  return css.slice(start, end + 1);
}

(function run() {
  const renderer = extractFunction("renderRecipeCardCostSummary");
  const recipeCardRule = extractStandaloneCssRule(".recipe-card");
  const costPanelRule = extractFirstStandaloneCssRule(".recipe-card-cost-summary");
  const statsRule = extractCssRule(".recipe-cost-stats");
  const statRule = extractCssRule(".recipe-stat");
  const labelRule = extractCssRule(".recipe-stat__label");
  const valueRule = extractCssRule(".recipe-stat__value");
  const warningRule = extractCssRule(".recipe-card-cost-confidence");
  const summaryRule = extractStandaloneCssRule(".recipe-card-cost-breakdown summary");
  const titleRule = extractStandaloneCssRule(".recipe-body h3,\n.favorite-recipe-body h3");
  const badgeRule = extractCssRule(".match-badge");
  const ingredientTagRule = extractCssRule(".ingredient-tags span");
  const costLineValueRule = extractCssRule(".recipe-card-cost-lines strong");

  assert(renderer.includes('class="recipe-cost-stats"'), "recipe cost stats use a dedicated stats grid");
  assert(renderer.includes('class="recipe-stat"'), "each cost statistic has a dedicated stat wrapper");
  assert(renderer.includes('class="recipe-stat__label"'), "cost statistic labels are explicit");
  assert(renderer.includes('class="recipe-stat__value"'), "cost statistic values are explicit");
  assert(renderer.includes("Not available"), "renderer preserves Not available text instead of special-casing it");

  assert(recipeCardRule.includes("container-type: inline-size"), "recipe cards expose an inline-size container");
  assert(costPanelRule.includes("overflow: visible"), "cost panel does not clip content");
  assert(costPanelRule.includes("clamp("), "cost panel uses responsive padding");
  assert(statsRule.includes("repeat(3, minmax(0, 1fr))"), "wide recipe cards use three stat columns");
  assert(css.includes("@container (max-width: 44rem)") && css.includes("repeat(2, minmax(0, 1fr))"), "narrow recipe cards use two stat columns");
  assert(css.includes("@container (max-width: 18rem)") && css.includes("grid-template-columns: 1fr"), "very narrow recipe cards use one stat column");

  assert(statRule.includes("height: auto") && statRule.includes("overflow: visible"), "stat boxes can grow and do not clip text");
  [labelRule, valueRule, warningRule, summaryRule, titleRule, badgeRule, ingredientTagRule, costLineValueRule].forEach((rule) => {
    assert(rule.includes("white-space: normal"), "ordinary recipe-card text wraps normally");
    assert(rule.includes("word-break: normal"), "ordinary recipe-card text does not break all letters");
    assert(!rule.includes("overflow-wrap: anywhere"), "ordinary recipe-card text does not use aggressive anywhere wrapping");
    assert(!rule.includes("text-overflow: ellipsis"), "ordinary recipe-card text is not ellipsized");
  });
  assert(valueRule.includes("overflow-wrap: normal"), "stat values keep words such as Not available intact");
  assert(summaryRule.includes("min-height: 44px"), "cost breakdown summary keeps an accessible touch target while allowing wrapping");

  console.log("Find Recipes text reflow static tests passed.");
})();
