# Step 69 Accessibility and Language Test Plan

## Scope

This plan covers Chef Nova accessibility, language, display, offline, recovery, and feedback testing for Step 69.

## Local Execution

The current repository is a static HTML/CSS/JavaScript app. Existing automated tests use Node and static/module assertions. Step 69 adds automated checks using the same stack.

## No-False-Pass Rule

Automated checks are reported separately from real browser, real device, real screen-reader, fluent reviewer, and user-testing evidence. Blocked and not-run rows are not counted as passing.

## Required Workflow

1. Run "node scripts/generate-step-69-accessibility-matrix.js".
2. Run "node tests/cook-before-it-spoils-step-69-accessibility-language-matrix.test.js".
3. Run focused Step 65-68 regression tests.
4. Run the full local test folder.
5. Execute manual scripts in real environments.
6. Update "TEST_MATRIX.json" and "TEST_MATRIX.csv" with real evidence and retest results.

## Synthetic Test Data

Use only the synthetic fixtures in "tests/fixtures/step-69-accessibility-fixtures.js". Do not use real pantry, allergy, health, budget, Waste Diary, voice, or participant data.