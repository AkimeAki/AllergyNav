import { seoHead } from "@/libs/seo";
import { serverApiFetch } from "@/libs/server-fetch";
import { GetMenusResponse } from "@/type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Client from "./client";

export const metadata: Metadata = seoHead({
	title: "お店管理",
	canonicalPath: "/admin/menu",
	noIndex: true
});

export default async function (): Promise<JSX.Element> {
	const storeMenus = await serverApiFetch<GetMenusResponse>(`/menu?keywords=&allergens=&storeId=`);

	if (storeMenus === null) {
		notFound();
	}

	return <Client menuList={storeMenus} />;
}
