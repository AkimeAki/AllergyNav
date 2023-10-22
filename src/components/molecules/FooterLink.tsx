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
			href={href}
			target="_blank"
			css={css`
				display: flex;
				align-items: center;
				justify-content: center;
				width: 50px;
				aspect-ratio: 1/1;
				font-size: 0;
				border-radius: 50%;
				background-color: white;
				transition-duration: 200ms;
				transition-property: box-shadow;

				&:hover {
					@media (hover: hover) {
						box-shadow: 0px 0px 15px -7px #777777;
					}
				}

				&:active {
					box-shadow: 0px 0px 15px -7px #777777;
				}
			`}
		>
			{children}
		</Link>
	);
}
