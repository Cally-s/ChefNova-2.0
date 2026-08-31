const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
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

[
  "normalizeInternalRoute",
  "getInternalRoutePath",
  "getRouteNavigationMetadata",
  "getCurrentRouteNavigationLevel",
  "currentRouteIsSubpage",
  "currentRouteAllowsReturnButton",
  "isSafeInternalReturnRoute",
  "isMeaningfulInternalRoute",
  "getCurrentInternalRoute",
  "readInternalNavigationHistory",
  "writeInternalNavigationHistory",
  "createInternalNavigationEntry",
  "updateCurrentInternalNavigationSnapshot",
  "recordInternalNavigation",
  "syncInternalNavigationAfterPop",
  "getPreviousInternalNavigationEntry",
  "hasUnsavedReturnDraft",
  "confirmReturnWithUnsavedDraft",
  "returnToPreviousInternalPage",
  "renderReturnButton",
  "updateReturnNavigation"
].forEach((name) => functionBody(name));

assert(app.includes('const INTERNAL_NAVIGATION_HISTORY_KEY = "chefNovaInternalNavigationHistory"'), "Return history should use per-tab sessionStorage metadata.");
assert(app.includes("ROUTE_NAVIGATION_LEVELS"), "Return visibility should use centralized route levels.");
assert(app.includes("ROUTE_NAVIGATION_METADATA"), "Return visibility should use centralized route metadata.");
assert(app.includes('notifications: { level: ROUTE_NAVIGATION_LEVELS.SUBPAGE, showReturnButton: false }'), "Notifications should stay a subpage while opting out of the shared Return button.");

[
  "home",
  "recipes",
  "pantry",
  "planner",
  "nutrition-tracker",
  "shopping-list",
  "weekly-nutrition",
  "impact",
  "learn",
  "guide"
].forEach((route) => {
  assert(app.includes(`${route}: { level: ROUTE_NAVIGATION_LEVELS.MAIN }`) || app.includes(`"${route}": { level: ROUTE_NAVIGATION_LEVELS.MAIN }`), `${route} should be classified as a main page.`);
});

[
  "pantry/items",
  "pantry/add",
  "pantry/use-soon",
  "pantry/freezer",
  "pantry/waste-diary",
  "weekly-nutrition/daily",
  "weekly-nutrition/macros",
  "weekly-nutrition/meals",
  "weekly-nutrition/goals",
  "weekly-nutrition/insights",
  "nutrition-tracker/meals",
  "nutrition-tracker/summary",
  "nutrition-tracker/nutrients",
  "nutrition-tracker/goals",
  "nutrition-tracker/trends",
  "impact/food-rescue",
  "impact/waste-diary",
  "impact/savings",
  "impact/food-protected",
  "impact/trends"
].forEach((route) => {
  assert(app.includes(`"${route}": { level: ROUTE_NAVIGATION_LEVELS.SUBPAGE }`), `${route} should be classified as a subpage.`);
});

const routePath = functionBody("getInternalRoutePath");
assert(routePath.includes(".split(\"?\")[0]"), "Main/subpage classification should ignore query parameters.");

const routeMetadata = functionBody("getRouteNavigationMetadata");
assert(routeMetadata.includes("ROUTE_NAVIGATION_METADATA[path]"), "Route classification should prefer explicit metadata.");
assert(routeMetadata.includes("knownSubpagePrefixes"), "Parameterized or nested feature routes should have a validated fallback.");

const routeLevel = functionBody("currentRouteIsSubpage");
assert(routeLevel.includes("ROUTE_NAVIGATION_LEVELS.SUBPAGE"), "Return visibility should require the current route to be a subpage.");

const returnPermission = functionBody("currentRouteAllowsReturnButton");
assert(returnPermission.includes("getRouteNavigationMetadata(getCurrentInternalRoute())"), "Return opt-outs should be read from current route metadata.");
assert(returnPermission.includes("showReturnButton !== false"), "Routes should render Return unless metadata explicitly disables it.");

const safety = functionBody("isSafeInternalReturnRoute");
assert(safety.includes("startsWith(\"//\")"), "External protocol-relative return targets should be rejected.");
assert(safety.includes("/^[a-z][a-z0-9+.-]*:/i"), "External protocols should be rejected.");
assert(safety.includes("data-page-section"), "Return targets should be limited to known Chef Nova pages.");

const meaningful = functionBody("isMeaningfulInternalRoute");
assert(meaningful.includes("getRouteNavigationMetadata(normalized).level !== ROUTE_NAVIGATION_LEVELS.TECHNICAL"), "Technical routes should be skipped through route metadata.");

const readHistory = functionBody("readInternalNavigationHistory");
assert(readHistory.includes("sessionStorage.getItem(INTERNAL_NAVIGATION_HISTORY_KEY)"), "History should be read from sessionStorage.");
assert(readHistory.includes("isMeaningfulInternalRoute"), "Stored entries should be filtered to meaningful internal routes.");

