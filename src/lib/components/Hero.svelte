<script lang="ts">
	import { ago } from '$lib/format';
	import { m } from '$lib/paraglide/messages.js';
	import type { Profile } from '$lib/server/github';
	import type { HomePage } from '$lib/content/types';
	import { GITHUB_URL } from '$lib/site';

	let { home, profile, shown }: { home: HomePage; profile?: Profile; shown: number } = $props();
</script>

<section class="hero">
	<h1>Mico Rintala</h1>
	<p class="lede">{home.tagline}</p>
	<dl class="facts mono">
		<dt>{m.hero_primary()}</dt>
		<dd>{home.primaryLanguages.join(' · ')}</dd>
		{#if profile?.latestPush}
			<dt>{m.hero_latest_push()}</dt>
			<dd><span class="acc">{ago(profile.latestPush.at)}</span> → {profile.latestPush.repo}</dd>
		{/if}
		<dt>github</dt>
		<dd>
			{#if profile}
				<a href={GITHUB_URL}>{m.hero_github_value({ count: profile.publicRepos, shown })}</a>
			{:else}
				<a href={GITHUB_URL}>github.com/Miconen</a>
			{/if}
		</dd>
		<dt>{m.hero_environment()}</dt>
		<dd>{home.environment}</dd>
	</dl>
</section>

<style>
	.hero {
		padding: 64px 0 24px;
	}
	h1 {
		font: 800 clamp(36px, 6vw, 64px) / 1.05 var(--mono);
		letter-spacing: -0.03em;
		margin: 0 0 16px;
	}
	.lede {
		font-size: 19px;
		max-width: 58ch;
		margin: 0 0 32px;
	}
</style>
