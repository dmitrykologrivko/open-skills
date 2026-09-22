---
name: task-summary
description: Find a task by reference through the connected MCP tracker and return a short structured summary.
---

# Task Summary

Use when the user gives a task reference, key, ID, or URL and wants a short task description.

1. Treat the given reference as opaque input.
2. Inspect the connected MCP tools and use the task-tracker tool that can find or read this reference. Do not ask the user to name the tracker.
3. Search for an exact reference first. If the input is a URL, use its task key or ID when the MCP tool needs one.
4. Read only the task data needed for the summary. Never create, edit, transition, assign, comment on, or otherwise change a task.
5. Do not guess missing facts. If no task is found, say `Task not found: <reference>`. If several tasks match, list their references and ask the user to choose.
6. Keep task keys, IDs, URLs, and exact quoted text unchanged.
7. Reply in `{{response_language}}` using this format:

```text
📌 [<reference>] <title>

📊 Status: <status>

🎯 Goal: <why the task exists>

🛠️ Work: <main work>

✅ Acceptance criteria: <acceptance condition>

⚠️ Risks/Blockers: <risks or blockers>

🔗 Link: <task URL>
```

Omit optional lines when the task has no such data. Keep each line short. Do not include comments, full history, or assumptions.
