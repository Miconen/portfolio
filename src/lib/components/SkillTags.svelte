<script lang="ts">
	import { ago } from '$lib/format';
	import type { SkillEvidence } from '$lib/content/model';
	import type { SkillCategory } from '$lib/content/types';
	import { useHighlight } from '$lib/highlight.svelte';
	import { iconFor } from '$lib/icons';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let {
		categories,
		evidence,
		numbers,
		onpick
	}: {
		categories: SkillCategory[];
		evidence: Map<string, SkillEvidence>;
		/** Project slug → on-page number, for Featured Projects. */
		numbers: Record<string, string>;
		/** Called when a skill is clicked (scrolls to its Projects). */
		onpick: (skill: string) => void;
	} = $props();

	const hl = useHighlight();

	// Every declared skill appears exactly once: in its category, or under "Other".
	const groups = $derived.by(() => {
		const listed = new Set(categories.flatMap((c) => c.skills));
		const rows = categories.map((c) => ({
			...c,
			items: c.skills.map((s) => evidence.get(s)).filter((s): s is SkillEvidence => !!s)
		}));
		const rest = [...evidence.values()].filter((s) => !listed.has(s.name));
		if (rest.length) rows.push({ id: 'other', label: m.skills_other(), skills: [], showLastUsed: true, items: rest });
		return rows
			.map((r) => ({ ...r, items: r.items.sort((a, b) => b.projects.length - a.projects.length) }))
			.filter((r) => r.items.length > 0);
	});
	const noDate = $derived(new Set(groups.filter((g) => !g.showLastUsed).flatMap((g) => g.items.map((i) => i.name))));
	const active = $derived(hl?.active ? evidence.get(hl.active) : undefined);
</script>

<fieldset class="pane">
	<legend><span class="num">2.1</span> {m.skills_title()} <span class="dim">· {m.skills_hint()}</span></legend>
	<div class="rows">
		{#each groups as g (g.id)}
			<div class="row">
				<span class="label mono dim">{g.label}</span>
				<div class="tokens mono">
					{#each g.items as s (s.name)}
						{@const icon = iconFor(s.name)}
						<button
							type="button"
							class="tok"
							class:on={hl?.active === s.name}
							onmouseenter={() => hl && (hl.hover = s.name)}
							onmouseleave={() => hl && (hl.hover = null)}
							onfocus={() => hl && (hl.hover = s.name)}
							onblur={() => hl && (hl.hover = null)}
							onclick={(e) => {
								e.stopPropagation();
								onpick(s.name);
							}}
						>
							{#if 'path' in icon}
								<svg viewBox="0 0 24 24" aria-hidden="true" style:--brand={icon.hex ? `#${icon.hex}` : undefined}
									><path d={icon.path} fill-rule={icon.evenodd ? 'evenodd' : undefined} /></svg
								>
							{:else}
								<span class="mono-ic" aria-hidden="true">{icon.mono}</span>
							{/if}
							{s.name}<span class="cnt dim">{s.projects.length}</span>
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<p class="evidence mono" aria-live="polite">
		{#if active}
			<span class="acc">{active.name}</span> →
			{#each active.projects as p, i (p.slug)}<a href={localizeHref(`/projects/${p.slug}`)}
					>{#if numbers[p.slug]}<span class="dim">{numbers[p.slug]}</span>{' '}{/if}{p.title}</a
				>{i < active.projects.length - 1 ? ', ' : ''}{/each}
			{#if active.lastUsed && !noDate.has(active.name)}<span class="dim"> · {m.skills_last_used({ ago: ago(active.lastUsed) })}</span>{/if}
		{:else}
			<span class="dim">{m.skills_default()}</span>
		{/if}
	</p>
</fieldset>

<style>
	.rows {
		display: grid;
		gap: 14px;
	}
	.row {
		display: grid;
		grid-template-columns: 22ch 1fr;
		gap: 12px;
		align-items: center;
	}
	.row + .row {
		border-top: 1px dashed var(--line);
		padding-top: 14px;
	}
	.label {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 11px;
	}
	.tokens {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tok {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font: inherit;
		color: inherit;
		background: var(--status);
		border: 1px solid var(--line);
		border-radius: 3px;
		padding: 4px 10px;
		cursor: pointer;
	}
	.tok.on {
		border-color: var(--acc);
		color: var(--acc);
	}
	svg {
		width: 14px;
		height: 14px;
		fill: currentColor;
		opacity: 0.75;
	}
	.tok.on svg {
		fill: var(--brand, currentColor);
		opacity: 1;
	}
	.mono-ic {
		font-size: 9px;
		font-weight: 800;
		line-height: 14px;
		min-width: 14px;
		padding: 0 2px;
		text-align: center;
		border: 1px solid currentColor;
		border-radius: 2px;
		opacity: 0.75;
	}
	.cnt {
		margin-left: 2px;
	}
	.evidence {
		margin: 14px 0 2px;
		min-height: 1.6em;
	}
	.evidence a {
		text-decoration: none;
	}
	.evidence a:hover {
		color: var(--acc);
	}
	@media (max-width: 700px) {
		.row {
			grid-template-columns: 1fr;
			gap: 6px;
		}
	}
</style>
