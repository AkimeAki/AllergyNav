import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<aside
			className={css`
				display: flex;
				flex-direction: column;
				border-radius: 15px;
				overflow: hidden;
			`}
		>
			{children}
		</aside>
	);
}
