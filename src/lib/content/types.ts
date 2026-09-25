export type Locale = 'fi' | 'en';

/** A curated portfolio entry (see CONTEXT.md). */
export type Project = {
	slug: string;
	title: string;
	summary: string;
	role: string;
	/** Write-up rendered to HTML. */
	html: string;
	/** owner/name of each Repository. */
	repos: string[];
	skills: string[];
	group?: string;
	featured: boolean;
	order: number;
};

export type Group = {
	slug: string;
	title: string;
	/** Introduction rendered to HTML. */
	html: string;
	order: number;
};

export type SkillCategory = {
	id: string;
	label: string;
	skills: string[];
	showLastUsed: boolean;
};

export type HomePage = {
	tagline: string;
	primaryLanguages: string[];
	location: string;
	languages: string;
	freeTime: string;
	environment: string;
};

export type AboutPage = { title: string; html: string };
