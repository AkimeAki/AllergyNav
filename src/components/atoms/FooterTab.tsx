/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import GoogleIcon from "@/components/atoms/GoogleIcon";

interface Props {
	children: ReactNode;
	href: string;
	icon: string;
}

export default function ({ children, href, icon }: Props): JSX.Element {
	return (
		<Link
			css={css`
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: relative;
				text-decoration: none;
				font-weight: 600;
				overflow: hidden;
				user-select: none;
				height: 100%;
			`}
			href={href}
		>
			<GoogleIcon name={icon} size={30} color="var(--color-black)" />
			<div
				css={css`
					font-weight: 700;
					font-size: 14px;
				`}
			>
				{children}
			</div>
		</Link>
	);
}
