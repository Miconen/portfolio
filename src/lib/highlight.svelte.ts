import { getContext, setContext } from 'svelte';

/**
 * Which Skill is highlighted: the one under the pointer/focus, else the one clicked
 * (which stays lit for a few seconds). Project cards dim or light up accordingly.
 */
export class Highlight {
	hover = $state<string | null>(null);
	pinned = $state<string | null>(null);
	#timer: ReturnType<typeof setTimeout> | undefined;

	get active() {
		return this.hover ?? this.pinned;
	}

	pin(skill: string, ms = 4000) {
		this.pinned = skill;
		clearTimeout(this.#timer);
		this.#timer = setTimeout(() => (this.pinned = null), ms);
	}

	clear() {
		this.pinned = null;
		clearTimeout(this.#timer);
	}

	/** null when nothing is highlighted, else whether these skills include the highlighted one. */
	state(skills: string[]): 'lit' | 'faded' | null {
		const a = this.active;
		return a === null ? null : skills.includes(a) ? 'lit' : 'faded';
	}
}

const KEY = Symbol('highlight');
export const provideHighlight = () => setContext(KEY, new Highlight());
export const useHighlight = () => getContext<Highlight | undefined>(KEY);
