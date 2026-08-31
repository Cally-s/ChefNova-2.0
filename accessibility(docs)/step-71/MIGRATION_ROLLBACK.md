# Migration Rollback

Chef Nova uses expand-and-contract migration rules:

1. Add compatible fields.
2. Deploy code that reads old and new formats.
3. Migrate data idempotently.
4. Verify.
5. Stop writing old format.
6. Remove old format in a later release only.

Feature flags must not select separate user-data stores.
