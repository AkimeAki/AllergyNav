import { getUserData } from "@/libs/get-user-data";
import { seoHead } from "@/libs/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = seoHead({
	title: "管理画面",
	canonicalPath: "/admin",
	noIndex: true
});

export default async function (): Promise<JSX.Element> {
	const { userId, role } = await getUserData();

	if (userId === null || role !== "admin") {
		notFound();
	}

	return <div>a</div>;
}
