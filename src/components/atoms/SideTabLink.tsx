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
			padding: 15px 15px;
			display: block;
			transition-duration: 200ms;
			transition-property: filter;
			border: none;
			text-align: left;
			cursor: pointer;
			display: flex;
			align-items: center;
			font-weight: bold;

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

				span {
					font-size: 13px;
				}
			}

			&:hover {
				filter: brightness(1.03);
			}
		`,
		active
			? css`
					background-color: var(--color-theme);
					color: var(--color-white);

					&:hover {
						background-color: var(--color-theme);
						color: var(--color-white);
					}
				`
			: css`
					background-color: var(--color-theme-thin);
					color: var(--color-black);

					@media (max-width: 880px) {
						font-weight: normal;
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
				<Link href={href} className={style}>
					<div className={iconStyle}>
						<GoogleIcon name={icon} size={30} color="inherit" />
					</div>
					<span>{children}</span>
				</Link>
			)}
		</>
	);
}
