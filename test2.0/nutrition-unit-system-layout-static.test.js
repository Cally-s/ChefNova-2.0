const assert = require("assert");
const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const app = fs.readFileSync("app.js", "utf8");

function assertIncludes(source, value, message) {
  assert(source.includes(value), message);
}

function extractCssRule(selector) {
  const start = css.indexOf(selector);
  assert(start >= 0, `Missing CSS selector: ${selector}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(start, index + 1);
    }
  }
  throw new Error(`Could not extract CSS rule for ${selector}`);
}

const fieldsetStart = html.indexOf('<fieldset class="nutrition-radio-group unit-system-fieldset" id="nutritionUnitSystemGroup">');
assert(fieldsetStart >= 0, "Preferred Unit System fieldset keeps form target id and adds unit card class");
const fieldsetEnd = html.indexOf("</fieldset>", fieldsetStart);
const fieldset = html.slice(fieldsetStart, fieldsetEnd);

assertIncludes(fieldset, "<legend>Preferred unit system</legend>", "Preferred Unit System uses a real legend");
assertIncludes(fieldset, '<div class="unit-system-options">', "Metric and Imperial cards are grouped in a responsive grid");
assertIncludes(fieldset, '<label class="unit-system-option">', "Each unit choice is a complete clickable label");
assertIncludes(fieldset, 'name="nutritionUnitSystem" value="metric"', "Metric radio keeps existing name and stored value");
assertIncludes(fieldset, 'name="nutritionUnitSystem" value="imperial"', "Imperial radio keeps existing name and stored value");
assertIncludes(fieldset, '<span class="unit-system-option__title">Metric</span>', "Metric title is visible");
assertIncludes(fieldset, '<span class="unit-system-option__description">Kilograms and centimetres</span>', "Metric supporting text is visible");
assertIncludes(fieldset, '<span class="unit-system-option__title">Imperial</span>', "Imperial title is visible");
assertIncludes(fieldset, '<span class="unit-system-option__description">Pounds and feet/inches</span>', "Imperial supporting text is visible");
assert(fieldset.indexOf('value="metric"') < fieldset.indexOf("Metric"), "Metric radio and text are inside the same label");
assert(fieldset.indexOf('value="imperial"') < fieldset.indexOf("Imperial"), "Imperial radio and text are inside the same label");
assertIncludes(fieldset, 'id="nutritionUnitSystemError"', "Existing unit-system validation message remains in the fieldset");

const optionsRule = extractCssRule(".unit-system-options");
assertIncludes(optionsRule, "grid-template-columns: repeat(2, minmax(0, 1fr))", "Wide layout uses two equal option cards");
assertIncludes(optionsRule, "gap: 1rem", "Option cards have compact spacing");

const optionRule = extractCssRule(".nutrition-setup-screen .unit-system-option,\n.unit-system-option");
assertIncludes(optionRule, "grid-template-columns: 20px minmax(0, 1fr)", "Radio sits directly beside option text");
assertIncludes(optionRule, "min-height: 72px", "Option card has compact touch target");
assert(!/[\s{]height\s*:/.test(optionRule), "Option card does not use fixed height");
assertIncludes(optionRule, "word-break: normal", "Option text does not break letter by letter");
assertIncludes(optionRule, "white-space: normal", "Option text wraps naturally");

const radioRule = extractCssRule('.unit-system-option input[type="radio"],');
assertIncludes(radioRule, "width: 20px", "Radio width stays in the approved range");
assertIncludes(radioRule, "height: 20px", "Radio height stays in the approved range");
assertIncludes(radioRule, "min-width: 20px", "Radio min-width overrides large-button mode");
assertIncludes(radioRule, "min-height: 20px", "Radio min-height overrides large-button mode");
assert(!radioRule.includes("scale("), "Radio is not enlarged with transform scale");
assert(!radioRule.includes("60px") && !radioRule.includes("56px") && !radioRule.includes("48px"), "Radio rule does not contain oversized dimensions");

const selectedRule = extractCssRule('.unit-system-option:has(input[type="radio"]:checked)');
assertIncludes(selectedRule, "border-color: var(--setup-selection-accent)", "Selected state highlights the full card");
assertIncludes(selectedRule, "background: var(--setup-selection-background)", "Selected state has a visible background tint");

const focusRule = extractCssRule(".unit-system-option:focus-within");
assertIncludes(focusRule, "outline: 3px solid var(--setup-focus-ring)", "Focus ring surrounds the compact card");
assertIncludes(focusRule, "outline-offset: 3px", "Focus ring is visible without becoming oversized");

const largeButtonRule = extractCssRule("\n.large-buttons-mode .unit-system-option {\n");
assertIncludes(largeButtonRule, "min-height: 84px", "Large-button mode enlarges card touch target");
assertIncludes(largeButtonRule, "padding: 18px", "Large-button mode increases card padding");

assertIncludes(css, "@media (max-width: 640px) {\n  .unit-system-options {\n    grid-template-columns: 1fr;\n  }\n}", "Unit cards stack on small screens");

assertIncludes(app, '$$("input[name=\'nutritionUnitSystem\']").forEach((input) => input.addEventListener("change", updateNutritionUnitFields));', "Existing unit-system change listener remains");
assertIncludes(app, 'return $("input[name=\'nutritionUnitSystem\']:checked")?.value || "";', "Existing selected-unit lookup remains");
assertIncludes(app, "convertNutritionUnitValues(previousUnitSystem, unitSystem)", "Existing conversion behavior remains connected");
assertIncludes(app, "input.checked = input.value === canonical.unitSystem", "Existing saved unit selection population remains");

console.log("Nutrition unit-system layout static checks passed.");
