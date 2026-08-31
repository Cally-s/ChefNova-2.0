#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const voiceSafety = require(path.join(root, "scripts", "voice-safety.js"));

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

test("requires explicit user action before microphone session starts", () => {
  const rejected = voiceSafety.createVoiceSession({ purpose: "pantry-entry" });
  assert.strictEqual(rejected.ok, false);
  assert.strictEqual(rejected.reason, "explicit-user-action-required");

  const accepted = voiceSafety.createVoiceSession({
    userActivated: true,
    purpose: "pantry-entry",
    accountId: "user-1",
    authenticationSessionId: "session-1",
    sessionEpoch: 7
  });
  assert.strictEqual(accepted.ok, true);
  assert.strictEqual(accepted.session.state, voiceSafety.MICROPHONE_STATES.READY);
  assert.strictEqual(accepted.session.rawAudioStored, false);
  assert.strictEqual(accepted.session.persistentTranscriptStored, false);
});

test("normalizes permission, device, network, and language failures", () => {
  assert.strictEqual(voiceSafety.normalizeMicrophoneError({ name: "NotAllowedError" }).reason, voiceSafety.FAILURE_REASONS.PERMISSION_DENIED);
  assert.strictEqual(voiceSafety.normalizeMicrophoneError({ reason: "permission-revoked" }).reason, voiceSafety.FAILURE_REASONS.PERMISSION_REVOKED);
  assert.strictEqual(voiceSafety.normalizeMicrophoneError({ name: "NotFoundError" }).reason, voiceSafety.FAILURE_REASONS.NO_INPUT_DEVICE);
  assert.strictEqual(voiceSafety.normalizeMicrophoneError({ name: "DeviceDisconnected" }).reason, voiceSafety.FAILURE_REASONS.DEVICE_DISCONNECTED);
  assert.strictEqual(voiceSafety.normalizeMicrophoneError({ name: "DeviceBusy" }).reason, voiceSafety.FAILURE_REASONS.DEVICE_BUSY);
  assert.strictEqual(voiceSafety.normalizeMicrophoneError({ name: "NetworkError" }).reason, voiceSafety.FAILURE_REASONS.NETWORK_INTERRUPTED);
  assert.strictEqual(voiceSafety.normalizeMicrophoneError({ name: "No-Speech" }).reason, voiceSafety.FAILURE_REASONS.NO_SPEECH_DETECTED);
  assert.strictEqual(voiceSafety.normalizeMicrophoneError({ name: "LanguageNotSupported" }).reason, voiceSafety.FAILURE_REASONS.LANGUAGE_NOT_SUPPORTED);
});

test("renders accessible microphone fallback with required copy", () => {
  const fallback = voiceSafety.renderMicrophoneFallback({ showPermissionHelp: true });
  assert.match(fallback, /MICROPHONE ACCESS IS NOT AVAILABLE/);
  assert.match(fallback, /You can continue with keyboard controls or the labelled form\./);
  assert.match(fallback, /Use Keyboard Controls/);
  assert.match(fallback, /Open Pantry Form/);
  assert.match(fallback, /role="alert"/);
});

test("ignores late callbacks after account, session, or epoch changes", () => {
  const session = voiceSafety.createVoiceSession({
    userActivated: true,
    accountId: "user-1",
    authenticationSessionId: "auth-1",
    sessionEpoch: 2
  }).session;
  assert.strictEqual(voiceSafety.canAcceptCallback(session, { sessionId: session.id, sessionEpoch: 2, accountId: "user-1", authenticationSessionId: "auth-1" }), true);
  assert.strictEqual(voiceSafety.canAcceptCallback(session, { sessionId: session.id, sessionEpoch: 3, accountId: "user-1", authenticationSessionId: "auth-1" }), false);
  assert.strictEqual(voiceSafety.canAcceptCallback(session, { sessionId: session.id, sessionEpoch: 2, accountId: "user-2", authenticationSessionId: "auth-1" }), false);
  assert.strictEqual(voiceSafety.canAcceptCallback(session, { sessionId: session.id, sessionEpoch: 2, accountId: "user-1", authenticationSessionId: "auth-2" }), false);
});

