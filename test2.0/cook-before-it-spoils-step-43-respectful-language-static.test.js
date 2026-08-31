const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const policy = require(path.join(root, "languageGuidelines.js"));

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function combinedText(presentation) {
  return [
    presentation.heading,
    presentation.body,
    presentation.accessibilityText,
    ...(presentation.actions || [])
  ].filter(Boolean).join(" ");
}

function assertCleanPresentation(presentation, context = {}) {
  const validation = policy.validateRespectfulMessagePresentation(presentation, context);
  assert.strictEqual(validation.ok, true, JSON.stringify(validation.issues, null, 2));
  assert.deepStrictEqual(policy.scanProhibitedLanguage(combinedText(presentation), context), []);
}

const requiredExports = [
  "RESPECTFUL_MESSAGE_INTENTS",
  "RESPECTFUL_TONE_CLASSES",
  "MESSAGE_ASSERTION_STRENGTH",
  "PROHIBITED_LANGUAGE_CATEGORIES",
  "RESPECTFUL_LANGUAGE_POLICY_REGISTRY",
  "RESPECTFUL_MESSAGE_TEMPLATES",
  "scanProhibitedLanguage",
  "validateActionLabels",
  "validateLocalizationSemantics",
  "validateAccessibilityText",
  "validateRespectfulMessagePresentation",
  "resolveRespectfulMessage",
  "migrateLegacyUserFacingMessage",
  "createMessageNeedsReviewPresentation"
];

requiredExports.forEach((key) => {
  assert.ok(policy[key], `${key} should be exported by the shared policy module`);
});

[
  "INFORMATIONAL_STATUS",
  "PLANNING_SUGGESTION",
  "POSSIBLE_PATTERN",
  "ACTIONABLE_INSIGHT",
  "SAFETY_EXCLUSION",
  "SAFETY_REVIEW_REQUIRED",
  "BUDGET_LIMITATION",
  "RECIPE_LIMITATION",
  "PORTION_SUGGESTION",
  "SHOPPING_ADVISORY",
  "RESERVATION_STATUS",
  "NOTIFICATION",
  "IMPACT_ESTIMATE",
  "VALIDATION_ERROR",
  "SYSTEM_ERROR",
  "MIGRATION_REVIEW"
].forEach((key) => assert.ok(policy.RESPECTFUL_MESSAGE_INTENTS[key], `Missing intent ${key}`));

[
  "NEUTRAL_INFORMATIONAL",
  "SUPPORTIVE_PLANNING",
  "CAUTIOUS_EVIDENCE",
  "FIRM_SAFETY",
  "RESPECTFUL_LIMITATION",
  "RECOVERY_ORIENTED"
].forEach((key) => assert.ok(policy.RESPECTFUL_TONE_CLASSES[key], `Missing tone class ${key}`));

[
  "CONFIRMED_FACT",
  "SYSTEM_POLICY",
  "RECORDED_OBSERVATION",
  "ESTIMATED_RESULT",
  "POSSIBLE_INTERPRETATION",
  "OPTIONAL_SUGGESTION",
  "REVIEW_REQUIRED"
].forEach((key) => assert.ok(policy.MESSAGE_ASSERTION_STRENGTH[key], `Missing assertion strength ${key}`));

[
  "USER_BLAME",
  "SHAME",
  "MORAL_JUDGMENT",
  "BEHAVIOURAL_DIAGNOSIS",
  "SOCIOECONOMIC_JUDGMENT",
  "UNSUPPORTED_ABSOLUTE",
  "COERCION",
  "UNSUPPORTED_CAUSALITY",
  "SAFETY_AMBIGUITY",
  "SAFETY_OVERRIDING",
  "INVALID_PERSONALIZATION",
  "MANIPULATIVE_ACTION_LABEL"
].forEach((key) => assert.ok(policy.PROHIBITED_LANGUAGE_CATEGORIES[key], `Missing prohibited category ${key}`));

assert.strictEqual(policy.RESPECTFUL_LANGUAGE_POLICY_REGISTRY.respectfulLanguagePolicyVersion, policy.RESPECTFUL_LANGUAGE_POLICY_VERSION);
assert.ok(policy.RESPECTFUL_MESSAGE_PRESENTATION_VERSION > 0);
assert.ok(policy.PROHIBITED_LANGUAGE_SCANNER_VERSION > 0);
assert.ok(policy.LOCALIZATION_SEMANTIC_VALIDATION_VERSION > 0);

