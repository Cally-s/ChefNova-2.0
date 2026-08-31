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

assert(app.includes("FOOD_INVENTORY_ITEM_KINDS"), "Shared inventory item kinds should exist.");
assert(app.includes('INGREDIENT_LOT: "ingredient-lot"'), "Ingredient lots should remain an inventory kind.");
assert(app.includes('PREPARED_LEFTOVER: "prepared-leftover"'), "Prepared leftovers should be an inventory kind.");
assert(app.includes("LEFTOVER_BATCH_SCHEMA_VERSION = 1"), "Leftover batch schema should be versioned.");
assert(app.includes("LEFTOVER_QUANTITY_BASES"), "Leftover quantity bases should be explicit.");

[
  "LEFTOVER_BATCH_CREATED",
  "LEFTOVER_QUANTITY_CONSUMED",
  "LEFTOVER_QUANTITY_TRANSFORMED",
  "LEFTOVER_BATCH_SPLIT",
  "LEFTOVER_STORAGE_CHANGED",
  "LEFTOVER_QUANTITY_CORRECTED"
].forEach((eventType) => {
  assert(app.includes(eventType), `${eventType} should extend the existing Food Event History.`);
});

[
  "normalizePreparedLeftoverBatch",
  "createPreparedLeftoverInventoryItem",
  "createLeftoverCreationEvents",
  "getPreparedLeftoverBatches",
  "renderLeftoverBatchDetails",
  "updateLeftoverBatchQuantity",
  "freezeLeftoverBatch",
  "thawLeftoverBatch",
  "getPreparedLeftoverPanelEntries"
].forEach((name) => {
  assert(app.includes(`function ${name}`), `${name} should exist.`);
});

const completionCommit = extractFunction("commitCookTonightCompletionAtomically");
assert(completionCommit.includes("createPreparedLeftoverInventoryItem"), "Meal completion should create actual leftover batches.");
assert(completionCommit.includes("nextPantry.push(batch)"), "Created leftover batches should be added to the shared Pantry collection.");
assert(completionCommit.includes("createdLeftoverBatchIds"), "Meal outcome should keep created batch IDs.");
assert(completionCommit.includes("leftoverStorageLocation"), "Actual outcome should store leftover storage location.");
assert(completionCommit.includes("completionKey"), "Meal completion idempotency should guard repeated batch creation.");

const mealEntry = extractFunction("createCookTonightMealEntry");
assert(mealEntry.includes("plannedOutcome"), "Planned leftovers should remain planned metadata before completion.");
assert(!mealEntry.includes("createPreparedLeftoverInventoryItem"), "Planned meal creation must not create leftover inventory.");

const normalizer = extractFunction("normalizePantryItem");
assert(normalizer.includes("itemKind"), "Pantry normalization should preserve item kind.");
assert(normalizer.includes("prepared-leftover"), "Pantry normalization should distinguish prepared leftovers.");
assert(normalizer.includes("leftoverBatch"), "Prepared leftovers should normalize batch data.");

const panelEntries = extractFunction("getPreparedLeftoverPanelEntries");
assert(panelEntries.includes("getPreparedLeftoverBatches"), "Use These First should consume Pantry leftover records.");
assert(panelEntries.includes("USE_FIRST_PANEL_FILTERS.LEFTOVERS"), "Prepared leftovers should appear in the Leftovers filter.");
assert(panelEntries.includes("deriveAvailableQuantity"), "Use These First should use available quantity after reservations.");
assert(panelEntries.includes("PANTRY_QUANTITY_STATUSES.UNKNOWN"), "Unknown leftover quantities should be blocked from automatic use.");

const sourceNormalizer = extractFunction("normalizeFoodRescueSourceFromPanelEntry");
assert(sourceNormalizer.includes("RESCUE_SOURCE_TYPES.PREPARED_LEFTOVER"), "Food Rescue should recognize prepared-leftover sources.");
assert(sourceNormalizer.includes("requiresTransformationRule: true"), "Prepared leftovers should require validated transformation rules.");
assert(sourceNormalizer.includes("transformationRuleId: null"), "Name similarity must not create an implicit transformation rule.");
assert(sourceNormalizer.includes("lineageRequired: true"), "Leftover rescue sources should require valid lineage.");

const quantityCommand = extractFunction("updateLeftoverBatchQuantity");
assert(quantityCommand.includes("deriveAvailableQuantity"), "Quantity commands should exclude reserved quantity.");
assert(quantityCommand.includes("current - amount"), "Consumption/share/discard should deduct once from canonical quantity.");
assert(quantityCommand.includes("LEFTOVER_QUANTITY_CORRECTED"), "Quantity correction should use correction events.");

const freezeCommand = extractFunction("freezeLeftoverBatch");
assert(freezeCommand.includes("childId"), "Partial freezing should create a child batch.");
assert(freezeCommand.includes("remaining"), "Partial freezing should reduce the source batch.");
assert(freezeCommand.includes("LEFTOVER_BATCH_SPLIT"), "Partial freezing should append a split event.");
assert(freezeCommand.includes("MARKED_FROZEN"), "Full freezing should append a frozen event.");

assert(app.includes("data-pantry-filter"), "Pantry should expose filters.");
assert(app.includes("data-leftover-consume"), "Leftover consumption action should be visible.");
assert(app.includes("data-leftover-freeze"), "Leftover freeze action should be visible.");
assert(app.includes("data-leftover-share"), "Leftover share action should be visible.");
assert(app.includes("data-leftover-discard"), "Leftover discard action should be visible.");
assert(app.includes("data-leftover-correct"), "Leftover correction action should be visible.");

[
  ".pantry-filter-bar",
  ".leftover-batch-details",
  ".leftover-batch-actions",
  ".leftover-action-modal",
  "@media (max-width: 720px)"
].forEach((selector) => {
  assert(css.includes(selector), `${selector} should be styled.`);
});

assert(fs.existsSync(path.join(root, "docs/cook-before-it-spoils-leftover-inventory.md")), "Leftover inventory documentation should exist.");
assert(fs.existsSync(path.join(root, "docs/cook-before-it-spoils-step-16-report.md")), "Step 16 report should exist.");

console.log("Cook Before It Spoils Step 16 leftover inventory static checks passed.");
