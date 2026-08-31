const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function functionBody(name) {
  const marker = `function ${name}(`;
  const start = app.indexOf(marker);
  assert(start >= 0, `${name} should exist.`);
  const braceStart = app.indexOf("{", start);
  assert(braceStart >= 0, `${name} body should start.`);
  let depth = 0;
  for (let index = braceStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`${name} body was not closed.`);
}

function cssBlock(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{[\\s\\S]*?\\}`));
  assert(match, `${selector} CSS block should exist.`);
  return match[0];
}

const mealSlot = functionBody("mealSlot");
assert(mealSlot.includes("meal-slot-card__header"), "Meal slots should render a compact card header.");
assert(mealSlot.includes("meal-slot__more-button"), "Meal slots should render a three-dot more-actions button.");
assert(mealSlot.includes('aria-haspopup="menu"'), "The more-actions button should expose menu semantics.");
assert(mealSlot.includes("meal-slot__menu") && mealSlot.includes('role="menu"'), "The action menu should render with menu semantics.");
assert(mealSlot.includes("Rename Meal") && mealSlot.includes("Move Up") && mealSlot.includes("Move Down"), "Rename and move actions should live in the compact menu.");
assert(mealSlot.includes("meal-slot__delete-button"), "A compact delete icon button should replace full-size delete controls.");
assert(mealSlot.includes("meal-slot__time-button"), "Time should render as a compact time chip.");
assert(mealSlot.includes("formatMealSlotTime"), "Stored time should be formatted for display.");
assert(!mealSlot.includes("Save for This Session"), "Meal cards must not show the old per-card session save button.");

["renderMealSlotIcon", "formatMealSlotTime", "openMealSlotMenu", "closeMealSlotMenu", "openMealSlotRenameEditor", "saveMealSlotName", "openMealSlotTimeEditor", "saveMealSlotTime", "openMealSlotDeleteDialog", "confirmRemoveMealSlot", "confirmDeleteMeal", "autoSaveMealSlot"].forEach((name) => functionBody(name));

const clickHandlers = app.slice(app.indexOf('$("#mealPlanner")?.addEventListener("click"'), app.indexOf('$("#mealPlanner")?.addEventListener("input"'));
assert(clickHandlers.includes('mealAction === "menu"'), "Meal Planner should toggle the compact action menu.");
assert(clickHandlers.includes('state.openMealSlotMenuId = ""'), "Selecting a menu action should close the menu.");

const modalHandlers = app.slice(app.indexOf('const generationMode = event.target.closest("[data-meal-generation-mode]"'), app.indexOf('const impactMonthButton = event.target.closest("[data-impact-month]"'));
assert(modalHandlers.includes("data-save-meal-slot-name"), "Rename dialog should save through the shared modal.");
assert(modalHandlers.includes("data-save-meal-slot-time"), "Time dialog should save through the shared modal.");
assert(modalHandlers.includes("data-remove-meal-slot-time"), "Time dialog should allow removing optional time.");
assert(modalHandlers.includes("data-confirm-remove-meal-slot"), "Custom slot deletion should require confirmation.");
assert(modalHandlers.includes("data-confirm-delete-meal"), "Clearing a populated default slot should require confirmation.");

assert(app.includes('$("#mealPlanner")?.addEventListener("focusout"'), "Meal inputs should auto-save valid changes after editing.");
assert(functionBody("selectMealSuggestion").includes("autoSaveMealInput(input)"), "Recipe selection should auto-save the chosen meal.");
assert(!app.includes('window.prompt("Rename meal slot"'), "Rename should no longer use a browser prompt.");
assert(!app.includes('window.prompt("Meal time optional"'), "Time editing should no longer use a browser prompt.");

assert(cssBlock(".meal-slot-card__header").includes("justify-content: space-between"), "Card header should align identity and actions cleanly.");
assert(cssBlock(".meal-slot__icon-button").includes("width: 44px") && cssBlock(".meal-slot__icon-button").includes("height: 44px"), "Icon buttons should keep accessible touch targets.");
assert(cssBlock(".meal-slot__menu").includes("position: absolute"), "The compact action menu should be positioned near its trigger.");
assert(cssBlock(".meal-slot-dialog").includes("width: min(520px, 100%)"), "Meal slot dialogs should stay compact and responsive.");

console.log("Compact meal slot card static checks passed.");
