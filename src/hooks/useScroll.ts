import { useState } from "react";

interface ReturnType {
	stopScroll: () => void;
	startScroll: () => void;
	isScroll: boolean;
}

export default function (): ReturnType {
	const [isScroll, setIsScroll] = useState<boolean>(true);

	const stopScroll = (): void => {
		const html = document.querySelector("html") as HTMLHtmlElement;
		const scrollTop = html.scrollTop;
		html.style.overflowY = "scroll";
		html.style.top = `-${scrollTop}px`;
		html.style.position = "fixed";
		html.dataset.scrollY = String(scrollTop);
		setIsScroll(false);
	};

	const startScroll = (): void => {
		const html = document.querySelector("html") as HTMLHtmlElement;
		html.style.overflowY = "";
		html.style.top = "";
		html.style.position = "";
		html.scrollTo(0, Number(html.dataset.scrollY));
		setIsScroll(true);
	};

	return { stopScroll, startScroll, isScroll };
}
