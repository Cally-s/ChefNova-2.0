#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const outputRoot = path.join(root, "docs/accessibility/step-69");
const evidenceRoot = path.join(outputRoot, "evidence");
const fixtures = require(path.join(root, "tests/fixtures/step-69-accessibility-fixtures.js"));
const localization = require(path.join(root, "scripts/localization-service.js"));
const recovery = require(path.join(root, "scripts/accessibility-recovery.js"));
const resilience = require(path.join(root, "scripts/offline-resilience.js"));
const review = require(path.join(root, "scripts/content-review-governance.js"));

const RESULT_VALUES = new Set(["not-run", "pass", "fail", "blocked", "not-applicable"]);
const DATE = new Date().toISOString();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function maybeGit(args, fallback) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

function hashFiles(files) {
  const hash = crypto.createHash("sha256");
  for (const file of files) hash.update(read(file));
  return hash.digest("hex").slice(0, 16);
}

const app = read("app.js");
const html = read("index.html");
const css = read("style.css");
const serviceWorker = read("service-worker.js");
const localBuildIdentifier = `local-static-${hashFiles(["index.html", "app.js", "style.css", "scripts/localization-service.js", "scripts/accessibility-recovery.js", "scripts/offline-resilience.js", "scripts/content-review-governance.js"])}`;
const appCommit = maybeGit(["rev-parse", "HEAD"], "not-a-git-repository");

function environment(overrides = {}) {
  return {
    testDate: DATE,
    applicationCommit: appCommit,
    applicationVersion: "Chef Nova static local app",
    deploymentOrBuild: localBuildIdentifier,
    operatingSystem: os.type(),
    operatingSystemVersion: os.release(),
    browser: "Node.js static analysis",
    browserVersion: process.version,
    deviceModel: `${os.platform()} ${os.arch()} local machine`,
    screenSize: "not-applicable",
    assistiveTechnology: "none",
    assistiveTechnologyVersion: "not-applicable",
    inputMethod: "automated-static",
    interfaceLocale: "en-CA",
    explanationLocale: "en-CA",
    cookingTermLocale: "en-CA",
    measurementSystem: "metric",
    direction: "ltr",
    browserZoomPercent: 100,
    chefNovaFontScalePercent: 100,
    textSpacing: "standard",
    contrastMode: "standard",
    reducedMotion: false,
    networkCondition: "online",
    orientation: "landscape",
    testerIdentifier: "codex-local-automation",
    ...overrides
  };
}

const env = environment();

function row(input) {
  const result = input.result || "not-run";
  if (!RESULT_VALUES.has(result)) throw new Error(`Invalid test result for ${input.testId}: ${result}`);
  if (result === "blocked" && !input.blockedReason) throw new Error(`Blocked row ${input.testId} needs blockedReason.`);
  if (result === "not-applicable" && !input.notes) throw new Error(`Not-applicable row ${input.testId} needs notes.`);
  return {
    testId: input.testId,
    featureArea: input.featureArea,
    scenario: input.scenario,
    riskLevel: input.riskLevel,
    platform: input.platform,
    operatingSystem: input.operatingSystem || env.operatingSystem,
    operatingSystemVersion: input.operatingSystemVersion || env.operatingSystemVersion,
    browser: input.browser || env.browser,
    browserVersion: input.browserVersion || env.browserVersion,
    deviceModel: input.deviceModel || env.deviceModel,
    assistiveTechnology: input.assistiveTechnology || env.assistiveTechnology,
    assistiveTechnologyVersion: input.assistiveTechnologyVersion || env.assistiveTechnologyVersion,
    inputMethods: input.inputMethods || ["keyboard"],
    interfaceLocale: input.interfaceLocale || "en-CA",
    explanationLocale: input.explanationLocale || input.interfaceLocale || "en-CA",
    cookingTermLocale: input.cookingTermLocale || input.interfaceLocale || "en-CA",
    direction: input.direction || "ltr",
    browserZoomPercent: input.browserZoomPercent,
    chefNovaFontScalePercent: input.chefNovaFontScalePercent,
    textSpacing: input.textSpacing,
    orientation: input.orientation,
    contrastMode: input.contrastMode,
    reducedMotion: input.reducedMotion,
    networkCondition: input.networkCondition,
    expectedResult: input.expectedResult,
    actualResult: input.actualResult || "",
    result,
    evidenceReferences: input.evidenceReferences || [],
    issueIds: input.issueIds || [],
    testerId: input.testerId || "codex-local-automation",
    testedAt: input.testedAt || (["pass", "fail"].includes(result) ? DATE : ""),
    notes: input.notes || "",
    blockedReason: input.blockedReason || ""
  };
}

function hasAll(text, values) {
  return values.every((value) => text.includes(value));
}

