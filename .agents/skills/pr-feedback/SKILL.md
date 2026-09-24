---
name: pr-feedback
description: Analyze pull request review comments against the checked-out code and ask before making fixes.
---

# PR Feedback

Reply in {{response_language}}.

Use this skill when the user gives a pull request reference, a review comment reference, a comment URL, or pasted review text and wants the feedback checked.

1. Check the current worktree before doing anything else. Run `git diff`, `git diff --cached`, and `git status --short`. If any tracked or untracked change exists, stop and tell the user. Do not stash, reset, or discard changes.
2. Accept any of these inputs: a pull request number or URL, a specific review comment number or URL, or copied review comment text. Treat the input as opaque. Inspect the connected git-tracker MCP tools and resolve it as follows:
   - For a pull request reference, load that exact pull request.
   - For a comment reference or URL, load the comment and its parent pull request.
   - For pasted text, search for an exact comment match. If one match is found, use its parent pull request. If several match, list the matching pull requests and ask the user to choose. If none match, ask for a pull request reference.
   Read the pull request source branch, repository, title, status, and all review comments or questions, including each comment's status and priority level when available (`P0`, `P1`, `P2`, or another value). Do not create, edit, resolve, dismiss, or reply to comments.
3. Check out the pull request source branch locally. If it exists, run `git checkout <source branch>`. If it does not exist, identify the pull request's Git remote, run `git fetch <remote> <source branch>`, then create a local tracking branch with `git checkout -b <source branch> --track <remote>/<source branch>`. If checkout or fetch fails, stop and report the error.
4. Extract a task reference from the pull request title first, then from the source branch name, using `{{task_prefix_regexp}}`. Use the first non-empty capture group when one exists; otherwise use the full first match. If a task reference is found, use the connected task-tracker MCP tool to load the exact task title, description, goal, and acceptance criteria. Do not modify the task. If no task reference is found, say that ticket context is unavailable and do not claim that acceptance criteria were checked.
5. Analyze only open or unresolved review comments. Skip comments marked resolved, closed, dismissed, or otherwise inactive. If a comment has no status, do not assume that it is open; report it as skipped with unknown status. Also skip approvals and comments that do not ask for a change, but count all skipped comments.
6. Analyze every remaining review question against the code in the checked-out branch. Read the referenced file and surrounding code, then inspect related code or tests when needed. Compare each finding with the linked task description and acceptance criteria, especially the acceptance criteria. State whether the requested change supports, conflicts with, or is outside the task. Do not judge a comment from its wording alone.
7. Stay neutral. Do not take the reviewer's side or the developer's side. Judge the situation independently and rationally from the code, task context, acceptance criteria, and observable facts. Separate facts from assumptions, and say when the available evidence is not enough.
8. Classify each comment as `valid`, `already fixed`, `not applicable`, `overrated`, or `needs clarification`. Use `overrated` when the concern is partly valid but the comment describes its impact or urgency too strongly. For each one, explain the finding in plain language, point to the relevant file and line when possible, state what change would address it when the finding is valid, and draft a short possible answer to the reviewer in {{possible_answer_language}}.
9. After the analysis, ask the user what to do with the valid findings. Offer: fix all valid findings, fix selected findings, or do nothing. Do not edit files until the user chooses.
10. If the user approves fixes, make only the approved changes and report what changed. Do not commit, push, or change pull request comments.

Use this report format:

```text
📌 PR: <reference> <title>
🌿 Branch: <source branch>
🎫 Task: <task reference and title, or ticket context unavailable>

💬 Review 1: <short comment text>
🚦 Level: <priority level, such as P0, P1, or P2>
📊 Result: <valid | already fixed | not applicable | overrated | needs clarification>

🔎 Finding: <plain-language explanation>

🎯 Ticket check: <comparison with the task description and acceptance criteria>

🛠️ Action: <suggested fix or why no fix is needed>

💡 Possible answer: <short answer to the reviewer in {{possible_answer_language}}>

📋 Summary: <number of open comments analyzed and comments skipped by status or type>
```

Keep quoted review text, priority levels, task references, and ticket acceptance criteria exact. Omit the level when the PR does not provide one. If no actionable open comments exist, say so and do not ask for fixes.
