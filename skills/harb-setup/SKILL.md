---
name: harb-setup
description: Configure a repository for the harb skills - write the docs/agents config they read (issue tracker, domain docs, git conventions, validation commands), link the skills for both Claude Code and Codex, and optionally add the feature-skill and data-safety templates. Run once per repository, or again to change a setting.
disable-model-invocation: true
---

# Set up harb skills

The harb skills keep no project facts. They read them from `docs/agents/`:

| File | Read by | Template |
| --- | --- | --- |
| `issue-tracker.md` | `report-bug`, `fix-bug`, `review-change` | [issue-tracker-github.md](templates/issue-tracker-github.md) |
| `domain.md` | `grilling`, `report-bug`, `review-change` | [domain.md](templates/domain.md) |
| `git.md` | `commit` | [git.md](templates/git.md) |
| `validation.md` | `validate` | [validation.md](templates/validation.md) |

`issue-tracker.md` and `domain.md` use the same paths as
[mattpocock/skills](https://github.com/mattpocock/skills)' setup, so one copy
serves both collections. If they already exist, keep them and only add what the
harb skills need (bug and ready-for-agent labels).

Explore, present a draft, let the user edit, then write. Do not overwrite
existing content the user wrote.

## 1. Explore

- `git remote -v`: GitHub, GitLab, or none. `gh auth status` if GitHub.
- `AGENTS.md`, `CLAUDE.md`, existing `docs/agents/*`.
- Where skills live: `.agents/skills` (Codex) and `.claude/skills` (Claude
  Code), and whether one links to the other.
- Trunk branch, branch names and commit style in `git log`, commitlint or
  similar config, how PRs merge (squash or not), CI workflows.
- Package scripts, CI steps and test folders for the check commands; anything
  that needs a database, device or service.
- Glossary and decision records (`GLOSSARY.md`, `docs/adr/`, `docs/decisions/`).

## 2. Draft and confirm

One section at a time, leading with the recommendation so the user can accept
it in a word:

1. **Issue tracker**: GitHub Issues when the remote is GitHub; otherwise
   GitLab, local markdown under `.scratch/`, or the user's own description.
   Labels default to `bug` and `ready-for-agent`; create missing ones with
   `gh label create` after confirmation.
2. **Domain docs**: where the glossary and decision records live. Default
   `GLOSSARY.md` and `docs/adr/`; use what exists.
3. **Git**: trunk, branch format, message format and its linter, how work
   lands (push to trunk, or PR and squash), one commit per branch or not, what
   needs authorization.
4. **Validation**: environment setup, scoped commands, full suite, and the
   verification levels to keep separate in reports.

## 3. Write

- The four `docs/agents/` files from the templates, filled in.
- An `## Agent skills` section in `AGENTS.md` (or `CLAUDE.md` if only that
  exists) from [agents-section.md](templates/agents-section.md); update it in
  place if present.
- If both `AGENTS.md` and `CLAUDE.md` exist, `CLAUDE.md` should import
  `@AGENTS.md` so both agents read the same instructions. Propose it; do not
  rewrite either without confirmation.
- Skills for both agents: keep one real folder per skill in `.agents/skills`
  and link `.claude/skills/<name>` to it (or the whole folder), so Codex and
  Claude Code never drift. `npx skills add safernan121/harb-skills` already
  installs this way.

## 4. Optional templates

Offer, do not impose:

- [feature-skill.md](templates/feature-skill.md): one skill per feature with
  non-obvious rules, data and tests, linked through **Related features** in
  both directions. Copy it next to the skills as `FEATURE_SKILL_TEMPLATE.md`.
- [data-safety-check.md](templates/data-safety-check.md): a project skill for
  any app that stores user data. Fill in where data lives before installing it
  as `data-safety-check/SKILL.md`.

## 5. Done

List the files written and which skills read each. Suggest running the
`harness-check` skill to confirm frontmatter, Codex metadata and links.
