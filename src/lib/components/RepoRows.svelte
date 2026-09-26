<script lang="ts">
	import { langColors } from '$lib/format';
	import type { RepoMeta } from '$lib/server/github';
	import { GITHUB_URL } from '$lib/site';

	let { names, repos }: { names: string[]; repos: Record<string, RepoMeta> } = $props();

	const me = GITHUB_URL.split('/').at(-1);
	const topLang = (meta?: RepoMeta) => (meta ? Object.entries(meta.languages).sort((a, b) => b[1] - a[1])[0]?.[0] : undefined);
</script>

<ul class="mono repos">
	{#each names as full (full)}
		{@const [owner, name] = full.split('/')}
		{@const lang = topLang(repos[full])}
		<li>
			<a href="https://github.com/{full}" title={full}>
				{#if owner === me}
					<!-- GitHub Octicons "repo" (MIT) -->
					<svg viewBox="0 0 16 16" aria-hidden="true"
						><path
							d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"
						/></svg
					>
				{:else}
					<!-- GitHub Octicons "people" (MIT): someone else's repository -->
					<svg viewBox="0 0 16 16" aria-hidden="true"
						><path
							d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"
						/></svg
					>
					<span class="sr-only">{owner}/</span>
				{/if}
				<span class="name">{name}</span>
				{#if lang}
					<span class="meta"><i class="dot" style:background={langColors[lang] ?? '#888'}></i>{lang}</span>
				{/if}
			</a>
		</li>
	{/each}
</ul>

<style>
	.repos {
		list-style: none;
		margin: 4px -18px 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	li + li {
		border-top: 1px dashed var(--line);
	}
	a {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 2px 10px;
		padding: 7px 18px;
		text-decoration: none;
	}
	a:hover {
		background: var(--status);
	}
	a:hover .name {
		color: var(--acc);
		text-decoration: underline;
	}
	svg {
		width: 14px;
		height: 14px;
		fill: var(--dim);
		flex-shrink: 0;
	}
	.name {
		font-weight: 600;
		white-space: nowrap;
	}
	.meta {
		margin-left: auto;
		color: var(--dim);
		white-space: nowrap;
		font-size: 12px;
	}
	i {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		margin-right: 6px;
	}
</style>
