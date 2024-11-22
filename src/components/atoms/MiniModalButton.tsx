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
			background-color: var(--color-secondary);
			color: var(--color-primary);
			border: none;
			font-weight: bold;
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
				background-color: var(--color-secondary);
				color: inherit;
			}

			&:hover {
				background-color: var(--color-theme-thin);
				color: var(--color-primary);

				* {
					background-color: inherit;
					color: inherit;
				}
			}
		`,
		disabled &&
			css`
				color: var(--color-hide);
				user-select: none;
				cursor: not-allowed;
				background-color: var(--color-secondary);

				* {
					background-color: inherit;
					color: inherit;
				}

				&:hover {
					background-color: var(--color-secondary);
					box-shadow: none;
					color: var(--color-hide);

					* {
						background-color: inherit;
						box-shadow: inherit;
						color: inherit;
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
						if (onClick !== undefined) {
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
					aria-label={String(children)}
					onClick={() => {
						if (onClick !== undefined) {
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
