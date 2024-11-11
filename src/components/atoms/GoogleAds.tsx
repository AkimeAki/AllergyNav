"use client";

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
		setKey((oldKey) => {
			return oldKey + 1;
		});

		setTimeout(() => {
			if (process.env.NODE_ENV === "production") {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				(adsbygoogle = window.adsbygoogle || []).push({});
			}
		}, 200);
	}, deps);

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
