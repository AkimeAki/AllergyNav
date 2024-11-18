"use client";

import { useEffect, type ReactNode, useRef, useState } from "react";
import { css } from "@kuma-ui/core";
import useScroll from "@/hooks/useScroll";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import GoogleAds from "@/components/atoms/GoogleAds";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	const element = useRef<HTMLDivElement | null>(null);
	const { stopScroll, startScroll } = useScroll();
	const [, setTouchScrollX] = useState<number>(0);
	const { isTouch } = useIsTouchDevice();

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
				stopScroll();
			}
		};

		const leave = (): void => {
			const mediaQuery = window.matchMedia("(max-width: 880px)");
			if (mediaQuery.matches && !isTouch) {
				startScroll();
			}
		};

		const touchStart = (e: TouchEvent): void => {
			setTouchScrollX(e.changedTouches[0].pageX);
			stopScroll();
		};

		const touchEnd = (): void => {
			startScroll();
		};

		const click = (): void => {
			startScroll();
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

	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 30px;

				@media (max-width: 880px) {
					width: calc(100% + 60px);
					margin-left: -30px;
					position: sticky;
					top: 0;
					z-index: 9999;
					overflow: hidden;
				}

				@media (max-width: 800px) {
					width: calc(100% + 20px);
					margin-left: -10px;
				}
			`}
		>
			<aside
				ref={element}
				className={css`
					display: flex;
					flex-direction: column;
					border-radius: 7px;
					overflow: hidden;

					@media (max-width: 880px) {
						flex-direction: row;
						border-radius: 0;
						height: 60px;
						align-items: center;
						white-space: nowrap;
						border-bottom: 1px solid var(--color-hide);
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
