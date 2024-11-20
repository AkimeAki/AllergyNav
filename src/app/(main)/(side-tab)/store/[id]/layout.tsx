import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import MainTitle from "@/components/atoms/MainTitle";
import StoreDetailTabs from "@/components/organisms/StoreDetailTabs";
import { getStore } from "@/libs/server-fetch";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";

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
					width: 100%;
					overflow-x: hidden;
				`}
			>
				<div
					className={css`
						display: none;

						body[data-swipe-loading="true"] & {
							display: block;
						}
					`}
				>
					<LoadingCircleCenter />
				</div>
				<div
					id="side-tab-contents"
					className={css`
						display: flex;
						flex-direction: column;
						gap: 30px;
						transition-duration: 100ms;
						transition-property: transform;
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
			</div>
		</>
	);
}
