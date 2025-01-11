import { seoHead } from "@/libs/seo";
import type { Metadata } from "next";

export const metadata: Metadata = seoHead({
	title: "管理画面",
	canonicalPath: "/admin",
	noIndex: true
});

export default async function (): Promise<JSX.Element> {
	return <div>a</div>;
}
