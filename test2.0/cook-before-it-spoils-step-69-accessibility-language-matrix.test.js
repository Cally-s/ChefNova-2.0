const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const generator = require(path.join(root, "scripts/generate-step-69-accessibility-matrix.js"));
const recovery = require(path.join(root, "scripts/accessibility-recovery.js"));
const localization = require(path.join(root, "scripts/localization-service.js"));
const resilience = require(path.join(root, "scripts/offline-resilience.js"));
const review = require(path.join(root, "scripts/content-review-governance.js"));
const fixtures = require(path.join(root, "tests/fixtures/step-69-accessibility-fixtures.js"));

const docsRoot = path.join(root, "docs/accessibility/step-69");
const matrix = JSON.parse(fs.readFileSync(path.join(docsRoot, "TEST_MATRIX.json"), "utf8"));
const summary = JSON.parse(fs.readFileSync(path.join(docsRoot, "SUMMARY.json"), "utf8"));
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function count(result) {
  return matrix.filter((row) => row.result === result).length;
}

function byId(testId) {
  return matrix.find((row) => row.testId === testId);
}

function idsMatching(pattern) {
  return matrix.filter((row) => pattern.test(row.testId)).map((row) => row.testId);
}

(function run() {
  execFileSync(process.execPath, [path.join(root, "scripts/generate-step-69-accessibility-matrix.js")], { cwd: root, stdio: "pipe" });

  assert(matrix.length > 70, "Step 69 matrix contains a meaningful set of rows");
  assert.strictEqual(new Set(matrix.map((row) => row.testId)).size, matrix.length, "matrix test IDs are unique");
  assert.strictEqual(summary.totalRows, matrix.length, "summary total is generated from matrix rows");
  assert.strictEqual(summary.passedRows, count("pass"), "summary pass count matches matrix");
  assert.strictEqual(summary.failedRows, count("fail"), "summary fail count matches matrix");
  assert.strictEqual(summary.blockedRows, count("blocked"), "summary blocked count matches matrix");
  assert.strictEqual(summary.notRunRows, count("not-run"), "summary not-run count matches matrix");
  assert(summary.passPercentageIncludingBlocked < 100, "blocked and not-run rows are not counted as passing");
  assert(summary.manualTestsRemaining.length === count("blocked") + count("not-run"), "manual remaining includes blocked and not-run rows");

  for (const row of matrix) {
    assert(["not-run", "pass", "fail", "blocked", "not-applicable"].includes(row.result), `${row.testId} has a valid result`);
    assert(row.expectedResult, `${row.testId} records expected result`);
    assert(Array.isArray(row.evidenceReferences), `${row.testId} records evidence references`);
    if (row.result === "blocked") {
      assert(row.blockedReason.includes("Needed:"), `${row.testId} blocked reason states what is needed`);
      assert(row.blockedReason.includes("Release risk:"), `${row.testId} blocked reason states release risk`);
    }
    if (row.result === "not-run") assert(row.notes.includes("not a passing result"), `${row.testId} not-run row is explicit`);
  }

  assert.strictEqual(idsMatching(/^ALM-DISPLAY-/).length, 27, "all 27 display-matrix combinations are generated");
  assert(byId("ALM-DISPLAY-400-200-EXTRA"), "highest-risk display combination is present");
  assert.strictEqual(byId("ALM-DISPLAY-400-200-EXTRA").result, "pass", "highest-risk display configuration validates automatically");
  assert.strictEqual(byId("ALM-BROWSER-REAL-001").result, "blocked", "real browser evidence is not falsely marked as passed");
  assert.strictEqual(byId("ALM-DESKTOP-JAWS-001").result, "blocked", "JAWS is blocked when no licence/environment exists");
  assert.strictEqual(byId("ALM-MOBILE-VO-001").result, "blocked", "iPhone VoiceOver is blocked without a real device");
  assert.strictEqual(byId("ALM-LANGUAGE-ZH-001").result, "blocked", "Simplified Chinese human review is blocked without a fluent reviewer");
  assert.strictEqual(byId("ALM-COOKING-KB-001").result, "not-run", "keyboard-only E2E is not falsely marked as passed");

  const recipe = fixtures.step69RecipeFixture;
  assert.strictEqual(recipe.name, "Spinach and Mushroom Pasta", "required recipe fixture exists");
  assert(recipe.structuredIngredients.some((item) => item.ingredientId === "spinach" && item.canonicalQuantity.value === "200" && item.canonicalQuantity.unit === "g"), "fixture includes 200 g spinach");
  assert(recipe.structuredIngredients.some((item) => item.canonicalQuantity.value === "1.5" && item.canonicalQuantity.unit === "L"), "fixture includes decimal 1.5 L quantity");
  assert(recipe.reviewSteps.length >= 8, "fixture includes at least eight reviewed cooking steps");
  assert(JSON.stringify(recipe).includes("Heat to at least 74°C / 165°F"), "fixture includes required safety temperature");
  assert(recipe.media.videos.every((video) => video.captionTrack.status === "approved" && video.transcript.status === "approved"), "fixture video has approved captions and transcript");
  assert(recipe.translations.some((translation) => translation.targetLocale === "zh-CN" && translation.sourceVersion === 3 && translation.status === "outdated"), "fixture includes outdated translation version scenario");

  const zh = fixtures.languageBridgeFixture;
  assert.strictEqual(zh.expectedText, "快速翻炒（Sauté）洋葱，直到呈半透明（translucent）。", "required bilingual example is exact");
  assert(zh.spans.some((span) => span.text === "Sauté" && span.lang === "en-CA"), "English cooking term span is marked");
  assert(zh.spans.some((span) => span.text === "快速翻炒" && span.lang === "zh-CN"), "Chinese explanation span is marked");

  const frQuantity = localization.formatQuantity({ value: "1.5", unit: "L" }, { locale: "fr-CA", measurementSystem: "metric" });
  assert(frQuantity.display.includes("1,5"), "French decimal comma remains visible");
  assert.strictEqual(localization.parseLocalizedNumber("1,5", "fr-CA").value, "1.5", "French decimal comma parses to canonical value");
  assert(localization.formatQuantity({ value: "200", unit: "g" }, { locale: "en-CA", measurementSystem: "metric" }).display.includes("200"), "English metric displays 200 g");
  assert(localization.formatQuantity({ value: "200", unit: "g" }, { locale: "en-CA", measurementSystem: "imperial" }).display.toLowerCase().includes("approximately"), "Imperial converted quantity communicates approximation");

  const offlinePackage = resilience.createOfflineRecipePackage(recipe, { explanationLocale: "zh-CN" });
  assert(offlinePackage.recipeSnapshot.transcript, "offline recipe package contains transcript");
  assert(offlinePackage.recipeSnapshot.timerDefinitions.length >= 2, "offline recipe package contains timers");
  assert(offlinePackage.recipeSnapshot.safetyWarnings.length > 0, "offline recipe package contains safety warnings");
  assert(offlinePackage.recipeSnapshot.allergyWarnings.length > 0, "offline recipe package contains allergy warnings");

  const feedback = recovery.createFeedbackRecord(recovery.createFeedbackDraft({
    category: "voice-control-misunderstood",
    description: "Voice control misunderstood next step.",
    includeTechnicalDiagnostics: true
  }), {
    diagnostics: { appVersion: "test", routeTemplate: "recipes", pantry: "private pantry", token: "secret" }
  });
  assert(feedback.notIncluded.includes("pantry contents"), "feedback excludes pantry by default");
  assert(feedback.notIncluded.includes("allergy information"), "feedback excludes allergy data by default");
  assert(!JSON.stringify(feedback.included).includes("private pantry"), "feedback diagnostic allow-list excludes pantry content");
  assert(!JSON.stringify(feedback.included).includes("secret"), "feedback diagnostic allow-list excludes tokens");

  const inaccessibleVideoIssues = review.validateRecipePublication({ ...recipe, media: { images: [], videos: [{ id: "video-without-captions" }] } });
  assert(inaccessibleVideoIssues.some((issue) => issue.code === review.PUBLICATION_ISSUE_CODES.CAPTIONS_MISSING), "publication gate blocks video without captions");
  assert(inaccessibleVideoIssues.some((issue) => issue.code === review.PUBLICATION_ISSUE_CODES.TRANSCRIPT_MISSING), "publication gate blocks video without transcript");

  assert(app.includes("Language / Langue / 语言 / اللغة"), "language recovery text remains visible in Profile Settings or Accessibility Recovery");
  assert(html.includes("data-page-section=\"accessibility-recovery\""), "accessibility recovery page remains present");
  assert(!html.includes("user-scalable=no"), "pinch zoom is not blocked");
  assert(app.includes("handleRecoveryKeyboardShortcut"), "keyboard recovery shortcut remains present");
  assert(app.includes("closeDisplayPreviewModal()") && app.includes("closeAccessibilityFeedbackModal()"), "dialogs close from Escape handler");
  assert(css.includes("@media (prefers-reduced-motion: reduce)"), "reduced-motion CSS remains present");
  assert(css.includes("min-height: 48px"), "large-button touch target CSS remains present");

  const requiredDocs = [
    "TEST_PLAN.md",
    "TEST_MATRIX.csv",
    "TEST_MATRIX.json",
    "MANUAL_TEST_SCRIPTS.md",
    "SCREEN_READER_SCRIPTS.md",
    "MOBILE_TEST_SCRIPTS.md",
    "LANGUAGE_REVIEW_GUIDE.md",
    "USER_TESTING_PROTOCOL.md",
    "PRIVACY_AND_EVIDENCE_RULES.md",
    "DEFECT_TEMPLATE.md",
    "RESULTS.md",
    "KNOWN_LIMITATIONS.md",
    "TEST_MATRIX.md",
    "SUMMARY.json",
    "evidence/README.md"
  ];
  for (const file of requiredDocs) {
    const fullPath = path.join(docsRoot, file);
    assert(fs.existsSync(fullPath), `${file} exists`);
    assert(fs.statSync(fullPath).size > 100, `${file} is not an empty placeholder`);
  }
  assert(fs.existsSync(path.join(docsRoot, "evidence/desktop/local-node-static-checks.md")), "local evidence record exists");
  assert.strictEqual(generator.automatedRows().filter((row) => row.result === "fail").length, 0, "generator automated rows pass");

  console.log("Step 69 accessibility and language matrix tests passed.");
})();
