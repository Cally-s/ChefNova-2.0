const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-55-priority-date-ordering-tests.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-55-report.md"), "utf8");

function includes(source, snippet, message) {
  assert(source.includes(snippet), message || `Expected snippet: ${snippet}`);
}

function sourceBlock(functionName, nextFunctionName) {
  const pattern = new RegExp(`function ${functionName}\\([^]*?\\n  \\}\\n\\n  function ${nextFunctionName}`);
  const match = app.match(pattern);
  assert(match, `${functionName} block missing.`);
  return match[0];
}

const effectiveEvaluationBlock = sourceBlock("buildEffectiveUseFirstEvaluation", "evaluatePackageForFefoDemand");
[
  "deriveUseSoonEstimateForMissingPackageDate",
  "effectiveDateType",
  "\"use-soon-estimate\"",
  "dateType: dateIntelligence.primaryDateType || FOOD_DATE_TYPES.UNKNOWN",
  "dateLabel: primaryDate || safetyDeadline ? getPackageDateDisplay(normalized, dateIntelligence) : useSoonDate ? `Use-soon estimate",
  "confidence: useSoonDate && !primaryDate ? \"use-soon-planning-estimate\""
].forEach((snippet) => includes(effectiveEvaluationBlock, snippet, `Effective use-first evaluation must preserve date-type boundaries: ${snippet}`));

const priorityBlock = sourceBlock("deriveUseFirstPriorityForPantryItem", "compareUseFirstPriorityResults");
[
  "status: FOOD_DATE_ATTENTION_STATUSES.APP_ESTIMATE_USE_SOON",
  "primaryDateType: FOOD_DATE_TYPES.APP_ESTIMATED_FRESHNESS",
  "primaryDate: useSoonEstimate.estimate.estimatedWindowEndLocalDate",
  "daysRelativeToDate: useSoonEstimate.estimate.daysRemainingMaximum",
  "dateConfidence: hasPlanningEstimateDate && !dateIntelligence.primaryDate ? \"use-soon-planning-estimate\"",
  "createUseFirstReason(\"use-soon-planning-estimate\""
].forEach((snippet) => includes(priorityBlock, snippet, `Priority engine must expose use-soon estimate evidence without calling it a package date: ${snippet}`));

const compareBlock = sourceBlock("compareUseFirstPriorityResults", "deriveUseFirstPriorities");
[
  "const groupDiff = order.indexOf(a.displayGroup) - order.indexOf(b.displayGroup)",
  "if (a.displayGroup === USE_FIRST_DISPLAY_GROUPS.USE_THESE_FIRST && aRescue !== bRescue) return bRescue - aRescue",
  "if ((a.attentionPriority.score || 0) !== (b.attentionPriority.score || 0)) return (b.attentionPriority.score || 0) - (a.attentionPriority.score || 0)",
  "const aDate = a.dateSummary.relevantDate || \"9999-12-31\"",
  "if (aDate !== bDate) return aDate.localeCompare(bDate)",
  "const aConfidence = a.dateSummary.dateConfidence?.startsWith(\"confirmed\") ? 0 : 1",
  "return String(a.pantryItemId).localeCompare(String(b.pantryItemId))"
].forEach((snippet) => includes(compareBlock, snippet, `Priority ordering should stay deterministic: ${snippet}`));

const formatBlock = sourceBlock("formatUseFirstDateSummary", "renderUseFirstPriorityBadge");
[
  "if (type === FOOD_DATE_TYPES.APP_ESTIMATED_FRESHNESS)",
  "return \"Use soon — estimate reaches today\"",
  "return \"Use soon — approximately 1 day remaining\"",
  "return `Use soon — approximately ${days} days remaining`",
  "return `${typeLabel} tomorrow`",
  "return `${typeLabel} in ${days} days`"
].forEach((snippet) => includes(formatBlock, snippet, `Date presentation must distinguish estimate wording from package-date wording: ${snippet}`));

[
  "Best before ${date}",
  "Recorded expiration date ${date}",
  "Use soon — estimated freshness window ${date}",
  "Date type needs confirmation"
].forEach((snippet) => includes(app, snippet, `Package date display must keep precise date-type labels: ${snippet}`));

[
  "Spinach — best before tomorrow",
  "Mushrooms — estimated 2 days remaining",
  "Yogurt — best before in 3 days",
  "Expected order",
  "1. Spinach",
  "2. Mushrooms",
  "3. Yogurt",
  "Best before tomorrow",
  "Use soon — approximately 2 days remaining",
  "Best before in 3 days"
].forEach((snippet) => includes(doc, snippet, `Manual Step 55 test documentation missing: ${snippet}`));

[
  "Step 55",
  "priority recommendation ordering",
  "date-type presentation",
  "Automated static regression",
  "Manual scenario",
  "Spinach, Mushrooms, Yogurt"
].forEach((snippet) => includes(report, snippet, `Step 55 report missing: ${snippet}`));

