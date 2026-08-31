/* Chef Nova localization service. Canonical values stay locale-independent. */
(function (root, factory) {
  const service = factory();
  if (typeof module === "object" && module.exports) module.exports = service;
  root.ChefNovaLocalization = service;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const DEFAULT_PREFERENCES = Object.freeze({
    locale: "en-CA",
    regionCode: "CA",
    measurementSystem: "metric",
    temperatureDisplay: "both",
    hourCycle: "12",
    timeZone: "America/Toronto"
  });

  const SUPPORTED_LOCALES = Object.freeze(["en-CA", "en-US", "fr-CA", "fr-FR", "zh-CN", "ar"]);
  const SUPPORTED_REGIONS = Object.freeze(["CA", "US", "FR", "CN"]);
  const MEASUREMENT_SYSTEMS = Object.freeze(["metric", "imperial", "recipe-original"]);
  const TEMPERATURE_DISPLAY_MODES = Object.freeze(["celsius", "fahrenheit", "both"]);
  const HOUR_CYCLES = Object.freeze(["12", "24"]);
  const CANONICAL_UNITS = Object.freeze(["g", "kg", "mg", "mL", "L", "tsp", "tbsp", "cup", "fl_oz", "oz", "lb", "cm", "in", "count", "pinch", "dash", "clove", "slice", "can", "package", "bunch", "C", "F", "minute", "hour"]);

  const UNIT_ALIASES = Object.freeze({
    gram: "g", grams: "g", g: "g",
    kilogram: "kg", kilograms: "kg", kg: "kg",
    milligram: "mg", milligrams: "mg", mg: "mg",
    ml: "mL", milliliter: "mL", milliliters: "mL", millilitre: "mL", millilitres: "mL", mL: "mL",
    l: "L", liter: "L", liters: "L", litre: "L", litres: "L", L: "L",
    teaspoon: "tsp", teaspoons: "tsp", tsp: "tsp",
    tablespoon: "tbsp", tablespoons: "tbsp", tbsp: "tbsp",
    cups: "cup", cup: "cup",
    ounce: "oz", ounces: "oz", oz: "oz",
    "fluid ounce": "fl_oz", "fluid ounces": "fl_oz", "fl oz": "fl_oz", fl_oz: "fl_oz",
    pound: "lb", pounds: "lb", lb: "lb", lbs: "lb",
    centimeter: "cm", centimeters: "cm", centimetre: "cm", centimetres: "cm", cm: "cm",
    inch: "in", inches: "in", in: "in",
    each: "count", item: "count", items: "count", piece: "count", pieces: "count", count: "count",
    cloves: "clove", clove: "clove",
    slices: "slice", slice: "slice",
    cans: "can", can: "can",
    packages: "package", package: "package",
    bunches: "bunch", bunch: "bunch",
    c: "C", "\u00B0c": "C", celsius: "C", C: "C",
    f: "F", "\u00B0f": "F", fahrenheit: "F", F: "F",
    minutes: "minute", minute: "minute", min: "minute",
    hours: "hour", hour: "hour", hr: "hour"
  });

  const UNIT_DIMENSIONS = Object.freeze({
    g: "mass", kg: "mass", mg: "mass", oz: "mass", lb: "mass",
    mL: "volume", L: "volume", tsp: "volume", tbsp: "volume", cup: "volume", fl_oz: "volume",
    cm: "length", in: "length",
    C: "temperature", F: "temperature",
    minute: "duration", hour: "duration",
    count: "count", pinch: "count", dash: "count", clove: "count", slice: "count", can: "count", package: "count", bunch: "count"
  });

  const UNIT_LABELS = Object.freeze({
    en: {
      g: ["gram", "grams", "g"], kg: ["kilogram", "kilograms", "kg"], mg: ["milligram", "milligrams", "mg"],
      mL: ["millilitre", "millilitres", "mL"], L: ["litre", "litres", "L"], tsp: ["teaspoon", "teaspoons", "tsp"],
      tbsp: ["tablespoon", "tablespoons", "tbsp"], cup: ["cup", "cups", "cup"], fl_oz: ["fluid ounce", "fluid ounces", "fl oz"],
      oz: ["ounce", "ounces", "oz"], lb: ["pound", "pounds", "lb"], cm: ["centimetre", "centimetres", "cm"],
      in: ["inch", "inches", "in"], count: ["item", "items", ""], pinch: ["pinch", "pinches", "pinch"],
      dash: ["dash", "dashes", "dash"], clove: ["clove", "cloves", "clove"], slice: ["slice", "slices", "slice"],
      can: ["can", "cans", "can"], package: ["package", "packages", "package"], bunch: ["bunch", "bunches", "bunch"],
      C: ["degree Celsius", "degrees Celsius", "\u00B0C"], F: ["degree Fahrenheit", "degrees Fahrenheit", "\u00B0F"],
      minute: ["minute", "minutes", "min"], hour: ["hour", "hours", "hr"]
    },
    fr: {
      g: ["gramme", "grammes", "g"], kg: ["kilogramme", "kilogrammes", "kg"], mg: ["milligramme", "milligrammes", "mg"],
      mL: ["millilitre", "millilitres", "mL"], L: ["litre", "litres", "L"], tsp: ["cuilleree a cafe", "cuillerees a cafe", "c. a cafe"],
      tbsp: ["cuilleree a soupe", "cuillerees a soupe", "c. a soupe"], cup: ["tasse", "tasses", "tasse"], fl_oz: ["once liquide", "onces liquides", "oz liq"],
      oz: ["once", "onces", "oz"], lb: ["livre", "livres", "lb"], cm: ["centimetre", "centimetres", "cm"],
      in: ["pouce", "pouces", "po"], count: ["article", "articles", ""], clove: ["gousse", "gousses", "gousse"],
      slice: ["tranche", "tranches", "tranche"], can: ["boite", "boites", "boite"], package: ["paquet", "paquets", "paquet"],
      bunch: ["botte", "bottes", "botte"], C: ["degre Celsius", "degres Celsius", "\u00B0C"], F: ["degre Fahrenheit", "degres Fahrenheit", "\u00B0F"],
      minute: ["minute", "minutes", "min"], hour: ["heure", "heures", "h"]
    },
    zh: {
      g: ["克", "克", "克"], kg: ["千克", "千克", "千克"], mg: ["毫克", "毫克", "毫克"], mL: ["毫升", "毫升", "毫升"], L: ["升", "升", "升"],
      tsp: ["茶匙", "茶匙", "茶匙"], tbsp: ["汤匙", "汤匙", "汤匙"], cup: ["杯", "杯", "杯"], oz: ["盎司", "盎司", "盎司"],
      lb: ["磅", "磅", "磅"], count: ["个", "个", "个"], C: ["摄氏度", "摄氏度", "\u00B0C"], F: ["华氏度", "华氏度", "\u00B0F"],
      minute: ["分钟", "分钟", "分钟"], hour: ["小时", "小时", "小时"]
    },
    ar: {
      g: ["غرام", "غرامات", "g"], kg: ["كيلوغرام", "كيلوغرامات", "kg"], mL: ["ملليلتر", "ملليلترات", "mL"], L: ["لتر", "لترات", "L"],
      oz: ["أونصة", "أونصات", "oz"], lb: ["رطل", "أرطال", "lb"], count: ["عنصر", "عناصر", ""], C: ["درجة مئوية", "درجات مئوية", "\u00B0C"],
      F: ["درجة فهرنهايت", "درجات فهرنهايت", "\u00B0F"], minute: ["دقيقة", "دقائق", "د"], hour: ["ساعة", "ساعات", "س"]
    }
  });

  const INGREDIENT_NAMES = Object.freeze({
    spinach: { "en-CA": "spinach", "en-US": "spinach", "fr-CA": "épinards", "fr-FR": "épinards", "zh-CN": "菠菜", ar: "سبانخ" },
    soup: { "en-CA": "soup", "en-US": "soup", "fr-CA": "soupe", "fr-FR": "soupe", "zh-CN": "汤", ar: "حساء" },
    pasta: { "en-CA": "pasta", "en-US": "pasta", "fr-CA": "pâtes", "fr-FR": "pâtes", "zh-CN": "意大利面", ar: "معكرونة" }
  });

  const FRENCH_DE_INGREDIENTS = new Set(["soupe"]);
  const RTL_LOCALES = new Set(["ar"]);
  const WORD_JOINER = "\u2060";
  const LRI = "\u2066";
  const PDI = "\u2069";

  const SAFETY_TEMPERATURE_THRESHOLDS = Object.freeze({
    chickenInternal: {
      id: "chicken-internal-minimum",
      operator: "atLeast",
      canonicalCelsius: "74",
      approvedDisplayCelsius: "74\u00B0C",
      approvedDisplayFahrenheit: "165\u00B0F",
      sourceId: "chef-nova-safety-threshold-catalogue",
      lastVerifiedAt: "2026-08-15"
    }
  });

  function normalizePreferences(input = {}) {
    const merged = { ...DEFAULT_PREFERENCES, ...(input || {}) };
    const locale = SUPPORTED_LOCALES.includes(merged.locale) ? merged.locale : DEFAULT_PREFERENCES.locale;
    const rawRegion = Object.prototype.hasOwnProperty.call(input || {}, "regionCode") ? String(merged.regionCode || "").trim() : "";
    const localeRegion = locale.split("-")[1];
    const regionCode = rawRegion === "device" || SUPPORTED_REGIONS.includes(rawRegion.toUpperCase()) ? (rawRegion === "device" ? "device" : rawRegion.toUpperCase()) : (localeRegion ? localeRegion.toUpperCase() : "device");
    return {
      locale,
      regionCode,
      measurementSystem: MEASUREMENT_SYSTEMS.includes(merged.measurementSystem) ? merged.measurementSystem : DEFAULT_PREFERENCES.measurementSystem,
      temperatureDisplay: TEMPERATURE_DISPLAY_MODES.includes(merged.temperatureDisplay) ? merged.temperatureDisplay : DEFAULT_PREFERENCES.temperatureDisplay,
      hourCycle: HOUR_CYCLES.includes(String(merged.hourCycle)) ? String(merged.hourCycle) : DEFAULT_PREFERENCES.hourCycle,
      timeZone: merged.timeZone || DEFAULT_PREFERENCES.timeZone
    };
  }

  function normalizeUnit(unit) {
    return UNIT_ALIASES[String(unit || "").trim()] || String(unit || "").trim();
  }

  function normalizeDecimalString(value) {
    if (value === null || value === undefined || value === "") return null;
    const text = String(value).trim();
    if (!/^-?\d+(?:\.\d+)?$/.test(text)) return null;
    return text.replace(/^(-?)0+(\d)/, "$1$2");
  }

  function createCanonicalQuantity({ value, unit, minimumValue, maximumValue, approximate = false } = {}) {
    const normalizedUnit = normalizeUnit(unit);
    if (!CANONICAL_UNITS.includes(normalizedUnit)) return { ok: false, reason: "unknown-unit", unit: normalizedUnit || null };
    const normalizedValue = normalizeDecimalString(value);
    const min = minimumValue === undefined ? undefined : normalizeDecimalString(minimumValue);
    const max = maximumValue === undefined ? undefined : normalizeDecimalString(maximumValue);
    if (!normalizedValue && (!min || !max)) return { ok: false, reason: "invalid-decimal" };
    if (min && max && Number(min) > Number(max)) return { ok: false, reason: "invalid-range" };
    return { ok: true, quantity: { value: normalizedValue || min, unit: normalizedUnit, ...(min ? { minimumValue: min } : {}), ...(max ? { maximumValue: max } : {}), ...(approximate ? { approximate: true } : {}) } };
  }

  function getSeparators(locale) {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    return {
      group: parts.find((part) => part.type === "group")?.value || ",",
      decimal: parts.find((part) => part.type === "decimal")?.value || "."
    };
  }

  function digitMap(locale) {
    const map = {};
    for (let index = 0; index <= 9; index += 1) {
      map[new Intl.NumberFormat(locale, { useGrouping: false }).format(index)] = String(index);
    }
    return map;
  }

  function parseLocalizedNumber(input, locale = DEFAULT_PREFERENCES.locale) {
    const raw = String(input ?? "").trim();
    if (!raw) return { ok: false, reason: "empty", originalInput: raw };
    const { group, decimal } = getSeparators(locale);
    const digits = digitMap(locale);
    let text = Array.from(raw).map((char) => digits[char] ?? char).join("");
    text = text.replace(/\u00A0|\u202F/g, " ");
    const groupEscaped = group.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const decimalEscaped = decimal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const validChars = new RegExp(`^[+-]?[0-9${groupEscaped}${decimalEscaped} ]+$`);
    if (!validChars.test(text)) return { ok: false, reason: "invalid-characters", originalInput: raw };
    const decimalMatches = text.match(new RegExp(decimalEscaped, "g")) || [];
    if (decimalMatches.length > 1) return { ok: false, reason: "too-many-decimals", originalInput: raw };
    if (decimal !== "." && text.includes(".") && !text.includes(decimal)) return { ok: false, reason: "ambiguous-decimal", originalInput: raw };
    const noGroups = text.replace(new RegExp(groupEscaped, "g"), "").replace(/ /g, "");
    const normalized = noGroups.replace(decimal, ".");
    if (!/^[+-]?\d+(?:\.\d+)?$/.test(normalized)) return { ok: false, reason: "malformed-number", originalInput: raw };
    return { ok: true, value: normalized.replace(/^\+/, ""), originalInput: raw };
  }

  function decimalToNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function cleanDecimal(number, maximumFractionDigits = 6) {
    if (!Number.isFinite(number)) return null;
    return Number(number.toFixed(maximumFractionDigits)).toString();
  }

  function formatLocalizedNumber(value, locale = DEFAULT_PREFERENCES.locale, options = {}) {
    const number = decimalToNumber(value);
    if (number === null) return "Not available";
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: options.maximumFractionDigits ?? 2,
      minimumFractionDigits: options.minimumFractionDigits ?? 0,
      useGrouping: options.useGrouping !== false
    }).format(number);
  }

  function convertQuantity(quantity, targetUnit, options = {}) {
    const canonical = migrateLegacyQuantity(quantity);
    const sourceUnit = normalizeUnit(canonical?.unit);
    const normalizedTarget = normalizeUnit(targetUnit);
    const value = decimalToNumber(canonical?.value);
    if (value === null) return { ok: false, reason: "invalid-quantity", canonicalQuantity: canonical };
    if (sourceUnit === normalizedTarget) return { ok: true, canonicalQuantity: canonical, quantity: { value: canonical.value, unit: sourceUnit }, exactValue: canonical.value, approximate: Boolean(canonical.approximate) };
    if (UNIT_DIMENSIONS[sourceUnit] !== UNIT_DIMENSIONS[normalizedTarget]) {
      if (["g", "kg", "mg", "oz", "lb"].includes(sourceUnit) && ["cup", "tsp", "tbsp", "mL", "L", "fl_oz"].includes(normalizedTarget) && !options.densityProfile) {
        return { ok: false, reason: "density-required", message: "Cup conversion is unavailable because this ingredient does not have verified density information.", canonicalQuantity: canonical };
      }
      return { ok: false, reason: "incompatible-unit", canonicalQuantity: canonical };
    }
    const toBase = { mg: 0.001, g: 1, kg: 1000, oz: 28.349523125, lb: 453.59237, mL: 1, L: 1000, tsp: 4.92892159375, tbsp: 14.78676478125, cup: 236.5882365, fl_oz: 29.5735295625, cm: 1, in: 2.54, minute: 1, hour: 60 };
    if (!toBase[sourceUnit] || !toBase[normalizedTarget]) return { ok: false, reason: "unsupported-conversion", canonicalQuantity: canonical };
    const converted = value * toBase[sourceUnit] / toBase[normalizedTarget];
    return { ok: true, canonicalQuantity: canonical, quantity: { value: cleanDecimal(converted), unit: normalizedTarget, approximate: sourceUnit !== normalizedTarget || Boolean(canonical.approximate) }, exactValue: cleanDecimal(converted, 10), approximate: sourceUnit !== normalizedTarget || Boolean(canonical.approximate) };
  }

  function chooseDisplayQuantity(quantity, preferences = {}, options = {}) {
    const prefs = normalizePreferences(preferences);
    const canonical = migrateLegacyQuantity(quantity);
    const unit = normalizeUnit(canonical?.unit);
    if (!canonical || !CANONICAL_UNITS.includes(unit)) return { ok: false, reason: "unknown-unit", canonicalQuantity: canonical };
    if (prefs.measurementSystem === "imperial") {
      const target = { g: "oz", kg: "lb", mL: "fl_oz", L: "cup", cm: "in", C: "F" }[unit];
      if (target) return convertQuantity(canonical, target, options);
    }
    return { ok: true, canonicalQuantity: canonical, quantity: { ...canonical, unit }, exactValue: canonical.value, approximate: Boolean(canonical.approximate) };
  }

  function languageKey(locale) {
    if (String(locale).startsWith("fr")) return "fr";
    if (String(locale).startsWith("zh")) return "zh";
    if (String(locale).startsWith("ar")) return "ar";
    return "en";
  }

  function unitLabel(unit, value, locale, style = "compact") {
    const normalized = normalizeUnit(unit);
    const labels = UNIT_LABELS[languageKey(locale)]?.[normalized] || UNIT_LABELS.en[normalized];
    if (!labels) return normalized;
    if (style === "compact") return labels[2];
    const category = new Intl.PluralRules(locale).select(Math.abs(Number(value)) || 0);
    return category === "one" ? labels[0] : labels[1];
  }

  function formatQuantity(quantity, preferences = {}, options = {}) {
    const prefs = normalizePreferences(preferences);
    const display = chooseDisplayQuantity(quantity, prefs, options);
    if (!display.ok) return { ok: false, display: display.message || "Measurement unavailable", reason: display.reason, canonicalQuantity: display.canonicalQuantity };
    const q = display.quantity;
    const defaultMaximum = display.approximate && ["oz", "fl_oz", "cup"].includes(q.unit) ? 0 : display.approximate ? 1 : 2;
    const number = formatLocalizedNumber(q.value, prefs.locale, { maximumFractionDigits: options.maximumFractionDigits ?? defaultMaximum });
    const unit = unitLabel(q.unit, q.value, prefs.locale, options.unitStyle || "compact");
    const prefix = display.approximate || q.approximate ? localizedApproximate(prefs.locale, options.sentenceCase) : "";
    const visual = `${prefix}${number}${unit ? ` ${unit}` : ""}`.trim();
    return { ok: true, display: visual, accessibleText: `${prefix}${formatLocalizedNumber(q.value, prefs.locale)} ${unitLabel(q.unit, q.value, prefs.locale, "long")}`.trim(), canonicalQuantity: display.canonicalQuantity, displayQuantity: q, exactValue: display.exactValue, approximate: display.approximate || Boolean(q.approximate) };
  }

  function localizedApproximate(locale, sentenceCase = false) {
    const text = String(locale).startsWith("fr") ? "environ " : String(locale).startsWith("zh") ? "约" : String(locale).startsWith("ar") ? "حوالي " : "approximately ";
    return sentenceCase && text === "approximately " ? "Approximately " : text;
  }

  function translateIngredient(ingredient, locale) {
    const key = typeof ingredient === "string" ? ingredient : ingredient?.id || ingredient?.ingredientId || ingredient?.name;
    const fallback = typeof ingredient === "string" ? ingredient : ingredient?.name || ingredient?.displayName || key || "ingredient";
    return INGREDIENT_NAMES[String(key || "").toLowerCase()]?.[locale] || INGREDIENT_NAMES[String(fallback || "").toLowerCase()]?.[locale] || fallback;
  }

  function formatIngredientQuantity(quantity, ingredient, preferences = {}, options = {}) {
    const prefs = normalizePreferences(preferences);
    const q = formatQuantity(quantity, prefs, { ...options, sentenceCase: prefs.measurementSystem === "imperial" });
    const ingredientName = translateIngredient(ingredient, prefs.locale);
    if (!q.ok) return { ...q, display: `${ingredientName}: ${q.display}` };
    let display;
    if (prefs.locale === "zh-CN") display = `${ingredientName} ${q.display}`;
    else if (prefs.locale.startsWith("fr")) display = `${q.display} ${FRENCH_DE_INGREDIENTS.has(ingredientName) ? "de " : "d’"}${ingredientName}`;
    else display = `${q.display} ${ingredientName}`;
    if (RTL_LOCALES.has(prefs.locale)) display = `${ingredientName} ${LRI}${q.display}${PDI}`;
    return { ...q, ingredient: ingredientName, display, html: `<bdi>${display}</bdi>` };
  }

  function formatTemperature(temperature, preferences = {}, options = {}) {
    const prefs = normalizePreferences(preferences);
    const canonical = migrateLegacyQuantity(typeof temperature === "object" ? temperature : { value: String(temperature), unit: "C" });
    const celsius = normalizeUnit(canonical.unit) === "F" ? (decimalToNumber(canonical.value) - 32) * 5 / 9 : decimalToNumber(canonical.value);
    if (!Number.isFinite(celsius)) return { ok: false, display: "Temperature unavailable" };
    const fahrenheit = celsius * 9 / 5 + 32;
    const cText = `${formatLocalizedNumber(cleanDecimal(celsius, 1), prefs.locale, { maximumFractionDigits: options.maximumFractionDigits ?? 0 })}\u00B0C`;
    const fText = `${formatLocalizedNumber(cleanDecimal(fahrenheit, 1), prefs.locale, { maximumFractionDigits: options.maximumFractionDigits ?? 0 })}\u00B0F`;
    const display = prefs.temperatureDisplay === "celsius" ? cText : prefs.temperatureDisplay === "fahrenheit" ? fText : `${cText} / ${fText}`;
    return { ok: true, canonicalCelsius: cleanDecimal(celsius, 4), display, approximate: Boolean(options.rounded) };
  }

  function formatSafetyTemperature(threshold, localeOrPrefs = DEFAULT_PREFERENCES.locale, displayMode = "both") {
    const prefs = typeof localeOrPrefs === "string" ? normalizePreferences({ locale: localeOrPrefs, temperatureDisplay: displayMode }) : normalizePreferences(localeOrPrefs);
    const item = typeof threshold === "string" ? SAFETY_TEMPERATURE_THRESHOLDS[threshold] : threshold;
    if (!item?.approvedDisplayCelsius || !item?.approvedDisplayFahrenheit) return { ok: false, display: "Safety temperature unavailable", reason: "missing-approved-pair" };
    const temp = prefs.temperatureDisplay === "celsius" ? item.approvedDisplayCelsius : prefs.temperatureDisplay === "fahrenheit" ? item.approvedDisplayFahrenheit : `${item.approvedDisplayCelsius} / ${item.approvedDisplayFahrenheit}`;
    const operator = item.operator === "below" ? "Keep below" : item.operator === "noWarmerThan" ? "Keep no warmer than" : "Heat to at least";
    return { ok: true, threshold: item, display: `${operator} ${temp}.`, spokenText: `${operator.toLowerCase()} ${item.approvedDisplayCelsius.replace("\u00B0", " degrees ")} or ${item.approvedDisplayFahrenheit.replace("\u00B0", " degrees ")}.` };
  }

  function formatDate(date, preferences = {}, options = {}) {
    const prefs = normalizePreferences(preferences);
    const value = date instanceof Date ? date : new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? `${date}T12:00:00` : date);
    if (Number.isNaN(value.getTime())) return "Date not recorded";
    return new Intl.DateTimeFormat(prefs.locale, { timeZone: prefs.timeZone, dateStyle: options.dateStyle || "long" }).format(value);
  }

  function formatTime(date, preferences = {}, options = {}) {
    const prefs = normalizePreferences(preferences);
    const value = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(value.getTime())) return "Time not recorded";
    return new Intl.DateTimeFormat(prefs.locale, { timeZone: prefs.timeZone, hour: "numeric", minute: "2-digit", hour12: prefs.hourCycle === "12", ...options }).format(value);
  }

  function formatDateTime(date, preferences = {}, options = {}) {
    const prefs = normalizePreferences(preferences);
    const value = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(value.getTime())) return "Date not recorded";
    return new Intl.DateTimeFormat(prefs.locale, { timeZone: prefs.timeZone, dateStyle: options.dateStyle || "long", timeStyle: options.timeStyle || "short", hour12: prefs.hourCycle === "12" }).format(value);
  }

  function formatDuration(duration, preferences = {}) {
    const prefs = normalizePreferences(preferences);
    const minutes = Number(typeof duration === "object" ? duration.minutes ?? Number(duration.hours || 0) * 60 : duration);
    if (!Number.isFinite(minutes)) return "Duration unavailable";
    const hours = Math.floor(minutes / 60);
    const remaining = Math.round(minutes % 60);
    const parts = [];
    if (hours) parts.push(`${formatLocalizedNumber(hours, prefs.locale)} ${unitLabel("hour", hours, prefs.locale, "long")}`);
    if (remaining || !parts.length) parts.push(`${formatLocalizedNumber(remaining, prefs.locale)} ${unitLabel("minute", remaining, prefs.locale, "long")}`);
    return new Intl.ListFormat(prefs.locale, { style: "long", type: "conjunction" }).format(parts);
  }

  function createMeasurementSpeechText(quantity, locale = DEFAULT_PREFERENCES.locale, context = {}) {
    if (context.safetyThreshold) return formatSafetyTemperature(context.safetyThreshold, locale, "both").spokenText;
    const formatted = context.ingredient ? formatIngredientQuantity(quantity, context.ingredient, { locale }, { unitStyle: "long" }) : formatQuantity(quantity, { locale }, { unitStyle: "long" });
    return formatted.accessibleText || formatted.display;
  }

  function formatCommonFraction(quantity, preferences = {}) {
    const prefs = normalizePreferences(preferences);
    const canonical = migrateLegacyQuantity(quantity);
    const value = decimalToNumber(canonical?.value);
    const fractions = [{ value: 0.25, visual: "\u00BC", label: "one quarter" }, { value: 1 / 3, visual: "\u2153", label: "one third" }, { value: 0.5, visual: "\u00BD", label: "one half" }, { value: 2 / 3, visual: "\u2154", label: "two thirds" }, { value: 0.75, visual: "\u00BE", label: "three quarters" }];
    if (!Number.isFinite(value)) return null;
    const whole = Math.floor(value);
    const remainder = value - whole;
    const match = fractions.find((item) => Math.abs(item.value - remainder) < 0.001);
    if (!match || Math.abs(match.value - remainder) >= 0.001) return null;
    const visual = `${whole ? `${formatLocalizedNumber(whole, prefs.locale)} ` : ""}${match.visual} ${unitLabel(canonical.unit, value, prefs.locale, "compact")}`.trim();
    return { display: visual, accessibleLabel: `${whole ? `${whole} and ` : ""}${match.label} ${unitLabel(canonical.unit, 1, prefs.locale, "long")}` };
  }

  function migrateLegacyQuantity(value, unit) {
    if (value && typeof value === "object" && "value" in value && "unit" in value) return { ...value, unit: normalizeUnit(value.unit) };
    if (value && typeof value === "object" && "point" in value && "unit" in value) return { value: String(value.point), unit: normalizeUnit(value.unit), ...(value.minimumValue ? { minimumValue: String(value.minimumValue) } : {}), ...(value.maximumValue ? { maximumValue: String(value.maximumValue) } : {}), approximate: value.approximate === true || value.status === "estimated" };
    return { value: String(value ?? ""), unit: normalizeUnit(unit || "count") };
  }

  function createSeparatedQuantityModel({ ingredientId, recipeUseQuantity, packageQuantity, purchaseQuantity } = {}) {
    return {
      ingredientId,
      recipeUseQuantity: migrateLegacyQuantity(recipeUseQuantity),
      packageQuantity: migrateLegacyQuantity(packageQuantity),
      purchaseQuantity: migrateLegacyQuantity(purchaseQuantity)
    };
  }

  function createLocalizedExport(record = {}, preferences = {}) {
    const prefs = normalizePreferences(preferences);
    return {
      ...record,
      canonicalQuantity: migrateLegacyQuantity(record.canonicalQuantity || record.quantity),
      localizedDisplay: record.ingredient ? formatIngredientQuantity(record.canonicalQuantity || record.quantity, record.ingredient, prefs).display : formatQuantity(record.canonicalQuantity || record.quantity, prefs).display,
      locale: prefs.locale,
      measurementSystem: prefs.measurementSystem,
      temperatureDisplay: prefs.temperatureDisplay,
      timeZone: prefs.timeZone
    };
  }

  function importLocalizedExport(exported = {}) {
    return {
      ...exported,
      canonicalQuantity: migrateLegacyQuantity(exported.canonicalQuantity),
      localizedDisplay: undefined
    };
  }

  return {
    DEFAULT_PREFERENCES,
    SUPPORTED_LOCALES,
    SUPPORTED_REGIONS,
    MEASUREMENT_SYSTEMS,
    TEMPERATURE_DISPLAY_MODES,
    HOUR_CYCLES,
    CANONICAL_UNITS,
    SAFETY_TEMPERATURE_THRESHOLDS,
    normalizePreferences,
    normalizeUnit,
    createCanonicalQuantity,
    parseLocalizedNumber,
    formatLocalizedNumber,
    convertQuantity,
    formatQuantity,
    formatIngredientQuantity,
    formatTemperature,
    formatSafetyTemperature,
    formatDate,
    formatTime,
    formatDateTime,
    formatDuration,
    createMeasurementSpeechText,
    formatCommonFraction,
    migrateLegacyQuantity,
    createSeparatedQuantityModel,
    createLocalizedExport,
    importLocalizedExport
  };
});
