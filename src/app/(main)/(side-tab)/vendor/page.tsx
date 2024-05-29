import MainTitle from "@/components/atoms/MainTitle";
import VendorListSidebar from "@/components/organisms/VendorListSidebar";
import VendorList from "@/components/templates/VendorList";
import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";

export const metadata: Metadata = seoHead({
	title: "自販機一覧",
	description:
		"自販機一覧ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。"
});

export default function (): JSX.Element {
	return (
		<>
			<VendorListSidebar />
			<div
				className={css`
					position: relative;
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				<MainTitle>自販機一覧</MainTitle>
				<VendorList />
			</div>
		</>
	);
}
