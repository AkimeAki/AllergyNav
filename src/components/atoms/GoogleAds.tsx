"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
	slot: string;
	style?: string;
}

export default function ({ slot, style }: Props): JSX.Element {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [adsKey, setAdsKey] = useState<boolean>(false);

	useEffect(() => {
		try {
			setTimeout(() => {
				console.log("更新1");
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
				(adsbygoogle = window.adsbygoogle || []).push({});
			}, 500);
		} catch (e) {}
	}, [pathname, searchParams]);

	useEffect(() => {
		setAdsKey((key) => {
			return !key;
		});
	}, [pathname, searchParams]);

	return (
		<ins
			key={String(adsKey)}
			className={["adsbygoogle", style].join(" ")}
			style={{ display: "inline-block" }}
			data-ad-client="ca-pub-6914867149724943"
			data-ad-slot={slot}
			data-ad-format={style === undefined ? "auto" : undefined}
			data-full-width-responsive={style === undefined ? "true" : "false"}
			data-adtest={process.env.NODE_ENV === "development" ? "on" : "off"}
		/>
	);
}
