---
name: commit-preview
description: Show a short change summary and proposed commit message from the current Git diff without committing.
---

# Commit Preview

Reply in {{response_language}}.

Run `git diff` and `git diff --cached`.

Read both unstaged and staged changes. Treat them as one change set.
Use `git diff --name-only`, `git diff --cached --name-only`, `git diff --numstat`, and `git diff --cached --numstat` to calculate the change stats. Count each changed file once, even if it has both staged and unstaged changes. Sum numeric additions and deletions. Count binary files but do not include them in line totals.

First, report the number of changed files and total added and removed lines.
Then say in plain text what was done in one short informative line.
Write the proposed commit message as one short imperative line. Use simple words. No body. No prefix.

Use this format:

```text
Changes: <file count> files, +<added lines> lines, -<removed lines> lines
Summary: <short description of what was done>
Commit: <short imperative message>
```

If there is no staged or unstaged diff, say it to the user. Do not invent a commit message.

Do not modify files or run `git commit`.
