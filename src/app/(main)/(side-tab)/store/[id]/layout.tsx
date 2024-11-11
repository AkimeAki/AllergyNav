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
			<div
				className={css`
					display: none;

					@media (max-width: 880px) {
						display: block;
					}
				`}
			>
				<MainTitle>{storeDetail.name}</MainTitle>
			</div>
			<StoreDetailTabs storeId={storeDetail.id} />
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
				`}
			>
				<div
					className={css`
						@media (max-width: 880px) {
							display: none;
						}
					`}
				>
					<MainTitle>{storeDetail.name}</MainTitle>
				</div>
				<div>{children}</div>
			</div>
		</>
	);
}
