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
				font-size: 30px;
				background-color: var(--color-orange);
				padding: 10px 20px;
				color: white;
				border-radius: 9999px;
			`}
		>
			{children}
		</h1>
	);
}
