#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rollout = require(path.join(root, "scripts", "rollout-management.js"));

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const devContext = { environment: "development", applicationVersion: "static-local", accountId: "user-a", requestedLocale: "en-CA", deviceCategory: "desktop" };
const prodContext = { environment: "production", applicationVersion: "static-local", accountId: "user-a", requestedLocale: "en-CA", deviceCategory: "desktop" };

test("unknown flags default safely", () => {
  const result = rollout.evaluateFeatureFlag("unknown.experimental.flag", prodContext);
  assert.strictEqual(result.enabled, false);
  assert.strictEqual(result.reason, "default");
});

test("required flags and stages are explicit, independent, and typed", () => {
  assert(rollout.REQUIRED_FEATURE_FLAGS.includes("cooking.voice-navigation"));
  assert(rollout.REQUIRED_FEATURE_FLAGS.includes("pantry.speech-entry"));
  assert(rollout.REQUIRED_FEATURE_FLAGS.includes("language.bridge"));
  assert(rollout.REQUIRED_FEATURE_FLAGS.includes("language.locale.fr-CA"));
  assert(rollout.REQUIRED_FEATURE_FLAGS.includes("language.locale.zh-Hans"));
  assert(rollout.REQUIRED_FEATURE_FLAGS.includes("language.locale.zh-Hant"));
  assert(rollout.REQUIRED_FEATURE_FLAGS.includes("language.locale.ar"));
  assert.strictEqual(rollout.DEFAULT_STAGE_RECORDS.length, 4);
  assert(rollout.DEFAULT_STAGE_RECORDS.every((stage) => rollout.ACCESSIBILITY_ROLLOUT_STAGES.includes(stage.id)));
  assert(!rollout.REQUIRED_FEATURE_FLAGS.includes("accessibilityUpgradeEnabled"));
});

test("disabled flags hide enhanced features but preserve preferences", () => {
  const preference = rollout.preserveFeatureBackedPreference(true, { enabled: false, reason: "kill-switch" });
  assert.deepStrictEqual(preference, { preferredValue: true, featureCurrentlyAvailable: false, unavailableReason: "kill-switch" });
});

test("feature dependencies are enforced", () => {
  const config = clone(rollout.DEFAULT_ROLLOUT_CONFIG);
  config.flags["privacy.microphone-controls"].killSwitch = { active: true, owner: "privacy-owner", reason: "test", activatedAt: "2026-08-20T00:00:00Z" };
  assert.strictEqual(rollout.evaluateFeatureFlag("cooking.voice-navigation", devContext, config).enabled, false);
  assert.strictEqual(rollout.evaluateFeatureFlag("cooking.voice-navigation", devContext, config).reason, "dependency-disabled");
});

test("voice and Pantry speech cannot enable without privacy controls or manual form", () => {
  const config = clone(rollout.DEFAULT_ROLLOUT_CONFIG);
  config.flags["pantry.speech-entry"].status = "general-availability";
  assert.strictEqual(rollout.evaluateFeatureFlag("pantry.speech-entry", devContext, config, { manualPantryFormAvailable: false }).enabled, false);
  const invalid = rollout.validateRolloutConfiguration(config, { manualPantryFormAvailable: false });
  assert(invalid.issues.some((issue) => issue.code === "speech-without-manual-form"));
});

test("Language Bridge cannot expose unapproved locales or machine-draft safety content", () => {
  const config = clone(rollout.DEFAULT_ROLLOUT_CONFIG);
  config.flags["language.locale.fr-CA"].status = "general-availability";
  config.flags["language.locale.fr-CA"].approvedContentVersion = "";
  const invalid = rollout.validateRolloutConfiguration(config, { machineDraftSafetyTranslationReferenced: true, manualPantryFormAvailable: true });
  assert(invalid.issues.some((issue) => issue.code === "locale-without-approved-content"));
  assert(invalid.issues.some((issue) => issue.code === "machine-draft-safety-translation"));
});

