---
name: open-skills:preview-commit
description: Show the change summary and proposed commit message for selected current changes without committing.
---

# Commit Preview

Reply in {{response_language}}.

Preview the commit for the changes the user selects. Do not modify files, stage, unstage, or commit.

1. Run `git status --short`, `git status`, `git diff`, and `git diff --cached`. If a merge, rebase, cherry-pick, or revert is in progress, report a conflict then stop.
2. If there are no changes, say so and stop.
3. If there are unstaged or untracked changes, ask the user which changes to base the preview on. Do not stage or unstage anything. Offer the following options:

   * preview only the changes already staged;
   * preview all detected changes, including unstaged and untracked files;
   * cancel the preview.

   Wait for the user's choice before counting or writing the message. If there are no unstaged or untracked changes, preview the staged changes.
4. Count each file once, across all its changes, for the chosen set: tracked files against HEAD, untracked files against `/dev/null`. Sum additions and deletions; count binary files without line totals.
5. Write one short imperative message in {{commit_language}}. No body. Apply the `{{task_prefix_regexp}}` prefix as in `create-commit`; a project-defined format wins.
6. Report:

```text
Changes: <file count> files, +<added lines> lines, -<removed lines> lines
Summary: <short description of what was done>
Commit: <short imperative message in {{commit_language}}>
```

## Guards

- Never edit file contents, stage, unstage, reset, or stash.
- Do not undo user edits to restore a previous agent result.
