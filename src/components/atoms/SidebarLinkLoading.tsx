import { css } from "@kuma-ui/core";

export default function (): JSX.Element {
	return (
		<div
			className={css`
				text-decoration: none;
				height: 44px;
				padding: 13px 15px 16px;
				display: block;
				border-radius: 9999px;
				font-weight: bold;
				transition-duration: 200ms;
				transition-property: background-color;
				border: none;
				text-align: left;
				background: linear-gradient(to right, #ffe9e4, #fff6f5, #ffe9e4) fixed;
				background-size: 300% 300%;
				animation-name: sidebarLinkLoadingMove;
				animation-duration: 4s;
				animation-iteration-count: infinite;
				animation-timing-function: linear;
				cursor: progress;

				@keyframes sidebarLinkLoadingMove {
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
