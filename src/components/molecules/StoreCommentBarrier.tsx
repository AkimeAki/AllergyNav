import { css } from "@kuma-ui/core";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<div
			className={css`
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 0;
				transition-duration: 200ms;
				transition-property: opacity;
				background-color: var(--color-secondary);
				border-radius: 15px;
				display: flex;
				justify-content: center;
				align-items: center;
				box-shadow: 0 0 10px -5px #969696;
				z-index: 10;

				@media (max-width: 880px) {
					opacity: 0.9;
				}

				&:hover {
					opacity: 0.9;
				}
			`}
		>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
					padding: 0 20px;
				`}
			>
				{children}
			</div>
		</div>
	);
}
