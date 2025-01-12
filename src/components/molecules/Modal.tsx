"use client";
import { css } from "@kuma-ui/core";
import { useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import { cx } from "@/libs/merge-kuma";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";

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
	const [isViewCloseButton, setIsViewCloseButton] = useState(false);
	const modalContentElement = useRef<HTMLDivElement>(null);
	const modalElement = useRef<HTMLDivElement>(null);
	const bgElement = useRef<HTMLDivElement>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { isTouch } = useIsTouchDevice();

	useEffect(() => {
		if (isOpen) {
			setIsModalOpen(isOpen);
		} else {
			setTimeout(() => {
				setIsModalOpen(isOpen);
			}, 200);
		}
	}, [isOpen]);

	// スクロール停止
	useEffect(() => {
		const scroll = (e: Event) => {
			if (e.target instanceof HTMLElement && bgElement.current !== null && modalElement.current !== null) {
				if (
					(bgElement.current.contains(e.target) ||
						modalElement.current.clientHeight === modalElement.current.scrollHeight) &&
					isModalOpen
				) {
					e.preventDefault();
				}
			}
		};

		window.addEventListener("touchmove", scroll, { passive: false });
		window.addEventListener("mousewheel", scroll, { passive: false });

		return () => {
			window.removeEventListener("touchmove", scroll);
			window.removeEventListener("mousewheel", scroll);
		};
	}, [isModalOpen]);

	// 戻るボタン検知用
	useEffect(() => {
		if (isModalOpen && isTouch && document.body.dataset.os === "android") {
			history.pushState(null, "", null);
		}

		const back = () => {
			if (isModalOpen && isTouch && document.body.dataset.os === "android") {
				setIsOpen(false);
				history.replaceState(null, "", null);
			}
		};

		window.addEventListener("popstate", back);

		return () => {
			window.removeEventListener("popstate", back);
		};
	}, [isModalOpen, isTouch]);

	// 要素が多い時だけ閉じるボタン表示
	useEffect(() => {
		const resize = () => {
			const mediaQuery = window.matchMedia("(max-width: 880px)");

			if (
				modalContentElement.current !== null &&
				(modalContentElement.current.clientHeight > 600 ||
					modalContentElement.current.clientHeight > window.innerHeight / 2) &&
				mediaQuery.matches
			) {
				setIsViewCloseButton(true);
			}
		};

		resize();
		window.addEventListener("resize", resize);

		return () => {
			window.removeEventListener("resize", resize);
		};
	}, [isModalOpen]);

	return (
		<>
			{isModalOpen && (
				<>
					<div
						onClick={() => {
							if (close) {
								if (onOutsideClick === undefined) {
									if (isTouch && document.body.dataset.os === "android") {
										history.back();
									} else {
										setIsOpen(false);
									}
								} else {
									onOutsideClick();
								}
							}
						}}
						ref={bgElement}
						className={cx(
							css`
								position: fixed;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								z-index: 1000000;
								opacity: 0;
								animation-name: modalBackgroundFadeIn;
								animation-iteration-count: 1;
								animation-duration: 200ms;
								animation-fill-mode: forwards;
								background-color: var(--color-modal-bg);

								@keyframes modalBackgroundFadeIn {
									0% {
										opacity: 0;
									}

									100% {
										opacity: 0.4;
									}
								}

								@keyframes modalBackgroundFadeOut {
									0% {
										opacity: 0.4;
									}

									100% {
										opacity: 0;
									}
								}
							`,
							!viewBg &&
								css`
									background-color: transparent;
								`,
							!isOpen &&
								css`
									animation-name: modalBackgroundFadeOut;
								`
						)}
					/>
					<div
						style={margin !== 0 ? { padding: 30 + margin + "px" } : undefined}
						className={cx(
							css`
								position: fixed;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								width: 100%;
								padding: 30px;
								max-width: 800px;
								z-index: 1000000;
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

								@keyframes modalFadeOut {
									0% {
										opacity: 1;
									}

									100% {
										opacity: 0;
									}
								}

								@keyframes modalSlideIn {
									0% {
										opacity: 1;
										top: 150%;
									}

									100% {
										opacity: 1;
										top: 50%;
									}
								}
								@keyframes modalSlideOut {
									0% {
										opacity: 1;
										top: 50%;
									}

									100% {
										opacity: 1;
										top: 150%;
									}
								}

								@media (max-width: 880px) {
									padding: 0 !important;
									max-width: 100%;
									height: 100%;
									display: flex;
									flex-direction: column;
									justify-content: flex-end;
									animation-name: modalSlideIn;
								}
							`,
							!isOpen &&
								css`
									animation-name: modalFadeOut;

									@media (max-width: 880px) {
										animation-name: modalSlideOut;
									}
								`
						)}
					>
						<div
							className={cx(
								css`
									background-color: var(--color-secondary);
									border-radius: 7px;
									padding: 20px;
									box-shadow: 0 0 20px -5px #969696;
									max-height: calc(100vh - 60px);
									overflow-y: auto;
									user-select: text;
									pointer-events: auto;
									overscroll-behavior: contain;

									@media (prefers-color-scheme: dark) {
										box-shadow: 0 0 20px -5px #000000;
									}

									@media (max-width: 880px) {
										border-radius: 0;
										border-top-left-radius: 30px;
										border-top-right-radius: 30px;
										max-height: 100%;
										padding: 20px 15px 15px;
									}
								`,
								isViewCloseButton &&
									css`
										@media (max-width: 880px) {
											padding-bottom: 80px;
										}
									`
							)}
							ref={modalElement}
						>
							<div ref={modalContentElement}>{children}</div>
							<div
								style={
									margin !== 0 ? { top: 15 + margin + "px", right: 15 + margin + "px" } : undefined
								}
								className={cx(
									css`
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
									`,
									!isViewCloseButton &&
										css`
											@media (max-width: 880px) {
												display: none;
											}
										`
								)}
								onClick={() => {
									if (close) {
										if (onOutsideClick === undefined) {
											if (isTouch && document.body.dataset.os === "android") {
												history.back();
											} else {
												setIsOpen(false);
											}
										} else {
											onOutsideClick();
										}
									}
								}}
							>
								<div
									className={css`
										display: block;
										font-size: 0;

										@media (max-width: 880px) {
											display: none;
										}
									`}
								>
									<GoogleIcon
										size={30}
										name={icon === "close" ? "close" : icon === "back" ? "arrow_back" : "close"}
										color="var(--color-secondary)"
									/>
								</div>
								<div
									className={css`
										display: none;
										font-size: 0;

										@media (max-width: 880px) {
											display: block;
										}
									`}
								>
									<GoogleIcon
										size={30}
										name={icon === "close" ? "close" : icon === "back" ? "arrow_back" : "close"}
										color="var(--color-secondary)"
									/>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
