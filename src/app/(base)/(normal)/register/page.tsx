import JsonLD from "@/components/atoms/JsonLD";
import { seoHead } from "@/libs/seo";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Client from "./client";

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
			<Client />
		</>
	);
}
