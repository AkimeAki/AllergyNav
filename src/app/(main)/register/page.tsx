import JsonLD from "@/components/atoms/JsonLD";
import RegisterForm from "@/components/templates/RegisterForm";
import { seoHead } from "@/libs/seo";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata: Metadata = seoHead({ title: "アカウント作成", canonicalPath: "/register" });

export default async function (): Promise<JSX.Element> {
	const session = await getServerSession();
	const user = session?.user;

	if (user?.email !== undefined && user.email !== null) {
		redirect("/");
	}

	return (
		<>
			<JsonLD />
			<div
				className={css`
					width: 100%;
					max-width: 500px;
					margin: 0 auto;
				`}
			>
				<div>
					<RegisterForm />
				</div>
			</div>
		</>
	);
}
