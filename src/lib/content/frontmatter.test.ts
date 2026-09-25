import { describe, expect, it } from 'vitest';
import { splitFrontMatter } from './frontmatter';

describe('splitFrontMatter', () => {
	it('parses YAML front matter and trims the body', () => {
		const { data, body } = splitFrontMatter('---\ntitle: "C# & .NET"\nskills: [Go, "C#"]\n---\n\nHello\n');
		expect(data).toEqual({ title: 'C# & .NET', skills: ['Go', 'C#'] });
		expect(body).toBe('Hello');
	});

	it('treats a file without front matter as body only', () => {
		expect(splitFrontMatter('Just text')).toEqual({ data: {}, body: 'Just text' });
	});

	it('rejects front matter that is not a mapping', () => {
		expect(() => splitFrontMatter('---\n- a\n---\n')).toThrow();
	});
});
