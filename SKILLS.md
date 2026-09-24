# Skill Catalog

This is a human-readable index. Agent Skills-compatible clients use each
skill's `SKILL.md` frontmatter as the machine-readable catalog.

| Skill | Description | Path |
| --- | --- | --- |
| `hello` | A minimal test skill that greets the user. | [`.agents/skills/hello/SKILL.md`](.agents/skills/hello/SKILL.md) |
| `task-summary` | Find a task by reference through the connected MCP tracker and explain it in clear, plain language. | [`.agents/skills/task-summary/SKILL.md`](.agents/skills/task-summary/SKILL.md) |
| `commit` | Create a commit from the current Git diff, or show the message when commits are prohibited. | [`.agents/skills/commit/SKILL.md`](.agents/skills/commit/SKILL.md) |
| `commit-preview` | Show a short change summary and proposed commit message from the current Git diff without committing. | [`.agents/skills/commit-preview/SKILL.md`](.agents/skills/commit-preview/SKILL.md) |
| `new-feature` | Create a new feature branch from an updated base branch using a task from the task tracker. | [`.agents/skills/new-feature/SKILL.md`](.agents/skills/new-feature/SKILL.md) |
| `new-hotfix` | Create a new hotfix branch from an updated hotfix base branch using a task from the task tracker. | [`.agents/skills/new-hotfix/SKILL.md`](.agents/skills/new-hotfix/SKILL.md) |
| `pr-feedback` | Analyze pull request review comments against the checked-out code and ask before making fixes. | [`.agents/skills/pr-feedback/SKILL.md`](.agents/skills/pr-feedback/SKILL.md) |
