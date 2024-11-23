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
		const scrollTop = root.scrollTop;
		root.style.overflowY = "hidden";
		document.body.style.overflowY = "scroll";
		root.dataset.scrollY = String(scrollTop);
		setIsScroll(false);
	};

	const startScroll = (): void => {
		const root = document.querySelector("#root") as HTMLDivElement;
		root.style.overflowY = "";
		document.body.style.overflowY = "";
		if (root.dataset.scrollY !== undefined && root.dataset.scrollY !== "") {
			root.scrollTo(0, Number(root.dataset.scrollY));
			root.dataset.scrollY = "";
		}
		setIsScroll(true);
	};

	return { stopScroll, startScroll, isScroll };
}
