const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function assertIncludes(value, message) {
  assert(css.includes(value), message);
}

(function run() {
  const globalLabelIndex = css.indexOf("label {");
  const contrastIndex = css.indexOf("/* Nutrition Setup contrast */");
  assert(globalLabelIndex >= 0, "Global label styling exists");
  assert(contrastIndex > globalLabelIndex, "Nutrition Setup contrast rules override global labels");

  assertIncludes("--text-on-dark-primary: #fffdf7", "High-contrast text-on-dark token exists");
  assertIncludes("--text-primary: #17251f", "Light-surface primary text token exists");
  assertIncludes("--placeholder-strong: #64736c", "Readable placeholder token exists");

  [
    ".nutrition-setup-screen .nutrition-profile-form label",
    ".nutrition-setup-screen .nutrition-radio-group legend",
    ".nutrition-setup-screen .nutrition-conditional-section h2",
    ".nutrition-setup-screen .nutrition-safety-preferences label",
    ".nutrition-setup-screen .nutrition-unit-fields label"
  ].forEach((selector) => assertIncludes(selector, `${selector} receives scoped contrast styling`));

  const essentialBlock = css.slice(css.indexOf(".nutrition-setup-screen .nutrition-profile-form label"), css.indexOf(".nutrition-setup-screen .nutrition-radio-group label"));
  assert(essentialBlock.includes("color: var(--text-on-dark-primary)"), "Essential Nutrition Setup labels use high-contrast light text");
  assert(essentialBlock.includes("opacity: 1"), "Essential Nutrition Setup labels use full opacity");
  assert(essentialBlock.includes("font-weight: 800"), "Essential Nutrition Setup labels have readable weight");

  const controlBlock = css.slice(css.indexOf(".nutrition-setup-screen input,"), css.indexOf(".nutrition-setup-screen option"));
  assert(controlBlock.includes("color: var(--text-primary)"), "Input and select values use dark text on light controls");
  assert(controlBlock.includes("opacity: 1"), "Input and select values are not faded");

  const placeholderBlock = css.slice(css.indexOf(".nutrition-setup-screen input::placeholder"), css.indexOf(".nutrition-setup-screen input:focus"));
  assert(placeholderBlock.includes("color: var(--placeholder-strong)"), "Nutrition Setup placeholders use readable contrast");
  assert(placeholderBlock.includes("opacity: 1"), "Nutrition Setup placeholders are not transparent");

  const disabledBlock = css.slice(css.indexOf(".nutrition-setup-screen input:disabled"), css.indexOf(".nutrition-setup-screen .optional-label"));
  assert(disabledBlock.includes("opacity: 0.82"), "Disabled controls remain visually distinct from enabled controls");

  const optionalBlock = css.slice(css.indexOf(".nutrition-setup-screen .optional-label"), css.indexOf(".nutrition-setup-screen .form-error"));
  assert(optionalBlock.includes("color: #fffaf1"), "Optional badges stay readable");
  assert(optionalBlock.includes("opacity: 1"), "Optional badges are not faded");

  const safetyBlock = css.slice(css.indexOf(".nutrition-setup-screen .nutrition-setup-card p.nutrition-safety-message"));
  assert(safetyBlock.includes("color: #315878"), "Light safety and error panels keep dark readable text");

  console.log("Nutrition Setup contrast static checks passed.");
})();
