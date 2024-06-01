import MainTitle from "@/components/atoms/MainTitle";
import StoreListSidebar from "@/components/organisms/StoreListSidebar";
import StoreList from "@/components/templates/StoreList";
import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";

export const metadata: Metadata = seoHead({
	title: "お店一覧",
	description:
		"お店一覧ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。"
});

export default function (): JSX.Element {
	return (
		<>
			<StoreListSidebar />
			<div
				className={css`
					position: relative;
					display: flex;
					flex-direction: column;
					gap: 20px;
					@media (max-width: 880px) {
						margin-top: 30px;
					}
				`}
			>
				<MainTitle>お店一覧</MainTitle>
				<StoreList />
			</div>
		</>
	);
}
