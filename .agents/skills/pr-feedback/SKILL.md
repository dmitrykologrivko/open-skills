---
name: pr-feedback
description: Analyze pull request review comments against the checked-out code and ask before making fixes.
---

# PR Feedback

Reply in {{response_language}}.

Use this skill when the user gives a pull request reference and wants its review questions checked.

1. Check the current worktree before doing anything else. Run `git diff`, `git diff --cached`, and `git status --short`. If any tracked or untracked change exists, stop and tell the user. Do not stash, reset, or discard changes.
2. Treat the pull request reference as opaque input. Inspect the connected tracker MCP tools and use the tool that can read the exact pull request and its review comments. Read the pull request source branch, repository, title, status, and all review comments or questions, including each comment's priority level when available (`P0`, `P1`, `P2`, or another value). Do not create, edit, resolve, dismiss, or reply to comments.
3. Check out the pull request source branch locally. If it exists, run `git checkout <source branch>`. If it does not exist, identify the pull request's Git remote, run `git fetch <remote> <source branch>`, then create a local tracking branch with `git checkout -b <source branch> --track <remote>/<source branch>`. If checkout or fetch fails, stop and report the error.
4. Analyze every actionable review question against the code in the checked-out branch. Read the referenced file and surrounding code, then inspect related code or tests when needed. Do not judge a comment from its wording alone.
5. Classify each comment as `valid`, `already fixed`, `not applicable`, `overrated`, or `needs clarification`. Use `overrated` when the concern is partly valid but the comment describes its impact or urgency too strongly. For each one, explain the finding in plain language, point to the relevant file and line when possible, state what change would address it when the finding is valid, and draft a short possible answer to the reviewer.
6. Ignore approvals and comments that do not ask for a change, but mention how many were skipped. Do not invent missing review context.
7. After the analysis, ask the user what to do with the valid findings. Offer: fix all valid findings, fix selected findings, or do nothing. Do not edit files until the user chooses.
8. If the user approves fixes, make only the approved changes and report what changed. Do not commit, push, or change pull request comments.

Use this report format:

```text
📌 PR: <reference> <title>
🌿 Branch: <source branch>

💬 Review 1: <short comment text>
🚦 Level: <priority level, such as P0, P1, or P2>
📊 Result: <valid | already fixed | not applicable | overrated | needs clarification>
🔎 Finding: <plain-language explanation>
🛠️ Action: <suggested fix or why no fix is needed>
💡 Possible answer: <short answer to the reviewer>

📋 Summary: <number of valid, already fixed, not applicable, and unclear comments>
```

Keep quoted review text, priority levels, and references exact. Omit the level when the PR does not provide one. If no actionable comments exist, say so and do not ask for fixes.
