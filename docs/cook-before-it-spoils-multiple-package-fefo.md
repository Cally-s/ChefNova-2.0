# Chef Nova Multiple-Package FEFO Handling

## 1. Purpose
Separate packages of the same ingredient must keep separate quantities, dates, opening states, reservations, prices, and lineage. A yogurt package opened today and a yogurt package still unopened are different physical records.

## 2. Existing Systems Reused
Step 49 reuses Pantry, Date Intelligence, Food-Safety Guardrails, Priority Engine, Shopping List, reservations, Cost Engine, Waste Diary, Freezer, Food Event History, Impact Ledger, user storage, guest storage, and live-region helpers.

## 3. No Duplicate Pantry
Chef Nova still has one canonical Pantry. Package groups are derived summaries over existing Pantry records.

## 4. Package Identity
Every physical package or lot keeps its stable Pantry item ID. Package labels are display aids and do not replace IDs.

## 5. Package Groups
Package groups summarize compatible records by user scope, ingredient identity, food form, and unit dimension. They never replace physical package records.

## 6. Compatible Food Forms
Fresh, frozen, dairy, soy, coconut, Greek, flavoured, and prepared forms remain distinct unless a recipe substitution explicitly supports them.

## 7. FEFO Definition
FEFO means first-expiring-first-out by the earliest eligible current use-first deadline, not by raw array order, purchase order, package size, or price.

## 8. Safety Before FEFO
Food-Safety Guardrails, true-expiration exclusions, storage review, lifecycle state, allergies, diet requirements, target meal date, and reservations run before FEFO ordering.

## 9. Date-Type Precision
Best-before, recorded expiration, app-estimated freshness, opened dates, and unknown dates keep their exact labels.

## 10. Effective Use-First Date
The effective use-first date is derived from Date Intelligence and Food-Safety Guardrails. It does not replace original date records.

## 11. Opened Packages
Opened state can make a package earlier in the FEFO order when reviewed policy supports that result. The original printed date remains visible.

## 12. FEFO Comparator
The comparator is versioned and deterministic: effective use-first date, latest eligible meal date, opened state, opened date, smaller remaining quantity, purchase date, then stable Pantry item ID.

## 13. Same-Date Ties
Same-date packages stay separate. Opened packages, earlier opened dates, smaller quantities, earlier purchase dates, and stable IDs break ties.

## 14. Target Meal Date
Each package is evaluated against the selected meal date. A package eligible only through Wednesday is not allocated to a Friday meal.

## 15. Package Allocation
Chef Nova allocates the earliest eligible package first and splits across later packages only when the earlier package cannot cover the demand.

## 16. Preview Versus Physical Use
Recipe cards and plan previews create temporary package allocations only. Pantry quantities are not deducted during preview.

## 17. Reservations
Saved reservations reference exact Pantry item IDs and exact quantities. Generic ingredient-only reservations are not sufficient.

## 18. Unknown Package Quantities
Step 48 applies per package. Unknown quantities are not zero, not sufficient, and not given numeric allocation.

## 19. Unknown Package Dates
Unknown dates require review and do not receive invented FEFO rank.

## 20. User Package Override
Users may choose another eligible package for one demand. The override is plan-specific and cannot bypass hard safety rules.

## 21. Pantry Display
The Pantry may show ingredient-level group summaries, but every package remains visible with heading, quantity, opening state, date label, reservations, and status.

## 22. Recipe Planner
Recipe cards can show package-level allocation previews and explain why the first package is planned first.

## 23. Shopping List
Shopping needs are calculated after eligible package allocations. Only the remaining missing quantity becomes a purchase.

## 24. Purchase Confirmation
A confirmed purchase creates a new Pantry package record. It does not automatically increase an older package.

## 25. Physical Package Combination
Package combination requires explicit confirmation, source lineage, conservation, and the earliest applicable source deadline.

## 26. Cost Engine
Ingredient-use value is calculated package by package using each package’s own historical price. Missing package prices are not zero.

## 27. Budget Rescue
Budget Rescue may prefer FEFO-compatible recipes but price cannot override safety, true expiration, meal-date eligibility, or reservations.

## 28. Emergency Plan
Emergency Plan applies safe package-level FEFO without pressuring questionable earlier packages into use.

## 29. Meal Calendar
Calendar reservations identify exact package allocations, not only a generic ingredient total.

## 30. Meal Completion
Actual-use review asks which packages were used when planned allocation may have changed.

## 31. Partial Package Use
Partial use leaves the remaining quantity on the same package record.

## 32. Waste Diary
Discard records link to the exact package when known. Unknown package identity remains review-needed.

## 33. Freezer Splits
Freezing part of a package creates lineage-preserving child lots and leaves unrelated packages unchanged.

## 34. Priority Engine
Priority is calculated per package. Ingredient summaries may show the highest package priority and package count needing attention.

## 35. Notifications
Notifications identify the affected package and avoid duplicate generic and package-specific reminders for the same unchanged issue.

## 36. Impact Ledger
Planned allocation creates no impact credit. Confirmed physical outcomes preserve package lineage.

## 37. Legacy Migration
Legacy aggregate records are preserved as one lot unless explicit package data exists. Chef Nova does not invent package splits.

## 38. Data Protection
Step 47 protection preserves package IDs, quantities, dates, opening states, prices, stores, notes, reservations, lineage, and unknown fields.

## 39. Stale and Multi-Tab Protection
FEFO decisions include user scope, package revisions, quantity, dates, opening state, storage, safety, reservations, meal date, timezone, and policy version.

## 40. User Isolation
Registered users access only their own packages and FEFO decisions. Guest package data remains session-only.

## 41. Accessibility
Package groups use semantic sections, headings, lists, visible package labels, visible Use First text, specific action names, stable focus, and concise announcements.

## 42. Responsive Design
Package cards stack on mobile, dates wrap, and actions remain visible touch targets.

## 43. Print and Export
Print and export preserve separate package records, dates, opening states, quantities, reservations, and use-first order.

## 44. Testing
Validation includes syntax checks, JSON parsing, Step 49 static checks, Step 48 checks, Step 47 checks, Step 46 checks, and known Step 4 pre-existing failure tracking.

## 45. Deferred Work
Automatic physical package combination, AI date interpretation, automatic Pantry deduction, automatic impact recognition, and environmental calculations remain outside Step 49.
