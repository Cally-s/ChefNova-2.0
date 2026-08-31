# Cook Before It Spoils Step 43 Report

## Goal

Create one shared respectful-language policy for Chef Nova user-facing messages while reusing existing feature decisions and preserving safety clarity.

## Files inspected

Inspected `app.js`, `index.html`, `style.css`, `languageGuidelines.js`, `rules.js`, `data`, `docs/cook-before-it-spoils-food-safety-guardrails.md`, `docs/cook-before-it-spoils-respectful-waste-diary.md`, `docs/cook-before-it-spoils-evidence-based-pattern-detection.md`, `docs/cook-before-it-spoils-actionable-pattern-insights.md`, `docs/cook-before-it-spoils-explain-insight-evidence.md`, `docs/cook-before-it-spoils-impact-metric-definitions.md`, `docs/cook-before-it-spoils-impact-ledger.md`, `docs/cook-before-it-spoils-monthly-impact-dashboard.md`, `docs/cook-before-it-spoils-responsible-impact-claims.md`, `docs/cook-before-it-spoils-budget-rescue-integration.md`, `docs/cook-before-it-spoils-shopping-list-integration.md`, `docs/cook-before-it-spoils-meal-calendar-reservations.md`, `docs/cook-before-it-spoils-emergency-plan-integration.md`, `docs/cook-before-it-spoils-notification-levels.md`, `docs/cook-before-it-spoils-prevent-notification-fatigue.md`, and available Step 1-42 reports.

## Existing source of truth

- Existing user-facing-string source of truth: product strings in `app.js`, `index.html`, `rules.js`, `languageGuidelines.js`, data fixtures, docs, and tests.
- Existing localization source of truth: direct English templates and labels; no second localization system was found.
- Existing accessibility-label source of truth: `aria-label`, live region helpers, modal labels, and generated card labels in `app.js` and `index.html`.
- Existing notification-template source of truth: Step 41/42 notification candidate and notification-card functions.
- Existing print-template source of truth: stylesheet print rules and generated dashboard/planner markup.
- Existing export-label source of truth: current impact, nutrition, and budget generated labels.
- Existing safety-message source of truth: Food-Safety Guardrail and Date Intelligence wording.
- Existing pattern-message source of truth: Step 30 pattern result presentation and Step 31/32 insight evidence.
- Existing budget-message source of truth: Budget Rescue and Emergency Plan result builders.
- Existing impact-message source of truth: Impact Claims policy, Impact Ledger, and Monthly Impact Dashboard.
- Existing AI-generated user-facing text: none used for Step 43 decisions; wording is deterministic.

## Audit findings

- Existing user-blame language found: no active production strings matching direct “you wasted” or “you failed” were found.
- Existing shame language found: no active production shame score or ridicule surface was found.
- Existing diagnostic language found: no active food-record diagnosis strings were found.
- Existing socioeconomic judgment found: prohibited examples existed in docs/tests only.
- Existing unsupported absolutes found: context-sensitive examples existed in docs/tests only.
- Existing manipulative action labels found: none in active production surfaces.
- Existing vague safety wording found: no new vague safety fallback was introduced.
- Existing pattern-overstatement found: Step 30 docs and strings already use possible-pattern wording.
- Existing estimate-label defects found: existing impact/cost docs preserve estimated and approximate qualifiers.
- Existing planned-versus-confirmed defects found: existing reports and UI distinguish planned from confirmed.
- Existing accessibility wording mismatches found: no harsher hidden labels were found in the searched active surfaces.
- Existing localization mismatches found: no separate localization files were found.

## Files changed

- `languageGuidelines.js`
- `app.js`

## Files created

- `docs/cook-before-it-spoils-respectful-language.md`
- `docs/cook-before-it-spoils-step-43-report.md`
- `tests/cook-before-it-spoils-step-43-respectful-language-static.test.js`

## Existing systems reused

Step 43 reuses one Food-Safety Guardrail system, one Pattern Detection system, one Actionable Insight system, one Notification system, one Impact Claims policy, one validation-message flow, one localization path, and one user-storage convention.

## Model versions

- Respectful-language policy version: `RESPECTFUL_LANGUAGE_POLICY_VERSION = 1`
- Message-presentation version: `RESPECTFUL_MESSAGE_PRESENTATION_VERSION = 1`
- Prohibited-language scanner version: `PROHIBITED_LANGUAGE_SCANNER_VERSION = 1`
- Localization semantic-validation version: `LOCALIZATION_SEMANTIC_VALIDATION_VERSION = 1`

## Controlled values

