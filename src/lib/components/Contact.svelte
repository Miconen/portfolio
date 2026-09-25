<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages.js';
	import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from '$lib/site';

	type Field = 'name' | 'email' | 'subject' | 'message';
	type Form = {
		sent?: boolean;
		error?: 'send' | 'rate';
		errors?: Partial<Record<Field, 'required' | 'invalid' | 'tooLong'>>;
		values?: Partial<Record<Field, string>>;
	} | null;

	let { form }: { form: Form | undefined } = $props();
	let sending = $state(false);
	let dismissed = $state(false);

	const sent = $derived(!!form?.sent && !dismissed);
	const errorText = { required: m.error_required, invalid: m.error_invalid, tooLong: m.error_too_long };
	const err = (f: Field) => form?.errors?.[f];
</script>

<div class="contact">
	<fieldset class="pane">
		<legend><span class="num">4.1</span> {m.contact_message_pane()}</legend>
		{#if sent}
			<p class="mono ok" role="status"><span class="acc">✓</span> {m.sent()}</p>
			<button class="submit mono" type="button" onclick={() => (dismissed = true)}>{m.send_another()}</button>
		{:else}
			<form
				method="POST"
				action="?/contact"
				use:enhance={() => {
					sending = true;
					dismissed = false;
					return async ({ update }) => {
						await update({ reset: false });
						sending = false;
					};
				}}
			>
				<p class="intro dim">{m.contact_intro()}</p>
				{#if form?.error}
					<p class="mono bad" role="alert">{form.error === 'rate' ? m.error_rate() : m.error_send()}</p>
				{/if}
				<div class="row">
					{@render input('name', m.field_name(), 'text', 'name')}
					{@render input('email', m.field_email(), 'email', 'email')}
				</div>
				{@render input('subject', m.field_subject(), 'text', 'off')}
				<label class="mono">
					<span>{m.field_message()}{#if err('message')}<em> · {errorText[err('message')!]()}</em>{/if}</span>
					<textarea name="message" rows="6" required maxlength="5000" aria-invalid={!!err('message')}>{form?.values?.message ?? ''}</textarea>
				</label>
				<label class="hp" aria-hidden="true">{m.field_honeypot()}<input name="website" tabindex="-1" autocomplete="off" /></label>
				<button class="submit mono" type="submit" disabled={sending}>{sending ? m.sending() : `${m.send()} ↵`}</button>
			</form>
		{/if}
	</fieldset>
	<fieldset class="pane">
		<legend><span class="num">4.2</span> {m.contact_elsewhere()}</legend>
		<!-- Tabler Icons (MIT), outline -->
		<ul class="mono links">
			<li>
				<a href={GITHUB_URL}>
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path
							d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
						/></svg
					>github.com/Miconen →
				</a>
			</li>
			<li>
				<a href={LINKEDIN_URL}>
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path d="M8 11v5" /><path d="M8 8v.01" /><path d="M12 16v-5" /><path d="M16 16v-3a2 2 0 1 0 -4 0" /><path
							d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"
						/></svg
					>linkedin.com/in/mico-rintala →
				</a>
			</li>
			<li>
				<a href="mailto:{CONTACT_EMAIL}">
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" /><path
							d="M3 7l9 6l9 -6"
						/></svg
					>{CONTACT_EMAIL} →
				</a>
			</li>
		</ul>
		<p class="dim note">{m.contact_reply_note()}</p>
	</fieldset>
</div>

{#snippet input(name: Field, label: string, type: string, autocomplete: HTMLInputElement['autocomplete'])}
	<label class="mono">
		<span>{label}{#if err(name)}<em> · {errorText[err(name)!]()}</em>{/if}</span>
		<input {name} {type} {autocomplete} required value={form?.values?.[name] ?? ''} aria-invalid={!!err(name)} />
	</label>
{/snippet}

<style>
	.contact {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: 16px;
		align-items: start;
	}
	form {
		display: grid;
		gap: 12px;
	}
	.intro {
		margin: 0;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	label {
		display: grid;
		gap: 4px;
		color: var(--dim);
	}
	em {
		font-style: normal;
		color: var(--acc);
	}
	input,
	textarea {
		font: 15px/1.5 var(--sans);
		color: var(--fg);
		background: var(--status);
		border: 1px solid var(--line);
		border-radius: 3px;
		padding: 8px 10px;
		min-width: 0;
		resize: vertical;
	}
	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--acc);
	}
	[aria-invalid='true'] {
		border-color: var(--acc);
	}
	.hp {
		position: absolute;
		left: -9999px;
	}
	.submit {
		justify-self: start;
		color: var(--bg);
		background: var(--acc);
		border: 0;
		border-radius: 3px;
		padding: 8px 16px;
		cursor: pointer;
	}
	.submit:disabled {
		opacity: 0.6;
		cursor: progress;
	}
	.ok {
		margin: 4px 0 14px;
	}
	.bad {
		margin: 0;
		color: var(--acc);
	}
	.links {
		list-style: none;
		margin: 0 0 10px;
		padding: 0;
		line-height: 2;
	}
	.links a {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: var(--acc);
		text-decoration: none;
		overflow-wrap: anywhere;
	}
	.links a:hover {
		text-decoration: underline;
	}
	.links svg {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.note {
		font-size: 13px;
		margin: 0;
	}
	@media (max-width: 860px) {
		.contact,
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
