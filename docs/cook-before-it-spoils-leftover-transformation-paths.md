# Chef Nova Leftover Transformation Paths

## 1. Purpose

Leftover Transformation Paths connect measurable prepared-leftover Pantry batches to existing Chef Nova recipes. They are previews until the user saves a path, and source quantity is deducted only after a transformation meal is confirmed as prepared.

## 2. Existing Systems Reused

Step 17 reuses prepared-leftover Pantry inventory, the Recipe Database, hard filters, Food-Safety Guardrails, practical scaling, Pantry allocation, Shopping List demand, Cost Engine estimates, Meal Planner calendar, Pantry reservations, Food Event History, registered-user storage, and guest session storage.

## 3. Prepared-Food Types and Forms

Rules use canonical prepared-food type IDs such as `cooked-chicken`. Prepared forms are separate and include roasted, grilled, poached, plain cooked, breaded, sauced, and mixed-dish forms. Display-name text alone is not enough to create a match.

## 4. Transformation-Rule Schema

Each rule stores a schema version, stable rule ID, source prepared-food type, allowed prepared forms, allowed quantity bases, target recipe ID, target recipe variant ID, target ingredient occurrence ID, quantity requirement, allowed methods, source preparation constraints, lineage policy, status, and metadata.

## 5. Recipe Reference Boundary

Transformation rules do not copy recipe titles, ingredient lists, allergens, dietary tags, appliances, cooking time, servings, instructions, prices, or images. Existing recipes remain authoritative.

## 6. Transformation Methods

Supported methods include cold assembly, reheated assembly, heated-in-new-dish, direct addition, blended-in-new-dish, and baked-in-new-dish. Each candidate chooses one explicit method.

## 7. Quantity Requirements

Requirement modes are target ingredient occurrence, fixed, per serving, and range. Current production rules normally read the target occurrence and use reviewed conversion metadata when recipe units need a prepared-food mass estimate.

## 8. Rule Validation and Indexing

Rules validate schema version, source type, forms, quantity bases, target recipe, target occurrence, method values, and lineage policy before candidate generation. Valid rules are indexed by prepared-food type, form, target recipe, target occurrence, method, and status.

## 9. Source-Batch Revalidation

Every source batch is revalidated for lifecycle, known positive quantity, active reservations, quantity basis, prepared identity, prepared form, lineage, original cooked time, storage, preservation, reheating, and Food-Safety Guardrails.

## 10. Candidate Generation

Single-step candidates load the existing recipe, target the referenced ingredient occurrence, choose one method, calculate source use, check safety and user requirements, calculate additional groceries, and score only eligible results.

## 11. Allergy and Dietary Validation

Candidate validation includes the target recipe and the source prepared food. A chicken source is not treated as vegetarian or allergen-free merely because the target recipe was originally compatible.

## 12. Serving and Practical Scaling

Candidates preserve existing serving and practical-scaling boundaries. Unsupported serving profiles are excluded before scoring.

## 13. Additional Groceries and Cost

Additional groceries exclude the source leftover occurrence. Cross-step package groups are aggregated so duplicate packages are not charged per path step. Missing prices remain incomplete.

## 14. Single-Step Transformations

Single-step candidates include candidate version, source batch, target recipe, method, target date, meal slot, source quantity use, projected remaining quantity, serving summary, purchase summary, safety summary, score, reasons, and source revisions.

## 15. Transformation Path Model

Paths include path version, preview status, source-batch ledger, chronological steps, path metrics, score, score level, explanation reasons, and source revisions.

## 16. Bounded Path Generation

Path search is deterministic and bounded by versioned configuration: maximum three steps, twelve candidates per source, forty partial paths per depth, and ten returned paths.

## 17. Quantity Conservation

Each source batch has one temporary ledger. Planned allocations may never exceed current unreserved source quantity.

## 18. Target Dates and Safety Windows

Original cooked time remains the safety anchor. Target dates cannot replace cooked time, reheated time, frozen time, or plan-view time.

Reheating history is inherited by every transformation candidate. Heated methods are excluded when the source batch or segment has already reached the confirmed reheat limit.

## 19. Path Scoring

Scoring prioritizes source coverage, practical fit, Pantry coverage, cross-step grocery reuse, grocery burden, cooking practicality, variety, and safety margin. Hard-filter failures are excluded, not penalized.

## 20. Path Interface

Prepared-leftover cards and Use These First entries can open Transform This Leftover. The modal shows source quantity, cooked time, storage, safety, suggested paths, single-recipe options, details, and review.

## 21. Save Plan and Reservations

Use This Path opens a final review. Confirm Path saves calendar meals and source leftover reservations atomically without deducting on-hand source quantity.

## 22. Calendar and Shopping List

Saved steps use the existing Meal Planner calendar. Shopping List demand is recalculated through the current planning and cost paths.

## 23. Completing a Transformation Step

When a saved transformation meal is marked completed, the source leftover quantity is deducted once, the matching reservation is consumed or released, and a leftover transformation event is appended.

## 24. Downstream Reconciliation

After completion, future steps in the same path are revalidated. Higher actual source use can mark downstream steps as needs review. Lower actual use leaves the extra quantity in Pantry.

## 25. Cancellation, Replacement, and Rescheduling

Future cancellation, replacement, and rescheduling use the existing reservation, calendar, and Shopping List conventions. Safety deadlines are not extended.

## 26. Lineage

Lineage keeps source batch IDs, root meal IDs, target transformation meal IDs, target recipe IDs, rule IDs, and transformation depth. Cycles are rejected.

## 27. Food Event History

Preview and review append no events. Saved paths append reservation events. Confirmed transformation meals append leftover quantity transformed and reservation events.

## 28. Pantry and Use These First

Both surfaces consume the same prepared-leftover Pantry records. Use These First counts only hard-filtered transformation candidates.

## 29. Migration

Legacy name-only transformation relationships are not auto-promoted unless canonical source type, target recipe, target occurrence, quantity, and method are verified.

## 30. User Isolation

Registered users use their user-scoped Pantry, calendar, reservations, Shopping List, prices, and Food Event History. Guests remain temporary and session-scoped.

## 31. Accessibility

The interface uses visible headings, ordered path steps, labelled quantities, specific action names, live-region announcements, text statuses, keyboard-friendly buttons, and modal focus handling.

## 32. Responsive Design

Source summaries, path metrics, details, and action rows stack on narrow screens. Quantities remain associated with their steps.

## 33. Print and Export

Print output should use planned wording: projected use, planned allocations, and source quantity remaining. It must not describe the path as completed food use.

## 34. Testing

Validation covers syntax, data validators, the existing test suite, and focused Step 17 static checks for rule structure, matching, ledgers, UI, save behavior, completion behavior, and no duplicate systems.

## 35. Deferred Work

Speculative child-batch chains, automatic transformations, automatic deductions during preview, automatic freezing/sharing/discard, waste analytics, household-pattern learning, and environmental-impact claims remain outside Step 17.
