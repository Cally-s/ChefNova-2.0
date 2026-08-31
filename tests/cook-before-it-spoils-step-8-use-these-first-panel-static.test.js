const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");

function expect(source, snippet, message) {
  assert(source.includes(snippet), message || `Expected snippet: ${snippet}`);
}

expect(app, "USE_FIRST_PANEL_VERSION = 1", "Panel view model should be versioned.");
expect(app, "USE_FIRST_PANEL_SELECTION_VERSION = 1", "Panel selection model should be versioned.");
expect(app, "RESCUE_SOURCE_TYPES = Object.freeze", "Rescue source types should be controlled.");
expect(app, "PANTRY_ITEM: \"pantry-item\"", "Pantry source type should exist.");
expect(app, "PREPARED_LEFTOVER: \"prepared-leftover\"", "Prepared leftover source type should exist.");
expect(app, "USE_FIRST_PANEL_FILTERS = Object.freeze", "Panel filters should be controlled.");
["All", "Today", "Next 3 Days", "Leftovers", "Can Be Frozen", "Date Needs Confirmation"].forEach((label) => expect(app, label, `Missing filter label ${label}.`));
expect(app, "function deriveUseFirstPanelViewModel", "Shared panel view model should exist.");
expect(app, "function normalizeUseFirstPanelEntryFromPriority", "Normalized entry model should exist.");
expect(app, "getUseFirstPriorityModel().results", "Panel should consume Step 7 priority results.");
expect(app, "compareUseFirstPriorityResults", "Panel should preserve Step 7 deterministic ordering.");
assert(!/function renderUseFirstPanel[\s\S]{0,9000}urgencyScore/.test(app), "Panel rendering should not calculate priority scores.");
assert(!/function renderUseFirstPanel[\s\S]{0,9000}rescueRecipeScore\s*=/.test(app), "Panel rendering should not assign rescue scores.");

expect(app, "renderFoodSafetyNotice()}\n      ${groupedItemCards}", "Panel should render immediately after the permanent safety notice.");
expect(app, "getRescueSourceId(RESCUE_SOURCE_TYPES.PANTRY_ITEM", "Pantry source IDs should use normalized source IDs.");
expect(app, "getRescueSourceId(RESCUE_SOURCE_TYPES.PREPARED_LEFTOVER", "Leftover source IDs should use normalized source IDs.");
expect(app, "return `${prefix}:${String(id || \"\").trim()}`", "Normalized source ID format should avoid collisions.");

expect(app, "isDateSummaryToday", "Today filter helper should exist.");
expect(app, "isDateSummaryNextThreeDays", "Next 3 Days helper should exist.");
expect(app, "days >= 0 && days <= 2", "Next 3 Days should be inclusive of today, tomorrow, and the following day.");
expect(app, "isDateSummaryNeedsConfirmation", "Date Needs Confirmation helper should exist.");
expect(app, "filterMembership.add(USE_FIRST_PANEL_FILTERS.CAN_BE_FROZEN)", "Can Be Frozen membership should be derived.");
expect(app, "filter === USE_FIRST_PANEL_FILTERS.ALL ? allEntries.length", "All count should count unique entries.");
expect(app, "allEntries.filter((entry) => entry.filterMembership.includes(filter)).length", "Filter counts should use unique entries.");
expect(app, "entry.displayGroup === USE_FIRST_DISPLAY_GROUPS.NOT_ELIGIBLE || entry.filterMembership.includes(normalizedFilter)", "Hard exclusions should remain visible under filters.");

