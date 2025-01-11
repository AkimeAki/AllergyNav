import JsonLD from "@/components/atoms/JsonLD";
import MenuList from "@/components/templates/MenuList";
import { siteTitle, siteUrl } from "@/definition";
import { seoHead } from "@/libs/seo";
import { serverApiFetch } from "@/libs/server-fetch";
import { GetMenusResponse, GetStoreResponse } from "@/type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const storeDetail = await serverApiFetch<GetStoreResponse>(`/store/${params.id}`);

	if (storeDetail === null) {
		notFound();
	}

	return seoHead({
		title: `アレルギー成分表 - ${storeDetail.name}`,
		description: `『${storeDetail.name}』のアレルギー成分表ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。`,
		canonicalPath: `/store/${storeDetail.id}/menu`
	});
};

export default async function ({ params }: Props): Promise<JSX.Element> {
	const storeDetail = await serverApiFetch<GetStoreResponse>(`/store/${params.id}`);

	if (storeDetail === null) {
		notFound();
	}

	const storeMenus = await serverApiFetch<GetMenusResponse>(`/menu?keywords=&allergens=&storeId=${params.id ?? ""}`);

	if (storeMenus === null) {
		notFound();
	}

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
									name: "お店"
								}
							},
							{
								"@type": "ListItem",
								position: 3,
								item: {
									"@id": `${siteUrl}/store/${storeDetail.id}`,
									name: storeDetail.name
								}
							},
							{
								"@type": "ListItem",
								position: 4,
								item: {
									"@id": `${siteUrl}/store/${storeDetail.id}/menu`,
									name: "アレルギー成分表"
								}
							}
						]
					},
					{
						"@context": "https://schema.org",
						"@type": "FAQPage",
						mainEntity: [
							{
								"@type": "Question",
								name: "記載されているアレルギー成分表は公式情報ですか？",
								acceptedAnswer: {
									"@type": "Answer",
									text: "<p>公式情報ではありません。匿名のユーザーが情報によって集められたデータです。</p>"
								}
							}
						]
					}
				]}
			/>
			<MenuList storeId={storeDetail.id} menuList={storeMenus} />
		</>
	);
}
