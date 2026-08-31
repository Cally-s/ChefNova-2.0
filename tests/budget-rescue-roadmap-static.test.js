const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const requiredDocs = [
  "docs/budget-rescue-roadmap.md",
  "docs/budget-rescue-progress.md",
  "docs/budget-rescue-architecture.md",
  "docs/budget-rescue-data-model.md",
  "docs/budget-rescue-test-results.md"
];

requiredDocs.forEach((relativePath) => {
  assert(fs.existsSync(path.join(root, relativePath)), `${relativePath} should exist.`);
});

const roadmap = fs.readFileSync(path.join(root, "docs/budget-rescue-roadmap.md"), "utf8");
const progress = fs.readFileSync(path.join(root, "docs/budget-rescue-progress.md"), "utf8");
const architecture = fs.readFileSync(path.join(root, "docs/budget-rescue-architecture.md"), "utf8");
const dataModel = fs.readFileSync(path.join(root, "docs/budget-rescue-data-model.md"), "utf8");
const testResults = fs.readFileSync(path.join(root, "docs/budget-rescue-test-results.md"), "utf8");

[
  "No duplicate Meal Planner",
  "Allergies and required dietary restrictions are hard exclusions",
  "Money is stored as integer cents",
  "Missing prices are never treated as free",
  "Unknown Pantry quantities are never assumed sufficient",
  "Generated plans remain previews"
].forEach((text) => assert(roadmap.includes(text), `Roadmap should preserve rule: ${text}`));

[
  "Phase 4: Final Integration and Polish",
  "Existing Meal Planner",
  "Existing Pantry",
  "Existing Shopping List",
  "Existing Save Plan workflow",
  "Existing Replace Meal workflow",
  "Phase 4 gate is met for available repository tooling"
].forEach((text) => assert(progress.includes(text), `Progress should include: ${text}`));

[
  "mealPlans.calendar[\"YYYY-MM-DD\"]",
  "Cost Engine",
  "Pantry-first planning",
  "Eligibility engine",
  "Direct File Support"
].forEach((text) => assert(architecture.includes(text), `Architecture should include: ${text}`));

[
  "weeklyBudgetCents",
  "Missing or unavailable money values are `null`, never `0`",
  "Price Catalogue",
  "Pantry Simulation",
  "Saved Plans",
  "Storage Scope"
].forEach((text) => assert(dataModel.includes(text), `Data model should include: ${text}`));

[
  "Standard weekly Budget Rescue plan",
  "Emergency Plan request",
  "Allergy protection",
  "Appliance restriction",
  "Missing price",
  "Replace Meal recalculation",
  "Manual Testing"
].forEach((text) => assert(testResults.includes(text), `Test results should include: ${text}`));

console.log("Budget Rescue roadmap static checks passed.");
