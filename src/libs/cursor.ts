export const setCursor = (cursor: string): void => {
	const root = document.querySelector("html") as HTMLHtmlElement;
	root.dataset.cursor = cursor;
};

export const removeCursor = (): void => {
	const root = document.querySelector("html") as HTMLHtmlElement;
	root.dataset.cursor = "";
};
