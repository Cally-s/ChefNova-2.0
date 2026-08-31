const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert.notStrictEqual(start, -1, `${name} should exist`);
  const next = app.indexOf("\n  function ", start + 1);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "LEFTOVER_TRANSFORMATION_RULE_SCHEMA_VERSION = 1",
  "LEFTOVER_TRANSFORMATION_CANDIDATE_VERSION = 1",
  "LEFTOVER_TRANSFORMATION_PATH_VERSION = 1",
  "LEFTOVER_TRANSFORMATION_SAVED_PATH_VERSION = 1",
  "PREPARED_FOOD_TYPE_IDS",
  "PREPARED_FOOD_FORM_IDS",
  "LEFTOVER_TRANSFORMATION_METHODS",
  "TRANSFORMATION_QUANTITY_REQUIREMENT_SOURCES",
  "LEFTOVER_PATH_SEARCH_CONFIG",
  "LEFTOVER_TRANSFORMATION_PATH_SCORE_CONFIG",
  "LEFTOVER_TRANSFORMATION_RULES"
].forEach((token) => assert(app.includes(token), `${token} should exist.`));

assert(app.includes("targetIngredientOccurrenceId"), "Rules should reference target ingredient occurrences.");
assert(app.includes("chicken-wrap::ingredient::0"), "Cooked chicken wraps rule should target a specific occurrence.");
assert(app.includes("chicken-noodle-soup::ingredient::0"), "Cooked chicken soup rule should target a specific occurrence.");
assert(app.includes("reviewedConversion"), "Rules should use reviewed quantity conversion instead of display strings.");
assert(!app.includes("LeftoverRecipeDatabase"), "No separate leftover recipe database should be created.");
assert(!app.includes("TransformationRecipeDatabase"), "No separate transformation recipe database should be created.");

const ruleValidation = extractFunction("validateLeftoverTransformationRule");
assert(ruleValidation.includes("findRecipeById"), "Rule validation should use existing Recipe Database recipes.");
assert(ruleValidation.includes("getTransformationTargetOccurrence"), "Rule validation should verify the target occurrence.");
assert(ruleValidation.includes("LEFTOVER_TRANSFORMATION_METHODS"), "Rule validation should check method values.");

const ruleIndex = extractFunction("buildLeftoverTransformationRuleIndex");
["byPreparedFoodType", "byPreparedForm", "byTargetRecipeId", "byTargetIngredientOccurrence", "byMethod", "byStatus"].forEach((indexName) => {
  assert(ruleIndex.includes(indexName), `${indexName} index should be built.`);
});

const identity = extractFunction("derivePreparedFoodIdentityForLeftoverBatch");
assert(identity.includes("source-recipe-structured-ingredients"), "Prepared-food identity should use source recipe structured ingredients.");
assert(identity.includes("no-canonical-match"), "Display-name-only chicken matches should be rejected.");
assert(identity.includes("MIXED_CHICKEN_DISH"), "Prepared form should preserve mixed dish context.");

const sourceValidation = extractFunction("revalidateLeftoverTransformationSource");
[
  "deriveAvailableQuantity",
  "getFoodSafetyGuardrailForPantryItem",
  "selectFoodEventsForLeftoverBatch",
  "hasLeftoverLineageCycle",
  "outside-safety-window",
  "quantity-unavailable",
  "identity-unresolved"
].forEach((token) => assert(sourceValidation.includes(token), `Source validation should include ${token}.`));

const candidateGeneration = extractFunction("generateSingleStepTransformationCandidates");
[
  "evaluateRecipeForCurrentRequirements",
  "recipeContainsTransformationSourceAllergy",
  "doesTransformationBreakDietaryProfile",
  "calculateTransformationAdditionalGroceries",
  "projectedSourceRemaining",
  "finalScore",
  "explanationReasons"
].forEach((token) => assert(candidateGeneration.includes(token), `Candidate generation should include ${token}.`));
assert(!candidateGeneration.includes("state.pantry ="), "Candidate generation must not mutate Pantry.");
assert(!candidateGeneration.includes("commitPantrySnapshotAndFoodEvents"), "Candidate generation must not append events.");

const pathGeneration = extractFunction("generateLeftoverTransformationPaths");
assert(pathGeneration.includes("maximumPathSteps"), "Path generation should be bounded.");
assert(pathGeneration.includes("buildTransformationPathFromCandidates"), "Multi-step paths should use one builder.");

