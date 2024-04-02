import { notFound } from "next/navigation";
import { safeNumber } from "@/libs/safe-type";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import MainTitle from "@/components/atoms/MainTitle";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminTabs from "@/components/organisms/AdminTabs";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export const metadata: Metadata = {
	title: {
		default: "管理画面",
		template: "%s｜管理画面｜アレルギーナビ"
	},
	description: ""
};

export default async function ({ children }: Props): Promise<JSX.Element> {
	const session = await getServerSession(nextAuthOptions);
	const id = safeNumber(session?.user?.id);

	if (id === null) {
		notFound();
	}

	return (
		<>
			<AdminTabs />
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
				`}
			>
				<MainTitle>管理画面</MainTitle>
				<div
					className={css`
						padding: 0 10px;
					`}
				>
					{children}
				</div>
			</div>
		</>
	);
}
