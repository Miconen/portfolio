<script lang="ts">
	import About from '$lib/components/About.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import GroupPane from '$lib/components/GroupPane.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import OtherProjects from '$lib/components/OtherProjects.svelte';
	import ProjectPane from '$lib/components/ProjectPane.svelte';
	import SkillTags from '$lib/components/SkillTags.svelte';
	import { featuredEntries, numberedProjects, otherProjects, skillEvidence } from '$lib/content/model';
	import { provideHighlight } from '$lib/highlight.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { GITHUB_URL, SECTIONS } from '$lib/site';

	let { data, form } = $props();

	const hl = provideHighlight();

	const entries = $derived(featuredEntries(data.projects, data.groups));
	const numbered = $derived(numberedProjects(entries));
	const numbers = $derived(Object.fromEntries(numbered.map((n) => [n.project.slug, n.number])));
	const others = $derived(otherProjects(data.projects));
	const pushedAt = $derived(Object.fromEntries(Object.entries(data.repos).map(([k, v]) => [k, v.pushedAt])));
	const evidence = $derived(skillEvidence(data.projects, pushedAt));

	// Repositories on the site that are Mico's own, vs. everything public on GitHub.
	const me = GITHUB_URL.split('/').at(-1);
	const shown = $derived(new Set(data.projects.flatMap((p) => p.repos).filter((r) => r.startsWith(`${me}/`))).size);
	const moreOnGitHub = $derived(data.profile ? Math.max(0, data.profile.publicRepos - shown) : undefined);

	const labels = [m.nav_projects, m.nav_skills, m.nav_about, m.nav_contact];

	/** Clicking a skill: light up its Projects for a while and scroll to the first one on the page. */
	function pick(skill: string) {
		hl.pin(skill);
		const first = numbered.find((n) => n.project.skills.includes(skill))?.project ?? others.find((p) => p.skills.includes(skill));
		if (!first) return;
		const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
		document.getElementById(`p-${first.slug}`)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
	}
</script>

<svelte:head>
	<title>Mico Rintala</title>
	<meta property="og:title" content="Mico Rintala" />
	<meta property="og:description" content={m.meta_description()} />
</svelte:head>

<!-- Clicking anywhere or pressing Escape clears a pinned skill. -->
<svelte:window onclick={() => hl.clear()} onkeydown={(e) => e.key === 'Escape' && hl.clear()} />

<Hero home={data.home} profile={data.profile} {shown} />

{@render heading(0)}
<section class="grid">
	{#each entries as entry, i (entry.number)}
		{#if entry.kind === 'group'}
			<GroupPane group={entry.group} number={entry.number} projects={entry.projects} repos={data.repos} />
		{:else}
			<ProjectPane project={entry.project} number={entry.number} lead={i === 0} repos={data.repos} />
		{/if}
	{/each}
	{#if others.length}
		<OtherProjects projects={others} number="1.{entries.length + 1}" repos={data.repos} {moreOnGitHub} />
	{/if}
</section>

{@render heading(1)}
<SkillTags categories={data.categories} {evidence} {numbers} onpick={pick} />

{@render heading(2)}
<About about={data.about} home={data.home} />

{@render heading(3)}
<Contact {form} />

{#snippet heading(i: number)}
	<h2 class="sec" id={SECTIONS[i]}><span class="n">0{i + 1}</span>{labels[i]()}</h2>
{/snippet}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}
	@media (max-width: 860px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
