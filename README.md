# Open Skills

Universal AI skills for coding agents. Skills stay focused, agent-agnostic, and safe to load from any supported.

## Structure

- `AGENTS.md` contains repository guidance for coding agents.
- `.agents/skills/` contains portable skills.
- Each skill lives in its own directory and defines its behavior in `SKILL.md`.
- `SKILLS.md` contains a human-readable skill catalog.

## Skills

See the [skill catalog](SKILLS.md).

## Build Skills

The building of the skills makes a project-specific skills directory from `.agents/skills/`.

To build skills with the default `config.json` run the following command:

```sh
node build.js
```

Pass another config file as the first argument when needed:

```sh
node build.js myproject.config.json
```

### Skill Placeholders

While building skills, it replaces `{{variable}}` placeholders with values from a config.

| Config value | Scope | Behavior |
| --- | --- | --- |
| `response_language` | Global, or per skill | Sets the response language. A skill-level value overrides the global value. |
| `task_prefix_regexp` | Global, or per skill | Matches and extracts a task identifier. An empty value disables task-prefix handling. |
| `base_feature_branch` | Global, or per skill | Branch to update and use as the parent for a new branch. |
| `base_hotfix_branch` | Global, or per skill | Branch to update and use as the parent for a new hotfix branch. |
| `commit_language` | `create-commit` and `preview-commit` only | Sets the language of the generated commit message. |
| `possible_answer_language` | `analyze-pr-feedback` only | Sets the language of the suggested answer to a reviewer. |

### External Skills

While building skills, it can use a remote Git repository to download provided skill and save it to the build directory.

```
{
  ...
  "external_skills": [
    {
      "repository": "https://github.com/user/skills.git",
      "ref": "main",
      "skills": {
        "cool-skill": "skills/cool-skill"
      }
    }
  ],
  ...
}
```

## How to connect to OpenCode

OpenCode supports project-local and global configs.

Add this repository's skills directory to the `skills` field in the config:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": [
    "~/Developer/open-skills/default-skills"
  ]
}
```

Skills can be added to the global OpenCode config or to a project-local
`opencode.json` / `opencode.jsonc` config.
