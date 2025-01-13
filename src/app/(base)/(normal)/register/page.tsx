import JsonLD from "@/components/atoms/JsonLD";
import { seoHead } from "@/libs/seo";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Client from "./client";
import { getUserData } from "@/libs/get-user-data";

export const metadata: Metadata = seoHead({ title: "アカウント作成", canonicalPath: "/register" });

export default async function (): Promise<JSX.Element> {
	const { isLogin } = await getUserData();

	if (isLogin) {
		redirect("/");
	}

	return (
		<>
			<JsonLD />
			<Client />
		</>
	);
}
