import { parse } from 'yaml';

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Splits a Markdown file into its YAML front matter and body. */
export function splitFrontMatter(raw: string): { data: Record<string, unknown>; body: string } {
	const match = FENCE.exec(raw);
	if (!match) return { data: {}, body: raw.trim() };
	const data = parse(match[1]) ?? {};
	if (typeof data !== 'object' || Array.isArray(data)) throw new Error('Front matter must be a mapping');
	return { data: data as Record<string, unknown>, body: raw.slice(match[0].length).trim() };
}
