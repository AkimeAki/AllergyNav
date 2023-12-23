import { css } from "@kuma-ui/core";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	required?: boolean;
}

export default function ({ children, required = false }: Props): JSX.Element {
	return (
		<label
			className={css`
				display: flex;
				background-color: var(--color-orange-thin);
				padding: 5px 10px;
				border-radius: 10px;
				user-select: text;
				pointer-events: auto;
				cursor: text;
			`}
		>
			{children}
			{required && (
				<div
					className={css`
						margin-left: 2px;
						color: var(--color-red);
						font-size: 12px;
						font-weight: bold;
					`}
				>
					*
				</div>
			)}
		</label>
	);
}
