"use client";

import { useEffect } from "react";

export default function (): JSX.Element {
	useEffect(() => {
		const root = document.querySelector("html") as HTMLHtmlElement;
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === "data-ads-num") {
					try {
						setTimeout(() => {
							if (process.env.NODE_ENV === "production") {
								// @ts-expect-error
								(adsbygoogle = window.adsbygoogle || []).push({});
							}
						}, 200);
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
