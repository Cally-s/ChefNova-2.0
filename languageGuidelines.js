/* Chef Nova shared respectful-language policy and validators. */
(function () {
  "use strict";

  const RESPECTFUL_LANGUAGE_POLICY_VERSION = 1;
  const RESPECTFUL_MESSAGE_PRESENTATION_VERSION = 1;
  const PROHIBITED_LANGUAGE_SCANNER_VERSION = 1;
  const LOCALIZATION_SEMANTIC_VALIDATION_VERSION = 1;

  const RESPECTFUL_MESSAGE_INTENTS = Object.freeze({
    INFORMATIONAL_STATUS: "informational-status",
    PLANNING_SUGGESTION: "planning-suggestion",
    POSSIBLE_PATTERN: "possible-pattern",
    ACTIONABLE_INSIGHT: "actionable-insight",
    SAFETY_EXCLUSION: "safety-exclusion",
    SAFETY_REVIEW_REQUIRED: "safety-review-required",
    DATE_INFORMATION: "date-information",
    BUDGET_LIMITATION: "budget-limitation",
    PARTIAL_PLAN: "partial-plan",
    RECIPE_LIMITATION: "recipe-limitation",
    PORTION_SUGGESTION: "portion-suggestion",
    SHOPPING_ADVISORY: "shopping-advisory",
    RESERVATION_STATUS: "reservation-status",
    NOTIFICATION: "notification",
    IMPACT_ESTIMATE: "impact-estimate",
    DATA_COVERAGE: "data-coverage",
    VALIDATION_ERROR: "validation-error",
    SYSTEM_ERROR: "system-error",
    CONFIRMATION: "confirmation",
    EMPTY_STATE: "empty-state",
    MIGRATION_REVIEW: "migration-review"
  });

  const RESPECTFUL_TONE_CLASSES = Object.freeze({
    NEUTRAL_INFORMATIONAL: "neutral-informational",
    SUPPORTIVE_PLANNING: "supportive-planning",
    CAUTIOUS_EVIDENCE: "cautious-evidence",
    FIRM_SAFETY: "firm-safety",
    RESPECTFUL_LIMITATION: "respectful-limitation",
    RECOVERY_ORIENTED: "recovery-oriented"
  });

  const MESSAGE_ASSERTION_STRENGTH = Object.freeze({
    CONFIRMED_FACT: "confirmed-fact",
    SYSTEM_POLICY: "system-policy",
    RECORDED_OBSERVATION: "recorded-observation",
    ESTIMATED_RESULT: "estimated-result",
    POSSIBLE_INTERPRETATION: "possible-interpretation",
    OPTIONAL_SUGGESTION: "optional-suggestion",
    REVIEW_REQUIRED: "review-required"
  });

  const PROHIBITED_LANGUAGE_CATEGORIES = Object.freeze({
    USER_BLAME: "user-blame",
    SHAME: "shame",
    MORAL_JUDGMENT: "moral-judgment",
    BEHAVIOURAL_DIAGNOSIS: "behavioural-diagnosis",
    SOCIOECONOMIC_JUDGMENT: "socioeconomic-judgment",
    UNSUPPORTED_ABSOLUTE: "unsupported-absolute",
    COERCION: "coercion",
    UNSUPPORTED_CAUSALITY: "unsupported-causality",
    SAFETY_AMBIGUITY: "safety-ambiguity",
    SAFETY_OVERRIDING: "safety-overriding",
    INVALID_PERSONALIZATION: "invalid-personalization",
    MANIPULATIVE_ACTION_LABEL: "manipulative-action-label"
  });

  const RESPECTFUL_LANGUAGE_POLICY_REGISTRY = Object.freeze({
    respectfulLanguagePolicyVersion: RESPECTFUL_LANGUAGE_POLICY_VERSION,
    globalRules: {
      prohibitBlame: true,
      prohibitShame: true,
      prohibitDiagnosis: true,
      prohibitSocioeconomicJudgment: true,
      requireEvidenceMatching: true,
      requireSafetyClarity: true,
      requireOptionalSuggestionWording: true,
      preserveEstimateQualifiers: true,
      preserveDateTypePrecision: true
    },
    intents: {
      [RESPECTFUL_MESSAGE_INTENTS.POSSIBLE_PATTERN]: {
        toneClass: RESPECTFUL_TONE_CLASSES.CAUTIOUS_EVIDENCE,
        requiredPhrases: ["possible"],
        prohibitedConcepts: ["bad-habit", "always", "never", "user-failure"],
        requiredDisclosures: ["incident-count", "time-window", "planning-observation-not-judgment"]
      },
      [RESPECTFUL_MESSAGE_INTENTS.SAFETY_EXCLUSION]: {
        toneClass: RESPECTFUL_TONE_CLASSES.FIRM_SAFETY,
        requireClearExclusion: true,
        prohibitedConcepts: ["blame", "appearance-proves-safety", "smell-proves-safety"]
      },
      [RESPECTFUL_MESSAGE_INTENTS.BUDGET_LIMITATION]: {
        toneClass: RESPECTFUL_TONE_CLASSES.RESPECTFUL_LIMITATION,
        prohibitedConcepts: ["unrealistic-budget", "cannot-afford", "bad-budget"],
        requiredDisclosures: ["requirements-preserved", "actionable-options"]
      },
      [RESPECTFUL_MESSAGE_INTENTS.RECIPE_LIMITATION]: {
        toneClass: RESPECTFUL_TONE_CLASSES.RESPECTFUL_LIMITATION,
        requiredDisclosures: ["requirements-preserved", "closest-safe-options"]
      },
      [RESPECTFUL_MESSAGE_INTENTS.PORTION_SUGGESTION]: {
        toneClass: RESPECTFUL_TONE_CLASSES.SUPPORTIVE_PLANNING,
        requiredDisclosures: ["preview", "keep-current-option"]
      },
      [RESPECTFUL_MESSAGE_INTENTS.NOTIFICATION]: {
        toneClass: RESPECTFUL_TONE_CLASSES.NEUTRAL_INFORMATIONAL,
        requiredDisclosures: ["unchanged-source-records"]
      },
      [RESPECTFUL_MESSAGE_INTENTS.IMPACT_ESTIMATE]: {
        toneClass: RESPECTFUL_TONE_CLASSES.NEUTRAL_INFORMATIONAL,
        requiredDisclosures: ["possible-or-estimated"]
      },
      [RESPECTFUL_MESSAGE_INTENTS.VALIDATION_ERROR]: {
        toneClass: RESPECTFUL_TONE_CLASSES.RECOVERY_ORIENTED,
        requiredDisclosures: ["recovery-action"]
      }
    }
  });

  const RESPECTFUL_MESSAGE_TEMPLATES = Object.freeze({
    "patterns.possibleIngredientPattern": {
      templateId: "possible-ingredient-pattern",
      intent: RESPECTFUL_MESSAGE_INTENTS.POSSIBLE_PATTERN,
      toneClass: RESPECTFUL_TONE_CLASSES.CAUTIOUS_EVIDENCE,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.RECORDED_OBSERVATION,
      localizationKey: "patterns.possibleIngredientPattern",
      requiredSemanticTokens: ["possible", "recorded", "incident-count", "time-window", "planning-observation-not-judgment"],
      render: (evidence = {}) => {
        const food = evidence.foodName || "This food";
        const count = Number(evidence.incidentCount || 0);
        const windowDays = Number(evidence.windowDays || 60);
        if (count < 3) {
          const body = count === 1 ? `One ${food} discard was recorded.` : `${count} ${food} discard records are available.`;
          return { heading: "Recorded Discard Information", body, suggestion: null };
        }
        return {
          heading: "POSSIBLE PLANNING PATTERN",
          body: `${food} was recorded as discarded in ${count} separate incidents over the last ${windowDays} days.\n\nThis is a planning observation, not a judgment.`,
          suggestion: { optional: true, summary: "A smaller package, an earlier meal, or an approved freezing routine may be useful to review." },
          actions: ["Review Suggested Changes", "Keep Current Settings"]
        };
      }
    },
    "insights.possibleNextStep": {
      templateId: "possible-next-step",
      intent: RESPECTFUL_MESSAGE_INTENTS.ACTIONABLE_INSIGHT,
      toneClass: RESPECTFUL_TONE_CLASSES.SUPPORTIVE_PLANNING,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.OPTIONAL_SUGGESTION,
      localizationKey: "insights.possibleNextStep",
      requiredSemanticTokens: ["possible", "optional", "keep-current-setting"],
      render: (evidence = {}) => ({
        heading: "POSSIBLE NEXT STEP",
        body: evidence.body || "Chef Nova can show an optional planning change for review.\n\nThis is a preference, not a restriction.",
        suggestion: { optional: true, summary: evidence.summary || "Review the option and keep current settings if preferred." },
        actions: ["Apply Suggested Change", "Keep Current Setting"]
      })
    },
    "portions.possibleAdjustment": {
      templateId: "possible-portion-adjustment",
      intent: RESPECTFUL_MESSAGE_INTENTS.PORTION_SUGGESTION,
      toneClass: RESPECTFUL_TONE_CLASSES.SUPPORTIVE_PLANNING,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.POSSIBLE_INTERPRETATION,
      localizationKey: "portions.possibleAdjustment",
      requiredSemanticTokens: ["possible", "preview", "keep-current"],
      render: (evidence = {}) => ({
        heading: "POSSIBLE PORTION ADJUSTMENT",
        body: `This meal may produce more food than the household has used in recent recorded outcomes.\n\nCurrent recipe amount:\n${evidence.currentServings || 4} servings\n\nSuggested amount:\n${evidence.suggestedServings || 3} servings`,
        suggestion: { optional: true, summary: `Would you like to preview ${evidence.suggestedServings || 3} servings?` },
        actions: [`Preview ${evidence.suggestedServings || 3} Servings`, `Keep ${evidence.currentServings || 4} Servings`]
      })
    },
    "recipes.limitation": {
      templateId: "recipe-limitation",
      intent: RESPECTFUL_MESSAGE_INTENTS.RECIPE_LIMITATION,
      toneClass: RESPECTFUL_TONE_CLASSES.RESPECTFUL_LIMITATION,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.REVIEW_REQUIRED,
      localizationKey: "recipes.limitation",
      requiredSemanticTokens: ["requirements-preserved", "safe-options"],
      render: (evidence = {}) => ({
        heading: "Recipe Options Need Review",
        body: `Chef Nova could not find a suitable recipe using all ${evidence.selectedIngredientCount || 3} selected ingredients with the current safety, allergy, dietary, appliance, and cooking-time requirements.\n\nHere are safe options using ${evidence.matchedIngredientCount || 2} of the selected ingredients.`,
        actions: ["View Safe Options", "Edit Selected Ingredients"]
      })
    },
    "safety.expirationPassed": {
      templateId: "recorded-expiration-passed",
      intent: RESPECTFUL_MESSAGE_INTENTS.SAFETY_EXCLUSION,
      toneClass: RESPECTFUL_TONE_CLASSES.FIRM_SAFETY,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.SYSTEM_POLICY,
      localizationKey: "safety.expirationPassed",
      requiredSemanticTokens: ["recorded", "will-not-recommend"],
      render: () => ({
        heading: "THE RECORDED EXPIRATION DATE HAS PASSED",
        body: "Chef Nova will not recommend this item in a recipe.",
        safetyDirective: "will-not-recommend",
        actions: ["Review Item Details", "Remove from Available Food"]
      })
    },
    "safety.storageReview": {
      templateId: "storage-review-required",
      intent: RESPECTFUL_MESSAGE_INTENTS.SAFETY_REVIEW_REQUIRED,
      toneClass: RESPECTFUL_TONE_CLASSES.FIRM_SAFETY,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.REVIEW_REQUIRED,
      localizationKey: "safety.storageReview",
      requiredSemanticTokens: ["review-required", "not-included"],
      render: () => ({
        heading: "STORAGE INFORMATION NEEDS REVIEW",
        body: "Chef Nova could not verify the current storage timeline.\n\nThe item was not included in a recipe recommendation.",
        safetyDirective: "not-included",
        actions: ["Review Storage Details", "Keep It Excluded"]
      })
    },
    "budget.limitation": {
      templateId: "budget-limitation",
      intent: RESPECTFUL_MESSAGE_INTENTS.BUDGET_LIMITATION,
      toneClass: RESPECTFUL_TONE_CLASSES.RESPECTFUL_LIMITATION,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.REVIEW_REQUIRED,
      localizationKey: "budget.limitation",
      requiredSemanticTokens: ["requirements-preserved", "lower-cost-options"],
      render: () => ({
        heading: "Budget Plan Needs Review",
        body: "Chef Nova could not create every requested meal within the selected budget using the current safety, allergy, dietary, appliance, and cooking-time requirements.\n\nNo safety or dietary requirement was removed.\n\nHere are the closest safe options.",
        actions: ["Review Lower-Cost Options", "Create a Shorter Plan", "Edit the Budget"]
      })
    },
    "notifications.dismissed": {
      templateId: "notification-dismissed",
      intent: RESPECTFUL_MESSAGE_INTENTS.NOTIFICATION,
      toneClass: RESPECTFUL_TONE_CLASSES.NEUTRAL_INFORMATIONAL,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.CONFIRMED_FACT,
      localizationKey: "notifications.dismissed",
      requiredSemanticTokens: ["unchanged-source-records"],
      render: () => ({
        heading: "Reminder dismissed",
        body: "The Pantry item was not changed."
      })
    },
    "legacy.plannedMealNotConfirmed": {
      templateId: "planned-meal-not-confirmed",
      intent: RESPECTFUL_MESSAGE_INTENTS.MIGRATION_REVIEW,
      toneClass: RESPECTFUL_TONE_CLASSES.RECOVERY_ORIENTED,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.RECORDED_OBSERVATION,
      localizationKey: "legacy.plannedMealNotConfirmed",
      requiredSemanticTokens: ["planned", "not-confirmed", "available-for-another-plan"],
      render: (evidence = {}) => {
        const food = evidence.foodName || "the item";
        return {
          heading: "Planned meal not confirmed",
          body: `The planned ${food} meal was not confirmed as prepared.\n\nThe ${food} is available for another plan.`,
          actions: ["Plan Another Meal", "Keep Current Plan"]
        };
      }
    },
    "errors.messageNeedsReview": {
      templateId: "message-needs-review",
      intent: RESPECTFUL_MESSAGE_INTENTS.SYSTEM_ERROR,
      toneClass: RESPECTFUL_TONE_CLASSES.RECOVERY_ORIENTED,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.REVIEW_REQUIRED,
      localizationKey: "errors.messageNeedsReview",
      requiredSemanticTokens: ["unchanged-records", "review"],
      render: () => ({
        heading: "MESSAGE NEEDS REVIEW",
        body: "Chef Nova could not verify the wording for this result.\n\nThe underlying Pantry, meal, safety, budget, pattern, and impact records were not changed.",
        actions: ["View Source Details", "Refresh Message"]
      })
    }
  });

  const PROHIBITED_LANGUAGE_PATTERNS = Object.freeze([
    { category: PROHIBITED_LANGUAGE_CATEGORIES.USER_BLAME, pattern: /\byou wasted\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.USER_BLAME, pattern: /\byou failed\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.USER_BLAME, pattern: /\byou forgot again\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.USER_BLAME, pattern: /\byou keep (wasting|throwing away|ignoring)\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.MORAL_JUDGMENT, pattern: /\byou are wasteful\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.MORAL_JUDGMENT, pattern: /\byour habits are bad\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.MORAL_JUDGMENT, pattern: /\bbad habit\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.MORAL_JUDGMENT, pattern: /\b(irresponsible|careless|lazy)\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.USER_BLAME, pattern: /\byou should have\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.USER_BLAME, pattern: /\byour fault\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.USER_BLAME, pattern: /\byou caused\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.MANIPULATIVE_ACTION_LABEL, pattern: /\bdo better\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.MANIPULATIVE_ACTION_LABEL, pattern: /\bsmart choice\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.MANIPULATIVE_ACTION_LABEL, pattern: /\bwrong choice\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.MANIPULATIVE_ACTION_LABEL, pattern: /\bstop wasting\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.MANIPULATIVE_ACTION_LABEL, pattern: /\bfix your behavior\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.SOCIOECONOMIC_JUDGMENT, pattern: /\bbad budget\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.SOCIOECONOMIC_JUDGMENT, pattern: /\bunrealistic budget\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.SOCIOECONOMIC_JUDGMENT, pattern: /\bcannot afford\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.SOCIOECONOMIC_JUDGMENT, pattern: /\ball you can afford\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.SOCIOECONOMIC_JUDGMENT, pattern: /\bthrowing away too much money\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.UNSUPPORTED_ABSOLUTE, pattern: /\byou always\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.UNSUPPORTED_ABSOLUTE, pattern: /\byou never\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.UNSUPPORTED_CAUSALITY, pattern: /\bdefinitely prevented\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.UNSUPPORTED_CAUSALITY, pattern: /\bguaranteed savings\b/i },
    { category: PROHIBITED_LANGUAGE_CATEGORIES.UNSUPPORTED_CAUSALITY, pattern: /\bfood saved from landfill\b/i }
  ]);

  const APPROVED_CONTEXT_PATTERNS = Object.freeze([
    /allergies are never removed automatically/i,
    /chef nova will not recommend/i,
    /recorded expiration date/i,
    /please try again/i
  ]);

  function getSupportiveLanguage() {
    return {
      goals: "Support your goals",
      balancedMeals: "Build balanced meals",
      estimatedRange: "Estimated range",
      nutritionGuidance: "General nutrition guidance",
      gradualProgress: "Gradual progress",
      foodVariety: "Food variety",
      consistentHabits: "Consistent habits",
      mealPlanning: "Meal planning",
      recipeVariety: "Recipe variety",
      balancedMealOption: "Balanced meal option",
      estimatedNutrition: "Estimated nutrition",
      plannedMeals: "Planned meals",
      completedMeals: "Completed meals",
      maintenancePlanning: "Maintenance-style planning",
      nutritionAvailable: "Nutrition information available",
      progressOverTime: "Progress over time",
      optionalTracking: "Optional tracking",
      supportiveReminder: "Supportive reminder",
      cookingHabit: "Cooking habit",
      hydrationReminder: "Hydration reminder",
      workoutSupportMeal: "Workout-support meal",
      pantryFriendly: "Pantry-friendly",
      recipeSuggestion: "Recipe suggestion",
      estimatedVegetables: "Estimated vegetable servings",
      proteinMeal: "Protein-containing meal",
      planningTools: "Planning tools",
      mealOrganization: "Meal organization",
      generalTrend: "General trend",
      balancedRecipe: "Balanced recipe",
      helpfulSuggestion: "Helpful suggestion"
    };
  }

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function scanProhibitedLanguage(text, context = {}) {
    const rawText = String(text || "");
    const normalized = normalizeText(rawText);
    if (!normalized) return [];
    if (context.allowUserAuthoredContent || context.allowPolicyDocumentation || context.allowTestFixture || context.allowInternalLog) return [];
    return PROHIBITED_LANGUAGE_PATTERNS.filter((entry) => entry.pattern.test(normalized) && !APPROVED_CONTEXT_PATTERNS.some((allowed) => allowed.test(normalized))).map((entry) => ({
      prohibitedLanguageScannerVersion: PROHIBITED_LANGUAGE_SCANNER_VERSION,
      category: entry.category,
      pattern: String(entry.pattern),
      message: "Product-authored user-facing wording needs review."
    }));
  }

  function validateActionLabels(actions = [], context = {}) {
    return (Array.isArray(actions) ? actions : []).flatMap((label) => scanProhibitedLanguage(label, context).concat(/^(fix|open|choose)$/i.test(String(label || "").trim()) ? [{
      prohibitedLanguageScannerVersion: PROHIBITED_LANGUAGE_SCANNER_VERSION,
      category: PROHIBITED_LANGUAGE_CATEGORIES.MANIPULATIVE_ACTION_LABEL,
      message: "Action labels must be specific and neutral."
    }] : []));
  }

  function validateLocalizationSemantics(sourceTemplate = {}, localizedTemplate = {}) {
    const required = sourceTemplate.requiredSemanticTokens || [];
    const localizedTokens = localizedTemplate.requiredSemanticTokens || [];
    const missing = required.filter((token) => !localizedTokens.includes(token));
    return {
      localizationSemanticValidationVersion: LOCALIZATION_SEMANTIC_VALIDATION_VERSION,
      ok: missing.length === 0,
      missingSemanticTokens: missing
    };
  }

  function validateAccessibilityText(visibleText = "", accessibilityText = "", context = {}) {
    const visibleIssues = scanProhibitedLanguage(visibleText, context);
    const accessibilityIssues = scanProhibitedLanguage(accessibilityText, context);
    const normalizedVisible = normalizeText(visibleText).toLowerCase();
    const normalizedAccessible = normalizeText(accessibilityText).toLowerCase();
    const mismatch = normalizedAccessible && normalizedVisible && accessibilityIssues.length === 0 && /waste problem|bad habit|reject improvement/i.test(accessibilityText);
    return { ok: visibleIssues.length === 0 && accessibilityIssues.length === 0 && !mismatch, issues: [...visibleIssues, ...accessibilityIssues], mismatch };
  }

  function validateRespectfulMessagePresentation(presentation = {}, context = {}) {
    const intentValues = Object.values(RESPECTFUL_MESSAGE_INTENTS);
    const toneValues = Object.values(RESPECTFUL_TONE_CLASSES);
    const strengthValues = Object.values(MESSAGE_ASSERTION_STRENGTH);
    const issues = [];
    if (!intentValues.includes(presentation.intent)) issues.push({ category: "missing-intent", message: "Message intent is missing or unsupported." });
    if (!toneValues.includes(presentation.toneClass)) issues.push({ category: "missing-tone-class", message: "Tone class is missing or unsupported." });
    if (!strengthValues.includes(presentation.assertionStrength)) issues.push({ category: "missing-assertion-strength", message: "Assertion strength is missing or unsupported." });
    issues.push(...scanProhibitedLanguage([presentation.heading, presentation.body, presentation.accessibilityText].filter(Boolean).join(" "), context));
    issues.push(...validateActionLabels(presentation.actions || [], context));
    if (presentation.intent === RESPECTFUL_MESSAGE_INTENTS.SAFETY_EXCLUSION && !/will not recommend|not included|cannot be selected/i.test(`${presentation.body || ""} ${presentation.safetyDirective || ""}`)) issues.push({ category: PROHIBITED_LANGUAGE_CATEGORIES.SAFETY_AMBIGUITY, message: "Hard safety exclusions must stay direct." });
    if (presentation.assertionStrength === MESSAGE_ASSERTION_STRENGTH.ESTIMATED_RESULT && !/estimated|approximately|about/i.test(`${presentation.heading || ""} ${presentation.body || ""}`)) issues.push({ category: PROHIBITED_LANGUAGE_CATEGORIES.UNSUPPORTED_CAUSALITY, message: "Estimated results need estimate qualifiers." });
    const accessibility = validateAccessibilityText(`${presentation.heading || ""} ${presentation.body || ""}`, presentation.accessibilityText || `${presentation.heading || ""} ${presentation.body || ""}`, context);
    issues.push(...accessibility.issues);
    return { ok: issues.length === 0, issues };
  }

  function createMessageNeedsReviewPresentation(sourceRevisions = {}) {
    return {
      respectfulMessagePresentationVersion: RESPECTFUL_MESSAGE_PRESENTATION_VERSION,
      messageId: "message-needs-review",
      templateId: "message-needs-review",
      intent: RESPECTFUL_MESSAGE_INTENTS.SYSTEM_ERROR,
      toneClass: RESPECTFUL_TONE_CLASSES.RECOVERY_ORIENTED,
      assertionStrength: MESSAGE_ASSERTION_STRENGTH.REVIEW_REQUIRED,
      heading: "MESSAGE NEEDS REVIEW",
      body: "Chef Nova could not verify the wording for this result.\n\nThe underlying Pantry, meal, safety, budget, pattern, and impact records were not changed.",
      evidenceSummary: {},
      limitations: [],
      safetyDirective: null,
      suggestion: null,
      actions: ["View Source Details", "Refresh Message"],
      accessibilityText: "Message needs review. Chef Nova could not verify the wording. Source records were not changed.",
      localizationKey: "errors.messageNeedsReview",
      sourceRevisions
    };
  }

  function resolveRespectfulMessage(templateKey, evidence = {}, context = {}) {
    const template = RESPECTFUL_MESSAGE_TEMPLATES[templateKey] || RESPECTFUL_MESSAGE_TEMPLATES["errors.messageNeedsReview"];
    const rendered = template.render(evidence, context);
    const sourceRevision = evidence.sourceRevision || evidence.sourceRevisions || "current";
    const presentation = {
      respectfulMessagePresentationVersion: RESPECTFUL_MESSAGE_PRESENTATION_VERSION,
      messageId: `respectful-message:${template.templateId}:${JSON.stringify(sourceRevision)}:${RESPECTFUL_LANGUAGE_POLICY_VERSION}:${context.locale || "en"}`,
      templateId: template.templateId,
      intent: template.intent,
      toneClass: template.toneClass,
      assertionStrength: template.assertionStrength,
      heading: rendered.heading || "",
      body: rendered.body || "",
      evidenceSummary: evidence,
      limitations: rendered.limitations || [],
      safetyDirective: rendered.safetyDirective || null,
      suggestion: rendered.suggestion || null,
      actions: rendered.actions || [],
      accessibilityText: rendered.accessibilityText || `${rendered.heading || ""}. ${rendered.body || ""}`.replace(/\s+/g, " ").trim(),
      localizationKey: template.localizationKey,
      sourceRevisions: evidence.sourceRevisions || {}
    };
    const validation = validateRespectfulMessagePresentation(presentation, context);
    return validation.ok ? { ...presentation, validation } : { ...createMessageNeedsReviewPresentation(evidence.sourceRevisions || {}), validation };
  }

  function migrateLegacyUserFacingMessage(legacyText = "", evidence = {}, context = {}) {
    const text = normalizeText(legacyText).toLowerCase();
    if (/you failed to use/.test(text)) return resolveRespectfulMessage("legacy.plannedMealNotConfirmed", evidence, context);
    if (/you wasted|you failed/.test(text)) return resolveRespectfulMessage("patterns.possibleIngredientPattern", evidence, context);
    if (/budget is (insufficient|unrealistic|bad)|cannot afford/.test(text)) return resolveRespectfulMessage("budget.limitation", evidence, context);
    if (/carbon emissions|landfill|environmental/.test(text)) {
      return {
        ...resolveRespectfulMessage("errors.messageNeedsReview", evidence, context),
        heading: "Environmental impact estimates are not available",
        body: "Environmental impact estimates are not available because Chef Nova does not currently have an approved ingredient-specific methodology.",
        assertionStrength: MESSAGE_ASSERTION_STRENGTH.SYSTEM_POLICY
      };
    }
    return resolveRespectfulMessage("errors.messageNeedsReview", evidence, context);
  }

  const api = {
    RESPECTFUL_LANGUAGE_POLICY_VERSION,
    RESPECTFUL_MESSAGE_PRESENTATION_VERSION,
    PROHIBITED_LANGUAGE_SCANNER_VERSION,
    LOCALIZATION_SEMANTIC_VALIDATION_VERSION,
    RESPECTFUL_MESSAGE_INTENTS,
    RESPECTFUL_TONE_CLASSES,
    MESSAGE_ASSERTION_STRENGTH,
    PROHIBITED_LANGUAGE_CATEGORIES,
    RESPECTFUL_LANGUAGE_POLICY_REGISTRY,
    RESPECTFUL_MESSAGE_TEMPLATES,
    getSupportiveLanguage,
    scanProhibitedLanguage,
    validateActionLabels,
    validateLocalizationSemantics,
    validateAccessibilityText,
    validateRespectfulMessagePresentation,
    resolveRespectfulMessage,
    migrateLegacyUserFacingMessage,
    createMessageNeedsReviewPresentation
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") {
    window.CHEF_NOVA_RESPECTFUL_LANGUAGE = api;
    window.getSupportiveLanguage = getSupportiveLanguage;
    window.CHEF_NOVA_LANGUAGE = getSupportiveLanguage();
    window.resolveRespectfulMessage = resolveRespectfulMessage;
    window.validateRespectfulMessage = validateRespectfulMessagePresentation;
    window.scanProhibitedLanguage = scanProhibitedLanguage;
  }
})();
