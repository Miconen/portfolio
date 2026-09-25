/** Classic cowsay, one line of text. */
export function cowsay(text: string): string {
	const bar = (c: string) => ' ' + c.repeat(text.length + 2);
	return [
		bar('_'),
		`< ${text} >`,
		bar('-'),
		'        \\   ^__^',
		'         \\  (oo)\\_______',
		'            (__)\\       )\\/\\',
		'                ||----w |',
		'                ||     ||'
	].join('\n');
}
