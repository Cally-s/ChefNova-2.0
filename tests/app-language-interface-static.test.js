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

(function run() {
  const translationsStart = app.indexOf("const APP_LANGUAGE_TRANSLATIONS");
  assert(translationsStart >= 0, "App language translation resources exist");
  const translations = app.slice(translationsStart, app.indexOf("const APP_TRANSLATION_LOOKUP", translationsStart));
  ["en:", "fr:", "\"zh-Hans\":", "ar:"].forEach((language) => {
    assert(translations.includes(language), `${language} translation block exists`);
  });
  [
    "Find Recipes",
    "Meal Planner",
    "Shopping List",
    "Weekly Nutrition",
    "App language",
    "Save Language Settings",
    "Language settings updated."
  ].forEach((text) => assert(translations.includes(text), `${text} is covered by app language translations`));
  ["Trouver des recettes", "查找食谱", "البحث عن وصفات"].forEach((text) => {
    assert(translations.includes(text), `${text} translated label exists`);
  });

  const metadata = extractFunction("updateAppLanguageMetadata");
  assert(metadata.includes("document.documentElement.lang = appLanguage"), "App language updates html lang");
  assert(metadata.includes("document.documentElement.dir = getAppLanguageDirection(appLanguage)"), "App language updates text direction");

  const direction = extractFunction("getAppLanguageDirection");
  assert(direction.includes("ar") && direction.includes("rtl"), "Arabic app language uses RTL");

  const renderer = extractFunction("renderAll");
  const navigator = extractFunction("navigate");
  const authPage = extractFunction("showAuthPage");
  assert(renderer.includes("applyAppLanguage()"), "Full render applies app language");
  assert(navigator.includes("applyAppLanguage()"), "Route changes keep translated interface");
  assert(authPage.includes("applyAppLanguage()"), "Welcome auth page applies app language");
  assert(app.includes("function startAppLanguageObserver"), "Dynamic UI updates are observed for app language translation");
  assert(extractFunction("initializeApp").includes("startAppLanguageObserver()"), "App startup enables the language observer");

  const changer = extractFunction("changeInterfaceLanguage");
  assert(changer.includes("interfaceLanguage"), "Language change stores the selected app language");
  assert(changer.includes("interfaceLocale"), "Language change stores the resolved app locale");
  assert(changer.includes("measurementLocale: interfaceLocale"), "Measurement locale follows App language and Region");
  assert(!changer.includes("explanationLocale: locale"), "App language changes do not reset recipe explanation language");
  assert(!changer.includes("cookingTermLocale: locale"), "App language changes do not reset cooking-term language");
  assert(!changer.includes("selectedVoiceLocale: locale"), "App language changes do not reset voice-recognition language");
  assert(changer.includes("displayRecipeDetailsIfOpen"), "Language changes preserve open recipe context");
  assert(changer.includes("applyAppLanguage(interfaceLanguage)"), "Language changes translate the active interface immediately");

  const saver = extractFunction("saveLocalizationPreferencesFromForm");
  assert(saver.includes("changeInterfaceLanguage(draft.interfaceLocale)"), "Saving App language uses the preservation transaction");
  assert(saver.includes("t(\"languageUpdated\", \"Language settings updated.\")"), "Saved message is translated with the required English fallback");
  assert(css.includes("[dir=\"rtl\"] .localization-settings"), "Language settings support RTL layout");
  assert(css.includes("[dir=\"rtl\"] .toast-container"), "Language confirmation toast supports RTL layout");

  console.log("App language interface static checks passed.");
})();
