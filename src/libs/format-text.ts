import sanitizeHtml from "sanitize-html";

export const formatText = (text: string): string => {
	return sanitizeHtml(text, {
		allowedTags: [],
		allowedAttributes: {},
		disallowedTagsMode: "recursiveEscape"
	})
		.replaceAll(/\n|\r|\n\r/g, " <br> ")
		.replaceAll(/\s/g, " ")
		.replaceAll(/\t/g, " ")
		.split(" ")
		.map((char: string) => {
			return char.replace(/(http(?:|s):\/\/.+)/, `<a href="$1" target="_blank">$1</a>`);
		})
		.join(" ");
};
