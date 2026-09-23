---
name: new-hotfix
description: Create a new hotfix branch from an updated hotfix base branch using a task from the task tracker.
---

# New Hotfix

Reply in {{response_language}}.

Use this skill to start work on a hotfix from a task reference.

1. Check the worktree before changing branches. Run `git diff`, `git diff --cached`, and `git status --short`. If any tracked or untracked change exists, stop and tell the user. Do not stash, reset, or discard changes.
2. Check out `{{base_hotfix_branch}}` and run `git pull` to get its latest changes. If the branch is missing or either command fails, stop and report the error. Do not force-pull or reset the branch.
3. Read the user's input for a task reference. It must match the configured task regexp `{{task_prefix_regexp}}`. Use the first non-empty capture group when one exists; otherwise use the full first match. If no task number was provided, the regexp is empty, or the input does not match, ask the user for a valid task reference and stop.
4. Use the connected task-tracker MCP tool to find the exact task. Read the task name only. Do not create, edit, transition, assign, comment on, or otherwise change the task. If the task is not found, stop and tell the user.
5. Build the branch name from `<task number> <task name>`:
   - Replace each run of whitespace with `-`.
   - Remove every character except ASCII letters, digits, and `-`.
   - Collapse repeated `-` characters and trim `-` from both ends.
   - Keep the task number in the branch name.
6. If the sanitized branch name is empty or already exists, stop and report the problem. Otherwise create it from the updated hotfix base branch with `git checkout -b <branch name> {{base_hotfix_branch}}`.
7. Report the created branch name and task name.

Do not commit, push, stash, reset, or modify task-tracker data.
