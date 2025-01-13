import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import UserTabs from "@/components/organisms/side-tab/UserTabs";
import { seoHead } from "@/libs/seo";
import SideTabLayout from "@/components/templates/SideTabLayout";
import { getUserData } from "@/libs/get-user-data";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	return seoHead({
		title: "ユーザー",
		canonicalPath: `/user/${params.id}`,
		noIndex: true
	});
};

export default async function ({ children, params }: Props): Promise<JSX.Element> {
	const { userId, isVerified } = await getUserData();

	return (
		<SideTabLayout
			sideTabLinks={<UserTabs pageId={params.id} currentUserId={userId} currentUserVerified={isVerified} />}
		>
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
