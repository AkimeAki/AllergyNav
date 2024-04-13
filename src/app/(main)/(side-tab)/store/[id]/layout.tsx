import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import MainTitle from "@/components/atoms/MainTitle";
import StoreDetailTabs from "@/components/organisms/StoreDetailTabs";
import { prisma } from "@/libs/prisma";

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

		const result = await prisma.store.findUnique({
			select: {
				name: true
			},
			where: { id }
		});

		if (result === null) {
			throw new Error();
		}

		title = result.name;
	} catch (e) {
		notFound();
	}

	return {
		title
	};
};

export default async function ({ children, params }: Props): Promise<JSX.Element> {
	const id = safeString(params.id);

	if (id === null) {
		notFound();
	}

	const result = await prisma.store.findUnique({
		select: {
			name: true
		},
		where: { id }
	});

	if (result === null) {
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
				<MainTitle>{result.name}</MainTitle>
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
