---
name: validate
description: Run the project's checks - scoped to the feature while working, the full suite before any push or merge - and report results in a fixed format that separates what was tested from what was not. Use after code changes, before declaring a task done, and always before pushing or merging.
---

# Validate

The commands live in `docs/agents/validation.md`: environment setup, scoped
checks, the full suite, and the levels of verification the project
distinguishes (for example unit tests, browser, native build, real device).
If it does not exist, find the commands in the project's scripts and CI
config, say which you used, and suggest recording them with `harb-setup`.

## While working (scoped)

- Run the scoped checks for the feature you changed. Pick its tests from its
  feature skill, or by name.
- If shared code changed, also run the tests of every feature listed under
  **Related features** in the feature skill.
- Changed agent guidance (`AGENTS.md`, `CLAUDE.md`, skills, subagents, docs):
  also run the `harness-check` skill's script.

## Before push or merge (full)

Run the full suite on the exact commit you will land. Everything must pass.
If a check cannot run (a missing database, tool or device), stop and tell the
user; do not land on a partial run unless they accept it explicitly.

To keep long output out of the main thread, delegate the run to a subagent
(Claude Code: the Agent tool; Codex: its subagents) with
[references/checker.md](references/checker.md) pasted in full and whether to
run the scoped or the full checks.

## Report

- Commands run, pass/fail counts, and each failure with the smallest output
  excerpt that shows its cause.
- The commit checked (`git rev-parse HEAD`) and whether the tree had
  uncommitted changes.
- For a bug fix: the regression test's name and that it failed before the fix,
  or why no test could reach the bug.
- What was not checked. Keep the verification levels separate: tests are not a
  browser check, and neither is a check on a real device.
