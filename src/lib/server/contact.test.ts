import { beforeEach, describe, expect, it, vi } from 'vitest';

const env: Record<string, string | undefined> = {};
vi.mock('$env/dynamic/private', () => ({ env }));

const { createRateLimiter, readContact, sendContact, validateContact } = await import('./contact');

const valid = { name: 'Ada', email: 'ada@example.com', subject: 'Hei', message: 'Moi!', website: '' };

describe('validateContact', () => {
	it('accepts a complete message', () => {
		expect(validateContact(valid)).toEqual({});
	});

	it('flags missing, invalid and overlong fields', () => {
		expect(validateContact({ ...valid, name: '', email: 'nope', message: 'x'.repeat(5001) })).toEqual({
			name: 'required',
			email: 'invalid',
			message: 'tooLong'
		});
	});

	it('trims form values', () => {
		const form = new FormData();
		form.set('name', '  Ada ');
		expect(readContact(form).name).toBe('Ada');
	});
});

describe('createRateLimiter', () => {
	it('allows max sends per window, then resets', () => {
		let t = 0;
		const limit = createRateLimiter(2, 1000, () => t);
		expect([limit('a'), limit('a'), limit('a'), limit('b')]).toEqual([true, true, false, true]);
		t = 1001;
		expect(limit('a')).toBe(true);
	});
});

describe('sendContact', () => {
	beforeEach(() => {
		for (const k of Object.keys(env)) delete env[k];
	});

	it('refuses to send without an API key', async () => {
		await expect(sendContact(valid, 'fi', vi.fn())).rejects.toThrow('RESEND_API_KEY');
	});

	it('sends to the contact address with the visitor as reply-to', async () => {
		env.RESEND_API_KEY = 're_test';
		const fetch = vi.fn().mockResolvedValue(new Response('{"id":"1"}'));
		await sendContact(valid, 'en', fetch);
		const [url, init] = fetch.mock.calls[0];
		expect(url).toBe('https://api.resend.com/emails');
		expect(init.headers.authorization).toBe('Bearer re_test');
		expect(JSON.parse(init.body)).toMatchObject({
			from: 'Portfolio <form@micorintala.com>',
			to: ['contact@micorintala.com'],
			reply_to: 'ada@example.com',
			subject: 'Portfolio: Hei'
		});
	});

	it('surfaces Resend errors', async () => {
		env.RESEND_API_KEY = 're_test';
		const fetch = vi.fn().mockResolvedValue(new Response('bad', { status: 422 }));
		await expect(sendContact(valid, 'fi', fetch)).rejects.toThrow('Resend 422');
	});
});
