import JsonLD from "@/components/atoms/JsonLD";
import MainTitle from "@/components/atoms/MainTitle";
import StoreListSidebar from "@/components/organisms/StoreListSidebar";
import StoreList from "@/components/templates/StoreList";
import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = seoHead({
	title: "商品一覧",
	description:
		"商品一覧ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。",
	canonicalPath: "/food"
});

export default function (): JSX.Element {
	return (
		<>
			<JsonLD />
			<Suspense>
				<StoreListSidebar />
			</Suspense>
			<div
				className={css`
					position: relative;
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				<MainTitle>商品一覧</MainTitle>
				<Suspense>
					<StoreList />
				</Suspense>
			</div>
		</>
	);
}
