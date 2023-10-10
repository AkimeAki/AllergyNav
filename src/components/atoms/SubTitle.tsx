/** @jsxImportSource @emotion/react */
"use client";

import type { ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<h2
			css={css`
				font-weight: 700;
				font-size: 18px;
				background-color: var(--color-orange);
				padding: 10px 20px;
				color: white;
				border-radius: 20px;
			`}
		>
			{children}
		</h2>
	);
}
