<script lang="ts">
	import '@fontsource/ibm-plex-sans/400.css';
	import '@fontsource/ibm-plex-sans/600.css';
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/600.css';
	import '@fontsource/jetbrains-mono/800.css';
	import '../app.css';
	import { page } from '$app/state';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import VimKeys from '$lib/components/VimKeys.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { deLocalizeHref, getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
	import { SITE_URL } from '$lib/site';

	let { children } = $props();
	let help = $state(false);

	const path = $derived(deLocalizeHref(page.url.pathname));
	const abs = (locale: (typeof locales)[number]) => SITE_URL + localizeHref(path, { locale });
</script>

<svelte:head>
	<meta name="description" content={m.meta_description()} />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="theme-color" content="#0f1011" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#f4f2ec" media="(prefers-color-scheme: light)" />
	<link rel="canonical" href={abs(getLocale())} />
	{#each locales as l (l)}
		<link rel="alternate" hreflang={l} href={abs(l)} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={abs('fi')} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Mico Rintala" />
	<meta property="og:url" content={abs(getLocale())} />
	<meta property="og:locale" content={getLocale() === 'fi' ? 'fi_FI' : 'en_GB'} />
</svelte:head>

<div class="wrap">
	<Header onHelp={() => (help = true)} />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
<VimKeys bind:help />
