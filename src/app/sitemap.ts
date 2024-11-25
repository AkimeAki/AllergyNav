import { siteUrl } from "@/definition";
import { getStores } from "@/libs/server-fetch";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

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

	const storeList = (await getStores()).data
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
