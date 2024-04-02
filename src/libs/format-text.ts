import sanitizeHtml from "sanitize-html";

export const formatText = (text: string): string => {
	return sanitizeHtml(text, {
		allowedTags: [],
		allowedAttributes: {},
		disallowedTagsMode: "recursiveEscape"
	}).replaceAll("\n", "<br>");
};
