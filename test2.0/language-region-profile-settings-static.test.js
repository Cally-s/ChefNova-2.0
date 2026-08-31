const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
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

(function run() {
  const accountRenderer = extractFunction("renderAccountPage");
  const registeredProfileRenderer = extractFunction("renderRegisteredProfileSection");
  const guestRenderer = extractFunction("renderGuestAccountPanel");
  const localizationRenderer = extractFunction("renderLocalizationPreferencesSection");
  const recoveryRenderer = extractFunction("renderAccessibilityRecoveryPage");
  const saveHandler = extractFunction("saveLocalizationPreferencesFromForm");
  const languageChanger = extractFunction("changeInterfaceLanguage");
  const accountClickHandler = app.slice(app.indexOf("const pageTarget = event.target.closest(\"[data-page]\");"), app.indexOf("const instructionDetails", app.indexOf("const pageTarget")));
  const localizationCss = extractCssRule(".localization-settings");

  assert(accountRenderer.includes("renderRegisteredProfileSection(user, state.profileSection"), "registered Profile page uses routed settings sections");
  assert(registeredProfileRenderer.includes("renderLocalizationPreferencesSection()"), "registered Profile Language & Region page includes the settings controls");
  assert(guestRenderer.includes("${renderLocalizationPreferencesSection()}"), "guest Profile settings also include Language & Region");
  assert(localizationRenderer.includes("LANGUAGE & REGION"), "section keeps the requested LANGUAGE & REGION anchor label");
  assert(localizationRenderer.includes("id=\"languageRegionSettings\""), "section has a stable Language & Region anchor");
  assert(localizationRenderer.includes("id=\"languageRegionSettingsTitle\""), "section has a focusable heading");

  [
    ["interfaceLocale", "App language"],
    ["explanationLocale", "Recipe explanation language"],
    ["cookingTermLocale", "Cooking terms language"],
    ["selectedVoiceLocale", "Voice input language"],
    ["regionCode", "Region"],
    ["measurementSystem", "Measurement system"],
    ["hourCycle", "Clock format"]
  ].forEach(([field, label]) => {
    assert(localizationRenderer.includes(`name="${field}"`), `${label} control is present`);
    assert(localizationRenderer.includes(label), `${label} label is present`);
  });
  assert(localizationRenderer.includes("Advanced Language Options"), "advanced language options disclosure exists");
  assert(localizationRenderer.includes("Region & Formats"), "region and formats section exists");
  assert(localizationRenderer.includes("Show Format Preview") && localizationRenderer.includes("Hide Format Preview"), "format preview is collapsible");
  assert(!localizationRenderer.includes("Date and time format"), "old date and time format label is removed");
  assert(!localizationRenderer.includes("Region or locale"), "old region or locale label is removed");

  assert(recoveryRenderer.includes("data-focus-language-settings=\"true\""), "Accessibility Recovery links to Profile Language & Region");
  assert(!recoveryRenderer.includes("data-recovery-language-select"), "old recovery-page language select is removed");
  assert(!app.includes("event.target.closest(\"[data-recovery-language-select]\")"), "old recovery select listener is removed");
  assert(!html.includes("data-language-recovery"), "normal pages no longer show a persistent language control");

  assert(accountClickHandler.includes("dataset.focusLanguageSettings"), "page navigation supports focusing Language & Region");
  assert(app.includes("function focusLanguageRegionSettings"), "focus helper exists");
  assert(app.includes("data-page=\"account/language-region\""), "Profile menu has a Settings shortcut to Language & Region");

  assert(saveHandler.includes("changeInterfaceLanguage(draft.interfaceLocale)"), "interface language changes use existing preservation transaction");
  assert(saveHandler.includes("Language settings updated."), "save shows requested confirmation message");
  assert(saveHandler.includes("Language settings could not be saved"), "save failures show a meaningful error message");
  assert(!saveHandler.includes("navigate(\"home\")"), "saving language settings does not redirect home");
  assert(languageChanger.includes("captureAccessibilitySessionSnapshot()"), "language changes preserve current task state");
  assert(languageChanger.includes("displayRecipeDetailsIfOpen"), "language changes preserve open recipe context");

  assert(localizationCss.includes("position: static"), "Language & Region is an in-page settings section");
  assert(!/position\s*:\s*(fixed|sticky|absolute)/.test(localizationCss), "Language & Region CSS does not use overlay positioning");
  assert(css.includes(".language-recovery-link"), "nonintrusive recovery link styling exists");
  assert(css.includes(".language-recovery-inline"), "Profile Settings recovery link styling exists");
  assert(css.includes(".localization-control-grid") && css.includes("@media (max-width: 640px)"), "responsive language settings breakpoints exist");
  assert(css.includes(":focus-visible"), "visible focus styles are present");

  console.log("Language & Region Profile Settings static tests passed.");
})();
