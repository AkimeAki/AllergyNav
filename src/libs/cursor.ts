export const setCursor = (cursor: string): void => {
	document.body.dataset.cursor = cursor;
};

export const removeCursor = (): void => {
	document.body.dataset.cursor = "";
};
