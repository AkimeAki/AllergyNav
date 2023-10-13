/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import HeaderLink from "@/components/atoms/HeaderLink";
import Image from "next/image";

export default function (): JSX.Element {
	return (
		<header
			css={css`
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				background-color: var(--color-orange);
				height: 70px;
				color: white;
				box-shadow: 0px 0px 15px -7px #000000;
				z-index: 99999999;
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
						href="/"
						css={css`
							display: flex;
							align-items: center;
							margin-left: 20px;
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
							アレルギーナビ 超β版
						</div>
					</Link>
				</h1>
				<div
					css={css`
						margin-right: 10px;
						display: flex;
						gap: 20px;
					`}
				>
					<HeaderLink href="/chain">チェーン店一覧</HeaderLink>
					<HeaderLink
						href="/chain/add"
						style={css`
							@media (max-width: 1040px) {
								display: none;
							}
						`}
					>
						チェーン店を追加
					</HeaderLink>
					<HeaderLink href="/store">お店一覧</HeaderLink>
					<HeaderLink
						href="/store/add"
						style={css`
							@media (max-width: 1040px) {
								display: none;
							}
						`}
					>
						お店を追加
					</HeaderLink>
				</div>
			</div>
		</header>
	);
}
