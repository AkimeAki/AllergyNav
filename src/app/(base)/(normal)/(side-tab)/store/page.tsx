import JsonLD from "@/components/atoms/JsonLD";
import StoreListSidebar from "@/components/organisms/StoreListSidebar";
import { siteTitle, siteUrl } from "@/definition";
import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import { Suspense } from "react";
import Client from "./client";

const title = "アレルギー成分情報が提供されているお店一覧";

export const metadata: Metadata = seoHead({
	title: title,
	description:
		"お店一覧ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。",
	canonicalPath: "/store"
});

export default function (): JSX.Element {
	return (
		<>
			<JsonLD
				jsonld={[
					{
						"@context": "http://schema.org",
						"@type": "BreadcrumbList",
						name: "パンくずリスト",
						itemListElement: [
							{
								"@type": "ListItem",
								position: 1,
								item: {
									"@id": siteUrl,
									name: siteTitle
								}
							},
							{
								"@type": "ListItem",
								position: 2,
								item: {
									"@id": `${siteUrl}/store`,
									name: title
								}
							}
						]
					}
				]}
			/>
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
						margin-top: 60px;
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
					<h2
						className={css`
							font-size: 25px;
							font-weight: bold;
						`}
					>
						{title}
					</h2>
				</div>
				<Suspense>
					<Client />
				</Suspense>
			</div>
		</>
	);
}
