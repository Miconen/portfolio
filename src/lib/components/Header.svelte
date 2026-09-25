<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { deLocalizeHref, getLocale, localizeHref } from '$lib/paraglide/runtime';
	import { SECTIONS } from '$lib/site';

	let { onHelp }: { onHelp: () => void } = $props();

	const labels = [m.nav_projects, m.nav_skills, m.nav_about, m.nav_contact];
	const home = $derived(localizeHref('/'));
	const other = $derived(getLocale() === 'fi' ? 'en' : 'fi');
	const switchHref = $derived(localizeHref(deLocalizeHref(page.url.pathname), { locale: other }));
</script>

<header class="top mono">
	<a class="logo" href={home}><b>mico</b>@rintala</a>
	<nav aria-label="Sections">
		{#each SECTIONS as id, i}
			<a href="{home}#{id}"><span class="acc">0{i + 1}</span> {labels[i]()}</a>
		{/each}
		<button
			class="kbd-hint dim"
			onclick={(e) => {
				e.stopPropagation();
				onHelp();
			}}><kbd>?</kbd> {m.kbd_hint()}</button
		>
		<!-- Remember the choice so first-visit language defaulting never overrides it. -->
		<a
			class="lang dim"
			href={switchHref}
			hreflang={other}
			lang={other}
			data-sveltekit-reload
			onclick={() => (document.cookie = `lang=${other}; path=/; max-age=31536000; samesite=lax`)}>{m.switch_language()}</a
		>
	</nav>
</header>

<style>
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		padding: 18px 0;
	}
	.logo {
		text-decoration: none;
	}
	.logo b {
		color: var(--acc);
	}
	nav {
		display: flex;
		align-items: center;
		gap: 8px 16px;
		flex-wrap: wrap;
	}
	nav a {
		text-decoration: none;
	}
	nav a:hover,
	.kbd-hint:hover {
		color: var(--acc);
	}
	.kbd-hint {
		display: none;
		font: inherit;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
	}
	/* desktop only: a wide screen with a precise pointer */
	@media (min-width: 861px) and (hover: hover) and (pointer: fine) {
		.kbd-hint {
			display: inline;
		}
	}
</style>
