import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = seoHead({
	title: "設定",
	canonicalPath: "/user/settings"
});

export default async function (): Promise<JSX.Element> {
	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 30px;
				width: 100%;
			`}
		>
			<Link href="/recovery">パスワードを変更</Link>
		</div>
	);
}
