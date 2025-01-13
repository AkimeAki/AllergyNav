import SmallTitle from "@/components/atoms/SmallTitle";
import { getUserData } from "@/libs/get-user-data";
import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = seoHead({
	title: "設定",
	canonicalPath: "/settings",
	noIndex: true
});

export default async function (): Promise<JSX.Element> {
	const { email } = await getUserData();

	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 30px;
				width: 100%;
			`}
		>
			<div>
				<SmallTitle>パスワード</SmallTitle>
				<Link href="/recovery">パスワードを変更</Link>
			</div>
			<div>
				<SmallTitle>メールアドレス</SmallTitle>
				<p>{email}</p>
				<p>メールアドレス変更機能は現在実装されていません。実装されるまでしばらくお待ち下さい。</p>
			</div>
		</div>
	);
}
