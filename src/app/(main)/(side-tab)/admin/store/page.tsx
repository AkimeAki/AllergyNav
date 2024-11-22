import { getUserData } from "@/libs/get-user-data";
import { seoHead } from "@/libs/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = seoHead({
	title: "お店管理",
	canonicalPath: "/admin/store"
});

export default async function (): Promise<JSX.Element> {
	const { userId, role } = await getUserData();

	if (userId === null || role !== "admin") {
		notFound();
	}

	return <div>a</div>;
}
