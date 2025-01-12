import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = seoHead({ title: "パスワード再設定", canonicalPath: "/recovery", noIndex: true });

export default async function (): Promise<JSX.Element> {
	return (
		<div
			className={css`
				width: 100%;
				max-width: 500px;
				margin: 0 auto;
			`}
		>
			<div>
				<Client />
			</div>
		</div>
	);
}