assert.ok(policy.scanProhibitedLanguage("You wasted spinach again.").some((issue) => issue.category === policy.PROHIBITED_LANGUAGE_CATEGORIES.USER_BLAME));
assert.deepStrictEqual(policy.scanProhibitedLanguage("Allergies are never removed automatically."), []);
assert.ok(policy.scanProhibitedLanguage("You never use leftovers.").some((issue) => issue.category === policy.PROHIBITED_LANGUAGE_CATEGORIES.UNSUPPORTED_ABSOLUTE));
assert.deepStrictEqual(policy.scanProhibitedLanguage("You wasted spinach again.", { allowPolicyDocumentation: true }), []);
assert.deepStrictEqual(policy.scanProhibitedLanguage("User note: I wasted this.", { allowUserAuthoredContent: true }), []);
assert.ok(policy.scanProhibitedLanguage("This food was definitely prevented from landfill.").length > 0);

const possiblePattern = policy.resolveRespectfulMessage("patterns.possibleIngredientPattern", {
  foodName: "Baby spinach",
  incidentCount: 3,
  windowDays: 60,
  sourceRevision: "pattern-1"
});
assertCleanPresentation(possiblePattern);
assert.match(possiblePattern.heading, /POSSIBLE PLANNING PATTERN/);
assert.match(possiblePattern.body, /recorded as discarded in 3 separate incidents/);
assert.match(possiblePattern.body, /planning observation, not a judgment/);

const oneRecord = policy.resolveRespectfulMessage("patterns.possibleIngredientPattern", {
  foodName: "Baby spinach",
  incidentCount: 1,
  windowDays: 60
});
assertCleanPresentation(oneRecord);
assert.match(oneRecord.body, /One Baby spinach discard was recorded/);
assert.doesNotMatch(oneRecord.heading + oneRecord.body, /pattern/i);

const twoRecords = policy.resolveRespectfulMessage("patterns.possibleIngredientPattern", {
  foodName: "Baby spinach",
  incidentCount: 2,
  windowDays: 60
});
assertCleanPresentation(twoRecords);
assert.match(twoRecords.body, /2 Baby spinach discard records are available/);
assert.doesNotMatch(twoRecords.heading + twoRecords.body, /POSSIBLE PLANNING PATTERN/);

const portion = policy.resolveRespectfulMessage("portions.possibleAdjustment", {
  currentServings: 4,
  suggestedServings: 3
});
assertCleanPresentation(portion);
assert.match(portion.body, /may produce more food/);
assert.ok(portion.actions.includes("Preview 3 Servings"));
assert.ok(portion.actions.includes("Keep 4 Servings"));

const recipeLimitation = policy.resolveRespectfulMessage("recipes.limitation", {
  selectedIngredientCount: 3,
  matchedIngredientCount: 2
});
assertCleanPresentation(recipeLimitation);
assert.match(recipeLimitation.body, /could not find a suitable recipe using all 3 selected ingredients/);
assert.match(recipeLimitation.body, /safe options using 2/);

const expiration = policy.resolveRespectfulMessage("safety.expirationPassed");
assertCleanPresentation(expiration);
assert.match(expiration.heading, /THE RECORDED EXPIRATION DATE HAS PASSED/);
assert.match(expiration.body, /will not recommend/);

const storage = policy.resolveRespectfulMessage("safety.storageReview");
assertCleanPresentation(storage);
assert.match(storage.body, /not included in a recipe recommendation/);

const budget = policy.resolveRespectfulMessage("budget.limitation");
assertCleanPresentation(budget);
assert.match(budget.body, /No safety or dietary requirement was removed/);
assert.doesNotMatch(budget.body, /unrealistic|cannot afford|bad budget/i);

const dismissed = policy.resolveRespectfulMessage("notifications.dismissed");
assertCleanPresentation(dismissed);
assert.match(dismissed.body, /Pantry item was not changed/);

const fallback = policy.createMessageNeedsReviewPresentation({ pantry: "rev-1" });
assertCleanPresentation(fallback);
assert.match(fallback.body, /records were not changed/);
assert.deepStrictEqual(fallback.sourceRevisions, { pantry: "rev-1" });

