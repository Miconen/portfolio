import { getProjects } from '$lib/content';
import { locales, localizeHref } from '$lib/paraglide/runtime';
import { SITE_URL } from '$lib/site';

export const GET = () => {
	const paths = ['/', '/projects', ...getProjects('fi').map((p) => `/projects/${p.slug}`)];
	const urls = paths.flatMap((path) =>
		locales.map(
			(locale) =>
				`<url><loc>${SITE_URL}${localizeHref(path, { locale })}</loc>${locales
					.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${localizeHref(path, { locale: l })}"/>`)
					.join('')}</url>`
		)
	);
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`,
		{ headers: { 'content-type': 'application/xml', 'cache-control': 'public, max-age=3600' } }
	);
};
