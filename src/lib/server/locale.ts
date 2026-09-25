// First-visit language defaulting: Finnish pages redirect to their English version unless the
// browser prefers Finnish or the visitor has chosen a language (the `lang` cookie).

export const LANG_COOKIE = 'lang';

/** 'fi' when Finnish ranks at least as high as English in Accept-Language, else 'en'. */
export function preferredLocale(acceptLanguage: string): 'fi' | 'en' {
	let fi = 0;
	let en = 0;
	for (const part of acceptLanguage.split(',')) {
		const [tag, ...params] = part.trim().toLowerCase().split(';');
		const q = Number(params.find((p) => p.trim().startsWith('q='))?.split('=')[1] ?? 1);
		const base = tag.split('-')[0];
		if (base === 'fi') fi = Math.max(fi, q);
		else if (base === 'en') en = Math.max(en, q);
	}
	return fi > 0 && fi >= en ? 'fi' : 'en';
}

const NEVER_REDIRECT = /^\/(en(\/|$)|admin(\/|$)|healthz$|sitemap\.xml$|robots\.txt$)|\.[a-z0-9]+$|__data\.json$/i;

/** The English URL to send this request to, or null to serve it as is. */
export function localeRedirect(request: Request, cookie: string | undefined): string | null {
	if (request.method !== 'GET') return null;
	const url = new URL(request.url);
	if (NEVER_REDIRECT.test(url.pathname)) return null;
	if (!(request.headers.get('accept') ?? '').includes('text/html')) return null;

	let wanted: 'fi' | 'en';
	if (cookie === 'fi' || cookie === 'en') wanted = cookie;
	else {
		const accept = request.headers.get('accept-language');
		if (!accept) return null; // crawlers usually send none: keep the Finnish page indexable
		wanted = preferredLocale(accept);
	}
	if (wanted === 'fi') return null;
	return `/en${url.pathname === '/' ? '' : url.pathname}${url.search}`;
}