const pathBuilder = extractFunction("buildTransformationPathFromCandidates");
[
  "allocatedByBatchId",
  "plannedAllocatedQuantity",
  "projectedRemainingQuantity",
  "aggregateTransformationPathPurchaseGroups",
  "sourceCoverage",
  "unallocatedSourceQuantity"
].forEach((token) => assert(pathBuilder.includes(token), `Path builder should include ${token}.`));
assert(pathBuilder.includes("required > remaining"), "Path builder should reject over-allocation.");

const pathCommit = extractFunction("commitLeftoverTransformationPathAtomically");
[
  "createLeftoverTransformationReservations",
  "state.mealPlans.calendar",
  "saveMealPlan",
  "ensureBudgetPurchaseGroupsInShoppingList",
  "releaseCookTonightReservations"
].forEach((token) => assert(pathCommit.includes(token), `Path commit should reuse ${token}.`));
assert(!pathCommit.includes("LEFTOVER_QUANTITY_TRANSFORMED"), "Saving a path must not deduct source leftover quantity.");
assert(pathCommit.includes("targetIngredientOccurrenceId"), "Saved path meals should remember the transformed target occurrence.");

const reservations = extractFunction("createLeftoverTransformationReservations");
assert(reservations.includes("FOOD_EVENT_TYPES.RESERVED_FOR_RECIPE"), "Path save should create reservation events.");
assert(reservations.includes("affectsOnHandQuantity: false"), "Reservations must not deduct on-hand quantity.");
assert(reservations.includes("deriveAvailableQuantity"), "Reservations should use current unreserved quantity.");

const normalizer = extractFunction("applyMealEntryPlanningMetadata");
[
  "transformationPathId",
  "transformationPathStepId",
  "transformationRuleId",
  "targetIngredientOccurrenceId",
  "plannedSourceQuantity",
  "actualSourceQuantityUsed"
].forEach((token) => assert(normalizer.includes(token), `Meal normalizer should preserve ${token}.`));

const targetSkip = extractFunction("getTransformationTargetIngredientIdsForMeal");
assert(targetSkip.includes("getTransformationTargetOccurrence"), "Completion should identify the transformed recipe occurrence.");
assert(targetSkip.includes("LEFTOVER_TRANSFORMATION_RULES"), "Completion should fall back to the transformation rule target occurrence.");

const mealCompletion = extractFunction("confirmAndApplyPantryForCompletedMeal");
assert(mealCompletion.includes("getTransformationTargetIngredientIdsForMeal"), "Meal completion should skip the transformed recipe occurrence.");
assert(mealCompletion.includes("!transformedIngredientIds.has(requirement.ingredientId)"), "Normal Pantry deduction should not deduct the transformed target ingredient.");

const completion = extractFunction("applyTransformationSourceForCompletedMeal");
[
  "FOOD_EVENT_TYPES.LEFTOVER_QUANTITY_TRANSFORMED",
  "FOOD_EVENT_TYPES.RESERVATION_CONSUMED",
  "FOOD_EVENT_TYPES.RESERVATION_CANCELLED",
  "actualSourceQuantityUsed",
  "reconcileDownstreamTransformationSteps"
].forEach((token) => assert(completion.includes(token), `Completion should include ${token}.`));
assert(completion.includes("current - amount"), "Completion should deduct source leftover quantity once.");

const pantryDetails = extractFunction("renderLeftoverBatchDetails");
assert(pantryDetails.includes("data-leftover-transform"), "Pantry leftover cards should expose Transform This Leftover.");

const useFirst = extractFunction("getPreparedLeftoverPanelEntries");
assert(useFirst.includes("generateSingleStepTransformationCandidates"), "Use These First should count hard-filtered transformation candidates.");
assert(useFirst.includes("canTransformLeftover"), "Use These First should expose a transform action.");
assert(useFirst.includes("canFindRecipes: false"), "Prepared leftovers should not be treated as raw recipe-search sources.");

[
  ".leftover-transformation-panel",
  ".leftover-transform-source-grid",
  ".leftover-transform-path-card",
  ".leftover-transform-steps",
  ".leftover-transform-card-grid",
  "@media (max-width: 720px)"
].forEach((selector) => assert(css.includes(selector), `${selector} should be styled.`));

assert(fs.existsSync(path.join(root, "docs/cook-before-it-spoils-leftover-transformation-paths.md")), "Step 17 architecture documentation should exist.");
assert(fs.existsSync(path.join(root, "docs/cook-before-it-spoils-step-17-report.md")), "Step 17 report should exist.");

console.log("Cook Before It Spoils Step 17 leftover transformation path static checks passed.");
