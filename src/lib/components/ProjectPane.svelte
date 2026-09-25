<script lang="ts">
	import { ago, languageShares } from '$lib/format';
	import { lastPush } from '$lib/content/model';
	import type { Project } from '$lib/content/types';
	import { useHighlight } from '$lib/highlight.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { RepoMeta } from '$lib/server/github';
	import RepoRows from './RepoRows.svelte';

	let { project, number, lead = false, repos }: { project: Project; number: string; lead?: boolean; repos: Record<string, RepoMeta> } =
		$props();

	const hl = useHighlight();
	const state = $derived(hl?.state(project.skills) ?? null);
	const langs = $derived(languageShares(project.repos.map((r) => repos[r]?.languages ?? {})));
	const pushed = $derived(lastPush(project, Object.fromEntries(Object.entries(repos).map(([k, v]) => [k, v.pushedAt]))));
</script>

<fieldset class="pane proj" class:lead class:lit={state === 'lit'} class:faded={state === 'faded'} id="p-{project.slug}">
	<legend><span class="num">{number}</span> <a href={localizeHref(`/projects/${project.slug}`)}>{project.title}</a></legend>
	<p class="mono role"><span class="dim">{m.role()}</span> {project.role}</p>
	<p class="summary">{project.summary}</p>
	<RepoRows names={project.repos} {repos} />
	{#if langs.length || pushed}
		<div class="status mono">
			{#if langs[0]}
				<span class="seg lang" style:--c={langs[0].color}>{langs[0].name} {Math.round(langs[0].share * 100)}%</span>
			{/if}
			{#if langs[1]}<span class="seg dim">{langs[1].name} {Math.round(langs[1].share * 100)}%</span>{/if}
			<span class="spacer"></span>
			{#if pushed}<span class="seg acc">{ago(pushed)}</span>{/if}
		</div>
	{/if}
</fieldset>

<style>
	.proj {
		display: flex;
		flex-direction: column;
		padding-bottom: 0;
		transition:
			opacity 0.4s,
			border-color 0.4s;
	}
	.lead {
		grid-column: 1 / -1;
	}
	.lit {
		border-color: var(--acc);
		animation: pulse 1.2s ease-out 1;
	}
	.faded {
		opacity: 0.35;
	}
	@keyframes pulse {
		from {
			box-shadow: 0 0 0 0 color-mix(in srgb, var(--acc) 60%, transparent);
		}
		to {
			box-shadow: 0 0 0 12px transparent;
		}
	}
	p {
		margin: 0 0 10px;
	}
	.role {
		margin: 2px 0 8px;
	}
	.summary {
		margin-bottom: 12px;
	}
	.proj :global(.repos) {
		margin-top: auto;
	}
	.status {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -18px;
		background: var(--status);
		border-top: 1px solid var(--line);
		font-size: 12px;
	}
	.seg {
		padding: 3px 10px;
		border-right: 1px solid var(--line);
	}
	.seg.lang {
		background: var(--c);
		color: #fff;
		border: 0;
	}
	.seg:last-child {
		border-right: 0;
		border-left: 1px solid var(--line);
	}
	.spacer {
		flex: 1;
	}
</style>
