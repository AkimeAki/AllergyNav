/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";

interface Props {
	name: string;
	size: number;
	color: string;
}

export default function ({ name, size, color }: Props): JSX.Element {
	return (
		<div
			css={css`
				color: ${color};
				font-size: ${size}px;
			`}
			className="material-symbols-outlined"
		>
			{name}
		</div>
	);
}
