import { getUserData } from "@/libs/get-user-data";
import { notFound } from "next/navigation";

export const runtime = "edge";

export default async function (): Promise<JSX.Element> {
	const { userId, role } = await getUserData();

	if (userId === null || role !== "admin") {
		notFound();
	}

	return <div>a</div>;
}
