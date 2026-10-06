---
name: open-skills:create-commit
description: Create a commit from the current Git diff, or show the message when commits are prohibited.
---

# Commit

Reply in {{response_language}}.

Create a commit from the current Git diff.

1. Read the project instructions and Git policy first. If they prohibit an AI agent from creating commits, do not run `git commit`. Output only the proposed commit message.
2. Run `git diff`, `git diff --cached`, and `git status --short`. Treat staged and unstaged changes as one change set. Apply the user-edit guard below before proceeding, even if there is no diff. If there is no diff and no mismatch, say about it and stop.
3. Generate one short imperative commit message from the diff in {{commit_language}}. Use simple words. No body.
4. If a task prefix regexp is configured (value: `{{task_prefix_regexp}}`), run `git branch --show-current` and apply it to the branch name. Use the first non-empty capture group when one exists; otherwise use the full first match. If it matches, put the prefix on its own first line, add one space, then put the generated message. If it does not match, use only the generated message. If the project defines it its own format for generated message then use it as a first place.
5. Recheck both diffs and status before staging or committing. If they changed since review, apply the user-edit guard below and stop. Otherwise show or retain the exact final commit message. If the user included `--no-verify`, run `git commit --no-verify` with that message. Otherwise run `git commit` normally.
6. On success, report that the commit was created and include the final commit message.

## User-Edit Guard

Treat current files and diffs as the source of truth. If prior agent edits are known in this session, check for a mismatch: changed content, added files, or removed files. Do not assume who made the change. If no prior state is known, use the current state; do not invent a mismatch.
If a mismatch is found, name the files and briefly explain what differs. Ask whether to proceed with the current changes or take another user-specified action. Stop before staging, committing, or giving a final commit message. This takes precedence over the normal output format.
Do not edit, restore, delete, recreate, reset, or stash files to match earlier agent output or a preferred result. Permission to create a commit is not permission to undo user edits. Change files only when the user explicitly asks for that change. If the user accepts the current state, reread the diff and use it for the message and commit.

## Commit Failure

If `git commit` fails, report the error and ask the user to choose one:

1. Retry with `--no-verify`.
2. Fix the pre-commit hook problem automatically, then retry the commit. If the error is not from a pre-commit hook, say this option is not applicable.
3. Do nothing.

Do not retry or change files until the user chooses. For errors before the commit attempt, report the error only.
