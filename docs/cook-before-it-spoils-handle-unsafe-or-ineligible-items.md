# Chef Nova Unsafe and Ineligible Item Handling

## 1. Purpose

Chef Nova must not recommend food when current food-safety, allergy, or required dietary rules block the action. Hard exclusions cannot be bypassed by budget, recipe ranking, food rescue, preferences, substitutions, or emergency planning.

## 2. Existing Systems Reused

Step 54 reuses the existing Pantry, package records, leftover inventory, freezer inventory, Food-Safety Guardrails, Date Intelligence, storage decisions, allergy profile, dietary profile, recipe hard filters, substitution engine, Priority Engine, FEFO allocator, Shopping List, Budget Rescue, Emergency Plan, Meal Calendar, reservation system, Waste Diary, notifications, Food Event History, Impact Ledger, localization, user storage, and guest storage.

## 3. Eligibility Categories

Chef Nova separates hard food-safety exclusions, hard allergy exclusions, required dietary exclusions, review-required states, action-specific ineligibility, and planning incompatibility. Planning incompatibility does not mean the food itself is unsafe.

## 4. Decision Order

Eligibility checks resolve user scope, exact source record, meal participants, food identity, allergies, required dietary rules, true expiration, storage, leftover timeline, thawing, reheating, meal date, reservations, quantity, appliance compatibility, and recipe compatibility before any score is calculated.

## 5. Eligibility Statuses

Controlled statuses are `eligible`, `eligible-with-limitations`, `review-required`, `hard-excluded-food-safety`, `hard-excluded-allergy`, `hard-excluded-dietary`, `action-specifically-ineligible`, `planning-incompatible`, `conflicting-information`, `policy-unavailable`, `stale`, and `not-applicable`.

## 6. Reason Severities

Reason severities are `hard-block`, `review-block`, `action-block`, `planning-block`, and `informational`. Hard blocks cannot be bypassed. Review blocks require factual review or correction.

## 7. Reason Categories and Codes

Reason categories cover food safety, allergy, dietary, date, storage, leftover timeline, reheating, freezing, thawing, food form, meal date, quantity, reservation, appliance, recipe compatibility, and policy. Reason codes are controlled values such as `recorded-expiration-date-passed`, `storage-duration-uncertain`, `saved-allergen-match`, `required-dietary-conflict`, and `additional-reheat-not-permitted`.

## 8. Decision Scopes

Decision scopes include physical item, package or lot, leftover batch, frozen segment, current user, household, meal participants, meal, recipe, recipe action, and substitution. An allergy decision can be meal-specific without marking the food globally unsafe.

## 9. Meal-Participant Allergies

Chef Nova resolves allergies for every protected person included in the meal. In-app details can name the allergen; external notifications use privacy-safe wording.

## 10. Action Capabilities

Capabilities are calculated per action: cold recipe, heated recipe, reheat, transform leftover, freeze, thaw, reserve, count as Pantry coverage, count as budget savings, add to Emergency Plan, donate or share, record discarded, keep recorded, and review information.

## 11. Unified Decision Model

The derived decision stores version, decision ID, user scope, source type and revision, decision scope, overall status, hard-excluded flag, review-required flag, reasons, capabilities, prohibited actions, source revisions, policy versions, and calculated time. It never changes physical Pantry data.

## 12. Multiple Reasons

Chef Nova shows every material active reason. Reasons are ordered by hard food safety, allergy, dietary, review required, action block, planning block, and informational reasons.

## 13. No-Bypass Policy

Hard exclusions do not render use-anyway, freeze-anyway, reheat-anyway, override-allergy, ignore-restriction, force-include, or accept-risk actions.

## 14. Defence in Depth

Eligibility is enforced in recipe generation, substitutions, plan generation, plan repair, save plan, replace meal, Start Cooking, reservation creation, Shopping List coverage, Budget Rescue, Emergency Plan, freezing, direct route actions, stale-client checks, and local offline replay patterns.

## 15. Correction Versus Override

Users may correct factual information such as date type, storage time, food form, reheating count, participants, allergy profile, or dietary profile. A correction preserves history and triggers recalculation; it does not directly set hard-excluded to false.

## 16. True Expiration

A passed recorded true expiration date is a hard food-safety exclusion. It blocks recipes, substitutions, reservations, leftover transformations, freezing, Pantry-first budget coverage, Emergency Plan inclusion, and Start Cooking.

## 17. Best-Before Boundary

Best-before dates are quality guidance, not true expiration dates. A passed best-before date may create quality review, but it is not labelled as `expiration date passed`.

## 18. Uncertain Storage

Uncertain storage creates Review Required. Chef Nova blocks automatic food-use recommendations, leftover transformations, freezing, Pantry coverage, Budget Rescue, Emergency Plan use, and reservations until facts are reviewed.

## 19. Reheating

Reheating decisions are action-specific. Previously reheated food is not globally excluded solely because it was reheated once. If another reheat is blocked, Chef Nova states that the recorded reheating history does not permit another reheat under the current reviewed policy.

## 20. Thawing

Uncertain thawing blocks refreezing and food-use recommendations that depend on unverified thawed food. Thawed and frozen dates remain preserved.

## 21. Leftover Timelines

Leftover timelines anchor to the original cooked date. Reheating, transforming, freezing, moving containers, or calendar changes do not restart the safety window.

## 22. Allergy Protection

Allergies apply to recipe ingredients, structured optional ingredients, sauces, substitutions, leftovers, and selected Pantry sources. Missing allergy metadata is not treated as safe.

## 23. Dietary Protection