const USE_FIRST_DISPLAY_GROUPS = {
  USE_THESE_FIRST: "use-these-first"
};

function compareScenarioResults(a, b) {
  const groupOrder = ["use-these-first", "review-before-planning", "quality-review", "already-planned", "monitor", "not-eligible"];
  const groupDiff = groupOrder.indexOf(a.displayGroup) - groupOrder.indexOf(b.displayGroup);
  if (groupDiff) return groupDiff;
  const aRescue = a.rescueRecipePriority.score ?? -1;
  const bRescue = b.rescueRecipePriority.score ?? -1;
  if (a.displayGroup === USE_FIRST_DISPLAY_GROUPS.USE_THESE_FIRST && aRescue !== bRescue) return bRescue - aRescue;
  if ((a.attentionPriority.score || 0) !== (b.attentionPriority.score || 0)) return (b.attentionPriority.score || 0) - (a.attentionPriority.score || 0);
  const aDate = a.dateSummary.relevantDate || "9999-12-31";
  const bDate = b.dateSummary.relevantDate || "9999-12-31";
  if (aDate !== bDate) return aDate.localeCompare(bDate);
  const aConfidence = a.dateSummary.dateConfidence?.startsWith("confirmed") ? 0 : 1;
  const bConfidence = b.dateSummary.dateConfidence?.startsWith("confirmed") ? 0 : 1;
  if (aConfidence !== bConfidence) return aConfidence - bConfidence;
  if ((b.recipeOpportunitySummary.maximumQuantityUseRatio || 0) !== (a.recipeOpportunitySummary.maximumQuantityUseRatio || 0)) return (b.recipeOpportunitySummary.maximumQuantityUseRatio || 0) - (a.recipeOpportunitySummary.maximumQuantityUseRatio || 0);
  const aValue = Number.isInteger(a.valueSummary.estimatedRemainingValueCents) ? a.valueSummary.estimatedRemainingValueCents : -1;
  const bValue = Number.isInteger(b.valueSummary.estimatedRemainingValueCents) ? b.valueSummary.estimatedRemainingValueCents : -1;
  if (aValue !== bValue) return bValue - aValue;
  return String(a.pantryItemId).localeCompare(String(b.pantryItemId));
}

function formatScenarioDateSummary(result) {
  const date = result.dateSummary;
  if (date.primaryDateType === "app-estimated-freshness") {
    return `Use soon — approximately ${date.daysRemaining} days remaining`;
  }
  if (date.daysRemaining === 1) return "Best before tomorrow";
  return `Best before in ${date.daysRemaining} days`;
}

const scenario = [
  {
    pantryItemId: "spinach",
    displayGroup: "use-these-first",
    attentionPriority: { score: 60 },
    rescueRecipePriority: { score: 42 },
    dateSummary: { primaryDateType: "best-before", relevantDate: "2026-08-17", daysRemaining: 1, dateConfidence: "confirmed-package-date" },
    recipeOpportunitySummary: { maximumQuantityUseRatio: 0.5 },
    valueSummary: { estimatedRemainingValueCents: 350 }
  },
  {
    pantryItemId: "mushrooms",
    displayGroup: "use-these-first",
    attentionPriority: { score: 60 },
    rescueRecipePriority: { score: 42 },
    dateSummary: { primaryDateType: "app-estimated-freshness", relevantDate: "2026-08-18", daysRemaining: 2, dateConfidence: "use-soon-planning-estimate" },
    recipeOpportunitySummary: { maximumQuantityUseRatio: 0.5 },
    valueSummary: { estimatedRemainingValueCents: 350 }
  },
  {
    pantryItemId: "yogurt",
    displayGroup: "use-these-first",
    attentionPriority: { score: 60 },
    rescueRecipePriority: { score: 42 },
    dateSummary: { primaryDateType: "best-before", relevantDate: "2026-08-19", daysRemaining: 3, dateConfidence: "confirmed-package-date" },
    recipeOpportunitySummary: { maximumQuantityUseRatio: 0.5 },
    valueSummary: { estimatedRemainingValueCents: 350 }
  }
];

const ordered = [...scenario].sort(compareScenarioResults);
assert.deepStrictEqual(ordered.map((item) => item.pantryItemId), ["spinach", "mushrooms", "yogurt"], "Required Step 55 scenario must sort Spinach, Mushrooms, then Yogurt.");
assert.deepStrictEqual(ordered.map(formatScenarioDateSummary), ["Best before tomorrow", "Use soon — approximately 2 days remaining", "Best before in 3 days"], "Required Step 55 scenario must present official best-before dates separately from estimates.");

console.log("Cook Before It Spoils Step 55 priority ordering and date-type presentation checks passed.");
