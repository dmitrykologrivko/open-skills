---
name: commit-preview
description: Show a short change summary and proposed commit message from the current Git diff without committing.
---

# Commit Preview

Reply in {{response_language}}.

Run `git diff` and `git diff --cached`.

Read both unstaged and staged changes. Treat them as one change set.

First, say in plain text what was done in one short informative line.
Write the proposed commit message as one short imperative line. Use simple words. No body. No prefix.

Use this format:

```text
Summary: <short description of what was done>
Commit: <short imperative message>
```

If there is no staged or unstaged diff, say it to the user. Do not invent a commit message.

Do not modify files or run `git commit`.
