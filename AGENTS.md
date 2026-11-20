# harb-skills

A public collection of agent skills for Claude Code and Codex. Each
`skills/<name>/` folder is installed as is into other repositories, so:

- Skills must not hold project facts. They read them from the target
  project's `docs/agents/` files, named by repo-root path in code spans
  (`docs/agents/git.md`), never as relative links: a skill sits at
  `skills/<name>/` here but at `.agents/skills/<name>/` once installed.
- Relative links stay inside the skill's own folder (`references/`,
  `templates/`, `LICENSE`).
- Every skill has `agents/openai.yaml` with `interface.display_name` and
  `short_description`. A skill with `disable-model-invocation: true` also sets
  `policy: allow_implicit_invocation: false`, and vice versa.
- Subagent instructions live in the skill's `references/` and are pasted into
  the subagent prompt, so they work in both agents without `.claude/agents/`.
- Adapted third-party skills keep the author's `LICENSE` in their folder, an
  attribution line under the title, and an entry in [UPSTREAM.md](UPSTREAM.md)
  with the pinned commit and each local change.
- Add new skills to the table in [README.md](README.md).

Write skills tersely: what to do, in order, and the non-obvious why. Prefer
"the user" over project-specific roles.

Check before committing:

```bash
node skills/harness-check/scripts/check-harness.mjs
```
