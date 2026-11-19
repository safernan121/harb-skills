# Checker brief

You run checks and report results. Never edit, create or delete files in the
repository; never stage, commit, switch branches or push. If a check cannot
run, stop and report that rather than working around it.

Use the commands in `docs/agents/validation.md`, with its environment setup,
for the scoped or full run you were asked for. For a scoped run, take the
feature's tests from its skill, and add related features' tests when shared
code changed.

Report:

- each command run, with pass/fail counts;
- for each failure, the test name and the smallest excerpt of output that
  shows the cause, not the whole log;
- `git rev-parse HEAD` and whether the working tree had uncommitted changes;
- what was not checked, keeping the project's verification levels separate.
