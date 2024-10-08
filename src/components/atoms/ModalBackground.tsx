"use client";

import useScroll from "@/hooks/useScroll";
import { css } from "@kuma-ui/core";
import { useEffect } from "react";

interface Props {
	onClick?: () => void;
	color?: string;
}

export default function ({ onClick, color = "#afafaf" }: Props): JSX.Element {
	const { stopScroll, startScroll } = useScroll();

	useEffect(() => {
		stopScroll();

		return () => {
			startScroll();
		};
	}, []);

	return (
		<div
			onClick={onClick}
			className={css`
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 50000;
				opacity: 0;
				animation-name: modalBackgroundFadeIn;
				animation-iteration-count: 1;
				animation-duration: 200ms;
				animation-fill-mode: forwards;

				@keyframes modalBackgroundFadeIn {
					0% {
						opacity: 0;
					}

					100% {
						opacity: 0.4;
					}
				}
			`}
			style={{ backgroundColor: color }}
		/>
	);
}
