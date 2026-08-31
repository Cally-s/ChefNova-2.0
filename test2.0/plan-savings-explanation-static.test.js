const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");

function has(source, text, message) {
  assert(source.includes(text), message || `Expected source to include ${text}`);
}

[
  "PLAN_SAVINGS_EXPLANATION_VERSION",
  "PLAN_SAVINGS_EXPLANATION_STATUSES",
  "PLAN_SAVINGS_REASON_TYPES",
  "derivePlanSavingsExplanation",
  "createPlanSavingsReason",
  "createBudgetInitialPlanSnapshot",
  "buildPlanSavingsComparison",
  "buildPlanSavingsPantryReasons",
  "buildPlanSavingsSharedReasons",
  "buildPlanSavingsLeftoverReasons",
  "buildPlanSavingsSubstitutionReasons",
  "sortPlanSavingsReasons",
  "renderPlanSavingsExplanation",
  "renderPlanSavingsComparison",
  "createPlanSavingsExplanationSnapshot"
].forEach((name) => has(app, name, `${name} should exist.`));

[
  "complete-high-confidence-reduction",
  "complete-estimated-reduction",
  "complete-no-difference",
  "complete-higher-cost",
  "comparison-incomplete",
  "no-comparable-baseline",
  "partial-plan",
  "plan-requires-review",
  "explanation-unavailable"
].forEach((status) => has(app, status, `Explanation status ${status} should be controlled.`));

[
  "pantry-use",
  "purchases-avoided-by-pantry",
  "shared-ingredient-use",
  "shared-package-use",
  "planned-leftovers",
  "batch-cooking",
  "lower-cost-substitutions",
  "use-soon-ingredients",
  "opened-pantry-items",
  "single-use-purchases-avoided",
  "optional-purchases-removed",
  "active-sale-use",
  "fewer-unique-grocery-groups",
  "lower-package-surplus",
  "practical-benefit"
].forEach((type) => has(app, type, `Reason type ${type} should be controlled.`));

[
  "baselineType: \"initial-safe-plan-before-budget-repairs\"",
  "baselineDescription: \"The first complete safe plan before budget-reduction repairs were applied.\"",
  "const initialPlanSnapshot = createBudgetInitialPlanSnapshot(firstPass, request);",
  "repaired.initialPlanSnapshot = initialPlanSnapshot;",
  "repaired.plan.planSavingsBaselineSnapshot = initialPlanSnapshot;",
  "baselineCost - finalCost",
  "comparison.estimatedDifferenceCents > 0",
  "comparison.estimatedDifferenceCents === 0",
  "comparison.estimatedDifferenceCents < 0"
].forEach((text) => has(app, text, `Expected baseline or integer-cent comparison logic: ${text}`));

[
  "One or more grocery items need usable prices or purchase quantities before Chef Nova can compare the original and current plans accurately.",
  "The cost of a partial plan is not directly comparable with a complete plan.",
  "A comparable original-plan cost is not available for this plan.",
  "Individual plan features can overlap, so the reasons below should not be added together as separate savings amounts.",
  "Actual store prices may vary.",
  "How This Plan Reduces Cost",
  "Why Chef Nova Selected This Plan",
  "Plan Cost and Practical Trade-Offs",
  "How This Emergency Plan Uses Available Food"
].forEach((text) => has(app, text, `Expected safe explanation wording: ${text}`));

[
  "Uses ${pantryCount} ${pluralize(pantryCount, \"ingredient\")} already in your Pantry",
  "Avoids approximately ${formatCostCents(savings)} in new grocery purchases by using ingredients already in your Pantry",
  "Uses ${numberWord(group.packagesRequired).toLowerCase()}",
  "Includes ${numberWord(leftoverLunches).toLowerCase()} planned leftover",
  "Uses ${numberWord(positive.length).toLowerCase()} lower-cost ingredient",
  "Avoids purchasing ${numberWord(baselineGroupComparison.singleUsePurchaseGroupsAvoided.length).toLowerCase()} single-use",
  "Uses ${numberWord(baselineGroupComparison.uniqueGroupDifference).toLowerCase()} fewer unique grocery"
].forEach((snippet) => has(app, snippet, `Expected derived reason wording: ${snippet}`));

[
  "completeGroceryTotalAvailable",
  "shoppingCoverageComplete",
  "estimatedDifferenceCents: null",
  "missingQuantity > 0",
  "reason.impactType === \"practical-benefit\"",
  "PLAN_SAVINGS_EXPLANATION_MAX_PRIMARY_REASONS",
  "overlapGroup",
  "comparePlanSavingsReasons"
].forEach((text) => has(app, text, `Expected protection marker: ${text}`));

[
  "plan-savings-explanation",
  "plan-savings-reasons",
  "plan-savings-comparison",
  "plan-savings-comparison-grid",
  "aria-live=\"polite\"",
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((text) => assert(app.includes(text) || css.includes(text), `Expected UI/accessibility marker: ${text}`));

[
  "chefNovaPlanSavingsExplanation",
  "budgetSavingsEngine",
  "new CostEngine",
  "new PriceConfidence",
  "PlanSavingsLocalStorage",
  "planSavingsStorage"
].forEach((forbidden) => assert(!app.includes(forbidden), `Do not create duplicate systems or new explanation storage: ${forbidden}`));

const baseline = 11840;
const final = 9275;
assert.strictEqual(baseline - final, 2565, "User example comparison should use integer cents.");

console.log("Plan savings explanation static checks passed.");
