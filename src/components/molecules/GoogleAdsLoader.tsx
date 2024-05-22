"use client";

import { loadGoogleAds } from "@/libs/load-googleads";
import { useEffect } from "react";

export default function (): JSX.Element {
	useEffect(() => {
		const root = document.querySelector("#root") as HTMLDivElement;
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === "data-ads-num") {
					loadGoogleAds();
				}
			});
		});
		observer.observe(root, {
			attributes: true,
			childList: false,
			subtree: false,
			characterData: false,
			attributeOldValue: false,
			characterDataOldValue: false
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return <></>;
}
