import { css } from "@kuma-ui/core";

export default function (): JSX.Element {
	return (
		<div
			className={css`
				width: 100%;
				height: 100%;
				display: block;
				transition-duration: 200ms;
				transition-property: filter;
				background: linear-gradient(to right, #ffe9e4, #fff6f5, #ffe9e4) fixed;
				background-size: 300% 300%;
				animation-name: tabLoadingMove;
				animation-duration: 4s;
				animation-iteration-count: infinite;
				animation-timing-function: linear;
				cursor: progress;

				@keyframes tabLoadingMove {
					0% {
						background-position: 0% 0%;
					}
					100% {
						background-position: 300% 0%;
					}
				}
			`}
		/>
	);
}
