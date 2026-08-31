const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-handle-unsafe-or-ineligible-items.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-54-report.md"), "utf8");

function includesAll(source, values, label) {
  values.forEach((value) => assert(source.includes(value), `${label} should include ${value}`));
}

includesAll(app, [
  "RECOMMENDATION_ELIGIBILITY_DECISION_VERSION",
  "RECOMMENDATION_ELIGIBILITY_POLICY_VERSION",
  "RECOMMENDATION_ELIGIBILITY_STATUSES",
  "ELIGIBILITY_REASON_SEVERITIES",
  "ELIGIBILITY_REASON_CATEGORIES",
  "ELIGIBILITY_REASON_CODES",
  "ELIGIBILITY_DECISION_SCOPES",
  "FOOD_USE_ACTION_IDS",
  "RESERVATION_ELIGIBILITY_STATUSES"
], "Step 54 controlled values");

includesAll(app, [
  "HARD_EXCLUDED_FOOD_SAFETY: \"hard-excluded-food-safety\"",
  "HARD_EXCLUDED_ALLERGY: \"hard-excluded-allergy\"",
  "HARD_EXCLUDED_DIETARY: \"hard-excluded-dietary\"",
  "REVIEW_REQUIRED: \"review-required\"",
  "ACTION_SPECIFICALLY_INELIGIBLE: \"action-specifically-ineligible\"",
  "PLANNING_INCOMPATIBLE: \"planning-incompatible\"",
  "RECORDED_EXPIRATION_DATE_PASSED: \"recorded-expiration-date-passed\"",
  "STORAGE_DURATION_UNCERTAIN: \"storage-duration-uncertain\"",
  "SAVED_ALLERGEN_MATCH: \"saved-allergen-match\"",
  "REQUIRED_DIETARY_CONFLICT: \"required-dietary-conflict\"",
  "ADDITIONAL_REHEAT_NOT_PERMITTED: \"additional-reheat-not-permitted\""
], "Eligibility registries");

includesAll(app, [
  "function createRecommendationEligibilityDecision",
  "function collectEligibilityReasonsForSource",
  "function createEligibilityCapability",
  "function renderRecommendationEligibilityReasons",
  "function validateFoodUseActionAllowed",
  "function rejectEligibilityBypassParameters",
  "function createEligibilityCommandRejection",
  "function applyEligibilityDecisionToCandidate",
  "function createEligibilityExternalNotification",
  "function exportRecommendationEligibilityDecision"
], "Shared eligibility functions");

includesAll(app, [
  "candidate.selectable = false",
  "candidate.recipeScore = null",
  "candidate.rescueScore = null",
  "candidate.budgetScore = null",
  "candidate.fefoRank = null",
  "candidate.pantriesCoverageEligible = false",
  "candidate.overrideAllowed = false"
], "Hard-exclusion candidate invariant");

includesAll(app, [
  "Its recorded reheating history does not permit another reheat under the current reviewed policy.",
  "The recorded expiration date has passed.",
  "Its storage history is uncertain. Chef Nova cannot confirm that it is currently suitable for a food-use recommendation.",
  "This ingredient conflicts with a saved",
  "This item does not match the current required dietary restriction. Chef Nova did not remove or weaken the restriction.",
  "The best-before date has passed. This is quality guidance, not a recorded true-expiration exclusion."
], "Required user-facing wording");

includesAll(app, [
  "validateFoodUseActionAllowed({",
  "actionId: FOOD_USE_ACTION_IDS.RESERVE_FOR_MEAL",
  "status: \"reservation-eligibility-blocked\"",
  "reservationEligibilityStatus",
  "actionId: FOOD_USE_ACTION_IDS.USE_IN_HEATED_RECIPE",
  "THIS MEAL CANNOT START WITH THE CURRENT INGREDIENTS",
  "actionId: FOOD_USE_ACTION_IDS.FREEZE",
  "FREEZING NOT AVAILABLE"
], "Command-layer and direct-route enforcement");

includesAll(app, [
  "ignoreSafety",
  "overrideAllergy",
  "forceInclude",
  "useAnyway",
  "skipEligibilityCheck",
  "overrideAllowed",
  "eligibility-command-rejection",
  "No Pantry quantity, reservation, or meal plan was changed."
], "Bypass rejection");

includesAll(app, [
  "recommendationEligibility",
  "canUseForAutomaticPlanning: eligibilityDecisionAllowsAction(recommendationEligibility, FOOD_USE_ACTION_IDS.COUNT_AS_PANTRY_COVERAGE)",
  "hardExclusion: recommendationEligibility.hardExcluded",
  "reviewRequired: recommendationEligibility.reviewRequired"
], "Pantry coverage exclusion metadata");

includesAll(app, [
  "privacySafe: true",
  "Chef Nova found a meal-eligibility issue.",
  "Open the app to review a safe alternative.",
  "overrideAllowed: false",
  "policyVersions"
], "Notification privacy and export");

const liveFiles = `${app}\n${css}\n${html}`;
[
  "Use Anyway",
  "Proceed Anyway",
  "Override Allergy",
  "Ignore Restriction",
  "Force into Plan",
  "Freeze Anyway",
  "Reheat Anyway",
  "I Accept the Risk",
  "Start Anyway"
].forEach((label) => assert(!liveFiles.includes(label), `Live UI must not contain bypass label: ${label}`));

includesAll(css, [
  "/* Cook Before It Spoils - Unsafe or Ineligible Items */",
  ".eligibility-decision-card",
  ".eligibility-reason-list",
  ".eligibility-action-row",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
], "Step 54 CSS");

for (let i = 1; i <= 55; i += 1) {
  assert(doc.includes(`## ${i}. `), `Step 54 documentation should include section ${i}.`);
}

includesAll(doc, [
  "# Chef Nova Unsafe and Ineligible Item Handling",
  "Hard exclusions cannot be bypassed",
  "Best-before dates are quality guidance, not true expiration dates.",
  "Previously reheated food is not globally excluded solely because it was reheated once.",
  "Cancelled meal reservation release does not restore eligibility.",
  "`overrideAllowed: false`"
], "Step 54 documentation");

includesAll(report, [
  "# Cook Before It Spoils Step 54 Report",
  "Second Food-Safety Guardrail systems created: 0",
  "Hard food-safety exclusions with a Use Anyway action: 0",
  "Allergy exclusions with an Override Allergy action: 0",
  "True-expired items offered for freezing: 0",
  "Storage-review items treated as eligible Pantry coverage: 0",
  "Previously reheated items excluded universally without action-specific policy evaluation: 0",
  "Reservations created for hard-excluded food: 0",
  "Exclusions creating Food Event History physical outcomes: 0",
  "AI-generated eligibility or safety decisions: 0",
  "Guest eligibility data persisted into registered-user storage automatically: 0"
], "Step 54 report");

console.log("Cook Before It Spoils Step 54 unsafe/ineligible item static checks passed.");
