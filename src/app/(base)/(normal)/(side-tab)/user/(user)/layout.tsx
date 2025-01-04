import { redirect } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import UserTabs from "@/components/organisms/side-tab/UserTabs";
import SideTabLayout from "@/components/templates/SideTabLayout";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export default async function ({ children }: Props): Promise<JSX.Element> {
	const session = await getServerSession(nextAuthOptions);
	const id = safeString(session?.user?.id);

	if (id === null) {
		redirect("/signin?redirect=/settings");
	}

	return (
		<SideTabLayout sideTabLinks={<UserTabs pageId={id} userId={id} />}>
			<h3>ユーザー</h3>
			<div>{children}</div>
		</SideTabLayout>
	);
}