const legacyFailed = policy.migrateLegacyUserFacingMessage("You failed to use spinach.", { foodName: "spinach" });
assertCleanPresentation(legacyFailed);
assert.match(legacyFailed.body, /planned spinach meal was not confirmed as prepared/);
assert.match(legacyFailed.body, /spinach is available for another plan/);

const legacyBudget = policy.migrateLegacyUserFacingMessage("Your budget is unrealistic.");
assertCleanPresentation(legacyBudget);
assert.match(legacyBudget.body, /No safety or dietary requirement was removed/);

const legacyImpact = policy.migrateLegacyUserFacingMessage("You prevented 25 kg of carbon emissions.");
assert.match(legacyImpact.body, /approved ingredient-specific methodology/);
assert.deepStrictEqual(policy.scanProhibitedLanguage(combinedText(legacyImpact)), []);

const sourceTemplate = policy.RESPECTFUL_MESSAGE_TEMPLATES["patterns.possibleIngredientPattern"];
const localizationMissingTokens = policy.validateLocalizationSemantics(sourceTemplate, {
  requiredSemanticTokens: ["possible", "recorded"]
});
assert.strictEqual(localizationMissingTokens.ok, false);
assert.ok(localizationMissingTokens.missingSemanticTokens.includes("incident-count"));

const localizationComplete = policy.validateLocalizationSemantics(sourceTemplate, {
  requiredSemanticTokens: sourceTemplate.requiredSemanticTokens
});
assert.strictEqual(localizationComplete.ok, true);

const accessibleMismatch = policy.validateAccessibilityText(
  "Possible planning pattern.",
  "User waste problem."
);
assert.strictEqual(accessibleMismatch.ok, false);

assert.ok(policy.validateActionLabels(["Fix"]).length > 0);
assert.deepStrictEqual(policy.validateActionLabels(["Review Suggested Changes", "Keep Current Settings"]), []);

const repeatedA = policy.resolveRespectfulMessage("patterns.possibleIngredientPattern", {
  foodName: "Rice",
  incidentCount: 3,
  windowDays: 30,
  sourceRevision: "same"
});
const repeatedB = policy.resolveRespectfulMessage("patterns.possibleIngredientPattern", {
  foodName: "Rice",
  incidentCount: 3,
  windowDays: 30,
  sourceRevision: "same"
});
assert.strictEqual(repeatedA.messageId, repeatedB.messageId);
assert.strictEqual(repeatedA.body, repeatedB.body);

const appSource = readProjectFile("app.js");
assert.match(appSource, /function validateChefNovaUserFacingText/);
assert.match(appSource, /function addNotification\(message, type = "info", options = \{\}\) \{\s*const validation = validateChefNovaUserFacingText/s);
assert.match(appSource, /function showToast\(message, type = "info", options = \{\}\) \{[\s\S]*const validation = validateChefNovaUserFacingText/);

const policySource = readProjectFile("languageGuidelines.js");
[
  "politeMessageDatabase",
  "friendlyErrorEngine",
  "empathyAI",
  "respectfulPatternDatabase",
  "secondLocalizationSystem",
  "secondNotificationWordingEngine"
].forEach((duplicateName) => {
  assert.strictEqual(appSource.includes(duplicateName), false, `${duplicateName} should not exist in app.js`);
  assert.strictEqual(policySource.includes(duplicateName), false, `${duplicateName} should not exist in languageGuidelines.js`);
});

const docs = readProjectFile("docs/cook-before-it-spoils-respectful-language.md");
[
  "User-Blame Prevention",
  "Respect Versus Safety Clarity",
  "Pattern Language",
  "Budget Rescue",
  "Localization",
  "Accessibility",
  "Print and Export",
  "Testing"
].forEach((heading) => assert.ok(docs.includes(heading), `Policy docs missing ${heading}`));

const report = readProjectFile("docs/cook-before-it-spoils-step-43-report.md");
[
  "Second decision engines created: 0",
  "User-blaming production strings remaining: 0",
  "Socioeconomic judgments based on budget: 0",
  "Harsher screen-reader wording than visible wording: 0",
  "Guest personal records persisted into registered-user storage automatically: 0"
].forEach((line) => assert.ok(report.includes(line), `Report missing ${line}`));

console.log("Cook Before It Spoils Step 43 respectful-language static checks passed.");
