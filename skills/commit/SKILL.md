---
name: commit
description: Commit task work on a task branch in the project's message style, staging only the task's files, and, when the user asks, land it (push, PR, or merge) after integrating remote changes and validating the exact commit. Use when a step of approved work is ready to commit, or when the user asks to push, open a PR, or merge.
---

# Commit

The project's conventions live in `docs/agents/git.md`: trunk, branch names,
message format, how work lands (push to trunk, PR, squash), and what needs
authorization. Where it is silent, use the defaults below. Commits on a task
branch need no approval. Committing on trunk, pushing, opening or merging PRs,
rewriting pushed history, force-pushing and deleting branches each need the
user's authorization covering those branches; authorization already given is
enough, do not ask twice.

Other sessions may share the repository through worktrees. Touch only the
intended branches and preserve unrelated edits.

## Branch

1. `git status --short` and `git branch --show-current`. On trunk, create a
   task branch first (default `<type>/<short-slug>`, started from the fetched
   remote trunk). Uncommitted work moves with it. If unrelated uncommitted work
   would move or conflict, ask before switching.

## Commit

Commit when a coherent step of the approved scope passes its checks, and at
the end of the scope.

2. `git diff` and `git diff --cached`: identify which files belong to the
   task. Leave unrelated modifications unstaged and mention them. If nothing
   belongs to the task, say so and stop.
3. Run at least the scoped checks (`validate` skill). If the project expects a
   review before committing, run `review-change` on the step.
4. Stage by path (`git add <files>`), never `git add -A` or `git add .`. Never
   stage `.env*`, build outputs, keystores, or credentials.
5. Message in the project's format; default
   `<type>: <imperative summary>` with type `feat`, `fix`, `docs`,
   `refactor`, `test`, or `chore`, plus the task or issue ID when one applies.
   Validate it with the project's linter if `git.md` names one. Body optional,
   then the attribution lines from the current session's instructions.
6. If the project keeps one commit per branch, amend instead
   (`git commit --amend`) unless the user wants a separate commit.
7. Report the branch name and the commits made.

## Land (only when asked)

What "push" means comes from `git.md`: push the branch to trunk, or push the
branch and open a PR against its parent. Trunk can move between your checks
and your push, so validate the commit you actually land.

8. Integrate: `git fetch origin`, then
   `git rev-list --left-right --count HEAD...origin/<trunk>`. If trunk moved,
   rebase the branch's unpushed commits onto it; if the branch was pushed
   earlier and the project does not rewrite pushed branches, merge trunk in
   instead. Resolve conflicts hunk by hunk, never `--ours`/`--theirs` across a
   file. In append-only files (logs, registers, changelogs) keep both sides'
   entries and recheck any IDs. When a conflict is not settled by the
   branches' intent, abort and report.
9. Run the full checks (`validate` skill) on the integrated `HEAD` and note
   `git rev-parse HEAD`.
10. Land it as a separate command after reading the results: confirm `HEAD`
    still equals the validated SHA, then push, or push and open the PR
    (`gh pr create --fill --base <parent>`), as `git.md` says. Never chain
    integrate && test && push. A rejected push goes back to step 8. Use
    `--force-with-lease`, and only with authorization, for a rewritten pushed
    branch.
11. Report the validated SHA (equal to the landed SHA), check results, PR link
    if any, and anything left uncommitted. Keep the task branch unless the user
    asks to delete it.

Stacked branches (a branch built on another unmerged branch): follow
[references/stacked-branches.md](references/stacked-branches.md).
