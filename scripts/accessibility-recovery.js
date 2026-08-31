/* Chef Nova accessibility recovery, safe display preview, language transactions, and privacy-first feedback. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaAccessibilityRecovery = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const ACCESSIBILITY_RECOVERY_VERSION = 1;
  const DISPLAY_LIMITS = Object.freeze({ minimumFontScalePercent: 75, maximumFontScalePercent: 250, historyLimit: 5 });
  const DISPLAY_DEFAULTS = Object.freeze({
    fontScalePercent: 100,
    lineSpacing: "standard",
    wordSpacing: "standard",
    letterSpacing: "standard",
    contentWidth: "standard",
    largeButtons: false,
    highContrastMode: "system",
    reducedMotionMode: "system",
    dyslexiaFriendlyDisplay: false,
    readingGuide: false,
    focusHighlight: "standard"
  });
  const LANGUAGE_DEFAULTS = Object.freeze({
    interfaceLanguage: "en",
    interfaceLocale: "en-CA",
    regionCode: "CA",
    explanationLanguage: "en",
    explanationLocale: "en-CA",
    cookingTermLanguage: "en",
    cookingTermLocale: "en-CA",
    measurementLocale: "en-CA",
    selectedVoiceLanguage: "en",
    selectedVoiceLocale: "en-CA"
  });
  const INTERACTION_DEFAULTS = Object.freeze({
    keyboardShortcutsEnabled: true,
    oneInstructionAtATime: false,
    voiceControlEnabled: false,
    screenReaderAnnouncements: "standard"
  });
  const SPEECH_DEFAULTS = Object.freeze({
    readAloudEnabled: true,
    preserveVoiceInterpretationText: true,
    rawAudioFeedbackAllowed: false
  });
  const OFFLINE_DEFAULTS = Object.freeze({
    recoveryAvailableOffline: true,
    queueFeedbackOffline: true,
    keepLowBandwidthModeOnDisplayReset: true
  });
  const PRIVACY_DEFAULTS = Object.freeze({
    attachPrivateCookingDataByDefault: false,
    attachHealthDataByDefault: false,
    attachRawAudioByDefault: false,
    attachScreenshotsByDefault: false
  });
  const LINE_SPACING_VALUES = Object.freeze(["standard", "comfortable", "extra"]);
  const WORD_SPACING_VALUES = Object.freeze(["standard", "increased"]);
  const LETTER_SPACING_VALUES = Object.freeze(["standard", "increased"]);
  const CONTENT_WIDTH_VALUES = Object.freeze(["standard", "wide", "narrow"]);
  const MODE_VALUES = Object.freeze(["system", "on", "off"]);
  const FOCUS_VALUES = Object.freeze(["standard", "enhanced"]);
  const ANNOUNCEMENT_VALUES = Object.freeze(["standard", "detailed"]);
  const SUPPORTED_LOCALES = Object.freeze(["en-CA", "en-US", "fr-CA", "fr-FR", "zh-CN", "ar"]);
  const RTL_LOCALES = Object.freeze(["ar"]);
  const FEEDBACK_CATEGORIES = Object.freeze([
    { id: "keyboard-control-unreachable", label: "I could not reach a control with the keyboard", destination: "accessibility-engineering" },
    { id: "screen-reader-announcement-unclear", label: "The screen-reader announcement was unclear", destination: "accessibility-engineering" },
    { id: "text-cut-off", label: "Text was cut off", destination: "design-system" },
    { id: "translation-incorrect", label: "A translation was incorrect", destination: "localization" },
    { id: "cooking-term-confusing", label: "A cooking term was confusing", destination: "content-review" },
    { id: "captions-or-transcript-missing", label: "Captions or a transcript were missing", destination: "caption-transcript-review" },
    { id: "voice-control-misunderstood", label: "Voice control misunderstood me", destination: "voice-recognition-quality" },
    { id: "other", label: "Other", destination: "customer-support" }
  ]);
  const SENSITIVE_KEYS = Object.freeze(["pantry", "allerg", "diet", "medical", "health", "mealPlan", "shopping", "budget", "waste", "audio", "token", "password", "location", "clipboard", "recipeNote"]);
  const DIAGNOSTIC_ALLOW_LIST = Object.freeze(["appVersion", "buildVersion", "routeTemplate", "componentId", "interfaceLocale", "explanationLocale", "textDirection", "connectivityState", "browserFamily", "operatingSystemFamily", "viewportCategory", "featureAvailabilityState"]);

  function nowIso() {
    return new Date().toISOString();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clampNumber(value, minimum, maximum, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    if (number < minimum || number > maximum) return fallback;
    return Math.round(number);
  }

  function oneOf(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function createDefaultDisplayPreferences(systemPreferences = {}) {
    return {
      ...DISPLAY_DEFAULTS,
      highContrastMode: systemPreferences.prefersContrast === true ? "system" : DISPLAY_DEFAULTS.highContrastMode,
      reducedMotionMode: systemPreferences.prefersReducedMotion === true ? "system" : DISPLAY_DEFAULTS.reducedMotionMode
    };
  }

  function normalizeDisplayPreferences(input = {}, systemPreferences = {}) {
    const defaults = createDefaultDisplayPreferences(systemPreferences);
    return {
      fontScalePercent: clampNumber(input.fontScalePercent, DISPLAY_LIMITS.minimumFontScalePercent, DISPLAY_LIMITS.maximumFontScalePercent, defaults.fontScalePercent),
      lineSpacing: oneOf(input.lineSpacing, LINE_SPACING_VALUES, defaults.lineSpacing),
      wordSpacing: oneOf(input.wordSpacing, WORD_SPACING_VALUES, defaults.wordSpacing),
      letterSpacing: oneOf(input.letterSpacing, LETTER_SPACING_VALUES, defaults.letterSpacing),
      contentWidth: oneOf(input.contentWidth, CONTENT_WIDTH_VALUES, defaults.contentWidth),
      largeButtons: input.largeButtons === true,
      highContrastMode: oneOf(input.highContrastMode, MODE_VALUES, defaults.highContrastMode),
      reducedMotionMode: oneOf(input.reducedMotionMode, MODE_VALUES, defaults.reducedMotionMode),
      dyslexiaFriendlyDisplay: input.dyslexiaFriendlyDisplay === true,
      readingGuide: input.readingGuide === true,
      focusHighlight: oneOf(input.focusHighlight, FOCUS_VALUES, defaults.focusHighlight)
    };
  }

  function normalizeLanguagePreferences(input = {}) {
    const locale = SUPPORTED_LOCALES.includes(input.interfaceLocale || input.locale) ? input.interfaceLocale || input.locale : LANGUAGE_DEFAULTS.interfaceLocale;
    const languageFromLocale = locale.startsWith("fr") ? "fr" : locale.startsWith("zh") ? "zh-Hans" : locale.startsWith("ar") ? "ar" : "en";
    const normalizeLanguage = (value, fallback) => ["en", "fr", "zh-Hans", "ar"].includes(value) ? value : fallback;
    const normalizeRegion = (value) => {
      const raw = String(value || "").trim();
      if (raw === "device") return "device";
      const upper = raw.toUpperCase();
      const localeRegion = locale.split("-")[1];
      return ["CA", "US", "FR", "CN"].includes(upper) ? upper : (localeRegion ? localeRegion.toUpperCase() : "device");
    };
    return {
      interfaceLanguage: normalizeLanguage(input.interfaceLanguage, languageFromLocale),
      interfaceLocale: locale,
      regionCode: normalizeRegion(input.regionCode),
      explanationLanguage: normalizeLanguage(input.explanationLanguage, languageFromLocale),
      explanationLocale: SUPPORTED_LOCALES.includes(input.explanationLocale) ? input.explanationLocale : locale,
      cookingTermLanguage: normalizeLanguage(input.cookingTermLanguage, languageFromLocale),
      cookingTermLocale: SUPPORTED_LOCALES.includes(input.cookingTermLocale) ? input.cookingTermLocale : locale,
      measurementLocale: SUPPORTED_LOCALES.includes(input.measurementLocale) ? input.measurementLocale : locale,
      selectedVoiceLanguage: normalizeLanguage(input.selectedVoiceLanguage, languageFromLocale),
      selectedVoiceLocale: SUPPORTED_LOCALES.includes(input.selectedVoiceLocale) ? input.selectedVoiceLocale : locale
    };
  }

  function normalizePreferences(input = {}, systemPreferences = {}) {
    return {
      accessibilityRecoveryVersion: ACCESSIBILITY_RECOVERY_VERSION,
      display: normalizeDisplayPreferences(input.display || input, systemPreferences),
      language: normalizeLanguagePreferences(input.language || input.localization || input),
      interaction: {
        keyboardShortcutsEnabled: input.interaction?.keyboardShortcutsEnabled !== false,
        oneInstructionAtATime: input.interaction?.oneInstructionAtATime === true,
        voiceControlEnabled: input.interaction?.voiceControlEnabled === true,
        screenReaderAnnouncements: oneOf(input.interaction?.screenReaderAnnouncements, ANNOUNCEMENT_VALUES, INTERACTION_DEFAULTS.screenReaderAnnouncements)
      },
      speech: { ...SPEECH_DEFAULTS, ...(input.speech || {}), rawAudioFeedbackAllowed: false },
      offline: { ...OFFLINE_DEFAULTS, ...(input.offline || {}) },
      privacy: { ...PRIVACY_DEFAULTS, ...(input.privacy || {}) }
    };
  }

  function validateDisplayPreferences(input = {}, systemPreferences = {}) {
    const normalized = normalizeDisplayPreferences(input, systemPreferences);
    const issues = [];
    if (!Number.isFinite(Number(input.fontScalePercent)) || Number(input.fontScalePercent) < DISPLAY_LIMITS.minimumFontScalePercent || Number(input.fontScalePercent) > DISPLAY_LIMITS.maximumFontScalePercent) issues.push({ field: "fontScalePercent", code: "invalid-font-scale" });
    if (input.lineSpacing && !LINE_SPACING_VALUES.includes(input.lineSpacing)) issues.push({ field: "lineSpacing", code: "unsupported-line-spacing" });
    if (input.wordSpacing && !WORD_SPACING_VALUES.includes(input.wordSpacing)) issues.push({ field: "wordSpacing", code: "unsupported-word-spacing" });
    if (input.letterSpacing && !LETTER_SPACING_VALUES.includes(input.letterSpacing)) issues.push({ field: "letterSpacing", code: "unsupported-letter-spacing" });
    if (input.contentWidth && !CONTENT_WIDTH_VALUES.includes(input.contentWidth)) issues.push({ field: "contentWidth", code: "unsupported-content-width" });
    if (input.highContrastMode && !MODE_VALUES.includes(input.highContrastMode)) issues.push({ field: "highContrastMode", code: "unsupported-contrast-mode" });
    if (input.reducedMotionMode && !MODE_VALUES.includes(input.reducedMotionMode)) issues.push({ field: "reducedMotionMode", code: "unsupported-motion-mode" });
    return { valid: issues.length === 0, preferences: normalized, issues };
  }

  function getChangedDisplayFields(previous = {}, next = {}) {
    return Object.keys(DISPLAY_DEFAULTS).filter((key) => JSON.stringify(previous[key]) !== JSON.stringify(next[key]));
  }

  function summarizeDisplayChanges(previous = {}, next = {}) {
    const labels = {
      fontScalePercent: "Font size",
      lineSpacing: "Line spacing",
      wordSpacing: "Word spacing",
      letterSpacing: "Letter spacing",
      contentWidth: "Content width",
      largeButtons: "Large buttons",
      highContrastMode: "High contrast",
      reducedMotionMode: "Reduced motion",
      dyslexiaFriendlyDisplay: "Dyslexia-friendly display",
      readingGuide: "Reading guide",
      focusHighlight: "Focus highlight"
    };
    return getChangedDisplayFields(previous, next).map((field) => `${labels[field] || field} changed to ${String(next[field]).replace(/-/g, " ")}.`);
  }

  function restoreDisplayDefaults(preferences, systemPreferences = {}) {
    return { ...normalizePreferences(preferences, systemPreferences), display: createDefaultDisplayPreferences(systemPreferences) };
  }

  function createDisplayPreviewSession(previousSettings, proposedSettings, origin = {}) {
    return {
      id: `display-preview-${Date.now()}`,
      previousSettings: normalizeDisplayPreferences(previousSettings),
      proposedSettings: normalizeDisplayPreferences(proposedSettings),
      status: "previewing",
      originElementId: origin.originElementId || "",
      originRoute: origin.originRoute || "",
      startedAt: nowIso()
    };
  }

  function applyPreviewSession(preferences, session, source = "preview") {
    const current = normalizePreferences(preferences);
    const previous = normalizeDisplayPreferences(session.previousSettings);
    const next = normalizeDisplayPreferences(session.proposedSettings);
    const entry = createDisplayHistoryEntry(previous, next, source);
    return { preferences: { ...current, display: next }, historyEntry: entry, session: { ...session, status: "applied" }, changeSummary: summarizeDisplayChanges(previous, next) };
  }

  function cancelPreviewSession(preferences, session) {
    return { preferences: { ...normalizePreferences(preferences), display: normalizeDisplayPreferences(session.previousSettings) }, session: { ...session, status: "cancelled" } };
  }

  function recoverInterruptedPreview(preferences, previewSession) {
    if (!previewSession || previewSession.status !== "previewing") return { preferences: normalizePreferences(preferences), recovered: false };
    return { preferences: { ...normalizePreferences(preferences), display: normalizeDisplayPreferences(previewSession.previousSettings) }, recovered: true, message: "DISPLAY PREVIEW ENDED\nChef Nova returned to your previous display settings." };
  }

  function createDisplayHistoryEntry(previousSettings, nextSettings, source = "settings") {
    return {
      id: `display-history-${Date.now()}`,
      previousSettings: normalizeDisplayPreferences(previousSettings),
      nextSettings: normalizeDisplayPreferences(nextSettings),
      changedFields: getChangedDisplayFields(previousSettings, nextSettings),
      changedAt: nowIso(),
      source
    };
  }

  function addDisplayHistoryEntry(history = [], entry) {
    return [entry, ...(Array.isArray(history) ? history : [])].slice(0, DISPLAY_LIMITS.historyLimit);
  }

  function undoLastDisplayChange(preferences, history = []) {
    const [entry, ...remaining] = Array.isArray(history) ? history : [];
    if (!entry) return { ok: false, preferences: normalizePreferences(preferences), history: [], message: "No display change to undo." };
    return { ok: true, preferences: { ...normalizePreferences(preferences), display: normalizeDisplayPreferences(entry.previousSettings) }, history: remaining, restoredFields: entry.changedFields || [], message: "Display changes undone." };
  }

  function captureRecoverableSessionSnapshot(session = {}) {
    return {
      route: session.route || "home",
      recipeId: session.recipeId || "",
      recipeVersion: session.recipeVersion || null,
      currentStepId: session.currentStepId || "",
      completedStepIds: Array.isArray(session.completedStepIds) ? [...session.completedStepIds] : [],
      activeTimerIds: Array.isArray(session.activeTimerIds) ? [...session.activeTimerIds] : [],
      pausedTimerIds: Array.isArray(session.pausedTimerIds) ? [...session.pausedTimerIds] : [],
      pantryDraftId: session.pantryDraftId || "",
      mealReservationDraftId: session.mealReservationDraftId || "",
      shoppingListDraftId: session.shoppingListDraftId || "",
      budgetDraftId: session.budgetDraftId || "",
      voiceInterpretationDraftId: session.voiceInterpretationDraftId || "",
      focusedElementKey: session.focusedElementKey || ""
    };
  }

  function createLanguageChangeTransaction(previousLanguagePreferences, proposedLanguagePreferences, sessionSnapshot = {}) {
    return {
      id: `language-change-${Date.now()}`,
      previousLanguagePreferences: normalizeLanguagePreferences(previousLanguagePreferences),
      proposedLanguagePreferences: normalizeLanguagePreferences(proposedLanguagePreferences),
      sessionSnapshot: captureRecoverableSessionSnapshot(sessionSnapshot),
      status: "preparing",
      startedAt: nowIso()
    };
  }

  function applyLanguageChange(preferences, transaction, options = {}) {
    const target = transaction.proposedLanguagePreferences.interfaceLocale;
    if (!SUPPORTED_LOCALES.includes(target) || options.forceFailure === true) {
      return { ok: false, preferences: { ...normalizePreferences(preferences), language: transaction.previousLanguagePreferences }, transaction: { ...transaction, status: "failed" }, restoredSnapshot: transaction.sessionSnapshot, message: "LANGUAGE CHANGE WAS NOT COMPLETED\nChef Nova returned to your previous language. Your recipe, cooking step, timers, and drafts were preserved." };
    }
    return { ok: true, preferences: { ...normalizePreferences(preferences), language: transaction.proposedLanguagePreferences }, transaction: { ...transaction, status: "completed" }, restoredSnapshot: transaction.sessionSnapshot, direction: RTL_LOCALES.includes(target) ? "rtl" : "ltr" };
  }

  function createVoiceInterpretationDraft({ text = "", sourceLocale = "en-CA", interpretationStatus = "partial" } = {}) {
    return { id: `voice-draft-${Date.now()}`, text: sanitizeText(text), sourceLocale, interpretationStatus, createdAt: nowIso() };
  }

  function sanitizeText(value) {
    return String(value || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 1200);
  }

  function collectSafeDiagnostics(input = {}) {
    return DIAGNOSTIC_ALLOW_LIST.reduce((safe, key) => {
      if (input[key] !== undefined && input[key] !== null && String(input[key]).length < 160) safe[key] = input[key];
      return safe;
    }, {});
  }

  function createFeedbackDraft(input = {}) {
    const category = FEEDBACK_CATEGORIES.some((item) => item.id === input.category) ? input.category : "";
    return {
      id: input.id || `AF-${Math.floor(10000 + Math.random() * 89999)}`,
      category,
      description: sanitizeText(input.description),
      userImpact: ["minor", "blocked-task", "safety-concern"].includes(input.userImpact) ? input.userImpact : "minor",
      contentReference: input.contentReference || null,
      intendedVoiceCommand: sanitizeText(input.intendedVoiceCommand),
      recognizedVoiceText: sanitizeText(input.recognizedVoiceText),
      voiceLocale: input.voiceLocale || "",
      includePageContext: input.includePageContext === true,
      includeDisplaySettings: input.includeDisplaySettings === true,
      includeLanguageSettings: input.includeLanguageSettings === true,
      includeRecognizedVoiceText: input.includeRecognizedVoiceText === true,
      includeScreenshot: input.includeScreenshot === true,
      includeTechnicalDiagnostics: input.includeTechnicalDiagnostics === true,
      createdAt: input.createdAt || nowIso()
    };
  }

  function createFeedbackRecord(draft, context = {}) {
    const cleanDraft = createFeedbackDraft(draft);
    const consentRecord = {
      includePageContext: cleanDraft.includePageContext,
      includeDisplaySettings: cleanDraft.includeDisplaySettings,
      includeLanguageSettings: cleanDraft.includeLanguageSettings,
      includeRecognizedVoiceText: cleanDraft.includeRecognizedVoiceText,
      includeScreenshot: false,
      includeTechnicalDiagnostics: cleanDraft.includeTechnicalDiagnostics,
      confirmedAt: nowIso()
    };
    const payload = {
      id: cleanDraft.id,
      category: cleanDraft.category || "other",
      description: cleanDraft.description,
      userImpact: cleanDraft.userImpact,
      contentReference: cleanDraft.contentReference,
      consentRecord,
      included: {},
      notIncluded: ["pantry contents", "allergy information", "dietary restrictions", "health information", "meal plans", "shopping lists", "budget data", "waste diary details", "raw audio", "screenshots", "authentication tokens"],
      status: context.offline ? "queued-offline" : "received",
      triageDestination: routeFeedback(cleanDraft),
      priority: cleanDraft.userImpact === "safety-concern" ? "high" : "standard",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    if (consentRecord.includePageContext) payload.included.pageContext = { route: context.route || "", componentId: context.componentId || "" };
    if (consentRecord.includeDisplaySettings) payload.included.displaySettings = normalizeDisplayPreferences(context.displaySettings || {});
    if (consentRecord.includeLanguageSettings) payload.included.languageSettings = normalizeLanguagePreferences(context.languageSettings || {});
    if (consentRecord.includeRecognizedVoiceText) payload.included.voiceText = { intendedCommand: cleanDraft.intendedVoiceCommand, recognizedText: cleanDraft.recognizedVoiceText, voiceLocale: cleanDraft.voiceLocale };
    if (consentRecord.includeTechnicalDiagnostics) payload.included.technicalDiagnostics = collectSafeDiagnostics(context.diagnostics || {});
    rejectSensitiveFeedbackPayload(payload);
    return payload;
  }

  function routeFeedback(draft = {}) {
    if (draft.userImpact === "safety-concern") return "food-safety-review";
    return FEEDBACK_CATEGORIES.find((item) => item.id === draft.category)?.destination || "customer-support";
  }

  function rejectSensitiveFeedbackPayload(payload = {}) {
    const text = JSON.stringify(payload).toLowerCase();
    const unsafe = SENSITIVE_KEYS.filter((key) => text.includes(`"${key.toLowerCase()}"`));
    if (unsafe.includes("token") || unsafe.includes("password")) throw new Error("Feedback payload contains blocked sensitive fields.");
    return true;
  }

  function createTranslationFeedbackTriageItem(record, reviewApi = null) {
    const safety = record.userImpact === "safety-concern";
    const auditEvent = reviewApi?.createAuditEvent ? reviewApi.createAuditEvent("accessibility-language-feedback-received", { entityType: record.contentReference?.entityType || "translation", entityId: record.contentReference?.entityId || record.id, entityVersion: record.contentReference?.entityVersion, actorRole: "user-feedback", metadata: { category: record.category, priority: record.priority } }) : null;
    return { id: `triage:${record.id}`, feedbackId: record.id, reviewKind: safety ? "food-safety" : record.category === "translation-incorrect" ? "language" : "accessibility", status: "received", priority: safety ? "high" : "standard", contentReference: record.contentReference || null, auditEvent };
  }

  function createOfflineQueuedFeedback(record) {
    return { ...record, status: "queued-offline", syncedAt: null, queueId: `offline-feedback:${record.id}` };
  }

  return {
    ACCESSIBILITY_RECOVERY_VERSION,
    DISPLAY_LIMITS,
    DISPLAY_DEFAULTS,
    LANGUAGE_DEFAULTS,
    INTERACTION_DEFAULTS,
    SUPPORTED_LOCALES,
    RTL_LOCALES,
    FEEDBACK_CATEGORIES,
    createDefaultDisplayPreferences,
    normalizeDisplayPreferences,
    normalizeLanguagePreferences,
    normalizePreferences,
    validateDisplayPreferences,
    restoreDisplayDefaults,
    createDisplayPreviewSession,
    applyPreviewSession,
    cancelPreviewSession,
    recoverInterruptedPreview,
    createDisplayHistoryEntry,
    addDisplayHistoryEntry,
    undoLastDisplayChange,
    summarizeDisplayChanges,
    captureRecoverableSessionSnapshot,
    createLanguageChangeTransaction,
    applyLanguageChange,
    createVoiceInterpretationDraft,
    createFeedbackDraft,
    createFeedbackRecord,
    createTranslationFeedbackTriageItem,
    createOfflineQueuedFeedback,
    collectSafeDiagnostics,
    sanitizeText
  };
});
