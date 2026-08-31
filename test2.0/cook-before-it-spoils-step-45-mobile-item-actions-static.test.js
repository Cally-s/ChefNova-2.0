const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const report = fs.readFileSync("docs/cook-before-it-spoils-step-45-report.md", "utf8");

function includes(source, snippet, message) {
  assert(source.includes(snippet), message || `Missing snippet: ${snippet}`);
}

[
  "const FOOD_ITEM_ACTION_IDS = Object.freeze",
  "PLAN: \"plan\"",
  "VIEW_PLAN: \"view-plan\"",
  "FREEZE: \"freeze\"",
  "REVIEW_DETAILS: \"review-details\"",
  "REVIEW_INFORMATION: \"review-information\"",
  "EDIT_QUANTITY: \"edit-quantity\"",
  "CHANGE_DATE: \"change-date\"",
  "MARK_USED: \"mark-used\"",
  "RECORD_DISCARDED: \"record-discarded\"",
  "MOVE_STORAGE: \"move-storage\"",
  "DISMISS_REMINDER: \"dismiss-reminder\"",
  "MORE: \"more\"",
  "const FOOD_ITEM_ACTION_AVAILABILITY = Object.freeze",
  "BLOCKED_BY_SAFETY: \"blocked-by-safety\"",
  "BLOCKED_BY_RESERVATION: \"blocked-by-reservation\"",
  "BLOCKED_BY_QUANTITY: \"blocked-by-quantity\""
].forEach((snippet) => includes(app, snippet, `Missing controlled action model snippet: ${snippet}`));

[
  "function resolveFoodItemActionPresentation",
  "function renderFoodItemActionGroup",
  "function renderFoodItemActionButton",
  "function openFoodItemMoreActions",
  "function handleFoodItemActionButton",
  "primaryActions: primaryActions.slice(0, 3)",
  "data-food-item-action",
  "aria-haspopup=\"dialog\"",
  "aria-expanded=\"false\"",
  "aria-controls=\"useFirstPriorityModal\"",
  "role=\"group\" aria-label=\"Actions for",
  "More actions for",
  "Opening an action does not change Pantry quantities, reservations, food events, or impact records",
  "Item Details",
  "Item Outcome",
  "Reminder"
].forEach((snippet) => includes(app, snippet, `Missing presentation or accessible action snippet: ${snippet}`));

const panelEntryMatch = app.match(/function renderUseFirstPanelEntry\(entry, index = 0\) \{[\s\S]*?\n  function renderUseFirstPanelGroup/);
assert(panelEntryMatch, "Could not locate renderUseFirstPanelEntry block.");
const panelEntry = panelEntryMatch[0];
includes(panelEntry, "resolveFoodItemActionPresentation(entry)", "Panel entries should use the shared action presentation model.");
includes(panelEntry, "renderFoodItemActionGroup(actionPresentation)", "Panel entries should render the shared action group.");
assert(!/data-use-first-panel-search|data-use-first-panel-freeze|data-use-first-panel-edit|data-use-first-details/.test(panelEntry), "Panel entries should not expose old extra direct actions beside Plan, Freeze, and More.");

const rankedCardMatch = app.match(/function renderUseFirstPriorityCard\(result, index = 0\) \{[\s\S]*?\n  function renderUseFirstPriorityGroup/);
assert(rankedCardMatch, "Could not locate renderUseFirstPriorityCard block.");
const rankedCard = rankedCardMatch[0];
includes(rankedCard, "resolveFoodItemActionPresentation", "Ranked cards should use the shared action presentation model.");
includes(rankedCard, "renderFoodItemActionGroup(actionPresentation)", "Ranked cards should render the shared action group.");
assert(!/data-use-first-find-recipes|Review Storage Conditions|View Priority Details/.test(rankedCard), "Ranked cards should not expose old extra direct action controls.");

[
  ".food-item-action-group",
  "grid-template-columns: repeat(3, minmax(0, 1fr))",
  "min-height: 44px",
  "min-width: 44px",
  ".food-item-more-action-list .button",
  "max-height: calc(100dvh - 24px)",
  "env(safe-area-inset-bottom)",
  ".food-item-action-group .food-item-action-button:last-child:nth-child(odd)"
].forEach((snippet) => includes(css, snippet, `Missing mobile action CSS snippet: ${snippet}`));

assert(!/mobilePantryActions|mobileFoodInventory|quickActionPantry|mobileWasteDiary|mobileFreezeWorkflow|mobileMealPlanner|dragDropActionStore|secondaryActionDatabase/.test(app), "Step 45 must not create a competing mobile-only action system.");
assert(!/Use Anyway|Freeze Anyway|Ignore Warning|Delete Food|Throw Away|Trash Item/.test(app), "Step 45 should avoid unsafe or judgmental action labels.");
assert(!/FOOD_ITEM_ACTION_IDS[\s\S]{0,10000}recordImpact|FOOD_ITEM_ACTION_IDS[\s\S]{0,10000}buildImpactLedger/.test(app), "Action presentation must not create impact-ledger records.");

[
  "Visible primary actions are capped at three",
  "More panel uses the existing modal shell",
  "No separate mobile action system was created",
  "Plan, Freeze, and More do not create physical outcomes by opening"
].forEach((snippet) => includes(report, snippet, `Missing report confirmation: ${snippet}`));

console.log("Cook Before It Spoils Step 45 mobile item actions static checks passed.");
