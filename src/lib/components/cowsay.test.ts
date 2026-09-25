import { describe, expect, it } from 'vitest';
import { cowsay } from './cowsay';

describe('cowsay', () => {
	it('sizes the bubble to the text', () => {
		const [top, line, bottom] = cowsay('moo.').split('\n');
		expect(line).toBe('< moo. >');
		expect(top).toBe(' ______');
		expect(bottom).toBe(' ------');
	});
});
