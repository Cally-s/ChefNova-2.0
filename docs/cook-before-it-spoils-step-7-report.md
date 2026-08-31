# Cook Before It Spoils Step 7 Validation Report

## Goal

Step 7 added a deterministic Use-First Priority Engine for Chef Nova. The engine ranks pantry items by attention need and recipe-rescue usefulness without creating a backend, database, external API, or duplicate recipe eligibility system.

## Files Changed

- `app.js`
- `index.html`
- `style.css`
- `tests/cook-before-it-spoils-step-7-use-first-priority-static.test.js`
- `docs/cook-before-it-spoils-use-first-priority-engine.md`
- `docs/cook-before-it-spoils-step-7-report.md`

## Architecture

- Shared Use-First engine added: yes
- Attention priority score added: yes
- Rescue-recipe priority score added: yes
- Rescue score can be `null`: yes
- Food-Safety Guardrails run before rescue scoring: yes
- Deterministic tie-breaking added: yes
- Source/version metadata added: yes
- Human-readable reasons added: yes
- Pantry, dashboard, reminder, and Cook Before It Spoils views connected: yes

## Duplicate Engine Audit

- Second recipe-eligibility engines created: 0
- Existing recipe eligibility reused: yes
- Existing ingredient matching preserved: yes
- Existing recipe search reused for rescue actions: yes
- Existing Food-Safety Guardrails reused: yes
- Existing Date Intelligence reused: yes

## Score Inputs

The engine considers:

- Date urgency
- Date confidence
- Opened-package status
- Category risk
- Storage attention
- Quantity at risk
- Estimated remaining value
- Compatible recipe opportunities
- Already-planned coverage
- Already-frozen or preserved state
- Safety guardrail outcome
- Reminder state

## Safety Behavior

- Expired, unsafe, or hard-excluded items are blocked from automatic recipe rescue.
- Review-required items can appear for attention, but do not get recipe rescue priority.
- Items with no usable quantity are marked unavailable before rescue scoring.
- Missing price data is labeled unavailable instead of treated as zero value.
- Missing or uncertain dates reduce confidence and surface review context.

## UI Updates

- Pantry cards now show use-first priority badges.
- Dashboard summary now highlights high-priority use-first items.
- Cook Before It Spoils now groups pantry items by priority outcome.
- Priority detail modal explains each score and reason.
- Find Recipes action opens the existing Recipe Finder with the pantry item prefilled.
- No meal is scheduled automatically.
- No pantry quantity is deducted automatically.
- No shopping item is added automatically.

## Display Groups

- Use These First
- Review Before Planning
- Quality Review
- Already Planned
- Monitor
- Not Eligible for Automatic Planning

## Validation Coverage

Static validation checks confirm:

- Versioned engine constants exist.
- Score configuration is centralized.
- Safety classifications happen before recipe rescue scoring.
- Attention and rescue scores remain separate.
- Rescue scores are nullable.
- Recipe opportunity scoring reuses the existing eligibility engine.
- Priority ordering is deterministic.
- Reminder priority metadata is separate.
- Pantry badges, workflow groups, and modal hooks exist.
- Documentation exists.

## Tests Run

Completed after implementation:

- `node --check app.js`: passed
- `node --check rules.js`: passed
- `node --check data/recipes.js`: passed
- `node --check scripts/recipe-eligibility-ranking.js`: passed
- Parse `data/recipes.json`: passed
- `node scripts/validate-ingredient-data.js`: passed
- `node scripts/validate-price-data.js`: passed
- All 32 project tests in `tests/*.js`: passed

## Risks and Notes

- Browser verification may be limited when direct `file://` navigation is blocked by the test browser.
- Priority scores are deterministic estimates. They guide attention and recipe discovery but do not guarantee food safety.
- The safety warning remains visible in detailed priority explanations.
