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
  let parenDepth = 0;
  let braceStart = -1;
  for (let index = app.indexOf("(", start); index < app.length; index += 1) {
    if (app[index] === "(") parenDepth += 1;
    if (app[index] === ")") parenDepth -= 1;
    if (parenDepth === 0 && app[index] === "{") {
      braceStart = index;
      break;
    }
  }
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

assert(app.includes("const FLEXIBLE_MEAL_PLAN_SCHEMA_VERSION = 2"), "Flexible meal-plan schema version should be declared.");
assert(app.includes("const DEFAULT_MEAL_SLOT_DEFINITIONS"), "Default meal slot definitions should be declared.");
assert(app.includes("const MEAL_SLOT_SUGGESTIONS"), "Suggested custom meal slot labels should be declared.");
assert(app.includes('"Morning Snack"') && app.includes('"Post-Workout"'), "Common extra meal slot suggestions should be available.");

[
  "normalizeMealSlotCategory",
  "createMealSlotId",
  "normalizeMealSlot",
  "normalizeMealSlotsForDay",
  "getMealSlotsForDay",
  "findMealSlot",
  "setMealSlotEntry",
  "syncLegacyMealFieldsFromSlots",
  "getAllMealSlotsFromPlan",
  "addCustomMealSlot",
  "renameMealSlot",
  "changeMealSlotTime",
  "moveMealSlot",
  "removeMealSlot"
].forEach((name) => functionBody(name));

const normalizePlan = functionBody("normalizeMealPlan");
assert(normalizePlan.includes("FLEXIBLE_MEAL_PLAN_SCHEMA_VERSION"), "Meal plan migration should stamp the flexible schema version.");

const normalizeDay = functionBody("normalizeMealDay");
assert(normalizeDay.includes("normalized.mealSlots = normalizeMealSlotsForDay"), "Each day should normalize into mealSlots.");
assert(normalizeDay.includes("syncLegacyMealFieldsFromSlots"), "Legacy Breakfast/Lunch/Dinner fields should stay synchronized.");

const displayPlanner = functionBody("displayMealPlanner");
assert(displayPlanner.includes("getAllMealSlotsFromPlan(state.mealPlans, { includeEmpty: true })"), "Planner progress should count flexible slots.");
assert(displayPlanner.includes("weeklySlots.length"), "Planner progress denominator should use actual slots, including custom slots.");
assert(!displayPlanner.includes("DAYS.length * MEALS.length"), "Planner progress must not be fixed at 21 slots.");

const activeDay = functionBody("displayActiveMealDay");
assert(activeDay.includes("getMealSlotsForDay(dayPlan, MEALS)"), "Active day should render flexible slots.");
assert(activeDay.includes("renderAddMealSlotPanel(day)"), "Active day should include the add-another-meal control.");
assert(!activeDay.includes("MEALS.map((mealType) => mealSlot"), "Active day should not render only the default meals.");

const addPanel = functionBody("renderAddMealSlotPanel");
assert(addPanel.includes("data-add-meal-slot"), "Add slot button should be rendered.");
assert(addPanel.includes("data-new-meal-slot-name"), "Custom slot name input should be rendered.");
assert(addPanel.includes("data-save-meal-slot"), "Custom slot save action should be rendered.");
assert(addPanel.includes("MEAL_SLOT_SUGGESTIONS"), "Suggested slot names should render from one source.");

const mealSlot = functionBody("mealSlot");
assert(mealSlot.includes("data-meal-slot-id"), "Each rendered slot should expose its stable slot ID.");
assert(mealSlot.includes('data-meal-action="move-up"'), "Move Up should be available.");
assert(mealSlot.includes('data-meal-action="move-down"'), "Move Down should be available.");
assert(mealSlot.includes('"remove-slot"'), "User-created slots should be removable.");
assert(mealSlot.includes("slot.source === \"user-created\""), "Only user-created slots should show remove-slot controls.");

const saveEntry = functionBody("saveMealPlanEntry");
assert(saveEntry.includes("setMealSlotEntry"), "Saving a meal should update the flexible slot entry.");
assert(saveEntry.includes("scheduleMealWithReservations"), "Weekly slot saves should synchronize through the calendar reservation workflow.");

const deleteEntry = functionBody("deleteMealPlanEntry");
assert(deleteEntry.includes("setMealSlotEntry"), "Clearing a meal should update the flexible slot entry.");

const dailyNutrition = functionBody("calculateDailyNutrition");
assert(dailyNutrition.includes("getMealSlotsForDay(dayPlan, CALENDAR_MEALS)"), "Daily nutrition should include custom and calendar slots.");

const weeklyMeals = functionBody("renderWeeklyMealContributionGrid");
assert(weeklyMeals.includes("getAllMealSlotsFromPlan(mealPlan)"), "Weekly Nutrition meal cards should include custom weekly slots.");

const costMeals = functionBody("buildWeeklyCostMeals");
assert(costMeals.includes("getMealSlotsForDay"), "Shopping and budget cost calculations should include flexible slots.");
assert(costMeals.includes("${day}::${slot.id}"), "Cost meal IDs should use stable slot IDs.");

const trackerMeals = functionBody("renderTrackerMealsCard");
assert(trackerMeals.includes("slot?.id"), "Nutrition Tracker completion checkboxes should use stable slot IDs.");

const homeProgress = functionBody("getSavedProgressSummary");
assert(homeProgress.includes("getAllMealSlotsFromPlan(mealPlan, { includeEmpty: true })"), "Home saved-progress summary should count custom slots.");

const calendarSave = functionBody("saveCalendarDay");
assert(calendarSave.includes("getMealSlotsForDay(next, CALENDAR_MEALS)"), "Calendar editor should save all flexible calendar slots.");
assert(calendarSave.includes("syncLegacyMealFieldsFromSlots(next, CALENDAR_MEALS)"), "Calendar saves should keep legacy fields synchronized.");

const scheduleReservations = functionBody("scheduleMealWithReservations");
assert(scheduleReservations.includes("getMealSlotsForDay(previousDay, CALENDAR_MEALS)"), "Reservation scheduling should compare previous flexible slots.");
assert(scheduleReservations.includes("keptReservationIds.set(previousSlot.id"), "Kept reservations should be keyed by stable slot ID.");
assert(scheduleReservations.includes("for (const slot of getMealSlotsForDay(normalizedDay, CALENDAR_MEALS))"), "Reservation creation should include custom calendar slots.");

const cancellation = functionBody("commitMealCancellation");
assert(cancellation.includes("setMealSlotEntry"), "Confirmed cancellation should update the matched flexible slot.");

assert(cssBlock(".meal-slot").includes("word-break: normal"), "Meal slots should avoid letter-by-letter wrapping.");
assert(cssBlock(".meal-slot-card__header").includes("justify-content: space-between"), "Slot card headers should align labels and compact actions cleanly.");
assert(cssBlock(".add-meal-slot-panel").includes("border: 1px dashed"), "Add slot panel should be visually distinct.");
assert(cssBlock(".meal-slot-suggestions").includes("flex-wrap: wrap"), "Suggested slot buttons should wrap on small screens.");
assert(css.includes("@media (max-width: 640px)") && css.includes(".add-meal-slot-button,\n  .add-meal-slot-panel .button,\n  .meal-slot-suggestions .button"), "Mobile styles should make add-slot actions full width.");

console.log("Flexible meal slot static checks passed.");
