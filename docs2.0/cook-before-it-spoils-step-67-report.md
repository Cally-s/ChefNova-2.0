# Cook Before It Spoils Step 67 Report

## Goal

Create an accessible content and translation review workflow for Chef Nova so recipe content, safety wording, ingredient terms, media alternatives, captions, transcripts, and translations can be checked before publication.

## Files Changed

- `scripts/content-review-governance.js`
- `index.html`
- `app.js`
- `style.css`
- `tests/cook-before-it-spoils-step-67-content-review-governance.test.js`
- `docs/cook-before-it-spoils-step-67-report.md`

## Architecture Added

Step 67 adds a centralized content governance module for static Chef Nova workflows. It defines reviewable content types, content statuses, translation statuses, role permissions, valid transitions, audit events, publication issues, version hashes, publication manifests, review assignments, and dashboard grouping.

The module covers:

- recipes
- recipe steps
- ingredient terms
- technique definitions
- safety warnings
- allergy warnings
- images
- videos
- caption tracks
- transcripts
- translations

## Publication Gate

The new gate checks that recipe content is structured, reviewable, and approved before publish-style actions proceed. It returns structured blocking issues with stable codes, affected fields, required review kind, locale, and suggested action metadata.

Validated blockers include:

- missing or ambiguous ingredient IDs
- missing structured quantities
- invalid canonical quantities
- step quantities missing or exceeding recipe quantities
- vague recipe-step wording
- missing timing
- missing doneness cues
- missing safety temperature references
- missing appliance requirements
- missing allergy information
- missing or weak alt text
- missing or unreviewed captions
- missing or unreviewed transcripts
- missing, rejected, outdated, or machine-only translations
- missing review approvals
- archived content

## Review Roles and Separation of Duties

Roles added:

- author
- translator
- accessibility-reviewer
- language-reviewer
- safety-reviewer
- publisher
- administrator

The workflow prevents authors from approving their own food-safety review. Locale-limited language reviewers can only approve authorized locales.

## Translation Workflow

Translation records include source version, source content hash, target locale, translation version, review method, segment status, reviewer metadata, approval metadata, and safety-critical flags.

Machine drafts cannot move directly to approved. Approved translations require human review metadata. Safety-critical translations require safety review metadata.

Segment status aggregation uses the most restrictive segment status, so rejected, outdated, machine-draft, or safety-review-required segments block publication.

## Versioning and Audit Trail

Each reviewable version receives a stable content hash. Approvals are tied to exact entity ID, version, review kind, locale, and content hash, so edits invalidate previous approvals. Audit events are immutable records for draft creation, review decisions, publication blocks, and publication success.

## Ingredient and Technique Review

Ingredient-term review checks canonical identity, aliases, allergen IDs, and review status before new terms are considered publishable.

Technique-definition changes detect safety-sensitive changes, such as moving from a general pan-cooking definition to deep-frying guidance, and require renewed safety review plus translation invalidation.

## Step 65 and Step 66 Integration

Step 65 localization is respected through target-locale translation records, source-version invalidation, canonical quantity validation, and language-review permissions.

Step 66 offline resilience is connected by checking publication readiness before offline recipe downloads. Legacy published recipes remain available, while new non-reviewed content can be blocked by the local gate.

## App UI Integration

The registered profile page now includes a content review dashboard summary. It shows how many recipes appear ready, how many need review, and a few representative blocking issues.

The dashboard intentionally notes that Chef Nova is a static app and does not have a trusted backend.

## Backend Limitation

The Step 67 prompt requires trusted backend enforcement and database-level publication gates. This Chef Nova project is currently a static HTML, CSS, JavaScript, JSON, and localStorage app with no backend, no database, no admin editor, and no server publication endpoint.

Implemented enforcement is therefore local and centralized inside `scripts/content-review-governance.js`. A production release would still need server-side transactions, persistent review tables, role-authenticated APIs, and backend publication enforcement before accepting external authors or translators.

## Tests Added

Added `tests/cook-before-it-spoils-step-67-content-review-governance.test.js`.

The test covers:

- script order and app wiring
- required content types
- required review kinds
- valid and invalid status transitions
- publication blockers
- role permissions
- separation of duties
- immutable approvals and audit events
- version hash invalidation
- translation approval rules
- source-version translation invalidation
- segment-level translation aggregation
- per-locale publication blocking
- ingredient-term review
- safety-sensitive technique changes
- media alt/caption/transcript requirements
- dashboard grouping
- Step 66 offline download integration

## Validation Performed

Passed:

- `node --check scripts/content-review-governance.js`
- `node --check app.js`
- `node --check rules.js`
- `node --check tests/cook-before-it-spoils-step-67-content-review-governance.test.js`
- `node tests/cook-before-it-spoils-step-67-content-review-governance.test.js`
- `node tests/cook-before-it-spoils-step-65-localization-service.test.js`
- `node tests/cook-before-it-spoils-step-66-offline-resilience.test.js`

Broader test-folder pass:

- 89 of 92 `.test.js` files passed.
- The 3 failures were pre-existing older static checks unrelated to Step 67. They expect no `dateInformation:` text in `app.js` and an older exact Pantry guardrail filter string. Current `app.js` already contains `dateInformation:` fields and a later guardrail implementation shape.

## Accessibility Notes

Automated checks cover accessibility-review requirements for alt text, meaningful media, captions, transcripts, review assignment grouping, and publication blockers. Full assistive-technology review remains a manual production requirement because this static test environment does not provide screen-reader validation.

## Risks and Notes

- The workflow is deterministic and idempotent at the local module level.
- Existing recipe data is not mass-migrated into reviewed content records; legacy migration marks content for remediation while preserving access.
- The implementation does not add a backend, database, external API, or new localStorage keys.
- Real publication protection still requires server-side enforcement if Chef Nova gains external publishing.
