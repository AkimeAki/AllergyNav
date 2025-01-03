"use client";

import { useEffect, type ReactNode, useRef, useState } from "react";
import { css } from "@kuma-ui/core";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import GoogleAds from "@/components/atoms/GoogleAds";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	const element = useRef<HTMLDivElement | null>(null);
	const [, setTouchScrollX] = useState<number>(0);
	const { isTouch } = useIsTouchDevice();
	const router = useRouter();
	const pathname = usePathname();
	const [enableScroll, setEnableScroll] = useState<boolean>(true);

	useEffect(() => {
		const scroll = (e: WheelEvent): void => {
			if (element.current !== null && !isTouch) {
				element.current.scrollBy({
					top: 0,
					left: e.deltaY / 5,
					behavior: "auto"
				});
			}
		};

		const move = (e: TouchEvent): void => {
			if (element.current !== null) {
				setTouchScrollX((oldX) => {
					element.current?.scrollBy({
						top: 0,
						left: oldX - e.changedTouches[0].pageX,
						behavior: "auto"
					});

					return e.changedTouches[0].pageX;
				});
			}
		};

		const enter = (): void => {
			const mediaQuery = window.matchMedia("(max-width: 880px)");
			if (mediaQuery.matches) {
				setEnableScroll(false);
			}
		};

		const leave = (): void => {
			const mediaQuery = window.matchMedia("(max-width: 880px)");
			if (mediaQuery.matches && !isTouch) {
				setEnableScroll(true);
			}
		};

		const touchStart = (e: TouchEvent): void => {
			setTouchScrollX(e.changedTouches[0].pageX);
			setEnableScroll(false);
		};

		const touchEnd = (): void => {
			setEnableScroll(true);
		};

		const click = (): void => {
			setEnableScroll(true);
		};

		if (element.current !== null) {
			element.current.addEventListener("click", click, false);
			element.current.addEventListener("wheel", scroll, false);
			element.current.addEventListener("touchstart", touchStart, false);
			element.current.addEventListener("touchend", touchEnd, false);
			element.current.addEventListener("touchmove", move, false);
			element.current.addEventListener("mouseenter", enter, false);
			element.current.addEventListener("mouseleave", leave, false);
		}

		return () => {
			if (element.current !== null) {
				element.current.removeEventListener("click", click);
				element.current.removeEventListener("wheel", scroll);
				element.current.removeEventListener("touchstart", touchStart);
				element.current.removeEventListener("touchend", touchEnd);
				element.current.removeEventListener("touchmove", move);
				element.current.removeEventListener("mouseenter", enter);
				element.current.removeEventListener("mouseleave", leave);
			}
		};
	}, [isTouch]);

	useEffect(() => {
		let touchX: number | null = null;
		let touchY: number | null = null;
		let overPercent = 0;
		let isMoving = false;
		let nextPath: null | string = null;
		let noSwipe = false;

		const move = (e: TouchEvent) => {
			if (isTouch && touchX !== null && touchY !== null) {
				const touch = e.touches[0];

				if (!isMoving && Math.abs(touchY - touch.clientY) > 50) {
					noSwipe = true;
				}

				if (document.body.dataset.swipeLoading === "true") {
					noSwipe = true;
				}

				if (!noSwipe && (Math.abs(touchX - touch.clientX) > 30 || isMoving)) {
					setEnableScroll(false);

					const sideTabContents = document.querySelector<HTMLDivElement>("#side-tab-contents");
					if (sideTabContents !== null && Array.isArray(children)) {
						if (!isMoving) {
							sideTabContents.style.transitionDuration = "0s";
						}

						isMoving = true;

						const childPaths: string[] = children.map((child) => {
							return child.props.href;
						});
						const currentIndex = childPaths.findIndex((path) => {
							return path === location.pathname;
						});

						if (touchX - touch.clientX > 0) {
							if (currentIndex !== childPaths.length - 1) {
								sideTabContents.style.transform = `translateX(${touch.clientX - touchX}px)`;
								nextPath = childPaths[currentIndex + 1];
							}
						} else {
							if (currentIndex !== 0) {
								sideTabContents.style.transform = `translateX(${touch.clientX - touchX}px)`;
								nextPath = childPaths[currentIndex - 1];
							}
						}
						overPercent = ((touch.clientX - touchX) / sideTabContents.offsetWidth) * 100;
					}
				}
			}
		};

		const start = (e: TouchEvent) => {
			isMoving = false;
			nextPath = null;
			noSwipe = false;
			overPercent = 0;
			if (isTouch) {
				const touch = e.touches[0];
				touchX = touch.clientX;
				touchY = touch.clientY;
			}
		};

		const end = () => {
			const sideTabContents = document.querySelector<HTMLDivElement>("#side-tab-contents");
			if (sideTabContents !== null) {
				if (isTouch && touchX !== null && touchY !== null && isMoving && nextPath !== null) {
					if (Math.abs(overPercent) > 30) {
						if (overPercent > 0) {
							sideTabContents.style.transform = "translateX(calc(100% + 30px))";
						} else {
							sideTabContents.style.transform = "translateX(calc(-100% - 30px))";
						}

						document.body.dataset.swipeLoading = "true";
						window.scroll({
							top: 0,
							behavior: "instant"
						});
						setTimeout(
							(nextPath) => {
								router.push(nextPath);
							},
							300,
							nextPath
						);
					} else {
						sideTabContents.style.transform = "";
					}

					sideTabContents.style.transitionDuration = "300ms";
					setTimeout(() => {
						sideTabContents.style.transitionDuration = "";
					}, 300);
				}
			}

			setEnableScroll(true);
			isMoving = false;
			touchX = null;
			touchY = null;
			noSwipe = false;
			nextPath = null;
			overPercent = 0;
		};

		document.addEventListener("touchmove", move);
		document.addEventListener("touchstart", start);
		document.addEventListener("touchend", end);

		return () => {
			document.removeEventListener("touchmove", move);
			document.removeEventListener("touchstart", start);
			document.removeEventListener("touchend", end);
		};
	}, [isTouch]);

	useEffect(() => {
		const sideTabContents = document.querySelector<HTMLDivElement>("#side-tab-contents");
		if (sideTabContents !== null) {
			sideTabContents.style.transform = "";
			sideTabContents.style.transitionDuration = "0s";
		}

		document.body.dataset.swipeLoading = "";
	}, [pathname]);

	useEffect(() => {
		const scroll = (e: Event) => {
			if (e.target instanceof HTMLElement) {
				if (!enableScroll) {
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
	}, [enableScroll]);

	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 30px;

				@media (max-width: 880px) {
					width: 100%;
					position: fixed;
					top: 60px;
					left: 0;
					z-index: 9999;
					overflow: hidden;
					background-color: var(--color-secondary);
				}
			`}
		>
			<aside
				ref={element}
				className={css`
					display: flex;
					flex-direction: column;
					border-radius: 4px;
					overflow: hidden;

					@media (max-width: 880px) {
						flex-direction: row;
						border-radius: 0;
						height: 60px;
						align-items: center;
						white-space: nowrap;
						border-bottom: 1px solid var(--color-primary-thin);
					}
				`}
			>
				{children}
			</aside>
			<div
				className={css`
					text-align: center;
					@media (max-width: 880px) {
						display: none;
					}
				`}
			>
				<GoogleAds
					slot="7661038914"
					style={css`
						width: 220px;
						height: 600px;
					`}
				/>
			</div>
		</div>
	);
}
