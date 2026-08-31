const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const localization = fs.readFileSync(path.join(root, "scripts/localization-service.js"), "utf8");
const recovery = fs.readFileSync(path.join(root, "scripts/accessibility-recovery.js"), "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `${name} exists`);
  const next = app.indexOf("\n  function ", start + 1);
  return app.slice(start, next === -1 ? app.length : next);
}

(function run() {
  const renderer = extractFunction("renderLocalizationPreferencesSection");
  const languageOptions = extractFunction("renderLanguageOptions");
  const regionOptions = extractFunction("renderRegionOptions");
  const resolver = extractFunction("resolveLocale");
  const reader = extractFunction("readLocalizationPreferencesForm");
  const saver = extractFunction("saveLocalizationPreferencesFromForm");
  const preview = extractFunction("renderLocalizationPreview");
  const previewUpdater = extractFunction("updateLocalizationPreview");

  assert(app.includes("function getSupportedRegions"), "Region model is generated separately from languages");
  assert(regionOptions.includes("Use device region"), "Region selector includes device-region option");
  ["CA", "US", "FR", "CN"].forEach((region) => assert(app.includes(`"${region}"`), `${region} is supported as a region code`));

  assert(app.includes("Simplified Chinese"), "App language still includes Simplified Chinese");
  assert(app.includes("Arabic"), "App language still includes Arabic");
  assert(!regionOptions.includes("English (Canada)"), "Region options do not include English Canada");
  assert(!regionOptions.includes("French (Canada)"), "Region options do not include French Canada");
  assert(!regionOptions.includes("Chinese (Simplified)"), "Region options do not include language labels");
  assert(!regionOptions.includes(">Arabic<"), "Arabic does not appear as a Region option");

  assert(renderer.includes("name=\"regionCode\""), "Region selector stores a stable region code");
  assert(renderer.includes("Controls local number, date, time, and formatting conventions."), "Region help text explains formatting purpose");
  assert(renderer.includes("localizationDeviceRegionStatus"), "Device region status is announced through described help text");

  assert(resolver.includes("en: { CA: \"en-CA\", US: \"en-US\" }"), "English plus Canada/United States resolves to supported locales");
  assert(resolver.includes("fr: { CA: \"fr-CA\", FR: \"fr-FR\" }"), "French plus Canada/France resolves to supported locales");
  assert(resolver.includes("\"zh-Hans\": { CN: \"zh-CN\" }"), "Simplified Chinese plus China resolves to zh-CN");
  assert(resolver.includes("ar: {}"), "Generic Arabic support does not invent an Arabic country");

  assert(reader.includes("interfaceLanguage") && reader.includes("regionCode"), "Form reader keeps language and region separate");
  assert(reader.includes("measurementSystem: form.measurementSystem.value"), "Explicit measurement preference is preserved");
  assert(saver.includes("interfaceLanguage: draft.interfaceLanguage"), "Saved accessibility preferences preserve language code");
  assert(saver.includes("regionCode: draft.regionCode"), "Saved accessibility preferences preserve region code");
  assert(previewUpdater.includes("renderLocalizationPreview(readLocalizationPreferencesForm())"), "Format Preview uses the selected language and region draft");

  assert(localization.includes("SUPPORTED_REGIONS"), "Localization service exposes supported regions");
  assert(localization.includes("regionCode"), "Localization preferences preserve region code");
  assert(recovery.includes("regionCode"), "Accessibility preferences preserve region code");
  assert(recovery.includes("interfaceLanguage"), "Accessibility preferences preserve app language code");

  console.log("Language & Region Region selector static checks passed.");
})();
