# Chef Nova Responsible Impact Claims

## 1. Purpose

Chef Nova reports recorded rescue outcomes without overstating environmental, financial, precision, or causal impact. Confirmed use can support a recorded outcome, but it cannot prove what would have happened without Chef Nova.

## 2. Existing Systems Reused

Step 36 reuses Step 33 metric contracts, Step 34 effective Impact Ledger, Step 35 Monthly Impact Dashboard, Price Catalogue, Price Resolver, Cost Engine, Unit Registry, weight conversions, Food Event History, date confidence, coverage, and existing user storage.

## 3. Claim Classes

Claim classes are confirmed activity, confirmed count, estimated quantity, estimated value, possible counterfactual, current stock, contextual statistic, environmental claim, and unavailable.

## 4. Counterfactual Language

“Possible Food Waste Avoided” remains possible because Chef Nova can record a qualifying outcome but cannot prove the food would otherwise have been discarded.

## 5. Estimate Triggers

Estimate wording is triggered by approximate quantity, qualitative quantity, average item weight, estimated serving weight, density conversion, package fraction, user-estimated weight, estimated price, user-entered date, app-estimated freshness, incomplete records, partial coverage, proportional lineage, incomplete lineage, and mixed confidence.

## 6. Precision Propagation

Output precision cannot exceed the least certain material input. Exact arithmetic does not upgrade approximate source data.

## 7. Confirmed Counts

A count may be confirmed only when every counted incident is confirmed, complete, identity-stable, date-supported, and free of unresolved correction or lineage issues.

## 8. Estimated Quantities

Estimated quantities preserve point values, ranges, approximate wording, confidence, and coverage. Missing quantity is not treated as zero.

## 9. Estimated Food Value

Estimated Food Value Saved is historical proportional food value. It is not a cash refund, money earned, profit, guaranteed savings, or future budget result.

## 10. User-Entered Dates

User-entered dates and app-estimated priority dates remain disclosed. App-estimated freshness windows are not represented as official expiration dates.

## 11. Partial Coverage

Known subtotals are labelled as recorded values across included records. Missing price, weight, serving, date, quantity, or lineage information is not counted as zero.

## 12. True Zero Versus Unavailable

Valid zero means no qualifying recorded outcomes occurred. Unavailable means qualifying outcomes exist but compatible data is missing.

## 13. Food Protected for Later Use

Frozen food is Food Protected for Later Use. It is not yet counted as possible food waste avoided, food saved, or money saved.

## 14. Environmental Claims

Step 36 does not calculate carbon, water, landfill, climate, sustainability, or environmental scores. Environmental impact estimates are not available in this version.

## 15. Environmental Methodology Readiness

Future environmental claims would require ingredient-specific factors, food-form applicability, geography, lifecycle boundaries, uncertainty propagation, reviewed datasets, historical snapshots, corrections, reversals, and explicit limitations. No universal fallback factor is allowed.

## 16. Claim Policy Registry

The versioned registry defines claim class, causality, default label, estimated label, estimate triggers, required disclosures, prohibited phrases, and environmental-readiness behavior.

## 17. Claim Presentation Model

The presentation model stores metric ID, claim class, title, primary value, range, precision, causality, confidence, coverage, qualifiers, uncertainty reasons, definition, caution, environmental readiness, screen-reader label, export label, print label, source revisions, and idempotency key.

## 18. Claim Audit

The audit model records claim class, precision, causality, estimate triggers, qualifier decisions, environmental readiness, suppressed prohibited claims, and source revisions.

## 19. Dashboard Integration

Monthly Impact cards consume the shared claim-presentation model. Contextual sections stay contextual and do not make causal or environmental claims.

## 20. Chart Integration

Trend titles use estimate wording. Accessible tables keep currency, coverage, estimate labels, and source counts. No environmental series or carbon axis is added.

## 21. Accessibility

Qualifiers are visible text and included in screen-reader labels. Confidence, coverage, range, caution, and environmental unavailable notices remain readable with keyboard, zoom, large text, high contrast, and mobile layouts.

## 22. Print and Export

Print and export preserve claim class, precision, causality, confidence, coverage, qualifiers, range, currency, counterfactual caution, and environmental readiness.

## 23. Localization

Safety-critical claim wording should use complete semantic templates for confirmed, measured, estimated, approximate, possible, partial coverage, unavailable, and protected for later use.

## 24. Prohibited-Phrase Scanning

Development tests scan active user-facing impact strings for prohibited environmental and causal phrases. Documentation and explicit rejection tests may include prohibited examples.

## 25. Corrections and Reversals

Corrections and reversals rebuild the effective ledger, dashboard model, claim presentation, coverage, confidence, ranges, and qualifier decisions.

## 26. Historical Stability

Historical arithmetic values, price snapshots, weight snapshots, and source records are not silently rewritten by later policy wording changes. Safer current wording may be applied in the UI.

## 27. User Isolation

Registered-user claim values and audits derive from account-scoped records. Guest claim presentations are temporary and recalculated after sign-in.

## 28. Testing

Validation includes syntax checks, Step 35 dashboard checks, Step 36 responsible-claim checks, prohibited-phrase scanning, and direct tests for measured, estimated, partial, unavailable, environmental, print, export, accessibility, user-isolation, guest, stale, and idempotency scenarios.

## 29. Deferred Work

Environmental methodology, carbon estimates, water footprints, landfill estimates, lifecycle assessment, environmental scores, public comparisons, gamification, leaderboards, and causal-effect evaluation remain outside Step 36.

