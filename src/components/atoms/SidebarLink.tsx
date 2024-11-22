import { css } from "@kuma-ui/core";
import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
	href?: string;
	onClick?: () => void;
	children: ReactNode;
	active?: boolean;
}

export default function ({ href, onClick, children, active = false }: Props): JSX.Element {
	const style = [
		css`
			text-decoration: none;
			height: 100%;
			padding: 13px 15px;
			display: block;
			border-radius: 9999px;
			font-weight: bold;
			transition-duration: 200ms;
			transition-property: background-color;
			border: none;
			text-align: left;

			&:hover {
				background-color: var(--color-theme-thin);
				cursor: pointer;
			}
		`,
		active
			? css`
					background-color: var(--color-theme);
					color: var(--color-secondary);

					&:hover {
						background-color: var(--color-theme);
						color: var(--color-secondary);
					}
				`
			: css`
					background-color: transparent;
					color: var(--color-primary);
				`
	].join(" ");

	return (
		<>
			{href !== undefined ? (
				<Link
					aria-label={String(children)}
					href={href}
					onClick={() => {
						if (onClick !== undefined) {
							onClick();
						}
					}}
					className={style}
				>
					{children}
				</Link>
			) : (
				<button
					type="button"
					onClick={() => {
						if (onClick !== undefined) {
							onClick();
						}
					}}
					className={style}
				>
					{children}
				</button>
			)}
		</>
	);
}
