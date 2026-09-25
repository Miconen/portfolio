import { fail } from '@sveltejs/kit';
import { getAbout, getGroups, getHome, getProjects, getSkillCategories } from '$lib/content';
import { getLocale } from '$lib/paraglide/runtime';
import { createRateLimiter, readContact, sendContact, validateContact } from '$lib/server/contact';
import { github } from '$lib/server/github';
import { clientAddress } from '$lib/server/request';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const locale = getLocale();
	const projects = getProjects(locale);
	const [repos, profile] = await Promise.all([github.repos(projects.flatMap((p) => p.repos)), github.profile()]);
	setHeaders({ 'cache-control': 'public, max-age=300' });
	return {
		home: getHome(locale),
		about: getAbout(locale),
		groups: getGroups(locale),
		categories: getSkillCategories(locale),
		projects,
		repos,
		profile
	};
};

const limit = createRateLimiter(5, 60 * 60 * 1000);

export const actions: Actions = {
	contact: async (event) => {
		const input = readContact(await event.request.formData());
		const values = { name: input.name, email: input.email, subject: input.subject, message: input.message };
		// Bots fill the hidden field; pretend it worked.
		if (input.website) return { sent: true };
		const errors = validateContact(input);
		if (Object.keys(errors).length) return fail(400, { errors, values });
		if (!limit(clientAddress(event))) return fail(429, { error: 'rate' as const, values });
		try {
			await sendContact(input, getLocale());
		} catch (err) {
			console.error('[contact]', err);
			return fail(502, { error: 'send' as const, values });
		}
		return { sent: true };
	}
};
