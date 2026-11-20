# Stacked branches

A stacked branch starts from its parent branch instead of trunk, and its PR
targets that parent. Each layer follows the project's commit rules on its own.
Use one tool per stack: `gh stack` when `gh stack --version` succeeds and the
project uses it, otherwise plain git.

## Plain git

- After changing a branch that has descendants, restack them in one go:
  `git rebase --update-refs --onto <branch> <old-tip> <top-branch>`, where
  `<old-tip>` is the commit the descendants were built on (`<branch>@{1}`
  right after a single amend). `--update-refs` moves every branch in between.
- Merge from the bottom, one PR at a time. After a squash merge, rebase the
  next branch with `git rebase --update-refs --onto origin/<trunk> <merged-branch>`
  using the local ref of the merged branch; a plain rebase onto trunk can
  replay commits the squash already landed and conflict.
- Deleting a merged PR's branch makes GitHub retarget the next PR to trunk.

## gh stack

- Replace generated branch-name PR titles with each layer's commit subject and
  body.
- Merging a PR also merges every unmerged PR below it, so authorization must
  cover all of them.
- Reordering, folding, renaming or dropping layers replaces the stack on
  GitHub; get the user's direction first.

## Report

Each affected branch with its PR link and whether the PR was created, updated,
or unchanged. Name any change outside the intended branches.
