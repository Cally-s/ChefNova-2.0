const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");

[
  "PANTRY_ITEM_SCHEMA_VERSION = 2",
  "PANTRY_QUANTITY_STATUSES",
  "PANTRY_ITEM_FORMS",
  "PANTRY_STORAGE_LOCATIONS",
  "PANTRY_STORAGE_CONTAINERS",
  "PANTRY_PACKAGE_STATES",
  "PANTRY_PRESERVATION_STATES",
  "PANTRY_PRICE_SCOPES",
  "PANTRY_LIFECYCLE_STATUSES",
  "PANTRY_RESERVATION_STATUSES"
].forEach((token) => assert(app.includes(token), `Missing Pantry schema token: ${token}`));

[
  "normalizePantryQuantityDetails",
  "normalizePantryStorage",
  "normalizePantryPreservation",
  "normalizePantryPurchase",
  "normalizePantryLifecycle",
  "normalizePantryReservations",
  "deriveReservedQuantity",
  "deriveAvailableQuantity",
  "derivePantryDisplayStatuses",
  "isPantryItemUsableForPlanning",
  "renderPantrySchemaDetails",
  "normalizePantryItem"
].forEach((fn) => assert(app.includes(`function ${fn}`), `Missing Pantry schema function: ${fn}`));

assert(app.includes("schemaVersion: PANTRY_ITEM_SCHEMA_VERSION"), "Pantry items should persist the current schema version.");
assert(app.includes("revision:"), "Pantry items should carry a revision field.");
assert(app.includes("quantityDetails"), "Pantry items should include structured quantity details.");
assert(app.includes("status: quantityUnknown ? PANTRY_QUANTITY_STATUSES.UNKNOWN"), "Add form should support unknown quantity without using zero.");
assert(app.includes("originalQuantity: normalizePantryQuantityValue"), "Original quantity should be distinct from current quantity.");
assert(app.includes("pricePaidCents: parseMoneyToCents"), "Historical price paid should migrate through integer cents.");
assert(app.includes("pricePaidCents === null ? \"Not recorded\""), "Missing historical prices should display as not recorded.");
assert(app.includes("return (state.pantry || []).map(normalizePantryItem).filter(isPantryItemUsableForPlanning)"), "Active Pantry items should use the schema-aware planning filter.");
assert(app.includes("deriveAvailableQuantity(item)"), "Planning should use available unreserved Pantry quantity.");
assert(app.includes("PANTRY_LIFECYCLE_STATUSES.USED") && app.includes("PANTRY_LIFECYCLE_STATUSES.DISCARDED") && app.includes("PANTRY_LIFECYCLE_STATUSES.DONATED_SHARED"), "Terminal lifecycle states should be excluded from planning.");
assert(app.includes("dateRecords = dedupeFoodDateRecords(migrateLegacyPantryDateRecords"), "Step 3 date records should remain canonical.");
assert(!app.includes("dateInformation:"), "Step 4 must not replace date records with one dateInformation field.");
assert(!app.includes("lifecycle: { status: \"use-soon\""), "Use soon must not be persisted as lifecycle status.");
assert(!app.includes("lifecycle: { status: \"reserved\""), "Reserved must not be persisted as lifecycle status.");
assert(!app.includes("lifecycle: { status: \"frozen\""), "Frozen must not be persisted as lifecycle status.");
assert(!app.includes("Pantry item already exists"), "Multiple Pantry lots with the same name must not be blocked.");
assert(!app.includes("findIndex((pantryItem) => pantryItem.ingredientId && item.ingredientId"), "Shopping shortcut should not merge separate Pantry lots by ingredient.");

[
  "name=\"quantityUnknown\"",
  "name=\"originalQuantity\"",
  "name=\"form\"",
  "name=\"storageLocation\"",
  "value=\"cellar-cool-storage\"",
  "name=\"locationNote\"",
  "name=\"storageContainer\"",
  "name=\"packageState\"",
  "name=\"preservationState\"",
  "name=\"pricePaid\"",
  "name=\"priceScope\"",
  "name=\"packageCount\"",
  "name=\"packageQuantity\"",
  "name=\"packageUnit\""
].forEach((token) => assert(html.includes(token), `Pantry form missing ${token}`));

["Pantry", "Refrigerator", "Freezer", "Counter", "Cellar or cool storage", "Other"].forEach((label) => {
  assert(html.includes(label), `Storage location label missing: ${label}`);
});

["pantry-form-section", "pantry-lot-statuses", "pantry-schema-details", "@media (max-width: 640px)"].forEach((token) => {
  assert(css.includes(token), `CSS missing ${token}`);
});

console.log("Cook Before It Spoils Step 4 Pantry schema static checks passed.");
