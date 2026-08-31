const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const eligibilityModule = fs.readFileSync("scripts/recipe-eligibility-ranking.js", "utf8");

[
  "FOOD_SAFETY_GUARDRAIL_VERSION = 1",
  "FOOD_SAFETY_POLICY_SCHEMA_VERSION = 1",
  "STORAGE_SAFETY_REVIEW_VERSION = 1",
  "STORAGE_ENVIRONMENT_VERSION = 1",
  "FOOD_STORAGE_TEMPERATURES_C",
  "REFRIGERATOR_MAX: 4",
  "FREEZER_MAX: -18",
  "DANGER_ZONE_MIN: 4",
  "DANGER_ZONE_MAX: 60",
  "REHEAT_LEFTOVERS: 74",
  "STORAGE_TEMPERATURE_STATUSES",
  "CONTINUOUS_STORAGE_STATUSES",
  "FOOD_SAFETY_WINDOW_ANCHORS",
  "FOOD_SAFETY_DECISIONS",
  "FOOD_SAFETY_REASON_CODES",
  "FOOD_SAFETY_POLICY_CATALOGUE"
].forEach((token) => assert(app.includes(token), `Missing Step 6 token: ${token}`));

[
  "health-canada::fresh-meat::refrigerator",
  "health-canada::ground-meat::refrigerator",
  "health-canada::fresh-poultry::refrigerator",
  "health-canada::fresh-fish::refrigerator",
  "health-canada::shellfish::refrigerator",
  "health-canada::opened-dairy::refrigerator",
  "health-canada::eggs-shell::refrigerator",
  "health-canada::leftover-cooked-dish::refrigerator",
  "health-canada::soups::refrigerator",
  "health-canada::leaf-lettuce::refrigerator",
  "sourceReviewedAt: \"2026-08-11\"",
  "sourceUrl: \"https://www.canada.ca/en/health-canada/services/general-food-safety-tips/safe-food-storage.html\"",
  "sourceUrl: \"https://www.canada.ca/en/services/health/publications/food-nutrition/infographic-leftovers.html\""
].forEach((token) => assert(app.includes(token), `Missing reviewed policy data: ${token}`));

[
  "createDefaultStorageEnvironment",
  "normalizeTemperatureToCelsius",
  "normalizeStorageEnvironment",
  "loadStorageEnvironment",
  "saveStorageEnvironment",
  "normalizePantryStorageSafetyReview",
  "findFoodSafetyPolicyForPantryItem",
  "deriveFoodSafetyGuardrail",
  "getFoodSafetyGuardrailForPantryItem",
  "getFoodSafetyGuardrailsForPantry",
  "getFoodSafetyExcludedIngredientIds",
  "getFoodSafetyPolicyCoverage",
  "renderFoodSafetyNotice",
  "renderFoodSafetyGuardrailForPantryItem",
  "renderStorageSafetyReviewForm",
  "handleStorageSafetyReviewSubmit"
].forEach((fn) => assert(app.includes(`function ${fn}`), `Missing Step 6 function: ${fn}`));

assert(app.includes("Chef Nova provides planning reminders, not a guarantee of food safety."), "Permanent Cook Before It Spoils notice text is missing.");
assert(app.includes("Storage conditions, package instructions, opening date, temperature, and food type can change how long food can be kept."), "Permanent notice details are missing.");
assert(app.includes("role=\"note\""), "Permanent notice should use role=note.");
assert(app.includes("Eligible for Planning") && app.includes("Storage Review Required") && app.includes("Not Eligible for Automatic Planning") && app.includes("Quality Review"), "Cook Before It Spoils should group safety results.");

assert(app.includes("conditionConcernStatus") && app.includes("The absence of visible signs does not confirm food safety. Do not taste food"), "Sensory review wording should prevent safety approval.");
assert(!app.includes("It Smells Fine") && !app.includes("Use Anyway") && !app.includes("Freeze to make safe") && !app.includes("Reheat to reset"), "Unsafe bypass wording should not be introduced.");
assert(app.includes("review.conditionConcernStatus === FOOD_CONDITION_CONCERN_STATUSES.CONCERN_RECORDED"), "Condition concerns should create factual concern events.");
assert(app.includes("FOOD_EVENT_TYPES.STORAGE_CONDITIONS_CONFIRMED"), "Storage review should reuse Food Event History.");
assert(app.includes("FOOD_EVENT_TYPES.FOOD_CONDITION_CONCERN_RECORDED"), "Condition concerns should reuse Food Event History.");
assert(app.includes("This records facts only and does not confirm food safety."), "Safety review events should not record confirmed safe wording.");

assert(app.includes("function getActivePantryItems()") && app.includes("filter(isPantryItemUsableForPlanning).filter((item) => getFoodSafetyGuardrailForPantryItem(item).canUseForAutomaticPlanning)"), "Active Pantry items should be filtered by the shared guardrail.");
assert(app.includes("...getFoodSafetyExcludedIngredientIds()"), "Recipe eligibility context should receive Food-Safety Guardrail exclusions.");
assert(app.includes("foodSafetyGuardrail: {"), "Recipe eligibility context should include guardrail metadata.");
assert(eligibilityModule.includes("FOOD_SAFETY_GUARDRAIL_EXCLUSION"), "Shared recipe eligibility module should define a food-safety exclusion reason.");
assert(eligibilityModule.includes("evaluateFoodSafetyGuardrailContext"), "Shared recipe eligibility module should evaluate food-safety context before soft scoring.");
assert(eligibilityModule.includes("nonOverridable: true"), "Food-safety exclusions should be non-overridable.");

[
  ".food-safety-notice",
  ".food-safety-panel",
  ".storage-review-details",
  ".cook-before-safety-group",
  ".food-safety-status-pill",
  "@media (max-width: 640px)"
].forEach((selector) => assert(css.includes(selector), `Missing Step 6 CSS: ${selector}`));

console.log("Cook Before It Spoils Step 6 Food-Safety Guardrail static checks passed.");
