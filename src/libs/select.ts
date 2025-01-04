export const removeSelect = (): void => {
	document.body.dataset.select = "none";
};

export const startSelect = (): void => {
	document.body.dataset.select = "";
};
