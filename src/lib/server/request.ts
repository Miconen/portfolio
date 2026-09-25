import type { RequestEvent } from '@sveltejs/kit';

/** Best-effort client IP behind Railway's proxy (used only for rate limiting). */
export function clientAddress(event: RequestEvent): string {
	const h = event.request.headers;
	const forwarded = h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',').at(-1)?.trim();
	if (forwarded) return forwarded;
	try {
		return event.getClientAddress();
	} catch {
		return 'unknown';
	}
}
