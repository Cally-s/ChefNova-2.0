const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-budget-rescue-integration.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-37-report.md"), "utf8");

function bodyOf(functionName) {
  const start = app.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} must exist`);
  const next = app.indexOf("\n  function ", start + 12);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "INTEGRATED_PLANNING_CONTEXT_VERSION",
  "INTEGRATED_CANDIDATE_EVALUATION_VERSION",
  "INTEGRATED_HARD_ELIGIBILITY_VERSION",
  "INTEGRATED_RESCUE_EVALUATION_VERSION",
  "INTEGRATED_BUDGET_EVALUATION_VERSION",
  "INTEGRATED_PRACTICALITY_EVALUATION_VERSION",
  "INTEGRATED_SCORE_CONFIGURATION_VERSION",
  "RECIPE_BENEFIT_SUMMARY_VERSION",
  "INTEGRATED_PLANNING_METADATA_VERSION",
  "PRIORITY_USE_CREDIT_POLICY",
  "INTEGRATED_HARD_EXCLUSION_CODES",
  "INTEGRATED_BUDGET_RESCUE_SCORE_CONFIG"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} must be defined`));

[
  "createIntegratedPlanningContext",
  "buildTemporaryPlanningInventory",
  "evaluateIntegratedHardEligibility",
  "evaluateIntegratedPantryAllocation",
  "evaluateIntegratedRescueBenefit",
  "evaluateIntegratedBudgetBenefit",
  "evaluateIntegratedPracticality",
  "evaluateIntegratedRecipeCandidate",
  "buildRecipeBenefitSummary",
  "renderIntegratedRecipeBenefitSummary",
  "buildIntegratedPlanSummaries",
  "renderIntegratedPlanningSummary",
  "createIntegratedPlanMetadataSnapshot"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} must be implemented`));

const candidate = bodyOf("evaluateIntegratedRecipeCandidate");
assert(candidate.indexOf("evaluateIntegratedHardEligibility") < candidate.indexOf("evaluateIntegratedPantryAllocation"), "Hard eligibility must run before pantry allocation.");
assert(candidate.indexOf("evaluateIntegratedHardEligibility") < candidate.indexOf("evaluateIntegratedRescueBenefit"), "Hard eligibility must run before rescue scoring.");
assert(candidate.indexOf("evaluateIntegratedHardEligibility") < candidate.indexOf("evaluateIntegratedBudgetBenefit"), "Hard eligibility must run before budget scoring.");
assert(candidate.includes("finalScore: null"), "Hard-excluded candidates must have null finalScore.");
assert(candidate.includes("selectable: false"), "Hard-excluded candidates must not be selectable.");

const hard = bodyOf("evaluateIntegratedHardEligibility");
assert(hard.includes("evaluateRecipeForCurrentRequirements"), "Integration must reuse the central hard-filter engine.");
assert(hard.includes("includeIngredientAvailability: true"), "Physical inventory must be part of eligibility.");
assert(hard.includes("requireStructuredQuantities: true"), "Structured quantities must be required.");

const rescue = bodyOf("evaluateIntegratedRescueBenefit");
assert(rescue.includes("plannedOnly: true"), "Rescue benefit must be planned-only before confirmation.");
assert(rescue.includes("impactCreditOnSave: false"), "Saving a plan must not create impact credit.");
assert(rescue.includes("temporaryAllocationOnly: true"), "Rescue allocation must be preview-only.");

const budget = bodyOf("evaluateIntegratedBudgetBenefit");
assert(budget.includes("pantryValueIsNotCheckoutCost: true"), "Pantry value must be distinct from checkout cost.");
assert(budget.includes("sharedPackagesCountedOnceWeekly: true"), "Shared package weekly counting must be explicit.");
assert(budget.includes("missingPantryPriceCount"), "Missing pantry prices must be tracked, not treated as zero.");
assert(budget.includes("knownNewPurchaseSubtotalCents"), "Incomplete purchase prices must keep known subtotal distinct from free.");

const card = bodyOf("renderIntegratedRecipeBenefitSummary");
[
  "Planned food-rescue benefit",
  "Budget benefit",
  "Practical benefit",
  "planned to use",
  "Weekly checkout totals use full package prices and count shared packages once"
].forEach((phrase) => assert(card.includes(phrase), `Recipe benefit card must include ${phrase}`));
assert(!card.includes("Food rescued"), "Pre-cooking card must not claim food rescued.");

const summary = bodyOf("renderIntegratedPlanningSummary");
assert(summary.includes("Preview only"), "Plan-level summary must state preview-only behavior.");
assert(summary.includes("Impact Ledger stay unchanged"), "Plan-level summary must protect the Impact Ledger.");
assert(summary.includes("Planned food-rescue benefit does not create impact credit"), "Plan summary must avoid confirmed impact claims.");

const sync = bodyOf("syncPlanningModeMetadataToPlan");
assert(sync.includes("createIntegratedPlanMetadataSnapshot"), "Saved plans must carry integrated metadata beside existing metadata.");
assert(sync.includes("integratedPlanningMetadata"), "Integrated metadata must be attached to the existing plan object.");
assert(app.includes("weeklyPlan.integratedPlanningMetadata"), "Meal-plan normalization must preserve integrated metadata.");

[
  "budgetRescuePantry",
  "foodRescueBudgetPlanner",
  "budgetSpoilagePlanner",
  "combinedMealPlanner",
  "rescueShoppingList",
  "budgetRescueRecipeDatabase",
  "secondCandidateEngine"
].forEach((forbidden) => assert(!app.includes(forbidden), `${forbidden} must not be introduced`));

[
  "createIntegratedPlanningContext",
  "buildTemporaryPlanningInventory",
  "evaluateIntegratedRecipeCandidate",
  "buildIntegratedPlanSummaries",
  "syncPlanningModeMetadataToPlan"
].forEach((functionName) => {
  const source = bodyOf(functionName);
  assert(!source.includes("createImpactLedgerPosting"), `${functionName} must not post impact ledger entries`);
  assert(!source.includes("createFoodRescueLedgerCredit"), `${functionName} must not create food rescue credits`);
});

[
  ".integrated-planning-summary",
  ".integrated-benefit-card",
  ".planned-rescue-benefit",
  ".budget-benefit",
  ".practical-plan-benefit"
].forEach((selector) => assert(css.includes(selector), `${selector} styling must exist`));

[
  "# Cook Before It Spoils + Budget Rescue Integration",
  "Hard Filter Precedence",
  "Shared Candidate Evaluation",
  "Temporary Pantry Allocation",
  "Cost Semantics",
  "Recipe Card Display",
  "Plan-Level Summary",
  "Saved Metadata",
  "No Duplicate Systems",
  "Impact Credit Boundary"
].forEach((phrase) => assert(doc.includes(phrase), `Integration doc must include ${phrase}`));

[
  "Separate hybrid planners created: 0",
  "Second Pantry created: 0",
  "Second Recipe Database created: 0",
  "Second Shopping List created: 0",
  "Second Price Catalogue created: 0",
  "Second Cost Engine created: 0",
  "Second rescue-priority engine created: 0",
  "Second hard-filter pipeline created: 0",
  "Budget before safety: 0",
  "Rescue before safety: 0",
  "Hard-excluded restored by low cost/rescue priority: 0",
  "Allergy/diet relaxed: 0",
  "Food scheduled after eligible date: 0",
  "Best-before as expiration: 0",
  "Lots merged incorrectly: 0",
  "Reserved allocated silently: 0",
  "Physical qty allocated twice: 0",
  "Pantry ingredient-use value as checkout cost: 0",
  "Full package as partial pantry value: 0",
  "Unpriced pantry as $0: 0",
  "Unpriced purchase as free: 0",
  "Shared packages charged more than once: 0",
  "Card allocated costs > weekly total: 0",
  "Planned leftovers charged as full recipes twice: 0",
  "Planned priority use represented as confirmed rescue: 0",
  "Saved plans create impact credits: 0",
  "Saved plans deduct pantry automatically: 0",
  "Cross-user data exposed: 0",
  "Guest data persisted automatically: 0"
].forEach((phrase) => assert(report.includes(phrase), `Step 37 report must include ${phrase}`));

console.log("Cook Before It Spoils Step 37 Budget Rescue integration static checks passed.");
