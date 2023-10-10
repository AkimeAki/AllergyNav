/** @jsxImportSource @emotion/react */
"use client";

import type { SerializedStyles } from "@emotion/react";
import { css } from "@emotion/react";
import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
	href: string;
	children: ReactNode;
	style?: SerializedStyles;
}

export default function ({ href, children, style = css`` }: Props): JSX.Element {
	return (
		<Link
			href={href}
			css={css`
				display: inline-block;
				text-decoration: none;
				position: relative;
				cursor: pointer;
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
					background-color: var(--color-green);
					transition-duration: 400ms;
					transition-property: width;
					transition-timing-function: ease-in-out;
				}

				&:hover:after {
					width: 100%;
				}

				${style}
			`}
		>
			{children}
		</Link>
	);
}
