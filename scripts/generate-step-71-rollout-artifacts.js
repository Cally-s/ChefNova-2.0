#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const rollout = require("./rollout-management.js");

const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, "docs", "accessibility", "step-71");

function write(name, content) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, name), content);
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell ?? "").replace(/\n/g, " ")).join(" | ")} |`)
  ].join("\n");
}

const flags = Object.values(rollout.FLAG_CATALOG);
const stages = rollout.DEFAULT_STAGE_RECORDS;
const dashboard = rollout.createReleaseDashboardModel();
const configValidation = rollout.validateRolloutConfiguration(rollout.DEFAULT_ROLLOUT_CONFIG, { manualPantryFormAvailable: true });

write("FEATURE_FLAG_CATALOG.md", `# Step 71 Feature Flag Catalogue

Configuration version: \`${rollout.CONFIGURATION_VERSION}\`

Feature flags control enhanced interface and service availability only. They do not create separate user-data systems.

${table(["Flag", "Stage", "Owner", "Default", "Dependencies", "Safe fallback", "Kill switch", "Storage"], flags.map((flag) => [
  flag.key,
  flag.stage,
  flag.owner,
  "disabled outside approved rollout",
  flag.dependencies.join(", ") || "none",
  flag.safeFallback,
  flag.killSwitchBehavior,
  flag.dataStoresUsed.join(", ")
]))}
`);

write("FEATURE_DEPENDENCIES.md", `# Step 71 Feature Dependencies

Dependencies are enforced centrally by \`scripts/rollout-management.js\`.

${table(["Feature", "Dependencies"], Object.entries(rollout.DEPENDENCIES).map(([key, deps]) => [key, deps.join(", ")]))}

Safety invariants are not flags and cannot be disabled:

${rollout.NON_FLAGGED_SAFETY_INVARIANTS.map((item) => `- ${item}`).join("\n")}
`);

write("STAGE_GATES.md", `# Step 71 Stage Gates

A stage may advance only when every required criterion is passed and no Severity 0 or Severity 1 blocker remains. Blocked is not treated as passed.

${stages.map((stage) => `## ${stage.id}

Status: \`${stage.status}\`

${table(["Criterion", "Category", "Required", "Status"], [...stage.entryCriteria, ...stage.exitCriteria, ...stage.rollbackCriteria].map((criterion) => [criterion.id, criterion.category, criterion.required, criterion.status]))}
`).join("\n")}
`);

write("ROLLOUT_PLAN.md", `# Step 71 Rollout Plan

Chef Nova uses controlled stages:

1. Stage 1: Visual and keyboard foundation.
2. Stage 2: Independent cooking tools.
3. Stage 3: Initial Language Bridge.
4. Stage 4: Expanded languages.

Each stage starts in draft or internal testing, then requires explicit approval for pilot, limited rollout, expanded rollout, and general availability.

Current status: rollout infrastructure implemented. Production rollout not completed.

${table(["Stage", "Status", "Feature count", "Locale count"], stages.map((stage) => [stage.id, stage.status, stage.featureFlagKeys.length, stage.localeFlagKeys.length]))}
`);

write("ROLLBACK_RUNBOOK.md", `# Step 71 Rollback Runbook

Rollback changes feature availability, not user data. Preferences, Pantry data, allergies, dietary restrictions, meal plans, recipes, shopping lists, budget information, offline packages, cooking progress, and timers must remain intact.

${rollout.DEFAULT_ROLLBACK_PLANS.map((plan) => `## ${plan.id}

Affected flags: ${plan.affectedFlags.join(", ") || "application/data migration"}

Immediate actions:
${plan.immediateActions.map((item) => `- ${item}`).join("\n")}

Data protection:
${plan.dataProtectionActions.map((item) => `- ${item}`).join("\n")}

Verification:
${plan.verificationSteps.map((item) => `- ${item}`).join("\n")}
`).join("\n")}
`);

write("TRANSLATION_ROLLBACK.md", `# Translation Rollback

Incorrect translations restore a previous approved version or the approved source-language fallback. Machine drafts are never published as rollback content.

Safety-warning translation errors are Severity 0. The warning is restored from a previous approved version or shown in the approved source language; it is never removed.
`);

write("MIGRATION_ROLLBACK.md", `# Migration Rollback

Chef Nova uses expand-and-contract migration rules:

1. Add compatible fields.
2. Deploy code that reads old and new formats.
3. Migrate data idempotently.
4. Verify.
5. Stop writing old format.
6. Remove old format in a later release only.

