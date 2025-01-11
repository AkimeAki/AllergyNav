import { siteUrl } from "@/definition";
import { serverApiFetch } from "@/libs/server-fetch";
import { GetStoresResponse } from "@/type";
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

	let storeList: {
		url: string;
	}[] = [];
	const storeListResult = await serverApiFetch<GetStoresResponse>("/store");
	if (storeListResult !== null) {
		storeList = storeListResult.data
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
	}

	return [...staticList, ...storeList];
}
