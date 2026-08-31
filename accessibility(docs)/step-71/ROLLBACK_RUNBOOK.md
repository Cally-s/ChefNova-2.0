# Step 71 Rollback Runbook

Rollback changes feature availability, not user data. Preferences, Pantry data, allergies, dietary restrictions, meal plans, recipes, shopping lists, budget information, offline packages, cooking progress, and timers must remain intact.

## voice-command-rollback

Affected flags: cooking.voice-navigation, pantry.speech-entry

Immediate actions:
- Activate voice kill switch
- Stop recognition
- Release microphone tracks
- Reject late callbacks
- Show manual controls

Data protection:
- Do not delete preferences
- Do not delete confirmed user data
- Do not clear offline packages

Verification:
- Run focused regression
- Verify data preservation
- Verify fallback

## translation-publication-rollback

Affected flags: language.bridge, language.translated-media

Immediate actions:
- Disable faulty publication version
- Restore previous approved manifest
- Keep source-language fallback

Data protection:
- Do not delete preferences
- Do not delete confirmed user data
- Do not clear offline packages

Verification:
- Run focused regression
- Verify data preservation
- Verify fallback

## safety-warning-rollback

Affected flags: language.bridge

Immediate actions:
- Disable affected safety translation
- Restore approved warning or source-language warning
- Require safety review before republishing

Data protection:
- Do not delete preferences
- Do not delete confirmed user data
- Do not clear offline packages

Verification:
- Run focused regression
- Verify data preservation
- Verify fallback

## timer-announcement-rollback

Affected flags: cooking.accessible-timers

Immediate actions:
- Use previous timer presenter
- Preserve target timestamps
- Keep visible timer

Data protection:
- Do not delete preferences
- Do not delete confirmed user data
- Do not clear offline packages

Verification:
- Run focused regression
- Verify data preservation
- Verify fallback

## rtl-rollback

Affected flags: language.rtl-support, language.locale.ar

Immediate actions:
- Disable affected RTL experience
- Preserve selected locale
- Use approved fallback

Data protection:
- Do not delete preferences
- Do not delete confirmed user data
- Do not clear offline packages

Verification:
- Run focused regression
- Verify data preservation
- Verify fallback

## offline-package-rollback

Affected flags: language.translated-media

Immediate actions:
- Mark affected package update required on reconnection
- Preserve immutable snapshot and progress

Data protection:
- Do not delete preferences
- Do not delete confirmed user data
- Do not clear offline packages

Verification:
- Run focused regression
- Verify data preservation
- Verify fallback

## migration-rollback

Affected flags: application/data migration

Immediate actions:
- Pause rollout
- Keep expanded schema readable
- Do not delete source data

Data protection:
- Do not delete preferences
- Do not delete confirmed user data
- Do not clear offline packages

Verification:
- Run focused regression
- Verify data preservation
- Verify fallback

