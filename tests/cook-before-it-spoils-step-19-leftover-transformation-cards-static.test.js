const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function section(name, nextName) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `${name} should exist.`);
  const end = nextName ? app.indexOf(`function ${nextName}`, start + 1) : app.indexOf("\n  function ", start + 1);
  assert(end > start, `${name} section end should be found.`);
  return app.slice(start, end);
}

[
  "LEFTOVER_TRANSFORMATION_SOURCE_SUMMARY_VERSION",
  "LEFTOVER_TRANSFORMATION_CARD_VERSION",
  "LEFTOVER_PRESERVATION_OPTION_VERSION",
  "LEFTOVER_TRANSFORMATION_CARD_SCORE_CONFIG"
].forEach((token) => assert(app.includes(token), `${token} should be declared.`));

assert(!app.includes("LeftoverTransformationRecipeCard"), "No separate LeftoverTransformationRecipeCard should be created.");
assert(!app.includes("LeftoverOnlyRecipeCard"), "No separate LeftoverOnlyRecipeCard should be created.");
assert(!app.includes("TransformationRecipeDatabase"), "No transformation-only recipe database should be created.");

const recipeCardBody = section("recipeCard", "renderSharedRecipeCardWithTransformation");
assert(recipeCardBody.includes('presentationMode === "leftover-transformation"'), "Shared recipe card should accept a leftover-transformation presentation mode.");

const sourceSummary = section("buildLeftoverTransformationSourceSummary", "deriveLeftoverTransformationRecommendationLabel");
assert(sourceSummary.includes("deriveAvailableQuantity"), "Source summary should use unreserved available quantity.");
assert(sourceSummary.includes("deriveReservedQuantity"), "Source summary should display reservations separately.");
assert(sourceSummary.includes("deriveLeftoverTimeline"), "Source summary should reuse Step 18 timeline.");
assert(sourceSummary.includes("canRecommendFreezing"), "Source summary should capability-gate freeze wording.");
assert(sourceSummary.includes("sourceSummaryVersion"), "Source summary should be versioned.");

const cardModel = section("buildLeftoverTransformationCardViewModel", "buildLeftoverTransformationExplanation");
assert(cardModel.includes("transformationCardVersion"), "Transformation card model should be versioned.");
assert(cardModel.includes("otherPriorityFoodUse"), "Transformation card should include other priority Pantry food use.");
assert(cardModel.includes("sourceCoverage"), "Transformation card should include source coverage.");
assert(cardModel.includes("projectedRemainingQuantity"), "Transformation card should include projected source remainder.");
assert(cardModel.includes("costStatus"), "Transformation card should carry missing-price status.");
assert(cardModel.includes("presentationMode"), "Transformation card should carry presentation context.");

const otherPriority = section("calculateTransformationOtherPriorityFoodUse", "buildLeftoverTransformationCardViewModel");
assert(otherPriority.includes("getUseFirstPriorityModel"), "Other priority food should come from Use These First priorities.");
assert(otherPriority.includes("buildFoodRescueScaledRequirement"), "Other priority food should use structured ingredient quantities.");
assert(otherPriority.includes("deriveAvailableQuantity"), "Other priority food should exclude reserved quantities.");
assert(otherPriority.includes("FOOD_RESCUE_RECIPE_SCORE_CONFIG.meaningfulUse.minimumUseRatio"), "Trace use should not receive full cross-rescue credit.");
assert(otherPriority.includes("foodSafety?.canUseForAutomaticPlanning === true"), "Unsafe priority food should not receive cross-rescue credit.");

const score = section("scoreTransformationCandidate", "compareTransformationCandidates");
assert(score.includes("sourceLeftoverCoverage"), "Source leftover coverage should remain a scoring component.");
assert(score.includes("otherPriorityFoodBreadth"), "Other priority-food breadth should be scored.");
assert(score.includes("otherPriorityFoodCoverage"), "Other priority-food coverage should be scored.");
assert(score.includes("candidate.purchaseSummary.costStatus === \"incomplete\""), "Missing prices should be penalized, not treated as zero.");

const compare = section("compareTransformationCandidates", "buildTransformationCandidateReasons");
["finalScore", "sourceUseRatio", "meaningfulOtherPriorityFoodGroupCount", "weightedOtherPriorityCoverage", "unallocatedServings", "marginalPurchaseCostCents", "getRecipeTotalMinutes", "safetyMarginHours", "recipeId", "recipeVariantId", "preparationMethodId"].forEach((token) => {
  assert(compare.includes(token), `Deterministic candidate ordering should include ${token}.`);
});

const renderSection = section("renderLeftoverTransformationRecipeSection", "formatTransformationGrocerySummary");
["Would use", "Projected source use", "Projected quantity remaining", "Originally cooked", "Transforming this leftover will not automatically extend", "Add to Tonight", "Plan for Another Meal", "View Details", "Find Another Use", "Incomplete estimate"].forEach((copy) => {
  assert(renderSection.includes(copy), `Card should include projected/action copy: ${copy}`);
});
["Used", "Consumed", "Waste prevented"].forEach((unsafeCopy) => {
  assert(!renderSection.includes(`>${unsafeCopy}<`), `Card should avoid completed-outcome wording: ${unsafeCopy}`);
});

const preservation = section("buildLeftoverPreservationOptionCardModel", "scoreTransformationCandidate");
assert(preservation.includes("LEFTOVER_PRESERVATION_OPTION_VERSION"), "Preservation option should be versioned.");
assert(preservation.includes("canRecommendFreezing"), "Preservation option should be capability-gated.");

const interfaceBody = section("renderLeftoverTransformationInterface", "renderLeftoverTransformationSourceSummary");
assert(interfaceBody.includes("renderFoodSafetyNotice()"), "Permanent food-safety notice should render before options.");
assert(interfaceBody.includes("renderLeftoverTransformationSourceSummary"), "Source batch summary should remain visible.");
assert(interfaceBody.includes("data-leftover-transformation-card-panel"), "Transformation card panel should exist.");

const remainder = section("openProjectedRemainderTransformationSearch", "openLeftoverTransformationPathReview");
assert(remainder.includes("projectedSourceUse.projectedSourceRemaining"), "Find Another Use should use projected remainder.");
assert(!remainder.includes("commitPantrySnapshotAndFoodEvents"), "Find Another Use should not mutate Pantry or events.");

assert(css.includes(".leftover-transform-source-summary"), "Source summary styles should exist.");
assert(css.includes(".leftover-transformation-card-section"), "Transformation card section styles should exist.");
assert(css.includes("@media print"), "Print support should exist.");
assert(fs.existsSync(path.join(root, "docs", "cook-before-it-spoils-leftover-transformation-cards.md")), "Step 19 documentation should exist.");
assert(fs.existsSync(path.join(root, "docs", "cook-before-it-spoils-step-19-report.md")), "Step 19 report should exist.");

console.log("Cook Before It Spoils Step 19 leftover transformation card static checks passed.");