test("keeps partial and unconfirmed transcript ephemeral", () => {
  const session = voiceSafety.createVoiceSession({ userActivated: true, accountId: "user-1", authenticationSessionId: "auth-1", sessionEpoch: 1 }).session;
  const updated = voiceSafety.updateSessionTranscript(session, {
    sessionId: session.id,
    sessionEpoch: 1,
    accountId: "user-1",
    authenticationSessionId: "auth-1",
    partialTranscript: "Two cans",
    finalTranscript: "Two cans of tomatoes in the pantry."
  });
  assert.strictEqual(updated.ok, true);
  assert.strictEqual(updated.session.rawAudioStored, false);
  assert.strictEqual(updated.session.persistentTranscriptStored, false);
  const stopped = voiceSafety.stopVoiceSession(updated.session, { reason: "user-cancelled" });
  assert.strictEqual(stopped.session.partialTranscript, "");
  assert.strictEqual(stopped.session.unconfirmedTranscript, "");
});

test("creates reviewed Pantry interpretation for tomatoes phrase without auto-save", () => {
  const draft = voiceSafety.parseSpeechPantryEntry("Two cans of tomatoes in the pantry.");
  assert.strictEqual(draft.ingredientName, "Tomatoes");
  assert.strictEqual(draft.quantity, 2);
  assert.strictEqual(draft.containerType, "cans");
  assert.strictEqual(draft.canSizeStatus, "confirmation-required");
  assert.strictEqual(draft.persisted, false);
  assert.strictEqual(draft.rawAudioStored, false);
});

test("protected commands open visible review and reject generic voice confirmation", () => {
  const protectedCommands = ["deleteAllergy", "removeDietaryRestriction", "confirmDiscardedFood", "freezeFood", "markMealCompleted", "cancelMeal", "deletePantryItem", "deleteAllPantryData"];
  protectedCommands.forEach((commandId) => {
    const result = voiceSafety.handleRecognizedCommand("", { commandId, accountId: "user-1", voiceSessionId: "voice-1", targetEntityId: "entity-1" });
    assert.strictEqual(result.action, "create-pending-review");
    assert.strictEqual(result.pendingAction.originalUtteranceMayConfirm, false);
    assert.strictEqual(result.pendingAction.genericConfirmationAllowed, false);
  });

  const pending = voiceSafety.createPendingSensitiveVoiceAction({ commandId: "deleteAllergy", accountId: "user-1", targetEntityId: "allergy-1", targetEntityVersion: 1 });
  const rejected = voiceSafety.confirmPendingSensitiveAction(pending, {
    accountId: "user-1",
    targetEntityId: "allergy-1",
    targetEntityVersion: 1,
    inputMethod: "app-voice",
    confirmationPhrase: "yes",
    idempotencyKey: "voice-test-1"
  });
  assert.strictEqual(rejected.ok, false);
  assert.strictEqual(rejected.reason, "generic-voice-confirmation-rejected");
});

test("sensitive action confirmation requires account, version, and idempotency", () => {
  const pending = voiceSafety.createPendingSensitiveVoiceAction({ commandId: "cancelMeal", accountId: "user-1", targetEntityId: "meal-1", targetEntityVersion: 4 });
  assert.strictEqual(voiceSafety.confirmPendingSensitiveAction(pending, { accountId: "user-2", targetEntityId: "meal-1", targetEntityVersion: 4, idempotencyKey: "k1" }).reason, "account-mismatch");
  assert.strictEqual(voiceSafety.confirmPendingSensitiveAction(pending, { accountId: "user-1", targetEntityId: "meal-1", targetEntityVersion: 5, idempotencyKey: "k1" }).reason, "target-version-changed");
  assert.strictEqual(voiceSafety.confirmPendingSensitiveAction(pending, { accountId: "user-1", targetEntityId: "meal-1", targetEntityVersion: 4 }).reason, "missing-idempotency-key");
});

