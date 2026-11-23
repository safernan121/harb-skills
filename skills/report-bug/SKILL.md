---
name: report-bug
description: Investigate a symptom the user reports, check for an existing report, and file or supplement a bug issue in the project's tracker. Ends with the report; does not fix.
disable-model-invocation: true
---

# Report a bug

Turn the user's symptom into a report another session can pick up with
`fix-bug`. Tracker operations, labels and privacy rules are in
`docs/agents/issue-tracker.md`. If the user asks for a draft only, stop before
publishing and show it.

## 1. Pin down the symptom

From the user's account, write down the expected and the actual behavior and
where it was seen: environment, platform or device, build or version, and any
state that matters (signed in or not, online or offline, which data). Ask only
for what changes the investigation and cannot be found by looking.

Use the glossary's words (`docs/agents/domain.md`) and load the feature skill
of the affected area with its **Related features**.

## 2. Look for an existing report

Search open and closed issues for the symptom, error text and affected
feature, not only the title or the bug label. Read likely matches with their
comments and linked fixes. A clear open match that already covers the user's
case ends here: return its link.

A failed or unavailable search is not evidence that no report exists. Report
the failure before filing a new issue.

## 3. Reproduce at the smallest useful scope

Try, in order of cost: an existing test or a new failing test at the seam, a
scripted call into the code, the running app, then a real device or deployed
environment. Reuse existing fixtures. Never reproduce against real users' data
or production systems unless the user says so.

Record for each attempt: commit (`git rev-parse --short HEAD`), environment,
the exact steps or command, expected and actual result, and how often it
happens when intermittent.

Stop when the evidence describes the defect and its limits, or when going
further needs a device, access or user input you do not have. A root cause is
not required to file. Classify the result as **reproduced**, **tried, not
reproduced** (with what was tried), or **not tried** (with why). Keep
observations apart from hypotheses.

If the bug may lose or rewrite stored user data, say so at the top of the
report and name the `data-safety-check` rule it breaks, if the project has one.

## 4. File or supplement

Search again with what you learned, matching behavior and conditions rather
than a shared error message. Then choose:

- **Open match, new evidence:** comment with only the new evidence (version,
  environment, reproduction, impact). Return its link.
- **Open match, nothing new:** return its link and why it matches. No comment.
- **Closed match:** check whether the tested commit contains its fix. A
  recurrence after the fix is a new report that links the old one; never
  reopen silently or dismiss it as a duplicate.
- **No match:** create an issue with the tracker's bug label, a concrete
  symptom as the title, and the template below. Add the ready-for-agent label
  only when expected behavior, scope and evidence are enough to start a fix. If
  the evidence says the behavior is intended, tell the user instead of filing a
  defect.

```markdown
## Problem and impact
What fails, who is affected, and whether stored data is at risk.

## Expected and actual behavior

## Reproduction
Steps or command and fixtures. Result: reproduced / tried, not reproduced /
not tried, and why.

## Tested version and environment
Commit, app version, platform or device, and relevant state.

## Evidence and open questions
Redacted logs and related issues. Mark hypotheses as hypotheses.
```

Inline small fixtures or link committed files; local-only paths are useless to
the next session. Remove secrets and personal data. Report whether the issue
was created, supplemented or already covered, with its URL.
