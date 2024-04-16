"use client";
import { css } from "@kuma-ui/core";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import ModalBackground from "@/components/atoms/ModalBackground";
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
					<ModalBackground />
					<div
						className={css`
							position: fixed;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							width: 100%;
							max-width: 800px;
							padding: 30px;
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

							@media (max-width: 880px) {
								padding: 0;
								max-width: 100%;
								height: 100%;
							}
						`}
					>
						<div
							className={css`
								background-color: var(--color-white);
								border-radius: 15px;
								padding: 20px;
								box-shadow: 0 0 20px -5px #969696;
								max-height: calc(100vh - 60px);
								overflow-y: auto;
								user-select: text;
								pointer-events: auto;

								@media (max-width: 880px) {
									border-radius: 0;
									height: 100%;
									max-height: 100%;
									padding-bottom: 80px;
								}
							`}
							ref={modalElement}
						>
							{children}
							<div
								className={css`
									position: fixed;
									top: 15px;
									right: 15px;
									font-size: 0;
									cursor: pointer;
									user-select: none;
									background-color: var(--color-theme);
									border-radius: 9999px;
									padding: 5px;

									@media (max-width: 880px) {
										top: auto;
										bottom: 20px;
										right: 20px;
									}
								`}
								onClick={() => {
									if (close) {
										setIsOpen(false);
									}
								}}
							>
								<GoogleIcon size={25} name="close" color="var(--color-white)" />
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
