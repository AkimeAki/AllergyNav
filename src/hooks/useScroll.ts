import { useState } from "react";

interface ReturnType {
	stopScroll: () => void;
	startScroll: () => void;
	isScroll: boolean;
}

export default function (): ReturnType {
	const [isScroll, setIsScroll] = useState<boolean>(true);

	const stopScroll = (): void => {
		const root = document.querySelector("#root") as HTMLDivElement;
		const html = document.querySelector("html") as HTMLHtmlElement;
		const scrollTop = root.scrollTop;
		root.style.overflowY = "hidden";
		html.style.overflowY = "scroll";
		root.dataset.scrollY = String(scrollTop);
		setIsScroll(false);
	};

	const startScroll = (): void => {
		const root = document.querySelector("#root") as HTMLDivElement;
		const html = document.querySelector("html") as HTMLHtmlElement;
		root.style.overflowY = "";
		html.style.overflowY = "";
		root.scrollTo(0, Number(root.dataset.scrollY));
		setIsScroll(true);
	};

	return { stopScroll, startScroll, isScroll };
}
