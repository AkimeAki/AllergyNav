import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import MainTitle from "@/components/atoms/MainTitle";
import StoreDetailTabs from "@/components/organisms/StoreDetailTabs";
import { getStore } from "@/libs/server-fetch";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export default async function ({ children, params }: Props): Promise<JSX.Element> {
	const storeDetail = await getStore(params.id);

	return (
		<>
			<StoreDetailTabs storeId={storeDetail.id} />
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
				`}
			>
				<MainTitle>{storeDetail.name}</MainTitle>
				<div>{children}</div>
			</div>
		</>
	);
}
