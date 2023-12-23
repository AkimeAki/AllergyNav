import { notFound } from "next/navigation";
import { safeNumber } from "@/libs/trans-type";
import TabWrapper from "@/components/organisms/TabWrapper";
import TabLink from "@/components/molecules/TabLink";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import MainTitle from "@/components/atoms/MainTitle";
import type { Store } from "@/type";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	let title = "";

	try {
		const id = safeNumber(params.id);
		if (id === null) {
			throw new Error();
		}

		const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
			method: "GET"
		});

		if (result.status !== 200) {
			throw new Error();
		}

		const response = await result.json();
		title = response.name;
	} catch (e) {
		notFound();
	}

	return {
		title
	};
};

export default async function ({ children, params }: Props): Promise<JSX.Element> {
	const id = safeNumber(params.id);

	if (id === null) {
		notFound();
	}

	let storeDetail: Store | undefined;
	try {
		const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
			method: "GET"
		});

		if (result.status !== 200) {
			throw new Error();
		}

		storeDetail = await result.json();
	} catch (e) {}

	return (
		<>
			<TabWrapper>
				<TabLink href={`/store/${id}`}>お店情報</TabLink>
				<TabLink href={`/store/${id}/menu`}>メニュー</TabLink>
				<TabLink href={`/store/${id}/image`}>写真</TabLink>
				<TabLink href={`/store/${id}/comment`}>コメント</TabLink>
			</TabWrapper>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
				`}
			>
				<MainTitle>{storeDetail !== undefined ? storeDetail.name : "エラーが発生しました"}</MainTitle>
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
