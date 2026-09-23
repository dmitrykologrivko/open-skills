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

`build.js` makes a project-specific skills directory from the skills in `.agents/skills/`.
It replaces `{{variable}}` placeholders with values from a JSON config.

| Config value | Scope | Behavior |
| --- | --- | --- |
| `response_language` | Global, or per skill | Sets the response language. A skill-level value overrides the global value. |
| `task_prefix_regexp` | Global, or per skill | Matches and extracts a task identifier. An empty value disables task-prefix handling. |
| `base_feature_branch` | Global, or per skill | Branch to update and use as the parent for a new branch. |

The default `config.json` builds all current skills into `default-skills/`:

```sh
node build.js
```

Pass another config file as the first argument when needed:

```sh
node build.js myproject.config.json
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
