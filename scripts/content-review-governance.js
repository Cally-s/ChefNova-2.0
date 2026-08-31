/* Chef Nova content, accessibility, language, and publication governance. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaContentReview = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const REVIEWABLE_CONTENT_TYPES = Object.freeze(["recipe", "recipe-step", "ingredient-term", "technique-definition", "safety-warning", "allergy-warning", "image", "video", "caption-track", "transcript", "translation"]);
  const CONTENT_REVIEW_STATUSES = Object.freeze({
    DRAFT: "draft",
    AUTOMATED_CHECKS_FAILED: "automated-checks-failed",
    READY_FOR_REVIEW: "ready-for-review",
    ACCESSIBILITY_REVIEW_REQUIRED: "accessibility-review-required",
    LANGUAGE_REVIEW_REQUIRED: "language-review-required",
    SAFETY_REVIEW_REQUIRED: "safety-review-required",
    CHANGES_REQUESTED: "changes-requested",
    APPROVED: "approved",
    PUBLISHED: "published",
    OUTDATED: "outdated",
    ARCHIVED: "archived"
  });
  const TRANSLATION_STATUSES = Object.freeze({
    MISSING: "missing",
    MACHINE_DRAFT: "machine-draft",
    HUMAN_REVIEW_REQUIRED: "human-review-required",
    SAFETY_REVIEW_REQUIRED: "safety-review-required",
    APPROVED: "approved",
    OUTDATED: "outdated",
    REJECTED: "rejected"
  });
  const REVIEW_KINDS = Object.freeze(["content-completeness", "accessibility", "language", "food-safety"]);
  const CONTENT_ROLES = Object.freeze(["author", "translator", "accessibility-reviewer", "language-reviewer", "safety-reviewer", "publisher", "administrator"]);
  const PUBLICATION_ISSUE_CODES = Object.freeze({
    INGREDIENT_ID_MISSING: "ingredient-id-missing",
    INGREDIENT_AMBIGUOUS: "ingredient-ambiguous",
    QUANTITY_NOT_STRUCTURED: "quantity-not-structured",
    STEP_QUANTITY_MISSING: "step-quantity-missing",
    STEP_QUANTITY_EXCESS: "step-quantity-excess",
    PLAIN_LANGUAGE_MISSING: "plain-language-missing",
    MULTIPLE_INSTRUCTIONS_UNRESOLVED: "multiple-instructions-unresolved",
    COOKING_TIME_MISSING: "cooking-time-missing",
    PREPARATION_TIME_MISSING: "preparation-time-missing",
    DONENESS_CUE_MISSING: "doneness-cue-missing",
    SAFETY_TEMPERATURE_MISSING: "safety-temperature-missing",
    APPLIANCE_REQUIREMENT_MISSING: "appliance-requirement-missing",
    ALLERGY_INFORMATION_MISSING: "allergy-information-missing",
    ALT_TEXT_MISSING: "alt-text-missing",
    ALT_TEXT_INSUFFICIENT: "alt-text-insufficient",
    CAPTIONS_MISSING: "captions-missing",
    CAPTIONS_UNREVIEWED: "captions-unreviewed",
    TRANSCRIPT_MISSING: "transcript-missing",
    TRANSCRIPT_UNREVIEWED: "transcript-unreviewed",
    TRANSLATION_MISSING: "translation-missing",
    TRANSLATION_OUTDATED: "translation-outdated",
    TRANSLATION_REJECTED: "translation-rejected",
    MACHINE_TRANSLATION_UNREVIEWED: "machine-translation-unreviewed",
    SAFETY_TRANSLATION_UNREVIEWED: "safety-translation-unreviewed",
    REVIEW_APPROVAL_MISSING: "review-approval-missing",
    REVIEW_APPROVAL_HASH_MISMATCH: "review-approval-hash-mismatch",
    REVIEW_APPROVAL_WRONG_VERSION: "review-approval-wrong-version",
    REVIEWER_UNAUTHORIZED: "reviewer-unauthorized",
    SEPARATION_OF_DUTIES_VIOLATION: "separation-of-duties-violation",
    CONTENT_ARCHIVED: "content-archived",
    CONTENT_REJECTED: "content-rejected",
    INGREDIENT_TERM_UNREVIEWED: "ingredient-term-unreviewed",
    TECHNIQUE_REVIEW_REQUIRED: "technique-review-required",
    GLOSSARY_INCONSISTENT: "glossary-inconsistent"
  });
  const SAFETY_CRITICAL_CATEGORIES = Object.freeze(["allergen", "cooking-temperature", "expiration", "storage", "reheating", "thawing", "quantity-unit", "food-safety"]);
  const AMBIGUOUS_INGREDIENT_TERMS = Object.freeze({
    coriander: ["coriander-leaves", "coriander-seeds-whole", "coriander-seed-ground"],
    parsley: ["parsley-fresh", "parsley-dried"],
    coconut: ["coconut-milk", "coconut-cream"],
    "baking powder": ["baking-powder"],
    "baking soda": ["baking-soda"]
  });
  const CONTENT_TRANSITIONS = Object.freeze({
    [CONTENT_REVIEW_STATUSES.DRAFT]: [CONTENT_REVIEW_STATUSES.AUTOMATED_CHECKS_FAILED, CONTENT_REVIEW_STATUSES.READY_FOR_REVIEW, CONTENT_REVIEW_STATUSES.ARCHIVED],
    [CONTENT_REVIEW_STATUSES.AUTOMATED_CHECKS_FAILED]: [CONTENT_REVIEW_STATUSES.DRAFT, CONTENT_REVIEW_STATUSES.READY_FOR_REVIEW],
    [CONTENT_REVIEW_STATUSES.READY_FOR_REVIEW]: [CONTENT_REVIEW_STATUSES.ACCESSIBILITY_REVIEW_REQUIRED, CONTENT_REVIEW_STATUSES.LANGUAGE_REVIEW_REQUIRED, CONTENT_REVIEW_STATUSES.SAFETY_REVIEW_REQUIRED, CONTENT_REVIEW_STATUSES.CHANGES_REQUESTED, CONTENT_REVIEW_STATUSES.APPROVED],
    [CONTENT_REVIEW_STATUSES.ACCESSIBILITY_REVIEW_REQUIRED]: [CONTENT_REVIEW_STATUSES.LANGUAGE_REVIEW_REQUIRED, CONTENT_REVIEW_STATUSES.SAFETY_REVIEW_REQUIRED, CONTENT_REVIEW_STATUSES.CHANGES_REQUESTED, CONTENT_REVIEW_STATUSES.APPROVED],
    [CONTENT_REVIEW_STATUSES.LANGUAGE_REVIEW_REQUIRED]: [CONTENT_REVIEW_STATUSES.SAFETY_REVIEW_REQUIRED, CONTENT_REVIEW_STATUSES.CHANGES_REQUESTED, CONTENT_REVIEW_STATUSES.APPROVED],
    [CONTENT_REVIEW_STATUSES.SAFETY_REVIEW_REQUIRED]: [CONTENT_REVIEW_STATUSES.CHANGES_REQUESTED, CONTENT_REVIEW_STATUSES.APPROVED],
    [CONTENT_REVIEW_STATUSES.CHANGES_REQUESTED]: [CONTENT_REVIEW_STATUSES.DRAFT, CONTENT_REVIEW_STATUSES.ARCHIVED],
    [CONTENT_REVIEW_STATUSES.APPROVED]: [CONTENT_REVIEW_STATUSES.PUBLISHED, CONTENT_REVIEW_STATUSES.OUTDATED, CONTENT_REVIEW_STATUSES.ARCHIVED],
    [CONTENT_REVIEW_STATUSES.PUBLISHED]: [CONTENT_REVIEW_STATUSES.OUTDATED, CONTENT_REVIEW_STATUSES.ARCHIVED],
    [CONTENT_REVIEW_STATUSES.OUTDATED]: [CONTENT_REVIEW_STATUSES.DRAFT, CONTENT_REVIEW_STATUSES.READY_FOR_REVIEW, CONTENT_REVIEW_STATUSES.ARCHIVED],
    [CONTENT_REVIEW_STATUSES.ARCHIVED]: []
  });
  const TRANSLATION_TRANSITIONS = Object.freeze({
    [TRANSLATION_STATUSES.MISSING]: [TRANSLATION_STATUSES.MACHINE_DRAFT, TRANSLATION_STATUSES.HUMAN_REVIEW_REQUIRED],
    [TRANSLATION_STATUSES.MACHINE_DRAFT]: [TRANSLATION_STATUSES.HUMAN_REVIEW_REQUIRED, TRANSLATION_STATUSES.REJECTED],
    [TRANSLATION_STATUSES.HUMAN_REVIEW_REQUIRED]: [TRANSLATION_STATUSES.SAFETY_REVIEW_REQUIRED, TRANSLATION_STATUSES.APPROVED, TRANSLATION_STATUSES.REJECTED],
    [TRANSLATION_STATUSES.SAFETY_REVIEW_REQUIRED]: [TRANSLATION_STATUSES.APPROVED, TRANSLATION_STATUSES.REJECTED],
    [TRANSLATION_STATUSES.APPROVED]: [TRANSLATION_STATUSES.OUTDATED],
    [TRANSLATION_STATUSES.OUTDATED]: [TRANSLATION_STATUSES.HUMAN_REVIEW_REQUIRED, TRANSLATION_STATUSES.SAFETY_REVIEW_REQUIRED],
    [TRANSLATION_STATUSES.REJECTED]: [TRANSLATION_STATUSES.MACHINE_DRAFT, TRANSLATION_STATUSES.HUMAN_REVIEW_REQUIRED]
  });

  function stableStringify(value) {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }

  function contentHash(value) {
    const text = stableStringify(value || {});
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    return `h${Math.abs(hash).toString(36)}`;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function createIssue(code, options = {}) {
    return {
      code,
      severity: options.severity || "error",
      blocksPublication: options.blocksPublication !== false,
      entityType: options.entityType || "recipe",
      entityId: options.entityId || "",
      fieldPath: options.fieldPath || "",
      locale: options.locale || "",
      requiredReviewKind: options.requiredReviewKind || "",
      messageKey: options.messageKey || code,
      messageParameters: options.messageParameters || {},
      suggestedAction: options.suggestedAction || ""
    };
  }

  function createReviewableVersion({ entityId, entityType = "recipe", version = 1, sourceLocale = "en-CA", requiredReviews = ["content-completeness", "accessibility"], createdBy = "unknown", createdAt = nowIso(), changeSummary = "", content = {}, status = CONTENT_REVIEW_STATUSES.DRAFT } = {}) {
    return { id: `${entityType}:${entityId}:v${version}`, entityId, entityType, version, sourceLocale, status, requiredReviews: [...new Set(requiredReviews)], createdBy, createdAt, changeSummary, contentHash: contentHash(content), reviewHistory: [], publicationStatus: "unpublished" };
  }

  function createApproval({ entityType = "recipe", entityId, entityVersion, contentHash: hash, reviewKind, locale = "", reviewerId, reviewerRole, decision = "approved", notes = "", createdAt = nowIso() } = {}) {
    return Object.freeze({ id: `approval:${entityType}:${entityId}:v${entityVersion}:${reviewKind}:${locale || "source"}:${reviewerId}:${createdAt}`, entityType, entityId, entityVersion, contentHash: hash, reviewKind, locale, reviewerId, reviewerRole, decision, notes, createdAt });
  }

  function createTranslationRecord({ id, entityType = "translation", entityId, sourceLocale = "en-CA", targetLocale, sourceVersion = 1, sourceContentHash = "", translationVersion = 1, translatedContent = "", status, translationMethod = "human", containsSafetyCriticalContent = false, requiredReviewKinds, createdBy = "unknown", createdAt = nowIso(), updatedAt = nowIso(), humanReviewedBy, humanReviewedAt, safetyReviewedBy, safetyReviewedAt, approvedBy, approvedAt, reviewerNotes = "", segments = [] } = {}) {
    const safety = containsSafetyCriticalContent || segments.some((segment) => isSafetyCriticalCriticality(segment.criticality));
    const defaultStatus = translationMethod === "machine" || translationMethod === "machine-assisted" ? TRANSLATION_STATUSES.MACHINE_DRAFT : TRANSLATION_STATUSES.HUMAN_REVIEW_REQUIRED;
    return {
      id: id || `translation:${entityId}:${targetLocale}:v${translationVersion}`,
      entityType,
      entityId,
      sourceLocale,
      targetLocale,
      sourceVersion,
      sourceContentHash,
      translationVersion,
      translatedContent,
      status: status || defaultStatus,
      translationMethod,
      containsSafetyCriticalContent: safety,
      requiredReviewKinds: requiredReviewKinds || (safety ? ["language", "food-safety"] : ["language"]),
      createdBy,
      createdAt,
      updatedAt,
      humanReviewedBy,
      humanReviewedAt,
      safetyReviewedBy,
      safetyReviewedAt,
      approvedBy,
      approvedAt,
      reviewerNotes,
      segments
    };
  }

  function createTranslationSegment({ id, fieldPath, sourceText = "", translatedText = "", sourceVersion = 1, status = TRANSLATION_STATUSES.HUMAN_REVIEW_REQUIRED, criticality = "standard", reviewerNotes = "" } = {}) {
    return { id, fieldPath, sourceText, translatedText, sourceVersion, status, criticality, reviewerNotes };
  }

  function isSafetyCriticalCriticality(criticality) {
    return ["allergy", "food-safety", "temperature", "storage", "expiration", "quantity"].includes(criticality) || SAFETY_CRITICAL_CATEGORIES.includes(criticality);
  }

  function getMostRestrictiveTranslationStatus(segments = []) {
    const statuses = segments.map((segment) => segment.status);
    if (!segments.length || statuses.includes(TRANSLATION_STATUSES.MISSING)) return TRANSLATION_STATUSES.MISSING;
    if (statuses.includes(TRANSLATION_STATUSES.REJECTED)) return TRANSLATION_STATUSES.REJECTED;
    if (statuses.includes(TRANSLATION_STATUSES.OUTDATED)) return TRANSLATION_STATUSES.OUTDATED;
    if (statuses.includes(TRANSLATION_STATUSES.MACHINE_DRAFT)) return TRANSLATION_STATUSES.MACHINE_DRAFT;
    if (statuses.includes(TRANSLATION_STATUSES.SAFETY_REVIEW_REQUIRED)) return TRANSLATION_STATUSES.SAFETY_REVIEW_REQUIRED;
    if (statuses.includes(TRANSLATION_STATUSES.HUMAN_REVIEW_REQUIRED)) return TRANSLATION_STATUSES.HUMAN_REVIEW_REQUIRED;
    return TRANSLATION_STATUSES.APPROVED;
  }

  function transitionContentStatus(current, next) {
    return Boolean(CONTENT_TRANSITIONS[current]?.includes(next));
  }

  function transitionTranslationStatus(current, next, options = {}) {
    if (!TRANSLATION_TRANSITIONS[current]?.includes(next)) return false;
    if (current === TRANSLATION_STATUSES.MACHINE_DRAFT && next === TRANSLATION_STATUSES.APPROVED) return false;
    if (next === TRANSLATION_STATUSES.APPROVED && options.machineDraftWithoutHumanReview) return false;
    return true;
  }

  function userHasRole(user = {}, role) {
    return (user.roles || []).includes(role) || (user.roles || []).includes("administrator");
  }

  function canReview(user = {}, reviewKind, options = {}) {
    if (reviewKind === "accessibility") return userHasRole(user, "accessibility-reviewer");
    if (reviewKind === "language") {
      if (!userHasRole(user, "language-reviewer") && !userHasRole(user, "translator")) return false;
      if (!options.locale) return true;
      return !Array.isArray(user.authorizedLocales) || user.authorizedLocales.includes(options.locale);
    }
    if (reviewKind === "food-safety") return userHasRole(user, "safety-reviewer");
    if (reviewKind === "content-completeness") return userHasRole(user, "publisher") || userHasRole(user, "administrator") || userHasRole(user, "accessibility-reviewer");
    return false;
  }

  function canApproveContent(user = {}, version = {}, reviewKind, options = {}) {
    if (!canReview(user, reviewKind, options)) return false;
    if (reviewKind === "food-safety" && version.createdBy && version.createdBy === user.id) return false;
    if (options.creationMethod === "machine" && reviewKind === "food-safety" && !userHasRole(user, "safety-reviewer")) return false;
    return true;
  }

  function createAuditEvent(action, options = {}) {
    return Object.freeze({ id: `audit:${action}:${options.entityType || "recipe"}:${options.entityId || ""}:v${options.entityVersion || ""}:${nowIso()}`, entityType: options.entityType || "recipe", entityId: options.entityId || "", entityVersion: options.entityVersion, action, actorId: options.actorId || "", actorRole: options.actorRole || "", previousStatus: options.previousStatus || "", nextStatus: options.nextStatus || "", locale: options.locale || "", metadata: options.metadata || {}, createdAt: nowIso() });
  }

  function normalizeIngredient(ingredient) {
    if (typeof ingredient === "string") return { name: ingredient, ingredientId: "", canonicalQuantity: null, quantity: "", unit: "" };
    const canonicalQuantity = ingredient.canonicalQuantity || (ingredient.quantity !== undefined && ingredient.unit ? { value: String(ingredient.quantity), unit: ingredient.unit } : null);
    return { ...ingredient, name: ingredient.displayName || ingredient.name || ingredient.displayText || "", ingredientId: ingredient.ingredientId || ingredient.id || "", canonicalQuantity };
  }

  function isAmbiguousIngredient(ingredient = {}, ingredientTerms = []) {
    if (ingredient.ingredientId) return false;
    const name = String(ingredient.name || "").trim().toLowerCase();
    if (AMBIGUOUS_INGREDIENT_TERMS[name]) return true;
    const matches = ingredientTerms.filter((term) => term.aliases?.some((alias) => String(alias.term).toLowerCase() === name) || String(term.canonicalName).toLowerCase() === name);
    return matches.length > 1;
  }

  function isValidCanonicalQuantity(quantity) {
    if (!quantity || quantity.value === undefined || !quantity.unit) return false;
    const number = Number(String(quantity.value).replace(",", "."));
    return Number.isFinite(number) && number > 0 && !String(quantity.value).includes(",");
  }

  function isPlainLanguageStep(stepText) {
    const text = String(stepText || "").trim().toLowerCase();
    if (!text) return false;
    return !/(proceed|as before|cook as usual|prepare normally|until ready|heat thoroughly|do the same|continue as before|use the mixture|add the rest)/.test(text);
  }

  function getStepText(step) {
    return typeof step === "string" ? step : step.primaryInstruction || step.instruction || step.text || "";
  }

  function recipeRequiresSafetyTemperature(recipe = {}) {
    const ingredients = [...(recipe.structuredIngredients || []), ...(recipe.ingredients || [])].map(normalizeIngredient).map((ingredient) => String(ingredient.name || ingredient.ingredientId).toLowerCase());
    const text = (recipe.reviewSteps || recipe.steps || []).map(getStepText).join(" ").toLowerCase();
    return ingredients.some((name) => /(chicken|turkey|beef|pork|fish|salmon|egg|eggs|seafood|meat)/.test(name)) || /(internal temperature|cook properly|heat through|reheat|thaw)/.test(text);
  }

  function recipeRequiresAppliance(recipe = {}) {
    return (recipe.reviewSteps || recipe.steps || []).map(getStepText).join(" ").toLowerCase().match(/bake|blend|microwave|air fry|pressure cook|grill|stovetop|stove|oven/);
  }

  function stepRequiresDonenessCue(step) {
    const text = getStepText(step).toLowerCase();
    return /cook|bake|simmer|boil|fry|roast|grill|heat/.test(text) && !/for \d+/.test(text);
  }

  function hasApprovedReview(approvals = [], version, reviewKind, locale = "") {
    return approvals.some((approval) => approval.entityId === version.entityId && approval.entityVersion === version.version && approval.contentHash === version.contentHash && approval.reviewKind === reviewKind && (approval.locale || "") === (locale || "") && approval.decision === "approved" && approval.reviewerId && approval.reviewerRole);
  }

  function validateRecipePublication(recipe = {}, context = {}) {
    const issues = [];
    const entityId = recipe.id || "recipe";
    const version = context.version || createReviewableVersion({ entityId, version: recipe.version || recipe.recipeVersion || 1, createdBy: recipe.createdBy || "legacy", content: recipe });
    const ingredients = (recipe.structuredIngredients?.length ? recipe.structuredIngredients : recipe.ingredients || []).map(normalizeIngredient);
    const ingredientTerms = context.ingredientTerms || [];
    ingredients.forEach((ingredient, index) => {
      const path = `ingredients[${index}]`;
      if (!ingredient.ingredientId) issues.push(createIssue(PUBLICATION_ISSUE_CODES.INGREDIENT_ID_MISSING, { entityId, fieldPath: `${path}.ingredientId`, messageKey: "Ingredient ID is missing.", suggestedAction: "Choose a structured ingredient." }));
      if (isAmbiguousIngredient(ingredient, ingredientTerms)) issues.push(createIssue(PUBLICATION_ISSUE_CODES.INGREDIENT_AMBIGUOUS, { entityId, fieldPath: `${path}.ingredientId`, messageKey: `${ingredient.name || "Ingredient"} is ambiguous.`, suggestedAction: "Select the exact ingredient term." }));
      if (!ingredient.canonicalQuantity) issues.push(createIssue(PUBLICATION_ISSUE_CODES.QUANTITY_NOT_STRUCTURED, { entityId, fieldPath: `${path}.canonicalQuantity`, messageKey: "Structured quantity is missing." }));
      else if (!isValidCanonicalQuantity(ingredient.canonicalQuantity)) issues.push(createIssue(PUBLICATION_ISSUE_CODES.QUANTITY_NOT_STRUCTURED, { entityId, fieldPath: `${path}.canonicalQuantity`, messageKey: "Canonical quantity is invalid." }));
    });
    const steps = recipe.reviewSteps || recipe.steps || [];
    steps.forEach((step, index) => {
      const path = `steps[${index}]`;
      if (!isPlainLanguageStep(getStepText(step))) issues.push(createIssue(PUBLICATION_ISSUE_CODES.PLAIN_LANGUAGE_MISSING, { entityId, entityType: "recipe-step", fieldPath: `${path}.primaryInstruction`, requiredReviewKind: "accessibility", messageKey: `Step ${index + 1} has no approved plain-language instruction.`, suggestedAction: `Open Step ${index + 1}.` }));
      if (typeof step === "object") {
        if (!Array.isArray(step.ingredientUsages) || !step.ingredientUsages.length) issues.push(createIssue(PUBLICATION_ISSUE_CODES.STEP_QUANTITY_MISSING, { entityId, entityType: "recipe-step", fieldPath: `${path}.ingredientUsages`, messageKey: `Step ${index + 1} has no step-specific ingredient amount.` }));
        if (stepRequiresDonenessCue(step) && (!Array.isArray(step.donenessCues) || !step.donenessCues.length)) issues.push(createIssue(PUBLICATION_ISSUE_CODES.DONENESS_CUE_MISSING, { entityId, entityType: "recipe-step", fieldPath: `${path}.donenessCues`, messageKey: `Step ${index + 1} needs a doneness cue.` }));
      }
    });
    const ingredientTotals = new Map(ingredients.filter((ingredient) => isValidCanonicalQuantity(ingredient.canonicalQuantity)).map((ingredient) => [ingredient.ingredientId, { total: Number(ingredient.canonicalQuantity.value), unit: ingredient.canonicalQuantity.unit }]));
    const usageTotals = new Map();
    steps.forEach((step) => (step.ingredientUsages || []).forEach((usage) => {
      if (!usage.ingredientId || !isValidCanonicalQuantity(usage.canonicalQuantity)) return;
      const key = `${usage.ingredientId}:${usage.canonicalQuantity.unit}`;
      usageTotals.set(key, (usageTotals.get(key) || 0) + Number(usage.canonicalQuantity.value));
    }));
    usageTotals.forEach((used, key) => {
      const [ingredientId, unit] = key.split(":");
      const planned = ingredientTotals.get(ingredientId);
      const explained = recipe.quantityExceptionExplanations?.[ingredientId];
      if (planned && planned.unit === unit && used > planned.total && !explained) issues.push(createIssue(PUBLICATION_ISSUE_CODES.STEP_QUANTITY_EXCESS, { entityId, fieldPath: `steps.ingredientUsages.${ingredientId}`, messageKey: "Step quantities exceed the recipe quantity without an explanation." }));
    });
    if (recipe.preparationTime === undefined && recipe.prepTime === undefined && recipe.timing?.preparationMinutes === undefined) issues.push(createIssue(PUBLICATION_ISSUE_CODES.PREPARATION_TIME_MISSING, { entityId, fieldPath: "timing.preparationMinutes", messageKey: "Preparation time is missing." }));
    if (recipe.cookingTime === undefined && recipe.cookTime === undefined && recipe.timing?.activeCookingMinutes === undefined) issues.push(createIssue(PUBLICATION_ISSUE_CODES.COOKING_TIME_MISSING, { entityId, fieldPath: "timing.activeCookingMinutes", messageKey: "Cooking time is missing." }));
    if (recipeRequiresSafetyTemperature(recipe) && !(recipe.safetyTemperatureReferences || recipe.safetyThresholdIds || []).length) issues.push(createIssue(PUBLICATION_ISSUE_CODES.SAFETY_TEMPERATURE_MISSING, { entityId, fieldPath: "safetyTemperatureReferences", requiredReviewKind: "food-safety", messageKey: "Safety temperature is missing." }));
    if (recipeRequiresAppliance(recipe) && !(recipe.applianceRequirements || recipe.appliances || recipe.equipment || []).length) issues.push(createIssue(PUBLICATION_ISSUE_CODES.APPLIANCE_REQUIREMENT_MISSING, { entityId, fieldPath: "applianceRequirements", messageKey: "Appliance requirement is missing." }));
    const allergyInfo = recipe.allergyInformation || recipe.allergyWarnings || recipe.allergies;
    if (!allergyInfo || (Array.isArray(allergyInfo) && !allergyInfo.length)) issues.push(createIssue(PUBLICATION_ISSUE_CODES.ALLERGY_INFORMATION_MISSING, { entityId, fieldPath: "allergyInformation", requiredReviewKind: "food-safety", messageKey: "Allergy information is missing." }));
    (recipe.media?.images || []).forEach((image, index) => {
      if (image.purpose === "decorative" && image.altText === "") return;
      if (["meaningful", "instructional", "doneness-reference"].includes(image.purpose) && !image.altText) issues.push(createIssue(PUBLICATION_ISSUE_CODES.ALT_TEXT_MISSING, { entityId, entityType: "image", fieldPath: `media.images[${index}].altText`, requiredReviewKind: "accessibility", messageKey: "Meaningful image alternative text is missing." }));
      if (image.purpose === "doneness-reference" && /^image of /i.test(image.altText || "")) issues.push(createIssue(PUBLICATION_ISSUE_CODES.ALT_TEXT_INSUFFICIENT, { entityId, entityType: "image", fieldPath: `media.images[${index}].altText`, requiredReviewKind: "accessibility", messageKey: "Doneness image alt text must describe the readiness cue." }));
    });
    (recipe.media?.videos || []).forEach((video, index) => {
      if (video.excludedFromPublication) return;
      if (!video.captionTrack) issues.push(createIssue(PUBLICATION_ISSUE_CODES.CAPTIONS_MISSING, { entityId, entityType: "video", fieldPath: `media.videos[${index}].captionTrack`, requiredReviewKind: "accessibility", messageKey: "Instructional video captions are missing." }));
      else if (video.captionTrack.status !== "approved") issues.push(createIssue(PUBLICATION_ISSUE_CODES.CAPTIONS_UNREVIEWED, { entityId, entityType: "caption-track", fieldPath: `media.videos[${index}].captionTrack.status`, requiredReviewKind: "accessibility", messageKey: "Instructional video captions are not reviewed." }));
      if (!video.transcript) issues.push(createIssue(PUBLICATION_ISSUE_CODES.TRANSCRIPT_MISSING, { entityId, entityType: "video", fieldPath: `media.videos[${index}].transcript`, requiredReviewKind: "accessibility", messageKey: "Instructional video transcript is missing." }));
      else if (video.transcript.status !== "approved") issues.push(createIssue(PUBLICATION_ISSUE_CODES.TRANSCRIPT_UNREVIEWED, { entityId, entityType: "transcript", fieldPath: `media.videos[${index}].transcript.status`, requiredReviewKind: "accessibility", messageKey: "Instructional video transcript is not reviewed." }));
    });
    const approvals = context.approvals || [];
    (version.requiredReviews || ["content-completeness", "accessibility"]).forEach((kind) => {
      if (!hasApprovedReview(approvals, version, kind, "")) issues.push(createIssue(PUBLICATION_ISSUE_CODES.REVIEW_APPROVAL_MISSING, { entityId, fieldPath: "reviewHistory", requiredReviewKind: kind, messageKey: `${kind} approval is missing.` }));
    });
    if (version.status === CONTENT_REVIEW_STATUSES.ARCHIVED) issues.push(createIssue(PUBLICATION_ISSUE_CODES.CONTENT_ARCHIVED, { entityId, messageKey: "Archived content cannot be published." }));
    return issues;
  }

  function evaluateTranslations(recipe, sourceVersion, requestedLocales = [], translations = []) {
    const blockedLocales = [];
    const approvedLocales = [];
    requestedLocales.forEach((locale) => {
      if (!locale || locale === recipe.sourceLocale || locale.startsWith("en")) {
        approvedLocales.push(locale || "en-CA");
        return;
      }
      const records = translations.filter((translation) => translation.entityId === recipe.id && translation.targetLocale === locale);
      const record = records.sort((a, b) => (b.translationVersion || 0) - (a.translationVersion || 0))[0];
      const issues = [];
      if (!record) issues.push(createIssue(PUBLICATION_ISSUE_CODES.TRANSLATION_MISSING, { entityId: recipe.id, entityType: "translation", locale, fieldPath: "translations", requiredReviewKind: "language", messageKey: "Required translation is missing." }));
      else {
        const aggregate = getMostRestrictiveTranslationStatus(record.segments || [{ status: record.status }]);
        if (record.sourceVersion !== sourceVersion.version || record.sourceContentHash !== sourceVersion.contentHash) issues.push(createIssue(PUBLICATION_ISSUE_CODES.TRANSLATION_OUTDATED, { entityId: recipe.id, entityType: "translation", locale, fieldPath: "translations.sourceVersion", requiredReviewKind: "language", messageKey: "Translation is outdated for this source version." }));
        if (record.status === TRANSLATION_STATUSES.MACHINE_DRAFT || aggregate === TRANSLATION_STATUSES.MACHINE_DRAFT) issues.push(createIssue(PUBLICATION_ISSUE_CODES.MACHINE_TRANSLATION_UNREVIEWED, { entityId: recipe.id, entityType: "translation", locale, fieldPath: "translations.status", requiredReviewKind: "language", messageKey: "Machine translation draft is not reviewed." }));
        if (record.status === TRANSLATION_STATUSES.REJECTED || aggregate === TRANSLATION_STATUSES.REJECTED) issues.push(createIssue(PUBLICATION_ISSUE_CODES.TRANSLATION_REJECTED, { entityId: recipe.id, entityType: "translation", locale, fieldPath: "translations.status", requiredReviewKind: "language", messageKey: "Rejected translation cannot be published." }));
        if (record.status === TRANSLATION_STATUSES.OUTDATED || aggregate === TRANSLATION_STATUSES.OUTDATED) issues.push(createIssue(PUBLICATION_ISSUE_CODES.TRANSLATION_OUTDATED, { entityId: recipe.id, entityType: "translation", locale, fieldPath: "translations.status", requiredReviewKind: "language", messageKey: "Outdated translation cannot be published." }));
        if (!record.humanReviewedBy || !record.humanReviewedAt || !record.approvedBy || !record.approvedAt) issues.push(createIssue(PUBLICATION_ISSUE_CODES.REVIEW_APPROVAL_MISSING, { entityId: recipe.id, entityType: "translation", locale, fieldPath: "translations.approvedBy", requiredReviewKind: "language", messageKey: "Approved translation reviewer metadata is missing." }));
        if (record.containsSafetyCriticalContent && (!record.safetyReviewedBy || !record.safetyReviewedAt)) issues.push(createIssue(PUBLICATION_ISSUE_CODES.SAFETY_TRANSLATION_UNREVIEWED, { entityId: recipe.id, entityType: "translation", locale, fieldPath: "translations.safetyReviewedBy", requiredReviewKind: "food-safety", messageKey: "Safety translation is not reviewed." }));
        if (record.status !== TRANSLATION_STATUSES.APPROVED || aggregate !== TRANSLATION_STATUSES.APPROVED) issues.push(createIssue(PUBLICATION_ISSUE_CODES.REVIEW_APPROVAL_MISSING, { entityId: recipe.id, entityType: "translation", locale, fieldPath: "translations.approvedBy", requiredReviewKind: "language", messageKey: "Translation approval is missing." }));
      }
      if (issues.length) blockedLocales.push({ locale, issues });
      else approvedLocales.push(locale);
    });
    return { approvedLocales, blockedLocales };
  }

  function evaluateRecipe(recipe, options = {}) {
    const version = options.version || createReviewableVersion({ entityId: recipe.id, version: Number(recipe.version || recipe.recipeVersion) || 1, sourceLocale: recipe.sourceLocale || "en-CA", requiredReviews: options.requiredReviews || ["content-completeness", "accessibility", "food-safety"], createdBy: recipe.createdBy || "legacy", content: recipe });
    const sourceIssues = validateRecipePublication(recipe, { ...options, version });
    const localeResult = evaluateTranslations(recipe, version, options.requestedLocales || [recipe.sourceLocale || "en-CA"], options.translations || []);
    const issues = [...sourceIssues, ...localeResult.blockedLocales.flatMap((item) => item.issues)];
    return { publishable: !issues.some((issue) => issue.blocksPublication), issues, approvedLocales: localeResult.approvedLocales, blockedLocales: localeResult.blockedLocales, version, approvals: options.approvals || [] };
  }

  function createPublicationManifest(recipe, evaluation, publisherId) {
    return Object.freeze({ id: `publication:${recipe.id}:v${evaluation.version.version}:${nowIso()}`, recipeId: recipe.id, recipeVersion: evaluation.version.version, sourceLocale: evaluation.version.sourceLocale, publishedLocales: evaluation.approvedLocales.map((locale) => ({ locale })), ingredientTermVersions: Object.fromEntries((recipe.structuredIngredients || []).map((ingredient) => [ingredient.ingredientId, ingredient.termVersion || 1]).filter(([id]) => id)), techniqueVersions: Object.fromEntries((recipe.techniqueIds || []).map((id) => [id, 1])), mediaVersions: (recipe.media?.videos || []).filter((video) => !video.excludedFromPublication).map((video) => ({ mediaId: video.id, mediaVersion: video.version || 1, captionTrackVersion: video.captionTrack?.version, transcriptVersion: video.transcript?.version })), approvalIds: (evaluation.approvals || []).map((approval) => approval.id), publishedBy: publisherId, publishedAt: nowIso() });
  }

  function publishRecipe(recipe, options = {}) {
    const publisher = options.publisher || {};
    const evaluation = evaluateRecipe(recipe, options);
    if (!userHasRole(publisher, "publisher")) {
      evaluation.issues.push(createIssue(PUBLICATION_ISSUE_CODES.REVIEWER_UNAUTHORIZED, { entityId: recipe.id, messageKey: "Publisher role is required." }));
    }
    if (evaluation.issues.some((issue) => issue.blocksPublication)) return { ok: false, evaluation, manifest: null, auditEvent: createAuditEvent("publication-blocked", { entityId: recipe.id, entityVersion: evaluation.version.version, actorId: publisher.id, actorRole: "publisher" }) };
    return { ok: true, evaluation, manifest: createPublicationManifest(recipe, evaluation, publisher.id), auditEvent: createAuditEvent("content-published", { entityId: recipe.id, entityVersion: evaluation.version.version, actorId: publisher.id, actorRole: "publisher" }) };
  }

  function createNextVersion(version, content, editorId, changeSummary = "") {
    return createReviewableVersion({ entityId: version.entityId, entityType: version.entityType, version: Number(version.version || 0) + 1, sourceLocale: version.sourceLocale, requiredReviews: version.requiredReviews, createdBy: editorId, changeSummary, content, status: CONTENT_REVIEW_STATUSES.DRAFT });
  }

  function saveDraftContent(content, author = {}) {
    return { ok: true, version: createReviewableVersion({ entityId: content.id, entityType: content.entityType || "recipe", version: Number(content.version || content.recipeVersion || 1), sourceLocale: content.sourceLocale || "en-CA", requiredReviews: content.requiredReviews || ["content-completeness", "accessibility"], createdBy: author.id || "unknown", content, status: CONTENT_REVIEW_STATUSES.DRAFT }), auditEvent: createAuditEvent("content-created", { entityId: content.id, actorId: author.id, actorRole: "author" }) };
  }

  function recordReviewDecision(version, reviewer = {}, reviewKind, decision = "approved", options = {}) {
    if (decision === "approved" && !canApproveContent(reviewer, version, reviewKind, options)) {
      return { ok: false, issue: createIssue(reviewKind === "food-safety" && version.createdBy === reviewer.id ? PUBLICATION_ISSUE_CODES.SEPARATION_OF_DUTIES_VIOLATION : PUBLICATION_ISSUE_CODES.REVIEWER_UNAUTHORIZED, { entityId: version.entityId, entityType: version.entityType, requiredReviewKind: reviewKind, messageKey: "Reviewer is not authorized for this approval." }) };
    }
    const approval = createApproval({ entityType: version.entityType, entityId: version.entityId, entityVersion: version.version, contentHash: version.contentHash, reviewKind, locale: options.locale || "", reviewerId: reviewer.id, reviewerRole: reviewer.roles?.find((role) => role.includes("reviewer") || role === "administrator") || reviewKind, decision, notes: options.notes || "" });
    return { ok: true, approval, auditEvent: createAuditEvent(decision === "approved" ? "review-approved" : decision === "rejected" ? "review-rejected" : "changes-requested", { entityType: version.entityType, entityId: version.entityId, entityVersion: version.version, actorId: reviewer.id, actorRole: approval.reviewerRole, nextStatus: decision }) };
  }

  function markTranslationsOutdatedForSourceChange(translations = [], nextSourceVersion) {
    return translations.map((translation) => translation.sourceVersion === nextSourceVersion.version && translation.sourceContentHash === nextSourceVersion.contentHash ? translation : { ...translation, status: TRANSLATION_STATUSES.OUTDATED, updatedAt: nowIso() });
  }

  function migrateLegacyRecipe(recipe = {}) {
    const version = createReviewableVersion({ entityId: recipe.id, version: Number(recipe.recipeVersion || recipe.version) || 1, sourceLocale: recipe.sourceLocale || "en-CA", requiredReviews: ["content-completeness", "accessibility", "food-safety"], createdBy: "legacy-import", content: recipe, status: CONTENT_REVIEW_STATUSES.OUTDATED, changeSummary: "Legacy recipe preserved for remediation review." });
    return { recipeId: recipe.id, legacyPublished: true, currentPublishedVersion: version.version, latestDraftVersion: version.version, reviewMarker: "legacy-review-required", version, remediationIssues: validateRecipePublication(recipe, { version, approvals: [] }) };
  }

  function validateIngredientTermPublication(term = {}) {
    const issues = [];
    if (!term.id || !term.canonicalName) issues.push(createIssue(PUBLICATION_ISSUE_CODES.INGREDIENT_TERM_UNREVIEWED, { entityType: "ingredient-term", entityId: term.id || "", fieldPath: "canonicalName", messageKey: "Ingredient term identity is incomplete." }));
    if (term.reviewStatus !== CONTENT_REVIEW_STATUSES.APPROVED && term.reviewStatus !== "approved") issues.push(createIssue(PUBLICATION_ISSUE_CODES.INGREDIENT_TERM_UNREVIEWED, { entityType: "ingredient-term", entityId: term.id || "", fieldPath: "reviewStatus", requiredReviewKind: "content-completeness", messageKey: "Ingredient term is not reviewed." }));
    if (!Array.isArray(term.aliases)) issues.push(createIssue(PUBLICATION_ISSUE_CODES.INGREDIENT_TERM_UNREVIEWED, { entityType: "ingredient-term", entityId: term.id || "", fieldPath: "aliases", messageKey: "Ingredient aliases are missing." }));
    if (!Array.isArray(term.allergenIds)) issues.push(createIssue(PUBLICATION_ISSUE_CODES.INGREDIENT_TERM_UNREVIEWED, { entityType: "ingredient-term", entityId: term.id || "", fieldPath: "allergenIds", requiredReviewKind: "food-safety", messageKey: "Ingredient allergen classification is missing." }));
    return issues;
  }

  function evaluateTechniqueDefinitionChange(previous = {}, current = {}) {
    const becameSafetySensitive = !/deep.?fry|hot oil|temperature/i.test(`${previous.name || ""} ${previous.plainLanguageDefinition || ""}`) && /deep.?fry|hot oil|temperature/i.test(`${current.name || ""} ${current.plainLanguageDefinition || ""}`);
    if (!becameSafetySensitive) return { safetyReviewRequired: false, affectedTranslationsOutdated: false, issues: [] };
    return { safetyReviewRequired: true, affectedTranslationsOutdated: true, issues: [createIssue(PUBLICATION_ISSUE_CODES.TECHNIQUE_REVIEW_REQUIRED, { entityType: "technique-definition", entityId: current.id || "", fieldPath: "plainLanguageDefinition", requiredReviewKind: "food-safety", messageKey: "Technique changed to safety-sensitive guidance and requires review." })] };
  }

  function createReviewAssignment({ entityType = "recipe", entityId, entityVersion, reviewKind, targetLocale = "", assignedTo = "", assignedBy = "", priority = "standard", status = "unassigned", dueAt = "" } = {}) {
    return { id: `assignment:${entityType}:${entityId}:v${entityVersion}:${reviewKind}:${targetLocale || "source"}`, entityType, entityId, entityVersion, reviewKind, targetLocale, assignedTo, assignedBy, assignedAt: nowIso(), priority, status, dueAt };
  }

  function buildReviewDashboardModel(items = []) {
    const groups = { assignedToMe: [], accessibilityReview: [], languageReview: [], safetyReview: [], machineDrafts: [], outdatedTranslations: [], changesRequested: [], readyToPublish: [], recentlyReviewed: [] };
    items.forEach((item) => {
      if (item.assignedToCurrentUser) groups.assignedToMe.push(item);
      if (item.reviewKind === "accessibility") groups.accessibilityReview.push(item);
      if (item.reviewKind === "language") groups.languageReview.push(item);
      if (item.reviewKind === "food-safety") groups.safetyReview.push(item);
      if (item.status === TRANSLATION_STATUSES.MACHINE_DRAFT) groups.machineDrafts.push(item);
      if (item.status === TRANSLATION_STATUSES.OUTDATED) groups.outdatedTranslations.push(item);
      if (item.status === CONTENT_REVIEW_STATUSES.CHANGES_REQUESTED || item.status === "changes-requested") groups.changesRequested.push(item);
      if (item.status === CONTENT_REVIEW_STATUSES.APPROVED) groups.readyToPublish.push(item);
      if (item.reviewedAt) groups.recentlyReviewed.push(item);
    });
    return groups;
  }

  function describeDiff(previous = {}, current = {}) {
    const changes = [];
    if (previous.quantity !== current.quantity || previous.unit !== current.unit) changes.push({ type: "quantity", description: `Quantity changed: Previous: ${previous.quantity || ""} ${previous.unit || ""}. Current: ${current.quantity || ""} ${current.unit || ""}.` });
    if (previous.ingredientId !== current.ingredientId) changes.push({ type: "ingredient-id", description: `Ingredient ID changed from ${previous.ingredientId || "none"} to ${current.ingredientId || "none"}.` });
    if (previous.safetyTemperature !== current.safetyTemperature) changes.push({ type: "safety-temperature", description: `Safety temperature changed from ${previous.safetyTemperature || "none"} to ${current.safetyTemperature || "none"}.` });
    if (previous.text !== current.text) changes.push({ type: "text", description: "Instruction wording changed." });
    return changes;
  }

  return {
    REVIEWABLE_CONTENT_TYPES,
    CONTENT_REVIEW_STATUSES,
    TRANSLATION_STATUSES,
    REVIEW_KINDS,
    CONTENT_ROLES,
    PUBLICATION_ISSUE_CODES,
    SAFETY_CRITICAL_CATEGORIES,
    AMBIGUOUS_INGREDIENT_TERMS,
    contentHash,
    createIssue,
    createReviewableVersion,
    createApproval,
    createTranslationRecord,
    createTranslationSegment,
    getMostRestrictiveTranslationStatus,
    transitionContentStatus,
    transitionTranslationStatus,
    canReview,
    canApproveContent,
    createAuditEvent,
    validateRecipePublication,
    evaluateRecipe,
    publishRecipe,
    createNextVersion,
    saveDraftContent,
    recordReviewDecision,
    markTranslationsOutdatedForSourceChange,
    migrateLegacyRecipe,
    validateIngredientTermPublication,
    evaluateTechniqueDefinitionChange,
    createReviewAssignment,
    buildReviewDashboardModel,
    describeDiff
  };
});
