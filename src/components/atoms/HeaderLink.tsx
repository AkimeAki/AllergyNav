/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	href: string;
}

export default function ({ children, href }: Props): JSX.Element {
	return (
		<Link
			css={css`
				display: block;
				position: relative;
				background-color: white;
				text-decoration: none;
				padding: 12px 30px;
				font-weight: 600;
				border-radius: 30px;
				overflow: hidden;
				transition-duration: 200ms;
				transition-property: box-shadow;
				user-select: none;

				&:after {
					content: "";
					display: block;
					position: absolute;
					bottom: 0;
					left: 0;
					width: 0;
					height: 3px;
					background-color: var(--color-green);
					transition-duration: 400ms;
					transition-property: width;
					transition-timing-function: ease-in-out;
				}

				&:hover {
					box-shadow: 0px 0px 15px -7px #777777;
				}

				&:hover:after {
					width: 100%;
				}
			`}
			href={href}
		>
			{children}
		</Link>
	);
}
