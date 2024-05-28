export const removeSelect = (): void => {
	const html = document.querySelector("html") as HTMLHtmlElement;
	html.dataset.select = "none";
};

export const startSelect = (): void => {
	const html = document.querySelector("html") as HTMLHtmlElement;
	html.dataset.select = "";
};
