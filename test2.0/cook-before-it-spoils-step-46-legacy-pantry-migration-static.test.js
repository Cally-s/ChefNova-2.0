const fs = require("fs");
const assert = require("assert");

const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const report = fs.readFileSync("docs/cook-before-it-spoils-step-46-report.md", "utf8");

function includes(source, snippet, message) {
  assert(source.includes(snippet), message || `Missing snippet: ${snippet}`);
}

[
  "const PANTRY_LEGACY_MIGRATION_POLICY_VERSION = 1",
  "const PANTRY_MIGRATION_BACKUP_SCHEMA_VERSION = 1",
  "const PANTRY_MIGRATION_STATUSES = Object.freeze",
  "MIGRATED_NEEDS_CONFIRMATION: \"migrated-needs-confirmation\"",
  "CONFLICT_REVIEW_REQUIRED: \"conflict-review-required\"",
  "INVALID_DATA_REVIEW_REQUIRED: \"invalid-data-review-required\"",
  "ROLLED_BACK: \"rolled-back\"",
  "const DATE_INFORMATION_CONFIDENCE = Object.freeze",
  "NEEDS_CONFIRMATION: \"needs-confirmation\"",
  "AMBIGUOUS: \"ambiguous\"",
  "INVALID: \"invalid\"",
  "const DATE_INFORMATION_PROVENANCE = Object.freeze",
  "LEGACY_DATA: \"legacy-data\"",
  "MIGRATION: \"migration\"",
  "const LEGACY_DATE_PARSE_STATUSES = Object.freeze"
].forEach((snippet) => includes(app, snippet, `Missing migration constant: ${snippet}`));

[
  "function findLegacyDateField",
  "function isLegacyPantryRecord",
  "function normalizeLegacyDateValue",
  "function getLegacyMigrationStatusForParse",
  "function createLegacyMigrationEvidence",
  "function createLegacyDataSnapshot",
  "function migrateLegacyPantryDateRecords",
  "legacy-expiry-date-mapped-to-unknown",
  "dateType: FOOD_DATE_TYPES.UNKNOWN",
  "source: FOOD_DATE_SOURCES.LEGACY_UNCLASSIFIED",
  "confirmationStatus: FOOD_DATE_CONFIRMATION_STATUSES.NEEDS_CONFIRMATION",
  "valueProvenance: { source: DATE_INFORMATION_PROVENANCE.LEGACY_DATA",
  "typeProvenance: { source: DATE_INFORMATION_PROVENANCE.MIGRATION",
  "enteredBy: DATE_INFORMATION_PROVENANCE.LEGACY_DATA",
  "confidence: parseResult.parseStatus === LEGACY_DATE_PARSE_STATUSES.AMBIGUOUS ? DATE_INFORMATION_CONFIDENCE.AMBIGUOUS"
].forEach((snippet) => includes(app, snippet, `Missing conservative migration behavior: ${snippet}`));

[
  "originalRecord",
  "originalRecordHash",
  "originalRawDateValue",
  "originalFields",
  "rawValue",
  "precision",
  "parseStatus",
  "migrationEvidence",
  "legacyData",
  "preservationStatus: \"preserved\"",
  "sourceRecordIndex"
].forEach((snippet) => includes(app, snippet, `Missing evidence preservation snippet: ${snippet}`));

[
  "function getPantryMigrationStorageArtifacts",
  "function createPantryMigrationBackupPayload",
  "function hasPendingLegacyPantryMigration",
  "function commitPantryLegacyMigrationIfNeeded",
  "sourceChecksum: createStableHash(rawPayload)",
  "storage.setItem(artifacts.backupKey",
  "storage.setItem(artifacts.tempKey",
  "storage.setItem(config.key, normalizedText)",
  "storage.removeItem(artifacts.lockKey)",
  "PANTRY_MIGRATION_STATUSES.ROLLED_BACK",
  "Storage is full. Pantry migration was rolled back."
].forEach((snippet) => includes(app, snippet, `Missing storage safety snippet: ${snippet}`));

[
  "function createLegacyDateReviewModel",
  "function renderLegacyDateReviewNotice",
  "function renderLegacyPantryMigrationSummary",
  "function getLegacyDateReviewQueue",
  "function keepLegacyDateReviewForLater",
  "function focusFirstLegacyDateReview",
  "DATE TYPE NEEDS CONFIRMATION",
  "DATE NEEDS CONFIRMATION",
  "SAVED DATE NEEDS REVIEW",
  "RECORDED LEGACY DATE HAS PASSED",
  "Chef Nova has not treated this date as an expiration date.",
  "Records deleted: 0. No date was automatically treated as a true expiration date.",
  "data-legacy-date-review-later",
  "data-legacy-date-review-focus"
].forEach((snippet) => includes(app, snippet, `Missing review UI snippet: ${snippet}`));

const migrationBlock = app.match(/function migrateLegacyPantryDateRecords[\s\S]*?\n  function normalizePantryEnum/);
assert(migrationBlock, "Could not locate legacy migration block.");
assert(!/dateType:\s*FOOD_DATE_TYPES\.EXPIRATION|source:\s*FOOD_DATE_SOURCES\.EXPIRATION_PACKAGE_LABEL/.test(migrationBlock[0]), "Legacy migration must not convert old dates directly into active expiration dates.");
assert(!/resolveCanonicalIngredientName/.test(migrationBlock[0]), "Legacy migration must not auto-assign ingredient identity from legacy names.");
assert(!/recordImpact|buildImpactLedger|DISCARDED|WASTE_RECORDED/.test(migrationBlock[0]), "Legacy migration must not create impact or discard records.");

const normalizeBlock = app.match(/function normalizePantryItem\(item\) \{[\s\S]*?\n  function dedupeFoodDateRecords/);
assert(normalizeBlock, "Could not locate normalizePantryItem block.");
includes(normalizeBlock[0], "legacyRecord ? { status: \"needs-review\", ingredientId: null", "Legacy ingredient identity should require review.");
includes(normalizeBlock[0], "freshnessDate: legacyRecord ? \"\" : raw.freshnessDate || raw.expirationDate || \"\"", "Legacy top-level dates should not stay active as current freshness dates.");
includes(normalizeBlock[0], "legacy-pantry-${legacyIdentityHash}", "Legacy records without IDs should receive stable IDs.");

[
  ".legacy-migration-summary",
  ".legacy-date-review",
  ".legacy-date-review-badge",
  ".legacy-date-review-actions",
  ".pantry-date-record.legacy-migrated-date-record"
].forEach((snippet) => includes(css, snippet, `Missing migration CSS snippet: ${snippet}`));

[
  "Legacy Pantry records are migrated into schema version 2",
  "Original legacy records are preserved in legacyData and migrationEvidence",
  "No legacy date is converted into a confirmed expiration date",
  "Storage migration writes a backup, lock, temporary payload, commit, and rollback status",
  "Records updated/deleted: 0/0",
  "No notification spam was added"
].forEach((snippet) => includes(report, snippet, `Missing report confirmation: ${snippet}`));

assert(!/Treat All as Expiration|Use Anyway|Freeze Anyway|Ignore Date|bulk.*expiration/i.test(app), "Step 46 must not add unsafe bulk date actions.");

console.log("Cook Before It Spoils Step 46 legacy Pantry migration static checks passed.");
