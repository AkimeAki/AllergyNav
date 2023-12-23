"use client";

import { css } from "@kuma-ui/core";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

interface Props {
	href?: string;
	children: ReactNode;
	size?: "normal" | "small";
	onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
	disabled?: boolean;
}

export default function ({ href, children, size = "normal", onClick, disabled = false }: Props): JSX.Element {
	const buttonStyle = [
		css`
			display: inline-block;
			text-decoration: none;
			cursor: pointer;
			background-color: white;
			border-style: solid;
			border-color: var(--color-orange);
			color: var(--color-orange);
			border-width: 2px;
			border-radius: 30px;
			font-weight: 700;
			overflow: hidden;
			transition-duration: 200ms;
			transition-property: box-shadow, color, border-color;
			white-space: nowrap;
			user-select: none;
			text-align: center;

			&:hover {
				box-shadow: 0px 0px 15px -10px #777777;
			}
		`,
		size === "small"
			? css`
					padding: 10px 20px;
					font-size: 15px;
				`
			: css`
					padding: 12px 30px;
					font-size: 18px;
				`,
		disabled
			? css`
					border-color: var(--color-gray);
					color: var(--color-gray);
					user-select: none;
					cursor: default;

					&:hover {
						box-shadow: none;
					}
				`
			: ""
	].join(" ");

	return (
		<>
			{href === undefined ? (
				<button type="button" onClick={onClick} className={buttonStyle}>
					{children}
				</button>
			) : (
				<Link onClick={onClick} href={href} className={buttonStyle}>
					{children}
				</Link>
			)}
		</>
	);
}
