import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import UserTabs from "@/components/organisms/side-tab/UserTabs";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import { seoHead } from "@/libs/seo";
import SideTabLayout from "@/components/templates/SideTabLayout";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	let title = "";
	let userId: null | string = "";

	try {
		userId = safeString(params.id);
		if (userId === null) {
			throw new Error();
		}

		title = "ユーザー";
	} catch (e) {
		notFound();
	}

	return seoHead({
		title,
		canonicalPath: `/user/${userId}`,
		noIndex: true
	});
};

export default async function ({ children, params }: Props): Promise<JSX.Element> {
	const pageId = safeString(params.id);
	const session = await getServerSession(nextAuthOptions);
	const userId = safeString(session?.user?.id);

	if (pageId === null) {
		notFound();
	}

	return (
		<SideTabLayout sideTabLinks={<UserTabs pageId={pageId} userId={userId} />}>
			<h3
				className={css`
					font-size: 25px;
					font-weight: bold;
				`}
			>
				ユーザー
			</h3>
			<div>{children}</div>
		</SideTabLayout>
	);
}