test("privacy-safe events and logs reject raw content canaries", () => {
  const event = voiceSafety.createPrivacySafeVoiceEvent({ event: "voice-session-ended", commandCategory: "form-assistance", outcome: "fallback" });
  assert.strictEqual(event.rawAudioStored, false);
  assert.strictEqual(event.transcriptStored, false);

  const log = voiceSafety.createVoiceErrorLog({ error: { name: "NetworkError" }, featureArea: "food-management" });
  assert.strictEqual(log.transcriptIncluded, false);
  assert.throws(() => voiceSafety.assertPrivacySafePayload({ transcriptText: "VOICE_TEST tomato peanut pantry allergy diet meal waste" }), /prohibited/);
});

test("does not infer disability from accessibility or fallback use", () => {
  assert.deepStrictEqual(voiceSafety.inspectForDisabilityInference({ largeText: true, captions: true, keyboardShortcutsEnabled: true }).blockedTerms, []);
  assert.strictEqual(voiceSafety.inspectForDisabilityInference({ inferredDisability: "blind" }).ok, false);
});

test("legacy voice storage migration removes raw and transcript keys idempotently", () => {
  const migrated = voiceSafety.migrateLegacyVoiceStorage({
    chefNovaVoiceTranscript: "secret",
    chefNovaRawAudio: "blob",
    chefNovaPantry: "safe-existing-key"
  });
  assert.deepStrictEqual(migrated.removedKeys.sort(), ["chefNovaRawAudio", "chefNovaVoiceTranscript"].sort());
  assert.strictEqual(migrated.safeEntries.chefNovaPantry, "safe-existing-key");
  assert.strictEqual(voiceSafety.migrateLegacyVoiceStorage(migrated.safeEntries).removedKeys.length, 0);
});

test("static app integration uses safe voice module and review flow", () => {
  const html = read("index.html");
  const app = read("app.js");
  const css = read("style.css");
  assert(html.indexOf("scripts/voice-safety.js") > html.indexOf("scripts/accessibility-recovery.js"));
  assert(html.indexOf("scripts/voice-safety.js") < html.indexOf("app.js"));
  assert.match(app, /const VOICE_SAFETY = window\.ChefNovaVoiceSafety/);
  assert.match(app, /data-save-voice-pantry-draft/);
  assert.match(app, /data-stop-voice-entry/);
  assert.match(app, /cancelVoiceForAccountBoundary/);
  assert.doesNotMatch(app, /nameInput && transcript\) nameInput\.value = transcript/);
  assert.doesNotMatch(app, /data-partial-transcript[\s\S]{0,220}nameInput\.value = partial/);
  assert.match(css, /\.microphone-fallback-panel/);
  assert.match(css, /\.voice-pantry-review/);
});

test("Step 70 documentation and matrix artifacts exist", () => {
  [
    "docs/accessibility/step-70/TEST_PLAN.md",
    "docs/accessibility/step-70/MICROPHONE_MATRIX.csv",
    "docs/accessibility/step-70/MICROPHONE_MATRIX.json",
    "docs/accessibility/step-70/VOICE_COMMAND_POLICY.md",
    "docs/accessibility/step-70/PRIVACY_DATA_MAP.md",
    "docs/accessibility/step-70/MANUAL_TEST_SCRIPTS.md",
    "docs/accessibility/step-70/ACCOUNT_SWITCH_TESTS.md",
    "docs/accessibility/step-70/NO_DISABILITY_INFERENCE.md",
    "docs/accessibility/step-70/EVIDENCE_GUIDE.md",
    "docs/accessibility/step-70/RESULTS.md",
    "docs/accessibility/step-70/KNOWN_LIMITATIONS.md",
    "docs/accessibility/step-69/STEP_70_MATRIX_APPENDIX.md"
  ].forEach((file) => assert(fs.existsSync(path.join(root, file)), file));

  const matrix = JSON.parse(read("docs/accessibility/step-70/MICROPHONE_MATRIX.json"));
  assert.strictEqual(matrix.rows.length, 18);
  assert(matrix.rows.some((item) => item.status === "blocked" && item.scenario.includes("Permission accepted")));
});