test("RTL and translated media require locale and reviewed media support", () => {
  const config = clone(rollout.DEFAULT_ROLLOUT_CONFIG);
  config.flags["language.rtl-support"].status = "general-availability";
  config.flags["language.translated-media"].status = "general-availability";
  const invalid = rollout.validateRolloutConfiguration(config, { manualPantryFormAvailable: true, reviewedCaptions: false, reviewedTranscript: false });
  assert(invalid.issues.some((issue) => issue.code === "rtl-without-approved-locale"));
  assert(invalid.issues.some((issue) => issue.code === "translated-media-unreviewed"));
});

test("feature snapshots are versioned and prevent hydration mismatch", () => {
  const snapshot = rollout.getReleaseSnapshot(devContext);
  assert.strictEqual(snapshot.configurationVersion, rollout.CONFIGURATION_VERSION);
  assert(snapshot.generatedAt);
  assert.strictEqual(typeof snapshot.flags["pantry.speech-entry"], "boolean");
});

test("deterministic cohort assignment is stable and excludes disability data", () => {
  const a = rollout.deterministicBucket("account-1", "accessibility.font-scaling", "salt-v1");
  const b = rollout.deterministicBucket("account-1", "accessibility.font-scaling", "salt-v1");
  const c = rollout.deterministicBucket("account-1", "accessibility.font-scaling", "salt-v2");
  assert.strictEqual(a, b);
  assert.notStrictEqual(a, c);
  assert.throws(() => rollout.normalizeContext({ ...prodContext, blindUser: true }), /prohibited/);
});

test("explicit beta opt-out and rollout reduction preserve user data", () => {
  const userState = { pantry: [{ id: "p1" }], timers: [{ timerId: "t1" }], preferences: { oneInstruction: true }, explicitBetaOptIn: true };
  const optedOut = rollout.explicitBetaOptOut(userState, ["cooking.voice-navigation"]);
  assert.strictEqual(optedOut.explicitBetaOptIn, false);
  assert.deepStrictEqual(optedOut.pantry, userState.pantry);
  assert.strictEqual(optedOut.dataPreserved, true);
});

test("session-safe flag refresh preserves cooking progress, timers, locale, and offline packages", () => {
  const session = {
    cookingProgress: { currentStepIndex: 4, completedStepIds: ["1", "2"] },
    activeTimers: [{ timerId: "timer-1", targetEndAt: "2026-08-20T12:30:00Z", status: "running" }],
    offlinePackages: [{ recipeId: "r1", publicationVersion: "m12" }],
    selectedLocale: "fr-CA",
    oneInstructionPreference: true
  };
  const refreshed = rollout.applySessionSafeFlagRefresh(session, { "accessibility.one-instruction-mode": false, "cooking.voice-navigation": false });
  assert.strictEqual(refreshed.cookingProgress.currentStepIndex, 4);
  assert.strictEqual(refreshed.activeTimers[0].targetEndAt, "2026-08-20T12:30:00Z");
  assert.strictEqual(refreshed.selectedLocale, "fr-CA");
  assert.strictEqual(refreshed.presentationMode, "standard-cooking-view");
  assert.strictEqual(refreshed.voiceSessionAction, "stop-recognition-release-microphone");
});

test("voice kill switch is auditable and preserves fallback paths", () => {
  const activated = rollout.activateKillSwitch(rollout.DEFAULT_ROLLOUT_CONFIG, "cooking.voice-navigation", { owner: "voice-owner", reason: "test incident", incidentId: "INC-1" });
  assert.strictEqual(activated.ok, true);
  assert.strictEqual(activated.configuration.flags["cooking.voice-navigation"].killSwitch.active, true);
  assert.strictEqual(activated.auditEvent.action, "kill-switch-activated");
  const rollback = rollout.rollbackVoiceFeature({ id: "voice-1" });
  assert.strictEqual(rollback.microphoneTracksReleased, true);
  assert.strictEqual(rollback.lateCallbacksRejected, true);
  assert.strictEqual(rollback.keyboardControlsAvailable, true);
  assert.strictEqual(rollback.confirmedPantryDataPreserved, true);
});