const writeHistory = functionBody("writeInternalNavigationHistory");
assert(writeHistory.includes("sessionStorage.setItem(INTERNAL_NAVIGATION_HISTORY_KEY"), "History should be saved to sessionStorage.");
assert(writeHistory.includes(".slice(-50)"), "History should be bounded.");

const entry = functionBody("createInternalNavigationEntry");
assert(entry.includes("route: normalizeInternalRoute(route)"), "History entries should store only route metadata.");
assert(entry.includes("scrollX") && entry.includes("scrollY"), "History entries should preserve scroll coordinates.");
assert(entry.includes("focusedElementKey"), "History entries should preserve a focus key only.");
assert(!entry.includes("pantry") && !entry.includes("allerg"), "History entries must not store user content.");

const recorder = functionBody("recordInternalNavigation");
assert(recorder.includes('navigationType === "replace"'), "Same-page state changes should be replaceable.");
assert(recorder.includes("last?.route === normalized"), "Consecutive duplicate routes should be ignored.");

const popSync = functionBody("syncInternalNavigationAfterPop");
assert(popSync.includes("lastIndexOf(normalized)"), "Browser Back should truncate the internal stack to the popped route.");
assert(popSync.includes('navigationType: "pop"'), "POP navigation should be recorded as pop metadata.");

const previous = functionBody("getPreviousInternalNavigationEntry");
assert(previous.includes("entries.length - 2"), "Return should target the actual previous internal entry.");
assert(previous.includes("entries[index].route !== currentRoute"), "Duplicate current routes should be skipped.");

const draftGuard = functionBody("confirmReturnWithUnsavedDraft");
assert(draftGuard.includes("hasUnsavedReturnDraft()"), "Return should check for unsaved drafts before leaving.");
assert(draftGuard.includes("window.confirm"), "Unsaved drafts should require user confirmation before Return leaves the page.");

const action = functionBody("returnToPreviousInternalPage");
assert(action.includes("history.back()"), "Return must use a real browser history POP.");
assert(!action.includes("navigate("), "Return must not navigate to a fixed fallback route.");
assert(action.includes("confirmReturnWithUnsavedDraft()"), "Return should not silently discard obvious unsaved drafts.");

const renderer = functionBody("renderReturnButton");
assert(renderer.includes("getPreviousInternalNavigationEntry()"), "Return should be visible only when internal history exists.");
assert(renderer.includes("currentRouteIsSubpage()"), "Return should be hidden on primary navigation pages even when history exists.");
assert(renderer.includes("currentRouteAllowsReturnButton()"), "Return should respect route-level opt-outs such as Notifications.");
assert(renderer.includes("data-return-button"), "Return button should use one shared action.");
assert(renderer.includes("<span>Return</span>"), "Visible label should be Return.");
assert(!renderer.includes("Back to Home") && !renderer.includes("Back to Pantry"), "Visible fixed destination labels should not be rendered.");
assert(renderer.includes("aria-label=\"Return to the previous page\""), "Accessible name should describe history return.");

const updater = functionBody("updateReturnNavigation");
assert(updater.includes("$$(\"[data-return-navigation]\").forEach((item) => item.remove())"), "Existing return controls should be removed before rendering a new one.");
assert(!updater.includes('pageSection === "home"'), "Home should not be excluded by route type; visibility depends on history.");

const navigate = functionBody("navigate");
assert(navigate.includes("recordInternalNavigation(nextHash, \"push\")"), "Normal navigation should push internal history.");
assert(navigate.includes("syncInternalNavigationAfterPop(nextHash)"), "Browser Back should sync internal history.");
assert(navigate.includes("updateCurrentInternalNavigationSnapshot()"), "Outgoing routes should store scroll and focus metadata.");
assert(navigate.includes("restoredEntry") && navigate.includes("window.scrollTo(restoredEntry.scrollX"), "POP navigation should restore scroll.");

const clickRegion = app.slice(app.indexOf("const returnButton = event.target.closest(\"[data-return-button]\")"), app.indexOf("const pageTarget = event.target.closest(\"[data-page]\")"));
assert(clickRegion.includes("returnToPreviousInternalPage()"), "Return button clicks should be handled before normal route links.");

const pantryFilter = functionBody("setPantryFilter");
assert(pantryFilter.includes("history.replaceState"), "Same-page Pantry filter changes should not create Return history stops.");
assert(pantryFilter.includes("recordInternalNavigation(nextHash, \"replace\")"), "Same-page filter route metadata should replace the current entry.");

const buttonCss = cssBlock(".return-page-button");
assert(buttonCss.includes("min-height: 44px"), "Return button should have a touch-friendly height.");
assert(buttonCss.includes("white-space: normal"), "Return button labels should wrap instead of clipping.");
assert(buttonCss.includes("width: fit-content"), "Return button should not stretch across every header.");
assert(css.includes('[dir="rtl"] .return-page-button__arrow'), "RTL layouts should mirror the directional arrow.");

console.log("History-based Return navigation static checks passed.");
