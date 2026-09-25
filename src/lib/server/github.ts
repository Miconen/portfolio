// Live Repository metadata from the GitHub API (ADR 0002). Never stored: fetched on demand,
// cached in memory for an hour, and served stale if GitHub is unavailable.
import { env } from '$env/dynamic/private';

export const GITHUB_USER = 'Miconen';
const TTL_MS = 60 * 60 * 1000;
const TIMEOUT_MS = 5000;

export type RepoMeta = { name: string; pushedAt: string; languages: Record<string, number> };
export type Profile = { publicRepos: number; latestPush?: { repo: string; at: string } };

type Fetch = typeof fetch;
type Slot<T> = { value?: T; expires: number; pending?: Promise<T | undefined> };

export function createGitHub(fetchImpl: Fetch = fetch, now: () => number = Date.now) {
	const cache = new Map<string, Slot<unknown>>();

	async function api<T>(path: string): Promise<T> {
		const headers: Record<string, string> = {
			accept: 'application/vnd.github+json',
			'user-agent': 'micorintala.com'
		};
		if (env.GITHUB_TOKEN) headers.authorization = `Bearer ${env.GITHUB_TOKEN}`;
		const res = await fetchImpl(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
		if (!res.ok) throw new Error(`GitHub ${path}: ${res.status}`);
		return (await res.json()) as T;
	}

	/** Cached lookup: fresh value, else one shared refresh, else the last good value. */
	function cached<T>(key: string, load: () => Promise<T>): Promise<T | undefined> {
		const slot = (cache.get(key) ?? { expires: 0 }) as Slot<T>;
		cache.set(key, slot);
		if (slot.value !== undefined && slot.expires > now()) return Promise.resolve(slot.value);
		slot.pending ??= load()
			.then((value) => {
				slot.value = value;
				slot.expires = now() + TTL_MS;
				return value;
			})
			.catch((err) => {
				console.warn(`[github] ${key}: ${err instanceof Error ? err.message : err}`);
				slot.expires = now() + 60_000; // retry a failed refresh after a minute
				return slot.value;
			})
			.finally(() => (slot.pending = undefined));
		return slot.pending;
	}

	function repo(name: string): Promise<RepoMeta | undefined> {
		return cached(`repo:${name}`, async () => {
			const [info, languages] = await Promise.all([
				api<{ pushed_at: string }>(`/repos/${name}`),
				api<Record<string, number>>(`/repos/${name}/languages`)
			]);
			return { name, pushedAt: info.pushed_at, languages };
		});
	}

	async function repos(names: string[]): Promise<Record<string, RepoMeta>> {
		const metas = await Promise.all([...new Set(names)].map(repo));
		return Object.fromEntries(metas.filter((m): m is RepoMeta => !!m).map((m) => [m.name, m]));
	}

	function profile(): Promise<Profile | undefined> {
		return cached('profile', async () => {
			const [user, events] = await Promise.all([
				api<{ public_repos: number }>(`/users/${GITHUB_USER}`),
				api<{ type: string; created_at: string; repo: { name: string } }[]>(`/users/${GITHUB_USER}/events/public?per_page=30`)
			]);
			const push = events.find((e) => e.type === 'PushEvent');
			return {
				publicRepos: user.public_repos,
				latestPush: push ? { repo: push.repo.name, at: push.created_at } : undefined
			};
		});
	}

	return { repos, profile };
}

export const github = createGitHub();
