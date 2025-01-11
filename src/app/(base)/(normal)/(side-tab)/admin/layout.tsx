import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import AdminTabs from "@/components/organisms/side-tab/AdminTabs";
import SideTabLayout from "@/components/templates/SideTabLayout";
import { getUserData } from "@/libs/get-user-data";
import { seoHead } from "@/libs/seo";
import { Metadata } from "next";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export const generateMetadata = async (): Promise<Metadata> => {
	const { userId, role } = await getUserData();

	if (userId === null || role !== "admin") {
		notFound();
	}

	return seoHead({});
};

export default async function ({ children }: Props): Promise<JSX.Element> {
	const { userId, role } = await getUserData();
	if (userId === null || role !== "admin") {
		notFound();
	}

	return (
		<SideTabLayout sideTabLinks={<AdminTabs />}>
			<h3
				className={css`
					font-size: 25px;
					font-weight: bold;
				`}
			>
				管理画面
			</h3>
			<div>{children}</div>
		</SideTabLayout>
	);
}
