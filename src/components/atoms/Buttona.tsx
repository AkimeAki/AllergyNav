/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import type { ReactNode, MouseEventHandler } from "react";

interface Props {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
	loading?: boolean;
}

export default function ({ onClick, children, loading = false }: Props): JSX.Element {
	return (
		<button
			type="button"
			onClick={onClick}
			css={css`
				position: relative;
				cursor: ${loading ? "wait" : "pointer"};
				padding: 12px 30px;
				background-color: white;
				border-style: solid;
				border-color: var(--color-orange);
				border-width: 2px;
				border-radius: 30px;
				font-weight: 700;
				overflow: hidden;
				transition-duration: 200ms;
				transition-property: box-shadow;
				white-space: nowrap;
				user-select: none;

				&:hover {
					box-shadow: ${loading ? "none" : "0px 0px 15px -10px #777777"};
				}

				&:after {
					position: absolute;
					display: block;
					content: "";
					bottom: 0;
					left: 0;
					width: 0;
					height: 3px;
					background-color: var(--color-green);
					transition-duration: 400ms;
					transition-property: width;
					transition-timing-function: ease-in-out;
				}

				&:hover:after {
					width: ${loading ? "0" : "100%"};
				}
			`}
		>
			{children}
		</button>
	);
}
