import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import AdminTabs from "@/components/organisms/AdminTabs";

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
				<h3>管理画面</h3>
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
