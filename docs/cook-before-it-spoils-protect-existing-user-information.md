# Chef Nova Existing User Information Protection

## 1. Purpose

Chef Nova upgrades must be additive, non-destructive, and backwards-compatible. Existing user information remains available after schema changes, migrations, feature updates, and recovery flows.

## 2. Existing Systems Reused

Step 47 reuses the current local account system, user-scoped `localStorage`, guest `sessionStorage`, Pantry, Meal Planner, Meal Calendar metadata, Recipe Database, Favorites, profiles, Shopping List, Price Profiles, Budget Rescue, Food Event History, Impact Ledger projections, Notifications, and accessibility/live-region helpers. No second active store is created.

## 3. Canonical Versus Derived Data

Canonical data includes Pantry records, quantities, dates, saved plans, Calendar meals, user recipes, Favorites, profiles, Shopping List lines, prices, household settings, reservations, leftovers, freezer records, Waste Diary records, notification settings, physical events, and Impact Ledger history. Derived data includes search indexes, rankings, priority scores, summaries, candidates, dashboard read models, filter counts, and temporary previews.

## 4. User-Data Inventory

The dataset registry inventories Pantry, Meal Plans, Calendar meals, Favorites, Shopping List, Food Event History, Price Profiles, Budget Profile, Notifications, Nutrition History, Cooking History, Storage Environment, Waste Diary, and derived actionable-insight stores. Each entry records storage scope, schema version, adapter version, record count, stable-ID count, checksum, canonical/derived status, and backup need.

## 5. User-Data Manifest

The manifest uses `userDataManifestVersion`, `userDataEnvelopeVersion`, `applicationVersion`, `upgradePolicyVersion`, `userScopeId`, `scopeType`, `datasets`, and `generatedAt`. Internal storage keys are reduced to scoped storage labels for user-facing display.

## 6. Optional New Fields

New fields are optional for legacy records. Read-time fallbacks are display or computation helpers only unless a verified migration explicitly writes them while preserving existing fields.

## 7. Absent Versus Empty

Absent means not recorded, not loaded, legacy, or review needed. Empty arrays, `false`, `0`, and `null` remain distinct when explicitly stored.

## 8. Read Compatibility

`readCompatibleUserDataset()` reads current, legacy, mixed, partially migrated, and unknown-field records without writing defaults back. Parse failures return review state instead of blank defaults.

## 9. Merge-Aware Writes

`mergePreservingUnknownFields()` supports nested patches that keep unknown fields. `writeUserStoragePatch()` writes targeted patches instead of replacing a whole profile for one setting.

## 10. Array Preservation

Arrays require explicit operation semantics. Omitted fields preserve the collection, append uses idempotent IDs, patch updates the matching item, and delete requires an authorized entity ID and request ID.

## 11. Explicit Delete Semantics

Missing fields, parse errors, cache misses, logout, account switch, feature flags, and storage failures are not deletes. Deletes require an explicit operation.

## 12. Stable IDs

Existing IDs are preserved. New stable IDs are generated only for true legacy records that lacked one, such as Step 46 legacy Pantry migration.

## 13. Referential Integrity

The validator preserves references across plans, recipes, Favorites, reservations, Shopping List lines, prices, leftovers, Food Event History, and Impact Ledger rows. Unavailable references become review items, not delete triggers.

## 14. Pantry Protection

Pantry quantities, units, original quantities, storage, dates, legacy evidence, prices, package information, notes, reservations, stable IDs, and unknown fields are preserved. Separate lots with the same name stay separate.

## 15. Meal-Plan Protection

Older plans load through compatibility adapters. New Budget Rescue, reservation, impact, or accessibility metadata may be absent and shown as not recorded.

## 16. Calendar Protection

Calendar dates remain date-only where stored as date-only. Chef Nova does not shift them through UTC or move malformed dates to today.

## 17. Recipe Protection

Built-in recipe references preserve IDs, versions, snapshots, serving overrides, substitutions, notes, and cost snapshots. User-created and imported recipes remain separate from built-in recipes with the same name.

## 18. Favorites Protection

Favorites remain intact when referenced recipes are unavailable. Chef Nova preserves recipe ID, order, date, notes, and snapshot/title where available.

## 19. Allergy Protection

Chef Nova does not interpret a missing or unreadable allergy field as “no allergies.” Safety-sensitive recipe and substitution workflows must pause or request review when the profile cannot be verified.

## 20. Dietary-Profile Protection

