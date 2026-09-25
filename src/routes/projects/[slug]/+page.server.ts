import { error } from '@sveltejs/kit';
import { getGroups, getProjects } from '$lib/content';
import { getLocale } from '$lib/paraglide/runtime';
import { github } from '$lib/server/github';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const locale = getLocale();
	const project = getProjects(locale).find((p) => p.slug === params.slug);
	if (!project) error(404, 'Not found');
	const group = project.group ? getGroups(locale).find((g) => g.slug === project.group) : undefined;
	const repos = await github.repos(project.repos);
	setHeaders({ 'cache-control': 'public, max-age=300' });
	return { project, group, repos };
};
