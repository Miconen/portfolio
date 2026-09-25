# Rewrite in SvelteKit, self-hosted on Railway

The v1 site was Next 14 on Vercel. v2 is a from-scratch SvelteKit rewrite running as a long-lived Node server (`adapter-node`) on Railway, carrying over content but not components. SvelteKit is the framework Mico already works in daily, ships far less client JS for a mostly-static site, and a persistent server lets pages be server-rendered with live, cached GitHub data instead of freezing it at build time. Mico already deploys other projects (e.g. Tectonic Bot) on Railway and will attach the custom domain there.

## Considered Options

- **Upgrade Next in place**: rejected; the shadcn look was part of what made the site feel generic, and a small site is cheap to rewrite.
- **Prerender everything (static hosting)**: rejected; Repository metadata ("last push 2d ago") would go stale between deploys.
