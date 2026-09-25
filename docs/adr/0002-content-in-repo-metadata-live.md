# Write-ups live in the repo; Repository metadata is fetched live

Project Write-ups, Groups and Skill declarations are plain Markdown files with front matter in this repo (one file per language), edited either directly or through Sveltia CMS at `/admin`, which commits to `main` and triggers a redeploy. Repository metadata (languages, stars, last push) is never stored: it is fetched from the GitHub API at request time and cached server-side. Hand-written content changes rarely and benefits from version control; GitHub data changes constantly and would rot if committed.

## Consequences

- Write-ups are plain Markdown, not mdsvex: Sveltia cannot preview Svelte components.
- If the GitHub API is unavailable, pages still render, just without Repository metadata.
