"use client";

import { useEffect, type ReactNode, useRef, useState } from "react";
import { css } from "@kuma-ui/core";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import GoogleAds from "@/components/atoms/GoogleAds";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	const element = useRef<HTMLDivElement | null>(null);
	const [, setTouchScrollX] = useState<number>(0);
	const { isTouch } = useIsTouchDevice();

	useEffect(() => {
		const scroll = (e: WheelEvent): void => {
			if (element.current !== null && !isTouch) {
				const mediaQuery = window.matchMedia("(max-width: 880px)");
				if (mediaQuery.matches) {
					e.preventDefault();
				}

				element.current.scrollBy({
					top: 0,
					left: e.deltaY / 5,
					behavior: "instant"
				});
			}
		};

		const move = (e: TouchEvent): void => {
			e.preventDefault();
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

		if (element.current !== null) {
			element.current.addEventListener("wheel", scroll);
			element.current.addEventListener("touchmove", move);
		}

		return () => {
			if (element.current !== null) {
				element.current.removeEventListener("wheel", scroll);
				element.current.removeEventListener("touchmove", move);
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
