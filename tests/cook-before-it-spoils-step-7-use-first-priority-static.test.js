const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const html = fs.readFileSync("index.html", "utf8");

function expect(source, snippet, message) {
  assert(source.includes(snippet), message || `Expected snippet: ${snippet}`);
}

expect(app, "USE_FIRST_PRIORITY_ENGINE_VERSION = 1", "Use-First Priority Engine should be versioned.");
expect(app, "USE_FIRST_SCORE_CONFIGURATION_VERSION = 1", "Use-First score configuration should be versioned.");
expect(app, "USE_FIRST_SCORE_CONFIGURATION = Object.freeze", "Score weights should be centralized.");
expect(app, "maximumScores: { urgency: 40", "Urgency cap should be centralized.");
expect(app, "maximumPenalties: { alreadyPlanned: 22, alreadyFrozen: 18 }", "Penalty caps should be centralized.");
expect(app, "USE_FIRST_SCORING_STATUSES = Object.freeze", "Scoring statuses should be controlled.");
expect(app, "USE_FIRST_DISPLAY_GROUPS = Object.freeze", "Display groups should be controlled.");
expect(app, "USE_FIRST_PRIORITY_LEVELS = Object.freeze", "Priority levels should be controlled.");
expect(app, "deriveUseFirstPriorities({", "Shared priority API should exist.");
expect(app, "deriveUseFirstPriorityForPantryItem", "Per-lot derivation should exist.");
expect(app, "attentionPriority: { score:", "Attention priority should be separate.");
expect(app, "rescueRecipePriority: rescueScore === null", "Recipe priority should be separate and nullable.");
expect(app, "if (unavailable) scoringStatus = USE_FIRST_SCORING_STATUSES.NOT_AVAILABLE", "Unavailable items should be classified before recipe scoring.");
expect(app, "else if (guardrail.hardExclusion) scoringStatus = USE_FIRST_SCORING_STATUSES.EXCLUDED", "Hard exclusions should be classified before recipe scoring.");
expect(app, "else if (guardrail.requiresUserReview || !guardrail.canUseForAutomaticPlanning) scoringStatus = USE_FIRST_SCORING_STATUSES.REVIEW_REQUIRED", "Review-required items should not receive recipe priority.");
expect(app, "const rescueScore = scoringStatus === USE_FIRST_SCORING_STATUSES.SCORED ? clampUseFirstScore(rawRecipeScore) : null", "Only scored items should receive rescue recipe priority.");
expect(app, "findUseFirstRecipeOpportunities", "Recipe opportunities should be centralized.");
expect(app, "evaluateRecipeForCurrentRequirements(recipe", "Recipe opportunities should reuse the shared eligibility engine.");
expect(app, "calculateUseFirstValueSummary", "Estimated remaining value should be derived centrally.");
expect(app, "historical-price-paid", "Historical price paid should be the first value source.");
expect(app, "Price information is not available.", "Missing price should be labelled unavailable, not zero.");
expect(app, "calculateUseFirstQuantitySummary", "Quantity-at-risk should be derived centrally.");
expect(app, "remainingRatio", "Remaining ratio should be represented when valid.");
expect(app, "deriveUseFirstPlannedUseSummary", "Planned-use coverage should be represented.");
expect(app, "calculateUseFirstPlannedPenalty", "Already-planned penalty should be proportional.");
expect(app, "calculateUseFirstFrozenPenalty", "Already-frozen penalty should be centralized.");
expect(app, "reviewedFreezeOptionAvailable", "Reviewed freezing option metadata should be returned.");
expect(app, "deriveUseFirstReminderPriority", "Reminder surfacing should be separate from core food priority.");
expect(app, "mayOverrideSnoozeBecausePriorityEscalated", "Reminder escalation should be explicit.");
expect(app, "opened-state-date-window", "Double-counting protection should record opened evidence overlap.");
expect(app, "compareUseFirstPriorityResults", "Deterministic ordering should be centralized.");
expect(app, "return String(a.pantryItemId).localeCompare(String(b.pantryItemId))", "Stable Pantry ID should resolve final ties.");
expect(app, "Math.random()", "Existing notification IDs may use Math.random.");
assert(!/deriveUseFirstPriority[\s\S]{0,12000}Math\.random/.test(app), "Use-First priority derivation must not use random ordering.");
expect(app, "renderUseFirstPriorityGroup", "Use-first groups should render from the shared model.");
expect(app, "Use These First", "Use These First interface should exist.");
expect(app, "Review Before Planning", "Review section should exist.");
expect(app, "Not Eligible for Automatic Planning", "Not Eligible section should exist.");
expect(app, "Quality Review", "Quality Review section should exist.");
expect(app, "Already Planned", "Already Planned section should exist.");
expect(app, "View Priority Details", "Priority details action should exist.");
expect(app, "findUseFirstRecipes", "Find Recipes action should exist.");
expect(app, "searchRecipes({ requireIngredients: false, notify: false })", "Find Recipes should reuse existing recipe search.");
expect(app, "renderUseFirstPriorityBadge(useFirstPriority)", "Pantry cards should use shared priority result.");
expect(app, "attentionModel.highUseFirstCount", "Dashboard should use shared priority model.");
expect(html, "useFirstPriorityModal", "Priority details modal should exist.");
expect(css, ".use-first-group", "Use-first group styling should exist.");
expect(css, ".use-first-card", "Use-first card styling should exist.");
expect(css, ".use-first-badge", "Pantry priority badge styling should exist.");
expect(css, "@media (max-width: 640px)", "Mobile responsive styling should exist.");

const doc = fs.readFileSync("docs/cook-before-it-spoils-use-first-priority-engine.md", "utf8");
const report = fs.readFileSync("docs/cook-before-it-spoils-step-7-report.md", "utf8");
expect(doc, "# Chef Nova Use-First Priority Engine", "Step 7 documentation should exist.");
expect(doc, "Pantry attention and rescue-recipe priority are separate", "Documentation should explain two-score architecture.");
expect(report, "# Cook Before It Spoils Step 7 Validation Report", "Step 7 report should exist.");
expect(report, "Second recipe-eligibility engines created: 0", "Report should confirm no duplicate eligibility engine.");

console.log("Cook Before It Spoils Step 7 Use-First Priority static checks passed.");
