const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const styleCss = fs.readFileSync(path.join(root, "style.css"), "utf8");

function includes(source, text, message) {
  assert(source.includes(text), message || `Expected to find ${text}`);
}

includes(indexHtml, 'class="skip-link" href="#main-content"', "Skip link must target main content.");
includes(indexHtml, 'id="main-content"', "Main content target is required.");
includes(indexHtml, 'id="chef-nova-polite-status"', "Central polite live region is required.");
includes(indexHtml, 'id="chef-nova-urgent-status"', "Central assertive live region is required.");
includes(indexHtml, 'aria-live="polite"', "Polite live region must be announced politely.");
includes(indexHtml, 'aria-live="assertive"', "Urgent live region must be announced assertively.");

includes(appJs, "function announcePolite", "Polite announcement helper is required.");
includes(appJs, "function announceAssertive", "Assertive announcement helper is required.");
includes(appJs, "function announceStatus", "Shared status announcement helper is required.");
includes(appJs, "lastAnnouncements", "Announcements should be de-duplicated.");
includes(appJs, "function focusFirstInvalidField", "Invalid-field focus helper is required.");
includes(appJs, "function getAccessibleCurrencyText", "Accessible currency helper is required.");
includes(appJs, "function getAccessibleQuantityText", "Accessible quantity helper is required.");
includes(appJs, "function getAccessibleActionName", "Accessible action-name helper is required.");
includes(appJs, "function getAccessiblePlanStatusText", "Accessible plan status helper is required.");

includes(appJs, 'role="progressbar"', "Budget status progress must expose progressbar semantics.");
includes(appJs, 'aria-valuemax="100"', "Budget progressbar maximum must be capped at 100.");
includes(appJs, "aria-valuetext", "Budget progressbar must describe remaining budget or overage.");
includes(appJs, "showFinalBudgetProgress", "Budget progress must only render when final totals are available.");

includes(appJs, 'aria-label="${escapeHtml(`${label}, ${count} ${pluralize(count, "item")}`)}"', "Shopping filters need descriptive accessible labels.");
includes(appJs, "filter selected.", "Shopping filter changes should announce result counts.");
includes(appJs, "Update price for ${safeName}", "Shopping item price action must include the item name.");
includes(appJs, "Remove ${safeName}", "Shopping item remove action must include the item name.");
includes(appJs, "Mark ${safeName} as bought", "Shopping bought action must include the item name.");
includes(appJs, "Purchase quantity for ${safeName}", "Purchase quantity label must include the item name.");

includes(appJs, "data-edge-pantry-some-fields hidden", "Unknown Pantry quantity fields must start hidden.");
includes(appJs, "function updateUnknownPantryConditionalFields", "Unknown Pantry conditional field helper is required.");
includes(appJs, "I have enough for this plan", "Unknown Pantry radio label must be specific.");
includes(appJs, "data-edge-pantry-controls] input[type='radio']", "Unknown Pantry radio changes must be delegated.");

includes(appJs, "Update price for ${escapeHtml(itemName)}", "Price editor heading must name the ingredient.");
includes(appJs, "priceEditorLastFocus?.focus?.()", "Price editor must restore focus after close.");
includes(appJs, "announceAssertive(message", "Errors should be announced assertively.");

includes(styleCss, ".skip-link", "Skip link styles are required.");
includes(styleCss, ":focus-visible", "Visible keyboard focus styles are required.");
includes(styleCss, "min-height: 44px", "Touch target sizing is required.");
includes(styleCss, "overflow-x: hidden", "Mobile layout should guard against horizontal overflow.");
includes(styleCss, "@media (forced-colors: active)", "Forced-colors support is required.");
includes(styleCss, "@media (prefers-reduced-motion: reduce)", "Reduced-motion support is required.");
includes(styleCss, "@media print", "Print styles are required.");
includes(styleCss, ".edge-case-quantity-row[hidden]", "Hidden conditional quantity row must be removed from layout.");

["docs/budget-accessibility-and-mobile.md", "docs/budget-accessibility-report.md", "co-gpt/budget-rescue-step-22-accessibility-report.md"].forEach((relativePath) => {
  assert(fs.existsSync(path.join(root, relativePath)), `${relativePath} must exist.`);
});

console.log("budget accessibility and mobile static checks passed");
