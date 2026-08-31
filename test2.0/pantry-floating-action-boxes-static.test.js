const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const displayPantryMatch = app.match(/function displayPantry\(\) \{[\s\S]*?const filter =/);
assert(displayPantryMatch, "displayPantry() should be present.");

const displayPantryBlock = displayPantryMatch[0];
assert(!displayPantryBlock.includes("Cook Before They Spoil"), "Pantry summary should not render the Cook Before They Spoil launcher.");
assert(!displayPantryBlock.includes("data-cook-before-spoils"), "Pantry summary should not render a Cook Before It Spoils action control.");
assert(!displayPantryBlock.includes("Record Discarded Food"), "Pantry summary should not render the Record Discarded Food launcher.");
assert(!displayPantryBlock.includes("data-record-discarded-food"), "Pantry summary should not render a discarded-food action control.");
assert(!displayPantryBlock.includes("wasteDiaryCount"), "Pantry summary should not keep unused Waste Diary launcher state.");

assert(html.includes('id="pantrySummary"'), "Pantry summary container should remain available.");
assert(html.includes('id="pantryList"'), "Pantry list container should remain available.");

assert(app.includes('data-record-discarded-food data-discard-source="${DISCARD_RECORDING_SOURCES.DASHBOARD_ACTION}"'), "Dashboard Waste Diary action should remain available.");
assert(app.includes('data-cook-before-spoils data-cook-source="${COOK_BEFORE_IT_SPOILS_SOURCES.DASHBOARD}"'), "Dashboard Cook Before It Spoils action should remain available.");
assert(app.includes("function openRecordDiscardedFoodWorkflow"), "Record Discarded Food workflow should remain available.");
assert(app.includes("function openCookBeforeItSpoils"), "Cook Before It Spoils workflow should remain available.");

console.log("Pantry floating action box static checks passed.");
