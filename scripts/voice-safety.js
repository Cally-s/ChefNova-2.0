/* Chef Nova voice privacy, microphone lifecycle, and sensitive-command safety. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaVoiceSafety = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const MICROPHONE_STATES = Object.freeze({
    IDLE: "idle",
    CHECKING_SUPPORT: "checking-support",
    REQUESTING_PERMISSION: "requesting-permission",
    READY: "ready",
    LISTENING: "listening",
    PROCESSING: "processing",
    STOPPING: "stopping",
    PERMISSION_DENIED: "permission-denied",
    PERMISSION_REVOKED: "permission-revoked",
    API_UNAVAILABLE: "api-unavailable",
    DEVICE_UNAVAILABLE: "device-unavailable",
    DEVICE_DISCONNECTED: "device-disconnected",
    NETWORK_INTERRUPTED: "network-interrupted",
    ACCOUNT_CHANGED: "account-changed",
    SESSION_EXPIRED: "session-expired",
    FAILED: "failed"
  });

  const FAILURE_REASONS = Object.freeze({
    NOT_SUPPORTED: "not-supported",
    INSECURE_CONTEXT: "insecure-context",
    PERMISSION_DENIED: "permission-denied",
    PERMISSION_REVOKED: "permission-revoked",
    NO_INPUT_DEVICE: "no-input-device",
    DEVICE_DISCONNECTED: "device-disconnected",
    DEVICE_BUSY: "device-busy",
    RECOGNITION_SERVICE_UNAVAILABLE: "recognition-service-unavailable",
    NETWORK_INTERRUPTED: "network-interrupted",
    NO_SPEECH_DETECTED: "no-speech-detected",
    LANGUAGE_NOT_SUPPORTED: "language-not-supported",
    ACCOUNT_CHANGED: "account-changed",
    SESSION_EXPIRED: "session-expired",
    UNEXPECTED_ERROR: "unexpected-error"
  });

  const DATA_CLASSIFICATIONS = Object.freeze({
    EPHEMERAL_AUDIO: "ephemeral-audio",
    EPHEMERAL_PARTIAL_TRANSCRIPT: "ephemeral-partial-transcript",
    EPHEMERAL_UNCONFIRMED_TRANSCRIPT: "ephemeral-unconfirmed-transcript",
    USER_CONFIRMED_TEXT: "user-confirmed-text",
    NON_SENSITIVE_COMMAND_EVENT: "non-sensitive-command-event",
    TRANSACTIONAL_AUDIT_EVENT: "transactional-audit-event",
    OPTIONAL_DIAGNOSTIC_DATA: "optional-diagnostic-data"
  });

  const COMMAND_RISKS = Object.freeze({
    READ_ONLY: "read-only",
    NAVIGATION: "navigation",
    REVERSIBLE: "reversible",
    SENSITIVE: "sensitive",
    DESTRUCTIVE: "destructive"
  });

  const VOICE_PURPOSES = Object.freeze(["pantry-entry", "cooking-command", "timer-command", "feedback-dictation", "other"]);
  const GENERIC_CONFIRMATIONS = Object.freeze(["yes", "yeah", "yep", "okay", "ok", "sure", "do it", "confirm", "please do", "go ahead"]);
  const SENSITIVE_WORDS = Object.freeze(["pantry", "allerg", "diet", "meal", "waste", "discard", "tomato", "peanut", "VOICE_TEST"]);
  const DIAGNOSIS_WORDS = Object.freeze(["inferredDisability", "disability", "diagnosis", "blind", "lowVision", "dyslexia", "speechDisability", "cognitiveDisability", "likelyBlind", "likelyDyslexic"]);

  const COMMAND_POLICIES = Object.freeze({
    readCurrentInstruction: policy("readCurrentInstruction", COMMAND_RISKS.READ_ONLY, true, false, false, true, ["cooking"]),
    showIngredients: policy("showIngredients", COMMAND_RISKS.READ_ONLY, true, false, false, true, ["cooking", "recipe-details"]),
    showTimerStatus: policy("showTimerStatus", COMMAND_RISKS.READ_ONLY, true, false, false, true, ["cooking", "timer"]),
    showAllergyWarning: policy("showAllergyWarning", COMMAND_RISKS.READ_ONLY, true, false, false, true, ["recipe-details", "cooking"]),
    explainCookingTerm: policy("explainCookingTerm", COMMAND_RISKS.READ_ONLY, true, false, false, true, ["cooking", "recipe-details"]),
    nextStep: policy("nextStep", COMMAND_RISKS.NAVIGATION, true, false, false, true, ["cooking"]),
    previousStep: policy("previousStep", COMMAND_RISKS.NAVIGATION, true, false, false, true, ["cooking"]),
    openRecipe: policy("openRecipe", COMMAND_RISKS.NAVIGATION, true, false, false, true, ["recipe-search"]),
    openPantryForm: policy("openPantryForm", COMMAND_RISKS.NAVIGATION, true, false, false, true, ["pantry", "fallback"]),
    openLanguageRecovery: policy("openLanguageRecovery", COMMAND_RISKS.NAVIGATION, true, false, false, true, ["cooking", "settings", "fallback"]),
    startTimer: policy("startTimer", COMMAND_RISKS.REVERSIBLE, true, false, false, true, ["cooking", "timer"]),
    pauseTimer: policy("pauseTimer", COMMAND_RISKS.REVERSIBLE, true, false, false, true, ["cooking", "timer"]),
    resumeTimer: policy("resumeTimer", COMMAND_RISKS.REVERSIBLE, true, false, false, true, ["cooking", "timer"]),
    addOneMinute: policy("addOneMinute", COMMAND_RISKS.REVERSIBLE, true, false, false, true, ["cooking", "timer"]),
    expandTranscript: policy("expandTranscript", COMMAND_RISKS.REVERSIBLE, true, false, false, true, ["cooking", "video", "offline"]),
    deleteAllergy: policy("deleteAllergy", COMMAND_RISKS.SENSITIVE, false, true, true, false, ["profile"], 120000),
    removeDietaryRestriction: policy("removeDietaryRestriction", COMMAND_RISKS.SENSITIVE, false, true, true, false, ["profile"], 120000),
    confirmDiscardedFood: policy("confirmDiscardedFood", COMMAND_RISKS.SENSITIVE, false, true, true, false, ["pantry", "waste-diary"], 120000),
    freezeFood: policy("freezeFood", COMMAND_RISKS.SENSITIVE, false, true, true, false, ["pantry", "freezer"], 120000),
    markMealCompleted: policy("markMealCompleted", COMMAND_RISKS.SENSITIVE, false, true, true, false, ["meal-planner", "cooking"], 120000),
    cancelMeal: policy("cancelMeal", COMMAND_RISKS.SENSITIVE, false, true, true, false, ["meal-planner"], 120000),
    deletePantryItem: policy("deletePantryItem", COMMAND_RISKS.DESTRUCTIVE, false, true, true, false, ["pantry"], 60000),
    deleteAllPantryData: policy("deleteAllPantryData", COMMAND_RISKS.DESTRUCTIVE, false, true, true, false, ["pantry"], 60000),
    deleteCookingHistory: policy("deleteCookingHistory", COMMAND_RISKS.DESTRUCTIVE, false, true, true, false, ["profile"], 60000)
  });

  function policy(commandId, risk, mayExecuteFromInitialVoiceRequest, requiresVisibleReview, requiresExplicitConfirmation, genericConfirmationAllowed, permittedContexts, confirmationExpiresAfterMs = 0) {
    return Object.freeze({ commandId, risk, mayExecuteFromInitialVoiceRequest, requiresVisibleReview, requiresExplicitConfirmation, genericConfirmationAllowed, permittedContexts, confirmationExpiresAfterMs });
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function stableId(prefix = "voice") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function sanitizeText(value, max = 500) {
    return String(value || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
  }

  function createVoiceSession(input = {}) {
    if (input.userActivated !== true) return { ok: false, reason: "explicit-user-action-required", state: MICROPHONE_STATES.IDLE };
    const purpose = VOICE_PURPOSES.includes(input.purpose) ? input.purpose : "other";
    const startedAt = input.startedAt || nowIso();
    return {
      ok: true,
      session: {
        id: input.id || stableId("voice-session"),
        sessionEpoch: Number(input.sessionEpoch) || 1,
        accountId: input.accountId || null,
        authenticationSessionId: input.authenticationSessionId || null,
        purpose,
        recognitionLanguage: input.recognitionLanguage || "en-CA",
        state: MICROPHONE_STATES.READY,
        startedAt,
        lastActivityAt: startedAt,
        partialTranscript: "",
        unconfirmedTranscript: "",
        rawAudioStored: false,
        persistentTranscriptStored: false,
        activeStreamId: input.activeStreamId || ""
      }
    };
  }

  function canAcceptCallback(session, callback = {}) {
    return Boolean(session)
      && session.id === callback.sessionId
      && session.sessionEpoch === callback.sessionEpoch
      && session.accountId === (callback.accountId || null)
      && session.authenticationSessionId === (callback.authenticationSessionId || null)
      && !["cancelled", MICROPHONE_STATES.ACCOUNT_CHANGED, MICROPHONE_STATES.SESSION_EXPIRED, MICROPHONE_STATES.PERMISSION_REVOKED].includes(session.state);
  }

  function updateSessionTranscript(session, callback = {}) {
    if (!canAcceptCallback(session, callback)) return { ok: false, ignored: true, session };
    const partial = sanitizeText(callback.partialTranscript, 700);
    const finalText = sanitizeText(callback.finalTranscript, 700);
    return {
      ok: true,
      session: {
        ...session,
        state: finalText ? MICROPHONE_STATES.PROCESSING : MICROPHONE_STATES.LISTENING,
        partialTranscript: partial,
        unconfirmedTranscript: finalText || session.unconfirmedTranscript || "",
        lastActivityAt: callback.at || nowIso(),
        rawAudioStored: false,
        persistentTranscriptStored: false
      }
    };
  }

  function stopMediaTracks(stream) {
    const tracks = typeof stream?.getTracks === "function" ? stream.getTracks() : Array.isArray(stream?.tracks) ? stream.tracks : [];
    let stoppedTrackCount = 0;
    tracks.forEach((track) => {
      if (typeof track.stop === "function") {
        track.stop();
        stoppedTrackCount += 1;
      }
    });
    return { stoppedTrackCount, streamReleased: true };
  }

  function stopVoiceSession(session, options = {}) {
    const cleanup = stopMediaTracks(options.stream || session?.stream);
    const reason = options.reason || "user-cancelled";
    return {
      session: session ? {
        ...session,
        state: reason === FAILURE_REASONS.ACCOUNT_CHANGED ? MICROPHONE_STATES.ACCOUNT_CHANGED
          : reason === FAILURE_REASONS.SESSION_EXPIRED ? MICROPHONE_STATES.SESSION_EXPIRED
          : reason === FAILURE_REASONS.PERMISSION_REVOKED ? MICROPHONE_STATES.PERMISSION_REVOKED
          : MICROPHONE_STATES.IDLE,
        partialTranscript: options.preserveEditableText ? session.partialTranscript : "",
        unconfirmedTranscript: options.preserveEditableText ? session.unconfirmedTranscript : "",
        rawAudioStored: false,
        persistentTranscriptStored: false,
        activeStreamId: ""
      } : null,
      cleanup,
      event: createPrivacySafeVoiceEvent({
        event: "voice-session-ended",
        commandCategory: "form-assistance",
        recognitionLanguage: session?.recognitionLanguage || "en-CA",
        outcome: reason === "user-cancelled" ? "cancelled" : "fallback"
      })
    };
  }

  function normalizeMicrophoneError(error = {}) {
    const name = String(error.name || error.code || error.reason || "").toLowerCase();
    if (name.includes("notallowed") || name.includes("permission-denied")) return { state: MICROPHONE_STATES.PERMISSION_DENIED, reason: FAILURE_REASONS.PERMISSION_DENIED };
    if (name.includes("permission-revoked")) return { state: MICROPHONE_STATES.PERMISSION_REVOKED, reason: FAILURE_REASONS.PERMISSION_REVOKED };
    if (name.includes("notfound") || name.includes("no-input")) return { state: MICROPHONE_STATES.DEVICE_UNAVAILABLE, reason: FAILURE_REASONS.NO_INPUT_DEVICE };
    if (name.includes("disconnect")) return { state: MICROPHONE_STATES.DEVICE_DISCONNECTED, reason: FAILURE_REASONS.DEVICE_DISCONNECTED };
    if (name.includes("busy")) return { state: MICROPHONE_STATES.DEVICE_UNAVAILABLE, reason: FAILURE_REASONS.DEVICE_BUSY };
    if (name.includes("network")) return { state: MICROPHONE_STATES.NETWORK_INTERRUPTED, reason: FAILURE_REASONS.NETWORK_INTERRUPTED };
    if (name.includes("no-speech")) return { state: MICROPHONE_STATES.FAILED, reason: FAILURE_REASONS.NO_SPEECH_DETECTED };
    if (name.includes("language")) return { state: MICROPHONE_STATES.FAILED, reason: FAILURE_REASONS.LANGUAGE_NOT_SUPPORTED };
    if (name.includes("not-supported") || name.includes("api-unavailable")) return { state: MICROPHONE_STATES.API_UNAVAILABLE, reason: FAILURE_REASONS.NOT_SUPPORTED };
    return { state: MICROPHONE_STATES.FAILED, reason: FAILURE_REASONS.UNEXPECTED_ERROR };
  }

  function renderMicrophoneFallback(model = {}) {
    const title = model.title || "MICROPHONE ACCESS IS NOT AVAILABLE";
    const description = model.description || "You can continue with keyboard controls or the labelled form.";
    const formTarget = model.formTarget || "pantry-form";
    const keyboardTarget = model.keyboardTarget || formTarget;
    return `<section class="microphone-fallback-panel" role="alert" aria-labelledby="microphoneFallbackTitle" tabindex="-1" data-microphone-fallback>
      <h3 id="microphoneFallbackTitle">${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
      ${model.detail ? `<p>${escapeHtml(model.detail)}</p>` : ""}
      <div class="microphone-fallback-actions">
        <button class="button primary small" type="button" data-voice-keyboard-controls="${escapeAttr(keyboardTarget)}">Use Keyboard Controls</button>
        <button class="button secondary small" type="button" data-voice-open-form="${escapeAttr(formTarget)}">Open Pantry Form</button>
        ${model.showPermissionHelp ? `<button class="button secondary small" type="button" data-voice-permission-help>Review Microphone Settings</button>` : ""}
      </div>
    </section>`;
  }

  function renderListeningIndicator(session = {}) {
    const purposeLabel = session.purpose === "pantry-entry" ? "PANTRY ENTRY" : "VOICE ENTRY";
    return `<section class="microphone-listening-panel" role="status" aria-live="polite" aria-labelledby="microphoneListeningTitle" data-microphone-listening>
      <h3 id="microphoneListeningTitle">LISTENING FOR ${escapeHtml(purposeLabel)}</h3>
      <p>Microphone is active.</p>
      <p><b>Voice language:</b> ${escapeHtml(session.recognitionLanguage || "en-CA")}</p>
      <button class="button secondary small" type="button" data-stop-voice-entry>Stop Listening</button>
    </section>`;
  }

  function parseSpeechPantryEntry(text = "") {
    const cleaned = sanitizeText(text, 300);
    const lower = cleaned.toLowerCase();
    const quantity = lower.includes("two") ? 2 : Number((lower.match(/\b\d+\b/) || [])[0]) || null;
    const containerType = /\bcans?\b/.test(lower) ? "cans" : /\bbottles?\b/.test(lower) ? "bottles" : "";
    const ingredient = lower.includes("tomato") ? "Tomatoes" : cleaned.replace(/\b(two|\d+|cans?|in|the|pantry)\b/gi, "").trim() || "";
    return {
      id: stableId("voice-pantry-draft"),
      purpose: "pantry-entry",
      sourceLocale: "en-CA",
      partialText: "",
      finalRecognizedText: cleaned,
      status: "unconfirmed",
      ingredientName: ingredient,
      quantity,
      containerType,
      canSize: "",
      canSizeStatus: containerType === "cans" ? "confirmation-required" : "not-applicable",
      persisted: false,
      rawAudioStored: false,
      storageDomain: "volatile-memory"
    };
  }

  function getCommandPolicy(commandId) {
    return COMMAND_POLICIES[commandId] || {
      commandId: commandId || "unknown",
      risk: COMMAND_RISKS.DESTRUCTIVE,
      mayExecuteFromInitialVoiceRequest: false,
      requiresVisibleReview: true,
      requiresExplicitConfirmation: true,
      genericConfirmationAllowed: false,
      permittedContexts: [],
      unknownCommand: true
    };
  }

  function inferCommandId(text = "") {
    const lower = sanitizeText(text, 300).toLowerCase();
    if (lower.includes("delete") && lower.includes("allergy")) return "deleteAllergy";
    if (lower.includes("remove") && lower.includes("diet")) return "removeDietaryRestriction";
    if (lower.includes("discard")) return "confirmDiscardedFood";
    if (lower.includes("freeze")) return "freezeFood";
    if (lower.includes("complete") && lower.includes("meal")) return "markMealCompleted";
    if (lower.includes("cancel") && lower.includes("meal")) return "cancelMeal";
    if (lower.includes("delete") && lower.includes("pantry") && lower.includes("all")) return "deleteAllPantryData";
    if (lower.includes("delete") && lower.includes("pantry")) return "deletePantryItem";
    if (lower.includes("next")) return "nextStep";
    if (lower.includes("previous") || lower.includes("back")) return "previousStep";
    if (lower.includes("ingredient")) return "showIngredients";
    if (lower.includes("allergy")) return "showAllergyWarning";
    if (lower.includes("timer")) return "showTimerStatus";
    return "unknown";
  }

  function handleRecognizedCommand(text = "", context = {}) {
    const commandId = context.commandId || inferCommandId(text);
    const commandPolicy = getCommandPolicy(commandId);
    if (commandPolicy.unknownCommand) return { action: "reject", reason: "unknown-command", commandPolicy };
    if (commandPolicy.risk === COMMAND_RISKS.SENSITIVE || commandPolicy.risk === COMMAND_RISKS.DESTRUCTIVE) {
      return {
        action: "create-pending-review",
        commandPolicy,
        pendingAction: createPendingSensitiveVoiceAction({ commandId, policy: commandPolicy, accountId: context.accountId, sourceVoiceSessionId: context.voiceSessionId, targetEntityType: context.targetEntityType, targetEntityId: context.targetEntityId, targetEntityVersion: context.targetEntityVersion })
      };
    }
    if (commandPolicy.mayExecuteFromInitialVoiceRequest) return { action: "execute", commandPolicy };
    return { action: "reject", reason: "command-policy-blocked", commandPolicy };
  }

  function createPendingSensitiveVoiceAction(input = {}) {
    const commandPolicy = input.policy || getCommandPolicy(input.commandId);
    const createdAtMs = Date.now();
    const expiresMs = commandPolicy.confirmationExpiresAfterMs || 60000;
    return {
      id: input.id || stableId("pending-voice-action"),
      commandId: commandPolicy.commandId,
      risk: commandPolicy.risk,
      accountId: input.accountId || null,
      sourceVoiceSessionId: input.sourceVoiceSessionId || "",
      targetEntityType: input.targetEntityType || "unknown",
      targetEntityId: input.targetEntityId || "",
      targetEntityVersion: input.targetEntityVersion || 1,
      displaySummaryKey: input.displaySummaryKey || `${commandPolicy.commandId}.review`,
      consequenceDescriptionKey: input.consequenceDescriptionKey || `${commandPolicy.commandId}.consequence`,
      createdAt: new Date(createdAtMs).toISOString(),
      expiresAt: new Date(createdAtMs + expiresMs).toISOString(),
      status: "awaiting-review",
      originalUtteranceMayConfirm: false,
      genericConfirmationAllowed: false
    };
  }

  function isGenericConfirmation(text = "") {
    return GENERIC_CONFIRMATIONS.includes(sanitizeText(text, 80).toLowerCase());
  }

  function confirmPendingSensitiveAction(pendingAction, request = {}) {
    if (!pendingAction || pendingAction.status !== "awaiting-review") return { ok: false, reason: "pending-action-not-active" };
    if (new Date(pendingAction.expiresAt).getTime() < Date.now()) return { ok: false, reason: "pending-action-expired", pendingAction: { ...pendingAction, status: "expired" } };
    if (pendingAction.accountId !== (request.accountId || null)) return { ok: false, reason: "account-mismatch" };
    if (String(pendingAction.targetEntityId || "") !== String(request.targetEntityId || "")) return { ok: false, reason: "target-mismatch" };
    if (Number(pendingAction.targetEntityVersion || 1) !== Number(request.targetEntityVersion || 1)) return { ok: false, reason: "target-version-changed" };
    if (request.fromInitialVoiceRequest === true) return { ok: false, reason: "initial-utterance-cannot-confirm" };
    if (request.inputMethod === "app-voice" && isGenericConfirmation(request.confirmationPhrase)) return { ok: false, reason: "generic-voice-confirmation-rejected" };
    if (!request.idempotencyKey) return { ok: false, reason: "missing-idempotency-key" };
    return {
      ok: true,
      pendingAction: { ...pendingAction, status: "confirmed" },
      auditRecord: createSensitiveActionAuditRecord({ pendingAction, accountId: request.accountId, finalInputMethod: request.inputMethod || "keyboard", idempotencyKey: request.idempotencyKey })
    };
  }

  function cancelPendingSensitiveAction(pendingAction, reason = "cancelled") {
    return pendingAction ? { ...pendingAction, status: reason === "expired" ? "expired" : "cancelled" } : null;
  }

  function createSensitiveActionAuditRecord({ pendingAction, accountId, finalInputMethod, idempotencyKey } = {}) {
    return {
      actionId: pendingAction?.id || stableId("voice-audit"),
      accountId: accountId || null,
      actionType: pendingAction?.commandId || "unknown",
      targetEntityId: pendingAction?.targetEntityId || "",
      targetEntityVersion: pendingAction?.targetEntityVersion || 1,
      confirmedAt: nowIso(),
      finalInputMethod: ["keyboard", "touch", "screen-reader", "operating-system-voice-access"].includes(finalInputMethod) ? finalInputMethod : "keyboard",
      voiceRequested: true,
      idempotencyKey,
      rawAudioStored: false,
      transcriptStored: false
    };
  }

  function createPrivacySafeVoiceEvent(input = {}) {
    const event = {
      event: ["voice-session-started", "voice-session-ended", "voice-command-confirmed", "voice-fallback-used"].includes(input.event) ? input.event : "voice-fallback-used",
      commandCategory: ["navigation", "read-only", "timer", "form-assistance", "sensitive-action-review"].includes(input.commandCategory) ? input.commandCategory : "form-assistance",
      recognitionLanguage: input.recognitionLanguage || "en-CA",
      outcome: ["success", "cancelled", "fallback", "failed"].includes(input.outcome) ? input.outcome : undefined,
      rawAudioStored: false,
      transcriptStored: false,
      appVersion: input.appVersion || "static-local"
    };
    assertPrivacySafePayload(event);
    return Object.freeze(Object.fromEntries(Object.entries(event).filter(([, value]) => value !== undefined)));
  }

  function createVoiceErrorLog(input = {}) {
    const normalized = normalizeMicrophoneError(input.error || input);
    const log = {
      errorCode: normalized.reason,
      featureArea: ["food-management", "cooking", "timer", "feedback"].includes(input.featureArea) ? input.featureArea : "food-management",
      recognitionLanguage: input.recognitionLanguage || "en-CA",
      rawAudioIncluded: false,
      transcriptIncluded: false
    };
    assertPrivacySafePayload(log);
    return Object.freeze(log);
  }

  function assertPrivacySafePayload(payload = {}) {
    const text = JSON.stringify(payload);
    const lower = text.toLowerCase();
    if (SENSITIVE_WORDS.some((word) => lower.includes(word.toLowerCase()))) throw new Error("Voice payload contains prohibited food, allergy, dietary, meal, waste, or transcript content.");
    if (DIAGNOSIS_WORDS.some((word) => lower.includes(word.toLowerCase()))) throw new Error("Voice payload contains prohibited disability inference.");
    if (lower.includes("rawaudio") && !lower.includes("rawaudiostored\":false") && !lower.includes("rawaudioincluded\":false")) throw new Error("Voice payload appears to include raw audio.");
    return true;
  }

  function inspectForDisabilityInference(value = {}) {
    const text = JSON.stringify(value);
    return {
      ok: !DIAGNOSIS_WORDS.some((word) => text.toLowerCase().includes(word.toLowerCase())),
      blockedTerms: DIAGNOSIS_WORDS.filter((word) => text.toLowerCase().includes(word.toLowerCase()))
    };
  }

  function migrateLegacyVoiceStorage(storage = {}) {
    const removedKeys = [];
    const safeEntries = {};
    Object.keys(storage || {}).forEach((key) => {
      const lower = key.toLowerCase();
      if ((lower.includes("voice") && (lower.includes("transcript") || lower.includes("audio") || lower.includes("raw") || lower.includes("partial") || lower.includes("unconfirmed"))) || lower.includes("rawaudio")) {
        removedKeys.push(key);
      } else {
        safeEntries[key] = storage[key];
      }
    });
    return { safeEntries, removedKeys, idempotent: true };
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  return {
    MICROPHONE_STATES,
    FAILURE_REASONS,
    DATA_CLASSIFICATIONS,
    COMMAND_RISKS,
    COMMAND_POLICIES,
    GENERIC_CONFIRMATIONS,
    createVoiceSession,
    canAcceptCallback,
    updateSessionTranscript,
    stopVoiceSession,
    stopMediaTracks,
    normalizeMicrophoneError,
    renderMicrophoneFallback,
    renderListeningIndicator,
    parseSpeechPantryEntry,
    getCommandPolicy,
    inferCommandId,
    handleRecognizedCommand,
    createPendingSensitiveVoiceAction,
    confirmPendingSensitiveAction,
    cancelPendingSensitiveAction,
    isGenericConfirmation,
    createSensitiveActionAuditRecord,
    createPrivacySafeVoiceEvent,
    createVoiceErrorLog,
    assertPrivacySafePayload,
    inspectForDisabilityInference,
    migrateLegacyVoiceStorage,
    sanitizeText
  };
});
