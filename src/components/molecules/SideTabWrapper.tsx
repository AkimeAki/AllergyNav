"use client";

import { useEffect, type ReactNode, useRef, useState } from "react";
import { css } from "@kuma-ui/core";
import useScroll from "@/hooks/useScroll";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	const element = useRef<HTMLDivElement | null>(null);
	const { stopScroll, startScroll } = useScroll();
	const [, setTouchScrollX] = useState<number>(0);

	useEffect(() => {
		const scroll = (e: WheelEvent): void => {
			if (element.current !== null) {
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
			stopScroll();
		};

		const leave = (): void => {
			startScroll();
		};

		const touchStart = (): void => {
			stopScroll();
		};

		const touchEnd = (): void => {
			startScroll();
		};

		if (element.current !== null) {
			element.current.addEventListener("wheel", scroll, false);
			element.current.addEventListener("touchstart", touchStart, false);
			element.current.addEventListener("touchend", touchEnd, false);
			element.current.addEventListener("touchmove", move, false);
			element.current.addEventListener("mouseenter", enter, false);
			element.current.addEventListener("mouseleave", leave, false);
		}

		return () => {
			if (element.current !== null) {
				element.current.removeEventListener("wheel", scroll);
				element.current.removeEventListener("touchstart", touchStart);
				element.current.removeEventListener("touchend", touchEnd);
				element.current.removeEventListener("touchmove", move);
				element.current.removeEventListener("mouseenter", enter);
				element.current.removeEventListener("mouseleave", leave);
			}
		};
	}, []);

	return (
		<aside
			ref={element}
			className={css`
				display: flex;
				flex-direction: column;
				border-radius: 15px;
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
	);
}