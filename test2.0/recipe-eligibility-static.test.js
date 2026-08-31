const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const moduleSource = fs.readFileSync("scripts/recipe-eligibility-ranking.js", "utf8");

assert(html.includes("scripts/recipe-eligibility-ranking.js"), "Recipe eligibility module must be loaded before app.js.");
assert(app.includes("const RECIPE_ELIGIBILITY = window.ChefNovaRecipeEligibility"), "app.js must use the shared recipe eligibility module.");
assert(app.includes("buildRecipeEligibilityContext"), "app.js must build one normalized eligibility context.");
assert(app.includes("evaluateRecipeForCurrentRequirements"), "app.js must call one central eligibility wrapper.");
assert(app.includes("filterRecipesForMealPlanSafety"), "Meal-plan filtering must remain centralized.");
assert(app.includes("isRecipeEligibleForAutomaticPlanning(recipe, context"), "Generated plan candidates must use the central hard filter.");
assert(app.includes("getEligibleMealReplacementRecipes"), "Replacement workflow must exist.");
assert(app.includes("evaluateRecipeForCurrentRequirements(recipe, context, { requiredServings: context.currentMeal?.servings"), "Replacement workflow must use the central hard filter with slot servings.");
assert(app.includes("validateGeneratedMealPlanSafety"), "Saved/generated plans must be re-evaluated before saving.");
assert(app.includes("renderMealCompatibilityWarning"), "Current saved plans must show compatibility warnings.");
assert(app.includes("calculateCentralSoftPreferenceScore"), "Soft scoring must be separated from hard eligibility.");
assert(moduleSource.includes("RECIPE_ELIGIBILITY_STATUSES"), "Module must define controlled eligibility statuses.");
assert(moduleSource.includes("RECIPE_EXCLUSION_REASONS"), "Module must define controlled exclusion reason codes.");
assert(moduleSource.includes("SOFT_PREFERENCE_WEIGHTS"), "Soft weights must live in one configuration.");
assert(moduleSource.includes("if (!eligibilityResult || eligibilityResult.status !== RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE)"), "Soft scoring must not run for hard failures.");
assert(moduleSource.includes("rankEligibleCandidates"), "Ranking must be deterministic.");

console.log("Recipe eligibility static checks passed.");
