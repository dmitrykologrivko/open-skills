---
name: open-skills:create-commit
description: Create a commit from selected current changes, or show the message when commits are prohibited.
---

# Commit

Reply in {{response_language}}.

Commit all current changes.

1. Read the project instructions first. If an agent may not create commits, work message-only: never stage or commit.
2. Run `git status --short`, `git status`, `git diff`, and `git diff --cached`. If a merge, rebase, cherry-pick, or revert is in progress, report a conflict then stop.
3. If there are no changes, say so and stop.
4. Check the state of the staging area. If there are modified or untracked files that are not yet staged, inform the user and list them. Do not add them automatically. Offer the following options:

   * add specific files to the current staging area;
   * add all detected changes;
   * proceed with the commit using only the changes already staged;
   * cancel the commit.

   Wait for the user's choice before running `git add`.
5. Write one short imperative message for all changes in {{commit_language}}. Use `git diff --cached` after staging, or the full working-tree changes in message-only mode. No body.
6. If `{{task_prefix_regexp}}` is non-empty, run `git branch --show-current` and prepend the match as `<match> <message>` on one line. A project-defined format wins.
7. In message-only mode, show the message and stop. Else commit with `git commit -m "<message>"`, adding `--no-verify` only if the user asked.
8. Run `git log -1 --stat`. Report the commit. If it differs from what was reviewed, report and stop; do not amend.

## Guards

- Never edit file contents, reset, or stash.
- Do not undo user edits to restore a previous agent result.

If `git commit` fails, report the error and ask:
* retry with `--no-verify`;
* fix issues detected by pre-commit hooks (name the cause first; this does not permit disabling hooks);
* do nothing.

Do not retry or change files until the user chooses. After a fix, reread the diffs and status before retrying.
