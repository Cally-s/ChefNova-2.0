# Chef Nova Careful Discarded-Weight Estimation

## 1. Purpose

Chef Nova estimates discarded-food weight only when units are compatible or a validated conversion record exists. Unknown weight stays unavailable and is never treated as 0 g.

## 2. Existing Systems Reused

Step 29 reuses the existing Cost Engine Unit Registry, Ingredient Catalogue, prepared-food taxonomy, Pantry, Food Event History, Waste Diary projection, and Waste Dashboard projection.

## 3. Measurement Dimensions

Supported quantity dimensions are mass, volume, count, and servings. Mass and volume can convert within their own dimension. Count and servings remain valid without mass.

## 4. Exact Same-Dimension Conversions

Exact mass and volume conversions use the existing Unit Registry. For example, 1 kg becomes 1,000 g and 1 L becomes 1,000 mL. Exact conversion does not turn an approximate quantity into a measured one.

## 5. Cross-Dimension Conversions

Volume-to-mass, count-to-mass, serving-to-mass, and package-fraction-to-mass require validated records. Chef Nova does not assume that 500 mL equals 500 g.

## 6. Conversion Types

Controlled conversion types are exact unit, package net weight, package drained weight, serving weight, average unit weight, density, prepared batch weight, and user-reported weight.

## 7. Conversion Policy Schema

Policies include schema version, ID, version, type, subject identity, source quantity, target quantity, estimate factors, applicability, evidence, review status, and lifecycle state.

## 8. Content Governance

Draft, AI-generated draft, pending, suspended, retired, rejected, and unapproved records cannot drive consumer estimates. Only approved or approved-with-limitations records are usable.

## 9. Food Form and Size

Conversion applicability includes food identity, form, preparation state, and size class where required. A raw whole apple record does not automatically apply to cooked or sliced apple.

## 10. Volume-to-Mass

Density records must match the exact ingredient or prepared food, form, conditions, and review policy. Chef Nova does not use water density as a universal food rule.

## 11. Count-to-Mass

Count quantities need an approved average-unit-weight record. If no matching record exists, the count remains recorded and weight is unavailable.

## 12. Serving-to-Mass

Servings convert to mass only with confirmed serving weight for the exact package, prepared batch, leftover, or reviewed prepared-food record.

## 13. Package Fractions

Package fractions can use confirmed net food weight. Gross package weight and container weight are not used as food weight.

## 14. Prepared Food

Prepared-food weight does not come from unvalidated sums of raw ingredients. Cooking can change mass through evaporation, absorption, draining, and added ingredients.

## 15. Leftovers and Transformations

Leftovers and transformed leftovers use the current batch’s quantity and conversion metadata. Parent-batch weight is not reused after the food form or batch changes unless explicitly compatible.

## 16. Frozen and Thawed Splits

Frozen and thawed children inherit only compatible quantity metadata. Serving-only children remain weight-unavailable unless a confirmed serving-weight conversion exists.

## 17. Weight Confidence

Visible confidence labels are Measured weight, Exact unit conversion, Validated package estimate, Validated serving estimate, Validated average-weight estimate, Validated density estimate, User estimate, Low-confidence estimate, and Weight unavailable.

## 18. Range Propagation

Ranges are preserved:

```text
minimumWeight = minimumQuantity * minimumConversionFactor
pointWeight = pointQuantity * pointConversionFactor
maximumWeight = maximumQuantity * maximumConversionFactor
```

## 19. Unknown Weight

Unavailable weight displays:

```text
WEIGHT ESTIMATE UNAVAILABLE
Chef Nova recorded the discarded food but did not treat the unknown weight as 0 g.
```

## 20. Historical Conversion Snapshots

Discard events store the conversion basis, confidence, point/min/max grams, Unit Registry version, calculation version, timestamp, source revisions, and snapshot hash. Later conversion updates do not rewrite history.

## 21. Add Weight Information

Users may add event-specific measured or approximate mass. This appends a correction/enrichment event, preserves the original quantity, does not change Pantry, and does not create a second discard event.

## 22. Waste Diary

Waste Diary cards display recorded amount, estimated weight, range, confidence, missing-weight state, weight details, and Add Weight Information when needed.

## 23. Waste Dashboard

Waste Dashboard separates measured mass, exact unit conversions, validated estimates, user estimates, unknown entries, and non-mass coverage.

## 24. Cost Boundary

Cost estimation remains separate. Count, volume, and serving costs can be calculated with matching price units without forcing a mass estimate.

## 25. Pattern Boundary

Weight estimates do not increase pattern confidence, diagnose behavior, change shopping, or trigger package-size recommendations.

## 26. Corrections and Reversals

Corrections are append-only. Effective projections count only the latest effective event and do not double-count corrected records.

## 27. Migration

Legacy unsupported conversions are preserved as evidence and marked unavailable or needs review. Legacy 500 mL plus 500 g without density is not promoted to validated density.

## 28. User Isolation

Registered-user weight information stays user-scoped. Guest weight information remains temporary session data.

## 29. Accessibility

Weight sections use visible labels, fieldsets, legends, contextual button names, associated error text, live announcements, and text status that does not rely on color.

## 30. Responsive Design

Quantity, range, basis, and actions wrap or stack on mobile using the existing Waste Diary responsive layout.

## 31. Print and Export

Print output keeps original quantity, estimated weight, range, confidence, source, unavailable wording, and correction status.

## 32. Testing

Validation includes syntax checks, JSON parsing, ingredient and price validators, cost and price tests, Step 26-29 Waste Diary tests, and the full static test suite.

## 33. Deferred Work

Photo-based weight estimation, runtime AI guessing, nutrition-based conversion, environmental-impact calculation, carbon calculation, household comparisons, and behavioral diagnosis remain outside Step 29.
