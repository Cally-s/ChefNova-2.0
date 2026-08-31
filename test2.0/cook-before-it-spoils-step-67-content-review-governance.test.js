const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const review = require(path.join(root, "scripts/content-review-governance.js"));
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const offline = fs.readFileSync(path.join(root, "scripts/offline-resilience.js"), "utf8");

const author = { id: "author-1", roles: ["author"] };
const publisher = { id: "publisher-1", roles: ["publisher"] };
const accessibilityReviewer = { id: "access-1", roles: ["accessibility-reviewer"] };
const languageReviewer = { id: "language-1", roles: ["language-reviewer"], authorizedLocales: ["fr-CA", "zh-CN"] };
const safetyReviewer = { id: "safety-1", roles: ["safety-reviewer"] };
const unauthorizedReviewer = { id: "language-2", roles: ["language-reviewer"], authorizedLocales: ["es-MX"] };

function validRecipe(overrides = {}) {
  return {
    id: "spinach-mushroom-bowl",
    name: "Spinach Mushroom Bowl",
    sourceLocale: "en-CA",
    version: 4,
    createdBy: "author-1",
    preparationTime: 10,
    cookingTime: 12,
    structuredIngredients: [
      { ingredientId: "spinach", displayName: "spinach", canonicalQuantity: { value: "180", unit: "g" } },
      { ingredientId: "mushrooms", displayName: "mushrooms", canonicalQuantity: { value: "120", unit: "g" } }
    ],
    reviewSteps: [
      {
        id: "step-1",
        order: 1,
        primaryInstruction: "Cook the mushrooms for 5 minutes, until they are soft and lightly browned.",
        ingredientUsages: [{ id: "use-1", stepId: "step-1", ingredientId: "mushrooms", canonicalQuantity: { value: "120", unit: "g" }, usageType: "full" }],
        duration: { minimumSeconds: 300, maximumSeconds: 420, approximate: true, timerRecommended: true },
        donenessCues: [{ type: "colour", description: "Lightly browned edges.", required: true }]
      },
      {
        id: "step-2",
        order: 2,
        primaryInstruction: "Stir in the spinach and cook for 2 minutes, until the leaves are wilted.",
        ingredientUsages: [{ id: "use-2", stepId: "step-2", ingredientId: "spinach", canonicalQuantity: { value: "180", unit: "g" }, usageType: "full" }],
        duration: { minimumSeconds: 120, approximate: true, timerRecommended: true },
        donenessCues: [{ type: "texture", description: "Spinach leaves are wilted.", required: true }]
      }
    ],
    applianceRequirements: [{ applianceId: "stove", required: true }],
    allergyInformation: { confirmedAllergenIds: [], possibleCrossContaminationAllergenIds: [], reviewStatus: "approved" },
    safetyTemperatureReferences: [],
    media: { images: [], videos: [] },
    ...overrides
  };
}

function approvedContext(recipe, locales = ["en-CA"], translations = []) {
  const version = review.createReviewableVersion({ entityId: recipe.id, entityType: "recipe", version: recipe.version, sourceLocale: recipe.sourceLocale, requiredReviews: ["content-completeness", "accessibility"], createdBy: recipe.createdBy, content: recipe, status: review.CONTENT_REVIEW_STATUSES.APPROVED });
  const approvals = [
    review.createApproval({ entityType: "recipe", entityId: recipe.id, entityVersion: version.version, contentHash: version.contentHash, reviewKind: "content-completeness", reviewerId: "access-1", reviewerRole: "accessibility-reviewer" }),
    review.createApproval({ entityType: "recipe", entityId: recipe.id, entityVersion: version.version, contentHash: version.contentHash, reviewKind: "accessibility", reviewerId: "access-1", reviewerRole: "accessibility-reviewer" })
  ];
  return { version, approvals, requestedLocales: locales, translations };
}

function issueCodes(resultOrIssues) {
  const issues = Array.isArray(resultOrIssues) ? resultOrIssues : resultOrIssues.issues;
  return issues.map((issue) => issue.code);
}

function assertBlocks(recipe, code, context = {}) {
  const issues = review.validateRecipePublication(recipe, { approvals: [], ...context });
  assert(issueCodes(issues).includes(code), `${code} should block publication`);
}

