<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { SOURCE_URL } from '$lib/site';
	import { cowsay } from './cowsay';

	// The first line is fixed so the server and browser render the same thing; clicking cycles.
	const lines = {
		fi: ['kiitos käynnistä!', 'moo.', ':wq', 'toimii minun koneella.', 'git push --force? ei tänään.', 'sudo apt install kahvi'],
		en: ['thanks for stopping by!', 'moo.', ':wq', 'works on my machine.', 'git push --force? not today.', 'sudo apt install coffee']
	}[getLocale()];
	let i = $state(0);
</script>

<button
	class="cow"
	aria-label={m.cow_label()}
	onclick={(e) => {
		e.stopPropagation();
		i = (i + 1) % lines.length;
	}}><pre aria-hidden="true">{cowsay(lines[i])}</pre></button
>

<footer class="foot mono">
	<span class="seg">© {new Date().getFullYear()} Mico Rintala</span>
	<span class="seg dim">SvelteKit · Railway</span>
	<span class="spacer"></span>
	<a class="seg" href={SOURCE_URL}>{m.footer_source()} →</a>
</footer>

<style>
	.cow {
		all: unset;
		display: block;
		width: fit-content;
		margin: 56px auto 0;
		cursor: pointer;
		color: var(--dim);
	}
	.cow:hover,
	.cow:focus-visible {
		color: var(--acc);
	}
	pre {
		margin: 0 0 0 8px;
		font: 12px/1.25 var(--mono);
		font-variant-ligatures: none;
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		margin-top: 8px;
		background: var(--status);
		border: 1px solid var(--line);
		font-size: 12px;
	}
	.seg {
		padding: 3px 10px;
		border-right: 1px solid var(--line);
		text-decoration: none;
	}
	.seg:last-child {
		border-right: 0;
		border-left: 1px solid var(--line);
	}
	a.seg:hover {
		color: var(--acc);
	}
	.spacer {
		flex: 1;
	}
</style>
