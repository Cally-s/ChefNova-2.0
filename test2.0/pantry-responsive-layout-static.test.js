const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function blockFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{[\\s\\S]*?\\}`));
  assert(match, `${selector} block should exist.`);
  return match[0];
}

const pantryPageBlock = blockFor("#pantry-page");
assert(pantryPageBlock.includes("max-width: none"), "Pantry page should not be constrained to a narrow width.");

const pantryListBlock = blockFor("#pantry-page #pantryList");
assert(pantryListBlock.includes("grid-template-columns: 1fr"), "Mixed Pantry page sections should stack instead of sharing cramped grid rows.");

assert(css.includes("#pantry-page .pantry-inventory-grid"), "Pantry inventory grid rule should exist.");
assert(css.includes("grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));"), "Pantry inventory cards should keep a readable responsive minimum width.");

const pantryFilterBlock = blockFor(".pantry-filter-bar .button");
assert(pantryFilterBlock.includes("height: auto"), "Pantry filter tabs should use automatic height.");
assert(pantryFilterBlock.includes("min-height: 42px"), "Pantry filter tabs should keep a normal touch target.");
assert(!pantryFilterBlock.includes("height: 100%"), "Pantry filter tabs must not stretch to panel height.");

assert(css.includes("#pantry-page h1,\n#pantry-page h2,\n#pantry-page h3"), "Pantry text wrapping block should cover headings.");
assert(css.includes("word-break: normal"), "Ordinary Pantry text should not break words apart.");
assert(css.includes("white-space: normal"), "Ordinary Pantry text should wrap naturally.");

const wastePanelBlock = blockFor(".waste-dashboard-panel");
assert(wastePanelBlock.includes("container-type: inline-size"), "Waste Summary should respond to its component width.");

const wasteGridBlock = blockFor(".waste-dashboard-grid");
assert(wasteGridBlock.includes("auto-fit"), "Waste Summary cards should not be locked to a hard column count.");
assert(!wasteGridBlock.includes("repeat(5"), "Waste Summary cards must never be forced into five unreadable columns.");

const impactGridBlock = blockFor(".impact-audit-grid");
assert(impactGridBlock.includes("auto-fit"), "Impact cards should use responsive auto-fit columns.");
assert(!impactGridBlock.includes("repeat(5"), "Impact cards must not be forced into five unreadable columns.");

const impactLedgerBlock = blockFor(".impact-ledger-summary");
assert(impactLedgerBlock.includes("auto-fit"), "Impact ledger summary should use responsive auto-fit columns.");
assert(!impactLedgerBlock.includes("repeat(5"), "Impact ledger cards must not be forced into five unreadable columns.");

assert(css.includes(".leftover-source-summary-grid,\n.leftover-transformation-metrics"), "Leftover summary grid block should exist.");
assert(css.includes("grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));"), "Leftover summary grids should use responsive columns.");

assert(app.includes('function renderPantryInventoryCards(filteredPantry)') && app.includes('return filteredPantry.length ? `<div class="pantry-inventory-grid">'), "Pantry cards should be wrapped in a dedicated inventory grid.");
assert(!app.match(/function displayPantry\(\) \{[\s\S]*?Cook Before They Spoil[\s\S]*?const filter =/), "Removed Pantry floating action launcher should not return.");

console.log("Pantry responsive layout static checks passed.");
