---
name: open-skills:explain-task
description: Find a task by reference through the connected MCP tracker and explain it in clear, plain language.
---

# Task Summary

Reply in {{response_language}}.

Use when the user gives a task reference, key, ID, or URL and wants a clear explanation of the task.

1. Treat the given reference as opaque input.
2. Inspect the connected MCP tools and use the task-tracker tool that can find or read this reference. Do not ask the user to name the tracker.
3. Search for an exact reference first. If the input is a URL, use its task key or ID when the MCP tool needs one.
4. Read the title, status, description, goal, work details, acceptance criteria, risks, blockers, and link when available. Never create, edit, transition, assign, comment on, or otherwise change a task.
5. Do not guess missing facts. If no task is found, say `Task not found: <reference>`. If several tasks match, list their references and ask the user to choose.
6. Keep task keys, IDs, URLs, and exact quoted text unchanged.
7. Explain the task as if speaking to a colleague who does not know the project. Use common words and short sentences. Avoid technical terms, internal names, and acronyms unless they are needed; explain them in plain words when they are needed.
8. Give enough detail to explain the reason for the task, the work to do, and what a successful result looks like. Use one to three short sentences for each section when the source has enough information.
9. Use this format:

```text
📌 [<reference>] <title>

📊 Status: <status>

🧭 In plain words: <what this task is about>

🎯 Why: <why the task matters>

🛠️ What to do: <work needed>

✅ Done means: <how to know the task is complete>

⚠️ Risks/Blockers: <risks or blockers>

🔗 Link: <task URL>
```

Omit optional lines when the task has no such data. Keep the answer readable and informative, not just a list of copied fields. Do not include comments, full history, or assumptions.
