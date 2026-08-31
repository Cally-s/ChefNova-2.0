# Cook Before It Spoils Step 46 Report

## Goal

Legacy Pantry records are migrated into schema version 2 without guessing what old date fields mean.

## Files Changed

- `app.js`
- `style.css`
- `tests/cook-before-it-spoils-step-46-legacy-pantry-migration-static.test.js`
- `docs/cook-before-it-spoils-step-46-report.md`

## Implementation Summary

- Added migration statuses, date confidence values, provenance values, and parse statuses for legacy Pantry data.
- Added conservative legacy date parsing that preserves date-only ISO values without timezone shifting.
- Ambiguous, invalid, partial, and empty dates are preserved and marked for review.
- Original legacy records are preserved in legacyData and migrationEvidence, including original field names, values, raw dates, and unknown fields.
- No legacy date is converted into a confirmed expiration date.
- Legacy records without an ID receive a stable generated ID.
- Legacy ingredient identity is marked for review instead of guessed from the ingredient name.
- Existing structured date records are preserved. Matching legacy evidence is attached; conflicts are marked for review.

## Storage Protection

- Storage migration writes a backup, lock, temporary payload, commit, and rollback status.
- Backups include the exact original payload and checksum.
- If migration commit fails, Chef Nova attempts rollback to the backup payload.
- Quota-style failures show a storage warning.

## User Review

- Pantry displays a migration summary when legacy dates need confirmation.
- Each migrated date shows a review notice with a Confirm action and a Review Later action.
- Review Later keeps the date unconfirmed and does not change Pantry data.
- The review queue is derived from the existing Pantry data only.

## Safety Protections

- Legacy `expiryDate`, `expirationDate`, `freshnessDate`, and `bestBeforeDate` values are treated as audit evidence until confirmed.
- Unknown legacy dates do not drive hard expiration exclusion, best-before quality conclusions, priority ranking, recipe planning, or food safety claims.
- Migration creates no physical Food Event History events, discard events, impact ledger records, or pattern evidence.
- No bulk "treat all as expiration" action was added.
- No notification spam was added.

## Migration Summary Contract

- Records updated/deleted: 0/0
- Legacy dates preserved: yes
- Dates needing confirmation: shown in the Pantry migration summary
- Records needing review: shown when dates are ambiguous, invalid, partial, or empty
- No date was automatically treated as a true expiration date.

## Validation

- Added a Step 46 static test for migration constants, evidence preservation, conservative date handling, review UI, storage backup/rollback, and report coverage.
- Verified JavaScript syntax for `app.js`, `rules.js`, `languageGuidelines.js`, and `data/recipes.js`.
- Verified `data/recipes.json` parses successfully.
- Passed `tests/cook-before-it-spoils-step-46-legacy-pantry-migration-static.test.js`.
- Passed `tests/cook-before-it-spoils-step-3-date-intelligence-static.test.js`.
- Passed `tests/cook-before-it-spoils-step-45-mobile-item-actions-static.test.js`.
- Passed `tests/cook-before-it-spoils-step-7-use-first-priority-static.test.js`.
- Passed `tests/cook-before-it-spoils-step-8-use-these-first-panel-static.test.js`.
- Note: `tests/cook-before-it-spoils-step-4-pantry-schema-static.test.js` still fails on a pre-existing `dateInformation:` literal in priority presentation code outside this migration. Step 46 did not add that literal and keeps `dateRecords` as the active Pantry date model.