expect(app, "availableLabel: getUseFirstAvailableQuantityLabel", "Available quantity labels should be centralized.");
expect(app, "return \"Amount unknown\"", "Unknown quantities should display as unknown, not zero.");
expect(app, "reserved", "Reserved quantity should be shown separately.");
expect(app, "selectedRescueSourceIds", "Selection should store normalized source IDs.");
expect(app, "selectedAtBySourceId", "Selection should track selection timestamps.");
expect(app, "entry.selection.selectable", "Selection should use entry eligibility.");
expect(app, "foodSafety?.canUseForAutomaticPlanning === true", "Selection should require Food-Safety Guardrail eligibility.");
expect(app, "rescueRecipePriority?.score !== null", "Selection should require rescue recipe priority.");
expect(app, "entry.selection.selectable ? `<label", "Review/excluded items should not receive enabled checkboxes.");
expect(app, "validateUseFirstPanelSelection", "Selection should revalidate before recipe search.");
expect(app, "state.useFirstPanelDraft.selectedRescueSourceIds = (state.useFirstPanelDraft.selectedRescueSourceIds || []).filter", "Stale selections should be removed.");
expect(app, "openUseFirstPanelRecipeSearch", "Main recipe search action should exist.");
expect(app, "searchRecipes({ requireIngredients: false, notify: false })", "Recipe search should reuse the existing Recipe Finder.");
assert(!/openUseFirstPanelRecipeSearch[\s\S]{0,5000}saveMealPlan\(/.test(app), "Recipe search should not save or schedule meals.");
assert(!/openUseFirstPanelRecipeSearch[\s\S]{0,5000}savePantryToStorage\(/.test(app), "Recipe search should not mutate Pantry.");
const selectionBody = app.slice(app.indexOf("function updateUseFirstPanelSelection"), app.indexOf("function clearUseFirstPanelSelection"));
assert(!/appendFoodEvent|buildFoodEventForPantryCommand|executePantryCommand/.test(selectionBody), "Selection should not append Food Event History events.");

expect(app, "openUseFirstFreezeOptions", "Freeze Options action should exist.");
expect(app, "Freezing preserves eligible food but does not make excluded food eligible again.", "Freeze wording should be safe.");
assert(!/openUseFirstFreezeOptions[\s\S]{0,5000}MARKED_FROZEN/.test(app), "Freeze Options should not freeze automatically.");
expect(app, "editUseFirstPanelSource", "Edit action should reuse existing editors.");
expect(app, "navigate(\"pantry\")", "Pantry edit should reuse the Pantry page.");
expect(app, "openLeftoverPlanReview()", "Leftover edit should reuse the existing leftover review surface.");
expect(app, "initializeUseFirstPanelDraftForContext", "Entry context should initialize the panel draft.");
expect(app, "eligibleFocusIds", "Contextual preselection should be limited to eligible entries.");
expect(app, "state.useFirstPanelDraft.userScope !== currentScope", "Account switch should clear stale panel selection.");
expect(app, "guest", "Guest scope should remain temporary.");

expect(app, "<fieldset class=\"use-first-selection-panel\"", "Selection UI should use a fieldset.");
expect(app, "aria-pressed", "Filter buttons should expose active state.");
expect(app, "aria-label=\"Select", "Checkboxes should have specific labels.");
expect(app, "announcePolite(`${getUseFirstPanelFilterLabel", "Filter changes should announce results.");
expect(app, "announcePolite(`${entry.displayName}", "Selection changes should announce once.");

[".use-first-panel", ".use-first-panel-filters", ".use-first-filter-button", ".use-first-selection-panel", ".use-first-panel-card", "@media (max-width: 640px)", "@media (forced-colors: active)", "@media (prefers-reduced-motion: reduce)"].forEach((selector) => expect(css, selector, `Missing CSS selector ${selector}.`));

const doc = fs.readFileSync("docs/cook-before-it-spoils-use-these-first-panel.md", "utf8");
const report = fs.readFileSync("docs/cook-before-it-spoils-step-8-report.md", "utf8");
expect(doc, "# Chef Nova Use These First Panel", "Panel documentation should exist.");
expect(doc, "inclusive three-calendar-day window", "Panel docs should explain Next 3 Days semantics.");
expect(report, "# Cook Before It Spoils Step 8 Validation Report", "Step 8 report should exist.");
expect(report, "Second priority calculations created in the panel: 0", "Report should confirm no panel scoring duplicate.");

console.log("Cook Before It Spoils Step 8 Use These First panel static checks passed.");
