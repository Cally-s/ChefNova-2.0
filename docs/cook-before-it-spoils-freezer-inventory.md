# Cook Before It Spoils Freezer Inventory

## Purpose

Step 24 adds a Freezer Inventory view inside the existing Pantry page. Freezer Inventory is a selector and presentation layer over the existing Pantry.

## Source of Truth

Freezer Inventory does not create a new food store. It reads canonical Pantry records where storage is freezer, preservation is frozen, and lifecycle is not terminal.

## Filters and Sorting

The view supports All Frozen Food, Ready Meals, and Ingredients filters. Prepared components appear with Ingredients because they function as recipe inputs unless structured metadata identifies them as complete ready meals.

Status filters include Quality Reminder Due and Date Unknown. Oldest First is implemented as Oldest Frozen First in the sort controls.

## Dates and Quantities

Cards display canonical Pantry quantities. Servings appear only when a confirmed serving conversion exists.

Frozen date comes from `preservation.frozenAt` or the Step 23 freezer recording. Date-only, approximate, missing, and review-needed dates are displayed without fabricating time.

## Quality and Safety

Quality Reminder Due is not a safety deadline. The freezer card keeps quality guidance separate from Food-Safety Guardrail status.

## Actions

Cards can open Plan a Meal, Find Recipes, Add to Calendar, View Details, Edit Quality Reminder, View Original Timeline, and Review Freezer Conditions.

Mark Thawed opens a confirmation workflow before state changes. The workflow records the thawed amount, date, timestamp precision, factual thawing method, and new storage location. Full thaw resolves the active quality reminder. Partial thaw splits the batch while preserving frozenAt and original lineage.

## Guest and User Scope

The view uses the active Pantry state, so registered-user isolation and guest session behavior remain unchanged.

