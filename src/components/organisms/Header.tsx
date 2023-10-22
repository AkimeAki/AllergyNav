/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import HeaderLink from "@/components/molecules/HeaderLink";
import Image from "next/image";
import FooterLink from "@/components/molecules/FooterLink";
import SvgImage from "@/components/atoms/SvgImage";
import SidebarLink from "@/components/molecules/SidebarLink";
import { useEffect, useState } from "react";
import FooterTab from "@/components/atoms/FooterTab";
import { headerHeight, viewSidebarWidth } from "@/definition";
import HeaderUserNav from "@/components/molecules/HeaderUserNav";

const hamburgerHeight = 35;
const hamburgerTop = (headerHeight - hamburgerHeight) / 2;

export default function (): JSX.Element {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

	useEffect(() => {
		addEventListener(
			"resize",
			() => {
				const mediaQuery = window.matchMedia(`(max-width: ${viewSidebarWidth}px)`);
				if (!mediaQuery.matches) {
					setSidebarOpen(false);
				}
			},
			false
		);
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
					z-index: 99999;
					padding: 0 30px;

					@media (max-width: ${viewSidebarWidth}px) {
						padding-left: 80px;
					}
				`}
			>
				<div
					css={css`
						display: flex;
						position: relative;
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
							href="/"
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
								アレルギーナビ{" "}
								<span
									css={css`
										font-weight: 700;
										color: white;

										@media (max-width: 430px) {
											display: none;
										}
									`}
								>
									超β版
								</span>
							</div>
						</Link>
					</h1>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 20px;
						`}
					>
						<div
							css={css`
								@media (max-width: ${viewSidebarWidth}px) {
									display: none;
								}
							`}
						>
							<HeaderLink href="/chain">チェーン店一覧</HeaderLink>
						</div>
						<div
							css={css`
								@media (max-width: ${viewSidebarWidth}px) {
									display: none;
								}
							`}
						>
							<HeaderLink href="/store">お店一覧</HeaderLink>
						</div>
						<HeaderUserNav />
					</div>
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

					@media (max-width: ${viewSidebarWidth}px) {
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
					display: none;
					z-index: 2147483646;
					overflow-y: scroll;
					transform: translateX(${sidebarOpen ? "0" : "calc(-100% - 20px)"});
					transition-duration: 300ms;
					transition-property: transform;

					@media (max-width: ${viewSidebarWidth}px) {
						display: block;
					}
				`}
			>
				<div
					css={css`
						padding-top: ${headerHeight}px;
						min-height: calc(100% - 150px);
					`}
				>
					<SidebarLink
						href="/"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						トップ
					</SidebarLink>
					<SidebarLink
						href="/store"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						お店一覧
					</SidebarLink>
					<SidebarLink
						href="/store/add"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						お店を追加
					</SidebarLink>
					<SidebarLink
						href="/chain"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						チェーン店一覧
					</SidebarLink>
					<SidebarLink
						href="/chain/add"
						onClick={() => {
							setSidebarOpen(false);
						}}
					>
						チェーン店を追加
					</SidebarLink>
				</div>
				<footer
					css={css`
						display: flex;
						flex-direction: column;
						align-items: cneter;
						justify-content: center;
						background-color: var(--color-green);
						height: 150px;
						color: white;
						gap: 20px;
					`}
				>
					<div
						css={css`
							display: inline-block;
							font-weight: 700;
							text-align: center;
						`}
					>
						&copy; 彩季
					</div>
					<div
						css={css`
							display: flex;
							justify-content: center;
							text-align: center;
							gap: 20px;
						`}
					>
						<FooterLink href="https://twitter.com/Akime_Aki">
							<SvgImage src={"/logo/x.svg"} size="20px" color="var(--color-black)" />
						</FooterLink>
						<FooterLink href="https://twitter.com/Akime_Aki">
							<div
								css={css`
									transform: translate(1px, 0px);
									font-size: 0;
								`}
							>
								<SvgImage src={"/logo/twitter.svg"} size="25px" color="var(--color-black)" />
							</div>
						</FooterLink>
						<FooterLink href="https://github.com/AkimeAki/AllergyNav">
							<div
								css={css`
									transform: translate(0px, -1px);
									font-size: 0;
								`}
							>
								<SvgImage src={"/logo/github.svg"} size="30px" color="var(--color-black)" />
							</div>
						</FooterLink>
					</div>
				</footer>
			</aside>
			<nav
				css={css`
					position: fixed;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 60px;
					grid-template-columns: 1fr 1fr 1fr;
					background-color: var(--color-green);
					z-index: 999;
					display: none;
					box-shadow: 0px 0px 11px -7px #000000;

					@media (max-width: ${viewSidebarWidth}px) {
						display: grid;
					}
				`}
			>
				<FooterTab href="/" icon="home">
					トップ
				</FooterTab>
				<FooterTab href="/store" icon="store">
					お店検索
				</FooterTab>
				<FooterTab href="/chain" icon="local_convenience_store">
					チェーン店検索
				</FooterTab>
			</nav>
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
					opacity: ${sidebarOpen ? 1 : 0};
					user-select: ${sidebarOpen ? "auto" : "none"};
					pointer-events: ${sidebarOpen ? "auto" : "none"};
				`}
			/>
		</>
	);
}
