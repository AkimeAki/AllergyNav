import { type ReactNode } from "react";
import { css } from "@kuma-ui/core";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<main
			className={css`
				max-width: 1200px;
				min-height: 100vh;
				margin: 0 auto;
				padding: 30px;

				@media (max-width: 600px) {
					padding: 10px;
				}
			`}
		>
			{children}
		</main>
	);
}
