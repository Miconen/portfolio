import { describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({ env: {} }));
const { createGitHub } = await import('./github');

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

function fakeGitHub() {
	let t = 0;
	let down = false;
	const fetch = vi.fn(async (url: string) => {
		if (down) return json({}, 503);
		if (url.endsWith('/languages')) return json({ Go: 100 });
		if (url.includes('/events/')) return json([{ type: 'WatchEvent' }, { type: 'PushEvent', created_at: 'T', repo: { name: 'me/x' } }]);
		if (url.includes('/users/')) return json({ public_repos: 42 });
		return json({ pushed_at: `push@${t}` });
	});
	const gh = createGitHub(fetch as unknown as typeof globalThis.fetch, () => t);
	return { gh, fetch, advance: (ms: number) => (t += ms), setDown: (v: boolean) => (down = v) };
}

describe('github', () => {
	it('fetches Repository metadata and caches it for an hour', async () => {
		const { gh, fetch, advance } = fakeGitHub();
		expect(await gh.repos(['me/a'])).toEqual({ 'me/a': { name: 'me/a', pushedAt: 'push@0', languages: { Go: 100 } } });
		await gh.repos(['me/a']);
		expect(fetch).toHaveBeenCalledTimes(2);
		advance(60 * 60 * 1000 + 1);
		expect((await gh.repos(['me/a']))['me/a'].pushedAt).toBe('push@3600001');
	});

	it('shares one request between concurrent callers', async () => {
		const { gh, fetch } = fakeGitHub();
		await Promise.all([gh.repos(['me/a']), gh.repos(['me/a', 'me/a'])]);
		expect(fetch).toHaveBeenCalledTimes(2);
	});

	it('serves the last good value while GitHub is down', async () => {
		const { gh, advance, setDown } = fakeGitHub();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		await gh.repos(['me/a']);
		advance(2 * 60 * 60 * 1000);
		setDown(true);
		expect((await gh.repos(['me/a']))['me/a'].pushedAt).toBe('push@0');
		expect(await gh.repos(['me/never'])).toEqual({});
		warn.mockRestore();
	});

	it('reads the public repo count and the latest push', async () => {
		const { gh } = fakeGitHub();
		expect(await gh.profile()).toEqual({ publicRepos: 42, latestPush: { repo: 'me/x', at: 'T' } });
	});
});
