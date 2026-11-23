---
name: review-change
description: Two-axis review of a change - Spec (does it do what was asked?) and Code (is it correct and within the project's rules?) - run as two parallel read-only subagents on one captured snapshot. Use before committing a feature step, after a bug fix, or when asked to review a branch, PR, diff, or work in progress.
---

# Review a change

Adapted from the `code-review` skill in [mattpocock/skills](https://github.com/mattpocock/skills)
by Matt Pocock (MIT License, see [LICENSE](LICENSE) in this folder).

The two axes run in separate subagents so neither masks the other: code can
follow every rule and build the wrong thing, or build the right thing badly.
Do not merge or rerank their findings.

## 1. Pin the scope

- **Committed range:** resolve the base the user gave (commit, branch, tag,
  PR base, or a stacked branch's parent) and `HEAD` to commit IDs. Capture
  `git diff <base>...<head>` and `git log --oneline <base>..<head>`. No base
  given: ask.
- **Work in progress** (uncommitted, staged only, or branch plus current
  edits): follow [references/working-tree.md](references/working-tree.md).
  No commit or staging is needed to review.

Save the patch outside the repo (`mktemp -d`). An unresolved ref or an empty
scope: report it and stop here, not inside two subagents.

## 2. Gather each reviewer's inputs

- **Spec:** in order, an issue referenced by the commits (read through
  `docs/agents/issue-tracker.md`), a path or issue the user gave, the plan
  approved in this conversation, or a spec file matching the branch. None
  found: ask. If there is none, skip the Spec axis and say so.
- **Code:** `AGENTS.md`, every file documenting how code is written here
  (`CODING_STANDARDS.md`, `CONTRIBUTING.md`, the paths in `AGENTS.md`), the
  feature skills that own the changed code, and a related feature's skill only
  when the diff crosses into it. Domain terms map through the glossary named in
  `docs/agents/domain.md`.

Hand over the change and its sources, never your conclusions about it.

## 3. Spawn both reviewers in one message

Start two read-only subagents in parallel (Claude Code: the Agent tool; Codex:
its subagents). Each prompt is the reviewer brief pasted in full plus its inputs:

- **Spec:** [references/spec-reviewer.md](references/spec-reviewer.md), the
  patch path, commit list or snapshot description, changed files, and the spec
  text itself (a subagent may not be able to fetch issues).
- **Code:** [references/code-reviewer.md](references/code-reviewer.md), the
  patch path, commit list or snapshot description, changed files, and the
  standards and feature skill paths from step 2.

If the harness cannot start subagents, run each brief yourself in turn and
finish the Spec report before reading the standards.

## 4. Report

State the scope reviewed: commit IDs, or the snapshot's baseline and mode.
Give each reviewer's findings under `## Spec` and `## Code`, lightly cleaned.
End with one line: findings per axis and the worst one within each, never a
single winner across axes.

Recheck the scope as `working-tree.md` describes; if files changed after
capture, say the review covers the captured snapshot only.
