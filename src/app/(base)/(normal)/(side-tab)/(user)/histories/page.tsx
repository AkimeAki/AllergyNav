import { seoHead } from "@/libs/seo";
import type { Metadata } from "next";

export const metadata: Metadata = seoHead({
	title: "閲覧履歴",
	canonicalPath: "/histories",
	noIndex: true
});

export default async function (): Promise<JSX.Element> {
	return (
		<div>
			<p>実装をお待ち下さい</p>
		</div>
	);
}
