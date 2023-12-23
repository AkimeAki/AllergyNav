import { css } from "@kuma-ui/core";

export default function (): JSX.Element {
	return (
		<span
			className={css`
				color: inherit;
				font-size: inherit;
				font-weight: inherit;
				line-height: inherit;
				user-select: none;
				pointer-events: none;

				&:after {
					content: "・";
					animation-name: loading-dot-animation;
					animation-duration: 1.5s;
					animation-iteration-count: infinite;
					animation-timing-function: linear;
				}

				@keyframes loading-dot-animation {
					0% {
						content: "・";
					}

					33% {
						content: "・・";
					}

					66% {
						content: "・・・";
					}

					100% {
						content: "・";
					}
				}
			`}
		/>
	);
}
