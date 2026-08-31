const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const docs = fs.readFileSync("docs/cook-before-it-spoils-protect-existing-user-information.md", "utf8");
const report = fs.readFileSync("docs/cook-before-it-spoils-step-47-report.md", "utf8");

function includes(source, snippet, message) {
  assert(source.includes(snippet), message || `Missing snippet: ${snippet}`);
}

[
  "const USER_INFORMATION_PROTECTION_VERSION = 1",
  "const USER_INFORMATION_UPGRADE_POLICY_VERSION = 1",
  "const USER_INFORMATION_BACKUP_VERSION = 1",
  "const USER_INFORMATION_LOCK_VERSION = 1",
  "const USER_DATA_MANIFEST_VERSION = 1",
  "const USER_DATA_ENVELOPE_VERSION = 1",
  "const DATASET_ID_REGISTRY_VERSION = 1",
  "const DATASET_PRESERVATION_STATUS_VERSION = 1",
  "const CHEF_NOVA_USER_DATASET_IDS = Object.freeze",
  "PANTRY: \"pantry\"",
  "MEAL_PLANS: \"meal-plans\"",
  "MEAL_CALENDAR: \"meal-calendar\"",
  "USER_RECIPES: \"user-recipes\"",
  "FAVORITES: \"favorites\"",
  "ALLERGY_PROFILE: \"allergy-profile\"",
  "SHOPPING_LIST: \"shopping-list\"",
  "PRICE_PROFILES: \"price-profiles\"",
  "FOOD_EVENT_HISTORY: \"food-event-history\"",
  "IMPACT_LEDGER: \"impact-ledger\""
].forEach((snippet) => includes(app, snippet, `Missing Step 47 dataset model: ${snippet}`));

[
  "const DATASET_PRESERVATION_STATUSES = Object.freeze",
  "VERIFIED_UNCHANGED: \"verified-unchanged\"",
  "VERIFIED_MIGRATED: \"verified-migrated\"",
  "VERIFIED_MERGED: \"verified-merged\"",
  "NOT_PRESENT: \"not-present\"",
  "REVIEW_REQUIRED: \"review-required\"",
  "BACKUP_FAILED: \"backup-failed\"",
  "VALIDATION_FAILED: \"validation-failed\"",
  "ROLLED_BACK: \"rolled-back\"",
  "FAILED: \"failed\"",
  "const USER_INFORMATION_OPERATION_TYPES = Object.freeze",
  "PATCH: \"patch\"",
  "APPEND: \"append\"",
  "DELETE: \"delete\""
].forEach((snippet) => includes(app, snippet, `Missing preservation status or operation: ${snippet}`));

[
  "const CHEF_NOVA_USER_DATASET_REGISTRY = Object.freeze",
  "datasetId: CHEF_NOVA_USER_DATASET_IDS.PANTRY",
  "feature: \"Pantry\"",
  "canonical: true",
  "derived: false",
  "backupRequired: true",
  "datasetId: CHEF_NOVA_USER_DATASET_IDS.ACTIONABLE_INSIGHTS",
  "derived: true",
  "backupRequired: false"
].forEach((snippet) => includes(app, snippet, `Missing registry behavior: ${snippet}`));

[
  "function createUserDataManifest",
  "function readCompatibleUserDataset",
  "function mergePreservingUnknownFields",
  "function applyUserDataArrayOperation",
  "function writeUserStoragePatch",
  "function getUserInformationUpgradeArtifacts",
  "function acquireUserInformationUpgradeLock",
  "function releaseUserInformationUpgradeLock",
  "function createUserInformationPreUpgradeSnapshot",
  "function validateUserInformationManifest",
  "function validateUserInformationReferences",
  "function rollbackUserInformationUpgrade",
  "function runUserInformationProtectionUpgrade",
  "function renderUserInformationUpgradeMessage"
].forEach((snippet) => includes(app, snippet, `Missing protection function: ${snippet}`));

