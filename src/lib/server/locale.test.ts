import { describe, expect, it } from 'vitest';
import { localeRedirect, preferredLocale } from './locale';

const page = (path: string, headers: Record<string, string> = {}, method = 'GET') =>
	new Request(`https://micorintala.com${path}`, { method, headers: { accept: 'text/html,*/*', ...headers } });

describe('preferredLocale', () => {
	it.each([
		['fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7', 'fi'],
		['en-US,en;q=0.9,fi;q=0.8', 'en'],
		['sv-FI,sv;q=0.9,fi;q=0.8', 'fi'],
		['de-DE,de;q=0.9', 'en'],
		['fi;q=0.5,en;q=0.5', 'fi'],
		['*', 'en']
	])('%s → %s', (header, locale) => {
		expect(preferredLocale(header)).toBe(locale);
	});
});

describe('localeRedirect', () => {
	it('sends non-Finnish browsers to the same page in English, keeping the query', () => {
		expect(localeRedirect(page('/', { 'accept-language': 'de' }), undefined)).toBe('/en');
		expect(localeRedirect(page('/projects/mnk?x=1', { 'accept-language': 'en' }), undefined)).toBe('/en/projects/mnk?x=1');
	});

	it('leaves Finnish browsers on the Finnish page', () => {
		expect(localeRedirect(page('/', { 'accept-language': 'fi-FI' }), undefined)).toBeNull();
	});

	it('respects an explicit choice over the browser language', () => {
		expect(localeRedirect(page('/', { 'accept-language': 'en' }), 'fi')).toBeNull();
		expect(localeRedirect(page('/', { 'accept-language': 'fi' }), 'en')).toBe('/en');
	});

	it('never redirects crawlers without Accept-Language, English URLs, assets, data or posts', () => {
		expect(localeRedirect(page('/'), undefined)).toBeNull();
		expect(localeRedirect(page('/en/projects', { 'accept-language': 'de' }), undefined)).toBeNull();
		expect(localeRedirect(page('/favicon.svg', { 'accept-language': 'de' }), undefined)).toBeNull();
		expect(localeRedirect(page('/admin/', { 'accept-language': 'de' }), undefined)).toBeNull();
		expect(localeRedirect(page('/projects/__data.json', { 'accept-language': 'de' }), undefined)).toBeNull();
		expect(localeRedirect(page('/', { 'accept-language': 'de' }, 'POST'), undefined)).toBeNull();
		expect(localeRedirect(page('/', { 'accept-language': 'de', accept: 'application/json' }), undefined)).toBeNull();
	});
});