test("timer, language, safety, RTL, translated media, and offline rollback preserve state", () => {
  const timers = rollout.rollbackTimerPresentation([{ timerId: "t1", targetEndAt: "2026-08-20T12:00:00Z", status: "running" }]);
  assert.strictEqual(timers[0].restarted, false);
  assert.strictEqual(timers[0].targetEndAt, "2026-08-20T12:00:00Z");

  const translation = rollout.rollbackTranslationVersion({ locale: "fr-CA", currentVersion: "v4", previousApprovedVersion: "v3" });
  assert.strictEqual(translation.restoredVersion, "v3");
  assert.strictEqual(translation.userLanguagePreferencePreserved, true);

  const safety = rollout.rollbackTranslationVersion({ locale: "fr-CA", currentVersion: "v4", safetyCritical: true });
  assert.strictEqual(safety.fallback, "approved-source-language-warning");
  assert.strictEqual(safety.safetyWarningVisible, true);

  const rtl = rollout.rollbackRtlLocale({ selectedLocalePreference: "ar", currentRecipeId: "recipe-1", currentStepIndex: 5, timers: [{ timerId: "t1" }] });
  assert.strictEqual(rtl.selectedLocalePreference, "ar");
  assert.strictEqual(rtl.currentStepIndex, 5);
  assert.strictEqual(rtl.languageRecoveryAvailable, true);

  const offline = rollout.markOfflinePackageForRollbackUpdate({ recipeId: "r1", progress: { currentStepIndex: 2 } }, { reason: "translation-rollback" });
  assert.strictEqual(offline.immutableSnapshotPreserved, true);
  assert.strictEqual(offline.cookingProgressPreserved, true);
  assert.strictEqual(offline.replacementRequiresUserAction, true);
});

test("migration compatibility and unified storage reject alternate data stores", () => {
  assert.strictEqual(rollout.validateUnifiedStorage(["chefNova.pantry", "chefNovaMealPlan", "chefNovaOfflinePackages"]).ok, true);
  const invalid = rollout.validateUnifiedStorage(["pantry_voice_items", "language_bridge_recipes", "rtl_users"]);
  assert.strictEqual(invalid.ok, false);
  assert.strictEqual(invalid.invalidStores.length, 3);
});

test("flag audit and monitoring events contain no private user content or disability inference", () => {
  const event = rollout.createRolloutHealthEvent({ event: "feature-fallback-used", featureFlagKey: "pantry.speech-entry", rolloutStage: "stage-2-independent-cooking", outcome: "fallback", errorCategory: "permission-denied" });
  assert.strictEqual(event.containsUserContent, false);
  assert.strictEqual(event.containsRawAudio, false);
  assert.strictEqual(event.containsDisabilityInference, false);
  assert.throws(() => rollout.createRolloutHealthEvent({ event: "feature-error", featureFlagKey: "pantry.speech-entry", rolloutStage: "stage-2-independent-cooking", errorCategory: "VOICE_TEST_PRIVATE" }), /private/);
  assert.throws(() => rollout.createFeatureFlagAuditEvent({ flagKey: "pantry.speech-entry", action: "enabled", actorId: "owner", reason: "peanut allergy" }), /private/);
});

test("stage cannot advance with failed, blocked, or severe required criteria", () => {
  const blockedStage = clone(rollout.DEFAULT_STAGE_RECORDS[0]);
  blockedStage.entryCriteria[0].status = "passed";
  blockedStage.entryCriteria[1].status = "blocked";
  assert.strictEqual(rollout.canAdvanceStage(blockedStage).allowed, false);

  const passedStage = clone(rollout.DEFAULT_STAGE_RECORDS[0]);
  passedStage.entryCriteria.forEach((criterion) => { criterion.status = "passed"; });
  passedStage.exitCriteria.forEach((criterion) => { criterion.status = "passed"; });
  assert.strictEqual(rollout.canAdvanceStage(passedStage, { openSeverity0Count: 1 }).allowed, false);
});

