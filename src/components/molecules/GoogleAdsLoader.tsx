"use client";

import { useEffect } from "react";

export default function (): JSX.Element {
	useEffect(() => {
		const root = document.querySelector("#root") as HTMLDivElement;
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === "data-ads-num") {
					// const root = document.querySelector("#root") as HTMLDivElement;

					try {
						setTimeout(() => {
							if (process.env.NODE_ENV === "production") {
								// const adsNum = (root.dataset.adsNum ?? "") === "" ? 0 : Number(root.dataset.adsNum);

								// if (adsNum === Number(mutation.oldValue) + 1) {
								console.log("load", Number(mutation.oldValue) + 1);

								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-expect-error
								// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
								(adsbygoogle = window.adsbygoogle || []).push({});
								// }
							}
						}, 1000);
					} catch (e) {}
				}
			});
		});
		observer.observe(root, {
			attributes: true,
			childList: false,
			subtree: false,
			characterData: false,
			attributeOldValue: true,
			characterDataOldValue: false
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return <></>;
}
