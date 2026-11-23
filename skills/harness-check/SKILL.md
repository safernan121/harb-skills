---
name: harness-check
description: Check a repository's agent guidance - skill and subagent frontmatter, Codex invocation policy, Claude Code and Codex skill folders pointing at the same files, CLAUDE.md importing AGENTS.md, Related features in both directions, and local Markdown links. Use after changing AGENTS.md, CLAUDE.md, skills, subagents or docs, and before committing such changes.
---

# Harness check

Run from the repository root (Node 18+, inside a git repository):

```bash
node <this skill's folder>/scripts/check-harness.mjs
```

- `--tracked` checks the staged version of tracked files only. Use it before
  committing or landing: it catches links to files that are not committed.
- `--vendored a,b` names skills copied from elsewhere; only their frontmatter
  is checked, not their links.

If the project wires it into a script (for example `npm run harness:check`),
use that.

## What it enforces

- Every skill folder has a `SKILL.md` whose `name` matches the folder and
  which has a `description`.
- `disable-model-invocation: true` and a Codex `agents/openai.yaml` with
  `policy: allow_implicit_invocation: false` appear together, never one
  without the other.
- `.agents/skills` (Codex) and `.claude/skills` (Claude Code) list the same
  skills, and each resolves to one real folder rather than two copies.
- When both `AGENTS.md` and `CLAUDE.md` exist, `CLAUDE.md` imports
  `@AGENTS.md`.
- Skills with a `## Related features` section list each other in both
  directions, by existing skill names.
- Subagents in `.claude/agents/` have a matching `name` and a `description`.
- Relative Markdown links in root Markdown files, `docs/`, `.claude/` and
  skills resolve to files in the repository, with exact case.

Fix each problem it lists; do not silence a rule by editing the script in a
project. Report the final `OK` line.
