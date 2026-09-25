<script lang="ts">
	import { languageShares } from '$lib/format';
	import type { Project } from '$lib/content/types';
	import { useHighlight } from '$lib/highlight.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { RepoMeta } from '$lib/server/github';
	import { GITHUB_URL } from '$lib/site';

	let {
		projects,
		number,
		repos,
		moreOnGitHub
	}: { projects: Project[]; number: string; repos: Record<string, RepoMeta>; moreOnGitHub?: number } = $props();

	const hl = useHighlight();
</script>

<fieldset class="pane more">
	<legend><span class="num">{number}</span> {m.other_projects()} <span class="dim">· {projects.length}</span></legend>
	<ul class="mono">
		{#each projects as p (p.slug)}
			{@const lang = languageShares(p.repos.map((r) => repos[r]?.languages ?? {}))[0]}
			{@const state = hl?.state(p.skills) ?? null}
			<li id="p-{p.slug}" class:lit={state === 'lit'} class:faded={state === 'faded'}>
				<a href={localizeHref(`/projects/${p.slug}`)}>{p.title}</a>
				<span class="dim role">{p.role}</span>
				{#if lang}<span class="lang"><i class="dot" style:background={lang.color}></i>{lang.name}</span>{/if}
			</li>
		{/each}
	</ul>
	<div class="links mono">
		<a href={localizeHref('/projects')}>{m.all_projects()} →</a>
		<a href={GITHUB_URL}>{moreOnGitHub ? m.more_on_github({ count: moreOnGitHub }) : m.github_profile()} →</a>
	</div>
</fieldset>

<style>
	.more {
		border-style: dashed;
		display: flex;
		flex-direction: column;
		padding-bottom: 12px;
	}
	ul {
		list-style: none;
		margin: 0 -18px 12px;
		padding: 0;
	}
	li {
		display: flex;
		align-items: baseline;
		gap: 10px;
		padding: 5px 18px;
		transition:
			opacity 0.4s,
			background 0.4s;
	}
	li + li {
		border-top: 1px dashed var(--line);
	}
	li a {
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}
	li a:hover {
		color: var(--acc);
	}
	.role {
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}
	.lang {
		margin-left: auto;
		color: var(--dim);
		font-size: 12px;
		white-space: nowrap;
	}
	.lang i {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		margin-right: 6px;
	}
	.faded {
		opacity: 0.35;
	}
	.lit {
		background: var(--status);
		box-shadow: inset 2px 0 0 var(--acc);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin-top: auto;
	}
	.links a {
		color: var(--acc);
		text-decoration: none;
	}
	.links a:hover {
		text-decoration: underline;
	}
</style>
