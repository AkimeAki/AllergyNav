import { redirect } from "next/navigation";
import { safeBigInt } from "@/libs/safe-type";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import MainTitle from "@/components/atoms/MainTitle";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import UserTabs from "@/components/organisms/UserTabs";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export const metadata: Metadata = {
	title: "設定"
};

export default async function ({ children }: Props): Promise<JSX.Element> {
	const session = await getServerSession(nextAuthOptions);
	const id = safeBigInt(session?.user?.id);

	if (id === null) {
		redirect("/signin?redirect=/settings");
	}

	return (
		<>
			<UserTabs pageId={id} userId={id} />
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
				`}
			>
				<MainTitle>ユーザー</MainTitle>
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
