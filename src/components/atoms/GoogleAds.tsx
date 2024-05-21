"use client";

import { loadGoogleAds } from "@/libs/load-googleads";
import type { DependencyList } from "react";
import { useEffect, useState } from "react";

interface Props {
	slot: string;
	style?: string;
	deps?: DependencyList;
}

export default function ({ slot, style, deps = [] }: Props): JSX.Element {
	const [key, setKey] = useState<number>(0);

	useEffect(() => {
		const root = document.querySelector("#root") as HTMLDivElement;
		const adsNum = (root.dataset.adsNum ?? "") === "" ? 0 : Number(root.dataset.adsNum);
		root.dataset.adsNum = String(adsNum + 1);
	}, deps);

	useEffect(() => {
		const root = document.querySelector("#root") as HTMLDivElement;
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === "data-ads-num") {
					loadGoogleAds();
					setKey((oldKey) => {
						return oldKey + 1;
					});
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

	return (
		<ins
			className={["adsbygoogle", style].join(" ")}
			style={{ display: "inline-block" }}
			data-ad-client="ca-pub-6914867149724943"
			data-ad-slot={slot}
			data-ad-format={style === undefined ? "auto" : undefined}
			data-full-width-responsive={style === undefined ? "true" : "false"}
			data-adtest={process.env.NODE_ENV === "development" ? "on" : "off"}
			key={key}
		/>
	);
}
