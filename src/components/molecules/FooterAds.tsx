"use client";

import { css } from "@kuma-ui/core";
import GoogleAds from "@/components/atoms/GoogleAds";
import { useEffect, useState } from "react";
import { loadGoogleAds } from "@/libs/load-googleads";

export default function (): JSX.Element {
	const [resizeGoogleAdsToggle, setResizeGoogleAdsToggle] = useState<number>(0);

	useEffect(() => {
		const resize = (): void => {
			if (window.matchMedia("(max-width: 550px)").matches) {
				setResizeGoogleAdsToggle(550);
			} else if (window.matchMedia("(max-width: 770px)").matches) {
				setResizeGoogleAdsToggle(770);
			} else {
				setResizeGoogleAdsToggle(0);
			}
		};

		window.addEventListener("resize", resize, false);

		return () => {
			window.removeEventListener("resize", resize);
		};
	}, []);

	useEffect(() => {
		loadGoogleAds();
	}, [resizeGoogleAdsToggle]);

	return (
		<div
			className={css`
				margin: 30px 0;
			`}
		>
			<div
				key={String(resizeGoogleAdsToggle)}
				className={css`
					text-align: center;

					@media (max-width: 770px) {
						display: none;
					}
				`}
			>
				<GoogleAds
					slot="3013069660"
					style={css`
						width: 728px;
						height: 250px;
					`}
				/>
			</div>
			<div
				className={css`
					display: none;
					text-align: center;

					@media (max-width: 770px) {
						display: block;
					}

					@media (max-width: 500px) {
						display: none;
					}
				`}
			>
				<GoogleAds
					slot="3013069660"
					style={css`
						width: 450px;
						height: 250px;
					`}
				/>
			</div>
			<div
				className={css`
					display: none;
					text-align: center;

					@media (max-width: 500px) {
						display: block;
					}
				`}
			>
				<GoogleAds
					slot="3013069660"
					style={css`
						width: 300px;
						height: 250px;
					`}
				/>
			</div>
		</div>
	);
}
