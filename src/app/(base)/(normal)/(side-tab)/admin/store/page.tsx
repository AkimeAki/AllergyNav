import { seoHead } from "@/libs/seo";
import type { Metadata } from "next";

export const metadata: Metadata = seoHead({
	title: "お店管理",
	canonicalPath: "/admin/store",
	noIndex: true
});

export default async function (): Promise<JSX.Element> {
	return <div>a</div>;
}
