# Chef Nova Food Date Intelligence

## 1. Purpose

Food dates do not all mean the same thing. Chef Nova now stores what each Pantry date means so it can show precise, non-misleading Pantry attention.

## 2. Canadian Product Policy

Best-before dates primarily describe expected freshness and quality for unopened products. They are not automatic food-safety deadlines.

Expiration dates are treated as true expiration dates only when the package label is confirmed. A confirmed passed expiration blocks automatic recommendations, but the Pantry item is not deleted.

Packaged-on, purchased-on, opened-on, and cooked-on dates are event dates. Chef Nova does not label them as expiration dates.

Homemade estimates are user estimates. Chef Nova labels them as estimates, not official package dates.

Unknown dates are preserved and shown as needing confirmation.

Policy references used for this product wording:

- Canadian Food Inspection Agency, “Best before, expiration and more: Understanding the date labels on your food”: https://inspection.canada.ca/en/food-labels/labelling/consumers/date-labels-food
- Canadian Food Inspection Agency, “Date markings and storage instructions on food labels”: https://inspection.canada.ca/en/food-labels/labelling/industry/date-markings-and-storage-instructions
- Canadian Food Inspection Agency, “Labelling requirements for infant foods, infant formula and human milk”: https://inspection.canada.ca/en/food-labels/labelling/industry/infant-foods-infant-formula-and-human-milk

## 3. Canonical Date Types

Stored date types:

- `best-before`
- `expiration`
- `packaged-on`
- `purchased-on`
- `opened-on`
- `cooked-on`
- `homemade-estimate`
- `unknown`
- `app-estimated-freshness`

Only the first eight are user-selectable. `app-estimated-freshness` is reserved for derived Chef Nova estimates.

## 4. Date Sources

Stored sources:

- `package-label`
- `user-recorded-event`
- `user-estimate`
- `chef-nova-estimate`
- `legacy-unclassified`

Chef Nova estimates are never stored or displayed as official package labels.

## 5. Pantry Date Records

Pantry items now support `dateIntelligenceVersion: 1` and `dateRecords`.

Each record includes:

- `dateRecordId`
- `dateType`
- `dateValue`
- `source`
- `confirmationStatus`
- `packageLabelConfirmed`
- `note`
- `legacySourceField`
- `createdAt`
- `updatedAt`

## 6. Multiple Dates

One Pantry item may have several dates, such as best-before, purchased-on, and opened-on. Adding one date does not overwrite another date type.

## 7. Date Validation

Date-only values are stored as `YYYY-MM-DD`. Chef Nova compares them as local calendar dates.

Future event dates receive a review warning. Cross-date inconsistencies, such as opened-on before purchased-on, are shown as review warnings.

## 8. Date Intelligence Service

`deriveFoodDateIntelligence({ pantryItem, dateRecords, referenceDate })` returns one primary status plus supporting records and warnings.

The service is used by Pantry cards, dashboard counts, Cook Before It Spoils, reminders, and eligibility integration.

## 9. Status Priority

Confirmed passed expiration dates outrank every other status. Unknown dates, estimates, and best-before statuses follow in conservative priority order. Informational event dates do not become “use soon” by themselves.

## 10. Best-Before Behavior

Best-before wording focuses on freshness and quality. A passed best-before date is not a hard automatic exclusion.

## 11. Expiration-Date Behavior

Expiration dates require package-label confirmation. Passed confirmed expiration dates block automatic Pantry recommendations and planning inputs.

## 12. Opened Packages

Opened packages keep their original best-before date visible, but Chef Nova does not treat that date as an opened-product shelf-life deadline without reviewed metadata.

## 13. Chef Nova Estimates

Chef Nova estimates are labelled as estimates. No new food-specific freshness policies were added in Step 3.

## 14. Homemade Estimates

Homemade estimates are labelled as user estimates and never as official package dates.

## 15. Leftover Dates

Cooked-on dates are displayed as event dates. Chef Nova does not create a universal leftover deadline without reviewed leftover metadata.

## 16. Unknown Dates

Unknown dates show Date Needs Confirmation or Past Date Needs Confirmation. They are not treated as best-before or expiration dates.

## 17. Pantry and Reminder Integration

Pantry and dashboard counts use `selectPantryItemsNeedingAttention()`, which now consumes Date Intelligence.

New Pantry reminders use Date Intelligence wording instead of generic Expires Soon wording.

## 18. Recipe Eligibility

`getActivePantryItems()` excludes Pantry items with passed confirmed expiration dates. Best-before dates, homemade estimates, and unknown dates do not create that hard regulatory exclusion.

## 19. Migration

Legacy generic `expirationDate`, `freshnessDate`, `bestBeforeDate`, or `expiryDate` fields migrate conservatively into `dateRecords`.

Legacy `freshnessDateType: "best-before"` becomes best-before. Other generic date fields become `unknown` with `legacy-unclassified` source and `needs-confirmation` status.

## 20. User Isolation

Date records live inside existing user-scoped Pantry records. Guest Pantry date records remain temporary in existing guest session state.

## 21. Accessibility

The add form uses a visible Date label and a fieldset/legend for date types. Confirm Date Type and Remove Date buttons include item-specific labels. Badges use text, not color alone.

## 22. Responsive Design

Date radio options and date-record controls wrap on smaller screens. No separate mobile editor was added.

## 23. Testing

Validation uses the existing plain Node test suite, syntax checks, data validators, and the Step 3 static Date Intelligence test.

## 24. Deferred Work

Step 3 does not add new food-specific freshness-duration policies, freezing, leftover transformation, waste recording, rescue ranking, OCR, barcode scanning, analytics, or external food-safety APIs.
