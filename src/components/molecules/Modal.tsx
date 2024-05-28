"use client";
import { css } from "@kuma-ui/core";
import { useEffect, type Dispatch, type ReactNode, type SetStateAction } from "react";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import ModalBackground from "@/components/atoms/ModalBackground";
import useClickElemenetSet from "@/hooks/useClickElemenetSet";

interface Props {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
	close?: boolean;
	viewBg?: boolean;
	margin?: number;
	icon?: "close" | "back";
	onOutsideClick?: () => void;
}

export default function ({
	isOpen,
	setIsOpen,
	children,
	close = true,
	viewBg = true,
	margin = 0,
	icon = "close",
	onOutsideClick
}: Props): JSX.Element {
	const modalElement = useClickElemenetSet<HTMLDivElement>(() => {
		if (close) {
			if (onOutsideClick === undefined) {
				setIsOpen(false);
			} else {
				onOutsideClick();
			}
		}
	}, [isOpen, close, onOutsideClick]);

	useEffect(() => {
		const html = document.querySelector<HTMLHtmlElement>("html");

		if (isOpen) {
			const scrollTop = html?.scrollTop ?? 0;
			document.body.dataset.scrollY = String(scrollTop);
			document.body.style.overflowY = "hidden";
			document.body.style.marginTop = String(-1 * scrollTop + "px");
		} else {
			document.body.style.overflowY = "";
			document.body.style.marginTop = "";

			if (document.body.dataset.scrollY !== undefined && document.body.dataset.scrollY !== "") {
				html?.scrollTo(0, Number(document.body.dataset.scrollY));
			}
		}
	}, [isOpen]);

	return (
		<>
			{isOpen && (
				<>
					{viewBg && <ModalBackground />}
					<div
						style={margin !== 0 ? { padding: 30 + margin + "px" } : undefined}
						className={css`
							position: fixed;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							width: 100%;
							padding: 30px;
							max-width: 800px;
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
								padding: 0 !important;
								max-width: 100%;
								height: 100%;
							}
						`}
					>
						<div
							className={css`
								background-color: var(--color-secondary);
								border-radius: 15px;
								padding: 20px;
								box-shadow: 0 0 20px -5px #969696;
								max-height: calc(100vh - 60px);
								overflow-y: auto;
								overflow-x: hidden;
								overscroll-behavior: contain;
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
								style={
									margin !== 0 ? { top: 15 + margin + "px", right: 15 + margin + "px" } : undefined
								}
								className={css`
									position: fixed;
									font-size: 0;
									top: 15px;
									right: 15px;
									cursor: pointer;
									user-select: none;
									background-color: var(--color-theme);
									border-radius: 9999px;
									padding: 5px;

									@media (max-width: 880px) {
										top: auto !important;
										bottom: 20px;
										right: 20px !important;
									}
								`}
								onClick={() => {
									if (close) {
										if (onOutsideClick === undefined) {
											setIsOpen(false);
										} else {
											onOutsideClick();
										}
									}
								}}
							>
								<GoogleIcon
									size={25}
									name={icon === "close" ? "close" : icon === "back" ? "arrow_back" : "close"}
									color="var(--color-secondary)"
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
