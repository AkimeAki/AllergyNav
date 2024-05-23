"use client";

import { css } from "@kuma-ui/core";
import type { Dispatch, SetStateAction } from "react";

interface Props {
	isSidebarOpen: boolean;
	setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ isSidebarOpen, setIsSidebarOpen }: Props): JSX.Element {
	return (
		<>
			<div
				className={css`
					position: fixed;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 100%;
					max-width: 1400px;
					padding: 40px;
					pointer-events: none;
					user-select: none;
					z-index: 9999;

					@media screen and (max-width: 600px) {
						padding: 20px;
					}
				`}
			>
				<button
					area-label="ナビボタン"
					onClick={() => {
						setIsSidebarOpen((status) => {
							return !status;
						});
					}}
					className={[
						css`
							position: relative;
							width: 60px;
							height: 60px;
							border-radius: 50%;
							border: none;
							overflow: hidden;
							backdrop-filter: blur(2px);
							background-color: transparent;
							cursor: pointer;
							box-shadow: 0 0 1px 2.5px var(--color-theme);
							pointer-events: auto;
							user-select: auto;

							&:before {
								display: block;
								content: "";
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								width: calc(100% + 40px);
								height: calc(100% + 40px);
								user-select: none;
								pointer-events: none;
								background-color: var(--color-theme-thin);
								transition-duration: 200ms;
								transition-property: opacity;
							}
							@media (hover: hover) {
								&:hover {
									&:before {
										opacity: 1;
									}
								}
							}
						`,
						isSidebarOpen
							? css`
									&:before {
										opacity: 1;
									}
								`
							: css`
									&:before {
										opacity: 0.5;
									}
								`
					].join(" ")}
				>
					<div
						className={[
							css`
								position: absolute;
								content: "";
								display: block;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								width: 50%;
								height: 100%;

								div {
									position: absolute;
									content: "";
									display: block;
									background-color: var(--color-primary);
									transition-duration: 200ms;
									transition-property: top, width, transform, height;
								}
							`,
							isSidebarOpen
								? css`
										div {
											height: 2px;
										}
									`
								: css`
										div {
											height: 1px;
										}
									`
						].join(" ")}
					>
						<div
							className={[
								css`
									left: 0;
									width: 100%;
								`,
								isSidebarOpen
									? css`
											top: 50%;
											transform: translateY(-50%) rotate(45deg);
										`
									: css`
											top: calc(50% - 7px);
											transform: translateY(-50%) rotate(0deg);
										`
							].join(" ")}
						/>
						<div
							className={[
								css`
									left: 0;
								`,
								isSidebarOpen
									? css`
											top: 50%;
											transform: translateY(-50%) rotate(-45deg);
											width: 100%;
										`
									: css`
											top: calc(50% + 7px);
											transform: translateY(-50%) rotate(0deg);
											width: 60%;
										`
							].join(" ")}
						/>
					</div>
				</button>
			</div>
		</>
	);
}
