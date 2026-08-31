const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const localization = require(path.join(root, "scripts", "localization-service.js"));
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

const canonicalSpinach = { value: "200", unit: "g" };
const canonicalSoup = { value: "1.5", unit: "L" };

assert.deepStrictEqual(localization.createCanonicalQuantity({ value: "200", unit: "grams" }).quantity, canonicalSpinach, "Legacy unit names migrate to stable canonical unit IDs.");
assert.deepStrictEqual(localization.migrateLegacyQuantity({ point: 200, unit: "grams" }), { value: "200", unit: "g", approximate: false }, "Old point/unit quantities remain usable.");

const enCaMetric = localization.formatIngredientQuantity(canonicalSpinach, { id: "spinach" }, { locale: "en-CA", measurementSystem: "metric" });
assert.strictEqual(enCaMetric.display, "200 g spinach", "Scenario A displays English Canada metric quantity.");
assert.deepStrictEqual(enCaMetric.canonicalQuantity, canonicalSpinach, "Metric display must not mutate canonical quantity.");

const frSoup = localization.formatIngredientQuantity(canonicalSoup, { id: "soup" }, { locale: "fr-CA", measurementSystem: "metric" });
assert.strictEqual(frSoup.display, "1,5 L de soupe", "Scenario B displays French decimal comma and connector.");
assert.strictEqual(frSoup.canonicalQuantity.value, "1.5", "French display keeps canonical value 1.5.");
assert.strictEqual(localization.parseLocalizedNumber("1,5", "fr-CA").value, "1.5", "French input 1,5 parses as 1.5, not 15.");
assert.notStrictEqual(localization.parseLocalizedNumber("1,5", "fr-CA").value, "15", "French decimal comma is never stripped as a thousands separator.");
assert.strictEqual(localization.parseLocalizedNumber("1.5", "fr-CA").ok, false, "Ambiguous French decimal input is rejected.");
assert.strictEqual(localization.parseLocalizedNumber("1 000,5", "fr-FR").value, "1000.5", "French grouping and decimal separators parse correctly.");

const zhSpinach = localization.formatIngredientQuantity(canonicalSpinach, { id: "spinach" }, { locale: "zh-CN", measurementSystem: "metric" });
assert.strictEqual(zhSpinach.display, "菠菜 200 克", "Scenario C displays Simplified Chinese ingredient before quantity.");

const imperialSpinach = localization.formatIngredientQuantity(canonicalSpinach, { id: "spinach" }, { locale: "en-US", measurementSystem: "imperial" });
assert.strictEqual(imperialSpinach.display, "Approximately 7 oz spinach", "Scenario D displays approximate ounces from canonical grams.");
assert.strictEqual(imperialSpinach.canonicalQuantity.value, "200", "Imperial display keeps canonical 200 g.");
const driftCheckA = localization.formatIngredientQuantity(canonicalSpinach, { id: "spinach" }, { locale: "en-US", measurementSystem: "imperial" }).exactValue;
const driftCheckB = localization.formatIngredientQuantity(canonicalSpinach, { id: "spinach" }, { locale: "en-US", measurementSystem: "imperial" }).exactValue;
assert.strictEqual(driftCheckA, driftCheckB, "Repeated measurement switching creates no conversion drift.");

const safety = localization.formatSafetyTemperature("chickenInternal", { locale: "en-CA", temperatureDisplay: "both" });
assert.strictEqual(safety.display, "Heat to at least 74°C / 165°F.", "Scenario E uses approved safety temperature display pair.");
assert.strictEqual(safety.threshold.canonicalCelsius, "74", "Safety canonical Celsius is preserved.");
assert(!safety.display.includes("164"), "Safety temperature is never casually rounded down.");

const ordinaryTemp = localization.formatTemperature({ value: "180", unit: "C" }, { locale: "en-US", temperatureDisplay: "fahrenheit" });
assert.strictEqual(ordinaryTemp.display, "356°F", "Ordinary recipe temperatures convert accurately.");

