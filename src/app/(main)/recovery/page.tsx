import RecoveryForm from "@/components/templates/RecoveryForm";
import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";

export const metadata: Metadata = seoHead({ title: "パスワード再設定", canonicalPath: "/recovery" });

export default async function (): Promise<JSX.Element> {
	return (
		<div
			className={css`
				width: 100%;
				max-width: 500px;
				margin: 0 auto;
			`}
		>
			<div>
				<RecoveryForm />
			</div>
		</div>
	);
}
