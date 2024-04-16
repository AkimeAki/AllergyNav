import { css } from "@kuma-ui/core";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<h2
			className={css`
				position: relative;
				width: 100%;
				font-weight: 700;
				font-size: 18px;
				padding: 10px 20px 14px 20px;

				* {
					font-weight: inherit;
					font-size: inherit;
					color: inherit;
				}

				&:after {
					content: "";
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 4px;
					background-color: var(--color-theme);
					border-radius: 20px;
				}
			`}
		>
			{children}
		</h2>
	);
}
