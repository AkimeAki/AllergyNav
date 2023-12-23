/* eslint-disable @next/next/no-page-custom-font */
import "@/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: {
		default: "管理画面",
		template: "%s｜管理画面"
	},
	description: ""
};

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return <>{children}</>;
}
