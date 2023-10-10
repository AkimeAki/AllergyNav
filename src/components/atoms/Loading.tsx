/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";

export default function (): JSX.Element {
	return (
		<div
			css={css`
				display: flex;
				justify-content: center;
			`}
		>
			<div
				css={css`
					position: relative;
					width: 40px;
					height: 30px;
					animation-name: viewLoading;
					animation-duration: 1.5s;
					animation-fill-mode: forwards;
					opacity: 0;

					@keyframes viewLoading {
						0% {
							opacity: 0;
						}

						50% {
							opacity: 0;
						}

						100% {
							opacity: 1;
						}
					}

					& div {
						position: absolute;
						top: 50%;
						background-color: var(--color-orange);
						width: 10px;
						height: 30px;
						border-radius: 20px;
						animation-name: loading;
						animation-duration: 0.7s;
						animation-iteration-count: infinite;
						animation-direction: alternate-reverse;
					}

					@keyframes loading {
						from {
							height: 30px;
						}

						to {
							height: 5px;
						}
					}
				`}
			>
				<div
					css={css`
						left: 0;
						transform: translate(0, -50%);
					`}
				/>
				<div
					css={css`
						left: 50%;
						transform: translate(-50%, -50%);
						animation-delay: calc(1s / 3);
					`}
				/>
				<div
					css={css`
						right: 0;
						transform: translate(0, -50%);
						animation-delay: calc((1s / 3) * 2);
					`}
				/>
			</div>
		</div>
	);
}
