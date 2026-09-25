// Loads the Markdown/YAML content in /content at build time (ADR 0002).
import { marked } from 'marked';
import { parse } from 'yaml';
import { splitFrontMatter } from './frontmatter';
import type { AboutPage, Group, HomePage, Locale, Project, SkillCategory } from './types';

const files = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const skillsYaml = import.meta.glob('/content/skills.yml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const baseLocale: Locale = 'fi';

type Entry = { data: Record<string, unknown>; body: string };

/** { 'projects/fencing-app': { fi: Entry, en: Entry } } */
const entries = new Map<string, Partial<Record<Locale, Entry>>>();
for (const [path, raw] of Object.entries(files)) {
	const m = /^\/content\/(.+)\.(fi|en)\.md$/.exec(path);
	if (!m) throw new Error(`Content file must be named <slug>.<fi|en>.md: ${path}`);
	const [, key, locale] = m;
	entries.set(key, { ...entries.get(key), [locale as Locale]: splitFrontMatter(raw) });
}

const md = (s: string) => marked.parse(s, { async: false }) as string;
const str = (v: unknown, where: string): string => {
	if (typeof v !== 'string' || !v.trim()) throw new Error(`Missing text field ${where}`);
	return v;
};
const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

/** Localized fields come from the locale's file (falling back to Finnish); shared fields from the Finnish file. */
function resolve(key: string, locale: Locale) {
	const e = entries.get(key);
	const base = e?.[baseLocale];
	if (!base) throw new Error(`Missing ${baseLocale} content for ${key}`);
	const local = e[locale] ?? base;
	return { base: base.data, local: { ...base.data, ...local.data }, body: local.body || base.body };
}

const keys = (dir: string) => [...entries.keys()].filter((k) => k.startsWith(`${dir}/`)).map((k) => k.slice(dir.length + 1));

export function getProjects(locale: Locale): Project[] {
	return keys('projects')
		.map((slug) => {
			const { base, local, body } = resolve(`projects/${slug}`, locale);
			const where = `in projects/${slug}.${locale}.md`;
			return {
				slug,
				title: str(local.title, `title ${where}`),
				summary: str(local.summary, `summary ${where}`),
				role: str(local.role, `role ${where}`),
				html: md(body),
				repos: list(base.repos),
				skills: list(base.skills),
				group: typeof base.group === 'string' && base.group ? base.group : undefined,
				featured: base.featured === true,
				order: Number(base.order ?? 999)
			};
		})
		.sort((a, b) => a.order - b.order);
}

export function getGroups(locale: Locale): Group[] {
	return keys('groups').map((slug) => {
		const { base, local, body } = resolve(`groups/${slug}`, locale);
		return { slug, title: str(local.title, `title in groups/${slug}`), html: md(body), order: Number(base.order ?? 999) };
	});
}

export function getHome(locale: Locale): HomePage {
	const { base, local } = resolve('pages/home', locale);
	return {
		tagline: str(local.tagline, 'tagline in pages/home'),
		primaryLanguages: list(base.primaryLanguages),
		location: String(local.location ?? ''),
		languages: String(local.languages ?? ''),
		freeTime: String(local.freeTime ?? ''),
		environment: String(local.environment ?? '')
	};
}

export function getAbout(locale: Locale): AboutPage {
	const { local, body } = resolve('pages/about', locale);
	return { title: String(local.title ?? ''), html: md(body) };
}

type RawCategory = { id: string; label: Record<Locale, string>; skills: string[]; showLastUsed?: boolean };

export function getSkillCategories(locale: Locale): SkillCategory[] {
	const raw = Object.values(skillsYaml)[0];
	const parsed = (raw ? parse(raw) : { categories: [] }) as { categories: RawCategory[] };
	return parsed.categories.map((c) => ({
		id: c.id,
		label: c.label[locale] ?? c.label[baseLocale],
		skills: (c.skills ?? []).map(String),
		showLastUsed: c.showLastUsed !== false
	}));
}
