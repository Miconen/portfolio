// Guards on the real content in /content, so a bad edit (e.g. from the CMS) fails CI instead of the site.
import { describe, expect, it } from 'vitest';
import { getAbout, getGroups, getHome, getProjects, getSkillCategories } from './index';

const locales = ['fi', 'en'] as const;

describe('content', () => {
	it.each(locales)('loads every page in %s', (locale) => {
		expect(getProjects(locale).length).toBeGreaterThan(0);
		expect(getHome(locale).tagline).toBeTruthy();
		expect(getAbout(locale).html).toContain('<p>');
		expect(getSkillCategories(locale).every((c) => c.label)).toBe(true);
	});

	it('has an English translation for every Project and Group', () => {
		const fi = getProjects('fi');
		const en = getProjects('en');
		for (const p of fi) {
			const t = en.find((x) => x.slug === p.slug)!;
			expect.soft(t.summary, p.slug).not.toBe(p.summary);
		}
		for (const g of getGroups('en')) expect.soft(g.html, g.slug).not.toBe(getGroups('fi').find((x) => x.slug === g.slug)!.html);
	});

	it('names Repositories as owner/name', () => {
		for (const p of getProjects('fi')) {
			expect.soft(p.repos.length, `${p.slug} has no Repositories`).toBeGreaterThanOrEqual(0);
			for (const r of p.repos) expect.soft(r, p.slug).toMatch(/^[\w.-]+\/[\w.-]+$/);
		}
	});

	it('only references Groups that exist', () => {
		const groups = new Set(getGroups('fi').map((g) => g.slug));
		for (const p of getProjects('fi')) if (p.group) expect.soft(groups.has(p.group), `${p.slug} → ${p.group}`).toBe(true);
	});

	it('gives every declared Skill a category', () => {
		const listed = new Set(getSkillCategories('fi').flatMap((c) => c.skills));
		const missing = [...new Set(getProjects('fi').flatMap((p) => p.skills))].filter((s) => !listed.has(s));
		expect(missing).toEqual([]);
	});

	it('uses unique orders among Featured entries', () => {
		const projects = getProjects('fi');
		const top = [...projects.filter((p) => p.featured && !p.group).map((p) => p.order), ...getGroups('fi').map((g) => g.order)];
		expect(new Set(top).size).toBe(top.length);
	});
});
