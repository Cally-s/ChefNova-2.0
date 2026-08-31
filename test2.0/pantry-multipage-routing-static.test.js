const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function functionBody(name) {
  const marker = `function ${name}(`;
  const start = app.indexOf(marker);
  assert(start >= 0, `${name} should exist.`);
  const braceStart = app.indexOf("{", start);
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

assert(app.includes("const PANTRY_SECTIONS"), "Pantry section definitions should be centralized.");
["pantry/items", "pantry/add", "pantry/use-soon", "pantry/freezer", "pantry/waste-diary"].forEach((route) => {
  assert(app.includes(route), `${route} should be a real Pantry route.`);
});

const navigate = functionBody("navigate");
assert(navigate.includes("updatePantryRouteState"), "Router should parse Pantry subroutes.");
assert(navigate.includes("buildPantryHash"), "Router should preserve Pantry subroute hashes.");
assert(navigate.includes('if (page === "pantry") displayPantry()'), "Navigating to Pantry routes should render Pantry content.");
assert(navigate.includes('$("#pantryPageTitle")?.focus'), "Pantry route changes should move focus to the page heading.");

const overview = functionBody("renderPantryOverview");
assert(overview.includes("pantry-section-grid"), "Overview should render feature navigation cards.");
assert(overview.includes("pantry/items") && overview.includes("pantry/add") && overview.includes("pantry/use-soon"), "Overview should link to detailed Pantry pages.");
assert(overview.includes("impact/food-rescue"), "Food Rescue should link to the existing Impact route.");
assert(!overview.includes("renderWasteDiaryView"), "Overview must not render Waste Diary details.");
assert(!overview.includes("renderFreezerInventoryView"), "Overview must not render Freezer details.");
assert(!overview.includes("renderPantryInventoryCards"), "Overview must not render the full inventory.");

const display = functionBody("displayPantry");
assert(display.includes('section === "overview"'), "Display should branch for the overview page.");
assert(display.includes('section === "add"'), "Display should branch for Add Pantry Item.");
assert(display.includes('section === "use-soon"'), "Display should branch for Use Soon.");
assert(display.includes('section === "freezer"'), "Display should branch for Freezer Inventory.");
assert(display.includes('section === "waste-diary"'), "Display should branch for Waste Diary.");
assert(display.includes('section === "not-found"'), "Unknown Pantry routes should fail gracefully.");
assert(display.indexOf('section === "overview"') < display.indexOf("renderWasteDiaryView"), "Overview branch should return before detailed sections render.");
assert(display.includes("renderPantryInventoryCards(filteredPantry)"), "Inventory should still render Pantry cards on its own route.");
assert(display.includes("renderUseFirstPanel(getUseFirstPriorityModel())"), "Use Soon should reuse current priority logic.");
assert(display.includes("renderFreezerInventoryView()"), "Freezer route should reuse current freezer logic.");
assert(display.includes("renderWasteDiaryView()"), "Waste Diary route should reuse current diary logic.");

const filter = functionBody("setPantryFilter");
assert(filter.includes("buildPantryHash(\"items\""), "Inventory filter state should be reflected in the route.");

assert(html.includes('id="pantryPageTitle"'), "Pantry page should expose a focusable page heading.");
assert(html.includes('id="pantrySuggestionsSection"'), "Recipe suggestions should be route-controlled.");
assert(html.includes('id="pantryForm" hidden'), "Add Pantry form should not appear on the Overview by default.");

assert(cssBlock(".pantry-section-tabs").includes("flex-wrap: wrap"), "Pantry section navigation should wrap on small screens.");
assert(cssBlock(".pantry-section-grid").includes("repeat(3"), "Overview cards should use a desktop grid.");
assert(css.includes("@media (max-width: 900px)") && css.includes(".pantry-section-grid"), "Overview cards should reflow on tablet.");
assert(css.includes("@media (max-width: 640px)") && css.includes(".pantry-overview-stats"), "Overview should stack cleanly on mobile.");

console.log("Pantry multipage routing static checks passed.");
