import type { Group, Project } from './types';

export type FeaturedEntry =
	| { kind: 'project'; number: string; project: Project; order: number }
	| { kind: 'group'; number: string; group: Group; projects: { number: string; project: Project }[]; order: number };

/**
 * The home page's Featured list: ungrouped Featured Projects and Groups share one ordering,
 * numbered within section 01 (1.1, 1.2, and 1.2.1 for Projects inside a Group).
 * A Group with no Featured Projects is left out.
 */
export function featuredEntries(projects: Project[], groups: Group[]): FeaturedEntry[] {
	const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;
	const unnumbered = [
		...projects.filter((p) => p.featured && !p.group).map((p) => ({ kind: 'project' as const, project: p, order: p.order })),
		...groups
			.map((g) => ({
				kind: 'group' as const,
				group: g,
				members: projects.filter((p) => p.featured && p.group === g.slug).sort(byOrder),
				order: g.order
			}))
			.filter((g) => g.members.length > 0)
	].sort((a, b) => a.order - b.order || (a.kind === 'group' ? -1 : 1));

	return unnumbered.map((e, i) => {
		const number = `1.${i + 1}`;
		if (e.kind === 'project') return { ...e, number };
		return {
			kind: 'group',
			number,
			group: e.group,
			order: e.order,
			projects: e.members.map((project, j) => ({ number: `${number}.${j + 1}`, project }))
		};
	});
}

/** Featured Projects in on-page order with their numbers. */
export function numberedProjects(entries: FeaturedEntry[]): { number: string; project: Project }[] {
	return entries.flatMap((e) => (e.kind === 'group' ? e.projects : [{ number: e.number, project: e.project }]));
}

/** Projects that are not Featured, in order. */
export function otherProjects(projects: Project[]): Project[] {
	return projects.filter((p) => !p.featured).sort((a, b) => a.order - b.order);
}

export type SkillEvidence = { name: string; projects: Project[]; lastUsed?: string };

/**
 * Skills are the inversion of what Projects declare. `pushedAt` gives each Repository's last
 * push (ISO), when known; a Skill's last use is the latest push across its Projects' Repositories.
 */
export function skillEvidence(projects: Project[], pushedAt: Record<string, string | undefined> = {}): Map<string, SkillEvidence> {
	const out = new Map<string, SkillEvidence>();
	for (const p of projects) {
		const last = lastPush(p, pushedAt);
		for (const name of p.skills) {
			const s = out.get(name) ?? { name, projects: [] };
			s.projects.push(p);
			if (last && (!s.lastUsed || last > s.lastUsed)) s.lastUsed = last;
			out.set(name, s);
		}
	}
	return out;
}

export function lastPush(p: Project, pushedAt: Record<string, string | undefined>): string | undefined {
	return p.repos
		.map((r) => pushedAt[r])
		.filter((x): x is string => !!x)
		.sort()
		.at(-1);
}
