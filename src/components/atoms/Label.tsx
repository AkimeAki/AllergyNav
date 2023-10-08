/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props) {
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
