# Cook Before It Spoils Freezing Suitability Catalogue

## Goal

Step 21 adds a source-controlled Freezing Suitability Catalogue for Chef Nova's Freezer Assistant. It keeps safety eligibility, freezer suitability, texture guidance, thawing guidance, and quality-window language separate.

## Files

- `data/freezer-guidance.json` is the reviewed source file.
- `data/freezer-guidance.js` is the direct-`index.html` fallback.
- `app.js` loads, validates, resolves, and renders guidance.
- `data/ingredients.json` and `data/ingredients.js` may reference freezer policy IDs, but they do not become a second freezer catalogue.

## Governance

AI may draft freezer guidance only as `draft-ai-generated`. Draft AI records cannot approve themselves, cannot set `canFreeze: true`, and cannot appear as consumer-facing recommendations.

Approved consumer guidance requires:

- `review.status` of `approved` or `approved-with-limitations`
- `review.generatedBy` not equal to `ai`
- active lifecycle status
- evidence records
- matching `contentHash` and `approvalContentHash`
- a human reviewer ID

Suspended, retired, draft, rejected, or hash-mismatched records resolve to review-required or unavailable.

## Subject Types

Supported freezer policy subjects are:

- `ingredient`
- `prepared-food`
- `prepared-leftover-category`
- `recipe`
- `product-label-override`
- `ingredient-category`
- `general-fallback`

Resolution order is conservative:

1. Existing Food-Safety Guardrail
2. Product-label override
3. Prepared leftover category or form
4. Prepared food
5. Ingredient and form
6. Ingredient category
7. General fallback
8. Policy unavailable

## Suitability Statuses

Controlled suitability values are:

- `recommended`
- `conditionally-recommended`
- `possible-with-quality-change`
- `not-recommended-for-quality`
- `not-eligible-for-safety`
- `review-required`
- `policy-unavailable`
- `unknown`

Only approved or approved-with-limitations policies may resolve to `canRecommendFreezing: true`.

## Schema Areas

Each policy can include:

- applicability rules
- suitability decision
- preparation actions
- blanching requirements
- packaging guidance
- texture changes
- recommended uses after freezing
- quality window
- thawing guidance
- cook-from-frozen guidance
- refreezing policy
- contraindications
- evidence
- review metadata
- lifecycle metadata

Quality windows are for best quality only. They are not expiration dates or safety deadlines.

## Reused Systems

Step 21 reuses existing Chef Nova systems:

- Ingredient Catalogue
- Pantry item schema
- prepared-leftover batch schema
- Food-Safety Policy Catalogue
- Food-Safety Guardrail service
- storage environment and freezer profile
- Date Intelligence
- Original Leftover Timeline
- Food Event History
- Pantry command pipeline
- batch-splitting workflow
- recipe database, tags, and ranking
- shopping list and Cost Engine
- user-specific and guest storage
- existing accessible modal patterns

## Current Catalogue Entries

Version 1 includes:

- Approved-with-limitations guidance for cooked prepared leftovers.
- A quarantined `draft-ai-generated` spinach record that cannot produce consumer freezer guidance.

The spinach draft demonstrates the review workflow without inventing blanching, thawing, texture, or quality-window instructions.

## Consumer Behavior

The Use These First panel can show `Can Be Frozen` only when:

- the Food-Safety Guardrail does not block the item
- available quantity is known and greater than zero
- the item is not already frozen
- freezer storage is recorded and within guidance
- an approved freezer policy matches the item

Opening Freeze Options is informational. It does not change storage, dates, quantities, events, or pantry records.

## Admin Review Model

`renderFreezerGuidanceAdminReviewInterface()` provides a review-focused summary for a policy. `validateFreezerPolicyApprovalRequest()` blocks AI approval, missing reviewer identity, missing high-risk fields, invalid schema values, missing evidence, and approval hash mismatches.

## Legacy Migration

Older `freezerWindow` or recipe freezer-support fields remain reference data only. Unsourced boolean flags do not become approved freezer policies automatically. Migration is idempotent and marked as reference-only unless a human-reviewed policy is created.
