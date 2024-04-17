"use client";

import { css } from "@kuma-ui/core";
import Link from "next/link";
import type { ReactNode } from "react";
import LoadingCircle from "@/components/atoms/LoadingCircle";

interface Props {
	href?: string;
	children: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	loading?: boolean;
}

export default function ({ href, children, onClick, disabled = false, loading = false }: Props): JSX.Element {
	const buttonStyle = [
		css`
			position: relative;
			display: block;
			text-decoration: none;
			cursor: pointer;
			background-color: var(--color-white);
			color: var(--color-black);
			border: none;
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
				background-color: var(--color-white);
				color: inherit;
			}

			&:hover {
				background-color: var(--color-theme-thin);
				color: var(--color-black);

				* {
					background-color: inherit;
					color: inherit;
				}
			}
		`,
		disabled &&
			css`
				color: var(--color-gray);
				user-select: none;
				cursor: not-allowed;
				background-color: var(--color-white);

				* {
					background-color: inherit;
					color: inherit;
				}

				&:hover {
					background-color: var(--color-black);
					box-shadow: none;

					* {
						background-color: inherit;
						box-shadow: none;
						color: var(--color-gray);
					}
				}
			`
	].join(" ");

	const loadingStyle = css`
		position: absolute;
		top: 50%;
		left: 7px;
		transform: translateY(-50%);
	`;

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
				>
					{loading && (
						<div className={loadingStyle}>
							<LoadingCircle size={20} />
						</div>
					)}
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
				>
					{loading && (
						<div className={loadingStyle}>
							<LoadingCircle size={20} />
						</div>
					)}
					{children}
				</Link>
			)}
		</>
	);
}
