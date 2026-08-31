const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function functionBody(name) {
  const marker = `function ${name}`;
  const start = app.indexOf(marker);
  assert(start >= 0, `${name} should exist.`);
  const next = app.indexOf("\n  function ", start + 1);
  return app.slice(start, next === -1 ? app.length : next);
}

const renderer = functionBody("renderLocalizationPreferencesSection");
const preview = functionBody("renderLocalizationPreview");
const reader = functionBody("readLocalizationPreferencesForm");
const sync = functionBody("syncLocalizationSettingsVisibility");
const save = functionBody("saveLocalizationPreferencesFromForm");

assert(renderer.includes("<legend>Language</legend>"), "Language settings should be grouped under LANGUAGE.");
assert(renderer.includes("App language"), "App language should be the main visible language setting.");
assert(renderer.includes("Changes Chef Nova menus and buttons."), "App language help text should be concise.");
assert(renderer.includes("Use a different language for recipe explanations"), "Explanation language should be controlled by a toggle.");
assert(renderer.includes("localizationExplanationLanguageWrap") && renderer.includes("hidden"), "Explanation selector should be hidden when the override is off.");
assert(reader.includes("preservedExplanationLocale"), "Turning off explanation override should preserve the stored explanation-language value.");
assert(sync.includes("Same as App language"), "Explanation summary should show Same as App language when the override is off.");

assert(renderer.includes("Advanced Language Options"), "Advanced Language Options should exist.");
assert(renderer.includes("Cooking terms language"), "Cooking terms language should remain available.");
assert(renderer.includes("Voice input language"), "Voice input language should remain available.");
assert(renderer.indexOf("Advanced Language Options") < renderer.indexOf("Cooking terms language"), "Cooking terms language should be inside Advanced Language Options.");
assert(renderer.indexOf("Advanced Language Options") < renderer.indexOf("Voice input language"), "Voice input language should be inside Advanced Language Options.");
assert(!renderer.includes("<details class=\"localization-disclosure\" open"), "Advanced Language Options should be collapsed by default.");

assert(renderer.includes("<legend>Region & Formats</legend>"), "Region and formatting settings should be separated from language.");
assert(renderer.includes("Region <small"), "Region should use the simplified label.");
assert(renderer.includes("Measurement system"), "Measurement system should remain available.");
assert(renderer.includes("Temperature display"), "Temperature display should remain available.");
assert(renderer.includes("Clock format"), "Clock format should replace Date and time format.");
assert(!renderer.includes("Date and time format"), "The misleading Date and time format label should be removed.");
assert(renderer.includes("Automatically detected:"), "Time zone should show a compact detected/current status before the editable field.");

assert(renderer.includes("Show Format Preview") && renderer.includes("Hide Format Preview"), "Format Preview should be collapsible.");
assert(renderer.includes("Format Preview"), "Format Preview should have a visible heading.");
assert(renderer.includes("Examples do not change saved recipe data."), "Format Preview should explain that it does not mutate saved data.");
assert(preview.includes("Ingredient Quantity"), "Preview should include ingredient quantity.");
assert(preview.includes("Decimal & Volume"), "Preview should include decimal and volume.");
assert(preview.includes("Safety Temperature"), "Preview should include safety temperature.");
assert(preview.includes("Date & Time"), "Preview should combine date and time.");
assert(!preview.includes("<span>Number</span>"), "Duplicate Number preview example should be removed.");
assert(!preview.includes("<span>Volume</span>"), "Old duplicate Volume preview label should be removed.");
assert(preview.includes("LOCALIZATION.formatIngredientQuantity") && preview.includes("LOCALIZATION.formatSafetyTemperature"), "Preview should use centralized localization utilities.");

assert(!renderer.includes('class="form-error" id="localizationPreferencesError"'), "Empty form-error container should not render.");
assert(renderer.includes('class="settings-error hidden"') && renderer.includes("hidden></div>"), "Settings error should be hidden until a real error exists.");
assert(save.includes("Language settings could not be saved"), "Actual save errors should display a useful heading.");
assert(save.includes("Your previous settings are still active."), "Save errors should explain that previous settings remain active.");

assert(css.includes(".localization-control-grid") && css.includes("repeat(2, minmax(0, 1fr))"), "Desktop layout should use two columns at most.");
assert(css.includes("@media (max-width: 640px)") && css.includes(".localization-control-grid"), "Mobile layout should reduce language settings to one column.");
assert(css.includes(".summary-open-label") && css.includes(".summary-closed-label"), "Preview disclosure should expose show/hide labels.");
assert(css.includes("@media (forced-colors: active)") && css.includes(".localization-settings"), "Language settings should support forced-colors mode.");

console.log("Simplified Language & Region static checks passed.");
