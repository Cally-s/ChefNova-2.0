# Cook Before It Spoils: Missing Package Date Estimates

## 1. Purpose

Step 51 adds a planning-only Use-Soon Estimate for Pantry items that do not have a package date recorded.

The estimate helps Chef Nova rank and explain items that may need earlier planning based on reviewed Pantry evidence.

## 2. Supported Inputs

Chef Nova may consider:

- opened date
- purchase date
- cooked date for prepared food workflows
- frozen or thawed state where existing freezer rules apply
- food category
- food form
- storage location
- reviewed storage rules
- user-entered storage details
- reservations and target meal dates

The current implementation adds reviewed estimate rules for fresh refrigerated leafy greens, fresh refrigerated mushrooms, and opened refrigerated dairy.

## 3. What It Is Not

A Use-Soon Estimate is not:

- an official expiration date
- a best-before date
- package instructions
- a safety guarantee
- a replacement for food-safety guardrails
- a reason to override a true expiration date

Chef Nova keeps the estimate separate from Date Intelligence and does not write it into package-date fields.

## 4. Package Date Status

The estimate model separates missing package dates from other date problems.

Supported statuses include recorded, not recorded, not printed on package, type unknown, value ambiguous, value invalid, not applicable, and review required.

## 5. Estimate Status

Use-Soon Estimates can be available, limited evidence, user estimate only, review required, unavailable, superseded, stale, or not applicable.

Only available or limited-evidence estimates can support planning priority.

## 6. Evidence Model

Each estimate records the evidence used to create it.

Evidence may include opened date, purchase date, food category, food form, storage location, reviewed category rule, package instructions, and manual review.

## 7. Reviewed Rules

Chef Nova uses a small reviewed rule catalogue instead of guessing.

Rules define the category, form, storage location, opening state, timeline origin, planning window, review status, and whether the rule may create a hard safety exclusion.

Use-Soon rules cannot create hard safety exclusions.

## 8. Pantry Display

Pantry cards show a compact Use-Soon Estimate card when supported.

The card displays the planning window, why the estimate appears, the missing package date, and the required safety limitation.

If Chef Nova cannot estimate, the card says package date not recorded and keeps the item in Pantry.

## 9. Priority Engine

The Priority Engine may use a Use-Soon Estimate when evidence is sufficient and food-safety checks do not block planning.

Priority results expose the estimate basis, support level, package-date status, quantity confidence, and omitted scoring factors.

## 10. Unknown Quantity

Unknown quantity does not erase date-based priority.

When quantity is unknown, Chef Nova omits quantity-at-risk, exact rescue coverage, exact Pantry value, and exact remaining weight.

## 11. FEFO and Multiple Packages

FEFO can use a supported use-soon planning window to order packages.

Chef Nova does not relabel estimated windows as expiration or best-before dates.

If evidence is limited or package windows overlap, users should review package order.

## 12. Recipe Recommendations

Recipes may use missing-date Pantry items only when safety checks pass and quantity can be met or confirmed.

Recipe recommendations should describe the priority basis as a use-soon estimate.

## 13. Later Date Entry

If a user later records a true expiration date, the existing true-expiration policy controls.

If a user records a best-before date, Chef Nova keeps quality wording and still considers opening and storage context.

## 14. Safety Language

Required limitation:

"No package date was entered. This is a planning estimate, not an official expiration date or a guarantee of food safety."

Chef Nova also states that it did not interpret the estimate as a best-before or expiration date.

## 15. Storage Boundary

The estimate is derived at read time.

It is not saved as `dateInformation.type`, `expiration`, `best-before`, `freshnessDate`, or `freshnessDateType`.

## 16. Actions

Supported Pantry card actions:

- Find Flexible Recipes
- Enter Package Date
- Review Storage Details
- Edit Estimate
- Review Later

These actions reuse the existing Pantry, recipe, and priority-review flows.

## 17. Accessibility and Responsive Behavior

Estimate cards use semantic sections, readable labels, high-contrast friendly borders, responsive button wrapping, and print-safe styling.

## 18. Deferred Work

Future steps can add more reviewed estimate rules, package-order review prompts, and richer storage-condition evidence.
