"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface Props {
	slot: string;
	style?: string;
}

export default function ({ slot, style }: Props): JSX.Element {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
			(adsbygoogle = window.adsbygoogle || []).push({});
		} catch (e) {}
	}, [pathname, searchParams]);

	return (
		<ins
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