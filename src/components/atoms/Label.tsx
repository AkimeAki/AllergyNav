/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function Label({ children }: Props): JSX.Element {
	return (
		<label
			css={css`
				display: block;
			`}
		>
			{children}
		</label>
	);
}
