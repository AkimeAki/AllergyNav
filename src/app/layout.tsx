/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @next/next/no-page-custom-font */
import "@akimeaki/reset-css";
import "@/globals.scss";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { KumaRegistry } from "@kuma-ui/next-plugin/registry";
import { seoHead } from "@/libs/seo";

export const metadata: Metadata = seoHead({
	canonicalPath: ""
});

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<html lang="ja">
			<head>
				<meta name="theme-color" content="#fc9e82" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
				/>
				{process.env.NODE_ENV === "production" && process.env.MAINTENANCE === "false" && (
					<>
						<script
							dangerouslySetInnerHTML={{
								__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
								new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
								'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
								})(window,document,'script','dataLayer','GTM-523PDB8H');`
							}}
						/>
					</>
				)}
				{process.env.NODE_ENV === "production" && process.env.MAINTENANCE === "false" && (
					<script
						async
						src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6914867149724943"
						crossOrigin="anonymous"
					/>
				)}
			</head>
			<body>
				{process.env.NODE_ENV === "production" && process.env.MAINTENANCE === "false" && (
					<noscript>
						<iframe
							src="https://www.googletagmanager.com/ns.html?id=GTM-523PDB8H"
							height="0"
							width="0"
							style={{ display: "none", visibility: "hidden" }}
						/>
					</noscript>
				)}
				{process.env.MAINTENANCE === "false" && <KumaRegistry>{children}</KumaRegistry>}
				{process.env.MAINTENANCE === "true" && <p>メンテナンス中です。</p>}
			</body>
		</html>
	);
}
