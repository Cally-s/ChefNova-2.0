const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

assert(app.includes('weeklyNutritionSection: "overview"'), "Weekly Nutrition section state should default to overview.");
assert(app.includes("function updateWeeklyNutritionRouteState"), "Weekly Nutrition route state parser is missing.");
assert(app.includes("function buildWeeklyNutritionHash"), "Weekly Nutrition hash builder is missing.");
assert(app.includes("function renderWeeklyNutritionSectionPage"), "Weekly Nutrition multipage renderer is missing.");
assert(app.includes("function renderWeeklyNutritionBreadcrumb"), "Detail pages should render a breadcrumb and back link.");
assert(app.includes("function renderWeeklyNutritionOverview"), "Weekly Nutrition overview renderer is missing.");
assert(app.includes("function renderWeeklyDailyPage"), "Daily Nutrition detail renderer is missing.");
assert(app.includes("function renderWeeklyMacrosPage"), "Calories and macros detail renderer is missing.");
assert(app.includes("function renderWeeklyMicronutrientsPage"), "Vitamins and minerals detail renderer is missing.");
assert(app.includes("function renderWeeklyMealsPage"), "Meals and nutrition detail renderer is missing.");
assert(app.includes("function renderWeeklyGoalsPage"), "Goals and progress detail renderer is missing.");
assert(app.includes("function renderWeeklyInsightsPage"), "Insights detail renderer is missing.");
assert(app.includes("function renderWeeklyNutritionNotFound"), "Unknown nutrition section state is missing.");

assert(app.includes('hash: "weekly-nutrition/daily"'), "Daily Nutrition route is not registered.");
assert(app.includes('hash: "weekly-nutrition/macros"'), "Calories and macros route is not registered.");
assert(app.includes('hash: "weekly-nutrition/micronutrients"'), "Vitamins and minerals route is not registered.");
assert(app.includes('hash: "weekly-nutrition/meals"'), "Meals and nutrition route is not registered.");
assert(app.includes('hash: "weekly-nutrition/goals"'), "Goals and progress route is not registered.");
assert(app.includes('hash: "weekly-nutrition/insights"'), "Insights route is not registered.");
assert(app.includes('params.set("day"'), "Daily page selected day should persist in the route.");
assert(app.includes('aria-current="page"'), "Current nutrition section should be announced.");
assert(app.includes('$("#weeklyNutritionPageTitle")?.focus'), "Weekly Nutrition route changes should focus the page heading.");
assert(app.includes("Back to Weekly Overview"), "Detail pages should include a back link to the overview.");

const oldLongPageChain = "${notice}${renderNutritionSafetyPanel(planningContext)}${renderDailyNutritionRangeCard(summary, dailyTarget)}${plannedWeeklyNutritionHeading()}${weeklyNutritionSummaryCards(summary)}";
assert(!app.includes(oldLongPageChain), "Overview should not render the old long all-sections page chain.");

assert(html.includes('id="weeklyNutritionPageTitle"'), "Weekly Nutrition page heading should be addressable.");
assert(html.includes('id="weeklyNutritionPageDescription"'), "Weekly Nutrition page description should be addressable.");

assert(css.includes(".weekly-nutrition-section-grid"), "Weekly Nutrition section card grid styles are missing.");
assert(css.includes("grid-template-columns: repeat(3, minmax(0, 1fr))"), "Desktop section cards should support a three-column grid.");
assert(css.includes(".weekly-section-link"), "Weekly Nutrition section navigation styles are missing.");
assert(css.includes(".weekly-breadcrumb"), "Weekly Nutrition breadcrumb styles are missing.");
assert(css.includes(".daily-nutrition-tabs"), "Daily Nutrition day selector styles are missing.");
assert(css.includes(".weekly-meal-grid"), "Meals and nutrition detail grid styles are missing.");

console.log("Weekly Nutrition multipage layout static checks passed.");
