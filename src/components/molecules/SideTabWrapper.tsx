"use client";

import { useEffect, type ReactNode, useRef, useState } from "react";
import { css } from "@kuma-ui/core";
import useScroll from "@/hooks/useScroll";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import { usePathname } from "next/navigation";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	const element = useRef<HTMLDivElement | null>(null);
	const { stopScroll, startScroll } = useScroll();
	const [, setTouchScrollX] = useState<number>(0);
	const { isTouch } = useIsTouchDevice();
	const pathname = usePathname();

	useEffect(() => {
		const scroll = (e: WheelEvent): void => {
			if (element.current !== null && !isTouch) {
				element.current.scrollBy({
					top: 0,
					left: e.deltaY / 5,
					behavior: "instant"
				});
			}
		};

		const move = (e: TouchEvent): void => {
			if (element.current !== null) {
				setTouchScrollX((oldX) => {
					element.current?.scrollBy({
						top: 0,
						left: oldX - e.changedTouches[0].pageX,
						behavior: "instant"
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
						position: fixed;
						z-index: 9999;
						bottom: 40px;
						right: 15px;
						height: 60px;
						width: calc(100% - 130px);
						align-items: center;
						white-space: nowrap;
						box-shadow: 0 0 10px -5px #969696;
						border: 2px solid #797979;
					}

					@media (max-width: 600px) {
						bottom: 20px;
						width: calc(100% - 110px);
					}
				`}
			>
				{children}
			</aside>
			<div
				key={pathname}
				className={css`
					* {
						width: 100% !important;
						max-height: 600px !important;
					}

					@media (max-width: 880px) {
						display: none;
					}
				`}
			>
				<ins
					className="adsbygoogle"
					style={{ display: "block" }}
					data-ad-client="ca-pub-6914867149724943"
					data-ad-slot="7661038914"
					data-ad-format="auto"
					data-full-width-responsive="true"
				/>
			</div>
		</div>
	);
}
