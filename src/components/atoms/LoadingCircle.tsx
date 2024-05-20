"use client";

import { css } from "@kuma-ui/core";

interface Props {
	size: number;
}

export default function ({ size }: Props): JSX.Element {
	return (
		<div
			className={css`
				animation-name: loadingCircleRotate;
				animation-iteration-count: infinite;
				animation-duration: 1000ms;
				animation-timing-function: linear;

				@keyframes loadingCircleRotate {
					0% {
						transform: rotate(0);
					}

					100% {
						transform: rotate(360deg);
					}
				}

				& > span {
					display: block;
				}
			`}
		>
			<div
				style={{ width: size + "px" }}
				className={css`
					aspect-ratio: 1/1;
					border-radius: 9999px;
					border: 4px solid var(--color-theme);
					border-bottom-color: transparent;
					border-left-color: transparent !important;
					border-top-color: transparent !important;
				`}
			/>
		</div>
	);
}
