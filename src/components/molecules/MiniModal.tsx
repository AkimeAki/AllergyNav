"use client";
import { css } from "@kuma-ui/core";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import useClickElemenetSet from "@/hooks/useClickElemenetSet";

interface Props {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
	close?: boolean;
}

export default function ({ isOpen, setIsOpen, children, close = true }: Props): JSX.Element {
	const modalElement = useClickElemenetSet<HTMLDivElement>(() => {
		if (close) {
			setIsOpen(false);
		}
	}, [isOpen, close]);

	return (
		<>
			{isOpen && (
				<>
					<div
						className={css`
							position: absolute;
							top: 0;
							right: 0;
							z-index: 99999;
							user-select: none;
							pointer-events: none;
							opacity: 0;
							animation-name: modalFadeIn;
							animation-iteration-count: 1;
							animation-duration: 200ms;
							animation-fill-mode: forwards;

							@keyframes modalFadeIn {
								0% {
									opacity: 0;
								}

								100% {
									opacity: 1;
								}
							}
						`}
					>
						<div
							className={css`
								background-color: var(--color-white);
								border-radius: 5px;
								box-shadow: 0 0 20px -5px #969696;
								max-height: calc(100vh - 60px);
								overflow-y: auto;
								user-select: text;
								pointer-events: auto;
							`}
							ref={modalElement}
						>
							{children}
						</div>
					</div>
				</>
			)}
		</>
	);
}
