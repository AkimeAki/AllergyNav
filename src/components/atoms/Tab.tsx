/** @jsxImportSource @emotion/react */
"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
	children: ReactNode;
	selected: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ({ children, selected, onClick }: Props): JSX.Element {
	return (
		<button
			type="button"
			onClick={onClick}
			css={css`
				font-size: 18px;
				background-color: ${selected ? "var(--color-orange)" : "white"};
				color: ${selected ? "white" : "var(--color-orange)"};
				font-weight: 700;
				width: 100%;
				text-align: center;
				padding: 10px;
				border: none;
				cursor: pointer;
			`}
		>
			{children}
		</button>
	);
}
