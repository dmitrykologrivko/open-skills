# Skill Catalog

This is a human-readable index. Agent Skills-compatible clients use each
skill's `SKILL.md` frontmatter as the machine-readable catalog.

| Skill | Description | Path |
| --- | --- | --- |
| `say-hello` | A minimal test skill that greets the user. | [`.agents/skills/say-hello/SKILL.md`](.agents/skills/say-hello/SKILL.md) |
| `explain-task` | Find a task by reference through the connected MCP tracker and explain it in clear, plain language. | [`.agents/skills/explain-task/SKILL.md`](.agents/skills/explain-task/SKILL.md) |
| `investigate-error` | Investigate crashes from a stack trace or an error-monitoring MCP reference; use diagnostic red/green tests and report evidence, root cause, impact, counts, and fix priority without applying production fixes. | [`.agents/skills/investigate-error/SKILL.md`](.agents/skills/investigate-error/SKILL.md) |
| `create-commit` | Create a commit from the current Git diff, or show the message when commits are prohibited. | [`.agents/skills/create-commit/SKILL.md`](.agents/skills/create-commit/SKILL.md) |
| `preview-commit` | Show a short change summary and proposed commit message from the current Git diff without committing. | [`.agents/skills/preview-commit/SKILL.md`](.agents/skills/preview-commit/SKILL.md) |
| `create-feature-branch` | Create a new feature branch from an updated base branch using a task from the task tracker. | [`.agents/skills/create-feature-branch/SKILL.md`](.agents/skills/create-feature-branch/SKILL.md) |
| `create-hotfix-branch` | Create a new hotfix branch from an updated hotfix base branch using a task from the task tracker. | [`.agents/skills/create-hotfix-branch/SKILL.md`](.agents/skills/create-hotfix-branch/SKILL.md) |
| `implement-task` | Start implementing the current task on the current branch right away. | [`.agents/skills/implement-task/SKILL.md`](.agents/skills/implement-task/SKILL.md) |
| `analyze-pr-feedback` | Analyze pull request review comments against the checked-out code and ask before making fixes. | [`.agents/skills/analyze-pr-feedback/SKILL.md`](.agents/skills/analyze-pr-feedback/SKILL.md) |
