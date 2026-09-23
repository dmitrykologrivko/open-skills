---
name: commit-preview
description: Show a short change summary and proposed commit message from the current Git diff without committing.
---

# Commit Preview

Run `git diff` and `git diff --cached`.

Read both unstaged and staged changes. Treat them as one change set.

Reply in {{response_language}}. First, say in plain text what was done in one short informative line.
Write the proposed commit message in {{commit_message_language}} as one short imperative line. Use simple words. No body. No prefix.

Use this format:

```text
Summary: <short description of what was done in {{response_language}}>
Commit: <short imperative message in {{commit_message_language}}>
```

If there is no staged or unstaged diff, reply `No diff.` in {{response_language}}. Do not invent a commit message.

Do not modify files or run `git commit`.
