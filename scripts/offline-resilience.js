/* Chef Nova offline and enhanced-feature resilience infrastructure. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChefNovaResilience = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const OFFLINE_SCHEMA_VERSION = 1;
  const OFFLINE_DB_NAME = "chefNovaOffline";
  const OFFLINE_PACKAGE_STORE = "recipePackages";
  const OFFLINE_SYNC_STORE = "syncQueue";
  const OFFLINE_PROGRESS_STORE = "cookingProgress";

  const FEATURE_AVAILABILITY_STATES = Object.freeze({
    IDLE: "idle",
    CHECKING: "checking",
    AVAILABLE: "available",
    LOADING: "loading",
    OFFLINE: "offline",
    UNSUPPORTED: "unsupported",
    PERMISSION_DENIED: "permission-denied",
    TEMPORARILY_UNAVAILABLE: "temporarily-unavailable",
    FAILED: "failed",
    DISABLED_BY_USER: "disabled-by-user"
  });

  const ENHANCED_FEATURES = Object.freeze({
    SPEECH_RECOGNITION: "speech-recognition",
    TEXT_TO_SPEECH: "text-to-speech",
    TRANSLATION: "translation",
    AUDIO: "audio",
    VIDEO: "video",
    IMAGES: "images",
    CLOUD_SYNC: "cloud-sync"
  });

  const OFFLINE_PACKAGE_STATUSES = Object.freeze({
    NOT_DOWNLOADED: "not-downloaded",
    DOWNLOADING: "downloading",
    AVAILABLE: "available",
    INCOMPLETE: "incomplete",
    UPDATE_AVAILABLE: "update-available",
    CORRUPTED: "corrupted",
    REMOVING: "removing",
    FAILED: "failed"
  });

  const DEFAULT_LOW_BANDWIDTH_PREFERENCES = Object.freeze({
    enabled: false,
    textFirst: true,
    autoplayVideo: false,
    preferTranscript: true,
    imageQuality: "small",
    suggestOfflineDownload: true,
    preloadAudio: false,
    preloadVideo: false,
    avoidBackgroundRequests: true
  });

  const DEFAULT_OFFLINE_COOKING_PREFERENCES = Object.freeze({
    autoSaveProgress: true,
    suggestDownloadBeforeCooking: true,
    includeTranscriptsByDefault: true,
    includeSmallImagesByDefault: false,
    includeAudioByDefault: false,
    includeVideoByDefault: false,
    downloadOnlyOnWifi: false,
    showStorageUsed: true,
    keepOriginalTextWithTranslations: true,
    useDeviceTtsWhenAudioFails: true,
    showKeyboardShortcuts: true,
    announceConnectivityChanges: true,
    retrySyncAutomatically: true
  });

  const COOKING_COMMAND_MAP = Object.freeze({
    nextStep: { voicePhrases: ["next step", "continue"], buttonLabel: "Next step", keyboardShortcut: "ArrowRight", screenReaderLabel: "Move to the next cooking step" },
    previousStep: { voicePhrases: ["previous step", "go back"], buttonLabel: "Previous step", keyboardShortcut: "ArrowLeft", screenReaderLabel: "Move to the previous cooking step" },
    repeatStep: { voicePhrases: ["repeat step", "read again"], buttonLabel: "Repeat step", keyboardShortcut: "R", screenReaderLabel: "Repeat the current cooking instruction" },
    startTimer: { voicePhrases: ["start timer"], buttonLabel: "Start timer", keyboardShortcut: "T", screenReaderLabel: "Start a timer for this cooking step" },
    pauseTimer: { voicePhrases: ["pause timer"], buttonLabel: "Pause timer", keyboardShortcut: "Space", screenReaderLabel: "Pause the active timer" },
    resumeTimer: { voicePhrases: ["resume timer"], buttonLabel: "Resume timer", keyboardShortcut: "Space", screenReaderLabel: "Resume the active timer" },
    stopTimer: { voicePhrases: ["stop timer"], buttonLabel: "Stop timer", keyboardShortcut: "Escape", screenReaderLabel: "Stop the active timer" },
    showIngredients: { voicePhrases: ["show ingredients"], buttonLabel: "Show ingredients", keyboardShortcut: "I", screenReaderLabel: "Show recipe ingredients" },
    showWarnings: { voicePhrases: ["show warnings", "allergy warning"], buttonLabel: "Show warnings", keyboardShortcut: "W", screenReaderLabel: "Show safety and allergy warnings" },
    markStepComplete: { voicePhrases: ["mark complete"], buttonLabel: "Mark step complete", keyboardShortcut: "Enter", screenReaderLabel: "Mark this cooking step complete" }
  });

  function nowIso() {
    return new Date().toISOString();
  }

  function createHash(value) {
    const text = JSON.stringify(value || {});
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    return Math.abs(hash).toString(36);
  }

  function createFeatureAvailability(feature, state, options = {}) {
    return {
      feature,
      state,
      retryable: options.retryable ?? ["offline", "temporarily-unavailable", "failed", "loading"].includes(state),
      fallbackAvailable: options.fallbackAvailable !== false,
      userMessageKey: options.userMessageKey || `${feature}.${state}`,
      technicalReason: options.technicalReason || "",
      lastCheckedAt: options.lastCheckedAt || nowIso()
    };
  }

  function detectFeatureAvailability(feature, env = {}) {
    const online = env.online ?? (typeof navigator === "undefined" ? true : navigator.onLine !== false);
    const win = env.window || (typeof window !== "undefined" ? window : {});
    if (!online && [ENHANCED_FEATURES.TRANSLATION, ENHANCED_FEATURES.CLOUD_SYNC, ENHANCED_FEATURES.VIDEO, ENHANCED_FEATURES.AUDIO].includes(feature)) return createFeatureAvailability(feature, FEATURE_AVAILABILITY_STATES.OFFLINE);
    if (feature === ENHANCED_FEATURES.SPEECH_RECOGNITION) {
      const supported = Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
      return createFeatureAvailability(feature, supported ? FEATURE_AVAILABILITY_STATES.AVAILABLE : FEATURE_AVAILABILITY_STATES.UNSUPPORTED, { retryable: supported });
    }
    if (feature === ENHANCED_FEATURES.TEXT_TO_SPEECH) {
      const supported = Boolean(win.speechSynthesis);
      return createFeatureAvailability(feature, supported ? FEATURE_AVAILABILITY_STATES.AVAILABLE : FEATURE_AVAILABILITY_STATES.UNSUPPORTED, { retryable: supported });
    }
    return createFeatureAvailability(feature, FEATURE_AVAILABILITY_STATES.AVAILABLE);
  }

  function fallbackCopy(feature, state = FEATURE_AVAILABILITY_STATES.FAILED, context = {}) {
    const retryable = ![FEATURE_AVAILABILITY_STATES.PERMISSION_DENIED, FEATURE_AVAILABILITY_STATES.UNSUPPORTED, FEATURE_AVAILABILITY_STATES.DISABLED_BY_USER].includes(state);
    const copy = {
      [ENHANCED_FEATURES.SPEECH_RECOGNITION]: {
        title: "VOICE ENTRY IS NOT AVAILABLE",
        description: state === FEATURE_AVAILABILITY_STATES.PERMISSION_DENIED ? "Microphone permission is turned off. You can continue using the labelled Pantry form." : "You can continue using the labelled Pantry form.",
        primaryActionLabel: "Open Pantry Form",
        retryActionLabel: "Try Voice Entry Again",
        manualTarget: "pantry-form"
      },
      [ENHANCED_FEATURES.TEXT_TO_SPEECH]: {
        title: "READ-ALOUD IS NOT AVAILABLE",
        description: "The complete instruction remains available as text.",
        primaryActionLabel: "Continue with Text",
        retryActionLabel: "Try Again",
        manualTarget: "recipe-instruction"
      },
      [ENHANCED_FEATURES.TRANSLATION]: {
        title: "TRANSLATION IS NOT AVAILABLE",
        description: "The original recipe remains available. Previously downloaded explanations and cooking terms can still be used.",
        primaryActionLabel: "Continue with Original Text",
        retryActionLabel: "Try Translation Again",
        manualTarget: "original-text"
      },
      [ENHANCED_FEATURES.VIDEO]: {
        title: "VIDEO IS NOT AVAILABLE",
        description: "You can continue with the transcript and written instructions.",
        primaryActionLabel: "Open Transcript",
        secondaryActionLabel: "Continue with Instructions",
        retryActionLabel: "Try Video Again",
        manualTarget: "transcript"
      },
      [ENHANCED_FEATURES.AUDIO]: {
        title: "AUDIO IS NOT AVAILABLE",
        description: "You can continue with device read-aloud or the visible text.",
        primaryActionLabel: "Continue with Text",
        retryActionLabel: "Try Audio Again",
        manualTarget: "visible-text"
      },
      [ENHANCED_FEATURES.CLOUD_SYNC]: {
        title: "NOT YET SYNCHRONIZED",
        description: "Your changes are safe on this device. Chef Nova will try again when the connection improves.",
        primaryActionLabel: "Keep Cooking",
        retryActionLabel: "Try Again",
        manualTarget: "local-save"
      }
    }[feature] || {
      title: "FEATURE IS NOT AVAILABLE",
      description: "The core recipe remains available as text.",
      primaryActionLabel: "Continue",
      retryActionLabel: "Try Again",
      manualTarget: "core-text"
    };
    return { ...copy, feature, state, retryable, partialTranscript: context.partialTranscript || "", ariaRole: state === FEATURE_AVAILABILITY_STATES.FAILED ? "alert" : "status" };
  }

  function renderFeatureFallback(model = {}) {
    const retry = model.retryable ? `<button class="button secondary small" type="button" data-feature-retry="${escapeAttr(model.feature)}">${escapeHtml(model.retryActionLabel || "Try Again")}</button>` : "";
    const partial = model.partialTranscript ? `<label class="feature-fallback-transcript">Partial text<input type="text" value="${escapeAttr(model.partialTranscript)}" data-partial-transcript></label>` : "";
    return `<section class="feature-fallback-panel" role="${escapeAttr(model.ariaRole || "status")}" aria-label="${escapeAttr(model.title || "Feature fallback")}">
      <h3>${escapeHtml(model.title || "Feature unavailable")}</h3>
      <p>${escapeHtml(model.description || "The core recipe remains available.")}</p>
      ${partial}
      <div class="feature-fallback-actions">
        <button class="button primary small" type="button" data-feature-primary="${escapeAttr(model.manualTarget || "core-text")}">${escapeHtml(model.primaryActionLabel || "Continue")}</button>
        ${model.secondaryActionLabel ? `<button class="button secondary small" type="button" data-feature-secondary="${escapeAttr(model.manualTarget || "core-text")}">${escapeHtml(model.secondaryActionLabel)}</button>` : ""}
        ${retry}
      </div>
    </section>`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function normalizeLowBandwidthPreferences(value = {}) {
    const next = { ...DEFAULT_LOW_BANDWIDTH_PREFERENCES, ...(value || {}) };
    next.imageQuality = ["none", "small", "standard"].includes(next.imageQuality) ? next.imageQuality : "small";
    next.autoplayVideo = next.enabled ? false : next.autoplayVideo === true;
    next.preloadAudio = next.enabled ? false : next.preloadAudio === true;
    next.preloadVideo = next.enabled ? false : next.preloadVideo === true;
    return next;
  }

  function normalizeOfflineCookingPreferences(value = {}) {
    return { ...DEFAULT_OFFLINE_COOKING_PREFERENCES, ...(value || {}) };
  }

  function getNetworkState(env = {}) {
    const nav = env.navigator || (typeof navigator !== "undefined" ? navigator : {});
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection || {};
    const online = nav.onLine;
    const slow = ["slow-2g", "2g"].includes(connection.effectiveType) || connection.saveData === true;
    return {
      status: online === false ? "offline" : slow ? "unstable" : online === true ? "online" : "unknown",
      effectiveType: connection.effectiveType,
      saveData: connection.saveData === true,
      lastSuccessfulRequestAt: env.lastSuccessfulRequestAt || null
    };
  }

  function normalizeRecipeVersion(recipe = {}) {
    return String(recipe.recipeVersion || recipe.updatedAt || recipe.version || recipe.id || "static-v1");
  }

  function canonicalIngredientQuantity(ingredient = {}) {
    const quantity = ingredient.quantity ?? ingredient.pointQuantity ?? ingredient.amount ?? "";
    const unit = ingredient.unit || ingredient.canonicalUnit || "count";
    return { value: String(quantity || "1"), unit: unit === "each" ? "count" : unit };
  }

  function createOfflineRecipePackage(recipe = {}, options = {}) {
    const now = options.now || nowIso();
    const recipeVersion = normalizeRecipeVersion(recipe);
    const ingredients = (recipe.structuredIngredients?.length ? recipe.structuredIngredients : recipe.ingredients || []).map((ingredient, index) => ({
      ingredientId: ingredient.ingredientId || ingredient.id || `ingredient-${index + 1}`,
      name: ingredient.displayName || ingredient.name || ingredient.displayText || "Ingredient",
      canonicalQuantity: canonicalIngredientQuantity(ingredient),
      localizedDisplay: ingredient.displayText || `${ingredient.quantity || 1} ${ingredient.unit || ""} ${ingredient.name || ingredient.displayName || "Ingredient"}`.trim()
    }));
    const steps = (recipe.steps || recipe.instructions || []).map((step, index) => ({ stepId: `step-${index + 1}`, index, sourceText: String(step), localizedText: options.localizedSteps?.[index] || null }));
    const allergyWarnings = normalizeWarnings(recipe.allergyWarnings || recipe.allergies || ["Check ingredient labels before cooking."], "allergy", recipeVersion);
    const safetyWarnings = normalizeWarnings(recipe.safetyWarnings || ["Check ingredient labels and confirm food-safety instructions before cooking."], "food-safety", recipeVersion);
    const timerDefinitions = extractTimerDefinitions(steps);
    const transcript = { transcriptId: `${recipe.id || "recipe"}::transcript::${recipeVersion}`, sourceText: steps.map((step) => step.sourceText).join("\n"), locale: options.explanationLocale || options.sourceLocale || "en-CA", status: "current" };
    const recipeSnapshot = {
      ingredients,
      steps,
      servingCount: Number(recipe.servings) || 1,
      safetyWarnings,
      allergyWarnings,
      cookingTerms: options.cookingTerms || [{ term: "simmer", explanation: "Cook gently below a boil.", locale: "en" }],
      transcript,
      timerDefinitions,
      equipment: recipe.equipment || []
    };
    const pack = {
      schemaVersion: OFFLINE_SCHEMA_VERSION,
      packageId: `offline::${recipe.id || "recipe"}::${recipeVersion}`,
      recipeId: recipe.id || "",
      recipeVersion,
      title: recipe.name || "Recipe",
      sourceLocale: options.sourceLocale || "en-CA",
      explanationLocale: options.explanationLocale || null,
      downloadedAt: now,
      updatedAt: recipe.updatedAt || now,
      recipeSnapshot,
      progress: { currentStepIndex: 0, completedStepIds: [], activeTimers: [], lastOpenedAt: null, userNotes: "" },
      media: {
        smallImagesIncluded: options.includeSmallImages === true,
        audioIncluded: options.includeAudio === true,
        videoIncluded: options.includeVideo === true,
        transcriptIncluded: true
      },
      integrity: { schemaVersion: OFFLINE_SCHEMA_VERSION, complete: false, checksum: "" },
      status: OFFLINE_PACKAGE_STATUSES.INCOMPLETE,
      storageEstimateBytes: estimatePackageBytes({ recipeSnapshot, media: options })
    };
    const validation = validateOfflineRecipePackage(pack);
    pack.integrity.complete = validation.valid;
    pack.integrity.checksum = createHash({ recipeId: pack.recipeId, recipeVersion, recipeSnapshot });
    pack.status = validation.valid ? OFFLINE_PACKAGE_STATUSES.AVAILABLE : OFFLINE_PACKAGE_STATUSES.INCOMPLETE;
    pack.validationErrors = validation.errors;
    return pack;
  }

  function normalizeWarnings(values, type, recipeVersion) {
    const list = Array.isArray(values) ? values : [values];
    return list.filter(Boolean).map((text, index) => ({
      id: `${type}-${index + 1}`,
      type,
      severity: type === "food-safety" ? "caution" : "information",
      sourceText: String(text),
      localizedText: null,
      locale: null,
      relatedIngredientIds: [],
      relatedStepIds: [],
      recipeVersion
    }));
  }

  function extractTimerDefinitions(steps = []) {
    const pattern = /(\d+)\s*(minute|minutes|min|hour|hours|hr)/i;
    return steps.map((step) => {
      const match = pattern.exec(step.sourceText || "");
      if (!match) return null;
      const amount = Number(match[1]);
      const unit = match[2].toLowerCase().startsWith("hour") || match[2].toLowerCase() === "hr" ? "hour" : "minute";
      return { timerId: `${step.stepId}::timer`, stepId: step.stepId, label: `Step ${step.index + 1} timer`, durationMs: amount * (unit === "hour" ? 3600000 : 60000) };
    }).filter(Boolean);
  }

  function estimatePackageBytes({ recipeSnapshot, media = {} } = {}) {
    const textBytes = JSON.stringify(recipeSnapshot || {}).length * 2;
    return textBytes + (media.includeSmallImages ? 250000 : 0) + (media.includeAudio ? 2000000 : 0) + (media.includeVideo ? 12000000 : 0);
  }

  function validateOfflineRecipePackage(pack = {}) {
    const errors = [];
    if (Number(pack.schemaVersion) !== OFFLINE_SCHEMA_VERSION) errors.push("schema-version");
    if (!pack.recipeId) errors.push("recipe-id");
    if (!pack.recipeVersion) errors.push("recipe-version");
    if (!pack.title) errors.push("title");
    if (!Array.isArray(pack.recipeSnapshot?.ingredients) || !pack.recipeSnapshot.ingredients.length) errors.push("ingredients");
    if (pack.recipeSnapshot?.ingredients?.some((item) => !item.canonicalQuantity?.value || !item.canonicalQuantity?.unit)) errors.push("canonical-quantities");
    if (!Array.isArray(pack.recipeSnapshot?.steps) || !pack.recipeSnapshot.steps.length) errors.push("instructions");
    if (!Array.isArray(pack.recipeSnapshot?.safetyWarnings) || !pack.recipeSnapshot.safetyWarnings.length) errors.push("safety-warnings");
    if (!Array.isArray(pack.recipeSnapshot?.allergyWarnings) || !pack.recipeSnapshot.allergyWarnings.length) errors.push("allergy-warnings");
    if (!Array.isArray(pack.recipeSnapshot?.timerDefinitions)) errors.push("timer-definitions");
    return { valid: errors.length === 0, errors };
  }

  function comparePackageVersion(pack = {}, recipe = {}) {
    const currentVersion = normalizeRecipeVersion(recipe);
    if (!validateOfflineRecipePackage(pack).valid) return OFFLINE_PACKAGE_STATUSES.CORRUPTED;
    if (String(pack.recipeVersion) !== currentVersion) return OFFLINE_PACKAGE_STATUSES.UPDATE_AVAILABLE;
    return OFFLINE_PACKAGE_STATUSES.AVAILABLE;
  }

  function createMemoryStore() {
    const maps = { [OFFLINE_PACKAGE_STORE]: new Map(), [OFFLINE_SYNC_STORE]: new Map(), [OFFLINE_PROGRESS_STORE]: new Map() };
    return {
      async put(store, key, value) { maps[store].set(key, structuredCloneSafe(value)); },
      async get(store, key) { return structuredCloneSafe(maps[store].get(key) || null); },
      async list(store) { return Array.from(maps[store].values()).map(structuredCloneSafe); },
      async delete(store, key) { maps[store].delete(key); },
      async usage() { return { supported: false, estimatedBytes: JSON.stringify(Object.fromEntries(Object.entries(maps).map(([key, value]) => [key, Array.from(value.values())]))).length * 2 }; }
    };
  }

  function createIndexedDbStore(options = {}) {
    const indexedDBRef = options.indexedDB || (typeof indexedDB !== "undefined" ? indexedDB : null);
    if (!indexedDBRef) return createMemoryStore();
    let dbPromise = null;
    function open() {
      if (dbPromise) return dbPromise;
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDBRef.open(OFFLINE_DB_NAME, OFFLINE_SCHEMA_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          [OFFLINE_PACKAGE_STORE, OFFLINE_SYNC_STORE, OFFLINE_PROGRESS_STORE].forEach((storeName) => {
            if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: storeName === OFFLINE_PACKAGE_STORE ? "recipeId" : "id" });
          });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      return dbPromise;
    }
    async function withStore(storeName, mode, fn) {
      const db = await open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const result = fn(store);
        tx.oncomplete = () => resolve(result?.result ?? result);
        tx.onerror = () => reject(tx.error);
      });
    }
    return {
      put(store, key, value) { return withStore(store, "readwrite", (os) => os.put(structuredCloneSafe(value))); },
      get(store, key) { return withStore(store, "readonly", (os) => os.get(key)).then(structuredCloneSafe); },
      list(store) { return withStore(store, "readonly", (os) => os.getAll()).then((items) => (items || []).map(structuredCloneSafe)); },
      delete(store, key) { return withStore(store, "readwrite", (os) => os.delete(key)); },
      async usage() {
        const estimate = typeof navigator !== "undefined" && navigator.storage?.estimate ? await navigator.storage.estimate() : {};
        return { supported: true, estimatedBytes: estimate.usage || 0, quotaBytes: estimate.quota || null };
      }
    };
  }

  function createOfflineRecipeRepository(options = {}) {
    const store = options.store || createIndexedDbStore(options);
    return {
      async savePackage(recipePackage) {
        const validation = validateOfflineRecipePackage(recipePackage);
        if (!validation.valid) {
          const existing = await this.getPackage(recipePackage.recipeId);
          if (existing?.status === OFFLINE_PACKAGE_STATUSES.AVAILABLE) return { ok: false, status: OFFLINE_PACKAGE_STATUSES.INCOMPLETE, keptExisting: true, errors: validation.errors };
          await store.put(OFFLINE_PACKAGE_STORE, recipePackage.recipeId, { ...recipePackage, status: OFFLINE_PACKAGE_STATUSES.INCOMPLETE, validationErrors: validation.errors });
          return { ok: false, status: OFFLINE_PACKAGE_STATUSES.INCOMPLETE, errors: validation.errors };
        }
        await store.put(OFFLINE_PACKAGE_STORE, recipePackage.recipeId, { ...recipePackage, status: OFFLINE_PACKAGE_STATUSES.AVAILABLE, integrity: { ...recipePackage.integrity, complete: true } });
        return { ok: true, status: OFFLINE_PACKAGE_STATUSES.AVAILABLE };
      },
      getPackage(recipeId) { return store.get(OFFLINE_PACKAGE_STORE, recipeId); },
      async listPackages() { return (await store.list(OFFLINE_PACKAGE_STORE)).sort((a, b) => String(a.title).localeCompare(String(b.title))); },
      async updateProgress(recipeId, progress) {
        const pack = await this.getPackage(recipeId);
        if (!pack) return false;
        const next = { ...pack, progress: { ...(pack.progress || {}), ...(progress || {}), lastOpenedAt: nowIso() } };
        await store.put(OFFLINE_PACKAGE_STORE, recipeId, next);
        await store.put(OFFLINE_PROGRESS_STORE, recipeId, { id: recipeId, recipeId, progress: next.progress, updatedAt: nowIso() });
        return true;
      },
      removePackage(recipeId) { return store.delete(OFFLINE_PACKAGE_STORE, recipeId); },
      getStorageUsage() { return store.usage(); }
    };
  }

  function createOfflineTimer({ timerId, recipeId, stepId, label, durationMs, now = Date.now() } = {}) {
    return { timerId, recipeId, stepId, label, durationMs, startedAt: new Date(now).toISOString(), targetEndAt: new Date(now + durationMs).toISOString(), status: "running", lastUpdatedAt: new Date(now).toISOString() };
  }

  function getTimerState(timer, now = Date.now()) {
    if (!timer) return null;
    if (timer.status === "paused") return { ...timer, remainingMs: timer.remainingMsWhenPaused ?? timer.durationMs };
    const remainingMs = Math.max(0, Date.parse(timer.targetEndAt || "") - now);
    return { ...timer, remainingMs, status: remainingMs <= 0 && timer.status === "running" ? "completed" : timer.status };
  }

  function pauseTimer(timer, now = Date.now()) {
    const current = getTimerState(timer, now);
    return { ...current, status: "paused", pausedAt: new Date(now).toISOString(), remainingMsWhenPaused: current.remainingMs, lastUpdatedAt: new Date(now).toISOString() };
  }

  function resumeTimer(timer, now = Date.now()) {
    const remaining = timer.remainingMsWhenPaused ?? timer.durationMs;
    return { ...timer, status: "running", pausedAt: null, remainingMsWhenPaused: null, targetEndAt: new Date(now + remaining).toISOString(), lastUpdatedAt: new Date(now).toISOString() };
  }

  function addTimerTime(timer, extraMs, now = Date.now()) {
    const current = getTimerState(timer, now);
    const remaining = (current.remainingMs || 0) + extraMs;
    return { ...current, status: "running", targetEndAt: new Date(now + remaining).toISOString(), remainingMsWhenPaused: null, lastUpdatedAt: new Date(now).toISOString() };
  }

  function getTimerPresentation(timer, now = Date.now()) {
    const current = getTimerState(timer, now);
    if (!current) return "Timer unavailable.";
    if (current.status === "completed") {
      const overdueMinutes = Math.max(0, Math.round((now - Date.parse(timer.targetEndAt || "")) / 60000));
      return overdueMinutes ? `${timer.label || "Timer"} finished approximately ${overdueMinutes} minutes ago.` : `${timer.label || "Timer"} finished.`;
    }
    const minutes = Math.ceil((current.remainingMs || 0) / 60000);
    return `${timer.label || "Timer"} has ${minutes} minute${minutes === 1 ? "" : "s"} remaining.`;
  }

  function resolveTranslationFallback({ sourceText = "", translations = [], targetLocale = "zh-CN", recipeVersion = "", online = true } = {}) {
    const current = translations.find((item) => item.locale === targetLocale && item.recipeVersion === recipeVersion && item.status === "current");
    if (current) return { status: "downloaded-current", text: current.translatedText, warning: "" };
    const stale = translations.find((item) => item.locale === targetLocale && item.translatedText);
    if (stale) return { status: "downloaded-stale", text: stale.translatedText, warning: "This downloaded explanation may not match the latest version of the recipe." };
    return { status: online ? "failed-original" : "offline-original", text: sourceText, warning: "The original instructions remain available. Safety and allergy warnings are still shown." };
  }

  function resolveMediaFallback({ type = "video", downloaded = false, streamed = false, transcript = "", text = "" } = {}) {
    if (downloaded) return { status: `${type}-downloaded`, contentType: type };
    if (streamed) return { status: `${type}-streamed`, contentType: type };
    if (transcript) return { status: "transcript", contentType: "transcript", text: transcript };
    return { status: "written-instructions", contentType: "text", text };
  }

  function createSyncQueue(options = {}) {
    const store = options.store || createMemoryStore();
    async function list() { return store.list(OFFLINE_SYNC_STORE); }
    return {
      async enqueue(operation) {
        const id = operation.id || `${operation.entityType}:${operation.entityId}:${operation.operation}`;
        const existing = (await list()).find((item) => item.id === id);
        const next = { ...existing, ...operation, id, attemptCount: existing?.attemptCount || 0, status: "pending", createdAt: existing?.createdAt || nowIso() };
        await store.put(OFFLINE_SYNC_STORE, id, next);
        return next;
      },
      async markFailed(id) {
        const item = await store.get(OFFLINE_SYNC_STORE, id);
        if (!item) return null;
        const next = { ...item, status: "failed", attemptCount: (item.attemptCount || 0) + 1, lastAttemptAt: nowIso() };
        await store.put(OFFLINE_SYNC_STORE, id, next);
        return next;
      },
      list
    };
  }

  function structuredCloneSafe(value) {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function shouldHandleKeyboardShortcut(event, preferences = {}) {
    if (!normalizeOfflineCookingPreferences(preferences).showKeyboardShortcuts) return false;
    const tag = String(event?.target?.tagName || "").toLowerCase();
    return !["input", "textarea", "select"].includes(tag) && event?.target?.isContentEditable !== true;
  }

  return {
    OFFLINE_SCHEMA_VERSION,
    FEATURE_AVAILABILITY_STATES,
    ENHANCED_FEATURES,
    OFFLINE_PACKAGE_STATUSES,
    DEFAULT_LOW_BANDWIDTH_PREFERENCES,
    DEFAULT_OFFLINE_COOKING_PREFERENCES,
    COOKING_COMMAND_MAP,
    createFeatureAvailability,
    detectFeatureAvailability,
    fallbackCopy,
    renderFeatureFallback,
    normalizeLowBandwidthPreferences,
    normalizeOfflineCookingPreferences,
    getNetworkState,
    createOfflineRecipePackage,
    validateOfflineRecipePackage,
    comparePackageVersion,
    createOfflineRecipeRepository,
    createMemoryStore,
    createOfflineTimer,
    getTimerState,
    pauseTimer,
    resumeTimer,
    addTimerTime,
    getTimerPresentation,
    resolveTranslationFallback,
    resolveMediaFallback,
    createSyncQueue,
    shouldHandleKeyboardShortcut
  };
});
