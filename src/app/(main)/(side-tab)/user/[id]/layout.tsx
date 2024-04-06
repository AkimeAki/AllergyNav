import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import MainTitle from "@/components/atoms/MainTitle";
import UserTabs from "@/components/organisms/UserTabs";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	let title = "";

	try {
		const id = safeString(params.id);
		if (id === null) {
			throw new Error();
		}

		const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
			method: "GET"
		});

		if (result.status !== 200) {
			throw new Error();
		}

		// const response = await result.json();
		title = "ユーザー";
	} catch (e) {
		notFound();
	}

	return {
		title
	};
};

export default async function ({ children, params }: Props): Promise<JSX.Element> {
	const pageId = safeString(params.id);
	const session = await getServerSession(nextAuthOptions);
	const userId = safeString(session?.user?.id);

	if (pageId === null) {
		notFound();
	}

	return (
		<>
			<UserTabs pageId={pageId} userId={userId} />
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
