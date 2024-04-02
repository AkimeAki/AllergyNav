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
				border-width: 4px;
				border-style: solid;
				border-color: #ff6565;
				background-color: #ffd1d1;
				border-radius: 15px;
				font-weight: bold;
			`}
		>
			{children}
		</div>
	);
}
