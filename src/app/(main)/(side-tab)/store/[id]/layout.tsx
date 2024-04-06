import { notFound } from "next/navigation";
import { safeBigInt } from "@/libs/safe-type";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import MainTitle from "@/components/atoms/MainTitle";
import StoreDetailTabs from "@/components/organisms/StoreDetailTabs";
import type { GetStoreResponse } from "@/type";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	let title = "";

	try {
		const id = safeBigInt(params.id);
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
	const id = safeBigInt(params.id);

	if (id === null) {
		notFound();
	}

	let storeDetail: GetStoreResponse = null;
	try {
		const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
			method: "GET"
		});

		if (result.status !== 200) {
			throw new Error();
		}

		storeDetail = (await result.json()) as GetStoreResponse;
	} catch (e) {}

	if (storeDetail === null) {
		notFound();
	}

	return (
		<>
			<StoreDetailTabs storeId={id} />
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
				`}
			>
				<MainTitle>{storeDetail.name}</MainTitle>
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
