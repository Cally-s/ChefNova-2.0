/* Chef Nova staged rollout, feature flag, rollback, and maintenance controls. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaRollout = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const CONFIGURATION_VERSION = "step-71-local-rollout-v1";
  const APPLICATION_VERSION = "static-local";
  const ROLLOUT_STAGE_STATUSES = Object.freeze(["draft", "internal-testing", "pilot", "limited-rollout", "general-availability", "paused", "rolling-back", "rolled-back", "retired"]);
  const ACCESSIBILITY_ROLLOUT_STAGES = Object.freeze(["stage-1-visual-keyboard", "stage-2-independent-cooking", "stage-3-initial-language-bridge", "stage-4-expanded-languages"]);
  const CRITERION_CATEGORIES = Object.freeze(["automated-tests", "manual-testing", "assistive-technology", "language-review", "food-safety", "privacy", "performance", "migration", "monitoring", "rollback", "support-readiness"]);
  const CRITERION_STATUSES = Object.freeze(["not-evaluated", "passed", "failed", "blocked", "not-applicable"]);
  const REQUIRED_FEATURE_FLAGS = Object.freeze([
    "accessibility.font-scaling",
    "accessibility.text-spacing",
    "accessibility.high-contrast",
    "accessibility.reduced-motion",
    "accessibility.readability-display",
    "accessibility.large-buttons",
    "accessibility.one-instruction-mode",
    "accessibility.keyboard-focus-foundation",
    "cooking.recipe-tts",
    "cooking.accessible-timers",
    "cooking.voice-navigation",
    "pantry.speech-entry",
    "privacy.microphone-controls",
    "language.bridge",
    "language.ingredient-lexicon",
    "language.cooking-glossary",
    "language.bilingual-rendering",
    "language.rtl-support",
    "language.translated-media",
    "language.multilingual-speech-commands",
    "language.locale.en-CA",
    "language.locale.fr-CA",
    "language.locale.zh-Hans",
    "language.locale.zh-Hant",
    "language.locale.ar",
    "language.locale.pa",
    "language.locale.es",
    "language.locale.uk",
    "language.locale.vi",
    "language.locale.ko",
    "language.speech-commands.en-CA",
    "language.speech-commands.fr-CA",
    "language.speech-commands.zh-Hans",
    "language.speech-commands.zh-Hant",
    "language.speech-commands.ar",
    "language.speech-commands.pa",
    "language.speech-commands.es",
    "language.speech-commands.uk",
    "language.speech-commands.vi",
    "language.speech-commands.ko"
  ]);

  const SUPPORTED_LOCALES = Object.freeze(["en-CA", "fr-CA", "zh-Hans", "zh-Hant", "ar", "pa", "es", "uk", "vi", "ko"]);
  const NON_FLAGGED_SAFETY_INVARIANTS = Object.freeze(["manual-recipe-instructions", "manual-pantry-form", "keyboard-core-controls", "touch-core-controls", "screen-reader-core-controls", "allergy-warnings", "food-safety-warnings", "approved-safety-temperatures", "original-language-fallback", "accessibility-recovery", "restore-display-defaults", "language-recovery", "offline-timer-persistence", "user-data-authorization", "step-67-publication-gates", "human-review-safety-translations", "step-70-sensitive-voice-confirmation", "raw-audio-minimization", "cross-account-voice-session-protection", "no-disability-inference", "feedback-privacy-defaults", "canonical-quantity-preservation", "existing-saved-data", "publication-audit-trails"]);
  const USER_DATA_STORES = Object.freeze(["chefNovaFavorites", "chefNova.pantry", "chefNovaMealPlan", "chefNovaShoppingList", "chefNovaBudgetProfile", "chefNovaOfflinePackages", "chefNovaCookingProgress", "chefNovaNotifications", "chefNovaUsers"]);
  const PRIVATE_CONTEXT_KEYS = Object.freeze(["pantry", "pantryContents", "allergies", "allergyInformation", "dietaryRestrictions", "dietaryPreference", "wasteDiary", "budgetData", "rawAudio", "transcript", "voiceTranscript", "inferredDisability", "blindUser", "dyslexicUser", "cognitiveDisability", "speechRecognitionFailureDisability"]);
  const PRIVATE_PAYLOAD_KEYS = Object.freeze(["pantryContents", "allergies", "allergyDetails", "dietaryRestrictions", "dietaryPreference", "wasteDiary", "budgetData", "rawAudio", "audioBlob", "transcript", "voiceTranscript", "exactVoiceCommand", "recipeNotes", "inferredDisability", "blindUser", "dyslexicUser", "cognitiveDisability"]);
  const PRIVATE_PAYLOAD_VALUE_CANARIES = Object.freeze(["VOICE_TEST_PRIVATE", "peanut allergy", "discarded food diary", "raw audio blob", "full transcript text"]);

  const DEPENDENCIES = Object.freeze({
    "cooking.voice-navigation": ["accessibility.keyboard-focus-foundation", "privacy.microphone-controls"],
    "pantry.speech-entry": ["privacy.microphone-controls", "manual.pantry-form"],
    "language.bridge": ["step65.localization", "step67.content-review", "content.source-approved"],
    "language.bilingual-rendering": ["language.bridge", "language.cooking-glossary"],
    "language.rtl-support": ["language.bridge", "locale.rtl-approved"],
    "language.translated-media": ["language.bridge", "media.reviewed-captions", "media.reviewed-transcript"],
    "language.multilingual-speech-commands": ["privacy.microphone-controls", "language.bridge", "step70.voice-command-policy"],
    "language.speech-commands.en-CA": ["language.multilingual-speech-commands", "language.locale.en-CA"],
    "language.speech-commands.fr-CA": ["language.multilingual-speech-commands", "language.locale.fr-CA"],
    "language.speech-commands.zh-Hans": ["language.multilingual-speech-commands", "language.locale.zh-Hans"],
    "language.speech-commands.zh-Hant": ["language.multilingual-speech-commands", "language.locale.zh-Hant"],
    "language.speech-commands.ar": ["language.multilingual-speech-commands", "language.locale.ar"],
    "language.speech-commands.pa": ["language.multilingual-speech-commands", "language.locale.pa"],
    "language.speech-commands.es": ["language.multilingual-speech-commands", "language.locale.es"],
    "language.speech-commands.uk": ["language.multilingual-speech-commands", "language.locale.uk"],
    "language.speech-commands.vi": ["language.multilingual-speech-commands", "language.locale.vi"],
    "language.speech-commands.ko": ["language.multilingual-speech-commands", "language.locale.ko"]
  });

  const FLAG_CATALOG = Object.freeze(Object.fromEntries(REQUIRED_FEATURE_FLAGS.map((key) => [key, Object.freeze(createFlagDefinition(key))])));
  const DEFAULT_ROLLOUT_CONFIG = Object.freeze(createDefaultConfiguration());
  const DEFAULT_STAGE_RECORDS = Object.freeze(createDefaultStageRecords());
  const DEFAULT_ROLLBACK_PLANS = Object.freeze(createDefaultRollbackPlans());
  const MAINTENANCE_OWNERS = Object.freeze(createMaintenanceOwners());
  const MAINTENANCE_SCHEDULE = Object.freeze(createMaintenanceSchedule());

  function nowIso() {
    return new Date().toISOString();
  }

  function createFlagDefinition(key) {
    const stage = key.startsWith("accessibility.") ? "stage-1-visual-keyboard"
      : key.startsWith("cooking.") || key.startsWith("pantry.") || key.startsWith("privacy.") ? "stage-2-independent-cooking"
        : ["language.bridge", "language.ingredient-lexicon", "language.cooking-glossary", "language.bilingual-rendering", "language.locale.en-CA", "language.locale.fr-CA", "language.locale.zh-Hans", "language.locale.zh-Hant"].includes(key) ? "stage-3-initial-language-bridge"
          : "stage-4-expanded-languages";
    return {
      key,
      stage,
      owner: ownerForKey(key),
      defaultEnabled: false,
      dependencies: DEPENDENCIES[key] || [],
      safeFallback: fallbackForKey(key),
      killSwitchBehavior: killSwitchBehaviorForKey(key),
      storedPreferencesAffected: preferenceForKey(key),
      dataStoresUsed: [...USER_DATA_STORES],
      cohortStrategy: key.startsWith("language.locale.en-CA") ? "source-locale-safe-default" : "internal-first-deterministic-rollout",
      monitoring: monitoringForKey(key),
      rollbackPlan: rollbackPlanForKey(key),
      retirementPlan: key.startsWith("language.locale.") ? "permanent-operational-locale-control" : "review-after-general-availability"
    };
  }

  function ownerForKey(key) {
    if (key.startsWith("language.")) return "language-owner";
    if (key.includes("voice") || key.includes("speech") || key.includes("microphone")) return "voice-privacy-owner";
    if (key.includes("timer")) return "timer-accessibility-owner";
    return "accessibility-owner";
  }

  function fallbackForKey(key) {
    if (key.includes("voice") || key.includes("speech") || key.includes("microphone")) return "Keyboard, touch, screen-reader controls, and labelled forms remain available.";
    if (key.includes("translated-media")) return "Written instructions and approved transcript remain available.";
    if (key.includes("rtl") || key.startsWith("language.locale.")) return "Approved source-language fallback and Language Recovery remain available.";
    if (key.includes("one-instruction")) return "Standard cooking view preserves current step and timers.";
    if (key.includes("timer")) return "Durable visible timer state remains available.";
    return "Core manual interface remains available.";
  }

  function killSwitchBehaviorForKey(key) {
    if (key === "cooking.voice-navigation" || key === "pantry.speech-entry") return "Stop recognition, release microphone tracks, reject late callbacks, and show manual controls.";
    if (key === "cooking.recipe-tts") return "Stop read-aloud and keep full written recipe text.";
    if (key === "language.translated-media") return "Disable affected media translation and keep transcript and written instructions.";
    if (key === "language.rtl-support" || key.startsWith("language.locale.ar")) return "Use approved fallback without restarting recipe, preserving selected language preference.";
    return "Hide enhanced feature, preserve settings, and keep safe fallback.";
  }

  function preferenceForKey(key) {
    if (key.startsWith("accessibility.")) return "chefNovaAccessibilityPreferences";
    if (key.startsWith("language.")) return "chefNovaLocalizationPreferences";
    if (key.includes("voice") || key.includes("speech") || key.includes("microphone")) return "chefNovaAccessibilityPreferences.interaction.voiceControlEnabled";
    if (key.includes("timer")) return "chefNovaOfflineCookingPreferences";
    return "none";
  }

  function monitoringForKey(key) {
    if (key.startsWith("language.")) return ["feature-exposed", "translation-fallback-used", "feature-error"];
    if (key.includes("voice") || key.includes("speech")) return ["feature-exposed", "feature-fallback-used", "feature-error"];
    return ["feature-exposed", "feature-used", "feature-fallback-used"];
  }

  function rollbackPlanForKey(key) {
    if (key.includes("voice") || key.includes("speech")) return "voice-command-rollback";
    if (key.includes("timer")) return "timer-announcement-rollback";
    if (key.includes("rtl") || key.startsWith("language.locale.ar")) return "rtl-rollback";
    if (key.startsWith("language.")) return "translation-publication-rollback";
    return "enhanced-ui-rollback";
  }

  function createDefaultConfiguration() {
    const flags = {};
    REQUIRED_FEATURE_FLAGS.forEach((key) => {
      flags[key] = {
        key,
        status: key === "language.locale.en-CA" ? "general-availability" : "internal-testing",
        rolloutPercentage: 0,
        killSwitch: { active: false, owner: ownerForKey(key), reason: "", activatedAt: "" },
        allowedEnvironments: ["development", "test"],
        allowedAccountIds: [],
        allowedOrganizationIds: [],
        approvedContentVersion: key === "language.locale.en-CA" ? "source-en-ca-v1" : "",
        locale: key.startsWith("language.locale.") ? key.replace("language.locale.", "") : "",
        dependencies: DEPENDENCIES[key] || []
      };
    });
    flags["privacy.microphone-controls"].status = "general-availability";
    flags["accessibility.keyboard-focus-foundation"].status = "general-availability";
    ["language.rtl-support", "language.translated-media", "language.multilingual-speech-commands"].forEach((key) => { flags[key].status = "draft"; });
    REQUIRED_FEATURE_FLAGS.filter((key) => key.startsWith("language.locale.") && key !== "language.locale.en-CA").forEach((key) => { flags[key].status = "draft"; });
    REQUIRED_FEATURE_FLAGS.filter((key) => key.startsWith("language.speech-commands.")).forEach((key) => { flags[key].status = "draft"; });
    return { configurationVersion: CONFIGURATION_VERSION, applicationVersion: APPLICATION_VERSION, cohortSaltVersion: "chef-nova-rollout-salt-v1", flags, serverControlledFlags: ["cooking.voice-navigation", "pantry.speech-entry", "privacy.microphone-controls", "language.bridge", "language.translated-media", "language.rtl-support", ...REQUIRED_FEATURE_FLAGS.filter((key) => key.startsWith("language.locale."))] };
  }

  function createCriterion(id, category, description, required = true, status = "not-evaluated", evidenceReferences = [], notes = "") {
    return { id, category, description, required, status, evidenceReferences, issueIds: [], notes };
  }

  function createDefaultStageRecords() {
    return ACCESSIBILITY_ROLLOUT_STAGES.map((id) => {
      const featureFlagKeys = REQUIRED_FEATURE_FLAGS.filter((key) => FLAG_CATALOG[key].stage === id);
      return {
        id,
        status: "draft",
        featureFlagKeys,
        localeFlagKeys: featureFlagKeys.filter((key) => key.startsWith("language.locale.")),
        releaseOwner: "release-owner",
        technicalOwner: "technical-owner",
        accessibilityOwner: "accessibility-owner",
        languageOwners: id.startsWith("stage-3") || id.startsWith("stage-4") ? ["language-owner"] : [],
        targetApplicationVersion: APPLICATION_VERSION,
        targetCommit: "",
        entryCriteria: defaultEntryCriteria(id),
        exitCriteria: defaultExitCriteria(id),
        rollbackCriteria: defaultRollbackCriteria(id),
        evidenceReferences: [],
        openIssueIds: [],
        notes: "Infrastructure record only. Not a production rollout."
      };
    });
  }

  function defaultEntryCriteria(stageId) {
    const common = [
      createCriterion(`${stageId}-entry-tests`, "automated-tests", "Required automated tests pass."),
      createCriterion(`${stageId}-entry-privacy`, "privacy", "Privacy payloads exclude private user content and disability inference."),
      createCriterion(`${stageId}-entry-monitoring`, "monitoring", "Privacy-safe monitoring route is available."),
      createCriterion(`${stageId}-entry-rollback`, "rollback", "Rollback procedure is rehearsed or marked blocked as release risk.")
    ];
    if (stageId === "stage-2-independent-cooking") common.push(createCriterion(`${stageId}-entry-voice`, "privacy", "Step 70 voice safety protections pass."));
    if (stageId === "stage-3-initial-language-bridge" || stageId === "stage-4-expanded-languages") common.push(createCriterion(`${stageId}-entry-language`, "language-review", "Required fluent human review and Step 67 publication gates pass."));
    return common;
  }

  function defaultExitCriteria(stageId) {
    return [
      createCriterion(`${stageId}-exit-manual`, "manual-testing", "Required manual checks are completed."),
      createCriterion(`${stageId}-exit-at`, "assistive-technology", "Required assistive-technology checks pass where available."),
      createCriterion(`${stageId}-exit-sev`, "support-readiness", "No open Severity 0 or Severity 1 defects remain."),
      createCriterion(`${stageId}-exit-rollback`, "rollback", "Production-like rollback drill passes.")
    ];
  }

  function defaultRollbackCriteria(stageId) {
    return [
      createCriterion(`${stageId}-rollback-settings`, "rollback", "Rollback preserves user settings and confirmed data."),
      createCriterion(`${stageId}-rollback-session`, "rollback", "Active cooking state and timers survive safe flag changes."),
      createCriterion(`${stageId}-rollback-fallback`, "rollback", "Manual fallback remains available.")
    ];
  }

  function normalizeContext(context = {}) {
    assertMinimizedEvaluationContext(context);
    const result = {
      environment: ["development", "test", "preview", "production"].includes(context.environment) ? context.environment : "production",
      applicationVersion: context.applicationVersion || APPLICATION_VERSION,
      accountId: context.accountId || "",
      anonymousStableId: context.anonymousStableId || "",
      organizationId: context.organizationId || "",
      explicitBetaOptIn: context.explicitBetaOptIn === true,
      requestedLocale: context.requestedLocale || "en-CA",
      deviceCategory: ["desktop", "mobile", "tablet"].includes(context.deviceCategory) ? context.deviceCategory : "desktop"
    };
    assertMinimizedEvaluationContext(result);
    return result;
  }

  function assertMinimizedEvaluationContext(context = {}) {
    Object.keys(context || {}).forEach((key) => {
      if (PRIVATE_CONTEXT_KEYS.includes(key)) throw new Error(`Rollout context contains prohibited private key: ${key}`);
    });
    const text = JSON.stringify(context);
    if (/blindUser|dyslexicUser|cognitiveDisability|inferredDisability|rawAudio|transcript|pantryContents|allergyInformation|wasteDiary/i.test(text)) throw new Error("Rollout context contains prohibited private or disability-inference data.");
    return true;
  }

  function deterministicBucket(identifier, flagKey, saltVersion = DEFAULT_ROLLOUT_CONFIG.cohortSaltVersion) {
    const stable = String(identifier || "anonymous-low-entropy");
    const text = `${saltVersion}:${flagKey}:${stable}`;
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0) % 10000 / 100;
  }

  function evaluateFeatureFlag(key, context = {}, configuration = DEFAULT_ROLLOUT_CONFIG, options = {}) {
    const evaluatedAt = options.evaluatedAt || nowIso();
    const config = configuration.flags?.[key];
    const safeResult = (enabled, reason) => ({ key, enabled, reason, configurationVersion: configuration.configurationVersion || CONFIGURATION_VERSION, evaluatedAt });
    if (!config || !FLAG_CATALOG[key]) return safeResult(false, "default");
    const ctx = normalizeContext(context);
    if (config.killSwitch?.active) return safeResult(false, "kill-switch");
    if (config.minimumApplicationVersion && compareVersions(ctx.applicationVersion, config.minimumApplicationVersion) < 0) return safeResult(false, "unsupported-version");
    if (Array.isArray(config.allowedEnvironments) && config.allowedEnvironments.length && !config.allowedEnvironments.includes(ctx.environment) && config.status !== "general-availability") return safeResult(false, "unsupported-environment");
    const dependencyResult = dependenciesSatisfied(key, ctx, configuration, options);
    if (!dependencyResult.ok) return safeResult(false, "dependency-disabled");
    if (key.startsWith("language.locale.") && config.locale && config.locale !== ctx.requestedLocale) return safeResult(false, "locale-enabled");
    if (config.status === "retired" || config.status === "rolled-back" || config.status === "rolling-back" || config.status === "paused" || config.status === "draft") return safeResult(false, "default");
    if (config.status === "general-availability") return safeResult(true, key.startsWith("language.locale.") ? "locale-enabled" : "default");
    if (config.allowedAccountIds?.includes(ctx.accountId) || config.allowedOrganizationIds?.includes(ctx.organizationId)) return safeResult(true, "internal-user");
    if (config.status === "internal-testing" && ["development", "test"].includes(ctx.environment)) return safeResult(true, "internal-user");
    if (config.status === "pilot" && ctx.explicitBetaOptIn) return safeResult(true, "explicit-beta-opt-in");
    if (config.status === "limited-rollout") {
      const identifier = ctx.accountId || ctx.anonymousStableId;
      const bucket = deterministicBucket(identifier, key, configuration.cohortSaltVersion);
      return safeResult(bucket < Number(config.rolloutPercentage || 0), "rollout-cohort");
    }
    return safeResult(false, "default");
  }

  function dependenciesSatisfied(key, context = {}, configuration = DEFAULT_ROLLOUT_CONFIG, options = {}) {
    const dependencies = configuration.flags?.[key]?.dependencies || DEPENDENCIES[key] || [];
    for (const dependency of dependencies) {
      if (dependency === "manual.pantry-form") {
        if (options.manualPantryFormAvailable === false) return { ok: false, dependency };
        continue;
      }
      if (dependency === "step65.localization" || dependency === "step67.content-review" || dependency === "step70.voice-command-policy" || dependency === "content.source-approved") {
        if (options[dependency] === false) return { ok: false, dependency };
        continue;
      }
      if (dependency === "locale.rtl-approved") {
        if (!options.rtlApprovedLocales?.includes?.(context.requestedLocale || "ar")) return { ok: false, dependency };
        continue;
      }
      if (dependency === "media.reviewed-captions" || dependency === "media.reviewed-transcript") {
        if (options[dependency] !== true) return { ok: false, dependency };
        continue;
      }
      const result = evaluateFeatureFlag(dependency, context, configuration, { ...options, dependencyStack: [...(options.dependencyStack || []), key] });
      if (!result.enabled) return { ok: false, dependency };
    }
    return { ok: true };
  }

  function evaluateMany(keys = [], context = {}, configuration = DEFAULT_ROLLOUT_CONFIG, options = {}) {
    return Object.fromEntries(keys.map((key) => [key, evaluateFeatureFlag(key, context, configuration, options)]));
  }

  function getReleaseSnapshot(context = {}, configuration = DEFAULT_ROLLOUT_CONFIG, options = {}) {
    const flags = Object.fromEntries(REQUIRED_FEATURE_FLAGS.map((key) => [key, evaluateFeatureFlag(key, context, configuration, options).enabled]));
    return { configurationVersion: configuration.configurationVersion || CONFIGURATION_VERSION, generatedAt: options.generatedAt || nowIso(), flags };
  }

  function compareVersions(current = "", required = "") {
    if (!required || current === required) return 0;
    const currentParts = String(current).split(/[.-]/).map((part) => Number(part) || 0);
    const requiredParts = String(required).split(/[.-]/).map((part) => Number(part) || 0);
    const length = Math.max(currentParts.length, requiredParts.length);
    for (let index = 0; index < length; index += 1) {
      if ((currentParts[index] || 0) > (requiredParts[index] || 0)) return 1;
      if ((currentParts[index] || 0) < (requiredParts[index] || 0)) return -1;
    }
    return 0;
  }

  function validateRolloutConfiguration(configuration = DEFAULT_ROLLOUT_CONFIG, options = {}) {
    const issues = [];
    Object.entries(configuration.flags || {}).forEach(([key, flag]) => {
      if (!FLAG_CATALOG[key]) issues.push(issue("unknown-flag", key, "Unknown flag key."));
      if (!ROLLOUT_STAGE_STATUSES.includes(flag.status)) issues.push(issue("invalid-status", key, "Invalid rollout status."));
      if (Number(flag.rolloutPercentage || 0) < 0 || Number(flag.rolloutPercentage || 0) > 100) issues.push(issue("invalid-rollout-percentage", key, "Rollout percentage must be 0 through 100."));
      if (flag.killSwitch?.active && (!flag.killSwitch.owner || !flag.killSwitch.reason)) issues.push(issue("kill-switch-metadata-missing", key, "Active kill switch requires owner and reason."));
      if (key === "cooking.voice-navigation" && flag.status !== "draft" && configuration.flags["privacy.microphone-controls"]?.killSwitch?.active) issues.push(issue("voice-without-privacy", key, "Voice cannot be enabled while microphone privacy controls are killed."));
      if (key === "pantry.speech-entry" && flag.status !== "draft" && options.manualPantryFormAvailable === false) issues.push(issue("speech-without-manual-form", key, "Pantry speech requires labelled Pantry form."));
      if (key.startsWith("language.locale.") && flag.status !== "draft" && flag.status !== "rolled-back" && key !== "language.locale.en-CA" && !flag.approvedContentVersion) issues.push(issue("locale-without-approved-content", key, "Locale requires approved content version."));
      if (key === "language.rtl-support" && flag.status !== "draft" && !options.rtlApprovedLocales?.length) issues.push(issue("rtl-without-approved-locale", key, "RTL requires an approved RTL locale."));
      if (key === "language.translated-media" && flag.status !== "draft" && (options.reviewedCaptions !== true || options.reviewedTranscript !== true)) issues.push(issue("translated-media-unreviewed", key, "Translated media requires reviewed captions and transcript."));
    });
    if (options.machineDraftSafetyTranslationReferenced) issues.push(issue("machine-draft-safety-translation", "language.bridge", "Machine-draft safety translation cannot be enabled."));
    return { valid: issues.length === 0, issues };
  }

  function issue(code, flagKey, message) {
    return { code, flagKey, message, severity: "error" };
  }

  function canAdvanceStage(stageRecord = {}, options = {}) {
    const requiredCriteria = [...(stageRecord.entryCriteria || []), ...(stageRecord.exitCriteria || [])].filter((criterion) => criterion.required);
    const failing = requiredCriteria.filter((criterion) => criterion.status !== "passed");
    const severeIssues = (stageRecord.openIssueIds || []).filter((id) => /^sev[01][:-]/i.test(id));
    if (options.openSeverity0Count > 0) severeIssues.push("sev0:count");
    if (options.openSeverity1Count > 0) severeIssues.push("sev1:count");
    return {
      allowed: failing.length === 0 && severeIssues.length === 0,
      blockedCriteria: failing,
      severeIssueIds: severeIssues,
      reason: failing.length ? "required-criteria-not-passed" : severeIssues.length ? "severity-blocker-open" : "ready"
    };
  }

  function preserveFeatureBackedPreference(preferredValue, featureEvaluation) {
    return { preferredValue, featureCurrentlyAvailable: Boolean(featureEvaluation?.enabled), unavailableReason: featureEvaluation?.enabled ? "" : featureEvaluation?.reason || "disabled" };
  }

  function applySessionSafeFlagRefresh(sessionState = {}, changedFlags = {}) {
    return {
      cookingProgress: sessionState.cookingProgress || null,
      activeTimers: Array.isArray(sessionState.activeTimers) ? sessionState.activeTimers.map((timer) => ({ ...timer })) : [],
      offlinePackages: Array.isArray(sessionState.offlinePackages) ? sessionState.offlinePackages.map((pack) => ({ ...pack })) : [],
      selectedLocale: sessionState.selectedLocale || "",
      oneInstructionPreference: sessionState.oneInstructionPreference,
      presentationMode: changedFlags["accessibility.one-instruction-mode"] === false ? "standard-cooking-view" : sessionState.presentationMode || "unchanged",
      voiceSessionAction: changedFlags["cooking.voice-navigation"] === false || changedFlags["pantry.speech-entry"] === false ? "stop-recognition-release-microphone" : "unchanged",
      dataPreserved: true
    };
  }

  function activateKillSwitch(configuration = DEFAULT_ROLLOUT_CONFIG, flagKey, { owner, reason, incidentId = "", activatedAt = nowIso() } = {}) {
    const next = clone(configuration);
    if (!next.flags?.[flagKey]) return { ok: false, reason: "unknown-flag", configuration };
    next.flags[flagKey].killSwitch = { active: true, owner, reason, incidentId, activatedAt };
    const auditEvent = createFeatureFlagAuditEvent({ flagKey, previousConfiguration: configuration.flags[flagKey], nextConfiguration: next.flags[flagKey], action: "kill-switch-activated", actorId: owner, reason, ticketOrIncidentId: incidentId });
    return { ok: true, configuration: next, auditEvent };
  }

  function createFeatureFlagAuditEvent({ flagKey, previousConfiguration = {}, nextConfiguration = {}, action, actorId, reason, ticketOrIncidentId = "" } = {}) {
    const record = {
      id: `flag-audit:${flagKey}:${Date.now()}`,
      flagKey,
      previousConfiguration: scrubFlagConfiguration(previousConfiguration),
      nextConfiguration: scrubFlagConfiguration(nextConfiguration),
      action,
      actorId: actorId || "unknown",
      reason: reason || "",
      ticketOrIncidentId,
      createdAt: nowIso()
    };
    assertPrivacySafePayload(record);
    return record;
  }

  function scrubFlagConfiguration(config = {}) {
    return {
      status: config.status,
      rolloutPercentage: config.rolloutPercentage,
      killSwitch: config.killSwitch ? { active: Boolean(config.killSwitch.active), owner: config.killSwitch.owner || "", reason: config.killSwitch.reason || "", incidentId: config.killSwitch.incidentId || "", activatedAt: config.killSwitch.activatedAt || "" } : undefined,
      configurationVersion: config.configurationVersion
    };
  }

  function createRolloutHealthEvent(input = {}) {
    const event = {
      event: ["feature-exposed", "feature-used", "feature-fallback-used", "feature-error", "recovery-opened", "translation-fallback-used", "offline-update-required"].includes(input.event) ? input.event : "feature-error",
      featureFlagKey: REQUIRED_FEATURE_FLAGS.includes(input.featureFlagKey) ? input.featureFlagKey : "unknown",
      rolloutStage: ACCESSIBILITY_ROLLOUT_STAGES.includes(input.rolloutStage) ? input.rolloutStage : "stage-1-visual-keyboard",
      locale: input.locale && SUPPORTED_LOCALES.includes(input.locale) ? input.locale : undefined,
      applicationVersion: input.applicationVersion || APPLICATION_VERSION,
      configurationVersion: input.configurationVersion || CONFIGURATION_VERSION,
      outcome: ["success", "cancelled", "failed", "fallback"].includes(input.outcome) ? input.outcome : undefined,
      errorCategory: input.errorCategory || undefined,
      containsUserContent: false,
      containsRawAudio: false,
      containsDisabilityInference: false
    };
    assertPrivacySafePayload(event);
    return Object.freeze(Object.fromEntries(Object.entries(event).filter(([, value]) => value !== undefined)));
  }

  function assertPrivacySafePayload(payload = {}) {
    const text = JSON.stringify(payload);
    if (PRIVATE_PAYLOAD_KEYS.some((term) => new RegExp(`"${term}"\\s*:`, "i").test(text))) throw new Error("Rollout payload contains private user content or disability inference.");
    if (PRIVATE_PAYLOAD_VALUE_CANARIES.some((term) => text.includes(term))) throw new Error("Rollout payload contains private user content or disability inference.");
    return true;
  }

  function createRollbackPlan(input = {}) {
    return {
      id: input.id || "general-rollback",
      affectedStage: input.affectedStage || "stage-1-visual-keyboard",
      affectedFlags: input.affectedFlags || [],
      triggerConditions: input.triggerConditions || ["Severity 0 or Severity 1 defect", "privacy violation", "safety warning issue"],
      immediateActions: input.immediateActions || ["Activate affected kill switch", "Preserve user state", "Show safe fallback"],
      dataProtectionActions: input.dataProtectionActions || ["Do not delete preferences", "Do not delete confirmed user data", "Do not clear offline packages"],
      cacheActions: input.cacheActions || ["Refresh flag snapshot", "Invalidate only affected assets"],
      userCommunicationActions: input.userCommunicationActions || ["Show feature-unavailable message with fallback"],
      previousSafeApplicationVersion: input.previousSafeApplicationVersion || "",
      previousSafeConfigurationVersion: input.previousSafeConfigurationVersion || CONFIGURATION_VERSION,
      previousSafeContentManifestId: input.previousSafeContentManifestId || "",
      verificationSteps: input.verificationSteps || ["Run focused regression", "Verify data preservation", "Verify fallback"],
      owners: input.owners || ["release-owner"],
      lastRehearsedAt: input.lastRehearsedAt || "",
      evidenceReferences: input.evidenceReferences || []
    };
  }

  function rollbackTranslationVersion({ locale, currentVersion, previousApprovedVersion, safetyCritical = false } = {}) {
    return {
      ok: Boolean(previousApprovedVersion) || safetyCritical,
      locale,
      disabledVersion: currentVersion,
      restoredVersion: previousApprovedVersion || "",
      fallback: previousApprovedVersion ? "previous-approved-version" : "approved-source-language-warning",
      safetyWarningVisible: true,
      machineDraftPublished: false,
      userLanguagePreferencePreserved: true,
      reviewTaskRequired: true,
      auditRequired: true
    };
  }

  function rollbackVoiceFeature(session = {}) {
    return {
      recognitionAction: "stop",
      microphoneTracksReleased: true,
      lateCallbacksRejected: true,
      pendingSensitiveActionsCancelled: true,
      keyboardControlsAvailable: true,
      touchControlsAvailable: true,
      screenReaderControlsAvailable: true,
      pantryFormAvailable: true,
      voicePreferencePreserved: true,
      confirmedPantryDataPreserved: true,
      timersPreserved: true,
      cookingProgressPreserved: true,
      sessionId: session.id || ""
    };
  }

  function rollbackTimerPresentation(timers = []) {
    return timers.map((timer) => ({ ...timer, presenter: "previous-known-safe", targetEndAt: timer.targetEndAt, status: timer.status, restarted: false }));
  }

  function rollbackRtlLocale(state = {}) {
    return { ...state, layoutDirection: "fallback-ltr-approved-source", selectedLocalePreference: state.selectedLocalePreference || "ar", currentRecipeId: state.currentRecipeId || "", currentStepIndex: state.currentStepIndex ?? 0, timers: state.timers || [], languageRecoveryAvailable: true };
  }

  function markOfflinePackageForRollbackUpdate(pack = {}, rollback = {}) {
    return { ...pack, status: pack.status || "available", updateRequired: true, updateReason: rollback.reason || "publication-rollback", immutableSnapshotPreserved: true, cookingProgressPreserved: true, replacementRequiresUserAction: true };
  }

  function validateUnifiedStorage(storageNames = USER_DATA_STORES) {
    const invalid = storageNames.filter((name) => /voice_items|speech_items|language_bridge_recipes|rtl_users|pantry_voice|recipe_translation_store/i.test(name));
    return { ok: invalid.length === 0, invalidStores: invalid, canonicalStores: storageNames };
  }

  function explicitBetaOptOut(userState = {}, disabledFlags = []) {
    return { ...clone(userState), explicitBetaOptIn: false, disabledFlags, dataPreserved: true, preferencesPreserved: true };
  }

  function createReleaseDashboardModel({ stages = DEFAULT_STAGE_RECORDS, configuration = DEFAULT_ROLLOUT_CONFIG, incidents = [], maintenanceRecords = [] } = {}) {
    return {
      generatedAt: nowIso(),
      configurationVersion: configuration.configurationVersion,
      stages: stages.map((stage) => ({
        id: stage.id,
        status: stage.status,
        features: stage.featureFlagKeys.map((key) => ({ key, enabledByDefault: false, flagStatus: configuration.flags[key]?.status || "unknown", owner: FLAG_CATALOG[key]?.owner || "" })),
        entryCriteriaStatus: summarizeCriteria(stage.entryCriteria),
        exitCriteriaStatus: summarizeCriteria(stage.exitCriteria),
        openDefects: stage.openIssueIds || [],
        currentIncidents: incidents.filter((incident) => incident.affectedStage === stage.id),
        monitoringStatus: "infrastructure-only",
        rollbackReadiness: summarizeCriteria(stage.rollbackCriteria),
        lastManualTestDate: latestDate(maintenanceRecords, "manual-testing"),
        lastLanguageReviewDate: latestDate(maintenanceRecords, "language-review"),
        lastAssistiveTechnologyReviewDate: latestDate(maintenanceRecords, "assistive-technology"),
        currentReleaseDecision: canAdvanceStage(stage).allowed ? "ready-for-review" : "blocked-or-draft"
      }))
    };
  }

  function summarizeCriteria(criteria = []) {
    const required = criteria.filter((criterion) => criterion.required);
    return { total: criteria.length, required: required.length, passed: required.filter((criterion) => criterion.status === "passed").length, blocked: required.filter((criterion) => criterion.status === "blocked").length, failed: required.filter((criterion) => criterion.status === "failed").length };
  }

  function latestDate(records = [], type) {
    return records.filter((record) => record.reviewType === type).map((record) => record.date).sort().pop() || "";
  }

  function createIncident(input = {}) {
    return {
      id: input.id || `incident:${Date.now()}`,
      status: input.status || "investigating",
      affectedFeature: input.affectedFeature || "",
      affectedLocale: input.affectedLocale || "",
      affectedApplicationVersions: input.affectedApplicationVersions || [],
      userImpact: input.userImpact || "",
      accessibilityImpact: input.accessibilityImpact || "",
      privacyImpact: input.privacyImpact || "",
      safetyImpact: input.safetyImpact || "",
      immediateMitigation: input.immediateMitigation || "",
      rollbackDecision: input.rollbackDecision || "",
      rootCause: input.rootCause || "",
      correctiveActions: input.correctiveActions || [],
      regressionTests: input.regressionTests || [],
      maintenanceChanges: input.maintenanceChanges || []
    };
  }

  function createMaintenanceRecord(input = {}) {
    return {
      reviewType: input.reviewType || "automated-tests",
      date: input.date || nowIso().slice(0, 10),
      applicationVersion: input.applicationVersion || APPLICATION_VERSION,
      browserAndAssistiveTechnologyVersions: input.browserAndAssistiveTechnologyVersions || [],
      localesReviewed: input.localesReviewed || [],
      componentsReviewed: input.componentsReviewed || [],
      recipesReviewed: input.recipesReviewed || [],
      issuesFound: input.issuesFound || [],
      severity: input.severity || "none",
      owners: input.owners || ["release-owner"],
      remediationDates: input.remediationDates || [],
      retestEvidence: input.retestEvidence || [],
      nextReviewDate: input.nextReviewDate || ""
    };
  }

  function createDefaultRollbackPlans() {
    return [
      createRollbackPlan({ id: "voice-command-rollback", affectedStage: "stage-2-independent-cooking", affectedFlags: ["cooking.voice-navigation", "pantry.speech-entry"], immediateActions: ["Activate voice kill switch", "Stop recognition", "Release microphone tracks", "Reject late callbacks", "Show manual controls"] }),
      createRollbackPlan({ id: "translation-publication-rollback", affectedStage: "stage-3-initial-language-bridge", affectedFlags: ["language.bridge", "language.translated-media"], immediateActions: ["Disable faulty publication version", "Restore previous approved manifest", "Keep source-language fallback"] }),
      createRollbackPlan({ id: "safety-warning-rollback", affectedStage: "stage-3-initial-language-bridge", affectedFlags: ["language.bridge"], immediateActions: ["Disable affected safety translation", "Restore approved warning or source-language warning", "Require safety review before republishing"] }),
      createRollbackPlan({ id: "timer-announcement-rollback", affectedStage: "stage-2-independent-cooking", affectedFlags: ["cooking.accessible-timers"], immediateActions: ["Use previous timer presenter", "Preserve target timestamps", "Keep visible timer"] }),
      createRollbackPlan({ id: "rtl-rollback", affectedStage: "stage-4-expanded-languages", affectedFlags: ["language.rtl-support", "language.locale.ar"], immediateActions: ["Disable affected RTL experience", "Preserve selected locale", "Use approved fallback"] }),
      createRollbackPlan({ id: "offline-package-rollback", affectedStage: "stage-3-initial-language-bridge", affectedFlags: ["language.translated-media"], immediateActions: ["Mark affected package update required on reconnection", "Preserve immutable snapshot and progress"] }),
      createRollbackPlan({ id: "migration-rollback", affectedStage: "stage-1-visual-keyboard", affectedFlags: [], immediateActions: ["Pause rollout", "Keep expanded schema readable", "Do not delete source data"] })
    ];
  }

  function createMaintenanceOwners() {
    return {
      accessibilityEngineering: "accessibility-owner",
      designSystemAccessibility: "design-system-owner",
      keyboardAndFocusBehavior: "accessibility-owner",
      screenReaderTesting: "assistive-technology-owner",
      mobileAccessibility: "mobile-accessibility-owner",
      voiceAndMicrophonePrivacy: "voice-privacy-owner",
      timerAccessibility: "timer-accessibility-owner",
      englishContent: "content-owner",
      frenchLanguageReview: "fr-ca-language-owner",
      simplifiedChineseReview: "zh-hans-language-owner",
      traditionalChineseReview: "zh-hant-language-owner",
      arabicAndRtlReview: "ar-rtl-owner",
      punjabiReview: "pa-language-owner",
      spanishReview: "es-language-owner",
      ukrainianReview: "uk-language-owner",
      vietnameseReview: "vi-language-owner",
      koreanReview: "ko-language-owner",
      ingredientLexicon: "ingredient-lexicon-owner",
      cookingGlossary: "glossary-owner",
      allergyContent: "allergy-safety-owner",
      foodSafetyContent: "food-safety-owner",
      captionsAndTranscripts: "media-accessibility-owner",
      offlineSupport: "offline-owner",
      featureFlags: "release-owner",
      migrations: "technical-owner",
      incidentResponse: "incident-commander"
    };
  }

  function createMaintenanceSchedule() {
    return [
      { cadence: "continuous", owner: "technical-owner", activities: ["automated accessibility tests", "localization tests", "privacy payload tests", "voice-command policy tests", "timer persistence tests"] },
      { cadence: "weekly", owner: "release-owner", activities: ["Severity 0 and Severity 1 reports", "safety translation feedback", "accessibility task blockers", "failed migrations", "rollout health alerts"] },
      { cadence: "monthly", owner: "content-owner", activities: ["translation corrections", "ingredient lexicon requests", "glossary issues", "caption and transcript reports", "new recipes"] },
      { cadence: "quarterly", owner: "accessibility-owner", activities: ["browser compatibility", "screen-reader combinations", "mobile VoiceOver and TalkBack", "Step 69 matrix", "rollback drills"] },
      { cadence: "before-design-system-release", owner: "design-system-owner", activities: ["focus behavior", "control semantics", "contrast", "text reflow", "dialogs", "forms", "status messages"] }
    ];
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  return {
    CONFIGURATION_VERSION,
    APPLICATION_VERSION,
    ROLLOUT_STAGE_STATUSES,
    ACCESSIBILITY_ROLLOUT_STAGES,
    CRITERION_CATEGORIES,
    CRITERION_STATUSES,
    REQUIRED_FEATURE_FLAGS,
    SUPPORTED_LOCALES,
    NON_FLAGGED_SAFETY_INVARIANTS,
    USER_DATA_STORES,
    DEPENDENCIES,
    FLAG_CATALOG,
    DEFAULT_ROLLOUT_CONFIG,
    DEFAULT_STAGE_RECORDS,
    DEFAULT_ROLLBACK_PLANS,
    MAINTENANCE_OWNERS,
    MAINTENANCE_SCHEDULE,
    createFlagDefinition,
    createCriterion,
    normalizeContext,
    assertMinimizedEvaluationContext,
    deterministicBucket,
    evaluateFeatureFlag,
    evaluateMany,
    getReleaseSnapshot,
    validateRolloutConfiguration,
    canAdvanceStage,
    preserveFeatureBackedPreference,
    applySessionSafeFlagRefresh,
    activateKillSwitch,
    createFeatureFlagAuditEvent,
    createRolloutHealthEvent,
    assertPrivacySafePayload,
    createRollbackPlan,
    rollbackTranslationVersion,
    rollbackVoiceFeature,
    rollbackTimerPresentation,
    rollbackRtlLocale,
    markOfflinePackageForRollbackUpdate,
    validateUnifiedStorage,
    explicitBetaOptOut,
    createReleaseDashboardModel,
    createIncident,
    createMaintenanceRecord
  };
});
