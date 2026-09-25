<script lang="ts">
	import RepoRows from '$lib/components/RepoRows.svelte';
	import { ago } from '$lib/format';
	import { iconFor } from '$lib/icons';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();
	const p = $derived(data.project);
</script>

<svelte:head>
	<title>{p.title} · Mico Rintala</title>
	<meta name="description" content={p.summary} />
	<meta property="og:title" content="{p.title} · Mico Rintala" />
	<meta property="og:description" content={p.summary} />
</svelte:head>

<nav class="crumbs mono dim">
	<a href={localizeHref('/projects')}>← {m.back_all()}</a>
	{#if data.group}<span> / {data.group.title}</span>{/if}
</nav>

<article class="layout">
	<fieldset class="pane main">
		<legend><span class="acc">{p.title}</span></legend>
		<h1>{p.title}</h1>
		<p class="mono role"><span class="dim">{m.role()}</span> {p.role}</p>
		<p class="lede">{p.summary}</p>
		<div class="prose">{@html p.html}</div>
	</fieldset>

	<aside>
		<fieldset class="pane">
			<legend>{m.project_repos()} <span class="dim">· {p.repos.length}</span></legend>
			<RepoRows names={p.repos} repos={data.repos} showAge={(iso) => m.project_last_push({ ago: ago(iso) })} />
		</fieldset>
		<fieldset class="pane">
			<legend>{m.project_skills()} <span class="dim">· {p.skills.length}</span></legend>
			<ul class="tags mono">
				{#each p.skills as s (s)}
					{@const icon = iconFor(s)}
					<li>
						{#if 'path' in icon}
							<svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} fill-rule={icon.evenodd ? 'evenodd' : undefined} /></svg>
						{:else}
							<span class="mono-ic" aria-hidden="true">{icon.mono}</span>
						{/if}{s}
					</li>
				{/each}
			</ul>
		</fieldset>
	</aside>
</article>

<style>
	.crumbs {
		margin: 32px 0 16px;
	}
	.crumbs a {
		text-decoration: none;
		color: var(--acc);
	}
	.crumbs a:hover {
		text-decoration: underline;
	}
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
		gap: 16px;
		align-items: start;
	}
	aside {
		display: grid;
		gap: 16px;
	}
	aside :global(.repos) {
		margin-bottom: -14px;
	}
	h1 {
		font: 800 clamp(28px, 4vw, 40px) / 1.1 var(--mono);
		letter-spacing: -0.02em;
		margin: 6px 0 10px;
	}
	.role {
		margin: 0 0 12px;
	}
	.lede {
		font-size: 18px;
		margin: 0 0 20px;
		max-width: 60ch;
	}
	.tags {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tags li {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: var(--status);
		border: 1px solid var(--line);
		border-radius: 3px;
		padding: 4px 10px;
	}
	svg {
		width: 14px;
		height: 14px;
		fill: currentColor;
		opacity: 0.75;
	}
	.mono-ic {
		font-size: 9px;
		font-weight: 800;
		line-height: 14px;
		min-width: 14px;
		padding: 0 2px;
		text-align: center;
		border: 1px solid currentColor;
		border-radius: 2px;
		opacity: 0.75;
	}
	@media (max-width: 860px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}
</style>
