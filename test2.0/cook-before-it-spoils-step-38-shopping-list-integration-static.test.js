const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-shopping-list-integration.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-38-report.md"), "utf8");

function bodyOf(functionName) {
  const start = app.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} must exist`);
  const next = app.indexOf("\n  function ", start + 12);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "SHOPPING_LIST_NEED_RESOLUTION_VERSION",
  "SHOPPING_LIST_SUPPLY_STATUS_VERSION",
  "SHOPPING_LIST_LINE_PROVENANCE_VERSION",
  "DUPLICATE_PURCHASE_ADVISORY_VERSION",
  "SHOPPING_LIST_LINE_ORIGINS",
  "SHOPPING_LIST_SUPPLY_STATUSES"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} must be defined`));

[
  "getShoppingListSourceRevisions",
  "getShoppingAllocationRowsByIngredient",
  "aggregateShoppingPantrySupply",
  "getShoppingSupplyStatus",
  "createShoppingListNeedResolution",
  "createShoppingDuplicatePurchaseAdvisory",
  "deriveCoveredShoppingNeedResolutions",
  "deriveShoppingSupplySections",
  "renderShoppingSupplySections",
  "renderShoppingDoNotBuySection",
  "renderShoppingBuyMissingSection",
  "renderShoppingCheckBeforeBuyingSection",
  "renderDuplicatePurchaseAdvisories",
  "keepDuplicateShoppingPackage",
  "removeDuplicateShoppingPackage",
  "reviewShoppingPantryItem"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} must exist`));

[
  "plan-required",
  "user-manual",
  "user-kept-extra",
  "optional-recipe-item",
  "substitution",
  "emergency-plan",
  "imported",
  "fully-covered-at-home",
  "partially-covered-at-home",
  "reserved-for-this-plan",
  "reserved-for-other-commitment",
  "purchase-required",
  "optional-purchase",
  "quantity-review-required"
].forEach((value) => assert(app.includes(value), `${value} must be represented in the Shopping List model`));

const resolver = bodyOf("createShoppingListNeedResolution");
[
  "shoppingListNeedResolutionVersion",
  "ingredientDemandId",
  "canonicalIngredientId",
  "demand",
  "pantrySupply",
  "missingDemand",
  "purchaseResolution",
  "supplyStatus",
  "sourceRevisions"
].forEach((field) => assert(resolver.includes(field), `Need resolution must include ${field}`));
assert(resolver.includes("aggregateShoppingPantrySupply"), "Need resolution must reuse Pantry allocation evidence.");
assert(resolver.includes("getShoppingSupplyStatus"), "Need resolution must derive one shared supply status.");

const model = bodyOf("deriveShoppingListViewModel");
assert(model.includes("getShoppingAllocationRowsByIngredient"), "Shopping List must reuse Pantry-first allocation rows.");
assert(model.includes("deriveCoveredShoppingNeedResolutions"), "Shopping List must derive fully covered Pantry items.");
assert(model.includes("deriveShoppingSupplySections"), "Shopping List must expose derived Pantry guidance sections.");
assert(model.includes("duplicatePurchaseAdvisories"), "Shopping List must expose duplicate purchase advisories.");

const itemModel = bodyOf("createShoppingListItemModel");
[
  "lineProvenanceVersion",
  "shoppingListSupplyStatusVersion",
  "origin",
  "supplyStatus",
  "needResolution",
  "planRequiredPurchaseQuantity",
  "userRequestedExtraQuantity",
  "doNotBuy",
  "buyMissingAmount",
  "checkBeforeBuying"
].forEach((field) => assert(itemModel.includes(field), `Shopping line model must include ${field}`));

const customModel = bodyOf("createCustomShoppingItemModel");
assert(customModel.includes("createShoppingDuplicatePurchaseAdvisory"), "Manual Shopping List lines must receive duplicate purchase advisories.");
assert(customModel.includes("USER_KEPT_EXTRA"), "Manual extras must remain distinct from plan-required purchases.");

const advisory = bodyOf("createShoppingDuplicatePurchaseAdvisory");
[
  "duplicatePurchaseAdvisoryVersion",
  "Adding another package may increase the chance of food remaining unused.",
  "keep-new-package",
  "remove-from-shopping-list",
  "review-pantry-item",
  "sourceRevisions"
].forEach((text) => assert(advisory.includes(text), `Duplicate advisory must include ${text}`));

const atHome = bodyOf("markShoppingItemAlreadyAtHome");
[
  "userConfirmedAtHome",
  "sourceRevisions",
  "Pantry was not changed"
].forEach((text) => assert(atHome.includes(text), `Mark-at-home action must include ${text}`));
[
  "executePantryCommand",
  "FOOD_EVENT_TYPES.ITEM_ADDED",
  "buildFoodEventForPantryCommand",
  "appendFoodEventsToHistory",
  "createImpactLedgerPosting",
  "confirmPackageRemainderForPantry"
].forEach((forbidden) => assert(!atHome.includes(forbidden), `Mark-at-home must not call ${forbidden}`));

[
  "keepDuplicateShoppingPackage",
  "removeDuplicateShoppingPackage",
  "reviewShoppingPantryItem",
  "renderShoppingSupplySections",
  "renderShoppingDoNotBuySection",
  "renderShoppingBuyMissingSection",
  "renderShoppingCheckBeforeBuyingSection",
  "renderDuplicatePurchaseAdvisories"
].forEach((functionName) => {
  const source = bodyOf(functionName);
  [
    "executePantryCommand",
    "appendFoodEventsToHistory",
    "createImpactLedgerPosting",
    "createFoodRescueLedgerCredit",
    "confirmPackageRemainderForPantry"
  ].forEach((forbidden) => assert(!source.includes(forbidden), `${functionName} must not call ${forbidden}`));
});

[
  "Do Not Buy — Already Available",
  "Use What You Have — Buy Only the Missing Amount",
  "Check Before Buying",
  "Duplicate-Purchase Warnings",
  "Keep New Package",
  "Remove from Shopping List",
  "Review Pantry Item",
  "Advisory only",
  "Checkout cost still uses full compatible package prices",
  "Chef Nova does not treat unknown quantities as zero or sufficient"
].forEach((text) => assert(app.includes(text), `${text} must be rendered`));

[
  ".shopping-supply-sections",
  ".shopping-derived-section",
  ".shopping-derived-grid",
  ".shopping-supply-card",
  ".shopping-supply-actions",
  ".shopping-duplicate-advisory",
  ".shopping-duplicate-inline"
].forEach((selector) => assert(css.includes(selector), `${selector} styles must exist`));

[
  "shoppingListRescueCopy",
  "doNotBuyDatabase",
  "rescueGroceryList",
  "pantryShoppingList",
  "alreadyAvailableInventory",
  "duplicatePurchaseInventory",
  "foodRescueShoppingList"
].forEach((forbidden) => assert(!app.includes(forbidden), `${forbidden} must not be introduced`));

[
  "# Cook Before It Spoils Shopping List Integration",
  "Shopping List Pantry-Allocation Resolver",
  "Ingredient-Demand Resolver",
  "Supply-Status Model",
  "Line-Provenance Model",
  "Do Not Buy Derived Section",
  "Buy Only Missing Amount",
  "Check Before Buying",
  "Duplicate-Purchase Advisory",
  "Planning-Only Boundary",
  "No Duplicate Systems"
].forEach((phrase) => assert(doc.includes(phrase), `Integration doc must include ${phrase}`));

[
  "Second Shopping List created: 0",
  "Second Pantry created: 0",
  "Second Recipe Database created: 0",
  "Do Not Buy lines added as purchase items: 0",
  "Zero-cost purchase lines added: 0",
  "Planning actions posted Food Event History entries: 0",
  "Planning actions posted Impact Ledger entries: 0",
  "Planning actions deducted Pantry quantity: 0",
  "Unknown Pantry quantities treated as sufficient: 0",
  "Duplicate warnings blocking user choice: 0"
].forEach((phrase) => assert(report.includes(phrase), `Step 38 report must include ${phrase}`));

console.log("Cook Before It Spoils Step 38 Shopping List integration static checks passed.");
