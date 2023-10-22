/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

interface Props {
	children: ReactNode;
	href: string;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export default function ({ children, href, onClick }: Props): JSX.Element {
	return (
		<Link
			css={css`
				display: block;
				position: relative;
				text-decoration: none;
				padding: 15px 30px;
				font-weight: 600;
				overflow: hidden;
				transition-duration: 200ms;
				transition-property: background-color;
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
					background-color: #f3f3f3;
				}

				&:hover:after {
					width: 100%;
				}
			`}
			href={href}
			onClick={onClick}
		>
			{children}
		</Link>
	);
}