test("per-locale release status is independent", () => {
  const config = clone(rollout.DEFAULT_ROLLOUT_CONFIG);
  config.flags["language.locale.fr-CA"].status = "general-availability";
  config.flags["language.locale.fr-CA"].approvedContentVersion = "fr-ca-v1";
  config.flags["language.locale.zh-Hant"].status = "draft";
  const fr = rollout.evaluateFeatureFlag("language.locale.fr-CA", { ...prodContext, requestedLocale: "fr-CA" }, config);
  const zhHant = rollout.evaluateFeatureFlag("language.locale.zh-Hant", { ...prodContext, requestedLocale: "zh-Hant" }, config);
  assert.strictEqual(fr.enabled, true);
  assert.strictEqual(zhHant.enabled, false);
});

test("release dashboard, incidents, maintenance records, owners, and schedule are structured", () => {
  const incident = rollout.createIncident({ affectedFeature: "language.bridge", affectedLocale: "fr-CA", safetyImpact: "safety warning review needed" });
  const record = rollout.createMaintenanceRecord({ reviewType: "language-review", localesReviewed: ["fr-CA"], owners: ["fr-ca-language-owner"] });
  const dashboard = rollout.createReleaseDashboardModel({ incidents: [incident], maintenanceRecords: [record] });
  assert.strictEqual(dashboard.configurationVersion, rollout.CONFIGURATION_VERSION);
  assert.strictEqual(dashboard.stages.length, 4);
  assert(rollout.MAINTENANCE_OWNERS.voiceAndMicrophonePrivacy);
  assert(rollout.MAINTENANCE_SCHEDULE.some((item) => item.cadence === "quarterly"));
});

test("static app integration loads rollout service and gates enhanced voice features", () => {
  const html = read("index.html");
  const app = read("app.js");
  const worker = read("service-worker.js");
  const workflow = read(".github/workflows/accessibility-language-regression.yml");
  assert(html.indexOf("scripts/rollout-management.js") > html.indexOf("scripts/voice-safety.js"));
  assert(html.indexOf("scripts/rollout-management.js") < html.indexOf("app.js"));
  assert.match(app, /const ROLLOUT = window\.ChefNovaRollout/);
  assert.match(app, /evaluateRolloutFlag\("pantry\.speech-entry"/);
  assert.match(app, /evaluateRolloutFlag\("privacy\.microphone-controls"/);
  assert.match(app, /evaluateRolloutFlag\("cooking\.recipe-tts"/);
  assert.match(app, /rolloutHealthEvents/);
  assert(worker.includes("./scripts/rollout-management.js"));
  assert(workflow.includes("scripts/rollout-management.js"));
  assert(workflow.includes("tests/cook-before-it-spoils-step-71-staged-rollout.test.js"));
});

test("Step 71 operational documents are generated and non-empty", () => {
  [
    "ROLLOUT_PLAN.md",
    "STAGE_GATES.md",
    "FEATURE_FLAG_CATALOG.md",
    "FEATURE_DEPENDENCIES.md",
    "ROLLBACK_RUNBOOK.md",
    "TRANSLATION_ROLLBACK.md",
    "MIGRATION_ROLLBACK.md",
    "OFFLINE_ROLLBACK.md",
    "MONITORING_PLAN.md",
    "MAINTENANCE_SCHEDULE.md",
    "COMPATIBILITY_POLICY.md",
    "INCIDENT_TEMPLATE.md",
    "RELEASE_CHECKLIST.md",
    "RESULTS.md",
    "KNOWN_LIMITATIONS.md",
    "RELEASE_DASHBOARD.json",
    "ROLLOUT_CONFIG.json",
    "STAGE_RECORDS.json"
  ].forEach((file) => {
    const absolute = path.join(root, "docs", "accessibility", "step-71", file);
    assert(fs.existsSync(absolute), file);
    assert(fs.statSync(absolute).size > 80, file);
  });
});
