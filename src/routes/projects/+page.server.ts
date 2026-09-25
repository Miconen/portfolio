import { getGroups, getProjects } from '$lib/content';
import { getLocale } from '$lib/paraglide/runtime';
import { github } from '$lib/server/github';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const locale = getLocale();
	const projects = getProjects(locale);
	const repos = await github.repos(projects.flatMap((p) => p.repos));
	setHeaders({ 'cache-control': 'public, max-age=300' });
	return { projects, groups: getGroups(locale), repos };
};