Required dietary restrictions are hard filters. Optional preferences and cuisine preferences remain ranking inputs and are not safety exclusions.

## 24. Recipe Planner

Recipe planner excludes hard-blocked and review-required ingredients before ranking. Cost, Pantry coverage, rescue value, and preferences cannot restore a blocked candidate.

## 25. Recipe Cards

Ineligible recipe cards show visible status and reasons. They are not selectable and do not include bypass controls.

## 26. Substitutions

Every substitution revalidates allergies, required dietary rules, food safety, food form, appliances, meal date, reheating, storage, and quantity.

## 27. Pantry Coverage

Physical quantity and eligible quantity are separate. Excluded or review-required food remains recorded but contributes zero eligible Pantry coverage for the blocked action.

## 28. Multiple Packages

Each package is evaluated independently. One package’s exclusion does not automatically exclude another package of the same ingredient.

## 29. Partial Packages

Excluded partial packages keep original package size, current remaining quantity, quantity confidence, date, opening state, storage history, price, and package identity.

## 30. Unknown Quantities

Unknown quantity does not weaken an exclusion. Chef Nova does not invent numeric coverage or discard estimates for unknown excluded quantities.

## 31. Missing Dates

Missing package dates do not create hard expiration exclusions. Use-Soon Estimates may support planning only when storage, allergy, dietary, and policy checks permit it.

## 32. Cancelled Meals

Cancelled meal reservation release does not restore eligibility. Released food may remain excluded or review-required.

## 33. FEFO

FEFO ranks only eligible packages for the current action and target date. Excluded and review-required packages receive no FEFO rank.

## 34. Shopping List

Excluded food is not counted as available. Shopping List demand remains as a purchase or asks the user to choose another recipe.

## 35. Budget Rescue

Budget Rescue never restores excluded food to meet a budget. Safe plan cost is shown without weakening food-safety, allergy, or required dietary rules.

## 36. Emergency Plan

Emergency Plan uses the same hard exclusions. Low budget or urgent timing cannot pressure a user to consume excluded food.

## 37. Reservations

Reservations are not created for hard-excluded food. Existing reservations can become blocked or review-required when eligibility changes.

## 38. Start Cooking

Start Cooking revalidates source revision, food safety, allergies, dietary rules, storage, date, reheating, reservations, and meal participants. If blocked, no Pantry quantity, reservation, or meal plan is changed.

## 39. Freezing

Freezing is unavailable for true-expired, storage-review, storage-excluded, thawing-review, blocked-reheat, or otherwise hard-excluded food. Opening a review does not mark food frozen.

## 40. Donate or Share

Sharing can appear only when food remains food-safety eligible and policy permits it. Allergy conflict for the current meal does not automatically mean discard.

## 41. Waste Diary

Record as Discarded uses the existing respectful Waste Diary. It requires exact source identity, quantity review, and confirmation before any physical outcome is recorded.

## 42. Physical Outcome Boundary

Eligibility calculation, exclusion display, review details, replacement previews, Shopping List recalculation, and notifications create no physical outcome. Only confirmed canonical actions can create used, discarded, shared, frozen, thawed, or corrected events.

## 43. Impact Ledger Boundary

Exclusions create no rescue impact, money-saved credit, food-protected credit, or avoided-cooking credit. Later confirmed discard may affect Waste Diary analytics but not rescue impact.

## 44. Priority Engine

Food-use priority is separate from review priority. Excluded food can have high review priority without receiving a use-today recommendation.

## 45. Notifications and Privacy

Eligibility notifications bundle material reasons and avoid notification fatigue. External notifications avoid allergy names, participant names, dietary details, storage details, and Waste Diary reasons by default.

## 46. Policy Versioning

Decisions store food-safety, storage, reheating, thawing, allergy, dietary, and eligibility policy versions. Policy updates recalculate active decisions without rewriting completed physical history.

## 47. Stale and Multi-Tab Protection

Source revisions, policy versions, request IDs, and idempotency keys prevent stale tabs from using, reserving, freezing, or discarding food after eligibility changes.

## 48. Migration

Legacy `unsafe: true` is preserved as migration evidence and recalculated from current facts. Legacy `useAnywayAllowed: true` is not preserved as an active bypass.

## 49. Data Protection

New eligibility fields are optional and backward-compatible. Existing Pantry items, quantities, packages, dates, storage history, reheating history, leftovers, allergies, dietary profiles, recipes, meal plans, reservations, Shopping Lists, prices, event history, impact history, and unknown fields are preserved.

## 50. User Isolation

Registered users see only their own eligibility decisions, profiles, participants, Pantry records, reservations, notifications, and outcomes. Guest eligibility state remains temporary and is recalculated after sign-in.

## 51. Accessibility

Eligibility displays use visible headings, semantic reason lists, textual status labels, accessible action names, focusable controls, concise live-region announcements, and wording that does not rely on color.

## 52. Responsive Design

Mobile excluded-item cards show compact primary actions and wrap reason text. More actions contain only compatible review or outcome actions.

## 53. Print and Export

Print and export preserve overall status, reason codes, categories, severity, scope, policy versions, capabilities, and `overrideAllowed: false`.

## 54. Testing

Step 54 validation covers syntax, controlled values, shared presentation, no-bypass labels, reservation enforcement, Start Cooking enforcement, freezing enforcement, documents, and focused static checks.

## 55. Deferred Work

User-facing safety overrides, AI safety judgments, automatic allergy removal, automatic dietary removal, automatic discarding, automatic physical outcomes, automatic impact recognition, cloud synchronization, environmental-impact calculations, and server-side APIs remain outside Step 54.
