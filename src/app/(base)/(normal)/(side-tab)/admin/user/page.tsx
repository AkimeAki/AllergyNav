import { seoHead } from "@/libs/seo";
import type { Metadata } from "next";

export const metadata: Metadata = seoHead({
	title: "ユーザー管理",
	canonicalPath: "/admin/user",
	noIndex: true
});

export default async function (): Promise<JSX.Element> {
	return <div>a</div>;
}
