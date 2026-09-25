<script lang="ts">
	import { ago, languageShares } from '$lib/format';
	import { featuredEntries, lastPush, otherProjects } from '$lib/content/model';
	import type { Project } from '$lib/content/types';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();

	const entries = $derived(featuredEntries(data.projects, data.groups));
	const others = $derived(otherProjects(data.projects));
	const pushedAt = $derived(Object.fromEntries(Object.entries(data.repos).map(([k, v]) => [k, v.pushedAt])));
</script>

<svelte:head>
	<title>{m.projects_title()} · Mico Rintala</title>
	<meta property="og:title" content="{m.projects_title()} · Mico Rintala" />
</svelte:head>

<h1 class="sec"><span class="n">01</span>{m.all_projects()}</h1>
<p class="intro dim">{m.projects_intro()}</p>

<fieldset class="pane">
	<legend>{m.featured_projects()}</legend>
	<ul class="list">
		{#each entries as e (e.number)}
			{#if e.kind === 'group'}
				<li class="group mono"><span class="num">{e.number}</span> {e.group.title}</li>
				{#each e.projects as p (p.project.slug)}{@render row(p.project, p.number, true)}{/each}
			{:else}
				{@render row(e.project, e.number, false)}
			{/if}
		{/each}
	</ul>
</fieldset>

<fieldset class="pane others">
	<legend>{m.other_projects()}</legend>
	<ul class="list">
		{#each others as p (p.slug)}{@render row(p, '', false)}{/each}
	</ul>
</fieldset>

{#snippet row(p: Project, number: string, nested: boolean)}
	{@const lang = languageShares(p.repos.map((r) => data.repos[r]?.languages ?? {}))[0]}
	{@const pushed = lastPush(p, pushedAt)}
	<li class="row" class:nested>
		<a class="title mono" href={localizeHref(`/projects/${p.slug}`)}
			>{#if number}<span class="num">{number}</span>{/if}{p.title}</a
		>
		<span class="summary">{p.summary}</span>
		<span class="meta mono dim">
			{#if lang}<i class="dot" style:background={lang.color}></i>{lang.name}{/if}{#if pushed}{' · '}{ago(pushed)}{/if}
		</span>
	</li>
{/snippet}

<style>
	h1 {
		margin-top: 40px;
	}
	.intro {
		margin: -8px 0 24px;
	}
	.others {
		margin-top: 16px;
	}
	.list {
		list-style: none;
		margin: 0 -18px;
		padding: 0;
	}
	.list > li + li {
		border-top: 1px dashed var(--line);
	}
	.group {
		padding: 10px 18px 4px;
		font-weight: 600;
	}
	.row {
		display: grid;
		grid-template-columns: 24ch 1fr auto;
		gap: 4px 16px;
		align-items: baseline;
		padding: 8px 18px;
	}
	.row.nested .title {
		padding-left: 2ch;
	}
	.title {
		font-weight: 600;
		color: var(--acc);
		text-decoration: none;
	}
	.title:hover {
		text-decoration: underline;
	}
	.meta {
		font-size: 12px;
		white-space: nowrap;
	}
	i {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		margin-right: 6px;
	}
	@media (max-width: 760px) {
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