Dietary restrictions preserve labels, metadata, confirmations, revisions, custom entries, and user scope. Conflicts require review instead of last-write-wins.

## 21. Shopping List Protection

Manual lines, plan-generated lines, user-kept extras, prices, stores, checked state, source links, package choices, quantities, units, category, and notes are preserved.

## 22. Price-Profile Protection

User prices, stores, currencies, package sizes, sale prices, regular prices, confidence, source, timestamps, and notes remain authoritative over estimates.

## 23. Household-Profile Protection

Adult count, child count, household size, serving preferences, appliances, cooking-time settings, stores, currency, accessibility, language, reminders, and food preferences are preserved.

## 24. Budget Rescue Protection

Historical Budget Rescue plans, totals, price coverage, Pantry-first metadata, shopping references, and saved meal references are preserved. Current estimates require explicit recalculation.

## 25. Reservations, Leftovers, and Freezer

Reservations remain linked to exact Pantry items and meals. Leftovers keep source meal relationships. Freezer records keep quality reminders and preservation metadata.

## 26. Notification and Accessibility Settings

Notification preferences, history, snoozes, deferrals, accessibility settings, and language choices remain canonical user information across feature changes.

## 27. Forward Compatibility

Unknown current or future fields are preserved by merge-aware writes. Older tabs should block unsafe reduced-shape writes and request refresh.

## 28. Service-Worker Updates

No service worker is present in this local project. If one is added, cache refresh must stay separate from canonical user storage and must never call global storage clearing.

## 29. Feature Flags

Disabling a feature hides or stops derived calculations only. It does not delete Budget Rescue, Notifications, Cook Before It Spoils, Pantry, Waste Diary, or Impact records.

## 30. Cloud Sync

No backend or cloud sync exists in the current app. The policy still distinguishes patches, full snapshots, empty responses, conflicts, offline edits, and user scope for future sync work.

## 31. Backup

`createUserInformationPreUpgradeSnapshot()` creates a user-scoped rollback snapshot of canonical affected datasets with exact raw values, checksums, record counts, stable IDs, and manifest versioning.

## 32. Atomic Upgrade

`runUserInformationProtectionUpgrade()` acquires a user-scoped lock, creates a backup, verifies backup read-back, validates counts and IDs, writes a manifest/status, and releases the lock. Step 47 does not rewrite every dataset.

## 33. Rollback

`rollbackUserInformationUpgrade()` restores exact raw dataset payloads when rollback is possible. If rollback cannot be verified, Chef Nova states that clearly.

## 34. Storage Quota

Quota failures abort the upgrade before unsafe commit. Canonical user information is not deleted to make room.

## 35. Corrupt Data

Malformed datasets are preserved as raw values and marked Review Required. One corrupt dataset does not reset unrelated valid datasets.

## 36. Read-Only Recovery Mode

When information can be read but not safely written, Chef Nova can keep preserved data visible and block incompatible writes until storage or profile review succeeds.

## 37. Locking and Revisions

The lock key is scoped by user and upgrade policy. Source revisions, record counts, stable IDs, and checksums protect against stale staged updates.

## 38. Idempotency

The upgrade key includes user scope and policy version. Reruns validate the current manifest and do not duplicate records, backups, events, or Impact Ledger entries.

## 39. Registered-User Isolation

Registered users use `chefNova<Feature>_<userId>` storage keys. Backups, locks, manifests, staging, and summaries include the same user scope.

## 40. Guest Data

Guest information stays in `sessionStorage`. It is temporary and is not merged into a registered account unless the existing explicit import flow asks the user.

## 41. Privacy

Backups may contain allergies, budgets, prices, notes, and dates. Logs use dataset IDs, counts, checksums, schema versions, and error codes rather than private raw values.

## 42. Accessibility

Upgrade summaries use visible headings, text statuses, clear record counts, contextual action names, focusable summary regions, live-region-compatible text, and keyboard buttons.

## 43. Responsive Design

Dataset summaries and preserved-information lists stack on mobile. Counts and long titles wrap, and recovery actions become full-width.

## 44. Testing

Validation covers syntax checks, JSON parsing, Step 47 static checks, Step 46 migration checks, Step 3 Date Intelligence, Step 7 priority, Step 8 panel, and Step 45 mobile actions.

## 45. Deferred Work

Automatic record deletion, automatic guest merging, whole-profile replacement, physical food outcomes, automatic impact recognition, environmental calculations, cloud sync, IndexedDB migration, and service-worker cache updates remain outside Step 47.
