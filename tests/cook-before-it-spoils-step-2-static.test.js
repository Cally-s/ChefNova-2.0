const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function expectApp(text, message) {
  assert(app.includes(text), message || `${text} should exist in app.js.`);
}

[
  "COOK_BEFORE_IT_SPOILS: \"cook-before-it-spoils\"",
  "\"cook-before-it-spoils\": \"Cook Before It Spoils\"",
  "COOK_BEFORE_IT_SPOILS_ENTRY_SOURCES",
  "selectPantryItemsNeedingAttention",
  "formatCookBeforeAttentionCount",
  "openCookBeforeItSpoils",
  "renderCookBeforeItSpoilsWorkflow",
  "openCookBeforeItSpoilsFromRecipe",
  "openCookBeforeItSpoilsFromLeftover",
  "data-cook-before-spoils",
  "data-cook-before-recipe",
  "data-cook-before-leftover",
  "data-cook-before-return"
].forEach((text) => expectApp(text));

["focusIngredientIds", "focusPantryItemIds", "focusRecipeId", "focusLeftoverIds", "focusReminderId", "sourceRevisions", "returnTarget"].forEach((field) => expectApp(field, `${field} should be part of the normalized entry context.`));

const standardIndex = app.indexOf("option(PLANNING_MODES.STANDARD");
const budgetIndex = app.indexOf("option(PLANNING_MODES.BUDGET_RESCUE");
const cookIndex = app.indexOf("option(PLANNING_MODES.COOK_BEFORE_IT_SPOILS");
const emergencyIndex = app.indexOf("option(PLANNING_MODES.EMERGENCY");
assert(standardIndex > -1 && budgetIndex > standardIndex && cookIndex > budgetIndex && emergencyIndex > cookIndex, "Planning selector order should be Standard, Budget Rescue, Cook Before It Spoils, Emergency.");

assert(app.includes("deriveFoodDateIntelligence({ pantryItem: item })") && app.includes("isFoodDateAttentionResult"), "Attention selection should reuse shared Date Intelligence logic.");
assert(app.includes("if (notification.actionTarget === PLANNING_MODES.COOK_BEFORE_IT_SPOILS)") && app.indexOf("if (notification.actionTarget === PLANNING_MODES.COOK_BEFORE_IT_SPOILS)") < app.indexOf("markNotificationAsRead(notificationId);"), "Cook Before It Spoils notification actions should open before notifications are marked read.");
assert(app.includes("recipeIngredientIds.has(ingredientId)"), "Recipe entry matching should use canonical ingredient IDs.");
assert(app.includes("This mode opens a planning workspace only. It does not edit Pantry items, save meals, dismiss reminders, or change the Shopping List."), "Workflow shell should state that entry does not mutate data.");
assert(!app.includes("chefNovaCookBeforeItSpoils"), "Cook Before It Spoils should not create a new localStorage key.");
assert(!html.includes("data-page-section=\"cook-before-it-spoils\""), "Cook Before It Spoils should not be a separate page.");
assert(app.includes("FOOD_RESCUE_RANKING_PROFILE"), "Later Cook Before It Spoils steps may add rescue ranking without changing Step 2 entry behavior.");

[
  ".cook-before-workflow",
  ".cook-before-item-grid",
  ".cook-before-entry",
  ".cook-before-count",
  "@media (max-width: 640px)"
].forEach((selector) => assert(css.includes(selector), `${selector} styles should exist.`));

console.log("Cook Before It Spoils Step 2 static checks passed.");
