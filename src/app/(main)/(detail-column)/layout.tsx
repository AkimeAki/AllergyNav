import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<div
			className={css`
				display: grid;
				grid-template-columns: 300px 1fr;
				gap: 10px;
				align-items: flex-start;

				@media (max-width: 960px) {
					grid-template-columns: 220px 1fr;
				}
			`}
		>
			{children}
		</div>
	);
}
