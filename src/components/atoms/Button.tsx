/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { ReactNode } from "react";
import type { MouseEventHandler } from "react";

interface Props {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
}

export default function ({ onClick, children }: Props) {
	return (
		<button
			type="button"
			onClick={onClick}
			css={css`
				position: relative;
				cursor: pointer;
				padding: 15px 40px;
				background-color: var(--color-green);
				border: none;
				border-radius: 30px;
				font-weight: 700;
				overflow: hidden;
				transition-duration: 200ms;
				transition-property: box-shadow;
				white-space: nowrap;

				&:hover {
					box-shadow: 0px 0px 15px -10px #777777;
				}

				&:after {
					position: absolute;
					display: block;
					content: "";
					bottom: 0;
					left: 0;
					width: 0;
					height: 3px;
					background-color: var(--color-purple);
					transition-duration: 400ms;
					transition-property: width;
					transition-timing-function: ease-in-out;
				}

				&:hover:after {
					width: 100%;
				}
			`}
		>
			{children}
		</button>
	);
}
