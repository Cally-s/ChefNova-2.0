const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const doc = fs.readFileSync("docs/cook-before-it-spoils-accessible-priority-status.md", "utf8");

function includes(source, snippet, message) {
  assert(source.includes(snippet), message || `Expected snippet: ${snippet}`);
}

[
  "ACCESSIBLE_PRIORITY_PRESENTATION_VERSION = 1",
  "PRIORITY_ACCESSIBILITY_POLICY_VERSION = 1",
  "PRIORITY_ANNOUNCEMENT_VERSION = 1",
  "ACCESSIBLE_PRIORITY_LEVELS = Object.freeze",
  "VERY_HIGH: \"very-high\"",
  "HIGH: \"high\"",
  "MEDIUM: \"medium\"",
  "LOW: \"low\"",
  "NONE: \"none\"",
  "PRIORITY_PLANNING_STATES = Object.freeze",
  "UNPLANNED: \"unplanned\"",
  "FULLY_PLANNED: \"fully-planned\"",
  "PARTIALLY_PLANNED: \"partially-planned\"",
  "RESERVED_FOR_MEAL: \"reserved-for-meal\"",
  "RESERVATION_NEEDS_REVIEW: \"reservation-needs-review\"",
  "INFORMATION_NEEDS_REVIEW: \"information-needs-review\"",
  "SAFETY_EXCLUDED: \"safety-excluded\"",
  "RESOLVED: \"resolved\"",
  "PRIORITY_ACCESSIBILITY_CHANGE_TYPES = Object.freeze",
  "QUANTITY_CHANGED: \"quantity-changed\"",
  "PRIORITY_INCREASED: \"priority-increased\"",
  "FULLY_RESERVED: \"fully-reserved\"",
  "PARTIALLY_RESERVED: \"partially-reserved\"",
  "MARKED_FROZEN: \"marked-frozen\"",
  "CONFIRMED_USED: \"confirmed-used\""
].forEach((snippet) => includes(app, snippet));

[
  "Very high priority",
  "Action recommended today",
  "High priority",
  "Plan within 2 days",
  "Medium priority",
  "Plan within 3 to 5 days",
  "Low priority",
  "No immediate planning action is recommended",
  "permitColorOnlyStatus: false",
  "useCentralLiveRegion: true"
].forEach((snippet) => includes(app, snippet, `Missing priority policy text: ${snippet}`));

[
  "function resolveAccessiblePriorityPresentation",
  "accessiblePriorityPresentationVersion",
  "presentationId: `accessible-priority-presentation:",
  "userScopeId",
  "source: { sourceType",
  "priority: { level",
  "planningState: { status",
  "safety: { status",
  "quantity: { point",
  "dateInformation: { type",
  "visibleText",
  "accessibleText",
  "sourceRevisions",
  "calculatedAt"
].forEach((snippet) => includes(app, snippet, `Missing presentation model field: ${snippet}`));

[
  "function renderPriorityStatusComponent",
  "priority-status-component",
  "priority-status-text",
  "renderPriorityStatusComponent(presentation, { compact: true })",
  "renderPriorityStatusComponent(presentation)",
  "function renderPriorityDetailsDisclosure",
  "aria-expanded=\"false\"",
  "aria-controls=\"${detailsId}\"",
  "hidden>",
  "function togglePriorityDetailsDisclosure",
  "button.setAttribute(\"aria-expanded\"",
  "details.hidden = expanded"
].forEach((snippet) => includes(app, snippet, `Missing shared status/disclosure behavior: ${snippet}`));

[
  "function createPriorityAnnouncement",
  "priorityAnnouncementVersion",
  "deduplicationKey: `priority-announcement::",
  "function announcePriorityChange",
  "announceToLiveRegion(\"chef-nova-live-status\"",
  "function buildPriorityQuantityUpdateAnnouncement",
  "Pantry updated.",
  "of ${presentation.item?.displayName || \"this item\"} remain.",
  "Priority is now",
  "announcePriorityChange(buildPriorityQuantityUpdateAnnouncement"
].forEach((snippet) => includes(app, snippet, `Missing announcement behavior: ${snippet}`));

includes(html, 'id="chef-nova-live-status"', "Central priority live region should exist.");
includes(html, 'role="status"', "Live status should use role status.");
includes(html, 'aria-live="polite"', "Priority live region should be polite.");
includes(html, 'aria-atomic="true"', "Priority live region should be atomic.");
includes(html, 'class="visually-hidden"', "Priority live region should use visually-hidden class.");
includes(html, 'id="chef-nova-polite-status"', "Existing central polite live region should remain.");
includes(html, 'id="chef-nova-urgent-status"', "Existing urgent live region should remain.");

