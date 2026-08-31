const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function expect(source, text, message) {
  assert(source.includes(text), message || `${text} should exist.`);
}

[
  "FOOD_DATE_TYPES",
  "BEST_BEFORE: \"best-before\"",
  "EXPIRATION: \"expiration\"",
  "PACKAGED_ON: \"packaged-on\"",
  "PURCHASED_ON: \"purchased-on\"",
  "OPENED_ON: \"opened-on\"",
  "COOKED_ON: \"cooked-on\"",
  "HOMEMADE_ESTIMATE: \"homemade-estimate\"",
  "UNKNOWN: \"unknown\"",
  "APP_ESTIMATED_FRESHNESS: \"app-estimated-freshness\"",
  "FOOD_DATE_SOURCES",
  "PACKAGE_LABEL: \"package-label\"",
  "USER_RECORDED_EVENT: \"user-recorded-event\"",
  "USER_ESTIMATE: \"user-estimate\"",
  "CHEF_NOVA_ESTIMATE: \"chef-nova-estimate\"",
  "LEGACY_UNCLASSIFIED: \"legacy-unclassified\"",
  "FOOD_DATE_ATTENTION_STATUSES",
  "deriveFoodDateIntelligence",
  "renderFoodDateBadge",
  "dateRecords",
  "dateIntelligenceVersion",
  "migrateLegacyPantryDateRecords",
  "validateFoodDateRecordInput",
  "getPantryDateConsistencyWarnings",
  "handlePantryDateRecordSubmit",
  "removePantryDateRecord",
  "blocksAutomaticRecommendation"
].forEach((text) => expect(app, text));

[
  "Best before",
  "Expiration date",
  "Packaged on",
  "Purchased on",
  "Opened on",
  "Cooked on",
  "Homemade estimate",
  "I am not sure",
  "What type of date is this?",
  "Confirm expiration date",
  "Yes, the package says expiration or EXP"
].forEach((text) => expect(html, text, `Pantry add form should include ${text}.`));

assert(!html.includes('name="foodDateType" type="radio" value="expiration" checked'), "Expiration date must not be selected by default.");
assert(!html.includes("Expiration date<input name=\"expirationDate\""), "The add form should not label the generic date as Expiration date.");

[
  "Best Before Tomorrow",
  "Best-Before Date Passed",
  "Expiration Date Tomorrow",
  "Expiration Date Passed",
  "Homemade Estimate — Use Soon",
  "Date Needs Confirmation",
  "Past Date Needs Confirmation",
  "This date relates primarily to expected freshness and quality, not an automatic food-safety deadline.",
  "not an official package date",
  "event date, not an expiration date",
  "Chef Nova will not recommend this item for meals, substitutions, leftovers, or Pantry-first planning."
].forEach((text) => expect(app, text));

assert(app.includes("legacyType = item.freshnessDateType === FOOD_DATE_TYPES.BEST_BEFORE ? FOOD_DATE_TYPES.BEST_BEFORE : FOOD_DATE_TYPES.UNKNOWN"), "Legacy generic dates should migrate to unknown unless reliable best-before metadata exists.");
assert(!app.includes("dateType: \"expiration\", source: FOOD_DATE_SOURCES.LEGACY_UNCLASSIFIED"), "Legacy unclassified dates must not become confirmed expiration dates.");
assert(app.includes("getActivePantryItems().map((item) => item.ingredientId)") && app.includes("getExpiredConfirmedIngredientIds()"), "Eligibility should consume active Pantry and confirmed-expiration exclusions.");
assert(app.includes("dateType === FOOD_DATE_TYPES.EXPIRATION && data.get(\"expirationPackageConfirmed\") !== \"yes\""), "Unconfirmed expiration selection should become unknown.");

[
  ".food-date-type-fieldset",
  ".pantry-date-records",
  ".pantry-date-actions",
  ".food-date-message",
  ".expiration-badge.unknown",
  ".date-type-grid"
].forEach((selector) => expect(css, selector));

console.log("Cook Before It Spoils Step 3 Date Intelligence static checks passed.");
