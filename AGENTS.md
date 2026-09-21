# Agent Instructions

## Repository Purpose

This repository contains portable skills for coding agents.

## Skill Conventions

- Store skills under `.agents/skills/<skill-name>/`.
- Put the skill definition in `<skill-name>/SKILL.md`.
- Keep skills agent-agnostic unless an integration explicitly requires a platform-specific adapter.
- Make instructions concise, deterministic, and safe.
- Do not modify files or run commands unless the skill explicitly requires it.

## Changes

- Update `README.md` when adding or changing a skill.
- Preserve existing skill behavior unless the change intentionally updates it.
- Use plain text and Markdown where possible so skills remain portable.
