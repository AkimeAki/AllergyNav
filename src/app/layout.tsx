/* eslint-disable @next/next/no-page-custom-font */
import "@/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { KumaRegistry } from "@kuma-ui/next-plugin/registry";

export const metadata: Metadata = {
	title: {
		default: "アレルギーナビ｜アレルギーの方向けの飲食店情報サービス",
		template: "%s｜アレルギーナビ｜アレルギーの方向けの飲食店情報サービス"
	},
	description: ""
};

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<html lang="ja">
			<head>
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#fc9e82" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link
					href="https://fonts.googleapis.com/css2?family=BIZ+UDGothic:wght@400;700&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=swap"
					rel="stylesheet"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
				/>
				<link rel="icon" href="/favicon.png"></link>
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6914867149724943"
					crossOrigin="anonymous"
				/>
				{/* eslint-disable-next-line react/jsx-no-comment-textnodes, @next/next/next-script-for-ga */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
								new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
								'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
								})(window,document,'script','dataLayer','GTM-523PDB8H');`
					}}
				/>
			</head>
			<body>
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-523PDB8H"
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
					/>
				</noscript>
				<KumaRegistry>{children}</KumaRegistry>
			</body>
		</html>
	);
}
