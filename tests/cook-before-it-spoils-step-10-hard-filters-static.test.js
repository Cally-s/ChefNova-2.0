const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const moduleSource = fs.readFileSync(path.join(root, "scripts", "recipe-eligibility-ranking.js"), "utf8");
const docs = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-hard-recipe-filters.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-10-report.md"), "utf8");

assert(moduleSource.includes("RECIPE_ELIGIBILITY_VERSION"), "Eligibility version must be defined.");
assert(moduleSource.includes("RECIPE_HARD_FILTER_REASON_CODES"), "Controlled hard-filter reason codes must be defined.");
assert(moduleSource.includes("EXCLUDED: \"excluded\""), "Excluded status must be defined.");
assert(moduleSource.includes("REVIEW_REQUIRED: \"review-required\""), "Review-required status must be defined.");
assert(moduleSource.includes("INVALID_CANDIDATE: \"invalid-candidate\""), "Invalid-candidate status must be defined.");
assert(moduleSource.includes("HARD_FILTER_STAGE_ORDER"), "Deterministic hard-filter order must be defined.");
assert(moduleSource.includes("candidate-structure") && moduleSource.includes("final-verification"), "Hard-filter stages must include structure and final verification.");
assert(moduleSource.includes("buildFinalIngredientGraph"), "Final ingredient graph builder must exist.");
assert(moduleSource.includes("isOptionalIngredientSelected"), "Optional ingredients must be explicitly selected before entering the graph.");
assert(moduleSource.includes("evaluateSelectedPrioritySources"), "Selected priority sources must be centrally validated.");
assert(moduleSource.includes("SELECTED_FOOD_PURCHASE_REQUIRED"), "Selected rescue food must not be purchased to satisfy shortage.");
assert(moduleSource.includes("collectEligiblePantryLots"), "Compatible safe Pantry lots must be aggregated.");
assert(moduleSource.includes("sourceNeedsReview") && moduleSource.includes("sourceIsSafetyExcluded"), "Review-required and excluded sources must be blocked before ranking.");
assert(moduleSource.includes("evaluatePreparedLeftovers"), "Prepared leftovers must be revalidated.");
assert(moduleSource.includes("LEFTOVER_REHEATED_AND_NOT_REUSABLE"), "Reheated non-reusable leftovers must be represented.");
assert(moduleSource.includes("evaluateAppliedSubstitutions"), "Applied substitutions must be validated.");
assert(moduleSource.includes("SUBSTITUTION_QUANTITY_INVALID"), "Substitution quantity failures must be hard failures.");
assert(moduleSource.includes("choosePrimaryReasonCode"), "Primary reason priority must be deterministic.");
assert(moduleSource.includes("hardEligible") && moduleSource.includes("reviewActions") && moduleSource.includes("sourceRevisions"), "Result model must include hard eligibility, review actions, and revisions.");
assert(moduleSource.includes("if (!eligibilityResult || eligibilityResult.status !== RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE)"), "Soft scoring must short-circuit for hard failures.");

const step9 = app.slice(app.indexOf("function rankRecipeForFoodRescue"), app.indexOf("function compareFoodRescueRecipeResults"));
assert(step9.includes("evaluateRecipeForCurrentRequirements"), "Step 9 must call the central eligibility wrapper.");
assert(step9.indexOf("evaluateRecipeForCurrentRequirements") < step9.indexOf("calculateFoodRescueSelectedFoodUsage"), "Step 9 must evaluate hard filters before rescue usage.");
assert(step9.indexOf("evaluateRecipeForCurrentRequirements") < step9.indexOf("calculateFoodRescueRecipeScore"), "Step 9 must evaluate hard filters before rescue scoring.");
assert(step9.includes("selectedRescueSources: sources"), "Step 9 must pass selected rescue sources into hard filters.");
assert(step9.includes("requireStructuredQuantities: true"), "Food-rescue ranking must require structured quantities.");
assert(app.includes("findUseFirstRecipeOpportunities") && app.includes("selectedRescueSources"), "Step 7 recipe-opportunity count must use selected source context.");
assert(!app.includes("Use Replacement Anyway"), "Use Replacement Anyway must not be rendered for hard-filter failures.");
assert(docs.includes("Only `eligible` candidates receive rescue scores") || docs.includes("Only `eligible` candidates"), "Docs must state score short-circuit behavior.");
assert(report.includes("Second recipe-eligibility engines created: 0"), "Report must confirm no duplicate eligibility engine.");

console.log("Cook Before It Spoils Step 10 hard-filter static checks passed.");
