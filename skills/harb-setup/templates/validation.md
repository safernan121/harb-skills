# Validation

## Environment

<Runtime version and how to select it in a non-interactive shell, services the
checks need (database, emulator), and their environment variables.>

## Scoped (while working)

```bash
<lint command>
<typecheck command>
<test command for one feature, e.g. npm test -- tests/<feature>*>
```

Pick a feature's tests from its feature skill. When shared code changes, also
run the tests of its related features.

## Full (before push or merge)

```bash
<every command CI runs>
```

All must pass on the exact commit being landed.

## Verification levels

Keep these separate in reports; passing one does not imply the next:
<e.g. unit and integration tests → browser → native build → real device>.
