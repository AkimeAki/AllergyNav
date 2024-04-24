"use client";

import { css } from "@kuma-ui/core";
import GoogleIcon from "@/components/atoms/GoogleIcon";

interface Props {
	size: number;
}

export default function ({ size }: Props): JSX.Element {
	return (
		<div
			className={css`
				animation-name: loadingCircleRotate;
				animation-iteration-count: infinite;
				animation-duration: 500ms;
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
			<GoogleIcon size={size} name="progress_activity" color="var(--color-theme)" />
		</div>
	);
}
