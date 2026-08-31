const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const recovery = require(path.join(root, "scripts/accessibility-recovery.js"));
const review = require(path.join(root, "scripts/content-review-governance.js"));
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function fullPreferences(overrides = {}) {
  return recovery.normalizePreferences({
    display: { fontScalePercent: 100, lineSpacing: "standard", largeButtons: false, highContrastMode: "system", reducedMotionMode: "system" },
    language: { interfaceLocale: "en-CA", explanationLocale: "zh-CN", cookingTermLocale: "fr-CA", measurementLocale: "en-CA", selectedVoiceLocale: "en-CA" },
    interaction: { keyboardShortcutsEnabled: true, oneInstructionAtATime: true, voiceControlEnabled: true, screenReaderAnnouncements: "detailed" },
    speech: { readAloudEnabled: true, preserveVoiceInterpretationText: true },
    offline: { recoveryAvailableOffline: true, queueFeedbackOffline: true, keepLowBandwidthModeOnDisplayReset: true },
    privacy: { attachPrivateCookingDataByDefault: false },
    ...overrides
  });
}

(function run() {
  assert(html.includes("scripts/accessibility-recovery.js"), "recovery script is loaded");
  assert(html.indexOf("scripts/accessibility-recovery.js") < html.indexOf("app.js"), "recovery script loads before app");
  assert(html.includes("data-page-section=\"accessibility-recovery\""), "Accessibility Recovery route exists");
  assert(app.includes("Language / Langue / 语言 / اللغة"), "multilingual language recovery control is rendered from Profile Settings or Accessibility Recovery");
  assert(app.includes("const ACCESSIBILITY_RECOVERY = window.ChefNovaAccessibilityRecovery || {};"), "app imports recovery module");
  assert(app.includes("renderAccessibilityRecoverySettingsSection"), "settings page renders recovery section");
  assert(app.includes("renderAccessibilityRecoveryPage"), "recovery page renderer exists");
  assert(app.includes("handleRecoveryKeyboardShortcut"), "keyboard recovery shortcut exists");
  assert(app.includes("Alt + Shift + A") && app.includes("Alt + Shift + L"), "keyboard help documents recovery shortcuts");
  assert(css.includes(".accessibility-recovery-shell"), "recovery screen CSS exists");
  assert(css.includes(".display-preview-modal"), "display preview modal CSS exists");
  assert(css.includes(".accessibility-feedback-modal"), "feedback modal CSS exists");

  const previous = fullPreferences();
  const proposedDisplay = { ...previous.display, fontScalePercent: 150, lineSpacing: "extra", largeButtons: true };
  const session = recovery.createDisplayPreviewSession(previous.display, proposedDisplay, { originRoute: "#account" });
  assert.strictEqual(session.status, "previewing", "preview starts as previewing");
  assert.strictEqual(previous.display.fontScalePercent, 100, "preview does not mutate committed preferences");

  const cancelled = recovery.cancelPreviewSession(previous, session);
  assert.strictEqual(cancelled.preferences.display.fontScalePercent, 100, "returning from preview restores previous font size");
  assert.strictEqual(cancelled.preferences.display.lineSpacing, "standard", "returning from preview restores line spacing");

  const applied = recovery.applyPreviewSession(previous, session, "preview");
  assert.strictEqual(applied.preferences.display.fontScalePercent, 150, "applying preview commits display font size");
  assert.strictEqual(applied.preferences.language.explanationLocale, "zh-CN", "applying display preview preserves language domain");
  assert.deepStrictEqual(applied.historyEntry.changedFields.sort(), ["fontScalePercent", "largeButtons", "lineSpacing"].sort(), "history records changed display fields only");
  assert(applied.changeSummary.some((line) => line.includes("Font size")), "change summary names font size");

  const withNonDisplayData = {
    ...previous,
    pantry: [{ id: "milk", quantity: 1 }],
    allergies: ["peanuts"],
    dietaryRestrictions: ["vegetarian"],
    mealPlans: { Monday: { Breakfast: "Omelette" } },
    shoppingList: [{ id: "soy-sauce" }],
    budget: { weeklyBudget: 80 },
    offlinePackages: [{ recipeId: "pasta" }],
    timers: [{ timerId: "timer-1", targetEndAt: "2026-08-19T18:35:00Z" }]
  };
  const restored = recovery.restoreDisplayDefaults(withNonDisplayData, { prefersReducedMotion: true, prefersContrast: true });
  assert.strictEqual(restored.display.fontScalePercent, 100, "restore defaults resets font size");
  assert.strictEqual(restored.display.highContrastMode, "system", "restore defaults respects contrast system mode");
  assert.strictEqual(restored.display.reducedMotionMode, "system", "restore defaults respects reduced-motion system mode");
  assert.strictEqual(restored.language.explanationLocale, "zh-CN", "restore defaults preserves language");
  assert.deepStrictEqual(withNonDisplayData.pantry, [{ id: "milk", quantity: 1 }], "restore defaults does not touch pantry data");
  assert.deepStrictEqual(withNonDisplayData.mealPlans, { Monday: { Breakfast: "Omelette" } }, "restore defaults does not touch meal plans");
  assert.deepStrictEqual(withNonDisplayData.offlinePackages, [{ recipeId: "pasta" }], "restore defaults does not delete offline packages");

  const undoResult = recovery.undoLastDisplayChange(applied.preferences, [applied.historyEntry]);
  assert.strictEqual(undoResult.ok, true, "undo is available for the last display change");
  assert.strictEqual(undoResult.preferences.display.fontScalePercent, 100, "undo restores previous display font size");
  assert.strictEqual(undoResult.preferences.language.explanationLocale, "zh-CN", "undo preserves language");

  const interrupted = recovery.recoverInterruptedPreview(applied.preferences, session);
  assert.strictEqual(interrupted.recovered, true, "interrupted preview is detected");
  assert.strictEqual(interrupted.preferences.display.fontScalePercent, 100, "interrupted preview restores committed settings");

  const invalid = recovery.validateDisplayPreferences({ fontScalePercent: Number.NaN, lineSpacing: "giant", highContrastMode: "always" });
  assert.strictEqual(invalid.valid, false, "invalid display values are rejected");
  assert(invalid.issues.some((issue) => issue.field === "fontScalePercent"), "invalid font size is reported");
  assert.strictEqual(recovery.normalizeDisplayPreferences({ fontScalePercent: -10 }).fontScalePercent, 100, "corrupt display values recover safely");

  const cookingSnapshot = recovery.captureRecoverableSessionSnapshot({
    route: "recipes",
    recipeId: "spinach-bowl",
    recipeVersion: 7,
    currentStepId: "step-4",
    completedStepIds: ["step-1", "step-2", "step-3"],
    activeTimerIds: ["timer-7"],
    pantryDraftId: "pantry-draft",
    shoppingListDraftId: "shopping-draft",
    budgetDraftId: "budget-draft",
    voiceInterpretationDraftId: "voice-draft"
  });
  const tx = recovery.createLanguageChangeTransaction(previous.language, { interfaceLocale: "fr-CA", explanationLocale: "fr-CA" }, cookingSnapshot);
  const lang = recovery.applyLanguageChange(previous, tx);
  assert.strictEqual(lang.ok, true, "supported language change succeeds");
  assert.strictEqual(lang.restoredSnapshot.currentStepId, "step-4", "language change preserves current cooking step");
  assert.deepStrictEqual(lang.restoredSnapshot.activeTimerIds, ["timer-7"], "language change preserves timer IDs");
  assert.strictEqual(lang.preferences.language.interfaceLocale, "fr-CA", "language domain updates");
  const rtl = recovery.applyLanguageChange(previous, recovery.createLanguageChangeTransaction(previous.language, { interfaceLocale: "ar" }, cookingSnapshot));
  assert.strictEqual(rtl.direction, "rtl", "Arabic switches layout direction to rtl");
  const failedLanguage = recovery.applyLanguageChange(previous, recovery.createLanguageChangeTransaction(previous.language, { interfaceLocale: "fr-CA" }, cookingSnapshot), { forceFailure: true });
  assert.strictEqual(failedLanguage.ok, false, "failed language load rolls back");
  assert.strictEqual(failedLanguage.preferences.language.interfaceLocale, "en-CA", "failed language load restores previous locale");
  assert.strictEqual(failedLanguage.restoredSnapshot.recipeId, "spinach-bowl", "failed language load preserves recipe");

  const voiceDraft = recovery.createVoiceInterpretationDraft({ text: "<Next step>", sourceLocale: "en-CA" });
  assert.strictEqual(voiceDraft.text, "Next step", "voice draft keeps editable interpreted text only");
  assert(!("rawAudio" in voiceDraft), "voice draft excludes raw audio");

  const draft = recovery.createFeedbackDraft({
    category: "translation-incorrect",
    description: "<French term seems wrong>",
    userImpact: "safety-concern",
    contentReference: { entityType: "translation-segment", entityId: "recipe-1", entityVersion: 3, locale: "fr-CA", segmentId: "seg-2" }
  });
  const record = recovery.createFeedbackRecord(draft, {
    route: "recipes",
    displaySettings: previous.display,
    languageSettings: previous.language,
    diagnostics: { appVersion: "test", routeTemplate: "recipes", token: "secret", pantry: "private", interfaceLocale: "fr-CA" }
  });
  assert.strictEqual(record.category, "translation-incorrect", "feedback stores one primary category");
  assert.strictEqual(record.priority, "high", "safety feedback receives high priority");
  assert.strictEqual(record.triageDestination, "food-safety-review", "safety feedback routes to food safety");
  assert(record.notIncluded.includes("pantry contents"), "pantry contents excluded by default");
  assert(record.notIncluded.includes("allergy information"), "allergy information excluded by default");
  assert(record.notIncluded.includes("raw audio"), "raw audio excluded by default");
  assert(!JSON.stringify(record.included).includes("secret"), "diagnostic allow-list excludes tokens");
  assert(!JSON.stringify(record.included).includes("private"), "diagnostic allow-list excludes pantry data");
  const triage = recovery.createTranslationFeedbackTriageItem(record, review);
  assert.strictEqual(triage.reviewKind, "food-safety", "safety translation report links to Step 67 safety review");
  assert.strictEqual(triage.contentReference.entityVersion, 3, "triage links exact content version");
  assert(triage.auditEvent, "triage creates Step 67 audit event when available");

  const offlineRecord = recovery.createOfflineQueuedFeedback(record);
  assert.strictEqual(offlineRecord.status, "queued-offline", "offline feedback is queued only after explicit submission");
  assert(offlineRecord.queueId.includes(record.id), "queued feedback has stable queue id");

  assert(app.includes("Restore Display Defaults") && app.includes("data-restore-display-defaults"), "restore defaults visible in the app");
  assert(app.includes("Report an Accessibility or Language Problem"), "feedback entry point is visible");
  assert(app.includes("displayPreviewSession") && app.includes("writeAccessibilityStorage(\"preview\""), "preview session is separate from committed settings");
  assert(app.includes("writeOfflinePreference(\"lowBandwidth\"") && app.includes("keepLowBandwidthModeOnDisplayReset"), "offline and low-bandwidth preferences remain separate");
  assert(!app.includes("localStorage.clear()"), "display recovery must not clear all localStorage");

  console.log("Cook Before It Spoils Step 68 accessibility recovery tests passed.");
})();
