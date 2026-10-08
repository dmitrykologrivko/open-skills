---
name: open-skills:track-changes
description: Report key changes in watched modules or files for the last day, or since Friday on Mondays, with authors and commits, in plain language.
---

# Change Watch

Reply in {{response_language}}.

Use when the user wants a daily digest of changes in specific modules or files.

Watched paths, one per line:

{{watch_paths}}

1. If the watched list is empty, say so and stop.
2. Set the time window:
   - Monday: start at Friday 00:00 local time.
   - Any other day: start 24 hours before now.

   Build an ISO start time with `date`. On Linux: `date -d 'last friday 00:00' +%FT%T` on Monday, else `date -d '24 hours ago' +%FT%T`. On macOS or BSD: `date -v-3d -v0H -v0M -v0S +%FT%T` on Monday, else `date -v-24H +%FT%T`. If unsure, pass `--since="3 days ago"` on Monday or `--since="24 hours ago"` otherwise.
3. For each watched path, list commits in the window: `git log --since="<start>" --name-only --pretty=format:'%h%x09%an%x09%ad%x09%s' -- <path>`. Read only. Do not add, commit, fetch, stash, reset, or edit files.
4. Keep only key changes: features, fixes, behavior, public interfaces, configuration, data or schema changes. Drop noise: formatting, comments, whitespace, pure renames, routine version bumps. If unsure, keep it.
5. Explain each key change in one plain-language line for a reader who is not an engineer: what changed and why it matters. No jargon, no file names, no code. Short sentences.
6. List each change once. If several commits make one change, group them under it.
7. Show the author and the commit for every change: author name, short hash, and commit subject. For grouped changes list every commit.
8. Output:

```text
🗓️ <window, e.g. "Last 24 hours" or "Since Friday">

📁 <watched path>
- <plain-language key change>
  👤 <author> · <short-hash> <commit subject>
```

Leave out a path with no key changes. If nothing changed anywhere, say so.

## Guards

- Read only. Never edit, stage, commit, fetch, reset, or stash.
- Do not guess missing facts. Report only what git history shows.
