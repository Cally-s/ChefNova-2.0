const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const docs = fs.readFileSync("docs/cook-before-it-spoils-smart-portion-suggestions.md", "utf8");
const report = fs.readFileSync("docs/cook-before-it-spoils-step-13-report.md", "utf8");

function expect(source, text, message) {
  assert(source.includes(text), message);
}

expect(app, "const SMART_PORTION_SUGGESTION_VERSION = 1;", "Smart Portion suggestion version should exist.");
expect(app, "const SMART_PORTION_SUGGESTION_CONFIG = Object.freeze", "Versioned Smart Portion config should exist.");
expect(app, "const PORTION_LEFTOVER_PREFERENCES = Object.freeze", "Controlled leftover preferences should exist.");
expect(app, "NONE: \"none\"", "No leftovers preference should exist.");
expect(app, "ONE_ADDITIONAL_MEAL: \"one-additional-meal\"", "One additional meal preference should exist.");
expect(app, "TWO_ADDITIONAL_MEALS: \"two-additional-meals\"", "Two additional meals preference should exist.");
expect(app, "CHEF_NOVA_RECOMMEND: \"chef-nova-recommend\"", "Chef Nova recommend preference should exist.");

expect(app, "function getSmartPortionHouseholdContext()", "Household context helper should exist.");
expect(app, "savedAdults", "Household context should include adults.");
expect(app, "savedChildren", "Household context should include children.");
expect(app, "savedHouseholdMemberCount", "Household context should include headcount.");
expect(app, "adults + children", "Adults and children should be counted as headcount.");
assert(!app.includes("children * 0.5"), "Children must not be treated as half servings.");
assert(!app.includes("children / 2"), "Children must not be divided into fractional servings.");

expect(app, "function buildSmartPortionSuggestion", "Shared Smart Portion service should exist.");
expect(app, "function getSupportedRecipeYieldProfile", "Supported yield enumeration should exist.");
expect(app, "profileType: \"continuous\"", "Continuous scaling profile should exist.");
expect(app, "profileType: \"fixed\"", "Fixed yield profile should exist.");
expect(app, "profileType: \"batch\"", "Batch profile should exist.");
expect(app, "function calculateSmartPortionScore", "Smart Portion score function should exist.");
expect(app, "function compareSmartPortionProfiles", "Deterministic Smart Portion sorting should exist.");
expect(app, "recalculateFoodRescueRankingForServings(recipe.id, yieldProfile.supportedYield)", "Profiles should rerun Food Rescue ranking and hard filters.");
expect(app, "findSmartPortionFutureTargets", "Future leftover target validation should exist.");
expect(app, "normalizeMealPlanEntry(getCalendarDayPlan(date)[mealType])", "Future targets should check calendar conflicts.");
expect(app, "createPantryRevisionSignature", "Stale pantry signature should exist.");

expect(app, "function renderSmartPortionSuggestionPanel", "Smart Portion interface should exist.");
expect(app, "People eating tonight", "People Eating label should be visible.");
expect(app, "Would you like leftovers?", "Leftover fieldset legend should be visible.");
expect(app, "Use This Suggestion", "Use This Suggestion action should exist.");
expect(app, "Edit Servings", "Edit Servings action should exist.");
expect(app, "Return to Chef Nova Suggestion", "Return action should exist.");
expect(app, "data-smart-portion-use", "Use action should be wired.");
expect(app, "data-smart-portion-edit", "Edit action should be wired.");
expect(app, "data-smart-portion-return", "Return action should be wired.");

expect(app, "function useSmartPortionSuggestion", "Use This Suggestion handler should exist.");
const useFunction = app.slice(app.indexOf("function useSmartPortionSuggestion"), app.indexOf("function toggleSmartPortionEditor"));
assert(!useFunction.includes("createCookTonightReservations"), "Use This Suggestion must not create reservations.");
assert(!useFunction.includes("commitPantrySnapshotAndFoodEvents"), "Use This Suggestion must not mutate Pantry or Food Event History.");
assert(!useFunction.includes("saveMealPlan()"), "Use This Suggestion must not save the calendar plan.");

expect(app, "renderSmartPortionSuggestionPanel(recipe?.id || draft.recipeId", "Cook This Tonight should render Smart Portion panel.");
expect(app, "leftoverPreference: draft.servingPlan.leftoverPreference", "Cook This Tonight should preserve leftover preference.");
expect(app, "portionSuggestion: suggestion", "Cook This Tonight should carry portion suggestion.");

expect(css, ".smart-portion-panel", "Smart Portion panel styles should exist.");
expect(css, ".smart-portion-leftovers", "Leftover radio styles should exist.");
expect(css, ".smart-portion-editor", "Serving editor styles should exist.");
expect(css, "@media (max-width: 720px)", "Responsive CSS should cover small screens.");
expect(css, "@media (forced-colors: active)", "Forced-color CSS should cover Smart Portion.");
expect(css, "@media print", "Print CSS should include Smart Portion.");

expect(docs, "# Chef Nova Smart Portion Suggestions", "Smart Portion documentation should exist.");
expect(docs, "This is a meal-planning and portion-management feature.", "Docs should state non-nutrition boundary.");
expect(report, "Second household profiles created: 0", "Report should include duplicate household guardrail.");
expect(report, "Children automatically treated as fractional servings: 0", "Report should include child serving guardrail.");
expect(report, "Calorie assumptions introduced: 0", "Report should include calorie guardrail.");
expect(report, "Portion suggestions creating Pantry reservations: 0", "Report should include reservation nonmutation guardrail.");
expect(report, "Portion suggestions creating Food Event History records: 0", "Report should include Food Event nonmutation guardrail.");

console.log("Cook Before It Spoils Step 13 Smart Portion static checks passed.");