const separated = localization.createSeparatedQuantityModel({
  ingredientId: "pasta",
  recipeUseQuantity: { value: "450", unit: "g" },
  packageQuantity: { value: "500", unit: "g" },
  purchaseQuantity: { value: "1", unit: "package" }
});
assert.deepStrictEqual(separated.recipeUseQuantity, { value: "450", unit: "g" }, "Scenario F keeps recipe-use quantity separate.");
assert.deepStrictEqual(separated.packageQuantity, { value: "500", unit: "g" }, "Scenario F keeps package quantity separate.");
assert.deepStrictEqual(separated.purchaseQuantity, { value: "1", unit: "package" }, "Scenario F keeps purchase quantity separate.");

const rtl = localization.formatIngredientQuantity(canonicalSpinach, { id: "spinach" }, { locale: "ar", measurementSystem: "metric" });
assert(rtl.display.includes("سبانخ") && rtl.display.includes("\u2066200 g\u2069"), "Scenario G isolates Arabic ingredient and Latin measurement text.");
assert.strictEqual(localization.formatDate("2026-08-18", { locale: "fr-CA", timeZone: "America/Toronto" }), "18 août 2026", "Dates use selected locale.");
assert.notStrictEqual(
  localization.formatTime("2026-08-18T22:30:00Z", { locale: "en-CA", timeZone: "America/Toronto", hourCycle: "24" }),
  localization.formatTime("2026-08-18T22:30:00Z", { locale: "en-CA", timeZone: "America/Vancouver", hourCycle: "24" }),
  "Time-zone changes affect display only."
);

const exported = localization.createLocalizedExport({ ingredient: { id: "soup" }, canonicalQuantity: canonicalSoup }, { locale: "fr-CA", measurementSystem: "metric" });
assert.strictEqual(exported.canonicalQuantity.value, "1.5", "Scenario H export preserves canonical value.");
assert.strictEqual(exported.localizedDisplay, "1,5 L de soupe", "Scenario H export includes localized display.");
const imported = localization.importLocalizedExport(exported);
const importedImperial = localization.formatIngredientQuantity(imported.canonicalQuantity, { id: "soup" }, { locale: "en-US", measurementSystem: "imperial" });
assert.strictEqual(imported.canonicalQuantity.value, "1.5", "Scenario H import does not parse localized display text.");
assert(importedImperial.display.includes("cup soup"), "Scenario H only presentation changes after import.");

const densityBlocked = localization.convertQuantity({ value: "120", unit: "g" }, "cup");
assert.strictEqual(densityBlocked.ok, false, "Mass-to-volume conversion is blocked without verified density.");
assert.strictEqual(densityBlocked.reason, "density-required", "Density-specific conversion failure is explicit.");
assert.strictEqual(localization.formatQuantity({ value: "1", unit: "package" }, { locale: "en-CA" }, { unitStyle: "long" }).display, "1 package", "Singular unit grammar works.");
assert.strictEqual(localization.formatQuantity({ value: "3", unit: "package" }, { locale: "en-CA" }, { unitStyle: "long" }).display, "3 packages", "Plural unit grammar works.");
assert.deepStrictEqual(localization.formatCommonFraction({ value: "0.5", unit: "cup" }, { locale: "en-CA" }), { display: "½ cup", accessibleLabel: "one half cup" }, "Common fractions render with accessible labels.");
assert.strictEqual(localization.formatQuantity({ value: "5", unit: "smidge" }, { locale: "en-CA" }).ok, false, "Unknown units fail gracefully.");
assert(localization.createMeasurementSpeechText(canonicalSpinach, "en-CA", { ingredient: { id: "spinach" } }).includes("grams"), "TTS receives expanded measurement text.");

[
  "scripts/localization-service.js",
  "localizationPreferences",
  "renderLocalizationPreferencesSection",
  "saveLocalizationPreferencesFromForm",
  "formatShoppingQuantity",
  "LOCALIZATION.formatDate",
  "LOCALIZATION.formatDateTime"
].forEach((needle) => assert(app.includes(needle) || html.includes(needle), `App integration missing ${needle}`));

[
  "localization-settings",
  "localization-preview",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((needle) => assert(css.includes(needle), `Localization styling missing ${needle}`));

console.log("Step 65 localization service tests passed.");
