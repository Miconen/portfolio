# micorintala.com

My portfolio: SvelteKit (Svelte 5) rendered on a Node server on Railway, in Finnish (`/`) and English (`/en`).

- **Content** lives in [`content/`](content/) as Markdown with YAML front matter, one file per language.
  Edit it directly or through [Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin/`
  (sign in with a GitHub personal access token); saving commits to `main` and redeploys.
- **Repository metadata** (languages, last push) is fetched live from the GitHub API and cached for an hour.
- **Skills** are never listed by hand: each Project declares the Skills it demonstrates, and the skills section
  inverts that. Categories live in [`content/skills.yml`](content/skills.yml).
- The vocabulary (Project, Group, Repository, Skill, Role, Featured, Write-up) is defined in
  [`CONTEXT.md`](CONTEXT.md); architectural decisions are in [`docs/adr/`](docs/adr/).

## Develop

```sh
npm install
cp .env.example .env   # optional: RESEND_API_KEY, GITHUB_TOKEN
npm run dev
```

| Command | |
|---|---|
| `npm run dev` | dev server |
| `npm run check` | type check |
| `npm test` | unit tests, including guards on the content in `content/` |
| `npm run build && npm start` | production build on `node build` (set `ORIGIN=http://localhost:3000` to post forms over http) |

## Content

A Project is `content/projects/<slug>.fi.md` (plus `.en.md` for the translation):

```md
---
title: "Tectonic Bot"
summary: "One line for cards and lists."
role: "Lead developer · 560+ commits"
featured: true          # shown on the home page
group: "tectonic"       # optional, a file in content/groups/
order: 2                # position on the page / within the group
repos: ["Miconen/tectonic-bot"]
skills: ["TypeScript", "discord.js"]
---

The Write-up, in Markdown.
```

Shared fields (`featured`, `group`, `order`, `repos`, `skills`) are read from the Finnish file; the English file
only needs the translated `title`, `summary`, `role` and body.

## Deploy (Railway)

[`railway.toml`](railway.toml) builds with Railpack and runs `node build`, health-checked at `/healthz`.
Set these variables on the service:

| Variable | |
|---|---|
| `RESEND_API_KEY` | required for the contact form |
| `GITHUB_TOKEN` | recommended (raises the GitHub API rate limit) |

`ORIGIN` is not needed: behind Railway's HTTPS proxy the request origin already matches.

Mail: the form sends through Resend as `form@micorintala.com` to `contact@micorintala.com`, which Cloudflare
Email Routing forwards to Gmail; replies go straight to the visitor.
