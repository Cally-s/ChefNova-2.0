const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function contains(text, message) {
  assert(app.includes(text) || css.includes(text), message);
}

[
  "SHOPPING_LIST_CATEGORIES",
  "SHOPPING_LIST_FILTERS",
  "deriveShoppingListViewModel",
  "createShoppingListItemModel",
  "deriveShoppingCoverage",
  "renderShoppingListSummary",
  "renderShoppingListFilters",
  "renderShoppingCategorySection",
  "renderShoppingListItemCard",
  "updateShoppingPurchaseQuantity",
  "restoreShoppingItem",
  "markShoppingItemAlreadyAtHome",
  "refreshShoppingListDependentViews"
].forEach((name) => contains(name, `${name} should exist for the upgraded Shopping List.`));

[
  "Produce",
  "Grains",
  "Protein",
  "Dairy or alternatives",
  "Frozen food",
  "Canned goods",
  "Pantry staples",
  "Other"
].forEach((label) => contains(label, `Shopping List category "${label}" should be present.`));

[
  "All Items",
  "Need to Buy",
  "Already at Home",
  "Price Missing",
  "Optional"
].forEach((label) => contains(label, `Shopping List filter "${label}" should be present.`));

assert(app.includes("calculateCurrentMealPlanCosts()?.purchaseGroups") || app.includes("costResult?.purchaseGroups"), "Shopping List must use Step 6 purchase groups.");
assert(app.includes("derivePriceConfidence"), "Shopping List must use the Price Confidence system.");
assert(app.includes("pantryQuantityApplied"), "Shopping List must show Pantry allocation data.");
assert(app.includes("missingQuantity"), "Shopping List must keep missing quantities visible.");
assert(app.includes("packagesRequired"), "Shopping List must show suggested package counts.");
assert(app.includes("purchaseCostCents"), "Shopping List must use purchase costs from the cost engine.");
assert(app.includes("getShoppingPriceMeta"), "Shopping List must show the active price source and store profile.");
assert(app.includes("openGroceryPriceEditor"), "Shopping List must reuse the existing price editor.");
assert(app.includes("saveShoppingListOverride"), "Shopping List must preserve overrides in the existing Shopping List storage.");
assert(app.includes("getShoppingListItems()"), "Shopping List must preserve the existing Shopping List source of truth.");
assert(app.includes("guestSessionData.shoppingList"), "Guest Shopping List behavior must remain supported.");
assert(app.includes("writeUserStorage(\"chefNovaShoppingList\""), "Registered user Shopping List storage must remain supported.");
assert(app.includes("selectedPurchaseCostCents) ? escapeHtml(formatCostCents(item.purchase.selectedPurchaseCostCents)) : \"Price needed\""), "Missing prices must not be displayed as zero.");
assert(!app.includes("budgetShoppingList"), "Do not create a second Budget Shopping List.");
assert(!app.includes("emergencyShoppingList"), "Do not create a second emergency Shopping List.");

[
  ".shopping-list-summary",
  ".shopping-list-filters",
  ".shopping-filter-button",
  ".shopping-category-section",
  ".shopping-list-grid",
  ".shopping-quantity-control",
  ".shopping-price-summary",
  ".shopping-cost-warning",
  "@media print"
].forEach((selector) => assert(css.includes(selector), `${selector} styles should exist.`));

console.log("Shopping List budget upgrade static checks passed.");
