import { getUserData } from "@/libs/get-user-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "ユーザー管理"
};

export default async function (): Promise<JSX.Element> {
	const { userId, role } = await getUserData();

	if (userId === null || role !== "admin") {
		notFound();
	}

	return <div>a</div>;
}