- Message intents: informational-status, planning-suggestion, possible-pattern, actionable-insight, safety-exclusion, safety-review-required, date-information, budget-limitation, partial-plan, recipe-limitation, portion-suggestion, shopping-advisory, reservation-status, notification, impact-estimate, data-coverage, validation-error, system-error, confirmation, empty-state, migration-review.
- Tone classes: neutral-informational, supportive-planning, cautious-evidence, firm-safety, respectful-limitation, recovery-oriented.
- Assertion strength: confirmed-fact, system-policy, recorded-observation, estimated-result, possible-interpretation, optional-suggestion, review-required.
- Prohibited-language categories: user-blame, shame, moral-judgment, behavioural-diagnosis, socioeconomic-judgment, unsupported-absolute, coercion, unsupported-causality, safety-ambiguity, safety-overriding, invalid-personalization, manipulative-action-label.

## Behavior implemented

- Decision-versus-wording behavior: language templates communicate existing source decisions only.
- Respect-versus-safety behavior: hard safety exclusions remain direct and use “will not recommend” or “not included” wording.
- User-blame, shame, moral-judgment, diagnosis, and socioeconomic-judgment prevention: scanner categories flag product-authored problematic wording.
- Evidence-strength behavior: templates carry assertion strength and required semantic tokens.
- Absolute-language behavior: “you always” and “you never” behavior claims are rejected while supported policy statements can be allowlisted.
- “Again” behavior: blame-context “you forgot again” is rejected.
- Optional-suggestion behavior: suggested changes include optional summaries and Keep Current Setting actions when valid.
- Action-label behavior: labels are scanned and vague/manipulative controls are rejected.
- Subject-framing behavior: templates prefer Chef Nova, records, Pantry, Waste Diary, current plan, and current settings.
- Correction-language behavior: fallback says source records were not changed.
- Success-language behavior: runtime validation blocks judgmental dynamic successes.
- Pattern-language behavior: possible-pattern template uses incident count, time window, and “planning observation, not a judgment.”
- Actionable-insight language: possible-next-step template keeps changes optional.
- Evidence-explanation language: templates preserve evidence summaries.
- Portion-language behavior: portion template describes recent recorded household use.
- Leftover-language behavior: policy documentation preserves planned-versus-confirmed outcome wording.
- Recipe-limitation behavior: recipe limitation template avoids blaming requirements.
- Food-safety-language behavior: expiration and storage review templates remain firm.
- Allergy and dietary language: policy says protections are requirements, not obstacles.
- Budget-language behavior: budget limitation template preserves requirements and closest safe options.
- Emergency-language behavior: documentation preserves dignity and safety.
- Shopping-List-language behavior: documentation keeps advisories non-blocking.
- Calendar-language behavior: documentation avoids failure wording.
- Notification-language behavior: toasts and saved notifications are scanned before display/history save.
- Notification-fatigue-language behavior: existing Step 42 wording remains timing-only.
- Waste-Diary-language behavior: documentation keeps discard recording factual.
- Impact-Dashboard-language behavior: policy preserves possible and estimated labels.
- Error-language behavior: fallback explains unchanged records.
- Empty-state behavior: policy documents record-limit language.
- Data-coverage-language behavior: missing data is not treated as user failure.
- User-authored-content behavior: scanner supports an explicit user-authored exception.
- Privacy behavior: policy documents generic external notification wording.
- Runtime validation behavior: dynamic toasts and saved notifications use the shared scanner.
- Localization behavior: semantic-token validator checks required meaning.
- Accessibility wording behavior: visible and assistive strings are scanned for equivalent respectful meaning.
- Print and export behavior: policy and scanner cover product-authored print/export labels.
- Correction and reversal behavior: message IDs include source revision inputs.
- Stale-message protection: deterministic IDs include template, source revision, policy version, and locale.
- Deterministic behavior: template resolver has fixed outputs.
- Idempotency behavior: repeated inputs return the same message ID and wording.
- Multi-tab and account-switch protection: no user-specific global cache or storage was added.
- Registered-user isolation: no personal language data is stored globally.
- Guest behavior: guest records remain source data in existing session storage only.
- Responsive, high-contrast, and reduced-motion behavior: no new animated UI was added; policy applies to existing surfaces.
- Legacy migration: helper maps legacy blame, budget, and unsupported environmental claims to current templates.
- Migration idempotency: helper does not mutate source data or create events.

## Required zero-result checks

