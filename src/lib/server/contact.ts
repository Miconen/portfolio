// Contact form: validation, a honeypot, a per-IP rate limit and delivery through Resend.
import { env } from '$env/dynamic/private';

export type ContactInput = { name: string; email: string; subject: string; message: string; website: string };
export type ContactErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', 'required' | 'invalid' | 'tooLong'>>;

const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readContact(form: FormData): ContactInput {
	const get = (k: string) => String(form.get(k) ?? '').trim();
	return { name: get('name'), email: get('email'), subject: get('subject'), message: get('message'), website: get('website') };
}

export function validateContact(input: ContactInput): ContactErrors {
	const errors: ContactErrors = {};
	for (const field of ['name', 'email', 'subject', 'message'] as const) {
		if (!input[field]) errors[field] = 'required';
		else if (input[field].length > LIMITS[field]) errors[field] = 'tooLong';
	}
	if (!errors.email && !EMAIL.test(input.email)) errors.email = 'invalid';
	return errors;
}

/** Fixed-window limiter: at most `max` sends per key per window. */
export function createRateLimiter(max = 5, windowMs = 60 * 60 * 1000, now: () => number = Date.now) {
	const hits = new Map<string, { count: number; resetAt: number }>();
	return (key: string): boolean => {
		const t = now();
		for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
		const h = hits.get(key) ?? { count: 0, resetAt: t + windowMs };
		h.count++;
		hits.set(key, h);
		return h.count <= max;
	};
}

export async function sendContact(input: ContactInput, locale: string, fetchImpl: typeof fetch = fetch): Promise<void> {
	const key = env.RESEND_API_KEY;
	if (!key) throw new Error('RESEND_API_KEY is not set');
	const res = await fetchImpl('https://api.resend.com/emails', {
		method: 'POST',
		headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
		signal: AbortSignal.timeout(10_000),
		body: JSON.stringify({
			from: env.CONTACT_FROM || 'Portfolio <form@micorintala.com>',
			to: [env.CONTACT_TO || 'contact@micorintala.com'],
			reply_to: input.email,
			subject: `Portfolio: ${input.subject}`,
			text: `${input.message}\n\n---\n${input.name} <${input.email}>\nlocale: ${locale}`
		})
	});
	if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
