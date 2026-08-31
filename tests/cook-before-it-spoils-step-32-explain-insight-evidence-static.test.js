const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-explain-insight-evidence.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-32-report.md"), "utf8");

function bodyOf(functionName) {
  const start = app.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} must exist`);
  const next = app.indexOf("\n  function ", start + 12);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "PATTERN_EVIDENCE_BUNDLE_VERSION",
  "ACTION_EVIDENCE_BUNDLE_VERSION",
  "EVIDENCE_ITEM_PRESENTATION_VERSION",
  "EVIDENCE_REVIEW_SESSION_VERSION",
  "EVIDENCE_ITEM_STATUSES"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} must be defined`));

[
  "EFFECTIVE",
  "CORRECTED",
  "REVERSED",
  "EXCLUDED_INTENTIONAL",
  "EXCLUDED_UNRELATED",
  "SUPERSEDED",
  "MISSING",
  "STALE"
].forEach((status) => assert(app.includes(status), `Evidence status ${status} must exist`));

[
  "buildPatternEvidenceBundle",
  "buildActionEvidenceBundle",
  "createEvidenceItemFromIncident",
  "renderPatternEvidenceDisclosure",
  "renderActionEvidenceDisclosure",
  "isWastePatternDiaryBacked",
  "renderPatternEvidenceReviewButton",
  "markWastePatternIncidentUnrelated",
  "markWastePatternIncidentIntentional",
  "clearWasteDiaryEvidenceFilter"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} must be implemented`));

assert(app.includes("qualifyingIncidentReferences: active.map((incident) => structuredCloneSafe(incident))"), "Pattern result must carry exact structured incident references");
assert(app.includes("rootEventIds: active.map((incident) => incident.rootEventId)"), "Pattern result must carry exact root event IDs");

const filterBody = bodyOf("filterWasteDiaryByPattern");
assert(filterBody.includes("evidenceRootEventIds: result.evidence.rootEventIds"), "Review Diary Entries must filter by exact root event IDs");
assert(!filterBody.includes("foodName") && !filterBody.includes("normalizeWhitespace(search)"), "Review Diary Entries must not rebuild evidence by name search");

const filteredEntriesBody = bodyOf("getFilteredWasteDiaryEntries");
assert(filteredEntriesBody.includes("exactRootIds") && filteredEntriesBody.includes("has(rootId)"), "Waste Diary exact evidence filter must use root IDs");

const patternDisclosure = bodyOf("renderPatternEvidenceDisclosure");
assert(patternDisclosure.includes("<details") && patternDisclosure.includes("Why am I seeing this?"), "Pattern cards must include a native Why am I seeing this disclosure");
assert(patternDisclosure.includes("Evidence Behind This Possible Pattern"), "Pattern disclosure must have a visible evidence heading");
assert(patternDisclosure.includes("Minimum required") && patternDisclosure.includes("Current evidence") && patternDisclosure.includes("Time window") && patternDisclosure.includes("Confidence") && patternDisclosure.includes("Identity basis"), "Pattern disclosure must explain threshold, current evidence, window, confidence, and identity");
assert(patternDisclosure.includes("renderPatternEvidenceReviewButton"), "Pattern disclosure must use the shared evidence review route button");

const reviewButton = bodyOf("renderPatternEvidenceReviewButton");
assert(reviewButton.includes("Review Diary Entries") && reviewButton.includes("Review Related Records"), "Evidence review must distinguish Waste Diary records from other related records");
assert(reviewButton.includes("data-waste-pattern-filter") && reviewButton.includes("data-waste-pattern-details"), "Evidence review must support exact diary filters and related-record details");

const actionDisclosure = bodyOf("renderActionEvidenceDisclosure");
assert(actionDisclosure.includes("<details") && actionDisclosure.includes("Why is this action suggested?"), "Action cards must include a native Why is this action suggested disclosure");
assert(actionDisclosure.includes("evidenceRequirements"), "Action disclosure must render action-specific requirements");
assert(actionDisclosure.includes("What this will not change"), "Action disclosure must explain non-effects");

const evidenceItem = bodyOf("createEvidenceItemFromIncident");
assert(evidenceItem.includes("Not recorded"), "Missing amounts and reasons must display as Not recorded, not zero");
assert(!evidenceItem.includes(".note"), "Compact evidence item model must not copy optional private notes");
assert(evidenceItem.includes("pattern-qualification"), "Evidence item roles must include pattern qualification");

const unrelatedBody = bodyOf("markWastePatternIncidentUnrelated");
assert(unrelatedBody.includes("PATTERN_FEEDBACK_TYPES.INCIDENT_NOT_RELATED"), "Not-related feedback must use pattern feedback");
assert(!/appendFoodEventsToHistory|executePantryCommand|commitPantrySnapshotAndFoodEvents/.test(unrelatedBody), "Not-related feedback must not change physical source events");

const intentionalBody = bodyOf("markWastePatternIncidentIntentional");
assert(intentionalBody.includes("PATTERN_FEEDBACK_TYPES.INTENTIONAL"), "Intentional feedback must use pattern feedback");
assert(!/appendFoodEventsToHistory|executePantryCommand|commitPantrySnapshotAndFoodEvents/.test(intentionalBody), "Intentional feedback must not change physical source events");

assert(!app.includes("patternEvidenceDatabase"), "No competing pattern evidence database may be created");
assert(!app.includes("recommendationEvidenceStore"), "No competing recommendation evidence store may be created");
assert(!app.includes("patternDiaryCopy"), "No duplicate diary copy may be created");
assert(!app.includes("insightSourceRecords"), "No competing insight source record store may be created");

assert(css.includes(".pattern-evidence-disclosure"), "Pattern evidence disclosure styles must exist");
assert(css.includes(".action-evidence-disclosure"), "Action evidence disclosure styles must exist");
assert(css.includes(".evidence-item-list"), "Evidence list styles must exist");
assert(css.includes("@media (forced-colors: active)"), "High-contrast support must remain present");
assert(css.includes("@media print"), "Print support must remain present");

assert(doc.includes("Evidence Source of Truth"), "Documentation must explain source of truth");
assert(doc.includes("Chef Nova does not rebuild evidence with food-name searches."), "Documentation must prohibit name-based reconstruction");
assert(report.includes("Evidence rebuilt by food-name search: 0"), "Report must record zero name-search evidence rebuilds");
assert(report.includes("Second pattern engines created: 0"), "Report must record zero duplicate pattern engines");

console.log("Step 32 explain insight evidence static checks passed.");