- Second decision engines created: 0
- Second safety systems created: 0
- Second pattern checkers created: 0
- User-blaming production strings remaining: 0
- Shame-based production strings remaining: 0
- Moral-judgment production strings remaining: 0
- Behavioural diagnoses based on food records: 0
- Mental-health diagnoses based on food records: 0
- Socioeconomic judgments based on budget: 0
- Manipulative action labels remaining: 0
- “Again” used in a blame context: 0
- Unsupported “always” or “never” behavior claims: 0
- Possible patterns presented as confirmed habits: 0
- One- or two-event records described as patterns: 0
- Suggestions presented as guaranteed solutions: 0
- Planned food presented as confirmed used: 0
- Frozen-only food presented as permanently saved: 0
- Estimated values presented as exact: 0
- Best-before dates represented as expiration dates: 0
- App-estimated freshness represented as official expiration: 0
- Hard safety exclusions weakened into vague suggestions: 0
- Allergies framed as user-created obstacles: 0
- Dietary restrictions framed as user-created obstacles: 0
- Budgets described as bad, unrealistic, or irresponsible: 0
- Emergency users pressured to consume questionable food: 0
- Shopping advisories blocking intentional purchases automatically: 0
- Meal cancellation described as user failure: 0
- Notification dismissal described as ignoring food: 0
- Waste Diary prompts asking users to justify blame: 0
- Impact Dashboard using shame-oriented rankings: 0
- User-authored judgmental notes adopted as Chef Nova conclusions: 0
- Harsher screen-reader wording than visible wording: 0
- Harsher localized wording than source templates: 0
- Estimate qualifiers omitted from accessibility text: 0
- Safety directives omitted from accessibility text: 0
- Prohibited language hidden only from visible text but retained in exports or print: 0
- AI-generated user-character judgments: 0
- Cross-user personal wording exposed: 0
- Guest personal records persisted into registered-user storage automatically: 0

## Scenarios tested

Static validation covers spinach-pattern, one-record, two-record, portion, batch-cooking boundary, recipe limitation, expiration, best-before precision, unknown date, storage review, allergen, dietary, over-budget, Emergency partial plan, user exclusion, Shopping advisory, kept package, meal cancellation, unknown meal outcome, reminder dismissal, reminders off, Waste Diary, discarded value, Impact Dashboard, empty impact, missing price, validation message, multi-tab error, user-authored note, visible-versus-accessible wording, print, export, localization, safety localization, prohibited-phrase scanning, contextual never, contextual expiration, manipulative buttons, approved buttons, pattern correction, safety state change, source order, idempotency, multi-tab, account-switch, user isolation, guest behavior, keyboard access, screen-reader safety, screen-reader budget, mobile, high contrast, reduced motion, legacy blame, legacy budget, legacy environmental claim, and migration.

## Commands run

- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check languageGuidelines.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check rules.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check data/recipes.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8')); console.log('recipes.json parses successfully.');"`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-43-respectful-language-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-42-notification-fatigue-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-41-notification-levels-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-40-emergency-plan-integration-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-36-impact-claims-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-34-impact-ledger-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-31-actionable-pattern-insights-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-30-conservative-pattern-detection-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-26-waste-diary-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-4-pantry-schema-static.test.js`
- `/Users/callysu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/cook-before-it-spoils-step-5-food-events-static.test.js`
- `rg -n "politeMessageDatabase|friendlyErrorEngine|empathyAI|respectfulPatternDatabase|secondLocalizationSystem|secondNotificationWordingEngine" app.js languageGuidelines.js docs tests`
- `rg -n "You wasted|you wasted|You failed|you failed|bad budget|unrealistic budget|cannot afford|you always|you never|smart choice|wrong choice|stop wasting" app.js index.html rules.js data languageGuidelines.js`

## Validation result

Passed:

- `languageGuidelines.js`, `app.js`, `rules.js`, and `data/recipes.js` syntax checks.
- `data/recipes.json` JSON parse check.
- Step 43 respectful-language static checks.
- Step 42 notification fatigue static checks.
- Step 41 notification-level static checks.
- Step 40 Emergency Plan integration static checks.
- Step 36 impact-claims governance static checks.
- Step 34 impact-ledger static checks.
- Step 31 actionable-pattern-insight static checks.
- Step 30 conservative-pattern-detection static checks.
- Step 26 Waste Diary static checks.

Known pre-existing failures observed during adjacent validation:

- Step 4 pantry schema static test still fails at `tests/cook-before-it-spoils-step-4-pantry-schema-static.test.js:47` with “Step 4 must not replace date records with one dateInformation field.”
- Step 5 food events static test still fails at `tests/cook-before-it-spoils-step-5-food-events-static.test.js:99` with “Food event history must not replace Step 3 date records.”

Additional scans:

- Duplicate-system names appeared only inside the Step 43 static test’s prohibited-name assertions.
- Prohibited example phrases appeared only in scanner/rejection patterns, not active displayed copy.

## Remaining issues

No duplicate respectful-language policy, localization system, decision engine, safety system, pattern checker, notification system, or impact system was introduced. The only remaining validation failures are the known Step 4 and Step 5 date-information static-test issues, which predate Step 43 and were not changed by this work.

## Recommended starting point for Step 44

Step 44 can connect more individual feature renderers to `resolveRespectfulMessage()` as UI surfaces are refactored, while keeping the same registry and scanner.
