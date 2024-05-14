export const removeSelect = (): void => {
	const root = document.querySelector("#root") as HTMLDivElement;
	root.dataset.select = "none";
};

export const startSelect = (): void => {
	const root = document.querySelector("#root") as HTMLDivElement;
	root.dataset.select = "";
};
