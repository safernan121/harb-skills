---
name: <feature-slug>
description: <What this feature is and when to load it - name the screens, files, and kinds of change that should trigger it.>
---

# <Feature name> (<task or issue ID>)

## Behavior and rules

- <Non-obvious rules, decisions and invariants agents must keep. Link the
  decision record for each.>

## Code

- <Key files and what each owns.>

## Data

- <Stored keys, tables, backup fields, sync commands. Link `data-safety-check`
  if any change here.>

## Related features

- `<other-feature>`: <why they interact (shared data, screens or
  calculations) and what to recheck when this one changes>.

## Tests

- Scoped: `<command for this feature's tests>`

## Not yet verified

- <Gaps per verification level, e.g. checked in tests but not on a device.>
