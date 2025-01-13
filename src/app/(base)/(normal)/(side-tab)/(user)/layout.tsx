import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import UserTabs from "@/components/organisms/side-tab/UserTabs";
import SideTabLayout from "@/components/templates/SideTabLayout";
import { css } from "@kuma-ui/core";
import { getUserData } from "@/libs/get-user-data";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export default async function ({ children }: Props): Promise<JSX.Element> {
	const { isLogin, userId } = await getUserData();

	if (!isLogin) {
		redirect("/signin?redirect=/settings");
	}

	return (
		<SideTabLayout sideTabLinks={<UserTabs pageId={userId} currentUserId={userId} />}>
			<h3
				className={css`
					font-size: 25px;
					font-weight: bold;
				`}
			>
				マイページ
			</h3>
			<div>{children}</div>
		</SideTabLayout>
	);
}
