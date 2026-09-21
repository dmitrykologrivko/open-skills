# Open Skills

Universal AI skills for coding agents. Skills stay focused, agent-agnostic, and safe to load from any supported.

## Structure

- `AGENTS.md` contains repository guidance for coding agents.
- `.agents/skills/` contains portable skills.
- Each skill lives in its own directory and defines its behavior in `SKILL.md`.
- `SKILLS.md` contains a human-readable skill catalog.

## Skills

See the [skill catalog](SKILLS.md).

## How to connect into OpenCode

OpenCode supports project-local and global configs.

Add this repository's skills directory to the `skills` field in the config:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": [
    "~/Developer/open-skills/.agents/skills"
  ]
}
```

Skills can be added to the global OpenCode config or to a project-local
`opencode.json` / `opencode.jsonc` config.
