import { css } from "@kuma-ui/core";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<h1
			className={css`
				width: 100%;
				font-weight: 700;
				font-size: 25px;
				background-color: var(--color-theme);
				padding: 12px 20px;
				color: var(--color-white);
				border-radius: 7px;
			`}
		>
			{children}
		</h1>
	);
}
