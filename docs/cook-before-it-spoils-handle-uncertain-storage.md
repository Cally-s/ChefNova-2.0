# Cook Before It Spoils: Handling Uncertain Storage

## Purpose

Step 52 adds a conservative storage-safety layer for cooked and perishable foods when room-temperature exposure, hot-condition exposure, cooling, or temperature control is uncertain.

Chef Nova keeps factual storage records separate from derived safety decisions. A user record describes what happened. A derived decision explains how Chef Nova treats that record for recipe planning, meal planning, leftovers, freezing, shopping, and impact features.

## Safety Principle

Chef Nova must not turn uncertain storage history into a food-use recommendation. When time, temperature, or cooling information is missing or conflicting, the item is held for review. Confirmed over-limit exposure is excluded from recipe planning, meal planning, leftover transformation, and freezing workflows.

## Controlled Values

Storage exposure statuses:

- `confirmed-temperature-controlled`
- `confirmed-within-window`
- `at-threshold-review-required`
- `duration-uncertain`
- `temperature-uncertain`
- `confirmed-over-limit`
- `conflicting-information`
- `not-applicable`
- `review-required`
- `hard-excluded`
- `none-recorded`
- `unknown`

Storage environments:

- `refrigerated`
- `frozen`
- `hot-held`
- `cold-cooler`
- `normal-room-temperature`
- `hot-outdoor-conditions`
- `hot-vehicle`
- `power-outage`
- `transport-uncontrolled`
- `buffet-uncontrolled`
- `temperature-control-unknown`
- `other`

Evidence confidence:

- `measured`
- `timer-confirmed`
- `user-confirmed`
- `user-estimated`
- `device-recorded`
- `imported-confirmed`
- `limited`
- `unknown`
- `conflicting`
- `invalid`

Storage safety results:

- `eligible-for-further-evaluation`
- `conditional-review-required`
- `not-eligible-for-rescue-use`
- `not-applicable`
- `policy-unavailable`
- `conflict-review-required`

Reservation storage statuses:

- `storage-verified`
- `storage-review-required`
- `blocked-by-storage-safety`
- `storage-information-stale`

## Factual Exposure Record

Each storage exposure record stores the observed facts:

- source item and user scope
- environment type
- duration in minutes when known
- minimum and maximum duration when available
- confidence level
- measured temperature when available
- event context such as hot vehicle, outdoor heat, power outage, transport, or buffet
- source revisions and recorded timestamp

The record does not declare the food safe or unsafe.

## Derived Safety Decision

Each derived decision stores:

- the exposure records used
- the food classification
- the reviewed policy applied
- the evaluation status and result
- hard eligibility and exclusion codes
- allowed next actions
- source revisions and policy version

Derived decisions are recalculated from facts and policy. This keeps user-entered information auditable.

## Reviewed Policy Catalogue

Chef Nova now includes a small reviewed storage policy catalogue:

- normal room-temperature exposure for cooked and perishable foods uses a 120-minute review boundary
- hot outdoor and hot-vehicle exposure uses a 60-minute review boundary
- verified refrigeration, freezing, hot holding, or cold cooler storage can be eligible for further evaluation

These policies do not guarantee food safety. They only determine whether Chef Nova may continue evaluating the item.

## Decision Outcomes

`STORAGE INFORMATION NEEDS REVIEW` appears when Chef Nova cannot verify time or temperature control. Actions include `Review Storage Information` and `Record as Discarded`.

`STORAGE DURATION NEEDS CONFIRMATION` appears when storage occurred but the duration is unknown. Chef Nova does not recommend use. Actions include `Review Storage Information`, `Record as Discarded`, and `Review Later`.

`NOT ELIGIBLE FOR RECIPE PLANNING` appears when a cooked or perishable item is confirmed beyond the reviewed limit. Chef Nova blocks recipe planning, meal planning, leftovers, transformations, and freezing. Actions include `Record as Discarded` and `Review Recorded Information`.

`STORAGE INFORMATION RECORDED` appears when the storage exposure is within a reviewed window or temperature control was recorded. The item is only eligible for further evaluation. Chef Nova still checks original cooking time, refrigeration time, current storage duration, reheating history, food category, date intelligence, and the current meal date.

`HOT-CONDITION STORAGE REVIEW` is represented through hot outdoor and hot-vehicle environment choices and the 60-minute hot-condition policy.

## Workflow Rules

Safety decisions happen before recipe ranking, FEFO ranking, pantry coverage, rescue priority, budget savings, emergency planning, shopping suggestions, leftovers, transformations, freezing, reservations, and impact calculations.

Confirmed over-limit storage cannot be recovered through freezing, reheating, cooking again, adding fresh ingredients, or changing the recipe type.

Missing package dates and use-soon estimates cannot override uncertain or unsafe storage history.

Unknown quantity remains separate from storage safety. A quantity review cannot make storage history acceptable, and a storage review cannot create a precise quantity.

Each package is evaluated separately. A blocked package does not automatically block other packages of the same ingredient.

## User Interface

The Pantry storage review form now captures:

- whether exposure occurred
- unknown duration
- unknown temperature control
- approximate minutes
- timing confidence
- environment type
- measured temperature when available
- continuous storage and condition concerns

Chef Nova asks for facts. It does not ask users whether the food was safe.

## Guardrail Integration

The Food-Safety Guardrail consumes the derived storage decision:

- confirmed over-limit decisions become hard exclusions
- review-required decisions block automatic planning
- eligible-for-further-evaluation decisions continue through the existing safety guardrail

The guardrail disables automatic planning, date-driven rescue ranking, freezer recommendations, and leftover transformation when storage review blocks the item.

## Leftover Transformation

Leftover transformation checks storage safety before quantity or recipe logic. If storage is blocked, Chef Nova returns an unavailable transformation message and does not create a rescue path.

## Reservations

Reservation data now has storage status metadata. This allows future reservation views to show whether a held item is storage verified, needs review, is blocked by storage safety, or has stale storage information.

## Prohibited Logic

Chef Nova must not:

- use smell, taste, or appearance as proof of safety
- ask users to confirm whether food is safe
- recommend freezing to save excluded food
- recommend reheating to recover excluded food
- silently rank uncertain storage items as rescue candidates
- let budget savings override storage safety
- let emergency planning override storage safety
- let missing package-date estimates override storage review

## Validation Notes

Step 52 includes static checks for constants, policies, decision rendering, guardrail blocking, leftover transformation blocking, reservation metadata, documentation, and report coverage.