[
  ".visually-hidden",
  ".priority-status-component",
  ".priority-status-text",
  ".priority-timeframe",
  ".priority-status-details",
  ".priority-details-disclosure",
  ".priority-details-button",
  "@media (forced-colors: active)",
  ".priority-status-component .priority-status-text",
  "@media (prefers-reduced-motion: reduce)",
  ".priority-status-component,",
  "@media (max-width: 640px)",
  ".priority-status-text,",
  "@media print",
  ".priority-status-component,"
].forEach((snippet) => includes(css, snippet, `Missing accessible priority CSS: ${snippet}`));

assert(!/priority-status-component[\s\S]{0,250}tabindex=["']0/.test(app), "Static priority status components must not enter the tab order.");
assert(!/<span[^>]+aria-label=["'][^"']*(Very high|High priority|Medium priority|Low priority|Use Today)/i.test(app), "Generic spans must not carry the only full priority meaning.");
assert(!/Red priority|Yellow priority|Green priority|Red status|Warning color changed|Priority 1/.test(app), "Priority meaning must not use color or raw score wording.");
assert(!/priorityColor:\s*["']red["']/.test(app), "Exports must not rely on red priority color.");
assert(!/priorityScore:\s*[\w.]+/.test(app), "Exports must not expose raw priority score as the only meaning.");
assert(!/role=["']alert["'][\s\S]{0,160}Very high priority/i.test(app), "Normal priority updates must not use assertive alert wording.");

[
  "formatAccessiblePriorityQuantity",
  "Approximately ${spoken}",
  "The remaining quantity is not recorded",
  "getPrioritySpokenUnit",
  "gram",
  "kilogram",
  "millilitre",
  "litre",
  "serving",
  "package",
  "can"
].forEach((snippet) => includes(app, snippet, `Missing quantity or unit support: ${snippet}`));

[
  "if (result.foodSafety?.hardExclusion",
  "Not eligible for recipe planning",
  "The recorded expiration date has passed",
  "Information needs review",
  "The recorded date type needs confirmation",
  "Review storage information",
  "Already planned",
  "Partially planned",
  "still needs a plan",
  "No unreserved quantity currently needs another meal plan"
].forEach((snippet) => includes(app, snippet, `Missing safety/planning separation: ${snippet}`));

[
  "serializeAccessiblePriorityExport",
  "priorityLevel",
  "priorityLabel",
  "actionTimeframe",
  "planningState",
  "physicalQuantity",
  "reservedQuantity",
  "unreservedQuantity",
  "quantityConfidence",
  "dateType",
  "dateLabel",
  "safetyStatus"
].forEach((snippet) => includes(app, snippet, `Missing structured export support: ${snippet}`));

[
  "aria-pressed",
  "use-first-filter-button",
  "compareUseFirstPriorityResults",
  "getUseFirstPriorityModel().results",
  "renderUseFirstPanelGroup",
  "ol",
  "ul",
  "data-priority-details-toggle",
  "data-use-first-details",
  "Find Recipes",
  "Freeze Options",
  "Edit"
].forEach((snippet) => includes(app, snippet, `Missing semantic panel integration: ${snippet}`));

[
  "Priority Versus Safety",
  "Priority Versus Planning State",
  "Visible Text Requirement",
  "ARIA Label Guidance",
  "Priority Presentation Model",
  "Shared Priority Status Component",
  "Quantity Confidence",
  "Precise Date Language",
  "Live Regions",
  "Announcement Batching",
  "Initial Page Load",
  "High Contrast and Forced Colors",
  "Mobile Layout",
  "Reduced Motion",
  "Print and Export",
  "Localization",
  "Stale and Multi-Tab Protection",
  "User Isolation",
  "Deferred Work"
].forEach((snippet) => includes(doc, snippet, `Documentation missing ${snippet}`));

[
  "accessiblePriorityEngine",
  "screenReaderPriorityCalculator",
  "mobilePriorityDatabase",
  "priorityAnnouncementInventory",
  "priorityStatusCopy",
  "secondLiveRegionSystem"
].forEach((forbidden) => {
  assert.strictEqual(app.includes(forbidden), false, `${forbidden} must not exist in app.js`);
});

console.log("Cook Before It Spoils Step 44 accessible priority status static checks passed.");
