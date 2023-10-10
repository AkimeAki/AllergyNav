/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import HeaderLink from "@/components/atoms/HeaderLink";

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
				<h1>
					<Link
						href="/"
						css={css`
							margin-left: 20px;
							font-size: 20px;
							color: white;
							text-decoration: none;
							font-weight: 700;
						`}
					>
						アレルギーナビ 超β版
					</Link>
				</h1>
				<div
					css={css`
						margin-right: 20px;
						display: flex;
						gap: 20px;
					`}
				>
					<HeaderLink href="/chain">チェーン店一覧</HeaderLink>
					<HeaderLink href="/store">お店一覧</HeaderLink>
					<HeaderLink href="/store/add">お店を追加</HeaderLink>
				</div>
			</div>
		</header>
	);
}
