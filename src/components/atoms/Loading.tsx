"use client";

import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";

interface Props {
	message?: string;
	delayMessage?: string;
}

export default function ({
	message = "読み込み中",
	delayMessage = "読み込みに時間がかかっています"
}: Props): JSX.Element {
	const [displayMessage, setDisplayMessage] = useState<string>(message);

	useEffect(() => {
		setTimeout(() => {
			setDisplayMessage(delayMessage);
		}, 7000);
	}, []);

	return (
		<div
			className={css`
				width: 100%;
				padding: 20px;
				text-align: center;

				&:before,
				&:after {
					content: "";
					animation-name: loading-animation;
					animation-duration: 1.5s;
					animation-iteration-count: infinite;
					animation-timing-function: linear;
					color: var(--color-theme-thin);
					font-weight: bold;
				}

				@keyframes loading-animation {
					0% {
						content: "";
						color: var(--color-theme-thin);
					}

					25% {
						content: "・";
						color: var(--color-theme-thin);
					}

					50% {
						content: "・・";
						color: var(--color-theme);
					}

					75% {
						content: "・・・";
						color: var(--color-red);
					}

					100% {
						content: "";
						color: var(--color-theme-thin);
					}
				}
			`}
		>
			{displayMessage}
		</div>
	);
}
