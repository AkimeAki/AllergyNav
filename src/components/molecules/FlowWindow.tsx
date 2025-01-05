"use client";
import { css } from "@kuma-ui/core";
import { MutableRefObject, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import useClickElemenetSet from "@/hooks/useClickElemenetSet";

interface Props {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
	targetElement: MutableRefObject<HTMLDivElement | null>["current"];
	title?: string;
	minWidth?: number;
}

export default function ({ isOpen, setIsOpen, children, targetElement, title, minWidth = 400 }: Props): JSX.Element {
	const [top, setTop] = useState<number>(0);
	const [left, setLeft] = useState<number>(0);
	const [width, setWidth] = useState<number | undefined>(undefined);

	const modalElement = useClickElemenetSet<HTMLDivElement>(
		(e) => {
			e.preventDefault();
			setIsOpen(false);
		},
		[isOpen]
	);

	const setModalPosition = () => {
		if (targetElement !== null && modalElement.current !== null) {
			const targetRect = targetElement.getBoundingClientRect();
			if (targetRect.top === 0) {
				setIsOpen(false);
			}

			const top = targetRect.top + targetRect.height + 3;
			let left = targetRect.left;

			if (minWidth > document.body.clientWidth - 10) {
				left = 5;
				setWidth(document.body.clientWidth - 10);
			} else if (left + minWidth > document.body.clientWidth) {
				const diff = left + minWidth - document.body.clientWidth + 5;
				left -= diff;
				setWidth(undefined);
			}

			setTop(top);
			setLeft(left);
		}
	};

	useEffect(() => {
		const move = () => {
			setModalPosition();
		};

		if (isOpen) {
			window.addEventListener("scroll", move);
			window.addEventListener("resize", move);
		}

		return () => {
			window.removeEventListener("scroll", move);
			window.removeEventListener("resize", move);
		};
	}, [isOpen, targetElement]);

	useEffect(() => {
		setModalPosition();
	}, [isOpen, targetElement]);

	return (
		<>
			{isOpen && (
				<>
					<div
						className={css`
							position: fixed;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							z-index: 1000;
							display: none;

							@media (max-width: 880px) {
								display: block;
							}
						`}
					/>
					<div
						style={{
							top: `${top}px`,
							left: `${left}px`,
							minWidth: width === undefined ? `${minWidth}px` : `${width}px`,
							maxWidth: width === undefined ? undefined : `${width}px`,
							width: width === undefined ? undefined : `${width}px`
						}}
						className={css`
							position: fixed;
							display: flex;
							flex-direction: column;
							gap: 10px;
							z-index: 1000;
							max-height: 300px;
							height: 100%;
							background-color: var(--color-secondary);
							border-radius: 4px;
							box-shadow: 0 0 4px -1px #a7a7a7;
							border: 1px solid #a7a7a7;
							overflow-y: auto;
							padding: 10px;
							opacity: 0;
							animation-name: small-modal-show;
							animation-iteration-count: 1;
							animation-fill-mode: forwards;
							animation-delay: 50ms;

							@keyframes small-modal-show {
								100% {
									opacity: 1;
								}
							}
						`}
						ref={modalElement}
					>
						<h3
							className={css`
								font-size: 15px;
								font-weight: bold;
								user-select: none;
							`}
						>
							{title}
						</h3>
						<div>{children}</div>
					</div>
				</>
			)}
		</>
	);
}
