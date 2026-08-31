# Step 71 Feature Dependencies

Dependencies are enforced centrally by `scripts/rollout-management.js`.

| Feature | Dependencies |
| --- | --- |
| cooking.voice-navigation | accessibility.keyboard-focus-foundation, privacy.microphone-controls |
| pantry.speech-entry | privacy.microphone-controls, manual.pantry-form |
| language.bridge | step65.localization, step67.content-review, content.source-approved |
| language.bilingual-rendering | language.bridge, language.cooking-glossary |
| language.rtl-support | language.bridge, locale.rtl-approved |
| language.translated-media | language.bridge, media.reviewed-captions, media.reviewed-transcript |
| language.multilingual-speech-commands | privacy.microphone-controls, language.bridge, step70.voice-command-policy |
| language.speech-commands.en-CA | language.multilingual-speech-commands, language.locale.en-CA |
| language.speech-commands.fr-CA | language.multilingual-speech-commands, language.locale.fr-CA |
| language.speech-commands.zh-Hans | language.multilingual-speech-commands, language.locale.zh-Hans |
| language.speech-commands.zh-Hant | language.multilingual-speech-commands, language.locale.zh-Hant |
| language.speech-commands.ar | language.multilingual-speech-commands, language.locale.ar |
| language.speech-commands.pa | language.multilingual-speech-commands, language.locale.pa |
| language.speech-commands.es | language.multilingual-speech-commands, language.locale.es |
| language.speech-commands.uk | language.multilingual-speech-commands, language.locale.uk |
| language.speech-commands.vi | language.multilingual-speech-commands, language.locale.vi |
| language.speech-commands.ko | language.multilingual-speech-commands, language.locale.ko |

Safety invariants are not flags and cannot be disabled:

- manual-recipe-instructions
- manual-pantry-form
- keyboard-core-controls
- touch-core-controls
- screen-reader-core-controls
- allergy-warnings
- food-safety-warnings
- approved-safety-temperatures
- original-language-fallback
- accessibility-recovery
- restore-display-defaults
- language-recovery
- offline-timer-persistence
- user-data-authorization
- step-67-publication-gates
- human-review-safety-translations
- step-70-sensitive-voice-confirmation
- raw-audio-minimization
- cross-account-voice-session-protection
- no-disability-inference
- feedback-privacy-defaults
- canonical-quantity-preservation
- existing-saved-data
- publication-audit-trails
