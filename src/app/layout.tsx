/* eslint-disable @next/next/no-page-custom-font */
import "@/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { KumaRegistry } from "@kuma-ui/next-plugin/registry";

export const metadata: Metadata = {
	title: {
		default: "アレルギーナビ",
		template: "%s｜アレルギーナビ"
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
					href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap"
					rel="stylesheet"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
				/>
				<link rel="icon" href="/favicon.png"></link>
			</head>
			<body>
				<KumaRegistry>{children}</KumaRegistry>
			</body>
		</html>
	);
}
