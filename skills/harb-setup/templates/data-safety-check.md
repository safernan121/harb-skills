---
name: data-safety-check
description: Checklist for any change touching stored user data - <storage keys, local database, backups, sync protocol, server migrations>. Use before planning and again before finishing such changes.
---

# Data safety check

Rule: updates must never lose or silently rewrite existing user data.
Changing *how* data is stored or shared needs the user's approval first.

## Where data lives

- <Device storage keys and their files.>
- <Legacy keys still read; never delete or stop reading them without approval.>
- <Local database, cache or outbox.>
- <Backup or export format and the versions it still imports.>
- <Server database and where migrations live.>

## Checklist

1. Renaming or reshaping a stored value? Version it and read the old one as a
   fallback; keep the old value until the new one is written.
2. Unreadable stored data is preserved, never overwritten with defaults.
3. New backup or export fields are optional, and every older format still
   imports. Add a test with an old-format fixture.
4. Migrations: add a new file, never edit an applied one. No destructive
   `DROP`, `DELETE` or backfill that changes the meaning of existing rows
   without approval; a test covers each migration.
5. Sync: queued changes from older app versions still apply or fail visibly.
6. Identifiers that let installed apps update in place (package ID, signing
   key, storage keys) stay fixed.
7. Run the tests that cover storage, backups and migrations (`validate` skill).
8. Report what was verified on a real device versus only in tests.

## Related features

- `<feature>`: <what it stores and what to recheck>.
