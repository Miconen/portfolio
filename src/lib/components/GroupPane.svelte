<script lang="ts">
	import type { Group, Project } from '$lib/content/types';
	import { m } from '$lib/paraglide/messages.js';
	import type { RepoMeta } from '$lib/server/github';
	import ProjectPane from './ProjectPane.svelte';

	let {
		group,
		number,
		projects,
		repos
	}: { group: Group; number: string; projects: { number: string; project: Project }[]; repos: Record<string, RepoMeta> } = $props();

	const repoCount = $derived(projects.reduce((n, p) => n + p.project.repos.length, 0));
</script>

<fieldset class="pane group">
	<legend
		><span class="num">{number}</span> {group.title}
		<span class="dim">· {m.group_counts({ projects: projects.length, repos: repoCount })}</span></legend
	>
	<div class="intro prose dim">{@html group.html}</div>
	<div class="sub">
		{#each projects as p (p.project.slug)}
			<ProjectPane project={p.project} number={p.number} {repos} />
		{/each}
	</div>
</fieldset>

<style>
	.group {
		grid-column: 1 / -1;
		border-color: var(--acc);
	}
	.intro {
		margin-bottom: 14px;
	}
	.sub {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 14px;
	}
</style>
