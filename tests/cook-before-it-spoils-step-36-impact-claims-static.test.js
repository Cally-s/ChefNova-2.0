const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-responsible-impact-claims.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-36-report.md"), "utf8");

function bodyOf(functionName) {
  const start = app.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} must exist`);
  const next = app.indexOf("\n  function ", start + 12);
  return app.slice(start, next === -1 ? app.length : next);
}

[
  "IMPACT_CLAIM_POLICY_REGISTRY_VERSION",
  "IMPACT_CLAIM_PRESENTATION_VERSION",
  "IMPACT_CLAIM_AUDIT_VERSION",
  "IMPACT_CLAIM_CLASS_VERSION",
  "IMPACT_CLAIM_PRECISION_VERSION",
  "IMPACT_CLAIM_CAUSALITY_VERSION",
  "ENVIRONMENTAL_CLAIM_READINESS_VERSION",
  "IMPACT_CLAIM_UNCERTAINTY_REASON_VERSION"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} must be defined`));

[
  "IMPACT_CLAIM_CLASSES",
  "IMPACT_CLAIM_PRECISION",
  "IMPACT_CLAIM_CAUSALITY",
  "ENVIRONMENTAL_CLAIM_READINESS",
  "IMPACT_CLAIM_UNCERTAINTY_REASONS",
  "IMPACT_CLAIM_POLICIES",
  "PROHIBITED_IMPACT_CLAIM_PHRASES"
].forEach((name) => assert(app.includes(`const ${name}`), `${name} controlled values must exist`));

[
  "getImpactClaimPolicy",
  "resolveImpactClaimQualifiers",
  "collectImpactClaimUncertaintyReasons",
  "determineImpactClaimPrecision",
  "formatImpactClaimPointValue",
  "formatImpactClaimRange",
  "scanProhibitedImpactClaims"
].forEach((name) => assert(app.includes(`function ${name}`), `${name} must be implemented`));

const resolver = bodyOf("resolveImpactClaimQualifiers");
[
  "impactClaimPresentationVersion",
  "claimClass",
  "precision",
  "causality",
  "confidence",
  "coverage",
  "qualifiers",
  "uncertaintyReasons",
  "environmentalClaimReadiness",
  "screenReaderLabel",
  "exportLabel",
  "printLabel",
  "audit"
].forEach((phrase) => assert(resolver.includes(phrase), `Resolver must output ${phrase}`));

assert(resolver.includes("This estimate does not prove what would have happened without Chef Nova."), "Possible food waste avoided must keep counterfactual caution");
assert(resolver.includes("not a cash refund or guaranteed future saving"), "Estimated food value must not be exact cash savings");
assert(resolver.includes("Food protected for later use is not yet counted as used or as possible food waste avoided"), "Protected stock must stay separate");
assert(resolver.includes("impact-claim-presentation:"), "Claim presentation must have a stable idempotency key");

const pointFormatter = bodyOf("formatImpactClaimPointValue");
assert(pointFormatter.includes("coverage?.eligible && !coverage.included ? \"Unavailable\""), "Unavailable must be distinct from valid zero");
assert(pointFormatter.includes("Approximately"), "Approximate values must be visible");
assert(pointFormatter.includes("measured from recorded qualifying outcomes"), "Measured complete mass wording must be supported");

const dashboard = bodyOf("buildMonthlyImpactDashboard");
assert(dashboard.includes("resolveImpactClaimQualifiers"), "Dashboard cards must consume shared claim presentations");
assert(dashboard.includes("claimPresentation"), "Cards must carry claim presentation models");
assert(dashboard.includes("summarizeMonthlyImpactEntryRanges"), "Dashboard must preserve supported ranges");
assert(dashboard.includes("different currencies") === false, "Dashboard implementation should not combine currencies through prose logic");

const cardRenderer = bodyOf("renderMonthlyImpactCard");
assert(cardRenderer.includes("screenReaderLabel"), "Card accessible labels must preserve qualifiers");
assert(cardRenderer.includes("Estimated range"), "Card must visibly show range when available");
assert(cardRenderer.includes("Confidence:") && cardRenderer.includes("Coverage:"), "Card must visibly show confidence and coverage");
assert(cardRenderer.includes("Claim and calculation details"), "Card must expose claim audit details");

const exportBody = bodyOf("buildMonthlyImpactExportSummary");
[
  "claimClass",
  "precision",
  "causality",
  "confidence",
  "environmentalClaimReadiness",
  "qualifiers",
  "uncertaintyReasons",
  "separate-by-currency"
].forEach((phrase) => assert(exportBody.includes(phrase), `Export summary must include ${phrase}`));

const scanner = bodyOf("scanProhibitedImpactClaims");
[
  "carbon saved",
  "emissions prevented",
  "water saved",
  "landfill prevented",
  "guaranteed savings"
].forEach((phrase) => assert(app.includes(phrase), `Scanner must include ${phrase}`));
assert(scanner.includes("docs\\/|test|prohibited|not approved|deferred"), "Scanner must allow documentation/test prohibition examples");

[
  "kg-co2e",
  "carbonFactor",
  "waterFootprintFactor",
  "landfillEmissionFactor",
  "environmentalScore",
  "sustainabilityScore",
  "carbonSavedKg",
  "waterSavedLitres",
  "emissionsPrevented"
].forEach((forbidden) => assert(!app.includes(forbidden), `${forbidden} must not be implemented in app.js`));

[
  "environmentalImpactStore",
  "carbonSavingsStore",
  "greenImpactDatabase",
  "impactClaimDatabase",
  "estimatedClaimLedger",
  "dashboardWordingEngine"
].forEach((forbidden) => {
  assert(!app.includes(`const ${forbidden}`) && !app.includes(`let ${forbidden}`) && !app.includes(`var ${forbidden}`), `${forbidden} must not be created`);
});

[
  ".monthly-impact-range",
  ".monthly-impact-confidence",
  ".monthly-impact-coverage",
  ".monthly-impact-caution",
  ".monthly-impact-environmental-notice"
].forEach((phrase) => assert(css.includes(phrase), `CSS must include ${phrase}`));

[
  "# Chef Nova Responsible Impact Claims",
  "Counterfactual Language",
  "Estimate Triggers",
  "True Zero Versus Unavailable",
  "Environmental Claims",
  "Claim Presentation Model",
  "Prohibited-Phrase Scanning",
  "User Isolation"
].forEach((phrase) => assert(doc.includes(phrase), `Responsible claims doc must include ${phrase}`));

[
  "Carbon-emissions calculations implemented: 0",
  "Water-footprint calculations implemented: 0",
  "Generic environmental conversion factors introduced: 0",
  "Environmental claims displayed without approved methodology: 0",
  "Possible food waste avoided labelled as definitely prevented: 0",
  "Estimated food value labelled as exact savings: 0",
  "Frozen-only food labelled as food waste avoided: 0",
  "Guest claim data persisted into registered-user storage automatically: 0"
].forEach((phrase) => assert(report.includes(phrase), `Step 36 report must include ${phrase}`));

console.log("Step 36 impact-claims governance static checks passed.");
