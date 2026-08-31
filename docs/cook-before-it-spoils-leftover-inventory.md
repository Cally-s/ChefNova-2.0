# Chef Nova Leftover Inventory

## 1. Purpose

Confirmed stored leftovers are now first-class Pantry inventory. Chef Nova can track quantity, storage, safety, reservations, and history instead of representing leftovers only as meal names.

## 2. Planned Versus Actual Leftovers

Planned leftover servings are predictions inside a meal plan. Actual leftover batches are created only after meal completion confirms prepared food remained and was stored.

## 3. Shared Inventory Architecture

Chef Nova keeps one household inventory in `state.pantry`. Ingredient lots use `itemKind: "ingredient-lot"` and prepared leftovers use `itemKind: "prepared-leftover"`.

## 4. Leftover-Batch Schema

Prepared leftovers keep Pantry fields plus `leftoverBatch`. The batch stores schema version, item kind, quantity basis, source meal, recipe, serving conversion, preparation time, storage, preservation, lifecycle, lineage, safety snapshot, and metadata.

## 5. Batch Identity

Batch IDs are stable and meal-scoped: `leftover::<mealId>::v<completionVersion>::<batchIndex>`. Repeating completion reuses the completion idempotency path.

## 6. Quantity Basis

Supported bases are `mass`, `volume`, `count`, and `servings`. Step 16 uses `servings` when the user confirms servings but no mass or volume.

## 7. Quantity and Serving Conversion

Canonical quantity is stored in `quantityDetails`. Servings are derived from a confirmed serving-size conversion. For serving-based batches, one serving equals one serving unit.

## 8. Unknown Quantities

Unknown quantities remain `null` and show as needing confirmation. They are not automatically reserved, ranked, or used in recipes.

## 9. Source Meal and Recipe

Each batch references the source meal, source plan/workflow, original recipe, recipe variant when available, and completion version.

## 10. Preparation and Storage

`originalCookedAt` is preserved. Current storage location, container, storage start time, continuous-storage status, and temperature condition are stored on the batch snapshot.

## 11. Food-Safety Guardrails

Prepared leftovers reuse Step 6 policies such as `health-canada::leftover-cooked-dish::refrigerator`. If reviewed policy coverage is not available, the batch is review-required.

## 12. Lifecycle and Preservation

Lifecycle covers available, used, discarded, shared, and unknown. Preservation covers not frozen, frozen, thawed, and unknown. These are intentionally separate.

## 13. Reservations

Prepared leftovers reuse Pantry reservations. Available quantity is current quantity minus active reservations.

## 14. Direct Consumption

Record Consumption decreases the canonical quantity once, appends a leftover-consumption event, and closes the batch when the quantity reaches zero.

## 15. Transformations

Transformation planning is represented through prepared-leftover rescue sources and hard-filter checks. Full transformation recommendations remain deferred.

## 16. Double-Counting Protection

Prepared leftovers are not raw ingredients. Using a leftover source does not deduct the original source recipe ingredients again.

## 17. Batch Splitting

Partial freezing splits a batch into a refrigerated source remainder and a frozen child batch. The split conserves total quantity.

## 18. Freezing and Thawing

Full freezing updates the same batch. Partial freezing creates a child batch. Thawing records thawed metadata and preserves original cooked time.

## 19. Reheating

Reheating remains event-based. The derived reheat count comes from Food Event History and does not reset the original cooked time.

## 20. Sharing and Discard

Sharing and discard require explicit action. Partial actions decrease quantity and keep the batch available; full actions close it without deleting history.

## 21. Quantity Corrections

Corrections update the current snapshot and append a correction event. Corrections are not counted as consumption, sharing, discard, or transformation.

## 22. Pantry Interface

Prepared leftovers appear in the existing Pantry with quantity, servings, source meal, recipe, cooked time, storage, safety, lineage, and batch actions.

## 23. Recipe Recommendations

Prepared leftovers can enter recipe ranking only as prepared-leftover sources. Without a validated transformation rule, hard filters block automatic use.

## 24. Shopping List and Cost

Eligible leftover sources may reduce demand only through the existing recipe-ranking and Shopping List path. Unsafe or unknown leftovers do not reduce grocery requirements.

## 25. Food Event History

Step 16 extends the existing Food Event History with leftover batch creation, consumption, transformation, split, storage change, and correction event types.

## 26. Migration

Planned leftover metadata is not migrated into inventory. Reliable actual leftover records can become batches; uncertain records stay review-required.

## 27. User Isolation

Registered users keep user-scoped Pantry and Food Event History. Guests keep temporary session Pantry and Food Event History.

## 28. Accessibility

Leftover cards use visible text for item kind, quantity, servings, source, storage, and safety. Actions include batch-specific accessible names.

## 29. Responsive Design

Leftover details and actions stack on narrow screens and reuse Pantry mobile layout rules.

## 30. Testing

Validation includes syntax checks, data validators, all existing tests, and focused Step 16 static checks.

## 31. Deferred Work

Full transformation recommendation, automatic transformation, waste analytics, household-pattern learning, and environmental-impact claims remain later work.
