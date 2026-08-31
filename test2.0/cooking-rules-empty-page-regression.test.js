const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const rulesSource = fs.readFileSync("rules.js", "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `Missing ${name}`);
  let depth = 0;
  let end = start;
  for (; end < app.length; end += 1) {
    if (app[end] === "{") depth += 1;
    if (app[end] === "}") {
      depth -= 1;
      if (depth === 0) return app.slice(start, end + 1);
    }
  }
  throw new Error(`Could not extract ${name}`);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(rulesSource, sandbox);
const cookingRules = sandbox.window.cookingRules;

assert(Array.isArray(cookingRules), "rules.js exposes window.cookingRules");
assert(cookingRules.length >= 16, "Approved Cooking Rules catalogue remains populated");
assert(cookingRules.every((rule) => rule.id && rule.category && rule.title && rule.shortDescription), "Each rule has visible card content");
assert(cookingRules.every((rule) => Array.isArray(rule.steps) && Array.isArray(rule.commonMistakes)), "Each rule has modal detail arrays");

assert(html.includes('id="learn-page"') && html.includes('data-page-section="learn"'), "Cooking Rules page section exists");
assert(html.includes('id="ruleSearchInput"'), "Cooking Rules search input exists");
assert(html.includes('id="ruleFilters"'), "Cooking Rules category controls exist");
assert(html.includes('id="ruleList"'), "Cooking Rules display area exists");
assert(html.includes('<script src="rules.js"></script>') && html.indexOf('<script src="rules.js"></script>') < html.indexOf('<script src="app.js"></script>'), "rules.js loads before app.js");

const routeNormalizer = extractFunction("normalizeInternalRoute");
assert(routeNormalizer.includes('normalized === "cooking-rules"') && routeNormalizer.includes('return "learn"'), "Direct cooking-rules route maps to the real page");
assert(routeNormalizer.includes('startsWith("cooking-rules/")') && routeNormalizer.includes('replace(/^cooking-rules/, "learn")'), "Cooking Rules subroutes map to the learn route namespace");

const renderRules = extractFunction("renderRules");
assert(renderRules.includes("try") && renderRules.includes("catch"), "Cooking Rules render path catches failures");
assert(renderRules.includes("renderCookingRulesState"), "Cooking Rules failures render visible state");

const normalizer = extractFunction("normalizeCookingRulesCatalogue");
assert(normalizer.includes("Array.isArray(window.cookingRules)"), "Rule catalogue is normalized before use");
assert(normalizer.includes('"draft"') && normalizer.includes('"rejected"') && normalizer.includes('"machine-draft"') && normalizer.includes('"outdated"'), "Unapproved rule statuses are excluded");

const display = extractFunction("displayCookingRules");
assert(display.includes("COOKING RULES COULD NOT BE LOADED"), "Loading failure has a visible error state");
assert(display.includes("NO COOKING RULES ARE AVAILABLE"), "Empty approved catalogue has a visible unavailable state");
assert(display.includes("No matching Cooking Rules"), "Search/filter empty state is visible");
assert(display.includes("ruleMatchesSearch"), "Search filters approved rules without blanking initial state");

const modal = extractFunction("openRuleModal");
assert(modal.includes("normalizeCookingRulesCatalogue().rules.find"), "Rule modal uses normalized approved catalogue");
assert(modal.includes("showToast") && modal.includes("could not be opened"), "Missing rule detail shows feedback instead of failing silently");

assert(app.includes('$("#ruleSearchInput")?.addEventListener("input"'), "Search input rerenders Cooking Rules");
assert(app.includes('$("#clearRuleSearchButton")?.addEventListener("click", clearCookingRuleSearch)'), "Clear Search button is wired");
assert(app.includes("[data-rule-retry]"), "Retry action is wired for error states");
assert(app.includes("[data-clear-rule-search]"), "Search empty state can clear filters");

assert(css.includes(".cooking-rules-tools"), "Cooking Rules tools are styled");
assert(css.includes(".cooking-rules-state"), "Visible Cooking Rules loading/error/empty states are styled");
assert(css.includes("@media (max-width: 640px)") && css.includes(".cooking-rule-search-control"), "Cooking Rules mobile search layout is covered");
assert(css.includes("@media (forced-colors: active)") && css.includes(".cooking-rules-state"), "Cooking Rules has forced-colors support");

console.log("Cooking Rules empty-page regression checks passed.");
