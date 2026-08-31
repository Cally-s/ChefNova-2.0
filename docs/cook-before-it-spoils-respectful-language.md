# Chef Nova Respectful Language Policy

## 1. Purpose

Chef Nova communicates food, budget, safety, and planning information without blame, shame, coercion, or diagnosis.

## 2. Existing Systems Reused

Step 43 reuses the existing Food-Safety Guardrails, Pattern Detection, Actionable Insights, Notification Centre, Notification Fatigue settings, Impact Claims policy, validation messages, localization path, accessibility labels, and user-scoped storage.

## 3. Respect Versus Safety Clarity

Respectful wording does not soften hard safety exclusions. If a recorded expiration date has passed, Chef Nova says it will not recommend the item.

## 4. Decision Versus Wording

The language layer communicates existing decisions. It does not decide safety, allergies, recipe eligibility, patterns, budgets, notifications, reservations, or impact.

## 5. Message Intents

Controlled intents include informational status, planning suggestion, possible pattern, actionable insight, safety exclusion, safety review required, date information, budget limitation, partial plan, recipe limitation, portion suggestion, shopping advisory, reservation status, notification, impact estimate, data coverage, validation error, system error, confirmation, empty state, and migration review.

## 6. Tone Classes

Tone classes are Neutral Informational, Supportive Planning, Cautious Evidence, Firm Safety, Respectful Limitation, and Recovery Oriented.

## 7. Assertion Strength

Assertion strength values are confirmed fact, system policy, recorded observation, estimated result, possible interpretation, optional suggestion, and review required.

## 8. User-Blame Prevention

Messages prefer Chef Nova, the Pantry, the current plan, the recorded item, or the Waste Diary as the subject. They do not accuse the user.

## 9. Shame and Moral Judgment

Chef Nova does not use shame scores, moral ranking, blame-oriented impact claims, or ridicule.

## 10. Diagnosis Boundary

Chef Nova does not infer memory issues, mental-health conditions, motivation, cooking competence, or financial responsibility from food records.

## 11. Socioeconomic Respect

Budget and Emergency Plan messages describe constraints and safe options without calling budgets bad, unrealistic, or unaffordable.

## 12. Evidence Matching

Wording cannot be stronger than structured evidence. One record is one record; qualified Step 30 output is a possible planning pattern.

## 13. Absolute Language

Unsupported behavior claims using always or never are prohibited. Clear product policy statements may use direct language when supported.

## 14. Optional Suggestions

Suggestions use optional wording such as may help, preview, review, and keep current setting. Hard safety exclusions are not optional.

## 15. Action Labels

Action labels must be specific, neutral, descriptive, user controlled, and accessible.

## 16. Pattern Language

Pattern messages use “Possible Planning Pattern,” show incident count and time window, and state that the observation is not a judgment.

## 17. Actionable Insights

Insights are optional next steps. Applying an insight changes a preference only after review and confirmation.

## 18. Evidence Explanations

Evidence explanations describe records, thresholds, and limitations without proving character or behavior.

## 19. Portion Language

Portion suggestions describe recent recorded household use and preview options. They do not imply overeating or failure.

## 20. Leftover Language

Leftover messages preserve original timelines and unknown outcomes. Planned leftover use is not confirmed use.

## 21. Recipe Limitations

Recipe limitation messages explain that Chef Nova could not find a compatible recipe with current requirements and may show closest safe options.

## 22. Food-Safety Language

Food-safety wording preserves expiration, best-before, app-estimated freshness, storage review, and hard-exclusion distinctions.

## 23. Allergy and Dietary Language

Allergy and dietary protections are described as requirements, not user-created obstacles.

## 24. Budget Rescue

Budget Rescue wording keeps safety, allergy, dietary, appliance, and cooking-time requirements intact and offers lower-cost safe options.

## 25. Emergency Plan

Emergency Plan wording preserves dignity and never pressures a user to consume questionable food.

## 26. Shopping List

Shopping advisories are non-blocking and preserve the option to keep an intentional extra package.

## 27. Meal Calendar

Calendar messages describe reservations, cancellations, and outcome review without failure language.

## 28. Notifications

Notification wording is factual and does not infer ignoring, forgetting, or waste behavior.

## 29. Notification Fatigue

Off, snooze, and dismissal messages explain timing changes and state that Pantry dates, safety eligibility, and source records were not changed.

## 30. Waste Diary

Waste Diary prompts record outcomes and optional reasons without asking users to justify blame.

## 31. Impact Dashboard

Impact labels remain possible, estimated, confirmed, or unavailable according to the existing Impact Claims policy.

## 32. Errors and Recovery

Errors explain what could not be completed, what remained unchanged, and what the user can do next.

## 33. Empty States

Empty states acknowledge limits of Chef Nova’s records and avoid overclaims.

## 34. Data Coverage

Missing prices, weights, and records are unavailable or partial. They are not blamed on the user and not treated as zero.

## 35. User-Authored Content

User notes and labels remain user-authored. Chef Nova does not adopt judgmental notes as conclusions.

## 36. Policy Registry

`languageGuidelines.js` defines one versioned policy registry with global rules, controlled intents, tone classes, required disclosures, and prohibited concepts.

## 37. Message Presentation

Each generated message presentation includes version, ID, template, intent, tone class, assertion strength, heading, body, evidence summary, limitations, safety directive, suggestion, actions, accessibility text, localization key, and source revisions.

## 38. Prohibited-Language Scanner

The scanner flags blame, shame, moral judgment, diagnosis, socioeconomic judgment, unsupported absolutes, coercion, unsupported causality, safety ambiguity, safety overriding, invalid personalization, and manipulative action labels. Documentation, tests, internal logs, and user-authored content can use explicit exceptions.

## 39. Runtime Validation

Dynamic toasts and saved notification messages are scanned before display. Invalid wording falls back to “Message needs review” without changing source records.

## 40. Localization

Localization validation checks semantic tokens such as possible, recorded, estimated, optional, review required, will not recommend, and keep current setting.

## 41. Accessibility

Visible and assistive wording must preserve the same evidence, uncertainty, safety clarity, and user control.

## 42. Print and Export

Printed pages and exported summaries must use the same respectful templates, estimate labels, safety directives, and evidence limits as the visible app.

## 43. Corrections and Reversals

When records are corrected or reversed, messages must be regenerated from current source data before actions remain available.

## 44. Stale and Multi-Tab Protection

Message IDs include template, source revision, policy version, and locale. Current source revisions must be used before action.

## 45. User Isolation

The policy is shared read-only data. Personal wording, evidence, patterns, budgets, notifications, and guest records remain scoped to the active user or guest session.

## 46. Testing

Validation uses syntax checks, static Step 43 checks, prohibited-phrase scanner checks, localization semantic checks, accessibility wording checks, and existing safety, pattern, notification, and impact tests.

## 47. Deferred Work

Behavioral diagnosis, sentiment analysis of private notes, shame scoring, moral ranking, public comparison, and AI judgment of user character remain outside Step 43.
