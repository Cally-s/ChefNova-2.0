const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const docs = fs.readFileSync("docs/budget-data-protection.md", "utf8");

function has(source, text, message) {
  assert(source.includes(text), message || `Expected source to include ${text}`);
}

[
  "BUDGET_PROFILE_SCHEMA_VERSION",
  "BUDGET_PLAN_SNAPSHOT_SCHEMA_VERSION",
  "BUDGET_STORAGE_MIGRATION_STATUSES",
  "CURRENT: \"current\"",
  "MIGRATED: \"migrated\"",
  "NOT_NEEDED: \"not-needed\"",
  "INVALID: \"invalid\"",
  "FUTURE_VERSION: \"future-version\"",
  "FAILED: \"failed\"",
  "migrateBudgetProfileDocument",
  "validateBudgetProfileDocument",
  "saveBudgetProfileFromCurrentInputs",
  "loadBudgetProfileForCurrentUser"
].forEach((text) => has(app, text, `${text} should exist for Budget Profile protection.`));

[
  "BudgetProfile: \"chefNovaBudgetProfile\"",
  "budgetProfile: \"chefNovaGuestBudgetProfile\"",
  "getActiveUserId()",
  "window.addEventListener(\"storage\", handleBudgetProfileStorageEvent)",
  "handleBudgetProfileStorageEvent"
].forEach((text) => has(app, text, `Storage isolation should include ${text}.`));

[
  "parseMoneyToCents",
  "dollars * 100 + centsPart",
  "weeklyBudgetCents: weeklyBudgetCents !== null && weeklyBudgetCents > 0 ? weeklyBudgetCents : null",
  "weeklyBudget: 100",
  "estimatedGroceryCost: 92.75"
].forEach((text) => has(app + docs, text, `Cent migration should include ${text}.`));

[
  "budgetPlanSnapshotSchemaVersion: BUDGET_PLAN_SNAPSHOT_SCHEMA_VERSION",
  "budgetSnapshot",
  "costSnapshot",
  "pricingSnapshot",
  "pantrySnapshot",
  "migrateSavedBudgetSnapshotMetadata"
].forEach((text) => has(app, ` ${text}`.trim(), `Saved plan snapshots should include ${text}.`));

[
  "Cost estimate unavailable for this older saved plan.",
  "Calculate Current Estimate",
  "Current estimates use today&apos;s pantry and prices without changing the saved historical plan.",
  "Save Current Estimate",
  "Add Missing Prices",
  "Set a Budget",
  "Choose Replacement"
].forEach((text) => has(app, text, `Legacy saved plans should show ${text}.`));

[
  "budget-data-protection-panel",
  "budget-current-estimate",
  "@media (max-width: 720px)"
].forEach((text) => has(css, text, `CSS should style ${text}.`));

[
  "Pantry items",
  "Shopping List items",
  "Favorites",
  "price profiles",
  "future versions are not downgraded",
  "malformed Budget subtree"
].forEach((text) => has(docs, text, `Docs should cover ${text}.`));

[
  "localStorage.clear",
  "sessionStorage.clear",
  "chefNovaBudgetRescueProfile",
  "chefNovaBudgetRescueSnapshot",
  "copyGuestProgressToUser(user).budgetProfile"
].forEach((forbidden) => assert(!app.includes(forbidden), `Do not use destructive or duplicate storage behavior: ${forbidden}`));

console.log("Budget data protection static checks passed.");
