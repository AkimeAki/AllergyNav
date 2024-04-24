"use client";

import { css } from "@kuma-ui/core";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import LoadingCircle from "@/components/atoms/LoadingCircle";

interface Props {
	href?: string;
	children: ReactNode;
	size?: "normal" | "small" | "tiny";
	onClick?: () => void;
	disabled?: boolean;
	disabledClick?: boolean;
	selected?: boolean;
	loading?: boolean;
	color?: string;
}
interface InnerProps {
	loading: boolean;
}

const ButtonInner = ({ loading }: InnerProps): JSX.Element => {
	return (
		<>
			{loading && (
				<div
					className={css`
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					`}
				>
					<LoadingCircle size={20} />
				</div>
			)}
		</>
	);
};

export default function ({
	href,
	children,
	size = "normal",
	onClick,
	disabled = false,
	disabledClick = false,
	selected = false,
	loading = false,
	color = "var(--color-theme)"
}: Props): JSX.Element {
	const buttonStyle = [
		css`
			position: relative;
			display: inline-block;
			text-decoration: none;
			cursor: pointer;
			background-color: var(--color-secondary);
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
				color: var(--color-secondary);

				* {
					color: var(--color-secondary);
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
				color: var(--color-secondary);

				* {
					background-color: var(--button-color);
					color: var(--color-secondary);
				}
			`,
		disabled &&
			css`
				border-color: var(--color-hide);
				color: var(--color-hide);
				user-select: none;
				cursor: not-allowed;
				background-color: var(--color-secondary);

				* {
					border-color: var(--color-hide);
					color: var(--color-hide);
				}

				&:hover {
					background-color: var(--color-secondary);
					color: var(--color-hide);
					box-shadow: none;

					* {
						box-shadow: none;
						color: var(--color-hide);
					}
				}
			`,
		loading &&
			css`
				cursor: progress;
			`
	].join(" ");

	const click = (): void => {
		if (onClick !== undefined) {
			if (!disabled || (disabled && disabledClick)) {
				onClick();
			}
		}
	};

	return (
		<>
			{href === undefined ? (
				<button
					type="button"
					onClick={() => {
						click();
					}}
					className={buttonStyle}
					// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
					style={{ "--button-color": color } as CSSProperties}
				>
					<ButtonInner loading={loading} />
					{children}
				</button>
			) : (
				<Link
					onClick={() => {
						click();
					}}
					href={href}
					className={buttonStyle}
					// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
					style={{ "--button-color": color } as CSSProperties}
				>
					<ButtonInner loading={loading} />
					{children}
				</Link>
			)}
		</>
	);
}
