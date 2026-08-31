const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

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

function countMatches(value, pattern) {
  return (value.match(pattern) || []).length;
}

(function run() {
  const pantryStart = html.indexOf('id="pantry-page"');
  const pantryEnd = html.indexOf('id="planner-page"', pantryStart);
  const pantryHtml = html.slice(pantryStart, pantryEnd);
  const rowRule = extractCssRule(".food-date-type-fieldset .pantry-date-option");
  const radioRule = extractCssRule('.food-date-type-fieldset input[type="radio"]');
  const largeButtonRadioRule = extractCssRule('.large-buttons-mode .food-date-type-fieldset input[type="radio"]');
  const titleRule = extractStandaloneCssRule(".food-date-type-fieldset .pantry-date-option__title");
  const descriptionRule = extractStandaloneCssRule(".food-date-type-fieldset .pantry-date-option__description");

  assert(pantryHtml.includes("<legend>What type of date is this?</legend>"), "date type radio group keeps its legend");
  assert(pantryHtml.includes("<legend>Confirm expiration date</legend>"), "expiration confirmation radio group keeps its legend");
  assert.strictEqual(countMatches(pantryHtml, /class="pantry-date-option"/g), 10, "all Pantry date and expiration options use the shared option row");
  assert.strictEqual(countMatches(pantryHtml, /class="pantry-date-option__radio"/g), 10, "all Pantry date and expiration radios use the shared radio class");
  assert.strictEqual(countMatches(pantryHtml, /name="foodDateType"/g), 8, "date type radio names are preserved");
  assert.strictEqual(countMatches(pantryHtml, /name="expirationPackageConfirmed"/g), 2, "expiration confirmation radio names are preserved");

  [
    "best-before",
    "expiration",
    "packaged-on",
    "purchased-on",
    "opened-on",
    "cooked-on",
    "homemade-estimate",
    "unknown"
  ].forEach((value) => assert(pantryHtml.includes(`value="${value}"`), `date type value preserved: ${value}`));
  ["yes", "unsure"].forEach((value) => assert(pantryHtml.includes(`value="${value}"`), `expiration confirmation value preserved: ${value}`));

  assert(rowRule.includes("display: grid"), "option row uses compact grid layout");
  assert(rowRule.includes("grid-template-columns: 1.25rem minmax(0, 1fr)"), "option row keeps a small radio column and wide text column");
  assert(rowRule.includes("align-items: start"), "radio aligns with the first label line");
  assert(rowRule.includes("min-height: 44px"), "option row keeps a touch-friendly target");
  assert(rowRule.includes("width: 100%"), "full row remains clickable");
  assert(!rowRule.includes("position: absolute") && !rowRule.includes("position: fixed"), "option row does not use positioning hacks");

  assert(radioRule.includes("width: 18px") && radioRule.includes("height: 18px"), "radio circle keeps normal 18px size");
  assert(radioRule.includes("min-width: 18px") && radioRule.includes("max-width: 18px"), "radio width cannot grow or shrink");
  assert(radioRule.includes("margin: 3px 0 0"), "radio uses only a tiny first-line alignment offset");
  assert(radioRule.includes("align-self: start"), "radio aligns to the first line instead of the full description");
  assert(!radioRule.includes("transform: scale") && !radioRule.includes("44px") && !radioRule.includes("52px"), "radio is not enlarged to create a touch target");
  assert(largeButtonRadioRule.includes("width: 20px") && !largeButtonRadioRule.includes("52px"), "large button mode keeps Pantry radios small");

  assert(titleRule.includes("line-height: 1.35"), "visible title text has compact line height");
  assert(descriptionRule.includes("line-height: 1.45"), "supporting descriptions remain readable");
  assert(descriptionRule.includes("overflow-wrap: break-word"), "long labels wrap without clipping or overlap");

  console.log("Pantry date option alignment static tests passed.");
})();
