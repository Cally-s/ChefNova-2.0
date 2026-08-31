# Chef Nova Recipe Card Cost Information

## 1. Purpose

Recipe cards now show cost information without creating separate Budget Recipe cards.

Cards distinguish ingredient value from new grocery spending. Ingredient value estimates the food used in the recipe, including Pantry items. New grocery spending estimates checkout cost in the card's current context.

## 2. Existing Card Reuse

The shared cost section is embedded in existing recipe cards, Favorite cards, weekly meal slots, generated meal previews, suggested meal review cards, and replacement candidate cards.

## 3. Card Contexts

Chef Nova uses controlled contexts:

- Planned normal meal
- Planned batch source
- Planned leftover target
- Replacement candidate
- Planner candidate
- Standalone recipe
- Saved historical meal

The context controls serving text, grocery spending labels, Pantry coverage, and leftover treatment.

## 4. Recipe Ingredient Value

Recipe ingredient value comes from the Step 6 recipe ingredient-use result. It uses `totalRecipeCostCents` only when complete.

Known subtotals are labelled as known ingredient value, not complete recipe cost.

## 5. Cost Per Serving

Cost per serving comes from Step 6 `costPerServingCents`. It is based on recipe ingredient value and effective servings, not full grocery package cost.

## 6. New Grocery Spending

New grocery spending uses context-specific plan calculations:

- Current planned meals use a removal counterfactual.
- Replacement candidates use an addition counterfactual.
- Standalone recipes use a one-recipe simulation with current Pantry and price settings.
- Batch sources use the source production event.
- Leftover targets show additional-only grocery cost.

## 7. Non-Additive Marginal Costs

Meal-level grocery estimates are context-sensitive. Shared packages and shared ingredients mean these values should not be added together.

The Budget Status panel remains the source for the weekly grocery total.

## 8. Pantry Coverage

Planned card Pantry coverage uses Step 8 Pantry allocation rows by meal ID. It shows fully covered, partially covered, and uncovered requirement counts.

Standalone cards show Pantry and purchase information when enough context is available.

## 9. Grocery Ingredient Counts

New ingredients needed counts unique grocery ingredient groups with positive grocery requirements after Pantry use.

The breakdown can also show newly introduced weekly purchase groups when plan context is available.

## 10. Cooking Time

Normal recipes use the current recipe or variant cooking time. Batch source cards label batch time. Leftover targets show reheating time when a leftover method is available.

## 11. Ingredient Breakdown

The breakdown lists ingredient rows from the Step 6 ingredient cost results. Rows keep recipe order and show required quantity, Pantry quantity, missing quantity, ingredient value, price source, and warnings.

## 12. Price Confidence

Cards show concise price confidence. Complete Step 7 panels remain separate.

Chef Nova estimates remain labelled as estimates. Missing prices and missing quantities are not shown as zero.

## 13. Batch and Leftover Cards

Batch source cards show the full production ingredient value once. Leftover targets do not repeat the source recipe cost. They show portion value context and any additional grocery cost.

## 14. Substituted Variants

When a meal stores a recipe variant snapshot, the card uses that variant for cost, ingredients, Pantry allocation, substitutions, and cooking time.

## 15. Recalculation

Cards recalculate through existing render paths after meal edits, serving changes, substitutions, replacements, Pantry edits, price edits, price-source changes, and plan review updates.

## 16. Accessibility

Cost metrics use definition lists. The breakdown uses keyboard-accessible `details` and `summary`. Warnings are visible text and do not rely on color alone.

## 17. Responsive and Print Design

Cost grids stack on mobile. Ingredient rows wrap. Print keeps compact cost summaries and warnings while avoiding interactive-only presentation.

## 18. Testing

Run:

```bash
node --check app.js
node tests/recipe-card-cost-information-static.test.js
```

Also run the Cost Engine, Price Confidence, Pantry-first, Budget Planning, Leftover, Substitution, and Budget Status validations.

## 19. Deferred Work

Step 15 remains responsible for full Shopping List redesign. Live grocery prices, retailer scraping, optional ingredient selection UI, and export redesign are not included in Step 14.
