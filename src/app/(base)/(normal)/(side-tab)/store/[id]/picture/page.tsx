import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import StorePictureList from "@/components/templates/StorePictureList";
import type { Metadata } from "next";
import { getStore } from "@/libs/server-fetch";
import { seoHead } from "@/libs/seo";
import JsonLD from "@/components/atoms/JsonLD";
import { siteTitle, siteUrl } from "@/definition";

interface Props {
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const storeDetail = await getStore(params.id);

	return seoHead({
		title: `写真 - ${storeDetail.name}`,
		description: `『${storeDetail.name}』の写真ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。`,
		canonicalPath: `/store/${storeDetail.id}/picture`
	});
};

export default async function ({ params }: Props): Promise<JSX.Element> {
	const id = safeString(params.id);
	const storeDetail = await getStore(params.id);

	if (id === null) {
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
									"@id": `${siteUrl}/store/${storeDetail.id}/picture`,
									name: "写真"
								}
							}
						]
					}
				]}
			/>
			<StorePictureList storeId={id} />
		</>
	);
}
