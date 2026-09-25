<script lang="ts">
	// Easter egg: vim-ish keyboard navigation. Ignored while typing or with modifier keys.
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { SECTIONS } from '$lib/site';

	let { help = $bindable(false), onescape }: { help?: boolean; onescape?: () => void } = $props();

	let showcmd = $state('');
	let pending = '';
	let timer: ReturnType<typeof setTimeout> | undefined;

	const behavior = (): ScrollBehavior => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

	function goSection(i: number) {
		const el = document.getElementById(SECTIONS[i]);
		if (el) el.scrollIntoView({ behavior: behavior(), block: 'start' });
		else goto(`${localizeHref('/')}#${SECTIONS[i]}`); // not on the home page
	}

	function currentSection() {
		let idx = -1;
		SECTIONS.forEach((id, i) => {
			const el = document.getElementById(id);
			if (el && el.getBoundingClientRect().top < innerHeight / 3) idx = i;
		});
		return idx;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			help = false;
			onescape?.();
			return;
		}
		// AltGr (needed for { } on Nordic layouts) reports as Ctrl+Alt; let it through.
		if (e.metaKey || ((e.ctrlKey || e.altKey) && !e.getModifierState('AltGraph'))) return;
		if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;

		const k = e.key;
		const cmd = pending + k;
		pending = '';
		const by = (top: number) => scrollBy({ top, behavior: behavior() });
		if (k >= '1' && k <= String(SECTIONS.length)) goSection(Number(k) - 1);
		else if (k === 'j') by(80);
		else if (k === 'k') by(-80);
		else if (k === 'd') by(innerHeight / 2);
		else if (k === 'u') by(-innerHeight / 2);
		else if (k === 'G') scrollTo({ top: document.documentElement.scrollHeight, behavior: behavior() });
		else if (cmd === 'gg') scrollTo({ top: 0, behavior: behavior() });
		else if (k === 'g') pending = 'g';
		else if (k === '}') goSection(Math.min(currentSection() + 1, SECTIONS.length - 1));
		else if (k === '{') {
			const i = currentSection();
			if (i <= 0) scrollTo({ top: 0, behavior: behavior() });
			else goSection(i - 1);
		} else if (k === '?') help = !help;
		else return;

		e.preventDefault();
		showcmd = cmd;
		clearTimeout(timer);
		timer = setTimeout(() => (showcmd = ''), 1500);
	}
</script>

<svelte:window {onkeydown} />

{#if help}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={() => (help = false)}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div role="dialog" aria-modal="true" aria-label={m.help_dialog()} tabindex="-1" onclick={(e) => e.stopPropagation()}>
			<fieldset class="pane help mono">
				<legend><span class="acc">:help</span> {m.help_title()}</legend>
				<dl>
					<dt><kbd>1</kbd>–<kbd>{SECTIONS.length}</kbd></dt>
					<dd>{m.help_sections()}</dd>
					<dt><kbd>j</kbd> <kbd>k</kbd></dt>
					<dd>{m.help_scroll()}</dd>
					<dt><kbd>d</kbd> <kbd>u</kbd></dt>
					<dd>{m.help_half()}</dd>
					<dt><kbd>{'{'}</kbd> <kbd>{'}'}</kbd></dt>
					<dd>{m.help_section()}</dd>
					<dt><kbd>gg</kbd> <kbd>G</kbd></dt>
					<dd>{m.help_ends()}</dd>
					<dt><kbd>?</kbd></dt>
					<dd>{m.help_help()}</dd>
					<dt><kbd>Esc</kbd></dt>
					<dd>{m.help_close()}</dd>
				</dl>
				<p class="dim">{m.help_quit()}</p>
			</fieldset>
		</div>
	</div>
{/if}

{#if showcmd}
	<div class="modeline mono" aria-hidden="true"><span class="acc">-- NORMAL --</span><span>{showcmd}</span></div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 60;
		display: grid;
		place-items: center;
		padding: 16px;
		background: color-mix(in srgb, var(--bg) 70%, transparent);
	}
	.help {
		background: var(--bg);
		border-color: var(--acc);
		width: min(420px, calc(100vw - 32px));
	}
	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 8px 20px;
		margin: 8px 0 12px;
	}
	dd {
		margin: 0;
	}
	p {
		margin: 0;
		font-size: 12px;
	}
	.modeline {
		position: fixed;
		left: 16px;
		bottom: 16px;
		z-index: 55;
		display: flex;
		gap: 12px;
		font-size: 12px;
		padding: 4px 10px;
		background: var(--status);
		border: 1px solid var(--line);
	}
</style>
