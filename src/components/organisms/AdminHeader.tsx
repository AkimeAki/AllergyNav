/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import Image from "next/image";
import SidebarLink from "@/components/molecules/SidebarLink";
import { useEffect, useState } from "react";
import { headerHeight } from "@/definition";

const hamburgerHeight = 35;
const hamburgerTop = (headerHeight - hamburgerHeight) / 2;

export default function (): JSX.Element {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
	const [sidebarOpenFix, setSidebarOpenFix] = useState<boolean>(true);

	useEffect(() => {
		const setSidebarStatus = (): void => {
			const mediaQuery = window.matchMedia("(max-width: 1000px)");
			if (mediaQuery.matches) {
				setSidebarOpen(false);
				setSidebarOpenFix(false);
			} else {
				setSidebarOpen(true);
				setSidebarOpenFix(true);
			}
		};

		addEventListener("resize", setSidebarStatus, false);
		setSidebarStatus();
	}, []);

	return (
		<>
			<header
				css={css`
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					background-color: var(--color-orange);
					height: ${headerHeight}px;
					color: white;
					box-shadow: 0px 0px 15px -7px #000000;
					z-index: ${sidebarOpenFix ? 2147483647 : 99999};
					padding: 0 30px;

					@media (max-width: 1000px) {
						padding-left: 80px;
					}
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 100%;
						max-width: 1200px;
						margin: 0 auto;
						height: 100%;
					`}
				>
					<h1
						css={css`
							height: 100%;
						`}
					>
						<Link
							href="/admin"
							css={css`
								display: flex;
								align-items: center;
								text-decoration: none;
								height: 100%;
								gap: 10px;
							`}
						>
							<Image
								src="/icons/allergy-nav.png"
								alt="アイコン"
								width={340}
								height={250}
								css={css`
									aspect-ratio: 340/250;
									width: 50px;
									font-size: 20px;
									height: auto;
								`}
							/>
							<div
								css={css`
									font-weight: 700;
									color: white;
								`}
							>
								管理画面
							</div>
						</Link>
					</h1>
					<div></div>
				</div>
			</header>
			<div
				onClick={() => {
					setSidebarOpen((status) => {
						return !status;
					});
				}}
				css={css`
					position: fixed;
					top: ${hamburgerTop}px;
					left: 20px;
					width: 40px;
					height: ${hamburgerHeight}px;
					z-index: 2147483647;
					cursor: pointer;
					display: none;

					@media (max-width: 1000px) {
						display: block;
					}

					div {
						position: absolute;
						width: 100%;
						height: 10px;
						border-radius: 10px;
						border-width: 3px;
						border-style: solid;
						border-color: white;
						transition-duration: 200ms;
						transition-property: transform, top, bottom;
					}
				`}
			>
				<div
					css={css`
						top: ${sidebarOpen ? 50 : 0}%;
						background-color: var(--color-orange);
						transform: translateY(${sidebarOpen ? -50 : 0}%) rotate(${sidebarOpen ? 45 : 0}deg);
						z-index: 1;
					`}
				/>
				<div
					css={css`
						top: 50%;
						background-color: var(--color-black);
						transform: translateY(-50%) scale(${sidebarOpen ? 0 : 1});
					`}
				/>
				<div
					css={css`
						bottom: ${sidebarOpen ? 50 : 0}%;
						background-color: var(--color-green);
						transform: translateY(${sidebarOpen ? 50 : 0}%) rotate(${sidebarOpen ? -45 : 0}deg);
					`}
				/>
			</div>
			<aside
				css={css`
					position: fixed;
					top: 0;
					left: 0;
					width: 300px;
					height: 100%;
					box-shadow: 0px 0px 15px -7px #000000;
					background-color: white;
					z-index: 2147483646;
					overflow-y: scroll;
					transform: translateX(${sidebarOpen || sidebarOpenFix ? "0" : "calc(-100% - 20px)"});
					transition-duration: 300ms;
					transition-property: transform;

					@media (max-width: 1000px) {
						display: block;
					}
				`}
			>
				<div
					css={css`
						padding-top: ${headerHeight + 10}px;
					`}
				>
					<SidebarLink
						href="/admin"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						トップ
					</SidebarLink>
					<SidebarLink
						href="/history"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						変更履歴
					</SidebarLink>
					<SidebarLink
						href="/block"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						ブロックリスト
					</SidebarLink>
					<SidebarLink
						href="/block"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						申請
					</SidebarLink>
					<SidebarLink
						href="/"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						アレルギーナビ
					</SidebarLink>
				</div>
			</aside>
			<div
				onClick={() => {
					setSidebarOpen(false);
				}}
				css={css`
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, 0.7);
					z-index: 2147483645;
					opacity: ${sidebarOpen && !sidebarOpenFix ? 1 : 0};
					user-select: ${sidebarOpen && !sidebarOpenFix ? "auto" : "none"};
					pointer-events: ${sidebarOpen && !sidebarOpenFix ? "auto" : "none"};
				`}
			/>
		</>
	);
}
