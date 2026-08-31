const assert = require("assert");
const path = require("path");

const localization = require(path.resolve(__dirname, "..", "scripts", "localization-service.js"));
const recovery = require(path.resolve(__dirname, "..", "scripts", "accessibility-recovery.js"));

(function run() {
  assert.deepStrictEqual(localization.SUPPORTED_REGIONS, ["CA", "US", "FR", "CN"], "supported regions are countries only");

  const canada = localization.normalizePreferences({ locale: "fr-CA" });
  assert.strictEqual(canada.locale, "fr-CA", "existing locale is preserved");
  assert.strictEqual(canada.regionCode, "CA", "existing Canadian locale migrates to Canada region");

  const unitedStates = localization.normalizePreferences({ locale: "en-US" });
  assert.strictEqual(unitedStates.regionCode, "US", "existing US locale migrates to United States region");

  const arabic = localization.normalizePreferences({ locale: "ar" });
  assert.strictEqual(arabic.locale, "ar", "generic Arabic language remains supported");
  assert.strictEqual(arabic.regionCode, "device", "generic Arabic does not invent a region");

  const explicitMetric = localization.normalizePreferences({ locale: "en-US", regionCode: "US", measurementSystem: "metric", hourCycle: "24" });
  assert.strictEqual(explicitMetric.measurementSystem, "metric", "explicit measurement preference is preserved");
  assert.strictEqual(explicitMetric.hourCycle, "24", "explicit clock preference is preserved");

  const languagePrefs = recovery.normalizeLanguagePreferences({
    interfaceLanguage: "fr",
    interfaceLocale: "fr-CA",
    regionCode: "CA",
    explanationLanguage: "en",
    explanationLocale: "en-CA"
  });
  assert.strictEqual(languagePrefs.interfaceLanguage, "fr", "app language code is preserved");
  assert.strictEqual(languagePrefs.regionCode, "CA", "region code is preserved separately");
  assert.strictEqual(languagePrefs.explanationLanguage, "en", "explanation language code is preserved");

  console.log("Language & Region preference normalization checks passed.");
})();
