import { redirect } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import MainTitle from "@/components/atoms/MainTitle";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import UserTabs from "@/components/organisms/UserTabs";

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
				<div>{children}</div>
			</div>
		</>
	);
}
