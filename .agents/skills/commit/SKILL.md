---
name: commit
description: Create a commit from the current Git diff, or show the message when commits are prohibited.
---

# Commit

Reply in {{response_language}}.

Create a commit from the current Git diff.

1. Read the project instructions and Git policy first. If they prohibit an AI agent from creating commits, do not run `git commit`. Output only the proposed commit message.
2. Run `git diff` and `git diff --cached`. Treat staged and unstaged changes as one change set. If there is no diff, say about it and stop.
3. Generate one short imperative commit message from the diff. Use simple words. No body.
4. If a task prefix regexp is configured (value: `{{task_prefix_regexp}}`), run `git branch --show-current` and apply it to the branch name. Use the first non-empty capture group when one exists; otherwise use the full first match. If it matches, put the prefix on its own first line, add one space, then put the generated message. If it does not match, use only the generated message.
5. Show or retain the exact final commit message. If the user included `--no-verify`, run `git commit --no-verify` with that message. Otherwise run `git commit` normally.
6. On success, report that the commit was created and include the final commit message.

If `git commit` fails, report the error and ask the user to choose one:

1. Retry with `--no-verify`.
2. Fix the pre-commit hook problem automatically, then retry the commit. If the error is not from a pre-commit hook, say this option is not applicable.
3. Do nothing.

Do not retry or change files until the user chooses. For errors before the commit attempt, report the error only.
