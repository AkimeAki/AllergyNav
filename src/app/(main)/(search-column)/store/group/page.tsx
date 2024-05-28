import SubTitle from "@/components/atoms/SubTitle";
import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";

export const metadata: Metadata = seoHead({
	title: "お店のグループ一覧",
	description:
		"お店のグループ一覧ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。"
});

export default function (): JSX.Element {
	return (
		<div
			className={css`
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 20px;
			`}
		>
			<SubTitle>お店のグループ一覧</SubTitle>
			<div>未実装</div>
		</div>
	);
}
