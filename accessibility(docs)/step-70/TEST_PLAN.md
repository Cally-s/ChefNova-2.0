# Step 70 Test Plan

Goal: verify microphone permission handling, voice command safety, privacy boundaries, and account isolation without using a backend or storing raw voice data.

Automated tests cover the reusable safety module and static app integration. Manual tests are documented for real microphone permission prompts, mobile hardware behavior, and assistive technology combinations that were not available in this local run.

| ID | Type | Scenario | Status | Evidence |
| --- | --- | --- | --- | --- |
| S70-001 | automated | Explicit microphone activation required | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-002 | automated | Supported microphone session lifecycle | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-003 | automated | Permission denied fallback | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-004 | manual-real-browser | Permission accepted in real browser | blocked | Requires real browser microphone permission not available in this run. |
| S70-005 | manual-real-browser | Permission denied in real browser | blocked | Requires real browser permission prompt not available in this run. |
| S70-006 | manual-real-browser | Permission revoked while listening | blocked | Requires real browser permission controls not available in this run. |
| S70-007 | automated | Speech API unavailable | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-008 | automated | Device unavailable and disconnected errors | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-009 | automated | Network and language recognition errors | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-010 | automated | Late callback isolation | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-011 | automated | Pantry voice phrase review | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-012 | automated | Protected command policy | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-013 | automated | Generic confirmation rejection | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-014 | automated | Privacy-safe event payload | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-015 | automated | Legacy voice storage migration | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-016 | automated | No disability inference | pass | tests/cook-before-it-spoils-step-70-voice-safety.test.js |
| S70-017 | manual-assistive-tech | Screen reader fallback announcement | blocked | Requires real screen reader/browser combination not available in this run. |
| S70-018 | manual-mobile | Mobile device disconnection | blocked | Requires mobile hardware not available in this run. |
