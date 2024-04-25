import { css } from "@kuma-ui/core";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<h2
			className={css`
				width: 100%;
				font-weight: 700;
				font-size: 18px;
				background-color: var(--color-theme);
				padding: 10px 20px 13px;
				color: var(--color-secondary);
				border-radius: 7px;

				* {
					font-weight: inherit;
					font-size: inherit;
					color: inherit;
				}
			`}
		>
			{children}
		</h2>
	);
}
