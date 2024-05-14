"use client";

import { css } from "@kuma-ui/core";
import FooterLink from "@/components/molecules/FooterLink";
import InstallAppButton from "@/components/atoms/InstallAppButton";
import { usePathname } from "next/navigation";

export default function (): JSX.Element {
	const pathname = usePathname();

	return (
		<>
			<div
				key={pathname}
				className={css`
					margin: 30px auto;

					* {
						width: 780px !important;
					}
				`}
			>
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6914867149724943"
					crossOrigin="anonymous"
				/>
				<ins
					className="adsbygoogle"
					style={{ display: "block" }}
					data-ad-client="ca-pub-6914867149724943"
					data-ad-slot="3013069660"
					data-ad-format="auto"
					data-full-width-responsive="true"
				/>
			</div>
			<footer
				className={css`
					background-color: var(--color-theme-thin);
					padding: 60px 0;

					@media (max-width: 880px) {
						padding-bottom: 140px;
					}
				`}
			>
				<div
					className={css`
						display: flex;
						flex-direction: column;
						justify-content: center;
						gap: 30px;
						height: 100%;
					`}
				>
					<div
						className={css`
							display: inline-block;
							text-align: center;
							color: var(--color-primary);
						`}
					>
						Created by 彩季
					</div>
					<div
						className={css`
							display: flex;
							justify-content: center;
							text-align: center;
							gap: 20px;
						`}
					>
						<FooterLink href="https://twitter.com/Akime_Aki" name="twitter" />
						<FooterLink href="https://twitter.com/Akime_Aki" name="x" />
						<FooterLink href="https://github.com/AkimeAki/AllergyNav" name="github" />
					</div>
					<div
						className={css`
							display: flex;
							justify-content: center;
						`}
					>
						<InstallAppButton>アプリとしてインストール</InstallAppButton>
					</div>
				</div>
			</footer>
		</>
	);
}
