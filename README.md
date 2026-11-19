# harb-skills

Agent skills I use across my projects, for both [Claude Code](https://claude.com/claude-code)
and [Codex](https://github.com/openai/codex). Each skill is a folder with a
`SKILL.md` that either agent loads when the task matches, plus
`agents/openai.yaml` for Codex's display name and invocation policy.

The skills hold workflow, not project facts. Each project describes itself
once in `docs/agents/` (issue tracker, domain docs, git conventions,
validation commands), and every skill reads from there.

## Skills

| Skill | Invoked | What it does |
| --- | --- | --- |
| [grilling](skills/grilling/SKILL.md) | by the agent or "grill me" | Interviews you about a plan, a round of questions at a time, until every decision is settled. Adapted from Matt Pocock. |
| [review-change](skills/review-change/SKILL.md) | by the agent | Reviews a commit range or work in progress on two separate axes, Spec and Code, in parallel subagents. Adapted from Matt Pocock. |
| [commit](skills/commit/SKILL.md) | by the agent | Commits only the task's files in the project's style; lands work only when asked, after validating the exact commit. |
| [validate](skills/validate/SKILL.md) | by the agent | Runs scoped or full checks and reports what was and was not verified. |
| [report-bug](skills/report-bug/SKILL.md) | by you | Investigates a symptom, checks for duplicates, files or supplements an issue. |
| [fix-bug](skills/fix-bug/SKILL.md) | by you | Picks an issue, reproduces it, fixes it test-first, reviews it against the issue. |
| [harb-setup](skills/harb-setup/SKILL.md) | by you | Writes a project's `docs/agents/` config and links skills for both agents. Includes feature-skill and data-safety templates. |
| [harness-check](skills/harness-check/SKILL.md) | by the agent | Script that catches drift in skills, Codex metadata, `AGENTS.md`/`CLAUDE.md` and links. |

They work together: `grilling` settles a plan, `commit` runs `validate` and
`review-change`, and `fix-bug` uses all three on an issue filed by
`report-bug`.

## Install

With the [skills CLI](https://github.com/vercel-labs/skills), which installs
for both Claude Code and Codex:

```bash
npx skills add safernan121/harb-skills            # into the current project
npx skills add safernan121/harb-skills --skill commit   # a single skill
npx skills add safernan121/harb-skills -g         # for your user, every project
```

By hand: copy `skills/<name>` into the project's `.agents/skills/` (Codex) and
link `.claude/skills/<name>` to it (Claude Code), so both read the same files.

Then run `harb-setup` once in the project (`/harb-setup` in Claude Code,
`$harb-setup` in Codex) to write `docs/agents/`.

## Also in my setup

Skills I use alongside these, installed from their authors:

- [mattpocock/skills](https://github.com/mattpocock/skills): `to-spec`,
  `to-tickets`, `tdd`, `retro`, `domain-modeling`, `grill-with-docs`,
  `wait-what`, `writing-for-agents`. Their `setup-matt-pocock-skills` writes
  the same `docs/agents/issue-tracker.md` and `domain.md` that harb reads.
- [RafaelVidaurre/furanku-skills](https://github.com/RafaelVidaurre/furanku-skills):
  `crew`, `model-routing`, `codexbar` for multi-agent orchestration across
  accounts and models.
- [stablyai/orca](https://github.com/stablyai/orca): `orca-cli` and
  `orchestration` for worktrees and worker agents.

## Credits

`grilling` and `review-change` are adapted from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock
(MIT). See [UPSTREAM.md](UPSTREAM.md) for the pinned commit and every change,
and the `LICENSE` in each of those folders. Everything else is
[MIT](LICENSE) © Santiago Fernández.
