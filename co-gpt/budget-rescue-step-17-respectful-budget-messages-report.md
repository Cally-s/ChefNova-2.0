# Budget Rescue Step 17 — Respectful Budget Messages Report

## Goal

Add one centralized respectful budget-message layer so Chef Nova explains budget, price, partial-plan, and Shopping List coverage states without blame or affordability judgments.

## Files Changed

- `app.js`
- `style.css`
- `tests/respectful-budget-messages-static.test.js`
- `docs/respectful-budget-messages.md`
- `docs/respectful-budget-message-report.md`
- `co-gpt/budget-rescue-step-17-respectful-budget-messages-report.md`

## Existing Systems Reused

Chef Nova reuses the existing Cost Engine, Price Confidence system, Pantry-first planner, recipe eligibility engine, Budget Planning Algorithm, substitution review, Shopping List, Budget Status panel, Emergency Plan flow, Save Plan workflow, and Replace Meal workflow.

## Implementation Summary

- Added `RESPECTFUL_BUDGET_MESSAGE_POLICY`.
- Added controlled `RESPECTFUL_BUDGET_MESSAGE_TYPES`.
- Added targeted prohibited-language safeguards.
- Added `deriveRespectfulBudgetMessage()` as the single message view model.
- Added normalized action models with stable action IDs.
- Connected Budget Status and Emergency Plan summaries to the shared message model.
- Updated Shopping List coverage warnings so removed required items cannot create false budget success.
- Added a four-day preview action that keeps the longer plan unchanged until confirmation.
- Added responsive, print, reduced-motion, and high-contrast CSS support.
- Added Step 17 static tests and documentation.

## Required Zero Results

- Judgmental budget messages rendered: 0
- Affordability judgments rendered: 0
- Allergy-removal suggestions rendered: 0
- Dietary restrictions automatically removed: 0
- Incomplete totals labelled within budget: 0
- Missing prices treated as zero: 0
- Non-functional action buttons displayed: 0
- Stale action counts displayed: 0
- Unsafe actions counted as possible changes: 0
- Required groceries removed to create false savings: 0

## Validation

Validation covered syntax, prohibited-language checks, dynamic action counts, missing-price priority, Shopping List shortfall priority, Budget Status integration, Emergency integration, accessibility markers, duplicate-system protection, ingredient data, price data, cost engine, price confidence, pantry-first planning, Budget Rescue planning, substitutions, Shopping List, and Emergency Plan static checks.

## Notes

Messages are derived presentation state. No new localStorage key, backend, live grocery-price API, retailer scraping, duplicate Cost Engine, duplicate Pantry, duplicate Shopping List, or duplicate Budget Status panel was added.
