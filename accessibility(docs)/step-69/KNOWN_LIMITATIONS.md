# Step 69 Known Limitations

## Required testing not completed

### ALM-DESKTOP-NVDA-001: Complete cooking workflow with NVDA and Firefox.

No Windows machine, browser extension session, NVDA installation, JAWS licence, or Windows forced-colour environment was available in this Codex workspace. Needed: real Windows environment, Firefox, NVDA, trained tester, screen-reader output notes, and evidence capture. Release risk: mandatory screen-reader coverage remains unresolved.

### ALM-DESKTOP-NVDA-002: Complete cooking workflow with NVDA and Chrome.

No Windows machine, browser extension session, NVDA installation, JAWS licence, or Windows forced-colour environment was available in this Codex workspace. Needed: real Windows environment, Chrome, NVDA, trained tester, screen-reader output notes, and evidence capture. Release risk: mandatory screen-reader coverage remains unresolved.

### ALM-DESKTOP-JAWS-001: Complete cooking workflow with JAWS and Microsoft Edge.

No Windows machine, browser extension session, NVDA installation, JAWS licence, or Windows forced-colour environment was available in this Codex workspace. Needed: real Windows environment, Microsoft Edge, JAWS, trained tester, screen-reader output notes, and evidence capture. Release risk: mandatory screen-reader coverage remains unresolved.

### ALM-DESKTOP-VO-001: Complete cooking workflow with VoiceOver and Safari.

This workspace did not expose controllable macOS VoiceOver output or a documented screen-reader audio/transcript capture path. Needed: real macOS environment, Safari, VoiceOver, trained tester, screen-reader output notes, and evidence capture. Release risk: mandatory screen-reader coverage remains unresolved.

### ALM-MOBILE-VO-001: Complete cooking workflow with VoiceOver and Safari.

No physical iPhone was available to this Codex session. Needed: real iOS environment, Safari, VoiceOver, trained tester, screen-reader output notes, and evidence capture. Release risk: mandatory screen-reader coverage remains unresolved.

### ALM-MOBILE-TB-001: Complete cooking workflow with TalkBack and Chrome.

No physical Android device was available to this Codex session. Needed: real Android environment, Chrome, TalkBack, trained tester, screen-reader output notes, and evidence capture. Release risk: mandatory screen-reader coverage remains unresolved.

### ALM-LANGUAGE-FR-001: Human fluent review for fr-CA.

No fluent human reviewer was available in this Codex session. Needed: qualified fr-CA reviewer, reviewed strings, screenshots or notes, and sign-off. Release risk: language quality cannot be considered approved.

### ALM-LANGUAGE-ZH-001: Human fluent review for zh-CN.

No fluent human reviewer was available in this Codex session. Needed: qualified zh-CN reviewer, reviewed strings, screenshots or notes, and sign-off. Release risk: language quality cannot be considered approved.

### ALM-RTL-AR-001: Human fluent review for ar.

No fluent human reviewer was available in this Codex session. Needed: qualified ar reviewer, reviewed strings, screenshots or notes, and sign-off. Release risk: language quality cannot be considered approved.

### ALM-MOBILE-IPHONE-ORIENTATION-001: iPhone Safari portrait and landscape with on-screen keyboard.

No physical iPhone was available to this Codex session. Needed: physical iOS device, browser, tester, and evidence. Release risk: mobile assistive and keyboard behavior remains unresolved.

### ALM-MOBILE-ANDROID-ORIENTATION-001: Android Chrome portrait and landscape with on-screen keyboard.

No physical Android device was available to this Codex session. Needed: physical Android device, browser, tester, and evidence. Release risk: mobile assistive and keyboard behavior remains unresolved.

### ALM-MOBILE-IPHONE-DICTATION-001: iPhone dictation for Two cans of tomatoes in the pantry.

No physical iPhone was available to this Codex session. Needed: physical iOS device, browser, tester, and evidence. Release risk: mobile assistive and keyboard behavior remains unresolved.

### ALM-MOBILE-ANDROID-VOICE-001: Android voice input for Two cans of tomatoes in the pantry.

No physical Android device was available to this Codex session. Needed: physical Android device, browser, tester, and evidence. Release risk: mobile assistive and keyboard behavior remains unresolved.

### ALM-BROWSER-REAL-001: Real in-app browser smoke test with console and keyboard checks.

No controllable real browser test stack returned usable operation documentation in this session; static Node checks were executed instead. Needed: functioning browser-control session with console access or a human browser tester. Release risk: browser execution evidence remains incomplete.

## Required manual rows not run

- ALM-COOKING-KB-001: Complete recipe selection, one-instruction mode, timer controls, language bridge, meal outcome, and return to recipe without pointer.
- ALM-OFFLINE-E2E-001: Complete a downloaded recipe with network disabled, timers, transcript, display settings, recovery, and outcome confirmation.
- ALM-LOW-BANDWIDTH-E2E-001: Complete recipe flow under constrained connection with text-first loading and transcript fallback.
- ALM-ALLERGY-MATRIX-001: Verify same allergy warning across colour, monochrome, high contrast, screen reader, zoom, locales, offline, and low bandwidth.
- ALM-VIDEO-MATRIX-001: Verify captions, transcript, controls, fallbacks, zoom, reduced motion, and multiple languages.
- ALM-TIMER-MATRIX-001: Verify timer label, start, pause, resume, add time, stop, completion, reload, offline, and language switching.
- ALM-FEEDBACK-CATEGORIES-001: Submit all feedback categories and inspect actual queued records or outgoing payloads.
- ALM-USER-TESTING-001: Run moderated or unmoderated tasks with representative access modes and language needs.

These rows are not considered passed.