(function run() {
  assert(html.includes("scripts/content-review-governance.js"), "index loads content governance script");
  assert(html.indexOf("scripts/content-review-governance.js") < html.indexOf("app.js"), "governance script loads before app");
  assert(app.includes("const CONTENT_REVIEW = window.ChefNovaContentReview || {};"), "app imports governance module");
  assert(app.includes("renderContentReviewDashboardSection"), "Profile includes review dashboard");
  assert(app.includes("evaluateRecipePublicationReadiness"), "app uses centralized publication readiness");
  assert(app.includes("downloadRecipeForOffline") && app.includes("readiness.publishable"), "Step 66 offline packages check publication readiness");
  assert(css.includes(".content-review-dashboard"), "content review dashboard CSS exists");
  assert(offline.includes("createOfflineRecipePackage"), "offline package infrastructure remains present");

  assert(review.REVIEWABLE_CONTENT_TYPES.includes("recipe-step"), "recipe-step is reviewable");
  assert(review.REVIEWABLE_CONTENT_TYPES.includes("caption-track"), "caption-track is reviewable");
  assert(review.REVIEWABLE_CONTENT_TYPES.includes("translation"), "translation is reviewable");
  assert(review.REVIEW_KINDS.includes("content-completeness"), "content-completeness review kind exists");
  assert(review.REVIEW_KINDS.includes("accessibility"), "accessibility review kind exists");
  assert(review.REVIEW_KINDS.includes("language"), "language review kind exists");
  assert(review.REVIEW_KINDS.includes("food-safety"), "food-safety review kind exists");

  assert(review.transitionContentStatus("draft", "ready-for-review"), "draft can move to ready for review");
  assert(!review.transitionContentStatus("published", "approved"), "published cannot move backward arbitrarily");
  assert(review.transitionTranslationStatus("missing", "machine-draft"), "missing translation can become machine draft");
  assert(!review.transitionTranslationStatus("machine-draft", "approved"), "machine draft cannot become approved directly");

  assertBlocks(validRecipe({ structuredIngredients: [{ displayName: "spinach", canonicalQuantity: { value: "180", unit: "g" } }] }), review.PUBLICATION_ISSUE_CODES.INGREDIENT_ID_MISSING);
  assertBlocks(validRecipe({ structuredIngredients: [{ displayName: "Coriander", canonicalQuantity: { value: "1", unit: "bunch" } }] }), review.PUBLICATION_ISSUE_CODES.INGREDIENT_AMBIGUOUS);
  assertBlocks(validRecipe({ structuredIngredients: [{ ingredientId: "spinach", displayName: "spinach" }] }), review.PUBLICATION_ISSUE_CODES.QUANTITY_NOT_STRUCTURED);
  assertBlocks(validRecipe({ structuredIngredients: [{ ingredientId: "spinach", displayName: "spinach", canonicalQuantity: { value: "0", unit: "g" } }] }), review.PUBLICATION_ISSUE_CODES.QUANTITY_NOT_STRUCTURED);
  assertBlocks(validRecipe({ reviewSteps: [{ id: "step-1", primaryInstruction: "Cook spinach for 2 minutes.", ingredientUsages: [], donenessCues: [{ type: "texture", description: "Wilted", required: true }] }] }), review.PUBLICATION_ISSUE_CODES.STEP_QUANTITY_MISSING);
  assertBlocks(validRecipe({ reviewSteps: [{ id: "step-1", primaryInstruction: "Cook spinach for 2 minutes.", ingredientUsages: [{ ingredientId: "spinach", canonicalQuantity: { value: "300", unit: "g" } }], donenessCues: [{ type: "texture", description: "Wilted", required: true }] }] }), review.PUBLICATION_ISSUE_CODES.STEP_QUANTITY_EXCESS);
  assertBlocks(validRecipe({ preparationTime: undefined, prepTime: undefined, timing: {} }), review.PUBLICATION_ISSUE_CODES.PREPARATION_TIME_MISSING);
  assertBlocks(validRecipe({ cookingTime: undefined, cookTime: undefined, timing: {} }), review.PUBLICATION_ISSUE_CODES.COOKING_TIME_MISSING);
  assertBlocks(validRecipe({ reviewSteps: [{ id: "step-3", primaryInstruction: "Proceed with the mixture as before.", ingredientUsages: [{ ingredientId: "spinach", canonicalQuantity: { value: "180", unit: "g" } }] }] }), review.PUBLICATION_ISSUE_CODES.PLAIN_LANGUAGE_MISSING);
  assertBlocks(validRecipe({ reviewSteps: [{ id: "step-1", primaryInstruction: "Cook the mushrooms until ready.", ingredientUsages: [{ ingredientId: "mushrooms", canonicalQuantity: { value: "120", unit: "g" } }], donenessCues: [] }] }), review.PUBLICATION_ISSUE_CODES.PLAIN_LANGUAGE_MISSING);
  assertBlocks(validRecipe({ reviewSteps: [{ id: "step-1", primaryInstruction: "Cook the mushrooms until they soften.", ingredientUsages: [{ ingredientId: "mushrooms", canonicalQuantity: { value: "120", unit: "g" } }], donenessCues: [] }] }), review.PUBLICATION_ISSUE_CODES.DONENESS_CUE_MISSING);
  assertBlocks(validRecipe({ structuredIngredients: [{ ingredientId: "chicken", displayName: "chicken", canonicalQuantity: { value: "200", unit: "g" } }], safetyTemperatureReferences: [] }), review.PUBLICATION_ISSUE_CODES.SAFETY_TEMPERATURE_MISSING);
  assert(!issueCodes(review.validateRecipePublication(validRecipe())).includes(review.PUBLICATION_ISSUE_CODES.SAFETY_TEMPERATURE_MISSING), "non-meat recipe does not require a false safety temperature");
  assertBlocks(validRecipe({ applianceRequirements: [], equipment: [], appliances: [], reviewSteps: [{ id: "step-1", primaryInstruction: "Bake the bowl for 10 minutes.", ingredientUsages: [{ ingredientId: "spinach", canonicalQuantity: { value: "180", unit: "g" } }], donenessCues: [{ type: "visual", description: "Hot and bubbling.", required: true }] }] }), review.PUBLICATION_ISSUE_CODES.APPLIANCE_REQUIREMENT_MISSING);
  assertBlocks(validRecipe({ allergyInformation: null, allergyWarnings: [], allergies: [] }), review.PUBLICATION_ISSUE_CODES.ALLERGY_INFORMATION_MISSING);

  assertBlocks(validRecipe({ media: { images: [{ id: "img-1", purpose: "meaningful", altText: "" }], videos: [] } }), review.PUBLICATION_ISSUE_CODES.ALT_TEXT_MISSING);
  assert(!issueCodes(review.validateRecipePublication(validRecipe({ media: { images: [{ id: "img-1", purpose: "decorative", altText: "" }], videos: [] } }))).includes(review.PUBLICATION_ISSUE_CODES.ALT_TEXT_MISSING), "decorative image accepts empty alt text");
  assertBlocks(validRecipe({ media: { images: [{ id: "img-2", purpose: "doneness-reference", altText: "Image of mushrooms" }], videos: [] } }), review.PUBLICATION_ISSUE_CODES.ALT_TEXT_INSUFFICIENT);
  assertBlocks(validRecipe({ media: { images: [], videos: [{ id: "vid-1" }] } }), review.PUBLICATION_ISSUE_CODES.CAPTIONS_MISSING);
  assertBlocks(validRecipe({ media: { images: [], videos: [{ id: "vid-1", captionTrack: { status: "machine-draft", version: 1 }, transcript: { status: "approved", version: 1 } }] } }), review.PUBLICATION_ISSUE_CODES.CAPTIONS_UNREVIEWED);
  assertBlocks(validRecipe({ media: { images: [], videos: [{ id: "vid-1", captionTrack: { status: "approved", version: 1 } }] } }), review.PUBLICATION_ISSUE_CODES.TRANSCRIPT_MISSING);
  assertBlocks(validRecipe({ media: { images: [], videos: [{ id: "vid-1", captionTrack: { status: "approved", version: 1 }, transcript: { status: "human-review-required", version: 1 } }] } }), review.PUBLICATION_ISSUE_CODES.TRANSCRIPT_UNREVIEWED);
  assert(!issueCodes(review.validateRecipePublication(validRecipe({ media: { images: [], videos: [{ id: "vid-1", excludedFromPublication: true }] } }))).includes(review.PUBLICATION_ISSUE_CODES.CAPTIONS_MISSING), "removing optional video resolves caption blocker");

  const recipe = validRecipe();
  const context = approvedContext(recipe, ["en-CA"]);
  const result = review.evaluateRecipe(recipe, context);
  assert.strictEqual(result.publishable, true, "valid recipe with exact approvals can publish in source locale");
  assert.strictEqual(review.publishRecipe(recipe, { ...context, publisher }).ok, true, "publisher can publish fully approved recipe");
  assert.strictEqual(review.publishRecipe(recipe, { ...context, publisher: author }).ok, false, "author without publisher role cannot publish");

  const draft = review.saveDraftContent(validRecipe({ reviewSteps: [{ id: "bad", primaryInstruction: "Proceed with the mixture as before." }] }), author);
  assert.strictEqual(draft.ok, true, "authors can save incomplete drafts");
  assert.strictEqual(draft.version.status, review.CONTENT_REVIEW_STATUSES.DRAFT, "saved incomplete content remains draft");
  assert.strictEqual(review.publishRecipe(validRecipe({ id: "incomplete-draft", reviewSteps: [{ id: "bad", primaryInstruction: "Proceed with the mixture as before." }] }), { publisher }).ok, false, "authors cannot publish incomplete drafts through gate");
  assert.strictEqual(review.recordReviewDecision(draft.version, author, "food-safety").ok, false, "author cannot approve own safety-critical content");
  assert.strictEqual(review.recordReviewDecision(draft.version, safetyReviewer, "food-safety").ok, true, "authorized safety reviewer can approve safety review");
  assert.strictEqual(review.canReview(unauthorizedReviewer, "language", { locale: "fr-CA" }), false, "unauthorized locale reviewer cannot approve unsupported locale");
  assert.strictEqual(review.canReview(languageReviewer, "language", { locale: "fr-CA" }), true, "authorized language reviewer can review locale");
  const approval = review.recordReviewDecision(draft.version, accessibilityReviewer, "accessibility").approval;
  assert(Object.isFrozen(approval), "approval records are immutable");
  assert(Object.isFrozen(review.createAuditEvent("review-approved", { entityId: recipe.id })), "audit events are immutable");

  const nextVersion = review.createNextVersion(context.version, { ...recipe, name: "Updated Bowl" }, "author-2", "Updated wording");
  assert.strictEqual(nextVersion.version, 5, "editing approved content creates a new version");
  assert.notStrictEqual(nextVersion.contentHash, context.version.contentHash, "content edit changes content hash");
  assert.strictEqual(context.version.version, 4, "published snapshot version remains unchanged");
  assert(!issueCodes(review.evaluateRecipe(recipe, { ...context, version: nextVersion }).issues).includes("published-snapshot-mutated"), "new draft does not mutate previous version");

  const frMachine = review.createTranslationRecord({ entityId: recipe.id, targetLocale: "fr-CA", sourceVersion: context.version.version, sourceContentHash: context.version.contentHash, translationMethod: "machine", translatedContent: "Brouillon", segments: [review.createTranslationSegment({ id: "fr-step", fieldPath: "steps[0]", status: "machine-draft" })] });
  assert(issueCodes(review.evaluateRecipe(recipe, { ...context, requestedLocales: ["fr-CA"], translations: [frMachine] })).includes(review.PUBLICATION_ISSUE_CODES.MACHINE_TRANSLATION_UNREVIEWED), "machine-draft translation blocks publication");
  const rejectedFr = { ...frMachine, status: "rejected", segments: [{ ...frMachine.segments[0], status: "rejected" }] };
  assert(issueCodes(review.evaluateRecipe(recipe, { ...context, requestedLocales: ["fr-CA"], translations: [rejectedFr] })).includes(review.PUBLICATION_ISSUE_CODES.TRANSLATION_REJECTED), "rejected translation blocks publication");
  const outdatedZh = review.createTranslationRecord({ entityId: recipe.id, targetLocale: "zh-CN", sourceVersion: 3, sourceContentHash: "old", status: "approved", translatedContent: "旧", humanReviewedBy: "language-1", humanReviewedAt: "2026-08-19T00:00:00Z", approvedBy: "language-1", approvedAt: "2026-08-19T00:00:00Z", segments: [review.createTranslationSegment({ id: "zh-step", fieldPath: "steps[0]", sourceVersion: 3, status: "approved" })] });
  assert(issueCodes(review.evaluateRecipe(recipe, { ...context, requestedLocales: ["zh-CN"], translations: [outdatedZh] })).includes(review.PUBLICATION_ISSUE_CODES.TRANSLATION_OUTDATED), "source version mismatch marks translation outdated");
  const safetyMachineZh = review.createTranslationRecord({ entityId: recipe.id, targetLocale: "zh-CN", sourceVersion: context.version.version, sourceContentHash: context.version.contentHash, translationMethod: "machine", status: "machine-draft", containsSafetyCriticalContent: true, translatedContent: "加热至至少74°C / 165°F。" });
  assert(issueCodes(review.evaluateRecipe(recipe, { ...context, requestedLocales: ["zh-CN"], translations: [safetyMachineZh] })).includes(review.PUBLICATION_ISSUE_CODES.SAFETY_TRANSLATION_UNREVIEWED), "AI safety translation requires safety review");
  const approvedFrMissingMeta = { ...frMachine, status: "approved", translationMethod: "human", segments: [{ ...frMachine.segments[0], status: "approved" }] };
  assert(issueCodes(review.evaluateRecipe(recipe, { ...context, requestedLocales: ["fr-CA"], translations: [approvedFrMissingMeta] })).includes(review.PUBLICATION_ISSUE_CODES.REVIEW_APPROVAL_MISSING), "approved translation requires reviewer metadata");
  const approvedFr = review.createTranslationRecord({ entityId: recipe.id, targetLocale: "fr-CA", sourceVersion: context.version.version, sourceContentHash: context.version.contentHash, status: "approved", translationMethod: "human", translatedContent: "Bol aux epinards", humanReviewedBy: "language-1", humanReviewedAt: "2026-08-19T00:00:00Z", approvedBy: "language-1", approvedAt: "2026-08-19T00:00:00Z", segments: [review.createTranslationSegment({ id: "fr-title", fieldPath: "title", sourceVersion: 4, status: "approved" })] });
  assert.strictEqual(review.evaluateRecipe(recipe, { ...context, requestedLocales: ["fr-CA"], translations: [approvedFr] }).blockedLocales.length, 0, "approved standard translation can publish");

  const approvedEnZhFrenchBlocked = review.evaluateRecipe(recipe, { ...context, requestedLocales: ["en-CA", "zh-CN", "fr-CA"], translations: [{ ...approvedFr, targetLocale: "zh-CN", id: "zh-ok" }, frMachine] });
  assert(approvedEnZhFrenchBlocked.approvedLocales.includes("en-CA"), "source locale can be approved");
  assert(approvedEnZhFrenchBlocked.approvedLocales.includes("zh-CN"), "approved locale can be included");
  assert(approvedEnZhFrenchBlocked.blockedLocales.some((locale) => locale.locale === "fr-CA"), "blocked locale is excluded");

  const segments = [
    review.createTranslationSegment({ id: "a", fieldPath: "title", status: "approved" }),
    review.createTranslationSegment({ id: "b", fieldPath: "allergyWarnings[0]", status: "rejected", criticality: "allergy" })
  ];
  assert.strictEqual(review.getMostRestrictiveTranslationStatus(segments), review.TRANSLATION_STATUSES.REJECTED, "segment rejection blocks overall translation approval");
  const outdatedList = review.markTranslationsOutdatedForSourceChange([approvedFr], nextVersion);
  assert.strictEqual(outdatedList[0].status, review.TRANSLATION_STATUSES.OUTDATED, "source changes mark older translations outdated");

  const quantityDiff = review.describeDiff({ quantity: "1", unit: "tsp" }, { quantity: "1", unit: "tbsp" });
  assert(quantityDiff.some((change) => change.description.includes("Previous: 1 tsp") && change.description.includes("Current: 1 tbsp")), "quantity diff names structured quantity and unit changes");
  const metadataDiff = review.describeDiff({ text: "same" }, { text: "same" });
  assert.strictEqual(metadataDiff.length, 0, "unchanged administrative metadata need not alter content version");

  const legacy = review.migrateLegacyRecipe({ id: "legacy-pasta", name: "Legacy Pasta", ingredients: ["pasta"], steps: ["Cook as usual."], cookingTime: 10 });
  assert.strictEqual(legacy.legacyPublished, true, "legacy recipe remains published");
  assert.strictEqual(legacy.reviewMarker, "legacy-review-required", "legacy recipe enters remediation queue");
  assert(legacy.remediationIssues.length > 0, "legacy migration flags missing review data");
  assert.strictEqual(review.migrateLegacyRecipe({ id: "legacy-pasta", name: "Legacy Pasta" }).recipeId, "legacy-pasta", "legacy migration is idempotent for same recipe");

  const ingredientTermIssues = review.validateIngredientTermPublication({ id: "term-coriander", canonicalName: "Coriander", aliases: [], allergenIds: [], reviewStatus: "draft" });
  assert(issueCodes(ingredientTermIssues).includes(review.PUBLICATION_ISSUE_CODES.INGREDIENT_TERM_UNREVIEWED), "new ingredient term must be reviewed before publishable use");
  const techniqueChange = review.evaluateTechniqueDefinitionChange({ id: "fry", name: "Fry", plainLanguageDefinition: "Cook in a pan." }, { id: "fry", name: "Deep fry", plainLanguageDefinition: "Cook in deep hot oil at a controlled temperature." });
  assert.strictEqual(techniqueChange.safetyReviewRequired, true, "safety-sensitive technique change requires safety review");
  assert.strictEqual(techniqueChange.affectedTranslationsOutdated, true, "technique safety change invalidates translations");

  const approvedWrongHash = review.createApproval({ entityType: "recipe", entityId: recipe.id, entityVersion: context.version.version, contentHash: "wrong", reviewKind: "accessibility", reviewerId: "access-1", reviewerRole: "accessibility-reviewer" });
  assert(issueCodes(review.evaluateRecipe(recipe, { ...context, approvals: [context.approvals[0], approvedWrongHash] })).includes(review.PUBLICATION_ISSUE_CODES.REVIEW_APPROVAL_MISSING), "content-hash mismatch invalidates approval");
  const wrongVersionApproval = review.createApproval({ entityType: "recipe", entityId: recipe.id, entityVersion: 3, contentHash: context.version.contentHash, reviewKind: "accessibility", reviewerId: "access-1", reviewerRole: "accessibility-reviewer" });
  assert(issueCodes(review.evaluateRecipe(recipe, { ...context, approvals: [context.approvals[0], wrongVersionApproval] })).includes(review.PUBLICATION_ISSUE_CODES.REVIEW_APPROVAL_MISSING), "wrong-version approval is rejected");
  assert.strictEqual(review.publishRecipe(validRecipe({ version: 4 }), { ...context, publisher, version: { ...context.version, status: "archived" } }).ok, false, "archived content cannot publish");
  assert.strictEqual(review.publishRecipe(validRecipe({ version: 4 }), { ...context, publisher, translations: [rejectedFr], requestedLocales: ["fr-CA"] }).ok, false, "rejected locale blocks requested publication");

  const dashboard = review.buildReviewDashboardModel([
    { reviewKind: "accessibility", status: "unassigned" },
    { reviewKind: "language", status: "machine-draft" },
    { reviewKind: "food-safety", status: "outdated" },
    { reviewKind: "content-completeness", status: "approved" },
    { reviewKind: "language", status: "changes-requested" },
    { reviewKind: "language", reviewedAt: "2026-08-19T00:00:00Z" }
  ]);
  assert.strictEqual(dashboard.accessibilityReview.length, 1, "dashboard groups accessibility review");
  assert.strictEqual(dashboard.languageReview.length, 3, "dashboard groups language review");
  assert.strictEqual(dashboard.safetyReview.length, 1, "dashboard groups safety review");
  assert.strictEqual(dashboard.machineDrafts.length, 1, "dashboard groups machine drafts");
  assert.strictEqual(dashboard.readyToPublish.length, 1, "dashboard groups ready to publish");
  assert.strictEqual(dashboard.recentlyReviewed.length, 1, "dashboard groups recently reviewed");

  assert.strictEqual(review.contentHash({ value: "1.5", unit: "L" }), review.contentHash({ unit: "L", value: "1.5" }), "content hash is stable across object key order");
  assert(Number.isNaN(Number("1,5")), "French comma display is not a JavaScript canonical number");
  assertBlocks(validRecipe({ structuredIngredients: [{ ingredientId: "milk", displayName: "milk", canonicalQuantity: { value: "1,5", unit: "L" } }] }), review.PUBLICATION_ISSUE_CODES.QUANTITY_NOT_STRUCTURED);
  assert.strictEqual(review.createTranslationSegment({ id: "date", fieldPath: "foodDateType", sourceText: "Best before", translatedText: "Use by", criticality: "expiration", status: "human-review-required" }).criticality, "expiration", "best-before and use-by terminology stays reviewable");
  assert.strictEqual(review.createTranslationRecord({ entityId: "allergy", targetLocale: "fr-CA", containsSafetyCriticalContent: true }).requiredReviewKinds.includes("food-safety"), true, "allergen translations require safety review");

  console.log("Step 67 content review governance tests passed.");
})();
