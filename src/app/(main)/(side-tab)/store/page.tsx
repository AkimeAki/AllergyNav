import MainTitle from "@/components/atoms/MainTitle";
import StoreListSidebar from "@/components/organisms/StoreListSidebar";
import StoreList from "@/components/templates/StoreList";
import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = seoHead({
	title: "お店一覧",
	description:
		"お店一覧ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。",
	canonicalPath: "/store"
});

export default function (): JSX.Element {
	return (
		<>
			<Suspense>
				<StoreListSidebar />
			</Suspense>
			<div
				className={css`
					position: relative;
					display: flex;
					flex-direction: column;
					gap: 20px;
					@media (max-width: 880px) {
						margin-top: 10px;
					}
				`}
			>
				<div
					className={css`
						@media (max-width: 700px) {
							display: none;
						}
					`}
				>
					<MainTitle>お店一覧</MainTitle>
				</div>
				<Suspense>
					<StoreList />
				</Suspense>
			</div>
		</>
	);
}
