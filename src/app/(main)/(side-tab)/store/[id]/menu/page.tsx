import JsonLD from "@/components/atoms/JsonLD";
import MenuList from "@/components/templates/MenuList";
import { siteTitle, siteUrl } from "@/definition";
import { seoHead } from "@/libs/seo";
import { getStore } from "@/libs/server-fetch";
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
								name: siteTitle,
								item: siteUrl
							},
							{
								"@type": "ListItem",
								position: 2,
								name: "お店",
								item: `${siteUrl}/store`
							},
							{
								"@type": "ListItem",
								position: 3,
								name: store.name,
								item: `${siteUrl}/store/${store.id}`
							},
							{
								"@type": "ListItem",
								position: 4,
								name: "アレルギー成分表",
								item: `${siteUrl}/store/${store.id}/menu`
							}
						]
					}
				]}
			/>
			<MenuList storeId={store.id} />
		</>
	);
}
