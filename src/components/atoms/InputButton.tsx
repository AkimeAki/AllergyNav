"use client";

import { Dispatch, forwardRef, ReactNode, SetStateAction } from "react";
import { css } from "@kuma-ui/core";
import { cx } from "@/libs/merge-kuma";

interface Props {
	children: ReactNode;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	focus?: boolean;
}

export default forwardRef<HTMLDivElement, Props>(({ children, isOpen, setIsOpen, focus = false }: Props, ref) => {
	return (
		<div
			onClick={() => {
				if (!isOpen) {
					setIsOpen(true);
				}
			}}
			ref={ref}
			className={cx(
				css`
					border: 1px solid #a7a7a7;
					border-radius: 4px;
					font-size: 14px;
					padding: 7px 15px;
					height: 40px;
					background-color: var(--color-secondary);
					color: var(--color-primary);
					display: flex;
					align-items: center;
					cursor: pointer;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;

					@media (max-width: 500px) {
						font-size: 12px;
					}
				`,
				focus &&
					css`
						position: relative;
						outline: 2px solid var(--color-theme);
						outline-offset: -1px;
					`
			)}
		>
			{children}
		</div>
	);
});
