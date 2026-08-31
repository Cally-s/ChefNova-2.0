#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const step70Dir = path.join(repoRoot, "docs", "accessibility", "step-70");
const step69Dir = path.join(repoRoot, "docs", "accessibility", "step-69");

const rows = [
  row("S70-001", "automated", "Explicit microphone activation required", "User activation false", "Voice session is rejected and microphone remains idle.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-002", "automated", "Supported microphone session lifecycle", "User activation true with account/session binding", "Session enters ready/listening and records no raw audio.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-003", "automated", "Permission denied fallback", "Recognition permission denial", "Accessible fallback displays keyboard and Pantry form controls.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-004", "manual-real-browser", "Permission accepted in real browser", "Real user grants microphone permission", "Visible listening indicator appears with Stop Listening control.", "blocked", "Requires real browser microphone permission not available in this run."),
  row("S70-005", "manual-real-browser", "Permission denied in real browser", "Real user denies microphone permission", "No prompt loop; fallback remains available.", "blocked", "Requires real browser permission prompt not available in this run."),
  row("S70-006", "manual-real-browser", "Permission revoked while listening", "Browser permission revoked mid-session", "Session stops, tracks release, transcript clears.", "blocked", "Requires real browser permission controls not available in this run."),
  row("S70-007", "automated", "Speech API unavailable", "No SpeechRecognition API", "Fallback is rendered without storing transcript.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-008", "automated", "Device unavailable and disconnected errors", "No input device and disconnected device errors", "Failure reasons are deterministic.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-009", "automated", "Network and language recognition errors", "Network interruption, no speech, unsupported language", "Safe failure reason is shown and no retry loop starts.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-010", "automated", "Late callback isolation", "Account, session, and epoch mismatch callbacks", "Callbacks are ignored after account/session changes.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-011", "automated", "Pantry voice phrase review", "Two cans of tomatoes in the pantry.", "Editable draft shows tomatoes, quantity 2, cans, can size required, no auto-save.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-012", "automated", "Protected command policy", "Delete allergy, remove diet, discard food, freeze food, complete meal, cancel meal, delete Pantry data", "Voice opens pending visible review only.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-013", "automated", "Generic confirmation rejection", "Voice says yes/ok/confirm", "Sensitive action does not execute.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-014", "automated", "Privacy-safe event payload", "Voice telemetry/audit payloads", "No raw audio, transcript, food, allergy, diet, meal, waste, or disability inference is stored.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-015", "automated", "Legacy voice storage migration", "Legacy transcript/audio keys exist", "Keys are removed idempotently.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-016", "automated", "No disability inference", "Accessibility preferences and voice fallback use", "No disability diagnosis or inferred disability field is created.", "pass", "tests/cook-before-it-spoils-step-70-voice-safety.test.js"),
  row("S70-017", "manual-assistive-tech", "Screen reader fallback announcement", "Screen reader user starts unavailable voice entry", "Fallback heading, text, and buttons are announced clearly.", "blocked", "Requires real screen reader/browser combination not available in this run."),
  row("S70-018", "manual-mobile", "Mobile device disconnection", "Phone microphone changes or disconnects", "Session stops and fallback remains usable.", "blocked", "Requires mobile hardware not available in this run.")
];

