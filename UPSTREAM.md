# Upstream

Skills adapted from other repositories, with the commit they were taken from
and what changed. Before updating one, diff the upstream files at the new
commit against the pin and reconcile the local changes listed here.

## mattpocock/skills

Source: [mattpocock/skills](https://github.com/mattpocock/skills) by Matt
Pocock, MIT License. Each adapted skill carries the license notice in its
folder (`LICENSE`), as the license requires.

Pinned at commit `5beb35b040e3de97e54fa9e386d7e42d15c295c2` (2026-10-19).

- [`grilling`](skills/grilling/) from `skills/productivity/grilling`:
  - description says when to use it (before a large or unclear change);
  - a "Start from what is settled" section: read the glossary, decision
    records and feature skills first, and treat a confirmed decision as
    settled unless the plan conflicts with it;
  - facts may come from your own lookup or a read-only subagent;
  - a "Done" section: write a short plan, record confirmed decisions, and wait
    for approval before implementing.
  The same changes were made earlier in the author's own projects; this
  version reads paths from `docs/agents/domain.md` instead.
- [`review-change`](skills/review-change/) from `skills/engineering/code-review`:
  - axes renamed Spec and Code; the reviewer briefs live in `references/` and
    are pasted into the subagents so the skill works in Claude Code and Codex;
  - reviews of uncommitted or staged work from one captured snapshot
    (`references/working-tree.md`), with a scope recheck before reporting;
  - the Code brief puts correctness, data safety and related features before
    standards, keeps a shortened smell baseline as judgement calls, and checks
    tests that would pass if the code were wrong;
  - the Spec brief adds an **Unverified** category for checks the spec asks
    for that the evidence does not show;
  - a fallback when the harness cannot start subagents.

## Written here

`commit`, `validate`, `report-bug`, `fix-bug`, `harb-setup` and
`harness-check` generalize workflows the author wrote in their own projects.
They copy no third-party text.
