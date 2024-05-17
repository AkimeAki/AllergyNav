import { getStores } from "@/libs/server-fetch";
import type { MetadataRoute } from "next";

const siteUrl = "https://allergy-navi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticList = [
		{
			url: `${siteUrl}/`
		},
		{
			url: `${siteUrl}/store`
		},
		{
			url: `${siteUrl}/login`
		},
		{
			url: `${siteUrl}/register`
		}
	];

	const storeList = (await getStores())
		.map((store) => {
			return [
				{
					url: `${siteUrl}/store/${store.id}`
				},
				{
					url: `${siteUrl}/store/${store.id}/menu`
				},
				{
					url: `${siteUrl}/store/${store.id}/picture`
				},
				{
					url: `${siteUrl}/store/${store.id}/comment`
				}
			];
		})
		.flat();

	return [...staticList, ...storeList];
}
