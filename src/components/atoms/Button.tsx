"use client";

import { css } from "@kuma-ui/core";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

interface Props {
	href?: string;
	children: ReactNode;
	size?: "normal" | "small" | "tiny";
	onClick?: () => void;
	disabled?: boolean;
	selected?: boolean;
	color?: string;
}

export default function ({
	href,
	children,
	size = "normal",
	onClick,
	disabled = false,
	selected = false,
	color = "var(--color-theme)"
}: Props): JSX.Element {
	const buttonStyle = [
		css`
			display: inline-block;
			text-decoration: none;
			cursor: pointer;
			background-color: var(--color-white);
			border-style: solid;
			border-color: var(--button-color);
			color: var(--button-color);
			border-width: 2px;
			border-radius: 30px;
			font-weight: 700;
			overflow: hidden;
			transition-duration: 200ms;
			transition-property: color, border-color, background-color;
			white-space: nowrap;
			user-select: none;
			text-align: center;
			padding: 12px 30px;
			font-size: 18px;

			* {
				transition-duration: 200ms;
				transition-property: color, border-color, background-color;
				color: var(--button-color);
			}

			&:hover {
				background-color: var(--button-color);
				color: var(--color-white);

				* {
					color: var(--color-white);
				}
			}
		`,
		size === "small" &&
			css`
				padding: 10px 20px;
				font-size: 15px;

				* {
					font-size: 15px;
				}
			`,
		size === "tiny" &&
			css`
				padding: 3px 5px;
				font-size: 13px;

				* {
					font-size: 13px;
				}
			`,
		selected &&
			css`
				background-color: var(--button-color);
				color: var(--color-white);

				* {
					background-color: var(--button-color);
					color: var(--color-white);
				}
			`,
		disabled
			? css`
					border-color: var(--color-gray);
					color: var(--color-gray);
					user-select: none;
					cursor: not-allowed;
					background-color: var(--color-white);

					* {
						border-color: var(--color-gray);
						color: var(--color-gray);
					}

					&:hover {
						background-color: var(--color-white);
						color: var(--color-gray);
						box-shadow: none;

						* {
							box-shadow: none;
							color: var(--color-gray);
						}
					}
				`
			: ""
	].join(" ");

	return (
		<>
			{href === undefined ? (
				<button
					type="button"
					onClick={() => {
						if (!disabled && onClick !== undefined) {
							onClick();
						}
					}}
					className={buttonStyle}
					// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
					style={{ "--button-color": color } as CSSProperties}
				>
					{children}
				</button>
			) : (
				<Link
					onClick={() => {
						if (!disabled && onClick !== undefined) {
							onClick();
						}
					}}
					href={href}
					className={buttonStyle}
					// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
					style={{ "--button-color": color } as CSSProperties}
				>
					{children}
				</Link>
			)}
		</>
	);
}
