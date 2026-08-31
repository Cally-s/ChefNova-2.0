const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert.notStrictEqual(start, -1, `${name} should exist`);
  const next = app.indexOf(`\n  function `, start + 1);
  return app.slice(start, next === -1 ? app.length : next);
}

const renderSummary = extractFunction("renderFoodRescueRecipeSummary");
const detailsModal = extractFunction("openFoodRescueRecipeDetails");
const viewModel = extractFunction("buildFoodRescueCardViewModel");
const cookTonight = extractFunction("confirmFoodRescueCookTonight");
const secondUse = extractFunction("findFoodRescueSecondUse");
const costFormatter = extractFunction("renderFoodRescueCostValue");

assert(
  app.includes("const FOOD_RESCUE_CARD_VIEW_MODEL_VERSION = 1;"),
  "Food-rescue card view model version should be declared"
);

assert(
  app.includes("${renderFoodRescueRecipeSummary(recipe)}"),
  "Existing recipe card renderer should include the food-rescue summary"
);

assert(
  !/function\s+(FoodRescueRecipeCard|CookSoonRecipeCard|ExpiryRecipeCard)\b/.test(app),
  "Step 11 should not create a second recipe-card system"
);

assert(
  viewModel.includes("ranking.eligibility?.status !== RECIPE_ELIGIBILITY_STATUSES.ELIGIBLE"),
  "Food-rescue card view model should respect Step 10 eligibility"
);

assert(
  viewModel.includes("selectedFoodCoverage:") &&
    viewModel.includes("pantryCoverage:") &&
    viewModel.includes("purchaseSummary:") &&
    viewModel.includes("leftoverFit:"),
  "View model should expose Step 9 ranking metrics for presentation"
);

[
  "Would Use",
  "would remain",
  "These quantities are planning estimates",
  "Pantry amounts update only after food use is confirmed",
  "Selected-food coverage",
  "Pantry coverage",
  "New groceries",
  "Estimated added cost",
  "Suggested servings"
].forEach((copy) => {
  assert(app.includes(copy), `Recipe card should include projected copy: ${copy}`);
});

[
  "data-food-rescue-cook-tonight",
  "data-food-rescue-adjust",
  "data-food-rescue-details",
  "data-food-rescue-other",
  "data-food-rescue-second-use",
  "data-food-rescue-freeze-remainder"
].forEach((attribute) => {
  assert(app.includes(attribute), `Recipe card action should exist: ${attribute}`);
});

assert(
  renderSummary.includes('<dl class="food-rescue-metrics"'),
  "Recipe card should use a semantic definition list for metrics"
);

assert(
  renderSummary.includes('<ul class="food-rescue-use-list"'),
  "Recipe card should use a semantic list for projected food use"
);

[
  "Saved from waste",
  "Prevented waste",
  "Rescued food",
  "You used",
  "Food saved"
].forEach((unsafePhrase) => {
  assert(!renderSummary.includes(unsafePhrase), `Recipe card should avoid confirmed-result wording: ${unsafePhrase}`);
  assert(!detailsModal.includes(unsafePhrase), `Details modal should avoid confirmed-result wording: ${unsafePhrase}`);
});

assert(
  costFormatter.includes("Incomplete estimate") &&
    costFormatter.includes("unpricedPurchaseGroupCount") &&
    !costFormatter.includes("return `$0.00"),
  "Incomplete grocery prices should not be presented as a full zero-dollar estimate"
);

assert(
  cookTonight.includes("createCookTonightDraft") &&
    cookTonight.includes("renderCookTonightReview") &&
    !cookTonight.includes("saveMealPlan()"),
  "Cook This Tonight should hand off to the confirmed Step 12 workflow instead of saving immediately"
);

assert(
  !cookTonight.includes("appendFoodEvent") &&
    !cookTonight.includes("executePantryCommand") &&
    !cookTonight.includes("commitPantrySnapshotAndFoodEvents"),
  "Cook This Tonight should not directly mutate pantry or food-event history"
);

assert(
  secondUse.includes('recommendationGoal: "use-projected-remainder"') &&
    secondUse.includes("projectedRemainder") &&
    secondUse.includes("excludeRecipeId"),
  "Find Second Use should search from projected remainder and exclude the current recipe"
);

assert(
  app.includes("requestedSource?.recommendationGoal !== \"use-projected-remainder\"") &&
    app.includes("candidates = request?.excludeRecipeId"),
  "Second-use searches should be protected during revalidation and ranking"
);

[
  ".food-rescue-result-summary",
  ".food-rescue-use-list",
  ".food-rescue-metrics",
  ".food-rescue-actions",
  ".food-rescue-remainders",
  ".food-rescue-portion-preview",
  "@media (forced-colors: active)",
  "@media print"
].forEach((selector) => {
  assert(css.includes(selector), `Food-rescue CSS should include ${selector}`);
});

[
  "docs/cook-before-it-spoils-food-rescue-recipe-card.md",
  "docs/cook-before-it-spoils-step-11-report.md"
].forEach((docPath) => {
  assert(fs.existsSync(path.join(root, docPath)), `${docPath} should exist`);
});

console.log("Cook Before It Spoils Step 11 food-rescue card static checks passed.");
