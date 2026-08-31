const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const architectureDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-actionable-pattern-insights.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-31-report.md"), "utf8");

function bodyOf(functionName) {
  const start = app.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} must exist`);
  const next = app.indexOf("\n  function ", start + 12);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "ACTIONABLE_INSIGHT_STATUSES",
  "INSIGHT_ACTION_ELIGIBILITY",
  "INSIGHT_ACTION_TYPES",
  "INSIGHT_ACTION_STATES",
  "INSIGHT_METRIC_COVERAGE_STATUSES",
  "ACTIONABLE_INSIGHT_RULE_CONFIG"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} must be defined`));

[
  "ACTIVE",
  "LIMITED_DATA",
  "NO_ELIGIBLE_ACTIONS",
  "DISMISSED",
  "WITHDRAWN",
  "EXPIRED",
  "NEEDS_RECALCULATION"
].forEach((status) => assert(app.includes(status), `Insight status ${status} must exist`));

[
  "PREFER_SMALLER_PURCHASE_QUANTITY",
  "REVIEW_PURCHASE_QUANTITY",
  "SET_EARLIER_ITEM_REMINDER",
  "CREATE_FREEZE_PORTION_ROUTINE",
  "SHOW_RESCUE_RECIPES",
  "CHANGE_RECIPE_SERVING_DEFAULT",
  "REVIEW_SERVING_SIZE",
  "CREATE_PLANNED_LEFTOVER_ROUTINE",
  "SCHEDULE_LEFTOVER_EARLIER",
  "SHOW_SECOND_USE_RECIPES",
  "REQUIRE_TWO_PLANNED_USES",
  "CREATE_FREEZER_MEAL_ROUTINE",
  "SET_EARLIER_QUALITY_REMINDER",
  "ENABLE_DUPLICATE_PANTRY_CHECK",
  "REQUIRE_DATE_TYPE_CONFIRMATION",
  "SHOW_DATE_TYPE_EXPLANATION",
  "REVIEW_RELATED_RECORDS",
  "KEEP_CURRENT_SETTING"
].forEach((type) => assert(app.includes(type), `Action type ${type} must exist`));

[
  "buildActionableInsight",
  "buildActionableInsightsForPatterns",
  "buildPatternInsightSummary",
  "buildInsightWeightCoverage",
  "buildInsightValueCoverage",
  "buildInsightActionCandidates",
  "openInsightActionPreview",
  "applyInsightAction",
  "undoInsightAction",
  "keepCurrentInsightAction",
  "dismissInsightAction",
  "showInsightRescueRecipes"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} must be implemented`));

assert(app.includes("buildActionableInsightsForPatterns(patterns = checkWastePatterns().results)"), "Insights must extend Step 30 pattern results");
assert(!app.includes("function detectActionablePatterns"), "Step 31 must not create a second pattern engine");
assert(app.includes("patternRevision") && app.includes("sourceEventRevision") && app.includes("actionRuleVersion") && app.includes("userSettingRevision"), "Insights must carry source revisions");
assert(app.includes("PATTERN_SUMMARY_MODEL_VERSION") && app.includes("INSIGHT_METRIC_COVERAGE_MODEL_VERSION") && app.includes("ACTION_PREVIEW_MODEL_VERSION"), "Versioned insight models must exist");

const previewBody = bodyOf("openInsightActionPreview");
assert(previewBody.includes("Nothing changes until you confirm"), "Preview must explain that no change happens before confirmation");
assert(previewBody.includes("data-insight-action-confirm"), "Preview must require explicit confirmation");
assert(!/appendFoodEventsToHistory|commitPantrySnapshotAndFoodEvents|executePantryCommand/.test(previewBody), "Preview must not create Food Event History or Pantry changes");

const applyBody = bodyOf("applyInsightAction");
assert(applyBody.includes("currentSourceRevision") && applyBody.includes("STALE"), "Persistent actions must revalidate current data before saving");
assert(applyBody.includes("saveActionableInsightSettings") && applyBody.includes("saveActionableInsightAudit"), "Persistent actions must save settings and audit entries");
assert(!/appendFoodEventsToHistory|commitPantrySnapshotAndFoodEvents|executePantryCommand|saveMealPlan|saveShoppingListItems/.test(applyBody), "Applying insight settings must not create food, Pantry, meal-plan, or Shopping List changes");

const recipeBody = bodyOf("showInsightRescueRecipes");
assert(recipeBody.includes("isRecipeSafeForUser") || app.includes("findSafeRecipesForInsight"), "Recipe actions must reuse allergy safety checks");
assert(!/addMeal|saveMealPlan|calendar/.test(recipeBody), "Recipe actions must not add meals to the calendar");

assert(app.includes("getHistoricalDiscardWeightSnapshot") && app.includes("entry?.record?.weightEstimate"), "Weight summaries must use historical Step 29 snapshots");
assert(app.includes("getDiscardEntryCostEstimate(entry)") && app.includes("currencyGroups"), "Value summaries must use stored Step 28 snapshots and separate currencies");
assert(app.includes("MIXED_CURRENCY"), "Mixed currencies must be represented");
assert(app.includes("unknownWeightIncidentCount") && app.includes("unknownValueIncidentCount"), "Unknown metric coverage must stay visible");

assert(app.includes("GUEST_KEYS.actionableInsightActionStates") && app.includes("sessionStorage"), "Guest insight state must be session-scoped");
assert(app.includes("ActionableInsightSettings") && app.includes("ActionableInsightAudit"), "Registered insight settings and audit must be account-scoped");
assert(app.includes("data-insight-action-preview") && app.includes("data-insight-action-confirm") && app.includes("data-insight-action-undo"), "UI event hooks must exist");

assert(css.includes(".actionable-insight-card"), "Insight card styles must exist");
assert(css.includes(".insight-action-card"), "Action card styles must exist");
assert(css.includes(".action-preview-modal"), "Preview modal styles must exist");

assert(architectureDoc.includes("No second pattern engine was added."), "Architecture doc must document no duplicate engine");
assert(architectureDoc.includes("Viewing an insight does not change"), "Architecture doc must document no automatic changes");
assert(report.includes("Persistent changes require preview and confirmation."), "Report must document preview-confirm flow");
assert(report.includes("Food Event History is not appended"), "Report must document Food Event History boundary");

console.log("Step 31 actionable pattern insights static checks passed.");
