# Cook Before It Spoils Step 66 Report

## Goal

Add offline, low-bandwidth, and enhanced-feature failure fallbacks so Chef Nova keeps core cooking workflows usable when connection, speech, audio, video, translation, or storage features are unavailable.

## Files Changed

- `index.html`
- `app.js`
- `style.css`
- `service-worker.js`
- `scripts/offline-resilience.js`
- `tests/cook-before-it-spoils-step-66-offline-resilience.test.js`
- `docs/cook-before-it-spoils-step-66-report.md`

## Implementation Summary

- Added a reusable `ChefNovaResilience` module with `FeatureAvailability` states, fallback copy, offline recipe package creation, package validation, IndexedDB-backed storage, timer persistence helpers, media and translation fallbacks, low-bandwidth preferences, and a local sync queue.
- Added a service worker for app-shell caching when the site is served over HTTP or HTTPS. Direct `file://` opening remains supported because the service worker is skipped for local files.
- Added a nonblocking connection status banner for offline and low-bandwidth states.
- Added voice pantry fallback UI. If speech recognition is unsupported, unavailable, offline, denied, or failed, users continue with the labelled Pantry form and partial transcript text is preserved.
- Added read-aloud fallback UI. If speech synthesis fails, the complete instruction stays visible as text and the user can continue without audio.
- Added translation fallback UI. Original recipe text remains visible, and cached or stale translations can be labelled without hiding safety or allergy warnings.
- Added video/audio fallback UI using transcript-first and text-first presentation.
- Added recipe download controls for offline cooking packages from recipe cards, recipe details, and Favorites.
- Added profile settings for low-bandwidth mode and offline cooking package defaults.
- Added offline recipe download management in Profile.
- Added offline cooking step progress controls with visible buttons and keyboard alternatives.
- Added durable timer helpers based on timestamps so timers can be reconstructed after a page reload.
- Added sync queue infrastructure for future cloud sync without making cloud sync required.

## Core vs Enhanced Features

Core features remain text-first and local-first:

- Recipe search and recipe details
- Pantry form and pantry list
- Meal Planner
- Shopping List
- Allergy and safety warning text
- Visible cooking instructions
- Local progress and saved user data

Enhanced features are optional:

- Voice entry
- Read-aloud
- Translation
- Audio/video media
- Offline package downloads
- Future sync queue

Enhanced feature failure does not block the core cooking task.

## Offline Package Data

Offline recipe packages include:

- Schema version
- Recipe snapshot
- Ingredients
- Canonical quantities
- Safety warnings
- Allergy warnings
- Text transcript
- Timer definitions
- Progress state
- Media flags
- Integrity metadata
- Package status

Package saves are staged and validated. An incomplete package cannot replace an existing valid package.

## Accessibility and Fallbacks

- Every voice command has a visible button, keyboard shortcut, and screen-reader label in the shared command map.
- Fallback panels use live regions and clear action buttons.
- Keyboard shortcuts avoid input, select, textarea, and editable fields.
- Mobile layouts stack action rows and settings controls.
- Print and forced-colors support were added for the new fallback components.

## Validation Performed

Automated tests cover:

- Script order and app wiring
- Service worker app-shell cache behavior
- Speech recognition unsupported and permission-denied fallbacks
- Partial transcript preservation
- Text-to-speech fallback copy and text continuity
- Translation cached, stale, and original-text fallback behavior
- Audio/video transcript fallback behavior
- Offline package schema, ingredients, warnings, transcripts, timers, media flags, and storage estimate
- Incomplete package rejection and valid-package preservation
- Offline timers across pause, resume, completion, and reopen scenarios
- Low-bandwidth preference normalization
- Offline and unstable network detection
- Sync queue deduplication and failed retry state
- Visible, keyboard, and screen-reader command equivalents
- CSS presence for fallback and responsive layouts

## Tests Run

Passed:

- `node --check scripts/offline-resilience.js`
- `node --check service-worker.js`
- `node --check app.js`
- `node --check rules.js`
- `node --check tests/cook-before-it-spoils-step-66-offline-resilience.test.js`
- `node tests/cook-before-it-spoils-step-66-offline-resilience.test.js`
- `node tests/cook-before-it-spoils-step-65-localization-service.test.js`
- `node tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js`
- `node tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js`
- `node tests/price-confidence-static.test.js`

## Risks and Notes

- Service worker caching is available only when opened through HTTP/HTTPS. This is expected browser behavior; direct `index.html` opening still works without service worker registration.
- Voice entry, read-aloud, translation, audio, and video are treated as enhanced features. If a browser blocks them, Chef Nova shows text/manual fallbacks.
- Offline data is local to the browser and device. The sync queue is ready for future cloud sync but does not send data anywhere.
