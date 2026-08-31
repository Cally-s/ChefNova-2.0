const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const docs = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-emergency-plan-integration.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-40-report.md"), "utf8");

function bodyOf(name) {
  const marker = `function ${name}`;
  const start = app.indexOf(marker);
  assert(start >= 0, `${name} is missing`);
  const signatureEnd = app.indexOf(") {", start);
  const braceStart = signatureEnd >= 0 ? app.indexOf("{", signatureEnd) : app.indexOf("{", start);
  let depth = 0;
  for (let index = braceStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`${name} body was not closed`);
}

[
  "EMERGENCY_INTERPRETATION_SCHEMA_VERSION",
  "EMERGENCY_PLANNING_CONTEXT_VERSION",
  "EMERGENCY_INVENTORY_CANDIDATE_VERSION",
  "EMERGENCY_CANDIDATE_EVALUATION_VERSION",
  "EMERGENCY_SCORE_CONFIGURATION_VERSION",
  "EMERGENCY_PLAN_METADATA_VERSION",
  "EMERGENCY_PLAN_SCORE_CONFIG"
].forEach((token) => assert(app.includes(token), `${token} is missing`));

[
  "COMPLETE_WITHIN_BUDGET",
  "COMPLETE_ESTIMATE_INCOMPLETE",
  "SAFE_PARTIAL_PLAN",
  "ABOVE_BUDGET",
  "SAFETY_REVIEW_REQUIRED",
  "PRICE_REVIEW_REQUIRED",
  "QUANTITY_REVIEW_REQUIRED",
  "NO_SAFE_PLAN",
  "STALE",
  "ERROR"
].forEach((status) => assert(app.includes(status), `${status} status is missing`));

const dateParse = bodyOf("parseEmergencyDatePhrase");
assert(dateParse.includes("Numeric slash dates are ambiguous"), "ambiguous numeric dates must require review");
const parse = bodyOf("parseEmergencyPlanRequest");
assert(parse.includes("The end date is inclusive"), "inclusive end-date assumption must be recorded");
assert(parse.includes("availableBudgetCents: budgetCents"), "parser must produce structured budget data");
assert(parse.includes("referenceLocalDate") && parse.includes("timezone"), "parser must use local date and timezone fields");

const interpretation = bodyOf("createEmergencyInterpretationModel");
assert(interpretation.includes("emergencyInterpretationSchemaVersion"), "structured interpretation model is missing");
assert(interpretation.includes("sourceText"), "interpretation must preserve source text");
assert(interpretation.includes("requestedMealCount"), "interpretation must include requested meal count");
assert(interpretation.includes("includeLeftovers") && interpretation.includes("includeFrozenFood"), "interpretation must include source preferences");

const context = bodyOf("buildEmergencyPlanningContext");
[
  "pantrySnapshot",
  "leftoverSnapshot",
  "freezerSnapshot",
  "reservationSnapshot",
  "prioritySnapshot",
  "hardRequirements",
  "sourceRevisions"
].forEach((token) => assert(context.includes(token), `Emergency context must include ${token}`));

const inventory = bodyOf("createEmergencyInventoryCandidate");
assert(inventory.includes("getFoodSafetyGuardrailForPantryItem"), "inventory candidates must use Food-Safety Guardrails");
assert(bodyOf("getEmergencyDateInformationForItem").includes("deriveFoodDateIntelligence"), "inventory candidates must preserve Date Intelligence");
assert(inventory.includes("getPantryReservationAvailability"), "inventory candidates must respect reservations");
assert(inventory.includes("Chef Nova did not use this item because its current safety or storage information could not be verified."), "questionable-food wording is missing");
assert(inventory.includes("quantityUnknown ? null"), "unknown quantities must stay null, not zero");

const setBuilder = bodyOf("buildEmergencyEligibleInventorySet");
assert(setBuilder.includes("EMERGENCY_INVENTORY_CANDIDATE_STATUSES.ELIGIBLE"), "eligible inventory must be separated");
assert(setBuilder.includes("reviewRequired"), "review-required inventory must be separated");
assert(setBuilder.includes("userExcluded"), "user-excluded inventory must be separated");

const candidateEval = bodyOf("createEmergencyCandidateEvaluation");
assert(candidateEval.includes("if (!eligible)"), "hard-excluded candidate guard is missing");
assert(candidateEval.includes("selectable: false"), "hard-excluded candidates must be unselectable");
assert(candidateEval.includes("rescueEvaluation: null"), "hard-excluded candidates must not receive rescue scoring");
assert(candidateEval.includes("budgetEvaluation: null"), "hard-excluded candidates must not receive budget scoring");
assert(candidateEval.includes("finalScore: null"), "hard-excluded candidates must not receive final score");

const budgetCandidate = bodyOf("evaluateBudgetCandidateForSlot");
assert(budgetCandidate.indexOf("evaluateRecipeForCurrentRequirements") < budgetCandidate.indexOf("calculateRecipeCostForDisplay"), "hard filters must run before cost scoring");
assert(budgetCandidate.includes("createEmergencyCandidateEvaluation"), "Emergency candidates must attach Step 40 evaluation metadata");

const generateEmergency = bodyOf("generateEmergencyMealPlan");
assert(generateEmergency.includes("buildEmergencyPlanningContext"), "Emergency generation must build shared context");
assert(generateEmergency.includes("buildEmergencyEligibleInventorySet"), "Emergency generation must build safe inventory before planning");
assert(generateEmergency.includes("generateBudgetRescueMealPlan"), "Emergency Plan must reuse Budget Rescue planner");
assert(generateEmergency.includes("createEmergencyPlanMetadata"), "Emergency Plan metadata must be preserved");

const render = bodyOf("renderEmergencyPlanningResultSummary");
assert(render.includes("renderEmergencySafeFoodAvailable"), "Emergency result must show safe-food summary");
const safeFood = bodyOf("renderEmergencySafeFoodAvailable");
assert(safeFood.includes("Safe Food Available for the Emergency Plan"), "safe-food heading is missing");
assert(safeFood.includes("Food is not marked used until the actual meal outcome is confirmed"), "planned-versus-confirmed wording is missing");

[
  "emergencyRescuePlanner",
  "emergencyPantry",
  "emergencyRecipeDatabase",
  "emergencyShoppingList",
  "emergencyFoodInventory",
  "emergencyPriorityEngine",
  "emergencyCostEngine",
  "safeBudgetPlannerCopy"
].forEach((forbidden) => assert(!app.includes(forbidden), `${forbidden} must not be introduced`));

assert(!generateEmergency.includes("createImpactLedgerPosting"), "Emergency generation must not create impact credit");
assert(!generateEmergency.includes("MARKED_THAWED"), "Emergency generation must not mark frozen food thawed");
assert(!generateEmergency.includes("QUANTITY_USED"), "Emergency generation must not deduct Pantry");

assert(css.includes(".emergency-safe-food-summary"), "Emergency safe-food CSS is missing");
assert(docs.includes("# Chef Nova Emergency Plan and Cook Before It Spoils Integration"), "Step 40 documentation is missing");
assert(docs.includes("Safety Precedence"), "Safety precedence documentation is missing");
assert(report.includes("Step 40 Implementation Report"), "Step 40 report is missing");
assert(report.includes("Second Emergency Planners created: 0"), "Required zero-result line is missing");
assert(report.includes("Recommended Starting Point for Step 41"), "Step 41 recommendation is missing");

console.log("Step 40 Emergency Plan integration static checks passed.");
