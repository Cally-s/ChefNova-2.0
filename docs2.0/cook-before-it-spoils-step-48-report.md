# Cook Before It Spoils Step 48 Report

## Goal
Add safe handling for Pantry items whose quantities are unknown, qualitative, approximate, ranged, or estimated by meal capacity.

## Files Changed
- `app.js`
- `style.css`
- `docs/cook-before-it-spoils-handle-unknown-quantities.md`
- `docs/cook-before-it-spoils-step-48-report.md`
- `tests/cook-before-it-spoils-step-48-unknown-quantity-static.test.js`

## Implementation Summary
Chef Nova now stores a normalized `quantityInformation` object on existing Pantry items. Unknown, meal-capacity, approximate, and range states are displayed on Pantry cards and respected by recipe warnings.

## Pantry UI
Pantry cards now show `QUANTITY NEEDS CONFIRMATION` when exact quantity is not available.

## User Options
Users can choose `Enough for one meal serving`, `Enough for two meal servings`, `Approximately ______ g`, or `I am not sure`.

## Required Buttons
The Pantry prompt includes `Save Quantity Estimate` and `Review Later`.

## Recipe UI
Recipe cards can show `QUANTITY CONFIRMATION NEEDED` with demand text, current Pantry record, and actions for confirmation, approximate amount entry, Shopping List fallback, or another recipe.

## Safety Boundaries
- Unknown treated as zero: 0 occurrences added.
- Unknown treated as sufficient: 0 occurrences added.
- Automatic full Pantry coverage from unknown: 0.
- Do Not Buy from unknown: 0.
- Precise savings from unknown: 0.
- Precise food-rescue impact from unknown: 0.
- Exact reservation from unknown: 0.
- Meal-capacity converted to grams automatically: 0.
- Nutrition serving confused with meal-serving capacity: 0.
- Range maximum used as guaranteed coverage: 0.
- Physical Food Event History event created by estimate save: 0.
- Impact Ledger credit created by estimate save: 0.
- Second Pantry systems created: 0.
- Second quantity systems created: 0.
- Second Shopping Lists created: 0.
- Second Cost Engines created: 0.
- Normal user localStorage writes from guest mode: 0.

## Storage Consistency
Registered users still save through the existing Pantry user-storage path. Guests still save through the existing session-only guest progress path.

## Reservation Consistency
Unknown quantities continue to return no exact available quantity. Demand confirmation records only a demand-specific confirmation and does not create an exact Pantry amount.

## Shopping List Consistency
Unknown and qualitative amounts remain conditional and do not suppress missing ingredient handling as exact at-home stock.

## Cost and Impact Consistency
Exact cost, remaining quantity, savings, and impact calculations remain unavailable until an exact or reviewed numeric amount exists.

## Accessibility
Quantity prompts include labels, radio controls, aria-live validation, visible focusable controls, high-contrast borders, and print-friendly warnings.

## Validation Performed
- `node --check app.js`
- `node --check rules.js`
- `node --check data/recipes.js`
- parse `data/recipes.json`
- run Step 48 static test
- run Step 47 static test
- run Step 46 static test

## Risks and Notes
Recipe quantity warnings are conservative. They ask for confirmation instead of claiming exact coverage when Pantry quantity is unknown or qualitative.
