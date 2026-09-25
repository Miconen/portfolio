<script lang="ts">
	import { page } from '$app/state';
	import { cowsay } from '$lib/components/cowsay';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head><title>{page.status} · Mico Rintala</title></svelte:head>

<section class="err">
	<pre class="mono" aria-hidden="true">{cowsay(`${page.status}: ${notFound ? m.not_found() : m.error_generic()}`)}</pre>
	<p class="mono">{notFound ? m.not_found() : m.error_generic()} <a href={localizeHref('/')}>{m.go_home()} →</a></p>
</section>

<style>
	.err {
		padding: 72px 0 24px;
	}
	pre {
		font-size: 13px;
		line-height: 1.25;
		color: var(--dim);
		margin: 0 0 24px;
		overflow-x: auto;
	}
	a {
		color: var(--acc);
	}
</style>