function duplicateIds(markup) {
  const counts = {};
  const re = /\sid=["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(markup))) counts[match[1]] = (counts[match[1]] || 0) + 1;
  return Object.entries(counts).filter(([, count]) => count > 1).map(([id]) => id);
}

function automatedRows() {
  const recipe = fixtures.step69RecipeFixture;
  const languageBridge = fixtures.languageBridgeFixture;
  const feedback = recovery.createFeedbackRecord(recovery.createFeedbackDraft({
    category: "translation-incorrect",
    description: "The French caption seems incorrect.",
    userImpact: "safety-concern",
    contentReference: { entityType: "translation-segment", entityId: recipe.id, entityVersion: 4, locale: "fr-CA", segmentId: "caption-1" }
  }), {
    route: "recipes",
    displaySettings: recovery.DISPLAY_DEFAULTS,
    languageSettings: { interfaceLocale: "en-CA", explanationLocale: "fr-CA", cookingTermLocale: "en-CA", measurementLocale: "en-CA" },
    diagnostics: { appVersion: "static-local", routeTemplate: "recipes", token: "should-not-appear", interfaceLocale: "en-CA" }
  });
  const publicationIssues = review.validateRecipePublication({
    ...recipe,
    media: { images: [], videos: [{ id: "video-without-captions" }] }
  });
  const offlinePackage = resilience.createOfflineRecipePackage(recipe, { explanationLocale: "zh-CN" });
  const displayValues = [100, 150, 200];
  const zoomValues = [100, 200, 400];
  const spacingValues = ["standard", "comfortable", "extra"];
  const displayRows = [];
  for (const zoom of zoomValues) {
    for (const font of displayValues) {
      for (const spacing of spacingValues) {
        const valid = recovery.validateDisplayPreferences({ fontScalePercent: font, lineSpacing: spacing, highContrastMode: "system", reducedMotionMode: "system" }).valid;
        displayRows.push(row({
          testId: `ALM-DISPLAY-${zoom}-${font}-${spacing.toUpperCase()}`,
          featureArea: "Display matrix",
          scenario: `Automated configuration check for browser zoom ${zoom}%, Chef Nova font ${font}%, text spacing ${spacing}.`,
          riskLevel: zoom === 400 || font === 200 || spacing === "extra" ? "high" : "medium",
          platform: "desktop",
          browserZoomPercent: zoom,
          chefNovaFontScalePercent: font,
          textSpacing: spacing,
          inputMethods: ["keyboard"],
          expectedResult: "Display setting values are valid, zoom is not blocked, and recovery CSS hooks exist.",
          actualResult: valid && !html.includes("user-scalable=no") && css.includes("--accessibility-font-scale") ? "Static configuration accepted. Manual visual inspection still required." : "Static display guard failed.",
          result: valid && !html.includes("user-scalable=no") && css.includes("--accessibility-font-scale") ? "pass" : "fail",
          evidenceReferences: ["evidence/display-matrix/README.md"],
          notes: "Automated static coverage only. This does not replace visual browser inspection."
        }));
      }
    }
  }
  const coreRows = [
    ["ALM-AUTO-LANDMARK-001", "Structure", "Main content, navigation, topbar, profile, and page sections exist.", hasAll(html, ["<main", "<nav", "data-page-section=\"recipes\"", "data-page-section=\"pantry\"", "data-page-section=\"accessibility-recovery\""])],
    ["ALM-AUTO-HEADING-001", "Structure", "Core pages expose headings for scanner and assistive-technology navigation.", /<h1|<h2/.test(html) && app.includes("Accessibility Recovery")],
    ["ALM-AUTO-DUPID-001", "Structure", "No duplicate IDs exist in static index markup.", duplicateIds(html).length === 0, duplicateIds(html).join(", ")],
    ["ALM-AUTO-ZOOM-001", "Display matrix", "Browser zoom and pinch zoom are not intentionally disabled.", !html.includes("user-scalable=no") && !html.includes("maximum-scale=1")],
    ["ALM-AUTO-RTL-001", "Language", "Arabic language change sets right-to-left direction.", recovery.applyLanguageChange(recovery.normalizePreferences(), recovery.createLanguageChangeTransaction({ interfaceLocale: "en-CA" }, { interfaceLocale: "ar" })).direction === "rtl"],
    ["ALM-AUTO-LANG-ZH-001", "Language Bridge", "Simplified Chinese Language Bridge sample keeps English cooking terms associated.", languageBridge.expectedText.includes("快速翻炒") && languageBridge.expectedText.includes("Sauté") && languageBridge.spans.some((span) => span.lang === "zh-CN") && languageBridge.spans.some((span) => span.lang === "en-CA")],
    ["ALM-AUTO-FR-DECIMAL-001", "Measurement localization", "French decimal comma display and parsing preserve canonical 1.5 L value.", localization.formatQuantity({ value: "1.5", unit: "L" }, { locale: "fr-CA", measurementSystem: "metric" }).display.includes("1,5") && localization.parseLocalizedNumber("1,5", "fr-CA").value === "1.5"],
    ["ALM-AUTO-TEMP-001", "Food safety", "Safety temperature remains 74°C / 165°F and is not rounded down.", JSON.stringify(recipe).includes("74°C / 165°F")],
    ["ALM-AUTO-OFFLINE-001", "Offline cooking", "Offline package includes transcript, warnings, steps, timers, and ingredients.", offlinePackage.recipeSnapshot?.transcript && offlinePackage.recipeSnapshot?.allergyWarnings?.length && offlinePackage.recipeSnapshot?.safetyWarnings?.length && offlinePackage.recipeSnapshot?.timerDefinitions?.length],
    ["ALM-AUTO-VIDEO-001", "Instructional video", "Fixture video has reviewed captions, reviewed transcript, and visual description.", recipe.media.videos.every((video) => video.captionTrack?.status === "approved" && video.transcript?.status === "approved" && video.visualDescription)],
    ["ALM-AUTO-PUBLISH-001", "Content review", "Publication gate blocks inaccessible media.", publicationIssues.some((issue) => issue.code === review.PUBLICATION_ISSUE_CODES.CAPTIONS_MISSING)],
    ["ALM-AUTO-RECOVERY-001", "Accessibility Recovery", "Restore Display Defaults preserves non-display preference domains.", recovery.restoreDisplayDefaults({ ...recovery.normalizePreferences({ language: { interfaceLocale: "fr-CA" } }), pantry: [{ id: "spinach" }], mealPlans: { Monday: "Pasta" } }).language.interfaceLocale === "fr-CA"],
    ["ALM-AUTO-CORRUPT-001", "Accessibility Recovery", "Corrupted display settings recover to defaults.", recovery.normalizeDisplayPreferences({ fontScalePercent: -20 }).fontScalePercent === 100],
    ["ALM-AUTO-FEEDBACK-001", "Feedback privacy", "Feedback payload excludes private cooking data and tokens by default.", feedback.notIncluded.includes("pantry contents") && feedback.notIncluded.includes("allergy information") && !JSON.stringify(feedback.included).includes("should-not-appear")],
    ["ALM-AUTO-SPEECH-001", "Speech Pantry", "Speech Pantry fixture remains editable and requires can-size confirmation.", fixtures.speechPantryFixture.expectedEditableInterpretation.autoSaveAllowed === false && fixtures.speechPantryFixture.expectedEditableInterpretation.canSizeStatus === "confirmation-required"],
    ["ALM-AUTO-REDUCED-MOTION-001", "Reduced motion", "Reduced-motion CSS disables nonessential movement.", css.includes("@media (prefers-reduced-motion: reduce)") && css.includes(".reduced-motion-mode *")],
    ["ALM-AUTO-FOCUS-001", "Keyboard and focus", "Enhanced focus styling is present for recovery, preview, and feedback dialogs.", hasAll(css, [":focus-visible", ".display-preview-modal :focus-visible", ".accessibility-feedback-modal :focus-visible"])],
    ["ALM-AUTO-DIALOG-001", "Dialogs", "Escape handling includes display preview, feedback modal, and language recovery failure dialog.", hasAll(app, ["closeDisplayPreviewModal()", "closeAccessibilityFeedbackModal()", "closeLanguageFailureMessage()"])],
    ["ALM-AUTO-LIVE-001", "Announcements", "Recovery, language, and feedback actions use live announcements or toast/status messages.", hasAll(app, ["announcePolite", "display-settings-restored", "language-changed", "accessibility-feedback-submitted"])],
    ["ALM-AUTO-HIDDEN-001", "ARIA hygiene", "Static app avoids focusable buttons inside aria-hidden modals by pairing hidden attributes/classes.", hasAll(html, ["hidden aria-hidden=\"true\"", "guestUpgradeModal", "nutritionConfirmModal"])],
    ["ALM-AUTO-SW-001", "Offline cooking", "Service worker and offline resilience script are present.", serviceWorker.includes("install") && app.includes("loadOfflineResiliencePreferences")],
    ["ALM-AUTO-FALLBACK-001", "Feature fallback", "Translation, speech, media, and offline fallback panels include accessibility feedback entry points.", hasAll(app, ["showFeatureFallback", "Report an Accessibility or Language Problem", "captions-or-transcript-missing", "voice-control-misunderstood"])],
    ["ALM-AUTO-OUTDATED-001", "Content review", "Outdated translations are represented as outdated, not approved.", recipe.translations.some((translation) => translation.targetLocale === "zh-CN" && translation.sourceVersion === 3 && translation.status === "outdated")],
    ["ALM-AUTO-ALLERGY-001", "Allergy warnings", "Allergy warnings include visible text and are present in offline recipe data.", recipe.allergyWarnings.length > 0 && offlinePackage.recipeSnapshot?.allergyWarnings?.length > 0],
    ["ALM-AUTO-TOUCH-TARGET-001", "Touch targets", "Large-button recovery mode raises minimum control height.", css.includes("min-height: 48px")],
    ["ALM-AUTO-LOW-BANDWIDTH-001", "Low-Bandwidth Mode", "Low-bandwidth preferences prevent video autoplay and prefer transcript.", resilience.normalizeLowBandwidthPreferences({ enabled: true }).autoplayVideo === false && resilience.normalizeLowBandwidthPreferences({ enabled: true }).preferTranscript === true],
    ["ALM-AUTO-LANGUAGE-ROLLBACK-001", "Language Recovery", "Failed language transaction rolls back and preserves cooking snapshot.", recovery.applyLanguageChange(recovery.normalizePreferences(), recovery.createLanguageChangeTransaction({ interfaceLocale: "en-CA" }, { interfaceLocale: "fr-CA" }, { recipeId: recipe.id, currentStepId: "step-4", activeTimerIds: ["timer-1"] }), { forceFailure: true }).restoredSnapshot.currentStepId === "step-4"]
  ];
  return coreRows.map(([testId, featureArea, scenario, ok, detail]) => row({
    testId,
    featureArea,
    scenario,
    riskLevel: ["Food safety", "Allergy warnings", "Accessibility Recovery", "Language Recovery", "Feedback privacy"].includes(featureArea) ? "critical" : "high",
    platform: "desktop",
    inputMethods: ["keyboard"],
    expectedResult: "Automated local check passes.",
    actualResult: ok ? "Automated local check passed." : `Automated local check failed. ${detail || ""}`.trim(),
    result: ok ? "pass" : "fail",
    evidenceReferences: ["evidence/desktop/local-node-static-checks.md"]
  })).concat(displayRows);
}

function blockedRows() {
  const rows = [];
  const missingEnv = {
    windows: "No Windows machine, browser extension session, NVDA installation, JAWS licence, or Windows forced-colour environment was available in this Codex workspace.",
    macVoiceOver: "This workspace did not expose controllable macOS VoiceOver output or a documented screen-reader audio/transcript capture path.",
    iphone: "No physical iPhone was available to this Codex session.",
    android: "No physical Android device was available to this Codex session.",
    fluent: "No fluent human reviewer was available in this Codex session.",
    userTesting: "No recruited representative participant sessions were available in this Codex session.",
    browser: "No controllable real browser test stack returned usable operation documentation in this session; static Node checks were executed instead."
  };
  const screenReaderCombos = [
    ["ALM-DESKTOP-NVDA-001", "Windows", "current stable", "Firefox", "current stable", "NVDA", "current stable", missingEnv.windows],
    ["ALM-DESKTOP-NVDA-002", "Windows", "current stable", "Chrome", "current stable", "NVDA", "current stable", missingEnv.windows],
    ["ALM-DESKTOP-JAWS-001", "Windows", "current stable", "Microsoft Edge", "current stable", "JAWS", "licensed current stable", missingEnv.windows],
    ["ALM-DESKTOP-VO-001", "macOS", "current stable", "Safari", "current stable", "VoiceOver", "current OS bundled", missingEnv.macVoiceOver],
    ["ALM-MOBILE-VO-001", "iOS", "current stable", "Safari", "current stable", "VoiceOver", "current OS bundled", missingEnv.iphone],
    ["ALM-MOBILE-TB-001", "Android", "current stable", "Chrome", "current stable", "TalkBack", "current stable", missingEnv.android]
  ];
  for (const [testId, osName, osVersion, browser, browserVersion, at, atVersion, reason] of screenReaderCombos) {
    rows.push(row({
      testId,
      featureArea: "Screen-reader cooking",
      scenario: `Complete cooking workflow with ${at} and ${browser}.`,
      riskLevel: "critical",
      platform: testId.includes("MOBILE") ? "mobile" : "desktop",
      operatingSystem: osName,
      operatingSystemVersion: osVersion,
      browser,
      browserVersion,
      assistiveTechnology: at,
      assistiveTechnologyVersion: atVersion,
      inputMethods: ["screen-reader", testId.includes("MOBILE") ? "touch-exploration" : "keyboard"],
      expectedResult: "Screen-reader user can complete the cooking workflow and hear critical recipe, timer, allergy, and safety information.",
      result: "blocked",
      blockedReason: `${reason} Needed: real ${osName} environment, ${browser}, ${at}, trained tester, screen-reader output notes, and evidence capture. Release risk: mandatory screen-reader coverage remains unresolved.`,
      evidenceReferences: ["evidence/screen-readers/README.md"]
    }));
  }
  const languageReviews = [
    ["ALM-LANGUAGE-FR-001", "French localization", "fr-CA", "ltr"],
    ["ALM-LANGUAGE-ZH-001", "Simplified Chinese Language Bridge", "zh-CN", "ltr"],
    ["ALM-RTL-AR-001", "Arabic right-to-left", "ar", "rtl"]
  ];
  for (const [testId, featureArea, locale, direction] of languageReviews) {
    rows.push(row({
      testId,
      featureArea,
      scenario: `Human fluent review for ${locale}.`,
      riskLevel: "critical",
      platform: "desktop",
      interfaceLocale: locale === "zh-CN" ? "en-CA" : locale,
      explanationLocale: locale,
      cookingTermLocale: locale === "zh-CN" ? "en-CA" : locale,
      direction,
      inputMethods: ["keyboard", "mouse"],
      expectedResult: "Fluent reviewer confirms interface, recipe, cooking terms, quantities, warnings, captions, and recovery text.",
      result: "blocked",
      blockedReason: `${missingEnv.fluent} Needed: qualified ${locale} reviewer, reviewed strings, screenshots or notes, and sign-off. Release risk: language quality cannot be considered approved.`,
      evidenceReferences: ["evidence/languages/README.md"]
    }));
  }
  const deviceRows = [
    ["ALM-MOBILE-IPHONE-ORIENTATION-001", "Mobile orientation", "iPhone Safari portrait and landscape with on-screen keyboard.", "iOS", "Safari", missingEnv.iphone],
    ["ALM-MOBILE-ANDROID-ORIENTATION-001", "Mobile orientation", "Android Chrome portrait and landscape with on-screen keyboard.", "Android", "Chrome", missingEnv.android],
    ["ALM-MOBILE-IPHONE-DICTATION-001", "Speech Pantry", "iPhone dictation for Two cans of tomatoes in the pantry.", "iOS", "Safari", missingEnv.iphone],
    ["ALM-MOBILE-ANDROID-VOICE-001", "Speech Pantry", "Android voice input for Two cans of tomatoes in the pantry.", "Android", "Chrome", missingEnv.android]
  ];
  for (const [testId, featureArea, scenario, osName, browser, reason] of deviceRows) {
    rows.push(row({
      testId,
      featureArea,
      scenario,
      riskLevel: "high",
      platform: "mobile",
      operatingSystem: osName,
      operatingSystemVersion: "current stable",
      browser,
      browserVersion: "current stable",
      inputMethods: ["touch", "speech-input"],
      expectedResult: "Real mobile workflow remains usable with orientation changes, zoom, keyboard, and voice input.",
      result: "blocked",
      blockedReason: `${reason} Needed: physical ${osName} device, browser, tester, and evidence. Release risk: mobile assistive and keyboard behavior remains unresolved.`,
      evidenceReferences: ["evidence/mobile/README.md"]
    }));
  }
  const manualNotRun = [
    ["ALM-COOKING-KB-001", "Keyboard-only cooking", "Complete recipe selection, one-instruction mode, timer controls, language bridge, meal outcome, and return to recipe without pointer.", "critical"],
    ["ALM-OFFLINE-E2E-001", "Offline cooking", "Complete a downloaded recipe with network disabled, timers, transcript, display settings, recovery, and outcome confirmation.", "critical"],
    ["ALM-LOW-BANDWIDTH-E2E-001", "Low-Bandwidth Mode", "Complete recipe flow under constrained connection with text-first loading and transcript fallback.", "high"],
    ["ALM-ALLERGY-MATRIX-001", "Allergy warnings", "Verify same allergy warning across colour, monochrome, high contrast, screen reader, zoom, locales, offline, and low bandwidth.", "critical"],
    ["ALM-VIDEO-MATRIX-001", "Instructional video", "Verify captions, transcript, controls, fallbacks, zoom, reduced motion, and multiple languages.", "high"],
    ["ALM-TIMER-MATRIX-001", "Timer accessibility", "Verify timer label, start, pause, resume, add time, stop, completion, reload, offline, and language switching.", "critical"],
    ["ALM-FEEDBACK-CATEGORIES-001", "Feedback privacy", "Submit all feedback categories and inspect actual queued records or outgoing payloads.", "high"],
    ["ALM-USER-TESTING-001", "Representative user testing", "Run moderated or unmoderated tasks with representative access modes and language needs.", "critical"]
  ];
  for (const [testId, featureArea, scenario, riskLevel] of manualNotRun) {
    rows.push(row({
      testId,
      featureArea,
      scenario,
      riskLevel,
      platform: "desktop",
      inputMethods: ["keyboard", "mouse"],
      expectedResult: "Manual test evidence confirms task completion and barriers.",
      result: "not-run",
      notes: `Not run in this Codex session. Handoff script is documented in MANUAL_TEST_SCRIPTS.md and related guides. This is not a passing result.`,
      evidenceReferences: ["evidence/README.md"]
    }));
  }
  rows.push(row({
    testId: "ALM-BROWSER-REAL-001",
    featureArea: "Browser smoke",
    scenario: "Real in-app browser smoke test with console and keyboard checks.",
    riskLevel: "high",
    platform: "desktop",
    browser: "In-app browser",
    browserVersion: "unavailable",
    inputMethods: ["keyboard", "mouse"],
    expectedResult: "Browser opens index.html, app loads without console errors, and recovery controls operate.",
    result: "blocked",
    blockedReason: `${missingEnv.browser} Needed: functioning browser-control session with console access or a human browser tester. Release risk: browser execution evidence remains incomplete.`,
    evidenceReferences: ["evidence/desktop/README.md"]
  }));
  return rows;
}

function summarize(rows) {
  const counts = { pass: 0, fail: 0, blocked: 0, "not-run": 0, "not-applicable": 0 };
  for (const item of rows) counts[item.result] += 1;
  const by = (field) => rows.reduce((acc, item) => {
    const value = Array.isArray(item[field]) ? item[field].join("+") : item[field] || "Unspecified";
    acc[value] = acc[value] || { total: 0, pass: 0, fail: 0, blocked: 0, "not-run": 0, "not-applicable": 0 };
    acc[value].total += 1;
    acc[value][item.result] += 1;
    return acc;
  }, {});
  const passed = counts.pass;
  const total = rows.length;
  const executable = total - counts.blocked - counts["not-run"] - counts["not-applicable"];
  return {
    generatedAt: DATE,
    applicationCommit: appCommit,
    applicationVersion: env.applicationVersion,
    deploymentOrBuild: localBuildIdentifier,
    totalRows: total,
    passedRows: counts.pass,
    failedRows: counts.fail,
    blockedRows: counts.blocked,
    notRunRows: counts["not-run"],
    notApplicableRows: counts["not-applicable"],
    passPercentageIncludingBlocked: total ? Number(((passed / total) * 100).toFixed(2)) : 0,
    passPercentageExcludingBlockedNotRunAndNotApplicable: executable ? Number(((passed / executable) * 100).toFixed(2)) : 0,
    byBrowser: by("browser"),
    byAssistiveTechnology: by("assistiveTechnology"),
    byLocale: by("interfaceLocale"),
    byFeature: by("featureArea"),
    bySeverity: by("riskLevel"),
    byDeviceType: by("platform"),
    openDefects: rows.filter((item) => item.result === "fail").map((item) => item.testId),
    retestsRequired: rows.filter((item) => item.result === "fail").map((item) => item.testId),
    manualTestsRemaining: rows.filter((item) => item.result === "blocked" || item.result === "not-run").map((item) => item.testId),
    userTestingSessionsCompleted: 0
  };
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeJson(file, value) {
  fs.writeFileSync(path.join(outputRoot, file), `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.writeFileSync(path.join(outputRoot, file), value.trimStart());
}

function tableFromRows(rows, fields) {
  return [`| ${fields.join(" | ")} |`, `| ${fields.map(() => "---").join(" | ")} |`]
    .concat(rows.map((item) => `| ${fields.map((field) => String(Array.isArray(item[field]) ? item[field].join(", ") : item[field] ?? "").replace(/\|/g, "\\|")).join(" | ")} |`))
    .join("\n");
}

function docs(summary, rows) {
  const blocked = rows.filter((item) => item.result === "blocked");
  const notRun = rows.filter((item) => item.result === "not-run");
  return {
    "TEST_PLAN.md": `# Step 69 Accessibility and Language Test Plan

## Scope

This plan covers Chef Nova accessibility, language, display, offline, recovery, and feedback testing for Step 69.

## Local Execution

The current repository is a static HTML/CSS/JavaScript app. Existing automated tests use Node and static/module assertions. Step 69 adds automated checks using the same stack.

## No-False-Pass Rule

Automated checks are reported separately from real browser, real device, real screen-reader, fluent reviewer, and user-testing evidence. Blocked and not-run rows are not counted as passing.

## Required Workflow

1. Run "node scripts/generate-step-69-accessibility-matrix.js".
2. Run "node tests/cook-before-it-spoils-step-69-accessibility-language-matrix.test.js".
3. Run focused Step 65-68 regression tests.
4. Run the full local test folder.
5. Execute manual scripts in real environments.
6. Update "TEST_MATRIX.json" and "TEST_MATRIX.csv" with real evidence and retest results.

## Synthetic Test Data

Use only the synthetic fixtures in "tests/fixtures/step-69-accessibility-fixtures.js". Do not use real pantry, allergy, health, budget, Waste Diary, voice, or participant data.`,

    "MANUAL_TEST_SCRIPTS.md": `# Step 69 Manual Test Scripts

## Keyboard-Only Cooking

Run on a real browser with the keyboard only. Record browser name and version.

1. Open "index.html".
2. Reach recipe search or recipe selection.
3. Select Spinach and Mushroom Pasta.
4. Review title, ingredients, quantities, allergy warnings, and safety warnings.
5. Enter one-instruction mode.
6. Start, pause, resume, and adjust a timer where supported.
7. Move next and previous.
8. Open and close a technique explanation.
9. Open Language Bridge and return without losing progress.
10. Finish all steps, confirm outcome, and return to the recipe or meal plan.

Fail if any required control needs a pointer.

## Display Recovery

Set browser zoom to 400%, Chef Nova font to 200%, text spacing to Extra, and large buttons to On. Confirm Accessibility Recovery opens and Restore Display Defaults is reachable by keyboard.

## Offline Cooking

Disable the network after downloading the recipe package. Complete the recipe with transcript, timers, warnings, and recovery controls.`,

    "SCREEN_READER_SCRIPTS.md": `# Step 69 Screen-Reader Scripts

Do not substitute DOM inspection for real screen-reader output.

## Required Combinations

- NVDA + Firefox on Windows
- NVDA + Chrome on Windows
- JAWS + Microsoft Edge on Windows
- VoiceOver + Safari on macOS
- VoiceOver + Safari on iPhone
- TalkBack + Chrome on Android

## Critical Announcements To Record

- Recipe title as main heading
- Step number and current instruction
- Ingredient quantity association
- Allergy warning
- Safety warning and 74°C / 165°F temperature
- Timer start, paused, resumed, and completed states
- Dialog title and purpose
- Language change status
- Offline status
- Feedback review included/excluded data`,

    "MOBILE_TEST_SCRIPTS.md": `# Step 69 Mobile Test Scripts

Use real devices. Browser emulation can supplement but cannot replace these rows.

## iPhone

Test Safari with VoiceOver, portrait, landscape, pinch zoom, on-screen keyboard, dictation, reduced motion, increased contrast, and touch exploration.

## Android

Test Chrome with TalkBack, portrait, landscape, system font scaling, voice input, high contrast or enhanced visibility, and touch exploration.

Record device model, operating-system version, browser version, assistive-technology version, and evidence.`,

    "LANGUAGE_REVIEW_GUIDE.md": `# Step 69 Language Review Guide

Use fluent human reviewers.

## fr-CA

Check Canadian French interface terms, decimal commas, dates, times, singular/plural units, allergy warnings, captions, transcript labels, and safety temperature equivalence.

## zh-CN Language Bridge

Check: 快速翻炒（Sauté）洋葱，直到呈半透明（translucent）。

Confirm Chinese explanations and English cooking terms remain associated.

## Arabic

Check right-to-left layout, reading order, focus order, quantities, Latin units, safety temperature output, captions, dialogs, and recovery controls.`,

    "USER_TESTING_PROTOCOL.md": `# Step 69 User Testing Protocol

Use synthetic data only. Do not ask participants to disclose diagnoses.

## Consent

Explain the purpose, what will be recorded, how evidence is stored, and that participants may stop at any time.

## Tasks

1. Find and start Spinach and Mushroom Pasta.
2. Complete cooking steps and timers.
3. Use the Simplified Chinese Language Bridge.
4. Preview, undo, and restore display settings.
5. Change language during cooking.
6. Cook offline.
7. Report a translation or transcript problem.

Record barriers, assistance, navigation errors, misunderstandings, and approved quotes only.`,

    "PRIVACY_AND_EVIDENCE_RULES.md": `# Step 69 Privacy and Evidence Rules

## Allowed In Repository

- Synthetic screenshots
- Redacted console logs
- Test matrix files
- Accessibility-tree snapshots without private user data
- Manual notes without participant identity

## Restricted External Evidence

- Screen recordings with participant voices
- Raw screen-reader audio
- Device photos containing personal data
- User-testing recordings

Do not include real pantry, allergy, health, budget, shopping, Waste Diary, raw voice, account token, or participant identity data.`,

    "DEFECT_TEMPLATE.md": `# Step 69 Defect Template

Issue title:

Severity:

Affected requirement:

Test ID:

Application version:

Environment:
- Device:
- Operating system:
- Browser:
- Assistive technology:
- Locale:
- Zoom:
- Chef Nova font size:
- Text spacing:
- Contrast mode:
- Network state:

Preconditions:

Steps to reproduce:

Expected result:

Actual result:

User impact:

Safety impact:

Evidence:

Suggested area to investigate:

Regression test required:

Retest status:`,

    "KNOWN_LIMITATIONS.md": `# Step 69 Known Limitations

## Required testing not completed

${blocked.map((item) => `### ${item.testId}: ${item.scenario}\n\n${item.blockedReason}`).join("\n\n")}

## Required manual rows not run

${notRun.map((item) => `- ${item.testId}: ${item.scenario}`).join("\n")}

These rows are not considered passed.`,

    "RESULTS.md": `# Step 69 Results

## Summary

- Generated at: ${summary.generatedAt}
- Application commit: ${summary.applicationCommit}
- Application version: ${summary.applicationVersion}
- Build: ${summary.deploymentOrBuild}
- Total rows: ${summary.totalRows}
- Passed: ${summary.passedRows}
- Failed: ${summary.failedRows}
- Blocked: ${summary.blockedRows}
- Not run: ${summary.notRunRows}
- Not applicable: ${summary.notApplicableRows}
- Pass percentage including blocked/not-run rows: ${summary.passPercentageIncludingBlocked}%
- Pass percentage excluding blocked/not-run/not-applicable rows: ${summary.passPercentageExcludingBlockedNotRunAndNotApplicable}%
- User-testing sessions completed: ${summary.userTestingSessionsCompleted}

## Result By Feature

${tableFromRows(Object.entries(summary.byFeature).map(([featureArea, counts]) => ({ featureArea, ...counts })), ["featureArea", "total", "pass", "fail", "blocked", "not-run", "not-applicable"])}

## Result By Browser

${tableFromRows(Object.entries(summary.byBrowser).map(([browser, counts]) => ({ browser, ...counts })), ["browser", "total", "pass", "fail", "blocked", "not-run", "not-applicable"])}

## Required Testing Not Completed

${blocked.map((item) => `- ${item.testId}: ${item.blockedReason}`).join("\n")}

## Manual Tests Remaining

${notRun.map((item) => `- ${item.testId}: ${item.notes}`).join("\n")}

## Release Recommendation

Do not claim the complete accessibility and language matrix has passed. Automated local checks passed where listed, but required real browser, screen-reader, mobile, fluent-reviewer, and user-testing evidence is incomplete.`,

    "TEST_MATRIX.md": `# Step 69 Human-Readable Test Matrix

${tableFromRows(rows, ["testId", "featureArea", "scenario", "riskLevel", "platform", "browser", "assistiveTechnology", "interfaceLocale", "result", "blockedReason", "notes"])}`,

    "evidence/README.md": `# Step 69 Evidence README

## Naming

Use: "TEST-ID_short-description_YYYY-MM-DD.ext"

## Privacy

Do not store private user data, real allergies, pantry contents, budget data, Waste Diary data, raw voice audio, account tokens, or participant identity in this repository.

## Subfolders

- desktop
- mobile
- screen-readers
- languages
- display-matrix
- offline
- video
- user-testing
- defects

Synthetic evidence may be committed. Participant recordings and raw assistive-technology recordings must be stored in a secure external system.`
  };
}

function writeEvidenceReadmes() {
  const dirs = ["desktop", "mobile", "screen-readers", "languages", "display-matrix", "offline", "video", "user-testing", "defects"];
  for (const dir of dirs) {
    const target = path.join(evidenceRoot, dir, "README.md");
    if (!fs.existsSync(target)) {
      fs.writeFileSync(target, `# ${dir} evidence\n\nStore Step 69 ${dir} evidence here when it contains no private user data. Use secure external storage for restricted recordings or participant information.\n`);
    }
  }
  fs.writeFileSync(path.join(evidenceRoot, "desktop/local-node-static-checks.md"), `# Local Node Static Checks\n\nGenerated: ${DATE}\n\nEnvironment:\n\n- OS: ${env.operatingSystem} ${env.operatingSystemVersion}\n- Runtime: ${env.browser} ${env.browserVersion}\n- Build: ${localBuildIdentifier}\n\nThese checks inspect static files and module behavior. They do not prove real browser, screen-reader, mobile-device, or fluent-language-review results.\n`);
}

function main() {
  fs.mkdirSync(outputRoot, { recursive: true });
  fs.mkdirSync(evidenceRoot, { recursive: true });
  for (const dir of ["desktop", "mobile", "screen-readers", "languages", "display-matrix", "offline", "video", "user-testing", "defects"]) fs.mkdirSync(path.join(evidenceRoot, dir), { recursive: true });
  const rows = automatedRows().concat(blockedRows());
  const ids = new Set();
  for (const item of rows) {
    if (ids.has(item.testId)) throw new Error(`Duplicate testId ${item.testId}`);
    ids.add(item.testId);
  }
  const summary = summarize(rows);
  writeJson("TEST_MATRIX.json", rows);
  writeJson("SUMMARY.json", summary);
  const columns = Object.keys(rows[0]);
  fs.writeFileSync(path.join(outputRoot, "TEST_MATRIX.csv"), `${columns.join(",")}\n${rows.map((item) => columns.map((column) => csvEscape(item[column])).join(",")).join("\n")}\n`);
  for (const [file, content] of Object.entries(docs(summary, rows))) writeText(file, content);
  writeEvidenceReadmes();
  nodeLog(`Step 69 matrix generated: ${summary.passedRows}/${summary.totalRows} passed, ${summary.blockedRows} blocked, ${summary.notRunRows} not run.`);
}

function nodeLog(message) {
  process.stdout.write(`${message}\n`);
}

if (require.main === module) main();

module.exports = { automatedRows, blockedRows, summarize, environment };
