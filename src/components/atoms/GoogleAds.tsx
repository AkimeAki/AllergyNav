"use client";

import { loadGoogleAds } from "@/libs/load-googleads";
import { useEffect } from "react";

interface Props {
	slot: string;
	style?: string;
}

export default function ({ slot, style }: Props): JSX.Element {
	useEffect(() => {
		loadGoogleAds();
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
		/>
	);
}
