---
name: fix-bug
description: Pick an existing bug issue, reproduce it on the current checkout, fix it test-first at the seam, review it against the issue, and report.
disable-model-invocation: true
---

# Fix a bug

The issue is the statement of expected behavior from start to review.
Tracker operations and labels are in `docs/agents/issue-tracker.md`.

## 1. Select

If the user gave an issue number or URL, read it. Otherwise list open bug
issues, ready-for-agent first, and show a short list with symptoms and
blockers. The user chooses; never start on the first one by default. With no
match, say so: a new symptom belongs in `report-bug`.

Read the whole issue: body, comments, linked issues, and the decisions it
names. Check for linked commits or open PRs and for another session working on
it before starting. A missing ready-for-agent label is not a reason to refuse
an issue the user chose; find what is actually missing and resolve that.

Load the affected area's feature skill and its **Related features**; load
`data-safety-check`, if the project has one, when stored data, sync or
migrations are involved. Work on a task branch (`commit` skill, step 1), in a
separate worktree if another session is using this checkout.

## 2. Reproduce

Rerun the issue's reproduction on the current checkout. If it no longer
fails, compare commit, environment and data with the report; that is not proof
the bug is fixed. State the uncertainty before any speculative change.

## 3. Fix

1. Write the regression test first, at the seam where the bug happens, and
   watch it fail for the reported reason. If no seam can reach the bug, say so
   now and agree another check with the user.
2. Make the smallest coherent change that makes it pass. The issue's expected
   behavior is the acceptance criterion; take a conflict or a missing product
   decision to the user instead of inventing one. If the fix needs design
   decisions beyond the issue, recommend `grilling` first.
3. Run the scoped `validate` checks for the feature and its related features.
   Remove temporary diagnostics; keep useful fixtures.

## 4. Commit and review

1. Commit with the `commit` skill, referencing the issue in the message. Leave
   out closing keywords (`Fixes #NN`) unless this commit alone meets the
   issue's completion criteria.
2. Review the commit with `review-change`, giving the issue as the spec. Fix
   real findings in a follow-up commit and review that.

## 5. Report and update the issue

Comment on the issue once: cause, change, commits or PR, the regression test,
and what was verified at each level the project distinguishes. Leave it open
while a required check is still pending, and say what remains. Closing it
needs the user's request or a closing commit reaching trunk.

Report to the user in the `validate` format, including the regression test's
name and that it failed before the fix.
