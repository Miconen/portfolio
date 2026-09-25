import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { LANG_COOKIE, localeRedirect } from '$lib/server/locale';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const securityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
	if (!event.url.pathname.startsWith('/admin')) response.headers.set('x-frame-options', 'DENY');
	return response;
};

// Non-Finnish browsers land on English pages on their first visit (see $lib/server/locale).
const handleLocaleDefault: Handle = async ({ event, resolve }) => {
	const target = localeRedirect(event.request, event.cookies.get(LANG_COOKIE));
	if (!target) {
		// Pages served here could have been a redirect for another visitor: tell caches what it depends on.
		const response = await resolve(event);
		if (!event.url.pathname.startsWith('/en')) response.headers.append('vary', 'Accept-Language, Cookie');
		return response;
	}
	return new Response(null, {
		status: 302,
		headers: { location: target, vary: 'Accept-Language, Cookie', 'cache-control': 'private, no-store' }
	});
};

export const handle: Handle = sequence(securityHeaders, handleLocaleDefault, handleParaglide);
