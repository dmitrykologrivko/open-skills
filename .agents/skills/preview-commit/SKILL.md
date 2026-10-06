---
name: open-skills:preview-commit
description: Show a short change summary and proposed commit message from the current Git diff without committing.
---

# Commit Preview

Reply in {{response_language}}.

Run `git diff`, `git diff --cached`, and `git status --short`.

Treat current files and diffs as the source of truth. If prior agent edits are known in this session, check for a mismatch: changed content, added files, or removed files. Do not assume who made the change. If no prior state is known, use the current state; do not invent a mismatch.
If a mismatch is found, name the files and briefly explain what differs. Ask whether to preview the current changes or take another user-specified action, then stop. Do this even if the diff is empty. This takes precedence over the normal output format. If the user accepts the current state, reread the diff and use it for the preview.
Do not edit, restore, delete, recreate, reset, or stash files to match earlier agent output or a preferred result. A preview request grants no permission to change files.

Read both unstaged and staged changes. Treat them as one change set.
Use `git diff --name-only`, `git diff --cached --name-only`, `git diff --numstat`, and `git diff --cached --numstat` to calculate the change stats. Count each changed file once, even if it has both staged and unstaged changes. Sum numeric additions and deletions. Count binary files but do not include them in line totals.

First, report the number of changed files and total added and removed lines.
Then say in plain text what was done in one short informative line.
Write the proposed commit message as one short imperative line. Use simple words. No body. No prefix.

Use this format:

```text
Changes: <file count> files, +<added lines> lines, -<removed lines> lines
Summary: <short description of what was done>
Commit: <short imperative message in {{commit_language}}>
```

If there is no staged or unstaged diff, say it to the user. Do not invent a commit message.

Do not modify files or run `git commit`.