function row(id, type, scenario, setup, expected, status, evidence) {
  return { id, type, scenario, setup, expected, status, evidence };
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function csvEscape(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function toCsv(items) {
  const headers = ["id", "type", "scenario", "setup", "expected", "status", "evidence"];
  return [headers.join(","), ...items.map((item) => headers.map((header) => csvEscape(item[header])).join(","))].join("\n") + "\n";
}

function markdownTable(items) {
  return [
    "| ID | Type | Scenario | Status | Evidence |",
    "| --- | --- | --- | --- | --- |",
    ...items.map((item) => `| ${item.id} | ${item.type} | ${item.scenario} | ${item.status} | ${item.evidence} |`)
  ].join("\n");
}

const summary = {
  step: 70,
  title: "Privacy, Permissions, and Voice Safety",
  generatedAt: new Date().toISOString(),
  totals: rows.reduce((acc, item) => {
    acc.total += 1;
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, { total: 0 }),
  rows
};

write(path.join(step70Dir, "MICROPHONE_MATRIX.json"), JSON.stringify(summary, null, 2) + "\n");
write(path.join(step70Dir, "MICROPHONE_MATRIX.csv"), toCsv(rows));
write(path.join(step70Dir, "TEST_PLAN.md"), `# Step 70 Test Plan

Goal: verify microphone permission handling, voice command safety, privacy boundaries, and account isolation without using a backend or storing raw voice data.

Automated tests cover the reusable safety module and static app integration. Manual tests are documented for real microphone permission prompts, mobile hardware behavior, and assistive technology combinations that were not available in this local run.

${markdownTable(rows)}
`);

write(path.join(step70Dir, "VOICE_COMMAND_POLICY.md"), `# Voice Command Policy

Voice commands are grouped by risk:

- Read-only: may run from the initial voice request.
- Navigation: may move the user to visible app areas.
- Reversible: may start or adjust reversible controls.
- Sensitive: may only open visible review.
- Destructive: may only open visible review and needs stronger confirmation.

Protected actions include deleting allergies, removing dietary restrictions, confirming discarded food, freezing food, marking a meal completed, cancelling a meal, and deleting Pantry data. Generic voice replies like "yes" are rejected for protected actions.
`);

write(path.join(step70Dir, "PRIVACY_DATA_MAP.md"), `# Privacy Data Map

Voice data is classified as ephemeral audio, partial transcript, unconfirmed transcript, user-confirmed text, non-sensitive command event, transactional audit event, or optional diagnostic data.

Raw audio, partial transcripts, unconfirmed transcripts, Pantry content, allergy content, dietary content, meal content, waste content, and disability inference are not stored in analytics or feedback records.
`);

write(path.join(step70Dir, "MANUAL_TEST_SCRIPTS.md"), `# Manual Test Scripts

## Real Browser Permission

1. Open Chef Nova in a browser with microphone support.
2. Go to Pantry.
3. Choose Voice Pantry Entry.
4. Accept permission.
5. Confirm the listening indicator appears and Stop Listening is available.

## Denied Permission

1. Start Voice Pantry Entry.
2. Deny permission.
3. Confirm the fallback says "MICROPHONE ACCESS IS NOT AVAILABLE".
4. Confirm keyboard controls and Pantry form buttons work.

## Assistive Technology

1. Enable a screen reader.
2. Trigger unavailable voice entry.
3. Confirm fallback content and buttons are announced in order.
`);

write(path.join(step70Dir, "ACCOUNT_SWITCH_TESTS.md"), `# Account Switch Tests

Voice sessions are bound to account ID, authentication session ID, and session epoch. Login, logout, guest exit, and account switching cancel active voice sessions. Late callbacks with stale IDs are ignored.
`);

write(path.join(step70Dir, "NO_DISABILITY_INFERENCE.md"), `# No Disability Inference

Chef Nova may store accessibility preferences that the user explicitly chooses. It must not infer disability status from voice fallback use, keyboard use, screen reader-compatible settings, large text, captions, localization, or recovery settings.
`);

write(path.join(step70Dir, "EVIDENCE_GUIDE.md"), `# Evidence Guide

Acceptable evidence includes automated test output, code references, screenshots of non-sensitive UI states, and notes from manual permission tests.

Do not collect raw audio, transcripts, Pantry contents, allergies, dietary restrictions, meal details, waste history, or disability assumptions as evidence.
`);

write(path.join(step70Dir, "RESULTS.md"), `# Step 70 Results

${summary.totals.pass || 0} automated scenarios passed.

${summary.totals.blocked || 0} scenarios are blocked because this run did not have real microphone permission prompts, mobile hardware, or screen reader/browser combinations.

No real microphone, device, or screen-reader result is claimed here.
`);

write(path.join(step70Dir, "KNOWN_LIMITATIONS.md"), `# Known Limitations

Real microphone permission prompts, permission revocation, device disconnection, mobile hardware behavior, and screen reader announcement order require manual testing on target devices.

The local automated suite verifies policy logic, static integration, and privacy-safe payload rules.
`);

write(path.join(step69Dir, "STEP_70_MATRIX_APPENDIX.md"), `# Step 70 Matrix Appendix

Step 70 adds privacy, permission, and voice safety rows to the accessibility and language testing story.

${markdownTable(rows)}
`);

console.log(`Generated Step 70 voice safety matrix with ${rows.length} rows.`);
