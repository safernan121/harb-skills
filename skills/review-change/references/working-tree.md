# Reviewing work in progress

No staging, commit, checkout, or config change is needed.

## Baseline

| Mode | Baseline | Content reviewed |
| --- | --- | --- |
| Uncommitted edits | `HEAD` | working files, staged and unstaged combined |
| Staged only | `HEAD` | the index; unstaged and untracked content excluded |
| Branch plus current edits since `<ref>` | `git merge-base <ref> HEAD` | working files |

Honor a path scope the user gives. Record the baseline commit, `HEAD`, the
mode, and the included paths. Unresolved merge entries make the input
incomplete: report them.

## Capture once

- Tracked files: `git diff --no-ext-diff --no-textconv <base> -- <paths>`
  (add `--cached` for staged only; then read file contents from the index with
  `git show :<path>`, not from disk).
- New files, working-tree modes only:
  `git ls-files --others --exclude-standard -z -- <paths>`, each added with
  `git diff --no-index --no-ext-diff -- /dev/null <path>`. Exit code 1 means a
  diff was found; any other failure needs a look. Quote paths safely.

Both reviewers get the same saved patch and path list. List binary files,
symlinks (keep their targets, do not follow them), mode changes and deletions
in the inventory; name any change you could not review as a coverage gap.
Ignored files stay out unless asked for, and unrelated untracked files are not
added to make the scope look complete. Keep everything outside the reviewed
tree.

## Before reporting

Rerun the capture commands and compare. If the in-scope diff or untracked list
changed, keep the findings for the captured snapshot and review the new delta
before claiming the current edits are covered. Never attach an old review to a
later commit. For staged-only reviews, changes outside the index do not
matter.
