import { describe, expect, it } from 'vitest';
import { featuredEntries, numberedProjects, otherProjects, skillEvidence } from './model';
import type { Group, Project } from './types';

const project = (slug: string, o: Partial<Project> = {}): Project => ({
	slug,
	title: slug,
	summary: '',
	role: '',
	html: '',
	repos: [],
	skills: [],
	featured: true,
	order: 1,
	...o
});
const group = (slug: string, order: number): Group => ({ slug, title: slug, html: '', order });

describe('featuredEntries', () => {
	const projects = [
		project('fencing', { order: 1 }),
		project('bot', { group: 'tectonic', order: 2 }),
		project('platform', { group: 'tectonic', order: 1 }),
		project('pakukuljetus', { order: 3 }),
		project('mnk', { featured: false, order: 6 })
	];

	it('orders Groups and ungrouped Projects together and numbers them within section 01', () => {
		const entries = featuredEntries(projects, [group('tectonic', 2)]);
		expect(entries.map((e) => [e.number, e.kind === 'group' ? e.group.slug : e.project.slug])).toEqual([
			['1.1', 'fencing'],
			['1.2', 'tectonic'],
			['1.3', 'pakukuljetus']
		]);
	});

	it('numbers Projects inside a Group by their own order', () => {
		const tectonic = featuredEntries(projects, [group('tectonic', 2)])[1];
		expect(tectonic.kind === 'group' && tectonic.projects.map((p) => [p.number, p.project.slug])).toEqual([
			['1.2.1', 'platform'],
			['1.2.2', 'bot']
		]);
	});

	it('puts a Group before a Project with the same order', () => {
		const entries = featuredEntries([project('a', { order: 2 }), project('b', { group: 'g', order: 1 })], [group('g', 2)]);
		expect(entries.map((e) => e.kind)).toEqual(['group', 'project']);
	});

	it('leaves out non-Featured Projects and Groups without Featured Projects', () => {
		const entries = featuredEntries([project('x', { featured: false, group: 'g' })], [group('g', 1)]);
		expect(entries).toEqual([]);
	});

	it('flattens numbers in page order', () => {
		const numbered = numberedProjects(featuredEntries(projects, [group('tectonic', 2)]));
		expect(numbered.map((n) => n.number)).toEqual(['1.1', '1.2.1', '1.2.2', '1.3']);
	});
});

describe('otherProjects', () => {
	it('returns non-Featured Projects in order', () => {
		const list = otherProjects([project('b', { featured: false, order: 9 }), project('a', { featured: false, order: 2 }), project('c')]);
		expect(list.map((p) => p.slug)).toEqual(['a', 'b']);
	});
});

describe('skillEvidence', () => {
	const projects = [
		project('api', { skills: ['Go', 'PostgreSQL'], repos: ['me/api', 'me/sync'] }),
		project('bot', { skills: ['TypeScript', 'PostgreSQL'], repos: ['me/bot'] })
	];

	it('inverts the Skills that Projects declare', () => {
		const ev = skillEvidence(projects);
		expect([...ev.keys()].sort()).toEqual(['Go', 'PostgreSQL', 'TypeScript']);
		expect(ev.get('PostgreSQL')!.projects.map((p) => p.slug)).toEqual(['api', 'bot']);
	});

	it("dates a Skill by the latest push across its Projects' Repositories", () => {
		const ev = skillEvidence(projects, { 'me/api': '2024-01-01', 'me/sync': '2026-01-01', 'me/bot': '2025-06-01' });
		expect(ev.get('PostgreSQL')!.lastUsed).toBe('2026-01-01');
		expect(ev.get('TypeScript')!.lastUsed).toBe('2025-06-01');
	});

	it('leaves the date out when no Repository metadata is known', () => {
		expect(skillEvidence(projects).get('Go')!.lastUsed).toBeUndefined();
	});
});
