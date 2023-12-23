import { css } from "@kuma-ui/core";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<div
			className={css`
				width: 100%;
				padding: 10px;
				background-color: var(--color-orange-thin);
				border-width: 4px;
				border-style: solid;
				border-color: var(--color-red);
				font-weight: bold;
			`}
		>
			{children}
		</div>
	);
}
