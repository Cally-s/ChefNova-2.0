const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const serviceWorker = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
const resilience = require(path.join(root, "scripts/offline-resilience.js"));

const recipe = {
  id: "spinach-pasta",
  name: "Spinach Pasta",
  recipeVersion: "2026-08-18",
  servings: 4,
  ingredients: [
    { name: "spinach", quantity: 180, unit: "g" },
    { name: "pasta", quantity: 300, unit: "g" }
  ],
  structuredIngredients: [
    { ingredientId: "spinach", displayName: "spinach", displayText: "180 g spinach", quantity: 180, unit: "g" },
    { ingredientId: "pasta", displayName: "pasta", displayText: "300 g pasta", quantity: 300, unit: "g" }
  ],
  steps: ["Boil pasta for 10 minutes.", "Cook spinach for 2 minutes.", "Combine and serve."],
  allergyWarnings: ["Contains wheat."],
  safetyWarnings: ["Keep hot food hot until serving."]
};

(async function run() {
  assert(html.includes("scripts/offline-resilience.js"), "index loads offline resilience script");
  assert(html.indexOf("scripts/offline-resilience.js") < html.indexOf("app.js"), "offline resilience loads before app");
  assert(html.includes("service-worker.js") === false || serviceWorker.includes("CACHE_NAME"), "service worker is standalone");
  assert(html.includes("startVoicePantryEntry"), "Pantry exposes voice entry button");
  assert(html.includes("pantryVoiceFallbackRegion"), "Pantry fallback region exists");

  assert(app.includes("const RESILIENCE = window.ChefNovaResilience || {};"), "app imports resilience namespace");
  assert(app.includes("initializeOfflineResilience"), "app initializes offline resilience");
  assert(app.includes("renderOfflineSettingsSection"), "profile renders offline settings");
  assert(app.includes("downloadRecipeForOffline"), "offline recipe download handler exists");
  assert(app.includes("removeOfflineRecipe"), "offline recipe remove handler exists");
  assert(app.includes("readRecipeDetailAloud"), "TTS handler exists");
  assert(app.includes("showRecipeTranslationFallback"), "translation fallback handler exists");
  assert(app.includes("showRecipeMediaFallback"), "media fallback handler exists");
  assert(app.includes("handleOfflineCookingKeydown"), "keyboard equivalents exist");

  assert(serviceWorker.includes("./index.html"), "app shell caches index");
  assert(serviceWorker.includes("./style.css"), "app shell caches CSS");
  assert(serviceWorker.includes("./scripts/offline-resilience.js"), "app shell caches resilience script");
  assert(serviceWorker.includes("caches.match"), "service worker serves cached content");
  assert(serviceWorker.includes("Offline"), "service worker has offline response");

  const speechUnsupported = resilience.detectFeatureAvailability(resilience.ENHANCED_FEATURES.SPEECH_RECOGNITION, { online: true, window: {} });
  assert.strictEqual(speechUnsupported.state, resilience.FEATURE_AVAILABILITY_STATES.UNSUPPORTED, "speech recognition detects unsupported browser");
  const speechCopy = resilience.fallbackCopy(resilience.ENHANCED_FEATURES.SPEECH_RECOGNITION, speechUnsupported.state, { partialTranscript: "spinach" });
  assert.strictEqual(speechCopy.title, "VOICE ENTRY IS NOT AVAILABLE", "speech fallback uses required title");
  assert(speechCopy.description.includes("labelled Pantry form"), "speech fallback points to labelled Pantry form");
  assert.strictEqual(speechCopy.primaryActionLabel, "Open Pantry Form", "speech fallback has manual form action");
  assert.strictEqual(speechCopy.retryActionLabel, "Try Voice Entry Again", "speech fallback has retry action");
  assert.strictEqual(speechCopy.partialTranscript, "spinach", "speech fallback preserves partial transcript");
  assert.strictEqual(resilience.fallbackCopy(resilience.ENHANCED_FEATURES.SPEECH_RECOGNITION, resilience.FEATURE_AVAILABILITY_STATES.PERMISSION_DENIED).retryable, false, "permission denial is not silently retried");

  const ttsCopy = resilience.fallbackCopy(resilience.ENHANCED_FEATURES.TEXT_TO_SPEECH, resilience.FEATURE_AVAILABILITY_STATES.FAILED);
  assert.strictEqual(ttsCopy.title, "READ-ALOUD IS NOT AVAILABLE", "TTS fallback uses required title");
  assert(ttsCopy.description.includes("available as text"), "TTS fallback preserves text instructions");
  assert.strictEqual(ttsCopy.primaryActionLabel, "Continue with Text", "TTS fallback has text action");
  assert.strictEqual(ttsCopy.retryActionLabel, "Try Again", "TTS fallback has retry");

  const currentTranslation = resilience.resolveTranslationFallback({ sourceText: "Original", translations: [{ locale: "fr-CA", recipeVersion: "v1", status: "current", translatedText: "Courant" }], targetLocale: "fr-CA", recipeVersion: "v1" });
  assert.strictEqual(currentTranslation.status, "downloaded-current", "current cached translation is used");
  const staleTranslation = resilience.resolveTranslationFallback({ sourceText: "Original", translations: [{ locale: "fr-CA", recipeVersion: "old", translatedText: "Ancien" }], targetLocale: "fr-CA", recipeVersion: "v2" });
  assert.strictEqual(staleTranslation.status, "downloaded-stale", "stale cached translation is labelled");
  assert(staleTranslation.warning.includes("may not match"), "stale translation warns user");
  const originalTranslation = resilience.resolveTranslationFallback({ sourceText: "Original", translations: [], targetLocale: "fr-CA", recipeVersion: "v2", online: false });
  assert.strictEqual(originalTranslation.text, "Original", "translation failure keeps original text");
  assert(originalTranslation.warning.includes("Safety and allergy warnings"), "translation failure preserves safety warning notice");

  const mediaFallback = resilience.resolveMediaFallback({ type: "video", transcript: "Step transcript", text: "Written steps" });
  assert.strictEqual(mediaFallback.contentType, "transcript", "video failure uses transcript before generic text");
  const mediaTextFallback = resilience.resolveMediaFallback({ type: "audio", text: "Written steps" });
  assert.strictEqual(mediaTextFallback.contentType, "text", "audio failure falls back to visible text");

  const pack = resilience.createOfflineRecipePackage(recipe, { explanationLocale: "fr-CA", includeSmallImages: true });
  assert.strictEqual(pack.schemaVersion, resilience.OFFLINE_SCHEMA_VERSION, "package records schema version");
  assert.strictEqual(pack.status, resilience.OFFLINE_PACKAGE_STATUSES.AVAILABLE, "complete package is available");
  assert.strictEqual(pack.recipeSnapshot.ingredients[0].canonicalQuantity.value, "180", "canonical quantity value is stored");
  assert.strictEqual(pack.recipeSnapshot.ingredients[0].canonicalQuantity.unit, "g", "canonical quantity unit is stored");
  assert.strictEqual(pack.recipeSnapshot.allergyWarnings.length, 1, "allergy warnings are packaged");
  assert.strictEqual(pack.recipeSnapshot.safetyWarnings.length, 1, "safety warnings are packaged");
  assert(pack.recipeSnapshot.transcript.sourceText.includes("Boil pasta"), "transcript is packaged");
  assert(pack.recipeSnapshot.timerDefinitions.some((timer) => timer.durationMs === 600000), "timers are extracted from text");
  assert.strictEqual(pack.media.transcriptIncluded, true, "transcript media flag is true");
  assert.strictEqual(pack.media.videoIncluded, false, "video is not included by default");
  assert(pack.storageEstimateBytes > 0, "package estimates storage usage");

  const invalidPack = { ...pack, recipeSnapshot: { ...pack.recipeSnapshot, steps: [] }, integrity: { ...pack.integrity, complete: false } };
  const validation = resilience.validateOfflineRecipePackage(invalidPack);
  assert.strictEqual(validation.valid, false, "incomplete package fails validation");
  assert(validation.errors.includes("instructions"), "missing instructions are reported");

  const repo = resilience.createOfflineRecipeRepository({ store: resilience.createMemoryStore() });
  let saveResult = await repo.savePackage(pack);
  assert.strictEqual(saveResult.ok, true, "complete package saves");
  saveResult = await repo.savePackage(invalidPack);
  assert.strictEqual(saveResult.ok, false, "incomplete replacement does not save as valid");
  assert.strictEqual(saveResult.keptExisting, true, "existing valid package is kept after interrupted update");
  assert.strictEqual((await repo.getPackage(recipe.id)).status, resilience.OFFLINE_PACKAGE_STATUSES.AVAILABLE, "valid package remains after failed update");
  assert.strictEqual((await repo.listPackages()).length, 1, "repository lists saved package");

  const timerStart = Date.parse("2026-08-18T12:00:00Z");
  const timer = resilience.createOfflineTimer({ timerId: "timer-1", recipeId: recipe.id, stepId: "step-1", label: "Pasta timer", durationMs: 600000, now: timerStart });
  assert.strictEqual(resilience.getTimerState(timer, timerStart + 300000).remainingMs, 300000, "timer resumes from timestamp state");
  assert.strictEqual(resilience.getTimerState(timer, timerStart + 700000).status, "completed", "timer completes by timestamp");
  assert(resilience.getTimerPresentation(timer, timerStart + 720000).includes("approximately 2 minutes ago"), "reopened completed timer shows elapsed time");
  const paused = resilience.pauseTimer(timer, timerStart + 120000);
  assert.strictEqual(paused.status, "paused", "timer can pause");
  assert.strictEqual(resilience.resumeTimer(paused, timerStart + 240000).status, "running", "timer can resume");
  assert.strictEqual(resilience.addTimerTime(paused, 60000, timerStart + 240000).status, "running", "timer can receive extra time");

  const low = resilience.normalizeLowBandwidthPreferences({ enabled: true, autoplayVideo: true, preloadAudio: true, preloadVideo: true, imageQuality: "large" });
  assert.strictEqual(low.autoplayVideo, false, "low-bandwidth disables autoplay video");
  assert.strictEqual(low.preloadAudio, false, "low-bandwidth disables audio preload");
  assert.strictEqual(low.preloadVideo, false, "low-bandwidth disables video preload");
  assert.strictEqual(low.imageQuality, "small", "invalid image quality normalizes");
  assert.strictEqual(resilience.getNetworkState({ navigator: { onLine: false } }).status, "offline", "network state detects offline");
  assert.strictEqual(resilience.getNetworkState({ navigator: { onLine: true, connection: { effectiveType: "2g" } } }).status, "unstable", "network state detects low bandwidth");

  const syncQueue = resilience.createSyncQueue({ store: resilience.createMemoryStore() });
  await syncQueue.enqueue({ entityType: "meal-plan", entityId: "week-1", operation: "save", payload: { meals: 1 } });
  await syncQueue.enqueue({ entityType: "meal-plan", entityId: "week-1", operation: "save", payload: { meals: 2 } });
  assert.strictEqual((await syncQueue.list()).length, 1, "sync queue deduplicates same operation");
  const failed = await syncQueue.markFailed("meal-plan:week-1:save");
  assert.strictEqual(failed.status, "failed", "sync queue preserves failed operation");
  assert.strictEqual(failed.attemptCount, 1, "sync retry attempts are counted");

  const commands = resilience.COOKING_COMMAND_MAP;
  ["nextStep", "previousStep", "repeatStep", "startTimer", "pauseTimer", "resumeTimer", "stopTimer", "showIngredients", "showWarnings", "markStepComplete"].forEach((key) => {
    assert(commands[key], `${key} command is mapped`);
    assert(commands[key].buttonLabel, `${key} has visible button equivalent`);
    assert(commands[key].keyboardShortcut, `${key} has keyboard equivalent`);
    assert(commands[key].screenReaderLabel, `${key} has screen-reader label`);
  });
  assert.strictEqual(resilience.shouldHandleKeyboardShortcut({ target: { tagName: "INPUT" } }, { showKeyboardShortcuts: true }), false, "shortcuts do not hijack form inputs");
  assert.strictEqual(resilience.shouldHandleKeyboardShortcut({ target: { tagName: "DIV" } }, { showKeyboardShortcuts: true }), true, "shortcuts work outside form fields");

  assert(css.includes(".offline-status-banner"), "CSS styles connectivity banner");
  assert(css.includes(".feature-fallback-panel"), "CSS styles fallback panel");
  assert(css.includes(".offline-preferences-form"), "CSS styles offline preferences");
  assert(css.includes("@media (max-width: 640px)"), "CSS includes mobile fallback layout");

  console.log("Step 66 offline resilience tests passed.");
})();
