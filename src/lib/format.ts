import { m } from '$lib/paraglide/messages.js';

const DAY = 86_400_000;

/** "2 pv sitten" / "2 d ago", in the current locale. */
export function ago(iso: string, now = Date.now()): string {
	const days = Math.floor((now - new Date(iso).getTime()) / DAY);
	if (days <= 0) return m.ago_today();
	if (days === 1) return m.ago_yesterday();
	if (days < 31) return m.ago_days({ n: days });
	if (days < 365) return m.ago_months({ n: Math.floor(days / 30) });
	return m.ago_years({ n: Math.floor(days / 365) });
}

export const langColors: Record<string, string> = {
	Go: '#00ADD8',
	TypeScript: '#3178c6',
	Svelte: '#ff3e00',
	Python: '#3572A5',
	CSS: '#663399',
	JavaScript: '#f1e05a',
	Dockerfile: '#384d54',
	PLpgSQL: '#336790',
	Shell: '#89e051',
	'C#': '#178600',
	Lua: '#000080',
	Nix: '#7e7eff',
	Rust: '#dea584',
	PHP: '#4F5D95',
	HTML: '#e34c26',
	HCL: '#844FBA'
};

export type LanguageShare = { name: string; share: number; color: string };

/** Language shares (0..1) summed over byte counts, largest first, dropping slivers under 1%. */
export function languageShares(byteCounts: Record<string, number>[]): LanguageShare[] {
	const totals: Record<string, number> = {};
	for (const counts of byteCounts) for (const [k, v] of Object.entries(counts)) totals[k] = (totals[k] ?? 0) + v;
	const sum = Object.values(totals).reduce((a, b) => a + b, 0);
	if (!sum) return [];
	return Object.entries(totals)
		.map(([name, bytes]) => ({ name, share: bytes / sum, color: langColors[name] ?? '#888' }))
		.filter((l) => l.share >= 0.01)
		.sort((a, b) => b.share - a.share);
}
