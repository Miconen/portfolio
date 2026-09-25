<script lang="ts">
	import type { AboutPage, HomePage } from '$lib/content/types';
	import { m } from '$lib/paraglide/messages.js';

	let { about, home }: { about: AboutPage; home: HomePage } = $props();
</script>

<div class="about">
	<fieldset class="pane">
		<legend><span class="num">3.1</span> {m.about_short()}</legend>
		<blockquote class="prose">{@html about.html}</blockquote>
		<p class="attr mono dim">— Mico Rintala</p>
	</fieldset>
	<fieldset class="pane">
		<legend><span class="num">3.2</span> {m.about_facts()}</legend>
		<dl class="facts mono">
			<dt>{m.fact_location()}</dt>
			<dd>{home.location}</dd>
			<dt>{m.fact_languages()}</dt>
			<dd>{home.languages}</dd>
			<dt>{m.fact_free_time()}</dt>
			<dd>{home.freeTime}</dd>
			<dt>{m.fact_environment()}</dt>
			<dd>{home.environment}</dd>
			<dt>{m.fact_dotfiles()}</dt>
			<dd><a href="https://github.com/Miconen/.mico">github.com/Miconen/.mico</a></dd>
		</dl>
	</fieldset>
</div>

<style>
	.about {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: 16px;
		align-items: start;
	}
	blockquote {
		margin: 6px 0 0;
		padding-left: 18px;
		border-left: 2px solid var(--acc);
		font-size: 17px;
		line-height: 1.65;
	}
	.attr {
		margin: 12px 0 4px 20px;
	}
	@media (max-width: 860px) {
		.about {
			grid-template-columns: 1fr;
		}
	}
</style>
