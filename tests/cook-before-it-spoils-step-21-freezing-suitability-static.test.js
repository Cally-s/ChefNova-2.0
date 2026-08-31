const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const app = fs.readFileSync("app.js", "utf8");
const index = fs.readFileSync("index.html", "utf8");
const json = JSON.parse(fs.readFileSync("data/freezer-guidance.json", "utf8"));
const js = fs.readFileSync("data/freezer-guidance.js", "utf8");
const ingredients = JSON.parse(fs.readFileSync("data/ingredients.json", "utf8"));
const doc = fs.readFileSync("docs/cook-before-it-spoils-freezing-suitability-catalogue.md", "utf8");

function expect(source, snippet, message) {
  assert(source.includes(snippet), message || `Expected snippet: ${snippet}`);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(js, sandbox);
assert.strictEqual(JSON.stringify(sandbox.window.CHEF_NOVA_FREEZER_GUIDANCE_CATALOGUE), JSON.stringify(json), "JSON and JS freezer guidance catalogues should match.");

expect(index, "data/freezer-guidance.js", "Direct index.html fallback should load freezer guidance data.");
assert(index.indexOf("data/freezer-guidance.js") < index.indexOf("app.js"), "Freezer guidance data should load before app.js.");

[
  "FREEZER_GUIDANCE_CATALOGUE_SCHEMA_VERSION = 1",
  "FREEZER_GUIDANCE_POLICY_SCHEMA_VERSION = 1",
  "FREEZER_GUIDANCE_RESOLUTION_VERSION = 1",
  "FREEZER_GUIDANCE_VIEW_MODEL_VERSION = 1",
  "FREEZER_GUIDANCE_REVIEW_WORKFLOW_VERSION = 1",
  "FREEZER_GUIDANCE_SUBJECT_TYPES = Object.freeze",
  "FREEZER_SUITABILITY_STATUSES = Object.freeze",
  "BLANCHING_REQUIREMENTS = Object.freeze",
  "THAWING_METHODS = Object.freeze",
  "COOK_FROM_FROZEN_STATUSES = Object.freeze",
  "FREEZER_TEXTURE_CHANGE_LEVELS = Object.freeze",
  "FREEZER_GUIDANCE_REVIEW_STATUSES = Object.freeze",
  "FREEZER_PREPARATION_ACTION_TYPES = Object.freeze"
].forEach((snippet) => expect(app, snippet, `Missing freezer governance constant: ${snippet}`));

[
  "function normalizeFreezerGuidanceCatalogue",
  "function validateFreezerGuidancePolicy",
  "function validateFreezerGuidanceCatalogue",
  "function buildFreezerGuidancePolicyIndexes",
  "function resolveFreezerGuidance",
  "function buildFreezerGuidanceViewModel",
  "function renderFreezerGuidanceAdminReviewInterface",
  "function validateFreezerPolicyApprovalRequest",
  "function createFreezerGuidanceAiDraft",
  "function migrateLegacyFreezerGuidanceFields",
  "function reportFreezerGuidanceConcern"
].forEach((snippet) => expect(app, snippet, `Missing freezer catalogue function: ${snippet}`));

assert.strictEqual(json.freezerGuidanceCatalogueVersion, 1, "Catalogue version should be present.");
assert.strictEqual(json.policyResolutionVersion, 1, "Policy resolution version should be present.");
assert.strictEqual(json.reviewWorkflowVersion, 1, "Review workflow version should be present.");
assert(Array.isArray(json.sourceHierarchy) && json.sourceHierarchy.length >= 5, "Source hierarchy should be recorded.");

const approved = json.policies.find((policy) => policy.policyId.includes("leftover-cooked-dish"));
assert(approved, "Approved leftover policy should exist.");
assert.strictEqual(approved.subject.entityType, "prepared-leftover-category", "Leftover policy should use prepared-leftover subject type.");
assert.strictEqual(approved.suitability.status, "conditionally-recommended", "Leftover policy should be conditional.");
assert.strictEqual(approved.suitability.canFreeze, true, "Reviewed leftover policy can freeze.");
assert.strictEqual(approved.review.status, "approved-with-limitations", "Leftover policy should be human reviewed.");
assert.notStrictEqual(approved.review.generatedBy, "ai", "Approved policy must not be AI-generated.");
assert.strictEqual(approved.review.contentHash, approved.review.approvalContentHash, "Approved policy hash should be locked.");
assert(approved.evidence.length >= 2, "Approved policy should include field-level evidence.");
assert.strictEqual(approved.qualityWindow.basis, "quality", "Quality window must stay quality-only.");
assert(!/expiration|safety deadline/i.test(approved.qualityWindow.userFacingLabel || ""), "Quality-window label should not read as expiration.");

const draft = json.policies.find((policy) => policy.policyId.includes("spinach"));
assert(draft, "Spinach draft policy should exist.");
assert.strictEqual(draft.review.status, "draft-ai-generated", "Spinach record should remain an AI draft.");
assert.strictEqual(draft.review.generatedBy, "ai", "Spinach draft should identify AI generation.");
assert.strictEqual(draft.suitability.canFreeze, null, "AI draft must not recommend freezing.");
assert.strictEqual(draft.review.approvedByUserId, null, "AI draft should not be approved.");
assert.strictEqual(draft.blanching.requirement, "review-required", "AI draft should not invent blanching instructions.");
assert.strictEqual(draft.evidence.length, 0, "AI draft should not invent evidence.");

const spinach = ingredients.ingredients.find((ingredient) => ingredient.id === "spinach");
assert(spinach.freezerGuidancePolicyIds.includes(draft.policyId), "Ingredient catalogue should reference the freezer draft policy.");
assert.strictEqual(spinach.freezerGuidanceSummary.status, "review-required", "Ingredient summary should not mark draft guidance as approved.");

expect(app, "if (guardrail.hardExclusion || guardrail.canUseForAutomaticPlanning === false)", "Resolver should apply Food-Safety Guardrails before freezer suitability.");
expect(app, "if (!freezerProfile.recorded || !freezerProfile.withinGuidance)", "Resolver should require freezer profile review before recommendation.");
expect(app, "isFreezerGuidancePolicyApprovedForConsumers(policy)", "Consumer guidance should require approved policy checks.");
expect(app, "policy.review?.generatedBy !== \"ai\"", "AI drafts must be blocked from consumer approval.");
expect(app, "policy.review.contentHash === policy.review.approvalContentHash", "Approval hash should be verified.");
expect(app, "freezerGuidance.suitability.canRecommendFreezing", "Use These First should use freezer suitability, not safety-only freezer flags.");
expect(app, "buildFreezerGuidanceViewModel", "Freeze Options should render from a conservative view model.");
expect(app, "data-freezer-guidance-source", "Freeze Options should expose source review.");
expect(app, "data-freezer-guidance-report", "Freeze Options should expose report concern flow.");
expect(app, "No storage, dates, events, or quantities changed", "Freeze Options must be non-mutating.");
assert(!/openUseFirstFreezeOptions[\s\S]{0,7000}MARKED_FROZEN/.test(app), "Freeze Options must not automatically freeze inventory.");

expect(doc, "AI may draft freezer guidance only as `draft-ai-generated`", "Docs should record AI governance.");
expect(doc, "Quality windows are for best quality only", "Docs should separate quality from safety.");
expect(doc, "Resolution order is conservative", "Docs should record policy precedence.");

console.log("Cook Before It Spoils Step 21 freezer suitability static checks passed.");
