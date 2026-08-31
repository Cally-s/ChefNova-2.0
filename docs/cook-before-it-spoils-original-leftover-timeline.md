# Cook Before It Spoils: Original Leftover Timeline

## Goal

Chef Nova keeps one shared timeline for every prepared leftover batch. The timeline starts with the original cooked time and does not reset when the food is transformed, reheated, frozen, thawed, or mixed with fresh ingredients.

## Core Rule

`originalCookedAt` is the safety anchor for the physical leftover lineage. `currentPreparedAt` describes the current dish form, but it does not extend the original safety window.

## Data Model

Prepared leftovers keep these timeline fields:

- `originalCookedAt`: immutable original cooking timestamp.
- `currentPreparedAt`: current dish preparation timestamp.
- `transformedAt`: latest transformation timestamp stored on the batch snapshot.
- `lastReheatedAt`: latest reheating timestamp stored on the batch snapshot.
- `reheatCount`: derived from effective Food Event History.
- `lineage.rootMealIds`: original meal roots for the batch.
- `lineage.parentLeftoverBatchIds`: parent batches for transformed leftovers.
- `storage.currentStorageStartedAt`: current storage segment start.

## Shared Derivation Service

`deriveLeftoverTimeline()` is the single application model for leftover timeline decisions. Pantry cards, food-safety guardrails, Use These First, transformation candidates, and freezing visibility use this shared derivation.

## Inputs

The derivation accepts:

- the prepared leftover batch
- effective Food Event History
- the existing food-safety policy record
- reference date/time
- time zone

## Outputs

The timeline snapshot includes:

- status
- original cooked time
- current prepared time
- last transformed time
- last reheated time
- reheat count
- storage segments
- original age
- effective safety anchor
- effective safety deadline
- remaining time
- freezing eligibility
- hard exclusion and review flags
- reason codes
- warnings
- policy and source revision metadata

## Policy Source

The timeline uses the existing Step 6 Food-Safety Policy Catalogue. It does not fetch policies at runtime and does not create a duplicate policy system.

## Transformations

Transformations create a new dish form, but the transformed portion inherits the original source deadline. Adding fresh ingredients does not extend the original leftover timeline.

## Reheating

Reheating does not reset the original cooked timeline.

Reheating is tracked through Food Event History. A heated transformation records a `REHEATED` event for the transformed portion only. Untouched source quantity is not marked reheated.

## Partial Quantities

Partial transformations and partial reheats apply only to the affected physical quantity. The remaining source batch keeps its own effective timeline and quantity.

## Freezing and Thawing

Freezing options are shown only when the shared timeline and food-safety guardrail both allow it. Freezing preserves an eligible state for review, but it does not make an excluded leftover eligible again.

## Pantry Display

Prepared leftover details show an Original Leftover Timeline panel with original cooked time, current dish prepared time, transformation and reheating history, storage segments, effective deadline, policy evidence, and warnings.

## Use These First

Prepared leftover reminder filters use the shared timeline. Today, next three days, and freeze-option membership are based on the original timeline deadline.

## Transformation Planning

Transformation candidates are blocked when the source timeline is expired, requires review, exceeds the reheat limit, or would be used after the original deadline.

## Saved Paths

Transformation paths keep safety summary data for each step, including original cooked time, effective deadline, safety margin, and transformation reheat effect.

## User Correction

Pantry details expose a Correct Timeline Record action. Existing correction and review tools remain the route for updating quantity, storage, or timeline evidence.

## Safety Messaging

Chef Nova states that transformations, reheating, freezing, thawing, and fresh ingredients do not reset the original timeline. Safety notices remain advisory and do not guarantee food safety.

## Direct File Support

The timeline is implemented in `app.js` and works when `index.html` is opened directly. No backend, database, or external API is required.
