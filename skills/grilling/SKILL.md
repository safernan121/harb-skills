---
name: grilling
description: Interview the user relentlessly about a plan, decision, or design until every branch is settled. Use before planning a large or unclear change, or when the user says "grill me" or asks to stress-test an idea.
---

# Grilling

Adapted from the `grilling` skill in [mattpocock/skills](https://github.com/mattpocock/skills)
by Matt Pocock (MIT License, see [LICENSE](LICENSE) in this folder).

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

## Start from what is settled

Read the project's glossary and decision records where `docs/agents/domain.md` says they live (by default `GLOSSARY.md` and `docs/adr/`), plus any roadmap item or spec the plan belongs to. Load the feature skills that own the areas the plan touches. A confirmed decision is not a question. A conflict with one is: put it to the user.

## Rounds

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the codebase, docs, or tools, look it up yourself or dispatch a read-only subagent; don't ask the user for anything you could look up. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the answer; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

## Done

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed, and the user confirms you have reached a shared understanding.

Then write a short plan built from the settled tree, and record each confirmed decision where `docs/agents/domain.md` keeps decision records. A settled tree is not approval to implement: wait for the user to approve the plan.
