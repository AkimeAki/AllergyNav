import JsonLD from "@/components/atoms/JsonLD";
import MenuList from "@/components/templates/MenuList";
import { siteTitle, siteUrl } from "@/definition";
import { seoHead } from "@/libs/seo";
import { getMenus, getStore } from "@/libs/server-fetch";
import type { Metadata } from "next";

interface Props {
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const storeDetail = await getStore(params.id);

	return seoHead({
		title: `アレルギー成分表 - ${storeDetail.name}`,
		description: `『${storeDetail.name}』のアレルギー成分表ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。`,
		canonicalPath: `/store/${storeDetail.id}/menu`
	});
};

export default async function ({ params }: Props): Promise<JSX.Element> {
	const store = await getStore(params.id);
	const menus = await getMenus(params.id);

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
									"@id": `${siteUrl}/store/${store.id}`,
									name: store.name
								}
							},
							{
								"@type": "ListItem",
								position: 4,
								item: {
									"@id": `${siteUrl}/store/${store.id}/menu`,
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
			<MenuList storeId={store.id} menuList={menus} />
		</>
	);
}