Feature flags must not select separate user-data stores.
`);

write("OFFLINE_ROLLBACK.md", `# Offline Rollback

Offline packages keep immutable approved recipe snapshots. A fully offline device cannot receive a newly issued rollback until it reconnects.

On reconnection, Chef Nova marks affected packages as update required, preserves cooking progress, and offers the approved corrected package. Draft translations must never replace downloaded approved content.
`);

write("MONITORING_PLAN.md", `# Monitoring Plan

Allowed events are aggregate and privacy safe:

- feature-exposed
- feature-used
- feature-fallback-used
- feature-error
- recovery-opened
- translation-fallback-used
- offline-update-required

Events exclude Pantry contents, allergy details, dietary restrictions, Waste Diary details, budget data, raw audio, transcripts, exact voice commands, recipe notes, and disability inference.

High-risk alerts are documented for safety translation reports, missing allergy warnings, unreviewed translations, cross-account voice issues, raw-audio detection, voice confirmation bypass, timer state loss, migration failure, flag mismatch, RTL numeric reversal, and large fallback increases.
`);

write("MAINTENANCE_SCHEDULE.md", `# Maintenance Schedule

${table(["Cadence", "Owner", "Activities"], rollout.MAINTENANCE_SCHEDULE.map((item) => [item.cadence, item.owner, item.activities.join(", ")]))}

## Owners

${table(["Area", "Owner"], Object.entries(rollout.MAINTENANCE_OWNERS))}
`);

write("COMPATIBILITY_POLICY.md", `# Compatibility Policy

Regular review covers Chrome, Firefox, Safari, Microsoft Edge, NVDA with Firefox, NVDA with Chrome, JAWS with Edge, VoiceOver with Safari, VoiceOver on iPhone, and TalkBack with Android Chrome.

Support changes require evidence, user-impact review, documented fallback, communication, and product approval. Passing automated checks alone is not complete accessibility evidence.
`);

write("INCIDENT_TEMPLATE.md", `# Incident Template

- Incident ID:
- Status: investigating | mitigating | monitoring | resolved | post-incident-review
- Affected feature:
- Affected locale:
- Affected application versions:
- User impact:
- Accessibility impact:
- Privacy impact:
- Safety impact:
- Immediate mitigation:
- Rollback decision:
- Root cause:
- Corrective actions:
- Regression tests:
- Maintenance changes:

Do not include private user content in incident records.
`);

write("RELEASE_CHECKLIST.md", `# Release Checklist

## Release Identity

- Application version:
- Commit:
- Flag configuration version:
- Content manifest version:
- Database schema version:

## Testing

- Automated tests:
- Keyboard tests:
- Screen-reader tests:
- Mobile tests:
- Language review:
- RTL tests:
- Offline tests:
- Privacy tests:
- Rollback drill:

## Safety

- Allergy content approved:
- Food-safety content approved:
- Safety temperatures verified:
- No machine-draft safety content:

## Operations

- Monitoring active:
- Alerts active:
- Owners available:
- Support material ready:
- Kill switch verified:
- Rollback target verified:

## Decision

- Approved:
- Paused:
- Blocked:
- Rolled back:
`);

write("RESULTS.md", `# Step 71 Results

Rollout infrastructure implemented.

Production rollout completed: no.

Default configuration validation: ${configValidation.valid ? "passed" : "failed"}.

Stage records created: ${stages.length}.

Feature flags catalogued: ${flags.length}.

Rollback plans created: ${rollout.DEFAULT_ROLLBACK_PLANS.length}.

No production flag provider, production analytics, or production deployment access was available in this local static app environment.
`);

write("KNOWN_LIMITATIONS.md", `# Known Limitations

- This is a static local app with no backend feature-flag provider.
- Server-side enforcement is represented by a server-shaped module and tests, not by deployed server endpoints.
- No production rollout was performed.
- No production monitoring or alert thresholds were validated.
- Real browser, screen-reader, mobile, and rollback drill evidence must be collected before stage advancement.
- Existing older Step 4, Step 5, and Step 6 static test failures remain outside Step 71.
`);

write("RELEASE_DASHBOARD.json", JSON.stringify(dashboard, null, 2) + "\n");
write("ROLLOUT_CONFIG.json", JSON.stringify(rollout.DEFAULT_ROLLOUT_CONFIG, null, 2) + "\n");
write("STAGE_RECORDS.json", JSON.stringify(stages, null, 2) + "\n");

console.log(`Generated Step 71 rollout artifacts for ${flags.length} flags and ${stages.length} stages.`);
