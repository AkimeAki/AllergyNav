"use client";

import { css } from "@kuma-ui/core";
import Link from "next/link";
import type { ReactNode } from "react";
import GoogleIcon from "@/components/atoms/GoogleIcon";

interface Props {
	href?: string;
	children: ReactNode;
	onClick?: () => void;
	active?: boolean;
	icon?: string;
}

export default function ({ href, onClick, children, active = false, icon = "pending" }: Props): JSX.Element {
	const style = [
		css`
			text-decoration: none;
			height: 48px;
			padding: 15px;
			display: block;
			transition-duration: 200ms;
			transition-property: filter;
			border: none;
			text-align: left;
			cursor: pointer;
			display: flex;
			align-items: center;
			font-weight: bold;
			user-select: none;

			span {
				color: inherit;
				font-weight: inherit;
			}

			@media (max-width: 880px) {
				display: flex;
				flex-direction: column;
				width: 100%;
				justify-content: center;
				height: 60px;
				padding: 15px 0;
				min-width: 80px;
				border-bottom-width: 4px;
				border-bottom-style: solid;

				span {
					font-size: 12px;
				}

				&:hover {
					@media (hover: hover) {
						background-color: var(--color-theme-thin);
					}
				}
			}

			&:hover {
				filter: brightness(1.03);
			}
		`,
		active
			? css`
					background-color: var(--color-theme);
					color: var(--color-secondary);

					&:hover {
						@media (hover: hover) {
							color: var(--color-secondary);
						}
					}

					@media (max-width: 880px) {
						background-color: transparent;
						border-bottom-color: var(--color-theme);
						color: var(--color-primary);

						&:hover {
							@media (hover: hover) {
								color: var(--color-primary);
							}
						}
					}
				`
			: css`
					background-color: var(--color-theme-thin);
					color: var(--color-primary);

					@media (max-width: 880px) {
						font-weight: normal;
						background-color: transparent;
						border-bottom-color: transparent;
					}
				`
	].join(" ");

	const iconStyle = css`
		display: none;
		color: inherit;

		@media (max-width: 880px) {
			display: block;
		}
	`;

	return (
		<>
			{href === undefined ? (
				<button
					onClick={() => {
						if (onClick !== undefined) {
							onClick();
						}
					}}
					className={style}
				>
					<div className={iconStyle}>
						<GoogleIcon name={icon} size={30} color="inherit" />
					</div>
					<span>{children}</span>
				</button>
			) : (
				<Link aria-label={String(children)} href={href} className={style}>
					<div className={iconStyle}>
						<GoogleIcon name={icon} size={30} color="inherit" />
					</div>
					<span>{children}</span>
				</Link>
			)}
		</>
	);
}
