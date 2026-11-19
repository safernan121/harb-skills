# Issue tracker: GitHub

Issues, specs and bug reports live in <owner/repo> GitHub Issues. Use the
`gh` CLI; inside a clone it infers the repository.

## Operations

- Create: `gh issue create --title "..." --body-file <file>`.
- Read: `gh issue view <number> --json number,title,body,labels,state,comments`.
- List: `gh issue list --state open --label <label> --json number,title,labels`.
- Search: `gh issue list --state all --search "<symptom or error>" --json number,title,state,url`.
- Comment: `gh issue comment <number> --body-file <file>`.
- Labels: `gh issue edit <number> --add-label <label>` / `--remove-label <label>`.
- Close: `gh issue close <number> --comment "..."`.

"Publish to the issue tracker" means creating an issue; "fetch the ticket"
means reading its body and comments.

## Labels

- `bug`: every bug report.
- `ready-for-agent`: expected behavior, scope and evidence are enough to start
  work. A known root cause is not required.

## Privacy

Issues are visible to everyone with access to the repository. Redact secrets,
tokens and personal data from logs and screenshots before posting.

**PRs as a request surface: no.**