[
  "rawValue",
  "checksum: raw.rawValue == null ? null : createStableHash(raw.rawValue)",
  "recordCount",
  "stableIds",
  "duplicateIdCount",
  "userScopeId: scope.userScopeId",
  "storage.setItem(lockResult.artifacts.backupKey, backupText)",
  "Backup read-back failed.",
  "recordsDeleted: 0",
  "orphanReferencesPreserved: true",
  "rollbackUserInformationUpgrade(backup, lockResult)"
].forEach((snippet) => includes(app, snippet, `Missing backup, manifest, or validation contract: ${snippet}`));

[
  "YOUR CHEF NOVA INFORMATION IS READY",
  "Existing information preserved:",
  "Pantry items and quantities",
  "Saved meal plans and Calendar meals",
  "Recipes and Favorites",
  "Dietary restrictions and allergies",
  "Shopping Lists and price profiles",
  "Household and Budget Rescue settings",
  "Records deleted:</b> 0",
  "INFORMATION UPDATE NEEDS REVIEW",
  "No existing user information was intentionally reset.",
  "INFORMATION UPDATE NEEDS STORAGE SPACE",
  "INFORMATION UPDATE IN PROGRESS"
].forEach((snippet) => includes(app, snippet, `Missing required user-facing wording: ${snippet}`));

const mergeBlock = app.match(/function mergePreservingUnknownFields[\s\S]*?\n  function applyUserDataArrayOperation/);
assert(mergeBlock, "Could not locate merge-aware write helper.");
includes(mergeBlock[0], "const result = { ...existing }", "Merge helper should start from existing data.");
includes(mergeBlock[0], "mergePreservingUnknownFields(existing[key], value)", "Merge helper should preserve nested unknown fields.");
assert(!/DEFAULT_COMPLETE_PROFILE|DEFAULT_USER_DATA|localStorage\.clear|indexedDB\.deleteDatabase/.test(app), "Step 47 must not add global resets or database deletion.");

[
  ".user-information-update-summary",
  ".user-information-update-summary.failed",
  ".update-preserved-list ul",
  "grid-template-columns: 1fr",
  "aria-label=\"Continue to Chef Nova after the information update\"",
  "aria-label=\"Retry the Chef Nova user-information upgrade\""
].forEach((snippet) => includes(app + css, snippet, `Missing accessible or responsive summary snippet: ${snippet}`));

[
  "# Chef Nova Existing User Information Protection",
  "## 3. Canonical Versus Derived Data",
  "## 5. User-Data Manifest",
  "## 7. Absent Versus Empty",
  "## 9. Merge-Aware Writes",
  "## 19. Allergy Protection",
  "## 31. Backup",
  "## 32. Atomic Upgrade",
  "## 33. Rollback",
  "## 39. Registered-User Isolation",
  "## 40. Guest Data",
  "## 45. Deferred Work"
].forEach((snippet) => includes(docs, snippet, `Missing Step 47 documentation section: ${snippet}`));

[
  "Second active user-data stores created: 0",
  "Second Pantry systems created: 0",
  "Canonical user records deleted by upgrade: 0",
  "Pantry quantities reset: 0",
  "Allergies reset: 0",
  "Unknown fields removed: 0",
  "Stable IDs regenerated unnecessarily: 0",
  "Upgrade actions creating physical Food Event History events: 0",
  "Upgrade actions creating Impact Ledger credits: 0",
  "Step 47 completion status"
].forEach((snippet) => includes(report, snippet, `Missing Step 47 report result: ${snippet}`));

assert(!/oldUserData|newUserData|userDataV2Copy|protectedPantryCopy|legacyMealPlanDatabase|backupFavoritesDatabase|migrationShoppingList|newProfileStore|secondRecipeStore/.test(app), "Step 47 must not create competing active stores.");
assert(!/Treat missing allergies as no allergies|No allergies by default|allergies\s*=\s*storedProfile\.allergies\s*\|\|\s*\[\]/.test(app), "Step 47 must not treat missing allergies as confirmed empty.");
assert(!/recordImpact|postImpactCredit|quantity-used.*upgrade|discarded.*upgrade|frozen.*upgrade/i.test(app.match(/function runUserInformationProtectionUpgrade[\s\S]*?\n  function renderUserInformationUpgradeMessage/)?.[0] || ""), "Upgrade coordinator must not create physical events or impact credit.");

console.log("Cook Before It Spoils Step 47 user-information protection static checks passed.");
