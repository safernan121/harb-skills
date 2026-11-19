# Git conventions

- **Trunk:** `main`.
- **Branches:** `<type>/<kebab-slug>`, type `feat`, `fix`, `chore` or
  `refactor`, started from `origin/main`.
- **Commit messages:** `<type>: <imperative summary> (<task or issue ID>)`.
  <Linter, e.g. `npx commitlint --edit <file>`, or "none".>
- **Commits per branch:** <several, or one amended commit because PRs squash>.
- **Landing:** <"push the validated branch to `main`" or "push the branch, open
  a PR with `gh pr create --fill --base <parent>`, merge with
  `gh pr merge --squash`">.
- **Needs the user's authorization:** committing on trunk, pushing, opening or
  merging PRs, rewriting pushed history, force-pushing, deleting branches.
- **Never stage:** `.env*`, build outputs, keystores, credentials <plus
  project-specific paths>.
